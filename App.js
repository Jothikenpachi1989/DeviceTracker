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


var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class App extends Component {
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
      <View style={styles.container}>   
         <Text style={styles.instructions}>{this.state.userName}</Text> 
         <Button title = 'Scan' 
          style = { styles.placeButton }
          onPress = { this.scanSubmitHandler }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  placeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%'
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

export default connect(mapStateToProps, mapDispatchToProps)(App)