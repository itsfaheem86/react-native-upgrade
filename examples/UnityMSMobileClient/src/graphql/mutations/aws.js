import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';

export const CREATE_PRESIGNED_URI_MUTATION = gql`
  mutation createPresignedUri($createPresignedUriDto: CreatePresignedUriDto!) {
    ${GraphqlPaths.data}: createPresignedUri(createPresignedUriDto: $createPresignedUriDto) {
      fields
      uploadUri
    }
  }
`;
