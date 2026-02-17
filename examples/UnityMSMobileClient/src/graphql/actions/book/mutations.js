import {useMutation} from '@apollo/client';
import {
  DocumentKeys,
  GraphqlPaths,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {
  CREATE_MEMBER_AMOUNT_HISTORY_MUTATION,
  CREATE_SOCIETY_COST_RECORD_MUTATION,
  CREATE_SOCIETY_CREDIT_RECORD_MUTATION,
  DELETE_MEMBER_AMOUNT_HISTORY_MUTATION,
  DELETE_SOCIETY_COST_RECORD_MUTATION,
  DELETE_SOCIETY_CREDIT_RECORD_MUTATION,
  UPDATE_MEMBER_AMOUNT_HISTORY_MUTATION,
  UPDATE_SOCIETY_COST_RECORD_MUTATION,
  UPDATE_SOCIETY_CREDIT_RECORD_MUTATION,
} from '@graphql/mutations/book';
import {
  GET_MEMBER_AMOUNT_HISTORIES_QUERY,
  GET_SOCIETY_AMOUNT_HISTORIES_QUERY,
  GET_SOCIETY_RECORDS_QUERY,
} from '@graphql/queries/book';
import {get} from 'lodash';
import {useSelector} from 'react-redux';

export const useCreateSocietyCreditRecordMutation = () =>
  useMutation(CREATE_SOCIETY_CREDIT_RECORD_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {
          query: GET_SOCIETY_RECORDS_QUERY,
          variables: {
            getSocietyRecordsDto: {},
          },
        },
        cachedSocietyRecords => {
          return {
            [GraphqlPaths.data]: [
              data?.[GraphqlPaths.data],
              ...(cachedSocietyRecords?.[GraphqlPaths.data] || []),
            ],
          };
        },
      );
    },
  });

export const useUpdateSocietyCreditRecordMutation = () =>
  useMutation(UPDATE_SOCIETY_CREDIT_RECORD_MUTATION, {
    update: (cache, {data}) => {
      // Reason : Miss match in __typename
      cache.updateQuery(
        {
          query: GET_SOCIETY_RECORDS_QUERY,
          variables: {
            getSocietyRecordsDto: {},
          },
        },
        cachedSocietyRecords => {
          return {
            [GraphqlPaths.data]: cachedSocietyRecords?.[GraphqlPaths.data]?.map(
              cachedSocietyRecord => {
                if (
                  cachedSocietyRecord._id === data?.[GraphqlPaths.data]?._id
                ) {
                  const response = data?.[GraphqlPaths.data];
                  // Type miss match fixed
                  const modifiedAccounts = response?.accounts
                    ? response.accounts?.map(account => {
                        return account?._id;
                      })
                    : [];
                  return {
                    ...response,
                    accounts: modifiedAccounts,
                    // Miss matching type not updating cache correctly
                    __typename: cachedSocietyRecord.__typename,
                  };
                }
                return cachedSocietyRecord;
              },
            ),
          };
        },
      );
    },
  });

export const useDeleteSocietyCreditRecordMutation = () =>
  useMutation(DELETE_SOCIETY_CREDIT_RECORD_MUTATION, {
    update: (cache, {data}) => {
      const response = data?.[GraphqlPaths.data];
      cache.modify({
        fields: {
          getSocietyRecords(cachedSocietyRecordsRef, {readField}) {
            return cachedSocietyRecordsRef?.filter(recordRef => {
              if (readField(DocumentKeys._id, recordRef) === response?._id) {
                return false;
              }
              return true;
            });
          },
        },
      });
    },
  });

export const useCreateSocietyCostRecordMutation = () =>
  useMutation(CREATE_SOCIETY_COST_RECORD_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {
          query: GET_SOCIETY_RECORDS_QUERY,
          variables: {
            getSocietyRecordsDto: {},
          },
        },
        cachedSocietyRecords => {
          return {
            [GraphqlPaths.data]: [
              data?.[GraphqlPaths.data],
              ...(cachedSocietyRecords?.[GraphqlPaths.data] || []),
            ],
          };
        },
      );
    },
  });

