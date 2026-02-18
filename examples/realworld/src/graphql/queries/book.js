import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_AMOUNT_HISTORY_FRAGMENT,
  COMMON_RECORD_FRAGMENT,
  COMMON_RECORD_WITH_ACCOUNTS_AND_MEMBER_FRAGMENT,
} from './common';

export const GET_SOCIETY_RECORDS_QUERY = gql`
  query getSocietyRecords($getSocietyRecordsDto: GetSocietyRecordsDto!, $paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocietyRecords(getSocietyRecordsDto: $getSocietyRecordsDto, paginationDto: $paginationDto) {
      ...CommonRecordFields
    }
  }
  ${COMMON_RECORD_FRAGMENT}
`;

export const GET_ACCOUNT_RECORDS_QUERY = gql`
  query getAccountRecords($getAccountRecordsDto: GetAccountRecordsDto!, $paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getAccountRecords (getAccountRecordsDto: $getAccountRecordsDto, paginationDto: $paginationDto) {
      ...CommonRecordFields
    }
  }
  ${COMMON_RECORD_FRAGMENT}
`;

export const GET_SOCIETY_RECORD_QUERY = gql`
  query getSocietyRecord($getSocietyRecordDto: GetSocietyRecordDto!) {
    ${GraphqlPaths.data}: getSocietyRecord(getSocietyRecordDto: $getSocietyRecordDto) {
      ...CommonRecordWithAccountsAndMemberFields
    }
  }
  ${COMMON_RECORD_WITH_ACCOUNTS_AND_MEMBER_FRAGMENT}
`;

export const GET_MEMBER_AMOUNT_HISTORIES_QUERY = gql`
  query getMemberAmountHistories($getMemberAmountHistoriesDto: GetMemberAmountHistoriesDto!, $paginationDto: PaginationDto) {
    ${GraphqlPaths.data}: getMemberAmountHistories(getMemberAmountHistoriesDto: $getMemberAmountHistoriesDto, paginationDto: $paginationDto) {
      ...CommonAmountHistoryFields
    }
  }
  ${COMMON_AMOUNT_HISTORY_FRAGMENT}
`;

export const GET_SOCIETY_AMOUNT_HISTORIES_QUERY = gql`
  query getSocietyAmountHistories($getSocietyAmountHistoriesDto: GetSocietyAmountHistoriesDto!, $paginationDto: PaginationDto) {
    ${GraphqlPaths.data}: getSocietyAmountHistories(getSocietyAmountHistoriesDto: $getSocietyAmountHistoriesDto, paginationDto: $paginationDto) {
      ...CommonAmountHistoryFields
    }
  }
  ${COMMON_AMOUNT_HISTORY_FRAGMENT}
`;
