import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT,
  COMMON_SOCIETY_WITH_ACCOUNTS_FRAGMENT,
  COMMON_SOCIETY_WITH_FULL_INFO_FRAGMENT,
  COMMON_TYPE_FRAGMENT,
} from './common';

export const GET_SOCIETIES_QUERY = gql`
  query getSocieties($paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocieties(paginationDto: $paginationDto) {
      ...CommonSocietyWithAccountsFields
    }
  }
  ${COMMON_SOCIETY_WITH_ACCOUNTS_FRAGMENT}
`;

export const GET_SOCIETY_WITH_FULL_INFO_QUERY = gql`
  query  getSociety($getSocietyDto: GetSocietyDto!){
    ${GraphqlPaths.data}: getSociety(getSocietyDto: $getSocietyDto) {
      ...CommonSocietyWithFullInfoFields
    }
  }
  ${COMMON_SOCIETY_WITH_FULL_INFO_FRAGMENT}
`;

export const GET_SOCIETY_ACCOUNTS_QUERY = gql`
  query getSocietyAccounts($getSocietyAccountsDto: GetSocietyAccountsDto!, $paginationDto: PaginationDto) {
    ${GraphqlPaths.data}: getSocietyAccounts(
      getSocietyAccountsDto: $getSocietyAccountsDto,
      paginationDto: $paginationDto
    ) {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const GET_SOCIETY_ACCOUNT_REQUEST_QUERY = gql`
  query getSocietyAccountRequests($paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocietyAccountRequests(paginationDto: $paginationDto) {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const GET_SOCIETY_BLOCKED_ACCOUNTS_QUERY = gql`
  query getSocietyBlockedAccounts($paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocietyBlockedAccounts(paginationDto: $paginationDto) {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const GET_SOCIETY_CREDIT_TYPES_QUERY = gql`
  query getSocietyCreditTypes($paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocietyCreditTypes(paginationDto: $paginationDto) {
      ...CommonTypeFields
    }
  }
  ${COMMON_TYPE_FRAGMENT}
`;

export const GET_SOCIETY_COST_TYPES_QUERY = gql`
  query getSocietyCostTypes($paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocietyCostTypes(paginationDto: $paginationDto) {
      ...CommonTypeFields
    }
  }
  ${COMMON_TYPE_FRAGMENT}
`;
