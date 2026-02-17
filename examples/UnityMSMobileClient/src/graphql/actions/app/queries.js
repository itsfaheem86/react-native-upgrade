import {useLazyQuery} from '@apollo/client';
import {GET_ROOT_QUERY} from '@graphql/queries/app';

export const useGetRootQuery = () => useLazyQuery(GET_ROOT_QUERY);
