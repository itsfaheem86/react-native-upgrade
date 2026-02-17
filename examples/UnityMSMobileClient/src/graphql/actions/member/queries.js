import {useLazyQuery} from '@apollo/client';
import {
  GET_MEMBER_ACCOUNTS_QUERY,
  GET_MEMBER_ACCOUNT_WITH_FULL_INFO_QUERY,
} from '@graphql/queries/member';

export const useGetMemberAccountsQuery = () =>
  useLazyQuery(GET_MEMBER_ACCOUNTS_QUERY);

export const useGetMemberAccountWithFullInfoQuery = () =>
  useLazyQuery(GET_MEMBER_ACCOUNT_WITH_FULL_INFO_QUERY);
