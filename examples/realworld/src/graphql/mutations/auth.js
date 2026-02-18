import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';

export const SIGNUP_MEMBER_MUTATION = gql`
  mutation signUpMember($signUpMemberDto: SignUpMemberDto!) {
    ${GraphqlPaths.data}: signUpMember(signUpMemberDto: $signUpMemberDto) {
      _id
    }
  }
`;

export const SIGNUP_SOCIETY_MUTATION = gql`
  mutation signUpSociety($signUpSocietyDto: SignUpSocietyDto!) {
    ${GraphqlPaths.data}: signUpSociety(signUpSocietyDto: $signUpSocietyDto) {
      _id
    }
  }
`;

export const REQUEST_MEMBER_PASSWORD_RESET_MUTATION = gql`
  mutation requestMemberPasswordReset($requestResetMemberPasswordDto: RequestResetMemberPasswordDto!) {
    ${GraphqlPaths.data}: requestMemberPasswordReset(requestResetMemberPasswordDto: $requestResetMemberPasswordDto) {
      message
    }
  }
`;

export const REQUEST_SOCIETY_PASSWORD_RESET_MUTATION = gql`
  mutation requestSocietyPasswordReset($requestResetSocietyPasswordDto: RequestResetSocietyPasswordDto!) {
    ${GraphqlPaths.data}: requestSocietyPasswordReset(requestResetSocietyPasswordDto: $requestResetSocietyPasswordDto) {
      message
    }
  }
`;

export const RESET_MEMBER_PASSWORD_MUTATION = gql`
  mutation resetMemberPassword($resetMemberPasswordDto: ResetMemberPasswordDto!) {
    ${GraphqlPaths.data}: resetMemberPassword(resetMemberPasswordDto: $resetMemberPasswordDto) {
      message
    }
  }
`;

export const RESET_SOCIETY_PASSWORD_MUTATION = gql`
  mutation resetSocietyPassword($resetSocietyPasswordDto: ResetSocietyPasswordDto!) {
    ${GraphqlPaths.data}: resetSocietyPassword(resetSocietyPasswordDto: $resetSocietyPasswordDto) {
      message
    }
  }
`;

export const UPDATE_MESSAGE_TOKEN_MUTATION = gql`
  mutation updateMessageToken($token: String!) {
    ${GraphqlPaths.data}: updateMessageToken(token: $token) {
      message
    }
  }
`;

export const UPDATE_LAST_SEEN_MUTATION = gql`
  mutation updateLastSeen {
    ${GraphqlPaths.data}: updateLastSeen {
      message
    }
  }
`;
