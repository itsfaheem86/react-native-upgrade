import {useSubscription} from '@apollo/client';
import {SOCIETY_ACCOUNTS_SUBSCRIPTION} from '@graphql/subscriptions/society';

export const useSocietyAccountsSubscription = () =>
  useSubscription(SOCIETY_ACCOUNTS_SUBSCRIPTION);
