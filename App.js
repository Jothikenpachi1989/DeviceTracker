/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button} from 'react-native';
import { connect } from 'react-redux';
import { addUser } from './actions/user';
import { Card, Icon } from 'react-native-elements';
import ScanPage from './Screens/ScanPage';
import { createStackNavigator, createAppContainer } from "react-navigation";
import DeviceList from './Screens/DeviceList';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class App extends React.Component {
  state = {
    userName: '',
    devices: []
  }

  scanSubmitHandler = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM User WHERE isAdmin=?', ['1'], (tx, results) => {
          var len = results.rows.length;
          if(len > 0) {
            // exists owner name John
            var row = results.rows.item(0);
            this.setState({
              userName: row.firstName
            });
            this.props.add(row.firstName);
          }
        });
    });
}
  // constructor(props){
  //   this.state = {
  //     firstName: "",
  //   };
  // }
  render() {
    return (
    <View style={{flex: 1}}>
      
        <Card containerStyle={{flex:1, justifyContent: "center"}}
          title='Access with your QR code'>
          <Text style={{marginBottom: 30}}>
            Tap to Scan your QR code to reserve a device.
          </Text>
          <Button
            icon={<Icon name='code' color='#ffffff' />}
            backgroundColor='#03A9F4'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            onPress={() => this.props.navigation.navigate('Scan')}
            title='SCAN NOW' />
        </Card>
       
        <Card containerStyle={{flex:1, justifyContent: "center"}}
          title='Device List'>
          <Text style={{marginBottom: 30}}>
            You can view the list of all available devices.
          </Text>
          <Button
            icon={<Icon name='code' color='#ffffff' />}
            backgroundColor='#03A9F4'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            onPress={() => this.props.navigation.navigate('DeviceList')}
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

const mapStateToProps = state => {
  return {
    userName: state.userName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (name) => {
      dispatch(addUser(name))
    }
  }
}
const AppNavigator = createStackNavigator(
  {
    HomeScreen: App,
    DeviceList: DeviceList,
    Scan: ScanPage
  },
  {
    initialRouteName: "HomeScreen"
  }
);
createAppContainer(AppNavigator);

export default connect(mapStateToProps, mapDispatchToProps)(App)
