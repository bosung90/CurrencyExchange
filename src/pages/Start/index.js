// @flow
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import common from '../../common'

export default class Start extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={common.images.logo}/>
          <Text style={[common.textStyles.h1_light, styles.title]}>Currency</Text>
          <Text style={common.textStyles.subhead_light}>Easy Exchange</Text>
        </View>
        <Image style={styles.waveImage} source={common.images.wave}/>
        <TouchableOpacity onPress={()=>Actions.main()} style={styles.button}>
          <Text style={common.textStyles.button}>Get Started</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.colors.background,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 14,
    marginBottom: 6,
  },
  waveImage: {
    width: Dimensions.get('window').width,
  },
  button: {
    height: 72,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
