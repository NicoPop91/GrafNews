import React from 'react';
import { TabNavigator, StackNavigator, TabBarBottom, TabBarTop  } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { Platform } from 'react-native';

import News from '../screens/news';
import Settings from '../screens/settings';
import About from '../screens/about';
import ArticleDetail from '../screens/articleDetail';

export const NewsStack = StackNavigator({
  News: {
      screen: News,
      navigationOptions: {
        title: 'News',
      },
    },
    Details: {
      screen: ArticleDetail,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.name.first} ${navigation.state.params.name.last}`,
      }),
    },
  },
  {
    headerMode: Platform.OS === 'ios' ? null : 'none',
  }
);

export const SettingsStack = StackNavigator({
  Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings',
      },
    },
  },
  {
    headerMode: Platform.OS === 'ios' ? null : 'none',
  }
);

export const AboutStack = StackNavigator({
  About: {
      screen: About,
      navigationOptions: {
        title: 'About',
      },
    },
  },
  {
    headerMode: Platform.OS === 'ios' ? null : 'none',
  }
);

export const Tabs = TabNavigator({
    News: {
      screen: NewsStack,
      navigationOptions: {
        tabBarLabel: 'News',
        tabBarIcon: ({ tintColor }) => <Icon name="message" size={24} color={tintColor} />,
      },
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => <Icon name="code" size={24} color={tintColor} />,
      },
    },
    About: {
      screen: AboutStack,
      navigationOptions: {
        tabBarLabel: 'About',
        tabBarIcon: ({ tintColor }) => <Icon name="email" size={24} color={tintColor} />,
      },
    },
  },
  {
    tabBarComponent: Platform.OS === 'ios' ? TabBarBottom : TabBarTop,
    tabBarPosition: Platform.OS === 'ios' ? 'bottom' : 'top',
    tabBarOptions: {
      style: {paddingTop: Platform.OS === 'ios' ? 0 : 25}
    },
    animationEnabled: true,
    swipeEnabled: true,
    allowFontScaling: true
});
