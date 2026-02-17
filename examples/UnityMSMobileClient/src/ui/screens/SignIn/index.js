import {UserKeys, UserTypes} from '@constants/strings';
import TabView from '@ui/components/TabView';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MemberSignIn from './Member';
import SocietySignIn from './Society';
const SignIn = props => {
  const {t} = useTranslation();
  const {route} = props;
  const {params} = route;
  const labels = {
    [UserTypes.Member]: t('Member'),
    [UserTypes.Society]: t('Society'),
  };
  const insets = useSafeAreaInsets();

  return (
    <TabView
      sceneMap={[
        {
          component: <MemberSignIn {...props} />,
          label: labels[UserTypes.Member],
        },
        {
          component: <SocietySignIn {...props} />,
          label: labels[UserTypes.Society],
        },
      ]}
      initialTabName={labels[params?.[UserKeys.userType]]}
      tabStyle={{marginTop: insets.top}}
    />
  );
};

export default SignIn;
