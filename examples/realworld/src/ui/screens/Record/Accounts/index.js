import {CommonStyles} from '@config/styles';
import {GraphqlPaths, UserKeys} from '@constants/strings';
import {useGetSocietyRecordQuery} from '@graphql/actions/book/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import RecordAccountCard from '@ui/components/RecordAccountCard';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const RecordAccounts = props => {
  const {route} = props;
  const {params} = route;
  const recordId = params?.recordId;
  const auth = useSelector(state => state?.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const {t} = useTranslation();

  const [
    getSocietyRecordQuery,
    {
      loading: isGetSocietyRecordQueryLoading,
      data: getSocietyRecordData,
      refetch: refetchSocietyRecordQuery,
    },
  ] = useGetSocietyRecordQuery();

  useEffect(() => {
    getSocietyRecordQuery({
      variables: {
        getSocietyRecordDto: {
          recordId,
          societyId: defaultAccount?.society?._id,
        },
      },
    });
  }, []);

  const recordInfo = get(getSocietyRecordData, GraphqlPaths.data);
  console.log({component: RecordAccounts.name, recordInfo});
  return (
    <NetworkFlatList
      contentContainerStyle={[
        CommonStyles.bigPaddingTop,
        CommonStyles.bigPaddingHorizontal,
      ]}
      ListHeaderComponent={
        !isGetSocietyRecordQueryLoading && (
          <Text
            style={[
              TypographyStyles.title1,
              {fontWeight: FontWeights.bold},
              CommonStyles.bigMarginBottom,
            ]}>
            {t('Accounts')}
          </Text>
        )
      }
      data={recordInfo?.accounts}
      loading={isGetSocietyRecordQueryLoading}
      emptyMessage={t('No accounts')}
      refetch={refetchSocietyRecordQuery}
      renderItem={({item: account}) => {
        return (
          <RecordAccountCard {...props} account={account} record={recordInfo} />
        );
      }}
      delay
    />
  );
};

export default RecordAccounts;
