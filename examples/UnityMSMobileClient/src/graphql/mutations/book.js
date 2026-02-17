import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_AMOUNT_HISTORY_FRAGMENT,
  COMMON_DELETE_MESSAGE_FRAGMENT,
  COMMON_RECORD_FRAGMENT,
  COMMON_RECORD_WITH_ACCOUNTS_AND_MEMBER_FRAGMENT,
} from '@graphql/queries/common';

export const CREATE_SOCIETY_CREDIT_RECORD_MUTATION = gql`
  mutation createSocietyCreditRecord($createSocietyCreditRecordDto: CreateSocietyCreditRecordDto!) {
    ${GraphqlPaths.data}: createSocietyCreditRecord(createSocietyCreditRecordDto: $createSocietyCreditRecordDto) {
      ...CommonRecordFields
    }
  }
  ${COMMON_RECORD_FRAGMENT}
`;

export const UPDATE_SOCIETY_CREDIT_RECORD_MUTATION = gql`
  mutation updateSocietyCreditRecord($updateSocietyCreditRecordDto: UpdateSocietyCreditRecordDto!) {
    ${GraphqlPaths.data}: updateSocietyCreditRecord(updateSocietyCreditRecordDto: $updateSocietyCreditRecordDto) {
      ...CommonRecordWithAccountsAndMemberFields
    }
  }
  ${COMMON_RECORD_WITH_ACCOUNTS_AND_MEMBER_FRAGMENT}
`;

export const DELETE_SOCIETY_CREDIT_RECORD_MUTATION = gql`
  mutation deleteSocietyCreditRecord($deleteSocietyCreditRecordDto: DeleteSocietyCreditRecordDto!) {
    ${GraphqlPaths.data}: deleteSocietyCreditRecord(deleteSocietyCreditRecordDto: $deleteSocietyCreditRecordDto) {
      ...CommonDeleteMessageFields
    }
  }
  ${COMMON_DELETE_MESSAGE_FRAGMENT}
`;

export const UPDATE_SOCIETY_COST_RECORD_MUTATION = gql`
  mutation updateSocietyCostRecord($updateSocietyCostRecordDto: UpdateSocietyCostRecordDto!) {
    ${GraphqlPaths.data}: updateSocietyCostRecord(updateSocietyCostRecordDto: $updateSocietyCostRecordDto) {
      ...CommonRecordWithAccountsAndMemberFields
    }
  }
  ${COMMON_RECORD_WITH_ACCOUNTS_AND_MEMBER_FRAGMENT}
`;

export const CREATE_SOCIETY_COST_RECORD_MUTATION = gql`
  mutation createSocietyCostRecord($createSocietyCostRecordDto: CreateSocietyCostRecordDto!) {
    ${GraphqlPaths.data}: createSocietyCostRecord(createSocietyCostRecordDto: $createSocietyCostRecordDto) {
      ...CommonRecordFields
    }
  }
  ${COMMON_RECORD_FRAGMENT}
`;

export const CREATE_MEMBER_AMOUNT_HISTORY_MUTATION = gql`
  mutation createMemberAmountHistory($createMemberAmountHistoryDto: CreateMemberAmountHistoryDto!) {
    ${GraphqlPaths.data}: createMemberAmountHistory(createMemberAmountHistoryDto: $createMemberAmountHistoryDto) {
      ...CommonAmountHistoryFields
    }
  }
  ${COMMON_AMOUNT_HISTORY_FRAGMENT}
`;

export const UPDATE_MEMBER_AMOUNT_HISTORY_MUTATION = gql`
  mutation updateMemberAmountHistory($updateMemberAmountHistoryDto: UpdateMemberAmountHistoryDto!) {
    ${GraphqlPaths.data}: updateMemberAmountHistory(updateMemberAmountHistoryDto: $updateMemberAmountHistoryDto) {
      ...CommonAmountHistoryFields
    }
  }
  ${COMMON_AMOUNT_HISTORY_FRAGMENT}
`;

export const DELETE_SOCIETY_COST_RECORD_MUTATION = gql`
  mutation deleteSocietyCostRecord($deleteSocietyCostRecordDto: DeleteSocietyCostRecordDto!) {
    ${GraphqlPaths.data}: deleteSocietyCostRecord(deleteSocietyCostRecordDto: $deleteSocietyCostRecordDto) {
      ...CommonDeleteMessageFields
    }
  }
  ${COMMON_DELETE_MESSAGE_FRAGMENT}
`;

export const DELETE_MEMBER_AMOUNT_HISTORY_MUTATION = gql`
  mutation deleteMemberAmountHistory($deleteMemberAmountHistoryDto: DeleteMemberAmountHistoryDto!) {
    ${GraphqlPaths.data}: deleteMemberAmountHistory(deleteMemberAmountHistoryDto: $deleteMemberAmountHistoryDto) {
      ...CommonDeleteMessageFields
    }
  }
  ${COMMON_DELETE_MESSAGE_FRAGMENT}
`;
