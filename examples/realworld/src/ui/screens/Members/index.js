import {CommonStyles} from '@config/styles';
import {CommonDelays, CommonNumbers, IconSizes} from '@constants/numbers';
import {
  ErrorMessages,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  IconNames,
  KeyboardShouldPersistTypes,
  Patterns,
  ReplaceableTokens,
  UserKeys,
  UserTypes,
  ViewShotResultTypes,
} from '@constants/strings';
import {useGetSocietyAccountsQuery} from '@graphql/actions/society/queries';
// import {useSocietyAccountsSubscription} from '@graphql/actions/society/subscriptions';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import AccountCard from '@ui/components/AccountCard';
import DialogBox from '@ui/components/DialogBox';
import IconButton from '@ui/components/IconButton';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import SearchBar from '@ui/components/SearchBar';
import {bracket, ms, msTill, showDefaultToast} from '@utils';
import {isErrorToastable} from '@utils/error';
import {usePagination, useSearchBar} from '@utils/hooks';
import {chunk, get} from 'lodash';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import {useSelector} from 'react-redux';

const Members = props => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const auth = useSelector(state => state?.auth);
  const viewShotRef = useRef();
  const [showDialog, setShowDialog] = useState(false);
  const [capturingAccountChunk, setCapturingAccountChunk] = useState(null);
  const isCapturing = useRef(false);
  const isAccountChunkAvatarsLoadedRef = useRef(false);
  const accountChunkAvatarLoadedMapRef = useRef({});
  const defaultAccount = auth[UserKeys.defaultAccount];
  const userType = auth?.[UserKeys.userType];
  const isSociety = userType === UserTypes.Society;

  const [
    getSocietyAccountsQuery,
    {
      loading: isGetSocietyAccountsQueryLoading,
      data: getSocietyAccountsData,
      refetch: refetchSocietyAccountsQuery,
      fetchMore: fetchMoreSocietyAccountsQuery,
    },
  ] = useGetSocietyAccountsQuery();

  // Listen to society accounts changes
  // TODO: Uncomment when we have a working websocket connection
  // useSocietyAccountsSubscription();

  const {onEndReached, isPageLoading, onReloadPage, onPausePage, isPageEnd} =
    usePagination(fetchMoreSocietyAccountsQuery);
  const {onChangeFilters} = useSearchBar(refetchSocietyAccountsQuery);

  useEffect(() => {
    console.log({component: Members.name, defaultAccount});
    getSocietyAccountsQuery({
      variables: {
        getSocietyAccountsDto: {
          societyId: defaultAccount?.society?._id,
        },
      },
    });
  }, [defaultAccount]);

  const accounts = get(getSocietyAccountsData, GraphqlPaths.data, [])?.filter(
    account => account?.active,
  );
  console.log({component: Members.name, accounts});
  const estimatedTotalAccountsCount = accounts?.length || CommonNumbers.zero;

  const onAvatarLoadEnd = id => {
    accountChunkAvatarLoadedMapRef.current[id] = true;
    isAccountChunkAvatarsLoadedRef.current = !Object.values(
      accountChunkAvatarLoadedMapRef.current,
    ).includes(false);
    if (!isAccountChunkAvatarsLoadedRef.current) {
      console.log({
        component: Members.name,
        isAccountAvatarLoaded: isAccountChunkAvatarsLoadedRef.current,
        // If we don't destructure it it's console logging updated variables after this console, since it's a useRef
        accountChunkAvatarLoadedMapRef: {
          ...accountChunkAvatarLoadedMapRef.current,
        },
        id,
      });
    }
  };

  const onAvatarError = id => {
    accountChunkAvatarLoadedMapRef.current[id] = true;
    isAccountChunkAvatarsLoadedRef.current = !Object.values(
      accountChunkAvatarLoadedMapRef.current,
    ).includes(false);
    if (!isAccountChunkAvatarsLoadedRef.current) {
      console.log({
        component: Members.name,
        isAccountAvatarLoaded: isAccountChunkAvatarsLoadedRef.current,
        // If we don't destructure it it's console logging updated variables after this console, since it's a useRef
        accountChunkAvatarLoadedMapRef: {
          ...accountChunkAvatarLoadedMapRef.current,
        },
        id,
      });
    }
  };

  const onShareAccountCards = async () => {
    setShowDialog(true);
    isCapturing.current = true;
    const mappedDataUris = {};
    try {
      for (const splittedAccounts of chunk(accounts, CommonNumbers.five)) {
        if (!isCapturing.current) return;
        setCapturingAccountChunk(splittedAccounts);
        isAccountChunkAvatarsLoadedRef.current = false;
        accountChunkAvatarLoadedMapRef.current = {};
        splittedAccounts?.map(account => {
          accountChunkAvatarLoadedMapRef.current[account?._id] = false;
        });
        await msTill(isAccountChunkAvatarsLoadedRef);
        await ms(CommonDelays.small);
        const dataUri = await viewShotRef.current?.capture();
        // Need to validate captured image uri somehow, Let's render it and check if shows continue else recapture.
        if (dataUri)
          mappedDataUris[splittedAccounts[CommonNumbers.zero]?._id] = dataUri;
      }
    } catch (e) {
      console.log({component: Members.name, e});
      // This will show toast if user not shared files
      showDefaultToast({message: e?.message || ErrorMessages.UnknownError});
    } finally {
      setShowDialog(false);
      isCapturing.current = false;
    }
    try {
      if (Object.values(mappedDataUris).length) {
        await ms(CommonDelays.small);
        await Share.open({
          urls: Object.values(mappedDataUris),
          saveToFiles: true,
        });
      }
    } catch (e) {
      console.log({component: Members.name, e});
      if (isErrorToastable(e)) {
        showDefaultToast({message: e?.message || ErrorMessages.UnknownError});
      }
    }
  };

  const isMountLoading = useRef(true); // To prevent SearchBar unmount/destroy on search
  if (!isGetSocietyAccountsQueryLoading && isMountLoading.current) {
    isMountLoading.current = false;
  }

  return (
    <NetworkFlatList
      contentContainerStyle={[
        CommonStyles.bigPaddingTop,
        CommonStyles.bigPaddingHorizontal,
      ]}
      data={accounts}
      loading={isGetSocietyAccountsQueryLoading}
      keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}
      emptyMessage={t('No members')}
      ListHeaderComponent={
        <View style={[CommonStyles.fullFlex]}>
          {!isMountLoading.current && (
            <>
              <SearchBar
                placeholder={t('Search members')}
                style={[CommonStyles.bigMarginBottom]}
                onChangeText={text => {
                  onChangeFilters({query: text});
                  if (text) {
                    onPausePage();
                  } else {
                    onReloadPage();
                  }
                }}
              />
              <View
                style={[
                  CommonStyles.fullFlex,
                  CommonStyles.bigMarginBottom,
                  {
                    flexDirection: FlexDirections.row,
                    alignItems: FlexAlignments.center,
                  },
                ]}>
                <Text
                  style={[
                    TypographyStyles.title1,
                    {fontWeight: FontWeights.bold},
                  ]}>
                  {t('Society members')}
                  {bracket(!isPageEnd && estimatedTotalAccountsCount)
                    ? Patterns.bracketCountPlus.replace(
                        ReplaceableTokens.count,
                        estimatedTotalAccountsCount,
                      )
                    : Patterns.bracketCount.replace(
                        ReplaceableTokens.count,
                        estimatedTotalAccountsCount,
                      )}
                </Text>
                {isSociety && (
                  <IconButton
                    iconStyle={[
                      {fontSize: IconSizes.normal, color: colors.accent},
                    ]}
                    onPress={onShareAccountCards}
                    iconName={IconNames.shareAlt}
                    buttonStyle={[CommonStyles.bigMarginLeft]}
                  />
                )}
              </View>
            </>
          )}
          <DialogBox
            showDialog={showDialog}
            onTouchOutside={() => {}}
            onHideDialog={() => {
              setShowDialog(false);
              isCapturing.current = false;
            }}
            footer={false}>
            <ViewShot
              options={{
                // Cause temp files are deleted if capture multiple images
                result: ViewShotResultTypes.dataUri,
              }}
              ref={viewShotRef}>
              {!!capturingAccountChunk?.length && (
                <View
                  style={[
                    CommonStyles.bigPadding,
                    CommonStyles.normalRadius,
                    {backgroundColor: colors.background},
                  ]}>
                  {capturingAccountChunk?.map((account, i) => {
                    return (
                      <AccountCard
                        key={account?._id}
                        {...props}
                        account={account}
                        isCapturing={true}
                        onAvatarLoadEnd={() => onAvatarLoadEnd(account?._id)}
                        onAvatarError={() => onAvatarError(account?._id)}
                        accountCardStyle={
                          bracket(i + CommonNumbers.one) !==
                            capturingAccountChunk?.length &&
                          CommonStyles.bigMarginBottom
                        }
                      />
                    );
                  })}
                </View>
              )}
            </ViewShot>
          </DialogBox>
        </View>
      }
      refetch={() => {
        refetchSocietyAccountsQuery();
        onReloadPage();
      }}
      renderItem={({item: account}) => {
        return <AccountCard {...props} account={account} />;
      }}
      onEndReached={onEndReached}
      isPageLoading={isPageLoading}
      delay
    />
  );
};

export default Members;
