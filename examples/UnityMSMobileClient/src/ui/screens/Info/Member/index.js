import {CommonStyles} from '@config/styles';
import {IconSizes, Opacities} from '@constants/numbers';
import {
  AccountKeys,
  GraphqlPaths,
  IconNames,
  IconTypes,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetAccountRecordsQuery} from '@graphql/actions/book/queries';
import {
  useBlockSocietyAccountMutation,
  useUnblockSocietyAccountMutation,
} from '@graphql/actions/member/mutations';
import {useGetMemberAccountWithFullInfoQuery} from '@graphql/actions/member/queries';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import FAB from '@ui/atoms/FAB';
import Text from '@ui/atoms/Text';
import DialogBox from '@ui/components/DialogBox';
import JoinSocietyCard from '@ui/components/JoinSocietyCard';
import MemberArrearsCard from '@ui/components/MemberArrearsCard';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import NetworkIconButton from '@ui/components/NetworkIconButton';
import MemberRecordCard from '@ui/components/RecordCard/Member';
import {bracket, returnFuncIfCondition} from '@utils';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const MemberInfo = props => {
  const {t} = useTranslation();
  const {
    navigation,
    accountId: accountIdFromProps,
    societyId: societyIdFromProps,
    route,
  } = props;
  const params = route?.params;
  const accountIdFromParams = params?.accountId;
  const societyIdFromParams = params?.societyId;
  // MemberInfo is a reusable component for member and society to view account info
  const accountId = accountIdFromProps || accountIdFromParams;
  const societyId = societyIdFromProps || societyIdFromParams;

  const {colors} = useTheme();
  const [showDialog, setShowDialog] = useState(false);
  const auth = useSelector(state => state.auth);
  const userType = auth[UserKeys.userType];
  const isSociety = userType === UserTypes.Society;

  const {onRefresh: onRefreshParentFunc} = props;
  const [
    getMemberAccountWithFullInfoQuery,
    {
      loading: isGetMemberAccountWithFullInfoQueryLoading,
      data: getMemberAccountWithFullInfoData,
      refetch: refetchMemberAccountWithFullInfoQuery,
    },
  ] = useGetMemberAccountWithFullInfoQuery();

  const [
    getAccountRecordsQuery,
    {
      loading: isGetAccountRecordsQueryLoading,
      data: getAccountRecordsData,
      refetch: refetchAccountRecordsQuery,
      fetchMore: fetchMoreAccountRecordsQuery,
    },
  ] = useGetAccountRecordsQuery();

  const [blockSocietyAccountMutation, {loading: isBlockSocietyAccountLoading}] =
    useBlockSocietyAccountMutation(societyId);

  const [
    unblockSocietyAccountMutation,
    {loading: isUnblockSocietyAccountLoading},
  ] = useUnblockSocietyAccountMutation(societyId);

  const {onEndReached, isPageLoading, onReloadPage} = usePagination(
    fetchMoreAccountRecordsQuery,
    undefined,
    Boolean(accountId && societyId),
  );

  useEffect(() => {
    if (accountId && societyId) {
      getMemberAccountWithFullInfoQuery({
        variables: {
          getMemberAccountDto: {accountId, societyId},
        },
        // fetchPolicy: fetchPolicyValues.networkOnly,
      });
      getAccountRecordsQuery({
        variables: {
          getAccountRecordsDto: {accountId, societyId},
        },
      });
    }
  }, [accountId, societyId]);

  const accountInfo = get(getMemberAccountWithFullInfoData, GraphqlPaths.data);
  const blocked = get(accountInfo, AccountKeys.blocked);
  console.log({blocked, accountInfo});

  useEffect(() => {
    if (navigation && isSociety) {
      navigation.setOptions({
        headerRight: () =>
          blocked ? (
            <NetworkIconButton
              iconStyle={[
                {fontSize: IconSizes.normal, color: CommonColors.green},
                CommonStyles.bigMarginRight,
              ]}
              indicatorStyle={[CommonStyles.bigMarginRight]}
              loading={
                isUnblockSocietyAccountLoading ||
                isGetMemberAccountWithFullInfoQueryLoading
              }
              iconType={IconTypes.MaterialCommunityIcons}
              iconName={IconNames.accountReactivate}
              onPress={onConfirmBlockMember}
            />
          ) : (
            <NetworkIconButton
              iconStyle={[
                {fontSize: IconSizes.normal, color: colors.error},
                CommonStyles.bigMarginRight,
              ]}
              indicatorStyle={[CommonStyles.bigMarginRight]}
              loading={
                isBlockSocietyAccountLoading ||
                isGetMemberAccountWithFullInfoQueryLoading
              }
              iconType={IconTypes.EntypoIcon}
              iconName={IconNames.block}
              onPress={onToggleBlockOrUnBlockMember}
            />
          ),
      });
    }
  }, [
    navigation,
    isSociety,
    onToggleBlockOrUnBlockMember,
    isBlockSocietyAccountLoading,
    isGetMemberAccountWithFullInfoQueryLoading,
    isUnblockSocietyAccountLoading,
    blocked,
  ]);

  // For some ui optimization when user kicked out by society
  const records =
    accountId && get(getAccountRecordsData, GraphqlPaths.data, []);

  if (records) console.log({component: MemberInfo.name, records});

  const onToggleBlockOrUnBlockMember = () => {
    setShowDialog(prevState => !prevState);
  };

  const onConfirmBlockMember = () => {
    if (blocked) {
      unblockSocietyAccountMutation({
        variables: {
          unblockSocietyAccountDto: {
            accountId,
          },
        },
      });
    } else {
      blockSocietyAccountMutation({
        variables: {
          blockSocietyAccountDto: {
            accountId,
          },
        },
      });
    }
  };

  return (
    <>
      <NetworkFlatList
        contentContainerStyle={[
          CommonStyles.bigPaddingTop,
          CommonStyles.bigPaddingHorizontal,
        ]}
        data={records}
        refetch={() => {
          onRefreshParentFunc?.();
          returnFuncIfCondition(() => {
            refetchMemberAccountWithFullInfoQuery();
            refetchAccountRecordsQuery();
            onReloadPage();
          }, accountId)?.();
        }}
        loading={
          isGetMemberAccountWithFullInfoQueryLoading ||
          isGetAccountRecordsQueryLoading
        }
        ListHeaderComponent={
          !!accountId && accountInfo ? (
            <>
              <MemberArrearsCard
                navigation={navigation}
                account={accountInfo}
                isSociety={isSociety}
              />
              {!isGetAccountRecordsQueryLoading && (
                <Text
                  style={[
                    TypographyStyles.title1,
                    {fontWeight: FontWeights.bold},
                    CommonStyles.bigMarginVertical,
                  ]}>
                  {t('Recent records')}
                </Text>
              )}
            </>
          ) : (
            // Join button after fetching default account
            !isGetMemberAccountWithFullInfoQueryLoading &&
            bracket(
              !isSociety ? (
                <JoinSocietyCard {...props} />
              ) : (
                <Text
                  style={[
                    TypographyStyles.body1,
                    {color: colors.primaryDark, opacity: Opacities.half},
                  ]}>
                  {t(
                    'Something went wrong, Please check your internet/visit this page after sometime',
                  )}
                </Text>
              ),
            )
          )
        }
        emptyMessage={accountId && accountInfo && t('No records')}
        renderItem={({item: record}) => {
          // Need to modify this for member
          return <MemberRecordCard {...props} record={record} />;
        }}
        isPageLoading={isPageLoading}
        onEndReached={onEndReached}
        delay
      />
      {isSociety && !blocked && (
        <FAB
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditRecord, {
              record: {
                accounts: [accountId],
              },
            });
          }}
        />
      )}
      <DialogBox
        showDialog={showDialog}
        onHideDialog={onToggleBlockOrUnBlockMember}
        onRightPress={onConfirmBlockMember}
        rightTextStyle={{color: blocked ? CommonColors.green : colors.error}}
        title={blocked ? t('Activate!!!') : t('Caution!!!')}>
        <Text
          style={[
            CommonStyles.bigMarginHorizontal,
            CommonStyles.smallMarginBottom,
          ]}>
          {blocked
            ? t('Do you really wanna re activate this member?')
            : t('Do you really wanna block this member?')}
        </Text>
      </DialogBox>
    </>
  );
};

export default MemberInfo;
