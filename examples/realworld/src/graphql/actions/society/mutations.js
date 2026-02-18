import {useMutation} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  ACCEPT_SOCIETY_ACCOUNT_MUTATION,
  CREATE_SOCIETY_COST_TYPE_MUTATION,
  CREATE_SOCIETY_CREDIT_TYPE_MUTATION,
  DELETE_SOCIETY_COST_TYPE_MUTATION,
  DELETE_SOCIETY_CREDIT_TYPE_MUTATION,
  UPDATE_SOCIETY_COST_TYPE_MUTATION,
  UPDATE_SOCIETY_CREDIT_TYPE_MUTATION,
  UPDATE_SOCIETY_PROFILE_MUTATION,
} from '@graphql/mutations/society';
import {
  GET_SOCIETY_COST_TYPES_QUERY,
  GET_SOCIETY_CREDIT_TYPES_QUERY,
} from '@graphql/queries/society';

export const useAcceptSocietyAccountMutation = () =>
  useMutation(ACCEPT_SOCIETY_ACCOUNT_MUTATION);

export const useCreateSocietyCreditTypeMutation = () =>
  useMutation(CREATE_SOCIETY_CREDIT_TYPE_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {query: GET_SOCIETY_CREDIT_TYPES_QUERY},
        cachedCreditTypes => {
          return {
            [GraphqlPaths.data]: [
              data?.[GraphqlPaths.data],
              ...(cachedCreditTypes?.[GraphqlPaths.data] || []),
            ],
          };
        },
      );
    },
  });

export const useUpdateSocietyCreditTypeMutation = () =>
  useMutation(UPDATE_SOCIETY_CREDIT_TYPE_MUTATION);

export const useDeleteSocietyCreditTypeMutation = () =>
  useMutation(DELETE_SOCIETY_CREDIT_TYPE_MUTATION, {
    update: (cache, {data}) => {
      const cachedCreditTypes = cache.readQuery({
        query: GET_SOCIETY_CREDIT_TYPES_QUERY,
      })?.[GraphqlPaths.data];
      cache.writeQuery({
        query: GET_SOCIETY_CREDIT_TYPES_QUERY,
        data: {
          [GraphqlPaths.data]: cachedCreditTypes?.filter(
            cachedCreditType =>
              cachedCreditType._id !== data[GraphqlPaths.data],
          ),
        },
      });
    },
  });

export const useCreateSocietyCostTypeMutation = () =>
  useMutation(CREATE_SOCIETY_COST_TYPE_MUTATION, {
    update: (cache, {data}) => {
      cache.updateQuery(
        {query: GET_SOCIETY_COST_TYPES_QUERY},
        cachedCostTypes => {
          return {
            [GraphqlPaths.data]: [
              data?.[GraphqlPaths.data],
              ...(cachedCostTypes?.[GraphqlPaths.data] || []),
            ],
          };
        },
      );
    },
  });

export const useUpdateSocietyCostTypeMutation = () =>
  useMutation(UPDATE_SOCIETY_COST_TYPE_MUTATION);

export const useDeleteSocietyCostTypeMutation = () =>
  useMutation(DELETE_SOCIETY_COST_TYPE_MUTATION, {
    update: (cache, {data}) => {
      const cachedCostTypes = cache.readQuery({
        query: GET_SOCIETY_COST_TYPES_QUERY,
      })?.[GraphqlPaths.data];
      cache.writeQuery({
        query: GET_SOCIETY_COST_TYPES_QUERY,
        data: {
          [GraphqlPaths.data]: cachedCostTypes?.filter(
            cachedCostType => cachedCostType._id !== data[GraphqlPaths.data],
          ),
        },
      });
    },
  });

export const useUpdateSocietyProfileMutation = () =>
  useMutation(UPDATE_SOCIETY_PROFILE_MUTATION);
