import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT} from '@graphql/queries/common';

export const SOCIETY_ACCOUNTS_SUBSCRIPTION = gql`
  subscription subscribeSocietyAccounts {
    ${GraphqlPaths.data}: subscribeSocietyAccounts  {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;
