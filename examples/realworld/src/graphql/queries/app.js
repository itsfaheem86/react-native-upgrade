import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';

export const GET_ROOT_QUERY = gql`
  query {
    ${GraphqlPaths.data}: root {
      message
    }
  }
`;
