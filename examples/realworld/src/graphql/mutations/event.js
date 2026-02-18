import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_DELETE_MESSAGE_FRAGMENT,
  COMMON_EVENT_WITH_ORGANIZER_FRAGMENT,
} from '@graphql/queries/common';

export const CREATE_SOCIETY_EVENT_MUTATION = gql`
  mutation createSocietyEvent($createSocietyEventDto: CreateSocietyEventDto!) {
    ${GraphqlPaths.data}: createSocietyEvent(createSocietyEventDto: $createSocietyEventDto) {
      ...CommonEventWithOrganizerFields
    }
  }
  ${COMMON_EVENT_WITH_ORGANIZER_FRAGMENT}
`;

export const UPDATE_SOCIETY_EVENT_MUTATION = gql`
  mutation updateSocietyEvent($updateSocietyEventDto: UpdateSocietyEventDto!) {
    ${GraphqlPaths.data}: updateSocietyEvent(updateSocietyEventDto: $updateSocietyEventDto) {
      ...CommonEventWithOrganizerFields
    }
  }
  ${COMMON_EVENT_WITH_ORGANIZER_FRAGMENT}
`;

export const DELETE_SOCIETY_EVENT_MUTATION = gql`
  mutation deleteSocietyEvent($deleteSocietyEventDto: DeleteSocietyEventDto!) {
    ${GraphqlPaths.data}: deleteSocietyEvent(deleteSocietyEventDto: $deleteSocietyEventDto) {
      ...CommonDeleteMessageFields
    }
  }
  ${COMMON_DELETE_MESSAGE_FRAGMENT}
`;
