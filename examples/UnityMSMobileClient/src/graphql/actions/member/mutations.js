import {useMutation} from '@apollo/client';
import {DocumentKeys, GraphqlPaths, SchemaNames} from '@constants/strings';
import {
  BLOCK_SOCIETY_ACCOUNT_MUTATION,
  DELETE_SOCIETY_ACCOUNT_MUTATION,
  REQUEST_SOCIETY_ACCOUNT_MUTATION,
  UNBLOCK_SOCIETY_ACCOUNT_MUTATION,
  UPDATE_MEMBER_PROFILE_MUTATION,
} from '@graphql/mutations/member';
import {GET_MEMBER_ACCOUNT_WITH_FULL_INFO_QUERY} from '@graphql/queries/member';
import {getReferenceFromSchemaAndId} from '@utils';

export const useRequestSocietyAccountMutation = () =>
  useMutation(REQUEST_SOCIETY_ACCOUNT_MUTATION);

export const useDeleteSocietyAccountMutation = () =>
  useMutation(DELETE_SOCIETY_ACCOUNT_MUTATION, {
    update: (cache, {data}) => {
      const response = data?.[GraphqlPaths.data];
      const deletedRequestAccountId = response?._id;
      cache.evict({
        id: cache.identify({
          __ref: getReferenceFromSchemaAndId(
            SchemaNames.account,
            deletedRequestAccountId,
          ),
        }),
      });
      cache.evict({
        id: cache.identify({
          __ref: getReferenceFromSchemaAndId(
            SchemaNames.accountWithMember,
            deletedRequestAccountId,
          ),
        }),
      });
      cache.modify({
        fields: {
          getSocietyAccounts(cachedSocietyAccountsRef, {readField}) {
            return cachedSocietyAccountsRef?.filter(accountRef => {
              if (
                readField(DocumentKeys._id, accountRef) ===
                deletedRequestAccountId
              ) {
                return false;
              }
              return true;
            });
          },
          getSocietyAccountRequests(cachedSocietyRequestsRef, {readField}) {
            return cachedSocietyRequestsRef?.filter(requestRef => {
              if (
                readField(DocumentKeys._id, requestRef) ===
                deletedRequestAccountId
              ) {
                return false;
              }
              return true;
            });
          },
        },
      });
    },
  });

export const useUpdateMemberProfileMutation = () =>
  useMutation(UPDATE_MEMBER_PROFILE_MUTATION);

export const useBlockSocietyAccountMutation = societyId =>
  useMutation(BLOCK_SOCIETY_ACCOUNT_MUTATION, {
    update: (cache, {data}, {variables}) => {
      const response = data?.[GraphqlPaths.data];
      cache.updateQuery(
        {
          query: GET_MEMBER_ACCOUNT_WITH_FULL_INFO_QUERY,
          variables: {
            getMemberAccountDto: {
              accountId: variables?.blockSocietyAccountDto?.accountId,
              societyId,
            },
          },
        },
        cachedMemberAccountWithFullInfo => {
          return {
            [GraphqlPaths.data]: {
              ...cachedMemberAccountWithFullInfo?.[GraphqlPaths.data],
              ...response,
              __typename:
                cachedMemberAccountWithFullInfo?.[GraphqlPaths.data]
                  ?.__typename,
            },
          };
        },
      );
    },
  });

export const useUnblockSocietyAccountMutation = societyId =>
  useMutation(UNBLOCK_SOCIETY_ACCOUNT_MUTATION, {
    update: (cache, {data}, {variables}) => {
      const response = data?.[GraphqlPaths.data];
      cache.updateQuery(
        {
          query: GET_MEMBER_ACCOUNT_WITH_FULL_INFO_QUERY,
          variables: {
            getMemberAccountDto: {
              accountId: variables?.unblockSocietyAccountDto?.accountId,
              societyId,
            },
          },
        },
        cachedMemberAccountWithFullInfo => {
          return {
            [GraphqlPaths.data]: {
              ...cachedMemberAccountWithFullInfo?.[GraphqlPaths.data],
              ...response,
              __typename:
                cachedMemberAccountWithFullInfo?.[GraphqlPaths.data]
                  ?.__typename,
            },
          };
        },
      );
    },
  });
