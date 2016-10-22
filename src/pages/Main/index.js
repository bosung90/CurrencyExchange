// @flow
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  ScrollView,
} from 'react-native'
import common from '../../common'

const MAX_INPUT_LENGTH = 9
const EXCHANGE_RATE_API = 'https://api.fixer.io/latest?base=USD'

export default class Main extends Component {
  state: any
  constructor(props: any){
    super(props)
    this.state = {
      startCurrency: 'USD',
      startCurrencySelecting: false,
      toCurrency: 'CAD',
      toCurrencySelecting: false,
      currency: '',
      serverJSON: {
        base: 'USD',
        date: '2016-10-20',
        rates: {
          "USD": 1.0000,
          "AUD": 1.3107,
          "BGN": 1.7966,
          "BRL": 3.1545,
          "CAD": 1.3229,
          "CHF": 0.9944,
          "CNY": 6.7633,
          "CZK": 24.822,
          "DKK": 6.8329,
          "GBP": 0.8205,
          "HKD": 7.7583,
          "HRK": 6.8969,
          "HUF": 283.21,
          "IDR": 13074,
          "ILS": 3.8575,
          "INR": 66.898,
          "JPY": 103.77,
          "KRW": 1137.8,
          "MXN": 18.655,
          "MYR": 4.186,
          "NOK": 8.2251,
          "NZD": 1.3954,
          "PHP": 48.295,
          "PLN": 3.9731,
          "RON": 4.1377,
          "RUB": 62.389,
          "SEK": 8.9025,
          "SGD": 1.3944,
          "THB": 35.135,
          "TRY": 3.0798,
          "ZAR": 14.032,
          "EUR": 0.91861
        }
      }
    }
  }
  componentDidMount() {
    this._downloadExchangeRateAsync()
  }
  componentWillUpdate(){
    LayoutAnimation.easeInEaseOut()
  }
  async _downloadExchangeRateAsync() {
    try {
      let response = await fetch(EXCHANGE_RATE_API)
      let responseJson = await response.json()
      responseJson.rates = {USD: 1.0000, ...responseJson.rates}
      this.setState({serverJSON: responseJson})
    } catch(error) {
      console.error(error)
    }
  }
  _dropdownMenu(startCurrency) {
    const isOpen = startCurrency ? this.state.startCurrencySelecting : this.state.toCurrencySelecting
    return (
      <ScrollView style={[styles.dropdownMenu, isOpen && {height: 200}]}>
        {Object.keys(this.state.serverJSON.rates).map((countryDollarCode)=>{
          return (
            <TouchableOpacity onPress={()=>this.setState(startCurrency ? {startCurrency: countryDollarCode, startCurrencySelecting: false} : {toCurrency: countryDollarCode, toCurrencySelecting: false})} key={countryDollarCode} style={[{height: 50, alignItems: 'center', justifyContent: 'center'}, countryDollarCode === (startCurrency ? this.state.startCurrency : this.state.toCurrency) && {backgroundColor: common.colors.background}]}>
              <Text>{countryDollarCode}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
  }
  _convertCurrencyCodeToCountryCode(currencyCode) {
    switch(currencyCode) {
      case 'USD': return 'us'
      case 'CAD': return 'ca'
      case 'AUD': return 'au'
      case 'BGN': return 'bg'
      case 'BRL': return 'br'
      case 'CHF': return 'ch'
      case 'CNY': return 'cn'
      case 'KRW': return 'kr'
      case 'RUB': return 'ru'
      case 'JPY': return 'jp'
      case 'MXN': return 'mx'
      default: return 'us'
    }
  }
  //https://flags.fmcdn.net/data/flags/normal/us.png
  //${this._convertCurrencyCodeToCountryCode(startCurrency? this.state.startCurrency : this.state.toCurrency)}
  _renderFlagButton(startCurrency){
    return (
      <TouchableOpacity onPress={()=>this.setState(startCurrency? {startCurrencySelecting: !this.state.startCurrencySelecting} : {toCurrencySelecting: !this.state.toCurrencySelecting})}>
        <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}} >
          <Image style={{width: 40, height: 28}} source={{uri: `https://flagpedia.net/data/flags/normal/${this._convertCurrencyCodeToCountryCode(startCurrency? this.state.startCurrency : this.state.toCurrency)}.png`}}/>
          <Text style={[common.textStyles.body_light, {marginHorizontal: 7}]}>{startCurrency ? this.state.startCurrency : this.state.toCurrency}</Text>
          <Image source={common.images.downArrow} />
        </View>
      </TouchableOpacity>
    )
  }
  _handleNumberPad(number) {
    switch(number) {
      case 'clear':
        this.setState({currency: ''})
        break
      case 'erase':
        this.setState({currency: this.state.currency.substring(0, this.state.currency.length -1)})
        break
      default:
        this.state.currency.length < MAX_INPUT_LENGTH && this.setState({currency: this.state.currency + number})
        break
    }
  }
  _renderNumberButton(number) {
    return (
      <TouchableOpacity onPress={()=>this._handleNumberPad(number)} style={styles.numberButton}>
        { number === 'erase' ?
            <Image source={common.images.erase}/>
          : <Text style={common.textStyles.number}>{number}</Text>
        }
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.currencyContainer, Platform.OS === 'ios' && {zIndex: 1}]}>
          <View style={styles.header}>
            <Text style={common.textStyles.body_light}>Last Updated {this.state.serverJSON.date}</Text>
          </View>
          <View style={[styles.currencyRowContainer, Platform.OS === 'ios' && {zIndex: 1}]}>
            <View style={styles.currencyRow}>
              {this._renderFlagButton(true)}
              {this._dropdownMenu(true)}
              <Text style={common.textStyles.currency}>{this.state.currency.length > 0 ? '$' + (parseFloat(this.state.currency) / 100).toFixed(2) : '$0.00'}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.43)', marginLeft: 24, marginRight: 16}}/>
            <TouchableOpacity>
              <Image style={{marginRight: 24}} source={common.images.swap}/>
            </TouchableOpacity>
          </View>
          <View style={styles.currencyRowContainer}>
            <View style={styles.currencyRow}>
              {this._renderFlagButton(false)}
              {this._dropdownMenu(false)}
              <Text style={common.textStyles.currency}>{this.state.currency ? '$' + (parseFloat((this.state.currency/100)/this.state.serverJSON.rates[this.state.startCurrency]) * this.state.serverJSON.rates[this.state.toCurrency]).toFixed(2) : '$0.00'}</Text>
            </View>
          </View>
        </View>
        <Image style={styles.waveImage} source={common.images.wave}/>
        <View style={styles.numberPadContainer}>
          <View style={styles.numberPadRow}>
            {this._renderNumberButton(1)}
            {this._renderNumberButton(2)}
            {this._renderNumberButton(3)}
          </View>
          <View style={styles.numberPadRow}>
            {this._renderNumberButton(4)}
            {this._renderNumberButton(5)}
            {this._renderNumberButton(6)}
          </View>
          <View style={styles.numberPadRow}>
            {this._renderNumberButton(7)}
            {this._renderNumberButton(8)}
            {this._renderNumberButton(9)}
          </View>
          <View style={styles.numberPadRow}>
            {this._renderNumberButton('clear')}
            {this._renderNumberButton(0)}
            {this._renderNumberButton('erase')}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.colors.background,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    height: 44,
    justifyContent: 'center',
    marginLeft: 24,
  },
  currencyContainer: {
    flex: 1,
  },
  dropdownMenu: {
    zIndex: 1, // Required for Android
    position: 'absolute',
    left: 0,
    top: 45,
    height: 0,
    width: 103,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  currencyRowContainer: {
    flex: 1,
    marginHorizontal: 24,
    justifyContent: 'center',
  },
  currencyRow: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waveImage: {
    width: Dimensions.get('window').width,
  },
  numberPadContainer: {
    height: 256,
    backgroundColor: 'white',
  },
  numberPadRow: {
    flexDirection: 'row',
    height: 64
  },
  numberButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
