import {gql} from '@apollo/client';

export const COMMON_DELETE_MESSAGE_FRAGMENT = gql`
  fragment CommonDeleteMessageFields on DeleteMessage {
    _id
  }
`;

export const COMMON_MEMBER_FRAGMENT = gql`
  fragment CommonMemberFields on Member {
    _id
    email
    name
    avatar
  }
`;

export const COMMON_SOCIETY_FRAGMENT = gql`
  fragment CommonSocietyFields on Society {
    _id
    email
    name
    activeAccountsCount
    avatar
  }
`;

export const COMMON_ACCOUNT_FRAGMENT = gql`
  fragment CommonAccountFields on Account {
    _id
    active
    blocked
  }
`;

export const COMMON_ACCOUNT_WITH_SOCIETY_FRAGMENT = gql`
  fragment CommonAccountWithSocietyFields on AccountWithSociety {
    _id
    active
    society {
      _id
      name
      avatar
    }
  }
`;

export const COMMON_REPORT_FRAGMENT = gql`
  fragment CommonReportFields on Report {
    _id
    amountHistoryTotal
    receivedRevenueTotal
    costTotal
    receivablesTotal
    date
    category
  }
`;

export const COMMON_ACCOUNT_WITH_FULL_INFO_FRAGMENT = gql`
  fragment CommonAccountWithFullInfoFields on AccountWithFullInfo {
    _id
    active
    blocked
    paid
    cost {
      total
    }
    credit {
      total
    }
    society {
      _id
      name
    }
    member {
      _id
      name
    }
  }
`;

export const COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT = gql`
  fragment CommonAccountWithMemberFields on AccountWithMember {
    _id
    active
    blocked
    paid
    member {
      _id
      name
      avatar
      lastSeen
    }
    cost {
      total
    }
    credit {
      total
    }
  }
`;

export const COMMON_ACCOUNT_WITH_MEMBER_AND_REPORTS_FRAGMENT = gql`
  fragment CommonAccountWithMemberAndReportsFields on AccountWithMemberAndReports {
    _id
    active
    blocked
    paid
    member {
      _id
      name
      avatar
      lastSeen
    }
    cost {
      total
    }
    credit {
      total
    }
    reports {
      ...CommonReportFields
      prevReport {
        ...CommonReportFields
      }
    }
  }
  ${COMMON_REPORT_FRAGMENT}
`;

export const COMMON_SOCIETY_WITH_ACCOUNTS_FRAGMENT = gql`
  fragment CommonSocietyWithAccountsFields on SocietyWithAccounts {
    _id
    email
    name
    avatar
    accounts {
      ...CommonAccountFields
    }
    activeAccountsCount
  }
  ${COMMON_ACCOUNT_FRAGMENT}
`;

export const COMMON_SOCIETY_WITH_FULL_INFO_FRAGMENT = gql`
  fragment CommonSocietyWithFullInfoFields on SocietyWithFullInfo {
    _id
    email
    name
    avatar
    activeAccountsCount
    received
    credit {
      total
      receivable
    }
    cost {
      total
      receivable
    }
  }
`;

export const COMMON_AUTH_FRAGMENT = gql`
  fragment CommonAuthFields on AuthPayload {
    _id
    type
    token
  }
`;

export const COMMON_TYPE_FRAGMENT = gql`
  fragment CommonTypeFields on Type {
    _id
    name
  }
`;

export const COMMON_RECORD_FRAGMENT = gql`
  fragment CommonRecordFields on Record {
    _id
    amount
    description
    accountsCount
    date
    type {
      ...CommonTypeFields
    }
    category
    accounts
    createdAt
  }
  ${COMMON_TYPE_FRAGMENT}
`;

export const COMMON_RECORD_WITH_ACCOUNTS_AND_MEMBER_FRAGMENT = gql`
  fragment CommonRecordWithAccountsAndMemberFields on RecordWithAccountsAndMember {
    _id
    amount
    description
    category
    accountsCount
    date
    type {
      ...CommonTypeFields
    }
    accounts {
      ...CommonAccountWithMemberFields
    }
    createdAt
  }
  ${COMMON_TYPE_FRAGMENT}
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const COMMON_AMOUNT_HISTORY_FRAGMENT = gql`
  fragment CommonAmountHistoryFields on AmountHistory {
    _id
    amount
    description
    date
    createdAt
  }
`;

export const COMMON_EVENT_WITH_FULL_INFO_FRAGMENT = gql`
  fragment CommonEventWithFullInfoFields on EventWithFullInfo {
    _id
    title
    date
    organizer {
      ...CommonAccountWithMemberFields
    }
    description
    accounts {
      ...CommonAccountWithMemberFields
    }
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;

export const COMMON_EVENT_WITH_ORGANIZER_FRAGMENT = gql`
  fragment CommonEventWithOrganizerFields on EventWithOrganizer {
    _id
    title
    date
    organizer {
      ...CommonAccountWithMemberFields
    }
    description
    accountsCount
    accounts
  }
  ${COMMON_ACCOUNT_WITH_MEMBER_FRAGMENT}
`;
