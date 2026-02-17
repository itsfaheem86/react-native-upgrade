import {useLazyQuery} from '@apollo/client';
import {
  GET_ME_QUERY,
  SIGNIN_MEMBER_QUERY,
  SIGNIN_SOCIETY_QUERY,
  VERIFY_MEMBER_PASSWORD_RESET_TOKEN_QUERY,
  VERIFY_SOCIETY_PASSWORD_RESET_TOKEN_QUERY,
} from '@graphql/queries/auth';

export const useSignInMemberQuery = () => useLazyQuery(SIGNIN_MEMBER_QUERY);
export const useSignInSocietyQuery = () => useLazyQuery(SIGNIN_SOCIETY_QUERY);
export const useGetMeQuery = options => useLazyQuery(GET_ME_QUERY, options);
export const useVerifyMemberPasswordResetTokenQuery = () =>
  useLazyQuery(VERIFY_MEMBER_PASSWORD_RESET_TOKEN_QUERY);
export const useVerifySocietyPasswordResetTokenQuery = () =>
  useLazyQuery(VERIFY_SOCIETY_PASSWORD_RESET_TOKEN_QUERY);
