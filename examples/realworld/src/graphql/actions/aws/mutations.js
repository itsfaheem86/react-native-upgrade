import {useMutation} from '@apollo/client';
import {CREATE_PRESIGNED_URI_MUTATION} from '@graphql/mutations/aws';

export const useCreatePresignedUriMutation = () =>
  useMutation(CREATE_PRESIGNED_URI_MUTATION);
