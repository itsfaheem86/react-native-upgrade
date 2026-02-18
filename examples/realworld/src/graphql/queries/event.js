import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_EVENT_WITH_FULL_INFO_FRAGMENT,
  COMMON_EVENT_WITH_ORGANIZER_FRAGMENT,
} from './common';

export const GET_SOCIETY_EVENTS_QUERY = gql`
  query getSocietyEvents($getSocietyEventsDto: GetSocietyEventsDto!) {
    ${GraphqlPaths.data}: getSocietyEvents(getSocietyEventsDto: $getSocietyEventsDto) {
      ...CommonEventWithOrganizerFields
    }
  }
  ${COMMON_EVENT_WITH_ORGANIZER_FRAGMENT}
`;

export const GET_SOCIETY_EVENT_QUERY = gql`
  query getSocietyEvent($getSocietyEventDto: GetSocietyEventDto!) {
    ${GraphqlPaths.data}: getSocietyEvent(getSocietyEventDto: $getSocietyEventDto) {
      ...CommonEventWithFullInfoFields
    }
  }
  ${COMMON_EVENT_WITH_FULL_INFO_FRAGMENT}
`;
