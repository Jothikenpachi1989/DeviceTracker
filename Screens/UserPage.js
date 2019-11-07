import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Avatar, Badge } from 'react-native-elements';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
var profilepic = '../images/profile-icon.png';

export default class UserPage extends React.Component {
  static navigationOptions = ({navigation})=>({
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
      headerLeft: null,
    headerRight: (
       <Button
       onPress={() => {
        Alert.alert(
          'Alert',
          'Are you sure you want to log out?',
          [
            {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
            {text: 'Yes', onPress: () => navigation.navigate('HomeScreen')},
          ],
          {cancelable: false},
        ); 
       }}
        icon={<Icon name='open-in-new' size={25} color='#ffffff' />}
        title='Log out'
      />
    ),
  });
  constructor (props) {
    super(props)
    this.state = {
      listType: 'FlatList',
			listViewData: [],
    };
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    this.state = {
      id: props.navigation.state.params.itemId,
      uname: '',
      isadmin: '',
      nofdevices: 0,
    }
    db.transaction(tx => {
      tx.executeSql('SELECT firstname, lastname,isadmin from users where userid = ?', [this.state.id], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          this.setState({uname: results.rows.item(i).firstname + " " + results.rows.item(i).lastname});
          this.setState({isadmin: results.rows.item(i).isadmin});
        }
      });
    });
    db.transaction(tx => {
      tx.executeSql('SELECT assetid,devicename, userid,pickuptime, firstname, devicetype, team, location FROM issued_devices_details where userid = ?', [this.state.id], (tx, results) => {
        var temp = [];
        this.setState({nofdevices : results.rows.length});
        this.setState({listViewData: [this.state.nofdevices]});
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            assetid: results.rows.item(i).assetid,
            devicename: results.rows.item(i).devicename,
            devicetype: results.rows.item(i).devicetype,
            team: results.rows.item(i).team,
            pickuptime: results.rows.item(i).pickuptime
          });  
        }
        this.setState({listViewData: temp,});
      });
    });
  }
  navigateToHome=()=>{
    Alert.alert(
      'Alert',
      'Are you sure you want to log out?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
        {text: 'Yes', onPress: () => this.props.navigation.navigate('HomeScreen')},
      ],
      {cancelable: false},
    ); 
  }
  closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}
	deleteRow(rowMap, rowKey,mobassetid) {
		this.closeRow(rowMap, rowKey);
		const newData = [...this.state.listViewData];
    const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
    this.updateDeviceEntry(mobassetid);
		newData.splice(prevIndex, 1);
		this.setState({listViewData: newData});
	}
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		//this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  }
  updateDeviceEntry = (mobassetid) => {
    var flag = false;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var timestamp = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec;
        db.transaction((tx)=> {
            tx.executeSql(
              'update entries SET returntime = ? where assetid = ? AND returntime is NULL',
              [timestamp,mobassetid],
              (tx, results) => {
                console.log('Results',results.rowsAffected);
                if(results.rowsAffected>0){
                  flag = true;
                }else{
                  alert('Return Failed');
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
                  alert('Device returned successfully');
                }else{
                  alert('Return Failed');
                }
              }
            );
          });
          
  };
  render() {    
  return (
    <View style={customstyle.container}>
      <View style={customstyle.userRow}>
          <View style={customstyle.userImage}>
          <Avatar rounded icon={{ name: 'person' }} />
          </View>
          <View>
            <Text style={{ color: 'gray', fontSize: 16,}} >{this.state.uname} </Text>
          </View>
          <Badge value={"# of devices : " + this.state.nofdevices} status="success"></Badge>
           </View>
        
           <View style={customstyle.container}>
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
                  <View style={customstyle.row_cell_devicename}>
                    <Text>{data.item.assetid}</Text>
                  </View>
                  <View style={customstyle.row_cell_place}>
                    <Text>{data.item.team}</Text>
                  </View>
                </View>
							</TouchableHighlight>
						)}
						renderHiddenItem={ (data, rowMap) => (
							<View style={customstyle.rowBack}>
								<TouchableOpacity style={[customstyle.backRightBtn, customstyle.backRightBtnRight]} onPress={ _ => this.deleteRow(rowMap, data.item.key,data.item.assetid) }>
                <Text style={customstyle.backTextWhite}>Return</Text>
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

        <View style={ customstyle.bottomView} >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('DeviceScanPage',{itemId : this.state.id, name: this.state.uname,admin:this.state.isadmin})}
          style={customstyle.button}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>Add More Device</Text>
        </TouchableOpacity> 
        
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
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 3,
      backgroundColor: '#FFFFFF',
      borderBottomColor:'#808080',
    },
    userImage: {
      marginRight: 12,
    },
    container: {
      marginTop: 10,
      alignSelf: "stretch",
      flex: 1,
      marginBottom: 10,

      backgroundColor: '#EBF5FB',
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
    backTextWhite: {
      color: '#FFF'
    },
    rowFront: {
      alignItems: 'center',
      backgroundColor: '#EBF5FB',
      justifyContent: 'center',
      height: 60,
      borderColor: '#D5D8DC',
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
    backRightBtnLeft: {
      backgroundColor: 'blue',
      right: 75
    },
    backRightBtnRight: {
      backgroundColor: 'red',
      right: 0
    },
    trash: {
      height: 25,
      width: 25,
    },
    button: {
      backgroundColor: '#3498DB',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      width: 200,
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      marginBottom: 10,
      borderRadius:10,
    },
  });