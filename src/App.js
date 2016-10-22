// @flow
import React, {Component} from 'react'
import {View, StatusBar, UIManager} from 'react-native'
import {Actions, Scene, Router} from 'react-native-router-flux'
import Start from './pages/Start'
import Main from './pages/Main'
import common from './common'

// Enable LayoutAnimation for Android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

const Scenes = Actions.create(
  <Scene key='root'>
    <Scene key='start' component={Start} hideNavBar direction='fade' /*panHandlers={null}*/ />
    <Scene key='main' component={Main} hideNavBar direction='fade' /*panHandlers={null}*/ />
  </Scene>
)

export default class App extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: common.colors.background}}>
        <Router scenes={Scenes} />
        <StatusBar barStyle='light-content' backgroundColor={common.colors.background} />
      </View>
    )
  }
}
