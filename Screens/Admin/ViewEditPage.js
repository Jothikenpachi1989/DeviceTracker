import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, View} from 'react-native';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button, Icon,Avatar, Overlay, Input, CheckBox} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ToggleButton } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
let loc = [{ value: 'Chennai', }, { value: 'Hydrebad', }];
let deviceActive = [{ value: 'y', }, { value: 'n', }];
let team = [{ value: 'MDACHE', }, { value: 'MDAHYD', }];

export default class ViewEditPage extends React.Component {
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
        title="Add"
        color="#fff"
      /> //Demo button for future use
    ),
  });
  constructor (props) {
    super(props)
    this.state = {
      listType: 'FlatList',
      listViewData: [],
      
      //overlaystate: "none",
      isVisible: false,
      overlaystate: this.props.navigation.getParam('titleName', ''), //parameter from navigation
      itemDB: this.props.navigation.getParam('items', ''),
    }
    
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    
  }
  render() {
   return (
//Conditional blocks to display listview with Person data or Device data(multiple variations)
    <View style={{flex: 1}}> 
      {this.state.overlaystate == "view" ? 
        <View style={{flex: 1, flexDirection:'row',alignContent: 'center', justifyContent: 'center', paddingTop: 0}}>
          {this.state.modules == "Add/Edit Person" ?
          <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
          <View style={{flex: 0.4,alignContent: 'center', justifyContent: 'flex-start', backgroundColor: '#EBF5FB', borderBottomWidth: 1, borderBottomColor:'#D5D8DC'}}>
            <Text style={customstyle.subheader}>Person Details</Text>
          </View>
          <View style={{flex: 4, flexDirection:'column',justifyContent: 'space-between', paddingBottom: 5}}>
            <View style={customstyle.row_details}>
                  <Text style={customstyle.row_label}>User ID</Text>
                  <Text style={customstyle.row_value}>{this.state.itemDB.userid}</Text>
                </View>
                <View style={customstyle.row_details}>
                  <Text style={customstyle.row_label}>Person Name</Text>
                  <Text style={customstyle.row_value}>{this.state.itemDB.name}</Text>
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
                  <Text style={customstyle.row_label}>is Admin?</Text>
                  <Text style={customstyle.row_value}>{this.state.itemDB.isadmin}</Text>
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
        :   <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
              <View style={{flex: 0.4,alignContent: 'center', justifyContent: 'flex-start', backgroundColor: '#EBF5FB', borderBottomWidth: 1, borderBottomColor:'#D5D8DC'}}>
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
            </View>: 
          null
        }
        {this.state.overlaystate == "edit" ? 
            <View style={{flex: 1, flexDirection:'row',alignContent: 'center', justifyContent: 'center', paddingTop: 0}}>
              {this.state.modules == "Add/Edit Person" ?
             <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
             <View style={{flex: 0.3,alignContent: 'center', justifyContent: 'flex-start', backgroundColor: '#EBF5FB', borderBottomWidth: 1, borderBottomColor:'#D5D8DC'}}>
               <Text style={customstyle.subheader}>Edit Details</Text>
             </View>
             <View style={{flex: 4, flexDirection:'column',justifyContent: 'space-between', paddingBottom: 10}}>
                   <View style={customstyle.row_details2}>
                     <Input onChangeText={text=>this.setState({text})} defaultValue={this.state.itemDB.fname}
                     label='First Name' placeholder='First Name' value={this.state.text} labelStyle={customstyle.labelSTY}/>
                   </View>
                   <View style={customstyle.row_details2}>
                     <Input label='Last Name' placeholder='Last Name' value={this.state.itemDB.lname} labelStyle={customstyle.labelSTY}/>
                   </View>
                   <View style={customstyle.row_details2}>
                    <Dropdown label='Team' data={team} value={this.state.itemDB.team} containerStyle={customstyle.dropdown} labelFontSize={14.0} />
                   </View>
                    <View style={customstyle.row_details2}>
                    <Dropdown label='Location' data={loc} value={this.state.itemDB.location} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                   </View>
                   <View style={customstyle.row_details2}>
                    <Dropdown label='Is Admin?' data={deviceActive} value={this.state.itemDB.isadmin} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                   </View>
                 </View>
                 <View style={{flex: 0.2, flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10}}>
                     <Button
                     backgroundColor='#03A9F4'
                     buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                     onPress={() => {this.setState({ isVisible: false })}}
                     title='SAVE' />
               </View>
           </View>    
            :   <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
                  <View style={{flex: 0.3,alignContent: 'center', justifyContent: 'flex-start', backgroundColor: '#EBF5FB', borderBottomWidth: 1, borderBottomColor:'#D5D8DC'}}>
                    <Text style={customstyle.subheader}>Edit Details</Text>
                  </View>
                  <View style={{flex: 4, flexDirection:'column',justifyContent: 'space-between', paddingBottom: 10}}>
                      <View style={customstyle.row_details2}>
                        <Text>{}</Text>
                      <ToggleButton.Row
                        onValueChange={value => this.setState({ value })}
                        value={this.state.itemDB.devicetype} >
                          <ToggleButton icon="cellphone-android" value="Android"/>
                          <ToggleButton icon="tablet-android" value="AndroidTab" />
                          <ToggleButton icon="cellphone-iphone" value="iPhone" />
                          <ToggleButton icon="tablet-ipad" value="iPad" />
                      </ToggleButton.Row>
                      </View>
                        <View style={customstyle.row_details2}>
                          <Input label='Device Name' placeholder='Device Name' value={this.state.itemDB.devicename} labelStyle={customstyle.labelSTY}/>
                        </View>
                        <View style={customstyle.row_details2}>
                         <Dropdown label='Team' data={team} value={this.state.itemDB.team} containerStyle={customstyle.dropdown} labelFontSize={14.0} />
                        </View>
                         <View style={customstyle.row_details2}>
                         <Dropdown label='Location' data={loc} value={this.state.itemDB.location} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                        </View>
                        <View style={customstyle.row_details2}>
                         <Dropdown label='Device active?' data={deviceActive} value={this.state.itemDB.isactive} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                        </View>
                      </View>
                      <View style={{flex: 0.2, flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10}}>
                          <Button
                          backgroundColor='#03A9F4'
                          buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                          onPress={() => {this.setState({ isVisible: false })}}
                          title='SAVE' />
                    </View>
                </View>    
            }
            </View> : 
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
    dropdown:{
      width: '80%',
      paddingLeft: 10,
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
  });