import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_ACCOUNT_WITH_FULL_INFO_FRAGMENT,
  COMMON_ACCOUNT_WITH_SOCIETY_FRAGMENT,
} from './common';

export const GET_MEMBER_ACCOUNTS_QUERY = gql`
  query {
    ${GraphqlPaths.data}: getMemberAccounts {
      ...CommonAccountWithSocietyFields
    }
  }
  ${COMMON_ACCOUNT_WITH_SOCIETY_FRAGMENT}
`;

export const GET_MEMBER_ACCOUNT_WITH_FULL_INFO_QUERY = gql`
  query getMemberAccount($getMemberAccountDto: GetMemberAccountDto!) {
    ${GraphqlPaths.data}: getMemberAccount(getMemberAccountDto: $getMemberAccountDto) {
      ...CommonAccountWithFullInfoFields
    }
  }
  ${COMMON_ACCOUNT_WITH_FULL_INFO_FRAGMENT}
`;
