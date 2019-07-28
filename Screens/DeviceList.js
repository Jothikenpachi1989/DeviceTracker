import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';
import { Button, Icon, SearchBar, ButtonGroup } from 'react-native-elements';
import { ListItem } from 'react-native-elements'


var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

export default class DeviceList extends React.Component {
  static navigationOptions = {
    headerTitle: 'Device List',
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        icon={<Icon name='filter-list' color='#ffffff' />}
        color="#fff"
      />
    ),
  };
  state = {
    search: '',
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
  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const buttons = ['Hello', 'World', 'Buttons']
    const { selectedIndex } = this.state
    const { search } = this.state;

  return (

    <View style={{flex: 1}}>
      <SearchBar 
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
      />
      <FlatList
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={home_screen_list.row}>
              <View style={home_screen_list.row_cell_timeplace}>
                <Text style={home_screen_list.row_time}>{item.devicetype}</Text>
                <Text style={home_screen_list.row_place}>{item.devicename}</Text>
              </View>
              
              <Text style={home_screen_list.row_cell_temp}>{item.devicestatus}</Text>
            </View>
            
          )}
        />
    </View>
  )
  }
}
const home_screen_list = StyleSheet.create(
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
  });