import Config from '@config/config';
import {CommonDelays, CommonIndices, CommonNumbers} from '@constants/numbers';
import {
  AsyncStorageKeys,
  AuthStates,
  CommonStrings,
  CommonVariableTypes,
  DateFormats,
  GraphqlErrorCodes,
  NotificationChannels,
  Patterns,
  Platforms,
  ReplaceableTokens,
  RouteNames,
  TokenErrorCodes,
} from '@constants/strings';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {capitalize} from 'lodash';
import moment from 'moment';
import {Platform} from 'react-native';
import Toast from 'react-native-root-toast';
import validUrl from 'valid-url';

export const showDefaultToast = ({
  // Named parameters
  message,
  duration,
  position,
  delay,
  onShow,
  onShown,
  onHide,
  onHidden,
  transform = true,
}) => {
  // Can assign it and call Toast.hide(assignedVariable) to close earlier
  return Toast.show(transform ? capitalize(message) : message, {
    duration: duration ?? Toast.durations.LONG,
    position: position ?? Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: delay ?? CommonNumbers.zero,
    onShow: onShow,
    onShown: onShown,
    onHide: onHide,
    onHidden: onHidden,
  });
};

// is equals to func.();
export const invokeIfFunction = func => {
  if (typeof func === CommonVariableTypes.function) {
    func();
  }
};

export const returnFuncIfCondition = (func, condition) => {
  if (!!condition) {
    return func;
  }
};

// (x || y) && z #Preventing prettier from removing brackets
export const bracket = anyExpression => {
  return anyExpression;
};

export const isInputError = graphqlError => {
  const fields = graphqlError?.extensions?.response?.fields;
  return !!fields;
};

export const getGraphqlErrorCode = graphqlError => {
  return graphqlError?.extensions?.code;
};

export const getGraphqlTypeCheckErrors = graphqlError => {
  // This message can be array or single string
  return graphqlError?.extensions?.response?.message;
};

export const graphqlErrorsHandler = (graphqlErrors, onForbiddenCallback) => {
  console.log({graphqlErrors});
  if (graphqlErrors?.length) {
    graphqlErrors.forEach(error => {
      // if (isInputError(error)) {
      // Set input error
      // }
      if (error && !isInputError(error)) {
        if (
          getGraphqlErrorCode(error) === GraphqlErrorCodes.InternalServerError
        ) {
          showDefaultToast({message: error?.message});
        } else if (getGraphqlErrorCode(error) === GraphqlErrorCodes.Forbidden) {
          showDefaultToast({message: error?.message});
          onForbiddenCallback?.();
        } else if (Array.isArray(getGraphqlTypeCheckErrors(error))) {
          // Graphql type check errors
          showDefaultToast({
            message: getGraphqlTypeCheckErrors(error)[CommonIndices.zero],
          });
        } else if (getGraphqlTypeCheckErrors(error)) {
          // If single error comes
          showDefaultToast({
            message: getGraphqlTypeCheckErrors(error),
          });
        } else if (error?.message) {
          showDefaultToast({
            message: error?.message,
          });
        } else {
          showDefaultToast({
            message: getGraphqlErrorCode(error),
            transform: false,
          });
        }
      }
    });
  } else {
    console.log({msg: "Didn't catch anything!", graphqlErrors});
  }
};

export const isNetworkError = error => {
  return !!error?.networkError;
};

export const getNetworkError = error => {
  return error?.networkError?.message;
};

export const getAsyncStoreItemFromKey = async key => {
  return await AsyncStorage.getItem(key);
};

export const setAsyncStoreItemFromKey = async (key, value) => {
  return await AsyncStorage.setItem(key, value);
};

export const removeAsyncStoreItemFromKey = async key => {
  return await AsyncStorage.removeItem(key);
};

// Return stored auth token
export const getAuthToken = async () => {
  try {
    const token = await getAsyncStoreItemFromKey(
      AsyncStorageKeys.authorizationToken,
    );
    return token;
  } catch (e) {
    console.log({e});
    showDefaultToast({message: TokenErrorCodes.GetAuthToken});
    return CommonStrings.empty;
  }
};

export const getAuthTokenByReference = async reference => {
  try {
    const token = await getAsyncStoreItemFromKey(
      Patterns.loggedInUserTokenKey.replace(
        ReplaceableTokens.reference,
        reference,
      ),
    );
    return token;
  } catch (e) {
    console.log({e});
    showDefaultToast({message: TokenErrorCodes.GetAuthTokenByReference});
    return CommonStrings.empty;
  }
};

