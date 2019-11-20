import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, View, Picker} from 'react-native';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button, Icon,Avatar, Overlay, Input} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

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
      },headerRight: (
      <Button
        onPress={() => alert("This is help content")}
        title="Help"
        color="#fff"
      /> //Demo button for future use
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
    this.setState({overlaystate: "edit",})
    this.setState({isVisible: true,})
  }
  viewOnTap(rowMap, rowKey,item) {
    this.setState({overlaystate: "view",})
    this.setState({isVisible: true,})
    if(this.state.modules == "Add/Edit Person"){

    } else{
      this.setState({itemDB: item});
    }
	}
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		//this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  }
  showEdit=()=>{
    this.setState({overlaystate: "edit",})
    this.setState({isVisible: true,})
  }
  getDeviceDetails=(mobassetid)=>{
    //this.setState({isVisible: true,})
  }
  
  render() {
   return (
//Conditional blocks to display listview with Person data or Device data(multiple variations)
    <View style={{flex: 1}}>
      {this.state.modules == "Add/Edit Person" ? 
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
      {this.state.overlaystate == "view" ? 
        <Overlay
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}>
            <View style={{flex: 1, flexDirection:'row',alignContent: 'center', justifyContent: 'center', paddingTop: 5}}>
              {this.state.modules == "Add/Edit Person" ?
              <View><Text>This is Persone edit</Text></View>
            :   <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
                  <View style={{flex: 0.5,alignContent: 'center', justifyContent: 'flex-start', backgroundColor: '#EBF5FB', borderBottomWidth: 1, borderBottomColor:'#D5D8DC'}}>
                    <Text style={customstyle.subheader}>Device Details</Text>
                  </View>
                  <View style={{flex: 4, flexDirection:'column',justifyContent: 'space-between', paddingBottom: 5}}>
                      {<View style={customstyle.row_details}>
                        <Text style={customstyle.row_label}>Device Type</Text>
                      {this.state.itemDB.devicetype == "iPhone" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): 
                              this.state.itemDB.devicetype == "iPad" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): (<Icon name='android1' type='antdesign' color='#a4c639' />)}
                        </View> }
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Device Name</Text>
                          <Text style={customstyle.row_value}>{this.state.itemDB.devicename}</Text>
                        </View>
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Device Status</Text>
                          {this.state.device_devicestatus == "returned" ? (<Text style={customstyle.row_cell_available_Value}>Available</Text>) : 
                          (<Text style={customstyle.row_value}>{this.state.itemDB.devicestatus}</Text> ) }
                        </View>
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Team</Text>
                          <Text style={customstyle.row_value}>{this.state.itemDB.team}</Text>
                        </View>
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Location</Text>
                          <Text style={customstyle.row_value}>{this.state.itemDB.location}</Text>
                        </View>
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Device active?</Text>
                          <Text style={customstyle.row_value}>{this.state.itemDB.isactive}</Text>
                        </View> 
                      </View>
                      <View style={{flex: 1, flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 15}}>
                            <Button
                          backgroundColor='#03A9F4'
                          buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                          onPress={() => {this.showEdit()}}
                          title='EDIT' />
                          <Button
                          backgroundColor='#03A9F4'
                          buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                          onPress={() => {this.setState({ isVisible: false })}}
                          title='DONE' />
                    </View>
                </View>    
            }
            </View>
          </Overlay> : 
          null
        }
        {this.state.overlaystate == "edit" ? 
        <Overlay
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}>
            <View style={{flex: 1, flexDirection:'row',alignContent: 'center', justifyContent: 'center', paddingTop: 5}}>
              {this.state.modules == "Add/Edit Person" ?
              <View><Text>This is Persone edit</Text></View>

            :   <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
                  <View style={{flex: 0.5,alignContent: 'center', justifyContent: 'flex-start', backgroundColor: '#EBF5FB', borderBottomWidth: 1, borderBottomColor:'#D5D8DC'}}>
                    <Text style={customstyle.subheader}>Edit Details</Text>
                  </View>
                  <View style={{flex: 4, flexDirection:'column',justifyContent: 'space-between', paddingBottom: 5}}>
                      <View style={customstyle.row_details}>
                      <Text style={customstyle.row_label}>Device Type</Text>
                      <View style={customstyle.row_value}>
                       <Picker
                          selectedValue={this.state.language}
                          style={{height: 50, width: 100}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({language: itemValue})
                          }>
                          <Picker.Item label="Android" value="Android" />
                          <Picker.Item label="AndroidTab" value="AndroidTab" />
                          <Picker.Item label="iPhone" value="iPhone" />
                          <Picker.Item label="iPad" value="iPad" />
                        </Picker>
                      </View>
                        </View>
                        <View style={customstyle.row_details}>
                          <Input label='Device Name' placeholder='Device Name' value={this.state.itemDB.devicename}/>
                        </View>
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Device Status</Text>
                          {this.state.device_devicestatus == "returned" ? (<Text style={customstyle.row_cell_available_Value}>Available</Text>) : 
                          (<Text style={customstyle.row_value}>{this.state.itemDB.devicestatus}</Text> ) }
                        </View>
                        <View style={customstyle.row_details}>
                        <Input label='Team' placeholder='Team Name' value={this.state.itemDB.team}/>
                        </View>
                        <View style={customstyle.row_details}>
                        <Input label='Location' placeholder='Location' value={this.state.itemDB.location}/>
                        </View>
                        <View style={customstyle.row_details}>
                          <Text style={customstyle.row_label}>Device active?</Text>
                          <Text style={customstyle.row_value}>{this.state.itemDB.isactive}</Text>
                        </View> 
                      </View>
                      <View style={{flex: 1, flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 15}}>
                          <Button
                          backgroundColor='#03A9F4'
                          buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                          onPress={() => {this.setState({ isVisible: false })}}
                          title='SAVE' />
                    </View>
                </View>    
            }
            </View>
          </Overlay> : 
          null

        }
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
      alignContent: 'flex-start',
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
      borderRadius: 0.5,
      borderBottomWidth: 0.5,
      borderColor: '#D5D8DC',
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
  });