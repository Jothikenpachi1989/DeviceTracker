import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';
import { Button, Icon, SearchBar, ButtonGroup, Card } from 'react-native-elements';
import { Avatar, ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
var uname = "Lawrence Francis";
const users = [
  {
     name: 'Lawrence Francis',
     avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
  },
 ]

export default class UserPage extends React.Component {
  static navigationOptions = {
    headerTitle: 'My Profile',
    headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#2F95D6',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 3,
      },
      headerTitleStyle: {
        fontSize: 18,
      },
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Log Out"
        color="#ffffff"
        type='outline'
        fontSize="6"
      />
    ),
  };
  constructor () {
    super()
    this.state = {
      FlatListItems: [],
    };
    db.transaction(tx => {
      tx.executeSql('select devicetype, devicename, team, location, devicestatus from all_device_detailes', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });
  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };

  render() {
    const swipeoutBtns = [
      {
        component: (
          <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
          >
            <Text>Return</Text>
          </View>
        ),
        backgroundColor: '#f08080',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          alert('Remove me');
        },
      },
    ];
  return (
    <View style={customstyle.container}>
      <View style={customstyle.userRow}>
          <View style={customstyle.userImage}>
            <Avatar rounded size='medium'
              source={{
                uri: users.avatar,
              }}
            />
          </View>
          <View>
            <Text style={{ color: 'gray', fontSize: 16,}} >{uname} </Text>
          </View>
        </View>
        
        <FlatList
            data={this.state.FlatListItems}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Swipeout right={swipeoutBtns} autoClose={true} backgroundColor="#f5fffa">
              <View style={customstyle.row}>
                <View style={customstyle.row_cell_icon}>
                  {item.devicetype == "iPhone" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): 
                      (<Icon name='android1' type='antdesign' color='#a4c639' />)}
                </View>
                <View style={customstyle.row_cell_devicename}>
                  <Text>{item.devicename}</Text>
                </View>
                <View style={customstyle.row_cell_place}>
                  <Text>{item.team}</Text>
                </View>
              </View>
              </Swipeout>
            )}
          />
        
        <View style={ customstyle.bottomView} >
        <Button
            backgroundColor='#03A9F4'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, width:150,}}
            raised
            title='Add More Device' />
        </View>
    </View>
  )
  }
}
const customstyle = StyleSheet.create(
  {
    userRow: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingBottom: 5,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 3,
      backgroundColor: '#FFFFFF',
      borderBottomColor:'#808080',
      borderBottomWidth: 2,
    },
    userImage: {
      marginRight: 12,
    },
    container: {
      marginTop: 10,
      alignSelf: "stretch",
      flex: 1,
      marginBottom: 10,
    },
    row: {
      elevation: 1,
      borderRadius: 2,
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'flex-start', // main axis
      alignItems: 'center', // cross axis
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 3,
      marginBottom: 2,
    },
    row_cell_icon: {
      paddingLeft: 10,
      flexDirection: 'column',
    },
    bottomView:{
      width: '100%', 
      height: 50, 
      backgroundColor: '#FFFFFF', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      tintColor: '#ffffff',
      borderTopWidth: 2,
      borderTopColor:'#808080',
    },
    row_cell_devicename: {
      flex: 1,
      paddingLeft: 10,
      flexDirection: 'column',
    },
    row_cell_place: {
      flexDirection: 'column',
      paddingRight: 10,
    },
  });