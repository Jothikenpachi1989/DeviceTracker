import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button} from 'react-native';
import { Card, Icon,ListItem } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class AdminPage extends React.Component {
  static navigationOptions = {
    title: 'Super User',
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
  constructor(props) {
    super(props);
  userId = this.props.navigation.getParam('itemId', '');
   PersonName = this.props.navigation.getParam('name','');
   }
  render() {
    const nav = this.props.navigation;
    return (<View style={{flex: 0.98}}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 30, paddingBottom:30}}>
        <View style={{width: 100, height: 100, backgroundColor: 'powderblue'}} />
        <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}} />
        <View style={{width: 100, height: 100, backgroundColor: 'steelblue'}} />
      </View>
        <Card containerStyle={{flex:5, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{width: 100, height: 100, backgroundColor: 'powderblue'}} />
            <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}} />
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{width: 100, height: 100, backgroundColor: 'red'}} />
            <View style={{width: 100, height: 100, backgroundColor: 'green'}} />
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{width: 100, height: 100, backgroundColor: 'powderblue'}} />
            <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}} />
          </View>
        </Card>
      </View>);
  }
}

const styles = StyleSheet.create({
   
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2F95D6',
    alignItems: 'center',
    padding: 12,
    width: 200,
    marginTop: 14,
  },
  
});

