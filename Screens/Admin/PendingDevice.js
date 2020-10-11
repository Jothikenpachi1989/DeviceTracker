import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert} from 'react-native';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button, Icon, Overlay} from 'react-native-elements';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Item } from 'native-base';
var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
   
export default class PendingDevice extends React.Component {
  static navigationOptions = ({navigation})=>({
    headerTitle: "Returned devices for review",
    headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#2F95D6',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 3,
      },
      headerTitleStyle: {
        fontSize: 18,
      },headerRight: ( null
        /*<TouchableOpacity
        onPress={() => navigation.navigate('AdminPage',)}
        style={{paddingRight:10,}}>
          <Text style={{ color: '#FFF', fontSize: 14 }}>back</Text>
      </TouchableOpacity> */
    ),
  });
  constructor (props) {
    super(props)
    this.state = {
      listType: 'FlatList',
      listViewData: [],
      isVisible: false,
      flag: false,
    }
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    
    db.transaction(tx => {
      tx.executeSql('select * from devices,entries where devices.assetid = entries.assetid and entries.pending ="yes"', [], (tx, results) => {
        var temp2 = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp2.push({
            key: `${i}`,
          device_assetid: results.rows.item(i).assetid,
          device_devicename: results.rows.item(i).devicename,
          device_devicetype: results.rows.item(i).devicetype,
          device_devicestatus: results.rows.item(i).devicestatus,
          device_team: results.rows.item(i).team,
          device_location: results.rows.item(i).location,
          device_isactive: results.rows.item(i).isactive,
          user_userid: results.rows.item(i).userid,
          user_name: results.rows.item(i).firstname + " " + results.rows.item(i).lastname,
          user_pickuptime: results.rows.item(i).pickuptime,
        });
        }
        this.setState({listViewData: temp2,});
      });
    });
  }
  
  closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}
	rightKey(rowMap, rowKey,mobassetid,userid) {
    this.approveReturn(mobassetid,userid);
    
      this.closeRow(rowMap, rowKey);
      const newData = [...this.state.listViewData];
      const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
       newData.splice(prevIndex, 1);
      this.setState({listViewData: newData});

    if(this.state.flag){      
      //alert('Device approved and returned successfully');
      this.setState({flag: false});
    }
    
  }
  viewOnTap(mobassetid,userid) {
  }
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		//this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  }
  approveReturn=(mobassetid,userid)=>{
    var temp = [];
    db.transaction((tx)=> {
      tx.executeSql(
        'update entries SET pending ="approved" AND ApprovedBy=? where assetid = ? AND  pending="yes"',
        [userid,mobassetid],
        (tx, results) => {
         // console.log('Results',results.rowsAffected);
          if(results.rowsAffected>0){
            this.setState({flag: true,});
            //alert('Device approved and returned successfully');
          }else{
            alert('Return Failed while updating your approval to entries');
            this.setState({flag: false,});
          }
        }
      );
    });
    db.transaction((tx)=> {
      tx.executeSql(
        'update devices SET devicestatus="returned" WHERE assetid = ?',
        [mobassetid],
        (tx, results) => {
          if(results.rowsAffected>0 && flag ){
            this.setState({nofdevices : this.state.nofdevices-1});
            alert('Device approved and returned successfully');
          }else{
            alert('Return Failed while updating your approval to devices');
            this.setState({flag: false,});
          }
        }
      );
    });
  }
  render() {
   return (
    <View style={{flex: 1}}>
        
            <SwipeListView
              data={this.state.listViewData}
              keyExtractor={(item,index) => index.toString()}
              renderItem={ (data, rowMap) => (
                <TouchableHighlight
                onPress={ () => this.viewOnTap(data.item.assetid,data.item.devicestatus) }
                  style={customstyle.rowFront}
                  underlayColor={'#AAA'}
                  key={data.item.key}
                >
                <View style={customstyle.row}>
                    <View style={customstyle.row_cell_icon}>
                      {data.item.device_devicetype == "iPhone" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): 
                          data.item.device_devicetype == "iPad" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): (<Icon name='android1' type='antdesign' color='#a4c639' />)}
                    </View>
                    <View style={customstyle.row_cell_devicename}>
                      <Text>{data.item.device_devicename}</Text>
                    </View>
                    <View style={customstyle.row_cell_devicename}>
                      <Text>{data.item.user_name}</Text>
                    </View>
                    
                    <View style={customstyle.row_cell_devicename}>
                      <Text>{data.item.user_pickuptime}</Text>
                    </View>
                    
                    <View style={customstyle.row_cell_place}>
                    {data.item.devicestatus == "returned" ? (<Text style={customstyle.row_cell_available}>Available</Text>) : 
                  (<Text style={customstyle.row_cell_temp}>{data.item.device_devicestatus}</Text> ) }
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              renderHiddenItem={ (data, rowMap) => (
                <View style={customstyle.rowBack}>
                  <TouchableOpacity style={[customstyle.backRightBtn, customstyle.backRightBtnRight]} onPress={ _ => this.rightKey(rowMap, data.item.key,data.item.device_assetid,data.item.user_userid) }>
                  <Text style={customstyle.backTextWhite}>Approve</Text>
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