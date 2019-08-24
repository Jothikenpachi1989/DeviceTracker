import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { Card, Icon } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class HomePage_1 extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
    headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#2F95D6',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 3,
      },
      headerTitleStyle: {
        fontSize: 18,
      },headerRight: (
        <Button
          title="Help"
          type="outline"
        />
      ),
  };
  render() {
    const nav = this.props.navigation;
    return (
      <View style={{flex: 0.9}}>
      <Card containerStyle={{flex:1, justifyContent: "center"}}
        title='Access with your QR code'>
        <Text style={{marginBottom: 30}}>
          Tap to Scan your QR code to reserve a device.
        </Text>
        <Button
          icon={<Icon name='md-qr-scanner' color='#ffffff' />}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onPress={() => nav.navigate('PersonScan')}
          title='SCAN NOW' />
      </Card>
     
      <Card containerStyle={{flex:1, justifyContent: "center"}}
        title='Device List'>
        <Text style={{marginBottom: 30}}>
          You can view the list of all available devices.
        </Text>
        <Button
          icon={<Icon name='device-mobile' color='#ffffff' />}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onPress={() =>  nav.navigate('DeviceList')}
          title='VIEW NOW' />
      </Card>
       </View>
    );
  }
}

const styles = StyleSheet.create({
   
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