export const setAuthToken = async token => {
  try {
    await setAsyncStoreItemFromKey(AsyncStorageKeys.authorizationToken, token);
    return true;
  } catch (e) {
    console.log({e});
    showDefaultToast({message: TokenErrorCodes.SetAuthToken});
    return false;
  }
};

export const setAuthTokenByReference = async (reference, token) => {
  try {
    await setAsyncStoreItemFromKey(
      Patterns.loggedInUserTokenKey.replace(
        ReplaceableTokens.reference,
        reference,
      ),
      token,
    );
    return true;
  } catch (e) {
    console.log({e});
    showDefaultToast({message: TokenErrorCodes.SetAuthTokenByReference});
    return false;
  }
};

export const removeAuthToken = async () => {
  try {
    await removeAsyncStoreItemFromKey(AsyncStorageKeys.authorizationToken);
    return true;
  } catch (e) {
    console.log({e});
    showDefaultToast({message: TokenErrorCodes.RemoveAuthToken});
    return false;
  }
};

export const removeAuthTokenByReference = async reference => {
  try {
    await removeAsyncStoreItemFromKey(
      Patterns.loggedInUserTokenKey.replace(
        ReplaceableTokens.reference,
        reference,
      ),
    );
    return true;
  } catch (e) {
    console.log({e});
    showDefaultToast({message: TokenErrorCodes.RemoveAuthTokenByReference});
    return false;
  }
};

export const getRandomRorGorBValue = () => {
  return Math.floor(Math.random() * CommonNumbers.bitMax);
};

export const getRandomColor = () => {
  return Patterns.rgb
    .replace(ReplaceableTokens.r, getRandomRorGorBValue())
    .replace(ReplaceableTokens.g, getRandomRorGorBValue())
    .replace(ReplaceableTokens.b, getRandomRorGorBValue());
};

export const getFormattedCurrency = amount => {
  return Patterns.currency.replace(ReplaceableTokens.amount, amount);
};

export const getMultipliedByString = count => {
  return Patterns.multipliedBy.replace(ReplaceableTokens.count, count);
};

export const getArrearsFromAccount = account => {
  const {cost, credit, paid} = account;
  const costArrears = cost?.total;
  const creditArrears = credit?.total;
  return costArrears + creditArrears - paid;
};

export const getMoneyInHandFromSocietyInfo = societyInfo => {
  // Received money by no accounts linked
  const totalMoneyInHand =
    societyInfo?.credit?.total - societyInfo?.credit?.receivable;
  // Received from member
  const totalMoneyReceived = societyInfo?.received;
  // const totalMoneySpend =
  //   societyInfo?.cost?.total - societyInfo?.cost?.receivable;
  // Even receivables are deducted in money in hand
  const totalMoneySpend = societyInfo?.cost?.total;
  // Total money received - total money spend(expense)
  const moneyInHand = totalMoneyReceived + totalMoneyInHand - totalMoneySpend;
  return moneyInHand;
};

export const getReceivablesFromSocietyInfo = societyInfo => {
  // Total receivables - Total received
  const totalReceivables =
    societyInfo?.credit?.receivable + societyInfo?.cost?.receivable;
  const totalReceived = societyInfo?.received; // Need to get from society info;
  return totalReceivables - totalReceived;
};

// Need to modify to support all devices
export const checkAndRequestRemoteMessageUserPermission = async () => {
  try {
    const authStatus = await messaging().hasPermission();
    let remoteEnabled = false;
    let askPermission =
      messaging.AuthorizationStatus.DENIED ||
      authStatus === messaging.AuthorizationStatus.NOT_DETERMINED;
    remoteEnabled = !askPermission;
    if (askPermission) {
      const auth2Status = await messaging().requestPermission();
      remoteEnabled =
        auth2Status === messaging.AuthorizationStatus.AUTHORIZED ||
        auth2Status === messaging.AuthorizationStatus.PROVISIONAL;
    }
    console.log({remoteEnabled});
    // Even thought it's enabled we need to make sure push notification enabled locally,
    // We only asked permission to get remote message
    return remoteEnabled;
  } catch (e) {
    console.log({e});
    return false;
  }
};

export const checkAndRequestLocalPushNotification = async () => {
  let localEnabled = false;
  const notifeeStatus = await notifee.requestPermission();
  if (notifeeStatus.authorizationStatus === AuthorizationStatus.DENIED) {
    localEnabled = false;
  } else if (
    notifeeStatus.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
  ) {
    localEnabled = false;
  } else if (
    notifeeStatus.authorizationStatus === AuthorizationStatus.AUTHORIZED
  ) {
    localEnabled = true;
  } else if (
    notifeeStatus.authorizationStatus === AuthorizationStatus.PROVISIONAL
  ) {
    localEnabled = true;
  }
  console.log({localEnabled});
  const OS = Platform.OS;
  const isAndroid = OS === Platforms.android;
  if (isAndroid) {
    const channel = NotificationChannels[CommonIndices.zero];
    const channelExist = await notifee.isChannelCreated(channel.id);
    console.log({channelExist});
    if (!channelExist) {
      const channelId = await notifee.createChannel({
        id: channel.id,
        name: channel.name,
      });
      console.log({createdChannel: channelId});
    }
  }
};

