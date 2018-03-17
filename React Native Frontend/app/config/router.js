import React from 'react';
import { TabNavigator, StackNavigator, TabBarBottom, TabBarTop  } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { Platform, Button } from 'react-native';
import { Orientation } from './orientation';
const Device = require("react-native-device-detection");

import News from '../screens/news';
import Settings from '../screens/settings';
import About from '../screens/about';
import ArticleDetail from '../screens/articleDetail';
import WriteArticle from '../screens/writeArticle';
import ViewPhotos from '../screens/viewPhotos';

export const NewsStack = StackNavigator({
    News: {
      screen: News,
      navigationOptions: {
        title: 'News',
        headerStyle: {paddingHorizontal: 10}
      },
    },
    Details: {
      screen: ArticleDetail,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
      }),
    },
    WriteArticle: {
      screen: WriteArticle,
      navigationOptions: {
        title: 'Write Article',
        headerStyle: {paddingHorizontal: 10}
      }
    },
    ViewPhotos: {
      screen: ViewPhotos,
      navigationOptions: {
        title: 'Select Photo'
      }
  },
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
);

export const AboutStack = StackNavigator({
  About: {
      screen: About,
      navigationOptions: {
        title: 'About',
      },
    },
  },
);

export const Tabs = TabNavigator({
    News: {
      screen: NewsStack,
      navigationOptions: {
        tabBarLabel: 'News',
        tabBarIcon: ({ tintColor }) => <Icon name="list" size={24} color={tintColor} />,
      },
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => <Icon name="settings" size={24} color={tintColor} />,
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
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
    allowFontScaling: true
});
