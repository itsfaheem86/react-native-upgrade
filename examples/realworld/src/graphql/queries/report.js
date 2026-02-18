import {gql} from '@apollo/client';
import {GraphqlPaths} from '@constants/strings';
import {
  COMMON_ACCOUNT_WITH_MEMBER_AND_REPORTS_FRAGMENT,
  COMMON_REPORT_FRAGMENT,
} from './common';

export const GET_SOCIETY_REPORTS_QUERY = gql`
  query getSocietyReports($getSocietyReportsDto: GetSocietyReportsDto!, $paginationDto: PaginationDto){
    ${GraphqlPaths.data}: getSocietyReports(getSocietyReportsDto: $getSocietyReportsDto, paginationDto: $paginationDto) {
      ...CommonReportFields
      prevReport {
        ...CommonReportFields
      }
    }
  }
  ${COMMON_REPORT_FRAGMENT}
`;

export const GET_SOCIETY_MEMBERS_REPORTS_QUERY = gql`
  query getSocietyMembersReports($getSocietyMembersReportsDto: GetSocietyMembersReportsDto!){
    ${GraphqlPaths.data}: getSocietyMembersReports(getSocietyMembersReportsDto: $getSocietyMembersReportsDto) {
      ...CommonAccountWithMemberAndReportsFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_AND_REPORTS_FRAGMENT}
`;

export const GET_MEMBER_REPORTS_QUERY = gql`
  query getMemberReports($getMemberReportsDto: GetMemberReportsDto!){
    ${GraphqlPaths.data}: getMemberReports(getMemberReportsDto: $getMemberReportsDto) {
      ...CommonReportFields
    }
  }
  ${COMMON_REPORT_FRAGMENT}
`;
