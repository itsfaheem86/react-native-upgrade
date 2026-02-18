import {useMutation} from '@apollo/client';
import {
  REQUEST_MEMBER_PASSWORD_RESET_MUTATION,
  REQUEST_SOCIETY_PASSWORD_RESET_MUTATION,
  RESET_MEMBER_PASSWORD_MUTATION,
  RESET_SOCIETY_PASSWORD_MUTATION,
  SIGNUP_MEMBER_MUTATION,
  SIGNUP_SOCIETY_MUTATION,
  UPDATE_LAST_SEEN_MUTATION,
  UPDATE_MESSAGE_TOKEN_MUTATION,
} from '@graphql/mutations/auth';

export const useSignUpMemberMutation = () =>
  useMutation(SIGNUP_MEMBER_MUTATION);

export const useRequestMemberPasswordResetMutation = () =>
  useMutation(REQUEST_MEMBER_PASSWORD_RESET_MUTATION);

export const useRequestSocietyPasswordResetMutation = () =>
  useMutation(REQUEST_SOCIETY_PASSWORD_RESET_MUTATION);

export const useResetMemberPasswordMutation = () =>
  useMutation(RESET_MEMBER_PASSWORD_MUTATION);

export const useResetSocietyPasswordMutation = () =>
  useMutation(RESET_SOCIETY_PASSWORD_MUTATION);

export const useSignUpSocietyMutation = () =>
  useMutation(SIGNUP_SOCIETY_MUTATION);

export const useUpdateMessageTokenMutation = () =>
  useMutation(UPDATE_MESSAGE_TOKEN_MUTATION);

export const useLastSeenMutation = () => useMutation(UPDATE_LAST_SEEN_MUTATION);
