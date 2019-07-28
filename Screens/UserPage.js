import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';
import { Button, Icon, SearchBar, ButtonGroup, Card } from 'react-native-elements';
import { ListItem } from 'react-native-elements';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
const users = [
  {
     name: 'Lawrence Francis',
     avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
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
        type="outline"
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

  return (

    <View style={{flex: 1}}>
      <Card containerStyle={{padding: 0}} >
          {
            users.map((u, i) => {
              return (
                <ListItem
                  key={i}
                  roundAvatar
                  title={u.name}
                  avatar={{uri:u.avatar}}
                />
              );
            })
          }
        </Card>

      <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={customstyle.row}>
              <View style={customstyle.row_cell_timeplace}>
                <Text style={customstyle.row_time}>{item.devicetype}</Text>
                <Text style={customstyle.row_place}>{item.devicename}</Text>
              </View>
              
              <Text style={customstyle.row_cell_temp}>{item.devicestatus}</Text>
            </View>
            
          )}
        />
        <View style={ customstyle.bottomView} >
        <Button
                      backgroundColor='#03A9F4'
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, width:150,}}
                      raised
                      title='Scan Now' />
        </View>
    </View>
  )
  }
}
const customstyle = StyleSheet.create(
  {
    container: {
      marginTop: 14,
      alignSelf: "stretch",
    },
    row: {
      elevation: 1,
      borderRadius: 2,
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'flex-start', // main axis
      alignItems: 'center', // cross axis
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 18,
      paddingRight: 16,
      marginLeft: 14,
      marginRight: 14,
      marginTop: 0,
      marginBottom: 6,
    },
    row_cell_timeplace: {
      flex: 1,
      flexDirection: 'column',
    },
    row_cell_temp: {
      color: '#111111',
      paddingLeft: 16,
      flex: 0,
    },
    row_time: {
      color: '#434343',
      textAlignVertical: 'bottom',
      includeFontPadding: false,
      flex: 0,
    },
    row_place: {
      color: '#434343',
      textAlignVertical: 'top',
      includeFontPadding: false,
      flex: 0,
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
    },
  });