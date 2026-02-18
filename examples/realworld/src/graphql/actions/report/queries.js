import {useLazyQuery} from '@apollo/client';
import {
  GET_MEMBER_REPORTS_QUERY,
  GET_SOCIETY_MEMBERS_REPORTS_QUERY,
  GET_SOCIETY_REPORTS_QUERY,
} from '@graphql/queries/report';

export const useGetSocietyReportsQuery = () =>
  useLazyQuery(GET_SOCIETY_REPORTS_QUERY);

export const useGetSocietyMembersReportsQuery = () =>
  useLazyQuery(GET_SOCIETY_MEMBERS_REPORTS_QUERY);

export const useGetMemberReportsQuery = () =>
  useLazyQuery(GET_MEMBER_REPORTS_QUERY);
