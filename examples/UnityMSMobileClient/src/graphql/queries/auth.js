import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_AUTH_FRAGMENT,
  COMMON_MEMBER_FRAGMENT,
  COMMON_SOCIETY_FRAGMENT,
} from './common';

export const SIGNIN_MEMBER_QUERY = gql`
  query signInMember($signInMemberDto: SignInMemberDto!) {
    ${GraphqlPaths.data}: signInMember(signInMemberDto: $signInMemberDto) {
      ...CommonAuthFields
    }
  }
  ${COMMON_AUTH_FRAGMENT}
`;

export const VERIFY_MEMBER_PASSWORD_RESET_TOKEN_QUERY = gql`
  query verifyMemberPasswordResetToken($verifyMemberPasswordResetTokenDto: VerifyMemberPasswordResetTokenDto!) {
    ${GraphqlPaths.data}: verifyMemberPasswordResetToken(verifyMemberPasswordResetTokenDto: $verifyMemberPasswordResetTokenDto)
  }
`;

export const VERIFY_SOCIETY_PASSWORD_RESET_TOKEN_QUERY = gql`
  query verifySocietyPasswordResetToken($verifySocietyPasswordResetTokenDto: VerifySocietyPasswordResetTokenDto!) {
    ${GraphqlPaths.data}: verifySocietyPasswordResetToken(verifySocietyPasswordResetTokenDto: $verifySocietyPasswordResetTokenDto)
  }
`;

export const SIGNIN_SOCIETY_QUERY = gql`
  query signInSociety($signInSocietyDto: SignInSocietyDto!) {
    ${GraphqlPaths.data}: signInSociety(signInSocietyDto: $signInSocietyDto) {
      ...CommonAuthFields
    }
  }
  ${COMMON_AUTH_FRAGMENT}
`;

export const GET_ME_QUERY = gql`
  query {
    ${GraphqlPaths.data}: getMe {
      ... on Member {
        ...CommonMemberFields
      }
      ... on Society {
        ...CommonSocietyFields
      }
      __typename
    }
  }
  ${COMMON_MEMBER_FRAGMENT}
  ${COMMON_SOCIETY_FRAGMENT}
`;
