import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';
import { Button, Icon, SearchBar, Divider } from 'react-native-elements';
var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

export default class IssuedDeviceList extends React.Component {
  static navigationOptions = ({navigation})=>({
    headerTitle: 'Issued Device List',
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
        onPress={() => navigation.navigate('HomeScreen')}
        icon={<Icon name='filter-list' color='#ffffff' />}
        color="#fff"
        title='Home'
      />
    ),
  });
  state = {
    search: '',
  };
  constructor () {
    super()
    this.state = {
      FlatListItems: [],
    };
    db.transaction(tx => {
      tx.executeSql('select devicetype, devicename, assetid,firstname, location, team, pickuptime from issued_devices_details', [], (tx, results) => {
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
      <FlatList style={home_screen_list.container}
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={home_screen_list.row}>
              <View style={home_screen_list.row_cell_timeplace}>
              {item.devicetype == "iPhone" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): 
                      item.devicetype == "iPad" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): (<Icon name='android1' type='antdesign' color='#a4c639' />)}
                </View>
              <View style={home_screen_list.row_cell_devicename}>
                <Text>{item.devicename}</Text>
                <Text>{item.assetid}</Text>
              </View>
              <View style={home_screen_list.row_cell_devicename}>
                <Text>{item.firstname}</Text>
              </View>
              <View style={home_screen_list.row_cell_place}>
                <Text>{item.team}</Text>
                <Text>{item.location}</Text>
              </View>
              
              {item.devicestatus == "returned" ? (<Text style={home_screen_list.row_cell_available}>Available</Text>) : 
              (<Text style={home_screen_list.row_cell_temp}>{item.devicestatus}</Text> ) }
              
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
      marginTop: 10,
      alignSelf: "stretch",
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
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 0,
      marginBottom: 6,
    },
    row_cell_devicename: {
      flex: 1,
      paddingLeft: 5,
      flexDirection: 'column',
    },
    row_cell_place: {
      flex: 1,
      flexDirection: 'column',
    },
    row_cell_temp: {
      color: '#111111',
      paddingLeft: 10,
      flex: 0,
    },
    row_cell_available: {
      color: '#008000',
      paddingLeft: 10,
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