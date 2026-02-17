import {BookCategory} from '@constants/strings';
import TabView from '@ui/components/TabView';
import {useTranslation} from 'react-i18next';
import CreateOrEditCostRecord from './Cost';
import CreateOrEditCreditRecord from './Credit';

const CreateOrEditRecord = props => {
  const {route} = props;
  const {params} = route;
  const record = params?.record;
  const {t} = useTranslation();
  const labels = {
    credit: record?._id ? t('Edit revenue') : t('Add revenue'),
    cost: record?._id ? t('Edit cost') : t('Add cost'),
  };
  console.log({component: CreateOrEditRecord.name, record});
  const sceneMap = [
    {
      component: <CreateOrEditCreditRecord {...props} />,
      label: labels.credit,
      conditionCheck: () =>
        record
          ? record?.category
            ? record?.category === BookCategory.credit
            : true
          : true,
    },
    {
      component: <CreateOrEditCostRecord {...props} />,
      label: labels.cost,
      conditionCheck: () =>
        record
          ? record?.category
            ? record?.category === BookCategory.cost
            : true
          : true,
    },
  ];
  const filteredSceneMap = sceneMap.filter(sMap => sMap.conditionCheck());
  return <TabView sceneMap={filteredSceneMap} virtualizedEnabled={true} />;
};

export default CreateOrEditRecord;
