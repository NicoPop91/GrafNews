import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

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
      title: `${navigation.state.params.name.first.toUpperCase()} ${navigation.state.params.name.last.toUpperCase()}`,
    }),
  },
});

export const SettingsStack = StackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
    },
  },
});

export const AboutStack = StackNavigator({
  About: {
    screen: About,
    navigationOptions: {
      title: 'About',
    },
  },
});

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
  }
});
