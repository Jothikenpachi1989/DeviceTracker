import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button, Icon,Overlay, Card} from 'react-native-elements';
import DropdownMenu from 'react-native-dropdown-menu';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
var data = [["All Devices", "Android", "iPhone", "iPad"], ["All", "Available","issued"]];
   
export default class ViewCustomList extends React.Component {
  static navigationOptions = ({navigation})=>({
    headerTitle: 'Device List',
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
        onPress={() => alert("This is help content")}
        title="Help"
        color="#fff"
      />
    ),
  });
  constructor () {
    super()
    this.state = {
      listType: 'FlatList',
      listViewData: [],
      isVisible: false,
      deviceType: "All", 
      deviceAvailability: "All",
    }
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    db.transaction(tx => {
      tx.executeSql('select assetid,devicetype, devicename, team, location, devicestatus from all_device_detailes', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            assetid: results.rows.item(i).assetid,
            location: results.rows.item(i).location,
            devicename: results.rows.item(i).devicename,
            devicetype: results.rows.item(i).devicetype,
            team: results.rows.item(i).team,
            devicestatus: results.rows.item(i).devicestatus
          });
        }
        this.setState({listViewData: temp,});
      });
    });
    db.transaction(tx => {
      tx.executeSql('select * from entries', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            assetid: results.rows.item(i).assetid,
            pickuptime: results.rows.item(i).pickup,
            devicename: results.rows.item(i).devicename,
            returntime: results.rows.item(i).returntime,
          });
        }
        this.setState({entriesViewData: temp,});
      });
    });
  }
  closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}
	rightKey(rowMap, rowKey,mobassetid,devicestatus) {
    this.closeRow(rowMap, rowKey);
    this.getDeviceDetails(mobassetid,devicestatus);
	}
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		//this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  }

  render() {
   return (

    <View style={{flex: 1}}>
      <SwipeListView
        data={this.state.listViewData}
        keyExtractor={(item,index) => index.toString()}
        renderItem={ (data, rowMap) => (
          <TouchableHighlight
            style={customstyle.rowFront}
            underlayColor={'#AAA'}
            key={data.item.key}
          >
          <View style={customstyle.row}>
              <View style={customstyle.row_cell_icon}>
                {data.item.devicetype == "iPhone" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): 
                    data.item.devicetype == "iPad" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): (<Icon name='android1' type='antdesign' color='#a4c639' />)}
              </View>
              <View style={customstyle.row_cell_devicename}>
                <Text>{data.item.devicename}</Text>
              </View>
                <Text style={customstyle.row_cell_devicename}>{data.item.assetid}</Text>
              
              <View style={customstyle.row_cell_place}>
              {data.item.devicestatus == "returned" ? (<Text style={customstyle.row_cell_available}>Available</Text>) : 
            (<Text style={customstyle.row_cell_temp}>{data.item.devicestatus}</Text> ) }
              </View>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenItem={ (data, rowMap) => (
          <View style={customstyle.rowBack}>
            <TouchableOpacity style={[customstyle.backRightBtn, customstyle.backRightBtnRight]} onPress={ _ => this.rightKey(rowMap, data.item.key,data.item.assetid,data.item.devicestatus) }>
            <Text style={customstyle.backTextWhite}>View</Text>
            <Text style={customstyle.backTextWhite}>Edit</Text>
            <Text style={customstyle.backTextWhite}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-70}
        previewRowKey={'0'}
        previewOpenValue={-70}
        previewOpenDelay={3000}
        onSwipeValueChange={this.onSwipeValueChange}
      />  
        </View>
        
  )
  }
}
const customstyle = StyleSheet.create(
  {
    container: {
      marginTop: 10,
      alignSelf: "stretch",
      marginBottom: 10,
    },
    subheader:{
      elevation: 1,
      fontSize: 18,
      alignContent: 'center',
      fontWeight: 'bold',
      color: '#808B96',
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    row_label:{
      paddingLeft: 10,
      fontWeight: 'bold',
      flexDirection: 'column',
    },
    row_value:{
      alignContent: 'flex-end',
      paddingRight: 10,
    },
    row_cell_available_Value: {
      color: '#008000',
      alignContent: 'flex-end',
      paddingRight: 10,
      flex: 0,
    }, 
    row_details: {
      borderRadius: 1,
      borderColor: '#D5D8DC',
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'space-between', // main axis
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
    backTextWhite: {
      color: '#FFF'
    },
    row: {
      elevation: 1,
      borderRadius: 2,
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'flex-start', // main axis
      alignItems: 'center', // cross axis
      paddingLeft: 5,
      paddingRight: 5,
      
    },
    row_cell_icon: {
      paddingLeft: 10,
      flexDirection: 'column',
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
    rowFront: {
      alignItems: 'center',
      backgroundColor: '#EBF5FB',
      justifyContent: 'center',
      height: 60,
      borderColor: '#D5D8DC',
      borderRadius: 1,
    },
    rowBack: {
      alignItems: 'center',
      backgroundColor: '#EBF5FB',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
    },
    backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75
    },
    backRightBtnRight: {
      backgroundColor: 'red',
      right: 0
    },
  });