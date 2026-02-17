import {useLazyQuery} from '@apollo/client';
import {
  GET_SOCIETIES_QUERY,
  GET_SOCIETY_ACCOUNTS_QUERY,
  GET_SOCIETY_ACCOUNT_REQUEST_QUERY,
  GET_SOCIETY_BLOCKED_ACCOUNTS_QUERY,
  GET_SOCIETY_COST_TYPES_QUERY,
  GET_SOCIETY_CREDIT_TYPES_QUERY,
  GET_SOCIETY_WITH_FULL_INFO_QUERY,
} from '@graphql/queries/society';

export const useGetSocietiesQuery = () => useLazyQuery(GET_SOCIETIES_QUERY);
export const useGetSocietyWithFullInfoQuery = () =>
  useLazyQuery(GET_SOCIETY_WITH_FULL_INFO_QUERY);
export const useGetSocietyAccountsQuery = () =>
  useLazyQuery(GET_SOCIETY_ACCOUNTS_QUERY);

export const useGetSocietyAccountRequestsQuery = () =>
  useLazyQuery(GET_SOCIETY_ACCOUNT_REQUEST_QUERY);

export const useGetSocietyBlockedAccountsQuery = () =>
  useLazyQuery(GET_SOCIETY_BLOCKED_ACCOUNTS_QUERY);

export const useGetSocietyCreditTypesQuery = () =>
  useLazyQuery(GET_SOCIETY_CREDIT_TYPES_QUERY);

export const useGetSocietyCostTypesQuery = () =>
  useLazyQuery(GET_SOCIETY_COST_TYPES_QUERY);
