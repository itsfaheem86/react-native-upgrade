import {useMutation} from '@apollo/client';
import {DocumentKeys, GraphqlPaths, UserKeys} from '@constants/strings';
import {
  CREATE_SOCIETY_EVENT_MUTATION,
  DELETE_SOCIETY_EVENT_MUTATION,
  UPDATE_SOCIETY_EVENT_MUTATION,
} from '@graphql/mutations/event';
import {GET_SOCIETY_EVENTS_QUERY} from '@graphql/queries/event';
import {useSelector} from 'react-redux';

export const useCreateSocietyEventMutation = () => {
  const auth = useSelector(state => state.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const societyId = defaultAccount?.society?._id;

  return useMutation(CREATE_SOCIETY_EVENT_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {
          query: GET_SOCIETY_EVENTS_QUERY,
          variables: {
            getSocietyEventsDto: {
              societyId,
            },
          },
        },
        cachedSocietyEvents => {
          return {
            [GraphqlPaths.data]: [
              data?.[GraphqlPaths.data],
              ...(cachedSocietyEvents?.[GraphqlPaths.data] || []),
            ],
          };
        },
      );
    },
  });
};

export const useUpdateSocietyEventMutation = () =>
  useMutation(UPDATE_SOCIETY_EVENT_MUTATION);

export const useDeleteSocietyEventMutation = () =>
  useMutation(DELETE_SOCIETY_EVENT_MUTATION, {
    update: (cache, {data}) => {
      const response = data?.[GraphqlPaths.data];
      cache.modify({
        fields: {
          getSocietyEvents(cachedSocietyEventsRef, {readField}) {
            return cachedSocietyEventsRef?.filter(eventRef => {
              if (readField(DocumentKeys._id, eventRef) === response?._id) {
                return false;
              }
              return true;
            });
          },
        },
      });
    },
  });
