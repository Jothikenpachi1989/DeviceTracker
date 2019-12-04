import React, {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {Animated} from 'react-native';
import { Button, Icon} from 'react-native-elements';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
let loc = [{ value: 'Chennai', }, { value: 'Hydrebad', }];
let deviceActive = [{ value: 'y', }, { value: 'n', }];
let team = [{ value: 'MDACHE', }, { value: 'MDAHYD', }];

export default class ViewDetails extends React.Component {
  static navigationOptions = ({navigation})=>({
    headerTitle: "View Details",
    headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#2F95D6',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 3,
      },
      headerTitleStyle: {
        fontSize: 18,
      },headerRight: (
      null
    ),
  });
  constructor (props) {
    super(props)
    this.state = {
      itemDB: [],
      isVisible: false,
      itemDB: this.props.navigation.getParam('items',''),
      modules: this.props.navigation.getParam('titleName', ''), //parameter from navigation
      
    }
  //alert(this.state.itemDB.userid);
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    }); 
  }
  showEdit=()=>{
    //this.setState({overlaystate: "edit",})
    //this.setState({isVisible: true,})
    if(this.state.modules == "Add/Edit Person"){
      this.props.navigation.navigate("EditDetails", {titleName:this.state.modules,items: this.state.itemDB} );
    } else{
      this.props.navigation.navigate("EditDetails", {titleName:this.state.modules,items: this.state.itemDB} );
    }
  }
  render() {
   return (
//Conditional blocks to display listview with Person data or Device data(multiple variations)
    <View style={{flex: 1}}> 
        <View style={{flex: 1, flexDirection:'row',alignContent: 'center', justifyContent: 'center', paddingTop: 0}}>
          {this.state.modules == "Add/Edit Person" ?
          <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
          <View style={{flex: 4, flexDirection:'column',justifyContent: 'flex-start', paddingBottom: 0}}>
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
                  onPress={() => {this.showEdit(this.state.itemDB)}}
                  title='EDIT' />
                  <Button
                      backgroundColor='#FA8072'
                      type='outline'
                      buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                      onPress={() => {this.setState({ isVisible: false })}}
                      title='DELETE' />
            </View>
        </View> 
        :   <View style={{flex: 1, flexDirection: 'column',justifyContent: 'space-between', borderWidth: 1, borderColor: '#D5D8DC'}}>
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
                      onPress={() => {this.showEdit(this.state.itemDB)}}
                      title='EDIT' />
                     <Button
                      backgroundColor='#FA8072'
                      type='outline'
                      buttonStyle={{borderRadius: 0, marginLeft: 10, marginRight: 10, marginBottom: 0, height:30, width:100}}
                      onPress={() => {this.setState({ isVisible: false })}}
                      title='DELETE' />
                </View>
            </View>    
            }
            </View>
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
      //paddingTop: 5,
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
      //paddingTop: 5,
      //paddingBottom: 5,
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