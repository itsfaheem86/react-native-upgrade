import {BookCategory, RouteNames} from '@constants/strings';
import FAB from '@ui/atoms/FAB';
import TabView from '@ui/components/TabView';
import {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import CostTypes from './Cost';
import CreditTypes from './Credit';

const Types = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const labels = {
    credit: t('Revenue'),
    cost: t('Cost'),
  };
  const initialTabName = BookCategory.credit;
  const currentTabName = useRef(initialTabName);
  return (
    <>
      <TabView
        sceneMap={[
          {
            component: <CreditTypes {...props} />,
            label: labels.credit,
            name: BookCategory.credit,
          },
          {
            component: <CostTypes {...props} />,
            label: labels.cost,
            name: BookCategory.cost,
          },
        ]}
        initialTabName={initialTabName}
        onTabChange={({tabName}) => {
          currentTabName.current = tabName;
        }}
        virtualizedEnabled={true}
      />
      <FAB
        onPress={() => {
          if (currentTabName.current === BookCategory.credit) {
            navigation.navigate(RouteNames.CreateOrEditCreditType);
          } else {
            navigation.navigate(RouteNames.CreateOrEditCostType);
          }
        }}
      />
    </>
  );
};

export default Types;
