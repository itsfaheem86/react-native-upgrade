import {InMemoryCache} from '@apollo/client';
import {MomentUnitOfTimes} from '@constants/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAwsUriFromKey} from '@utils';
import {AsyncStorageWrapper, CachePersistor} from 'apollo3-cache-persist';
import moment from 'moment';

const cache = new InMemoryCache({
  typePolicies: {
    // Types
    Society: {
      fields: {
        avatar: {
          read(key) {
            return getAwsUriFromKey(key);
          },
        },
      },
    },
    Member: {
      fields: {
        avatar: {
          read(key) {
            return getAwsUriFromKey(key);
          },
        },
      },
    },
    SocietyWithAccounts: {
      fields: {
        avatar: {
          read(key) {
            return getAwsUriFromKey(key);
          },
        },
        accounts: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },

    SocietyWithFullInfo: {
      fields: {
        avatar: {
          read(key) {
            return getAwsUriFromKey(key);
          },
        },
      },
    },
    AccountWithMember: {
      fields: {
        avatar: {
          read(key) {
            return getAwsUriFromKey(key);
          },
        },
      },
    },
    RecordWithAccountsAndMember: {
      fields: {
        accounts: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Report: {
      fields: {
        date: {
          read(date) {
            // Since it's utz end of date, I want it to be start of date
            return moment.utc(date).startOf(MomentUnitOfTimes.day);
          },
        },
      },
    },
    // Queries
    Query: {
      fields: {
        getSocietyCreditTypes: {
          // May need to consider while implementing pagination
          merge(_, incoming) {
            return incoming;
          },
        },
        getSocietyCostTypes: {
          merge(_, incoming) {
            return incoming;
          },
        },
        getSocietyRecords: {
          merge(_, incoming) {
            return incoming;
          },
        },
        getMemberAmountHistories: {
          merge(_, incoming) {
            return incoming;
          },
        },
        getSocietyAmountHistories: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

export const persistor = new CachePersistor({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
});

export default cache;
