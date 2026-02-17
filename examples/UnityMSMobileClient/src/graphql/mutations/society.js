import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT,
  COMMON_SOCIETY_FRAGMENT,
  COMMON_TYPE_FRAGMENT,
} from '@graphql/queries/common';

export const ACCEPT_SOCIETY_ACCOUNT_MUTATION = gql`
  mutation acceptSocietyAccount($acceptSocietyAccountDto: AcceptSocietyAccountDto!) {
    ${GraphqlPaths.data}: acceptSocietyAccount(acceptSocietyAccountDto: $acceptSocietyAccountDto) {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const CREATE_SOCIETY_CREDIT_TYPE_MUTATION = gql`
  mutation createSocietyCreditType($createSocietyCreditTypeDto: CreateSocietyCreditTypeDto!) {
    ${GraphqlPaths.data}: createSocietyCreditType(createSocietyCreditTypeDto: $createSocietyCreditTypeDto) {
      ...CommonTypeFields
    }
  }
  ${COMMON_TYPE_FRAGMENT}
`;

export const UPDATE_SOCIETY_CREDIT_TYPE_MUTATION = gql`
  mutation updateSocietyCreditType($updateSocietyCreditTypeDto: UpdateSocietyCreditTypeDto!) {
    ${GraphqlPaths.data}: updateSocietyCreditType(updateSocietyCreditTypeDto: $updateSocietyCreditTypeDto) {
      ...CommonTypeFields
    }
  }
  ${COMMON_TYPE_FRAGMENT}
`;

export const DELETE_SOCIETY_CREDIT_TYPE_MUTATION = gql`
  mutation deleteSocietyCreditType($deleteSocietyCreditTypeDto: DeleteSocietyCreditTypeDto!) {
    ${GraphqlPaths.data}: deleteSocietyCreditType(deleteSocietyCreditTypeDto: $deleteSocietyCreditTypeDto)
  }
`;

export const CREATE_SOCIETY_COST_TYPE_MUTATION = gql`
  mutation createSocietyCostType($createSocietyCostTypeDto: CreateSocietyCostTypeDto!) {
    ${GraphqlPaths.data}: createSocietyCostType(createSocietyCostTypeDto: $createSocietyCostTypeDto) {
      ...CommonTypeFields
    }
  }
  ${COMMON_TYPE_FRAGMENT}
`;

export const UPDATE_SOCIETY_COST_TYPE_MUTATION = gql`
  mutation updateSocietyCostType($updateSocietyCostTypeDto: UpdateSocietyCostTypeDto!) {
    ${GraphqlPaths.data}: updateSocietyCostType(updateSocietyCostTypeDto: $updateSocietyCostTypeDto) {
      ...CommonTypeFields
    }
  }
  ${COMMON_TYPE_FRAGMENT}
`;

export const DELETE_SOCIETY_COST_TYPE_MUTATION = gql`
  mutation deleteSocietyCostType($deleteSocietyCostTypeDto: DeleteSocietyCostTypeDto!) {
    ${GraphqlPaths.data}: deleteSocietyCostType(deleteSocietyCostTypeDto: $deleteSocietyCostTypeDto)
  }
`;

export const UPDATE_SOCIETY_PROFILE_MUTATION = gql`
  mutation updateSocietyProfile($updateSocietyProfileDto: UpdateSocietyProfileDto!) {
    ${GraphqlPaths.data}: updateSocietyProfile(updateSocietyProfileDto: $updateSocietyProfileDto) {
      ...CommonSocietyFields
    }
  }
  ${COMMON_SOCIETY_FRAGMENT}
`;
