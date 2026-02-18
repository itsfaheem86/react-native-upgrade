import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT,
  COMMON_MEMBER_FRAGMENT,
  COMMON_SOCIETY_WITH_ACCOUNTS_FRAGMENT,
} from '@graphql/queries/common';

export const REQUEST_SOCIETY_ACCOUNT_MUTATION = gql`
  mutation requestSocietyAccount($requestSocietyAccountDto: RequestSocietyAccountDto!) {
    ${GraphqlPaths.data}: requestSocietyAccount(requestSocietyAccountDto: $requestSocietyAccountDto) {
      ...CommonSocietyWithAccountsFields
    }
  }
  ${COMMON_SOCIETY_WITH_ACCOUNTS_FRAGMENT}
`;

export const DELETE_SOCIETY_ACCOUNT_MUTATION = gql`
  mutation deleteSocietyAccount($deleteSocietyAccountDto: DeleteSocietyAccountDto!) {
    ${GraphqlPaths.data}: deleteSocietyAccount(deleteSocietyAccountDto: $deleteSocietyAccountDto) {
      _id
    }
  }
`;

export const BLOCK_SOCIETY_ACCOUNT_MUTATION = gql`
  mutation blockSocietyAccount($blockSocietyAccountDto: BlockSocietyAccountDto!) {
    ${GraphqlPaths.data}: blockSocietyAccount(blockSocietyAccountDto: $blockSocietyAccountDto) {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const UNBLOCK_SOCIETY_ACCOUNT_MUTATION = gql`
  mutation unblockSocietyAccount($unblockSocietyAccountDto: UnblockSocietyAccountDto!) {
    ${GraphqlPaths.data}: unblockSocietyAccount(unblockSocietyAccountDto: $unblockSocietyAccountDto) {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const UPDATE_MEMBER_PROFILE_MUTATION = gql`
  mutation updateMemberProfile($updateMemberProfileDto: UpdateMemberProfileDto!) {
    ${GraphqlPaths.data}: updateMemberProfile(updateMemberProfileDto: $updateMemberProfileDto) {
      ...CommonMemberFields
    }
  }
  ${COMMON_MEMBER_FRAGMENT}
`;