export const displayNotifeeNotification = notification => {
  const defaultChannel = NotificationChannels[CommonIndices.zero];
  notifee.displayNotification({
    title: notification?.title,
    body: notification?.body,
    android: {
      channelId: defaultChannel.id,
    },
  });
};

export const getPushNotificationDeviceToken = async () => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (e) {
    console.log({e});
  }
};

export const getFormattedDate = date => {
  return moment(date).format(DateFormats.default);
};

export const getFormattedDateTime = date => {
  return moment(date).format(DateFormats.dateTime);
};

export const getAwsUriFromKey = key => {
  let isValidUri = validUrl.isUri(key);
  return key
    ? isValidUri
      ? key
      : Config.awsS3BucketCloudFrontUri + key
    : CommonStrings.empty;
};

export const getReferenceFromSchemaAndId = (schema, id) => {
  return Patterns.graphqlReference
    .replace(ReplaceableTokens.id, id)
    .replace(ReplaceableTokens.schema, schema);
};

export const ms = delay => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

export const msTill = booleanRef => {
  return new Promise((resolve, _) => {
    const interval = setInterval(() => {
      console.log({function: msTill.name, boolean: booleanRef?.current});
      if (booleanRef?.current) {
        resolve();
        clearInterval(interval);
      }
    }, CommonDelays.small);
  });
};

export const getNavigationScreenFromAuthState = (
  authState,
  canNavigateToInitialize = true,
) => {
  console.log({canNavigateToInitialize, authState});
  if (authState === AuthStates.authSuccess) {
    return RouteNames.SideDrawer;
  } else if (authState === AuthStates.authFailed) {
    return RouteNames.SignIn;
  } else if (bracket(authState === AuthStates.authUnInitialized)) {
    return RouteNames.Initialize; // Need to check canNavigate or not, AuthTokenProviderShould be acknowledged to do it
  }
};

export const getSocietyCumulativeIncomeFromReport = report => {
  return report?.receivedRevenueTotal + report?.amountHistoryTotal;
};

export const getSocietyIncomeFromReport = report => {
  const currentCumulativeIncome = getSocietyCumulativeIncomeFromReport(report);
  const previousMonthCumulativeIncome = report?.prevReport
    ? getSocietyCumulativeIncomeFromReport(report?.prevReport)
    : 0;
  const currentIncome = currentCumulativeIncome - previousMonthCumulativeIncome;
  return currentIncome;
};

export const getSocietyCumulativeReceivablesFromReport = report => {
  return report?.receivablesTotal - report?.amountHistoryTotal;
};

export const getSocietyCumulativeCostFromReport = report => {
  return -report?.costTotal;
};

export const getSocietyCostFromReport = report => {
  const currentCumulativeExpense = getSocietyCumulativeCostFromReport(report);
  const previousMonthCumulativeExpense = report?.prevReport
    ? getSocietyCumulativeCostFromReport(report?.prevReport)
    : 0;
  const currentExpense =
    currentCumulativeExpense - previousMonthCumulativeExpense;
  return currentExpense;
};

export const getSocietyCumulativeMoneyInHandFromReport = report => {
  return (
    report?.receivedRevenueTotal +
    report?.amountHistoryTotal -
    report?.costTotal
  );
};

export const getSocietyMoneyInHandFromReport = report => {
  const currentMonthCumulativeMoneyInHand =
    getSocietyCumulativeMoneyInHandFromReport(report);
  const previousMonthCumulativeMoneyInHand =
    getSocietyCumulativeMoneyInHandFromReport(report?.prevReport);
  const currentMonthMoneyInHand =
    currentMonthCumulativeMoneyInHand - previousMonthCumulativeMoneyInHand;
  return currentMonthMoneyInHand;
};

export const getSocietyCumulativeAssetFromReport = report => {
  const currentMonthCumulativeMoneyInHand =
    getSocietyCumulativeMoneyInHandFromReport(report);
  const currentMonthCumulativeReceivables =
    getSocietyCumulativeReceivablesFromReport(report);
  return currentMonthCumulativeMoneyInHand + currentMonthCumulativeReceivables;
};

export const getMemberCumulativeArrearsFromReport = report => {
  return report?.receivablesTotal - report?.amountHistoryTotal;
};
