import {ApolloClient, ApolloLink, split} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import Config from '@config/config';
import {HeaderKeys, Patterns, ReplaceableTokens} from '@constants/strings';
import {getAuthToken, graphqlErrorsHandler, showDefaultToast} from '@utils';
import {useLogout} from '@utils/hooks';
import {createUploadLink} from 'apollo-upload-client';
import {Kind, OperationTypeNode} from 'graphql';
import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import cache from './cache';

// Graphql server link
const httpLink = createUploadLink({
  uri: Config.graphqlHttpServerUri,
});

// Subscription config
const getSubscriptionClient = tempAuthToken =>
  new SubscriptionClient(Config.graphqlWsServerUri, {
    reconnect: false, // TODO: Make it true if server supports websocket connection
    minTimeout: 55000,
    connectionParams: async () => {
      return {
        [HeaderKeys.authorization]: Patterns.authorizationHeader.replace(
          ReplaceableTokens.bearerToken,
          (await getAuthToken()) || tempAuthToken,
        ),
      };
    },
  });

// Subscription link
const getWsLink = tempAuthToken =>
  new WebSocketLink(getSubscriptionClient(tempAuthToken));

// Attach auth token on each http request
const authLink = tempAuthToken => {
  return setContext(async (_, {headers}) => {
    return {
      headers: {
        ...headers,
        [HeaderKeys.authorization]: Patterns.authorizationHeader.replace(
          ReplaceableTokens.bearerToken,
          (await getAuthToken()) || tempAuthToken,
        ),
      },
    };
  });
};

// Global error handling
const errorLink = onForbiddenCallback =>
  onError(({graphQLErrors, networkError}) => {
    if (networkError && __DEV__) {
      console.log({networkError});
      showDefaultToast({message: networkError?.message});
    }
    if (graphQLErrors) {
      graphqlErrorsHandler(graphQLErrors, onForbiddenCallback);
    }
  });

export const link = ({tempAuthToken, onForbiddenCallback}) =>
  split(
    ({query}) => {
      const def = getMainDefinition(query);
      return (
        def.kind === Kind.OPERATION_DEFINITION &&
        def.operation === OperationTypeNode.SUBSCRIPTION
      );
    },
    getWsLink(tempAuthToken),
    ApolloLink.from([
      /*onSuccess,*/ errorLink(onForbiddenCallback),
      authLink(tempAuthToken),
      httpLink,
    ]),
  );

// onSuccess handler
// const onSuccess = new ApolloLink((operation, forward) => {
//   return forward(operation).map(response => {
//     return response;
//   });
// });

// Combined client
const getApolloClient = ({tempAuthToken, onForbiddenCallback}) =>
  new ApolloClient({
    // link: authLink.concat(httpLink),
    // Splitting request between http and ws
    link: link({tempAuthToken, onForbiddenCallback}),
    // Cache uses ram memory, so that I hope it will be wiped on restart
    cache,
  });

// Single apollo instance generation
const useCustomApolloClient = () => {
  const {token: tempAuthToken} = useSelector(state => state.auth);
  const onForbiddenCallback = () => {
    console.log({called: onForbiddenCallback.name, logout});
    logout();
  };
  const apolloRef = useRef();
  // Initialize only one time
  if (!apolloRef.current) {
    console.log({hook: useCustomApolloClient.name, tempAuthToken});
    apolloRef.current = getApolloClient({tempAuthToken, onForbiddenCallback});
  }
  const logout = useLogout(apolloRef?.current);
  useEffect(() => {
    // Reset on tempAuthTokenChange
    console.log({hook: useCustomApolloClient.name, tempAuthToken});
    apolloRef.current.setLink(link({tempAuthToken, onForbiddenCallback}));
  }, [tempAuthToken]);
  return apolloRef.current;
};

export default useCustomApolloClient;
