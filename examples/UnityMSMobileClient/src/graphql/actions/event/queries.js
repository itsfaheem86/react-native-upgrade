import {useLazyQuery} from '@apollo/client';
import {
  GET_SOCIETY_EVENTS_QUERY,
  GET_SOCIETY_EVENT_QUERY,
} from '@graphql/queries/event';

export const useGetSocietyEventsQuery = () =>
  useLazyQuery(GET_SOCIETY_EVENTS_QUERY);

export const useGetSocietyEventQuery = () =>
  useLazyQuery(GET_SOCIETY_EVENT_QUERY);
