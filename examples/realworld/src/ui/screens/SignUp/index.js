import {UserKeys, UserTypes} from '@constants/strings';
import {useTheme} from '@theme';
import TabView from '@ui/components/TabView';
import {useTranslation} from 'react-i18next';
import MemberSignUp from './MemberSignUp';
import SocietySignUp from './SocietySignUp';
const SignUp = props => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {route} = props;
  const {params} = route;
  const labels = {
    [UserTypes.Member]: t('Member'),
    [UserTypes.Society]: t('Society'),
  };

  return (
    <TabView
      sceneMap={[
        {
          component: <MemberSignUp {...props} />,
          label: labels[UserTypes.Member],
        },
        {
          component: <SocietySignUp {...props} />,
          label: labels[UserTypes.Society],
        },
      ]}
      initialTabName={labels[params?.[UserKeys.userType]]}
    />
  );
};

export default SignUp;
