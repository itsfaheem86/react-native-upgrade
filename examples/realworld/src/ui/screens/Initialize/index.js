import {CommonStyles} from '@config/styles';
import {displayName} from '@constants/app.json';
import {CommonDelays} from '@constants/numbers';
import {
  AuthStates,
  ComponentNames,
  FlexAlignments,
  GraphqlPaths,
  IconNames,
  IconTypes,
  UserKeys,
} from '@constants/strings';
import {useGetMeQuery} from '@graphql/actions/auth/queries';
import {
  pushAckComponents,
  setAuthState,
  setLoggedInUser,
  setUser,
} from '@redux/slices/authSlice';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import NetworkIconButton from '@ui/components/NetworkIconButton';
import {
  getNetworkError,
  getReferenceFromSchemaAndId,
  isNetworkError,
} from '@utils';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';

const Initialize = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state?.auth);
  const ackComponents = auth.ackComponents;
  const [isLoading, setIsLoading] = useState(true);

  // Move it to auth provider and make me cached in apollo
  const [
    _,
    {
      data: getMeData,
      error: getMeError,
      refetch: refetchMe,
      loading: isGetMeLoading,
    },
  ] = useGetMeQuery({notifyOnNetworkStatusChange: true});

  useEffect(() => {
    dispatch(setAuthState(AuthStates.authLoading));
  }, []);

  useEffect(() => {
    console.log({component: Initialize.name, ackComponents});
    // If token initialized and ack by AuthTokenProvider
    if (
      ackComponents?.length &&
      ackComponents.includes(ComponentNames.AuthTokenProvider)
    ) {
      if (ackComponents.includes(ComponentNames.Initialize)) {
        dispatch(setAuthState(AuthStates.authSuccess));
      } else {
        setTimeout(() => {
          setIsLoading(false);
          refetchMe();
        }, CommonDelays.waitRedux);
      }
    }
  }, [ackComponents]);

  useEffect(() => {
    const user = getMeData?.[GraphqlPaths.data];
    if (user) {
      console.log({component: Initialize.name, user});
      // Auth guard will listen to this changes and navigate to relevant pages
      dispatch(
        setUser({
          [UserKeys.userType]: user?.__typename,
          [UserKeys._id]: user?._id,
        }),
      );
      const userRef = getReferenceFromSchemaAndId(user?.__typename, user?._id);
      dispatch(
        setLoggedInUser({
          ref: userRef,
          ...user,
        }),
      );
      // Give time for authGuard to get all dispatched variables
      setTimeout(() => {
        dispatch(pushAckComponents(ComponentNames.Initialize));
      }, CommonDelays.waitRedux);
    }
  }, [getMeData]);

  // We have global handler
  // useEffect(() => {
  //   if (
  //     getGraphqlErrorCode(getMeError?.graphQLErrors?.[CommonIndices.zero]) ===
  //     GraphqlErrorCodes.Forbidden
  //   ) {
  //     dispatch(setAuthState(AuthStates.authFailed));
  //   }
  // }, [getMeError]);

  return (
    <View style={[styles.container, {backgroundColor: colors.primaryDark}]}>
      <Text
        style={[
          TypographyStyles.header,
          CommonStyles.smallMarginBottom,
          {
            color: colors.light,
            fontWeight: FontWeights.bold,
          },
        ]}>
        {displayName}
      </Text>
      {!getMeData && isNetworkError(getMeError) && (
        <Text style={[{color: colors.error}, CommonStyles.smallMarginBottom]}>
          {getNetworkError(getMeError)}
        </Text>
      )}
      <NetworkIconButton
        onPress={() => {
          refetchMe();
        }}
        iconStyle={[{color: colors.light}]}
        iconType={IconTypes.Ionicons}
        iconName={IconNames.sync}
        loading={isGetMeLoading || isLoading}
        label={!isGetMeLoading && isNetworkError(getMeError) && t('Refresh')}
        disabled={isGetMeLoading || !!getMeData}
        buttonStyle={{
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
        }}
      />
    </View>
  );
};

export default Initialize;
