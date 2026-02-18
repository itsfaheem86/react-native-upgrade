import {PropTypes} from '@constants/imports';
import {CommonHeights, CommonNumbers} from '@constants/numbers';
import {KeyboardShouldPersistTypes} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view';

const TabView = props => {
  const {
    sceneMap,
    tabStyle,
    lazy = false,
    virtualizedEnabled,
    onTabChange,
    initialTabName,
  } = props;
  const {colors} = useTheme();

  return (
    <Tabs.Container
      renderTabBar={props => (
        <MaterialTabBar
          {...props}
          tabStyle={[
            {
              backgroundColor: colors.background,
              height: CommonHeights.tabBar,
              borderTopWidth: CommonNumbers.one,
              borderTopColor: colors.card2,
              borderBottomColor: colors.card2,
              borderBottomWidth: CommonNumbers.one,
            },
            tabStyle,
          ]}
          labelStyle={[TypographyStyles.headline, {color: colors.text}]}
          activeColor={colors.primary}
          inactiveColor={colors.text}
        />
      )}
      initialTabName={initialTabName}
      lazy={lazy}
      onTabChange={onTabChange}
      pagerProps={{scrollEnabled: false}}>
      {sceneMap.map(scene => {
        return (
          <Tabs.Tab
            key={scene.label}
            name={scene.name || scene.label}
            label={scene.label}>
            {virtualizedEnabled ? (
              // Component parent should be NetworkVirtualizedTabScrollView, otherwise we will have problem in implementing refresh controller.
              scene.component
            ) : (
              <Tabs.ScrollView
                keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
                {scene.component}
              </Tabs.ScrollView>
            )}
          </Tabs.Tab>
        );
      })}
    </Tabs.Container>
  );
};

TabView.propTypes = {
  sceneMap: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      component: PropTypes.object,
    }),
  ),
  tabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  initialTabName: PropTypes.string,
  lazy: PropTypes.bool,
  virtualizedEnabled: PropTypes.bool,
  onTabChange: PropTypes.func,
};

export default TabView;
