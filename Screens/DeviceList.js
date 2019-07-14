import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Button } from 'react-native-elements';

export default class DeviceList extends React.Component {

  render() {
    return (
    <View style={{flex: 1}}>
        <Button title = 'Scan PAge QR Code'  onPress = { this.scanSubmitHandler } />
      </View>
    );
  }
}
