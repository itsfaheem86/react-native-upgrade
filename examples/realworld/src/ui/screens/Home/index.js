import {CommonStyles} from '@config/styles';
import {CommonIndices} from '@constants/numbers';
import {
  fetchPolicyValues,
  GraphqlPaths,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetMemberAccountsQuery} from '@graphql/actions/member/queries';
import {setDefaultAccount} from '@redux/slices/authSlice';
import SubLoading from '@ui/components/SubLoading';
import {get} from 'lodash';
import {useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MemberInfo from '../Info/Member';
import SocietyInfo from '../Info/Society';
const Home = props => {
  const auth = useSelector(state => state.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const userType = auth[UserKeys.userType];
  console.log({component: Home.name, userType});
  const dispatch = useDispatch();
  const [
    getMemberAccountsQuery,
    {
      loading: isGetMemberAccountsQueryLoading,
      data: getMemberAccountsData,
      refetch: refetchMemberAccountsQuery,
    },
  ] = useGetMemberAccountsQuery();

  useEffect(() => {
    if (userType === UserTypes.Member) {
      getMemberAccountsQuery({fetchPolicy: fetchPolicyValues.networkOnly});
    } else if (userType === UserTypes.Society) {
    }
  }, [userType]);

  // Switching making userType to society
  console.log({userType});

  const accounts = get(getMemberAccountsData, GraphqlPaths.data, []);
  useEffect(() => {
    // Because if we dispatch without length check, the bottom navigation is flickering cause redux cache have defaultAccount id and then this request making the accounts=[] and then backend response will give the proper accounts
    if (accounts?.length) {
      dispatch(setDefaultAccount(accounts?.[CommonIndices.zero]));
    }
  }, [accounts]);

  if (isGetMemberAccountsQueryLoading || userType === UserTypes.Unknown)
    return <SubLoading />;
  return (
    <View style={[CommonStyles.fullFlex]}>
      {userType === UserTypes.Member ? (
        <MemberInfo
          onRefresh={refetchMemberAccountsQuery}
          accountId={defaultAccount?._id}
          societyId={defaultAccount?.society?._id}
          {...props}
        />
      ) : (
        <SocietyInfo {...props} />
      )}
    </View>
  );
};

export default Home;