export const useCreateMemberAmountHistoryMutation = () => {
  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];
  const societyId = isMember ? defaultAccount?.society?._id : userId;

  return useMutation(CREATE_MEMBER_AMOUNT_HISTORY_MUTATION, {
    update: (cache, {data}, {variables}) => {
      cache.updateQuery(
        {
          query: GET_MEMBER_AMOUNT_HISTORIES_QUERY,
          variables: {
            getMemberAmountHistoriesDto: {
              societyId,
              accountId: variables?.createMemberAmountHistoryDto?.accountId,
            },
          },
        },
        cachedMemberAmountHistories => {
          return {
            [GraphqlPaths.data]: [
              data?.[GraphqlPaths.data],
              ...(cachedMemberAmountHistories?.[GraphqlPaths.data] || []),
            ],
          };
        },
      );
    },
  });
};

export const useUpdateMemberAmountHistoryMutation = () =>
  useMutation(UPDATE_MEMBER_AMOUNT_HISTORY_MUTATION);

export const useUpdateSocietyCostRecordMutation = () =>
  useMutation(UPDATE_SOCIETY_COST_RECORD_MUTATION, {
    update: (cache, {data}) => {
      // Reason : Miss match in __typename
      cache.updateQuery(
        {
          query: GET_SOCIETY_RECORDS_QUERY,
          variables: {
            getSocietyRecordsDto: {},
          },
        },
        cachedSocietyRecords => {
          return {
            [GraphqlPaths.data]: cachedSocietyRecords?.[GraphqlPaths.data]?.map(
              cachedSocietyRecord => {
                if (
                  cachedSocietyRecord._id === data?.[GraphqlPaths.data]?._id
                ) {
                  const response = data?.[GraphqlPaths.data];
                  // Type miss match fixed
                  const modifiedAccounts = response?.accounts
                    ? response.accounts?.map(account => {
                        return account?._id;
                      })
                    : [];
                  return {
                    ...response,
                    accounts: modifiedAccounts,
                    // Miss matching type not updating cache correctly
                    __typename: cachedSocietyRecord.__typename,
                  };
                }
                return cachedSocietyRecord;
              },
            ),
          };
        },
      );
    },
  });

export const useDeleteSocietyCostRecordMutation = () =>
  useMutation(DELETE_SOCIETY_COST_RECORD_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {
          query: GET_SOCIETY_RECORDS_QUERY,
          variables: {
            getSocietyRecordsDto: {},
          },
        },
        cachedSocietyRecords => {
          return {
            [GraphqlPaths.data]: cachedSocietyRecords?.[
              GraphqlPaths.data
            ]?.filter(cachedSocietyRecord => {
              return cachedSocietyRecord._id !== data?.[GraphqlPaths.data]?._id;
            }),
          };
        },
      );
    },
  });

export const useDeleteMemberAmountHistoryMutation = ({accountId}) => {
  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];
  const societyId = isMember ? defaultAccount?.society?._id : userId;
  return useMutation(DELETE_MEMBER_AMOUNT_HISTORY_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {
          query: GET_MEMBER_AMOUNT_HISTORIES_QUERY,
          variables: {
            getMemberAmountHistoriesDto: {
              societyId,
              accountId,
            },
          },
        },
        cachedMemberAmountHistories => {
          const memberAmountHistories = get(
            cachedMemberAmountHistories,
            GraphqlPaths.data,
            [],
          );
          return {
            [GraphqlPaths.data]: memberAmountHistories?.filter(
              cachedMemberAmountHistory => {
                return (
                  cachedMemberAmountHistory._id !==
                  data?.[GraphqlPaths.data]?._id
                );
              },
            ),
          };
        },
      );
      cache.updateQuery(
        {
          query: GET_SOCIETY_AMOUNT_HISTORIES_QUERY,
          variables: {
            getSocietyAmountHistoriesDto: {accountId, societyId},
          },
        },
        cachedSocietyAmountHistories => {
          const societyAmountHistories = get(
            cachedSocietyAmountHistories,
            GraphqlPaths.data,
            [],
          );
          return {
            [GraphqlPaths.data]: societyAmountHistories?.filter(
              cachedSocietyAmountHistory => {
                return (
                  cachedSocietyAmountHistory._id !==
                  data?.[GraphqlPaths.data]?._id
                );
              },
            ),
          };
        },
      );
    },
  });
};
