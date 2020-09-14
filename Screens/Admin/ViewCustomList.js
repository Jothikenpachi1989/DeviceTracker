import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, View} from 'react-native';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button, Icon,Avatar, Overlay, Input, CheckBox} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
let loc = [{ value: 'Chennai', }, { value: 'Hydrebad', }];
let deviceActive = [{ value: 'y', }, { value: 'n', }];
let team = [{ value: 'MDACHE', }, { value: 'MDAHYD', }];

export default class ViewCustomList extends React.Component {
  static navigationOptions = ({navigation})=>({
    headerTitle: navigation.getParam('titleName', ''),
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
        <TouchableOpacity
        onPress={() => navigation.navigate('AdminPage',)}
        style={{paddingRight:10,}}>
          <Text style={{ color: '#FFF', fontSize: 14 }}>back</Text>
      </TouchableOpacity> 
    ),
  });
  constructor (props) {
    super(props)
    this.state = {
      listType: 'FlatList',
      listViewData: [],
      itemDB: [],
      overlaystate: "none",
      isVisible: false,
      modules: this.props.navigation.getParam('titleName', ''), //parameter from navigation
    }
    
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    //If Logic to fetch data from database for Devices or Person List view
    if(this.state.modules == "Add/Edit Device"){ 
      db.transaction(tx => {
        tx.executeSql('select * from devices', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push({
              key: `${i}`,
              assetid: results.rows.item(i).assetid,
              location: results.rows.item(i).location,
              devicename: results.rows.item(i).devicename,
              devicetype: results.rows.item(i).devicetype,
              team: results.rows.item(i).team,
              devicestatus: results.rows.item(i).devicestatus,
              os: results.rows.item(i).OS,
              isactive: results.rows.item(i).isactive,
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
    } else if(this.state.modules == "Add/Edit Person"){ 
      db.transaction(tx => {
        tx.executeSql('select * from users', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push({
              key: `${i}`,
              userid: results.rows.item(i).userid,
              location: results.rows.item(i).location,
              fname: results.rows.item(i).firstname,
              lname: results.rows.item(i).lastname,
              name: results.rows.item(i).firstname + " " + results.rows.item(i).lastname,
              isadmin: results.rows.item(i).isadmin,
              team: results.rows.item(i).team
            });
          }
          this.setState({listViewData: temp,});
        });
      });
    } else if(this.state.modules == "Issued Devices"){
      db.transaction(tx => {
        tx.executeSql('select * from devices where devicestatus="issued"', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push({
              key: `${i}`,
              assetid: results.rows.item(i).assetid,
              location: results.rows.item(i).location,
              devicename: results.rows.item(i).devicename,
              devicetype: results.rows.item(i).devicetype,
              team: results.rows.item(i).team,
              devicestatus: results.rows.item(i).devicestatus,
              os: results.rows.item(i).OS
            });
          }
          this.setState({listViewData: temp,});
        });
      });
    } else if(this.state.modules == "Not Returned"){
      db.transaction(tx => {
        tx.executeSql('select * from entries where returntime is NULL', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push({
              key: `${i}`,
              assetid: results.rows.item(i).assetid,
              location: results.rows.item(i).location,
              devicename: results.rows.item(i).devicename,
              devicetype: results.rows.item(i).devicetype,
              team: results.rows.item(i).team,
              devicestatus: results.rows.item(i).devicestatus,
              os: results.rows.item(i).OS,
              isactive: results.rows.item(i).isactive,
            });
          }
          this.setState({listViewData: temp,});
        });
      });
    } else if(this.state.modules == "Total Devices"){
      db.transaction(tx => {
        tx.executeSql('select * from devices', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push({
              key: `${i}`,
              assetid: results.rows.item(i).assetid,
              location: results.rows.item(i).location,
              devicename: results.rows.item(i).devicename,
              devicetype: results.rows.item(i).devicetype,
              team: results.rows.item(i).team,
              devicestatus: results.rows.item(i).devicestatus,
              os: results.rows.item(i).OS,
              isactive: results.rows.item(i).isactive,
            });
          }
          this.setState({listViewData: temp,});
        });
      });
    }
  }
  closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}
	rightKey(rowMap, rowKey,mobassetid) {
    this.closeRow(rowMap, rowKey);
  }
  edit(rowMap, rowKey,item) {
    /*this.setState({overlaystate: "edit",})
    this.setState({isVisible: true,})
    this.setState({itemDB: item})*/
    if(this.state.modules == "Add/Edit Person"){
      this.props.navigation.push("EditDetails", {titleName:this.state.modules,items: item} );
    } else{
      this.props.navigation.push("EditDetails", {titleName:this.state.modules,items: item} );
    }
  }
  viewOnTap(rowMap, rowKey,item) {
    /*this.setState({overlaystate: "view",})
    this.setState({isVisible: true,}) */
    if(this.state.modules == "Add/Edit Person"){
      this.props.navigation.navigate("ViewDetails", {titleName:this.state.modules,items: item} );
    } else{
      this.props.navigation.navigate("ViewDetails", {titleName:this.state.modules,items: item} );
    }
    
	}
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		//this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  }
  
  render() {
   return (
//Conditional blocks to display listview with Person data or Device data(multiple variations)
    <View style={{flex: 1}}>
      <View style={{flex: 1, paddingBottom:50}}>
        {this.state.modules == "Add/Edit Person" ? 
        <SwipeListView
          data={this.state.listViewData}
          keyExtractor={(item,index) => index.toString()}
          renderItem={ (data, rowMap) => (
            <TouchableHighlight
            onPress={ () => this.viewOnTap(rowMap, data.item.key,data.item) }
              style={customstyle.rowFront}
              underlayColor={'#AAA'}
              key={data.item.key}
            >
            <View style={customstyle.row}>
            <View style={customstyle.row_cell_icon}>
            <Avatar rounded icon={{ name: 'person' }} />
            </View>
                <View style={customstyle.row_cell_devicename}>
                  <Text>{data.item.name}</Text>
                </View>
                <View style={customstyle.row_cell_devicename}>
                  <Text>{data.item.userid}</Text>
                </View>
                <View style={customstyle.row_cell_place}>
                <Button title="Edit" type="clear" onPress={ () => this.edit(rowMap, data.item.key,data.item) }/> 
              </View>
              </View>
            </TouchableHighlight>
          )}
          renderHiddenItem={ (data, rowMap) => (
            <View style={customstyle.rowBack}>
              <TouchableOpacity style={[customstyle.backRightBtn, customstyle.backRightBtnRight]} onPress={ _ => this.rightKey(rowMap, data.item.key,data.item.userid) }>
              <Text style={customstyle.backTextWhite}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-70}
          onSwipeValueChange={this.onSwipeValueChange}
        />  : 
        <SwipeListView
        data={this.state.listViewData}
        keyExtractor={(item,index) => index.toString()}
        renderItem={ (data, rowMap) => (
          <TouchableHighlight
          onPress={ () => this.viewOnTap(rowMap, data.item.key,data.item) }
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
                <Button title="Edit" type="clear" onPress={ () => this.edit(rowMap, data.item.key,data.item) }/> 
              </View>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenItem={ (data, rowMap) => (
          <View style={customstyle.rowBack}>
            <TouchableOpacity style={[customstyle.backRightBtn, customstyle.backRightBtnRight]} onPress={ _ => this.rightKey(rowMap, data.item.key,data.item.assetid,data.item.devicestatus) }>
            <Text style={customstyle.backTextWhite}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-70}
        onSwipeValueChange={this.onSwipeValueChange}
      /> 
        }
      </View>
      <View style={customstyle.bottomView} >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('AddDetails',{titleName:this.state.modules})}
          style={customstyle.button}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>Add New</Text>
        </TouchableOpacity> 
        
        </View>
  </View>   
    
  )
  }
}
const customstyle = StyleSheet.create(
  {
    bottomView:{
      width: '100%', 
      height: 50, 
      flex: 5,
      backgroundColor: '#FFFFFF', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      tintColor: '#ffffff',
    },
    labelSTY:{
      fontWeight: 'normal',
      fontSize: 14,
    },
    subheader:{
      elevation: 1,
      fontSize: 18,
      alignContent: 'flex-start',
      fontWeight: 'bold',
      color: '#808B96',
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 10,
      marginRight: 10,
      alignSelf: 'center',
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
      borderColor: '#D5D8DC',
      borderBottomWidth: 1, 
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'space-between', // main axis
      alignItems: 'center', // cross axis
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      marginLeft: 5,
      marginRight: 5,
    },
    row_details2: {
      borderColor: '#D5D8DC',
      backgroundColor: '#ffffff',
      flex: 1,
      flexDirection: 'row',  // main axis
      justifyContent: 'space-between', // main axis
      alignItems: 'center', // cross axis
      paddingTop: 5,
      paddingBottom: 5,
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
      paddingLeft: 20,
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
      height: 50,
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