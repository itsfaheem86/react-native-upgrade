import {useLazyQuery} from '@apollo/client';
import {
  GET_ACCOUNT_RECORDS_QUERY,
  GET_MEMBER_AMOUNT_HISTORIES_QUERY,
  GET_SOCIETY_AMOUNT_HISTORIES_QUERY,
  GET_SOCIETY_RECORDS_QUERY,
  GET_SOCIETY_RECORD_QUERY,
} from '@graphql/queries/book';

export const useGetSocietyRecordsQuery = () =>
  useLazyQuery(GET_SOCIETY_RECORDS_QUERY);

export const useGetAccountRecordsQuery = () =>
  useLazyQuery(GET_ACCOUNT_RECORDS_QUERY);

export const useGetSocietyRecordQuery = () =>
  useLazyQuery(GET_SOCIETY_RECORD_QUERY);

export const useGetMemberAmountHistoriesQuery = () =>
  useLazyQuery(GET_MEMBER_AMOUNT_HISTORIES_QUERY);

export const useGetSocietyAmountHistoriesQuery = () =>
  useLazyQuery(GET_SOCIETY_AMOUNT_HISTORIES_QUERY);
