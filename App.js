/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { connect } from 'react-redux';
import { addUser } from './actions/user';
import PersonScanPage from './Screens/PersonScanPage';
import DeviceScanPage from './Screens/DeviceScanPage';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import DeviceList from './Screens/DeviceList';
import HomePage from './Screens/HomePage'
import UserPage from './Screens/UserPage'
import IssuedDeviceList from './Screens/IssuedDeviceList'
import EntriesDeviceList from './Screens/EntriesDeviceList'
import AdminPage from './Screens/Admin/AdminPage'
import ViewCustomList from './Screens/Admin/ViewCustomList'
import ViewDetails from './Screens/Admin/ViewDetails'
import EditDetails from './Screens/Admin/EditDetails'
import AddDetails from './Screens/Admin/AddDetails'
import ReportSummary from './Screens/Admin/Reports/ReportSummary'

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
    <AppContainer/>
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
    HomeScreen: { screen: HomePage },
    DeviceList: { screen: DeviceList},
    PersonScan: { screen: PersonScanPage},
    DeviceScanPage: { screen: DeviceScanPage},
    UserPage: {screen: UserPage},
    IssuedDeviceList:{screen: IssuedDeviceList},
    EntriesDeviceList:{screen: EntriesDeviceList},
    AdminPage:{screen: AdminPage},
    ViewCustomList:{screen: ViewCustomList},
    ViewDetails:{screen: ViewDetails},
    EditDetails: {screen: EditDetails},
    AddDetails: {screen: AddDetails},
    ReportSummary: {screen: ReportSummary},
  },
  {
    initialRouteName: 'HomeScreen',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default connect(mapStateToProps, mapDispatchToProps)(App);
