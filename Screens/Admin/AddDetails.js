import React, {Component} from 'react';
import { StyleSheet, Text,  View} from 'react-native';
import {Animated,TouchableOpacity,Alert} from 'react-native';
import { Input} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Dropdown } from 'react-native-material-dropdown';
import {KeyboardAvoidingView} from 'react-native';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
let loc = [{ value: 'Chennai', }, { value: 'Hydrebad', }];
let flag = [{ value: 'y', }, { value: 'n', }];
let team = [{ value: 'MDACHE', }, { value: 'MDAHYD', }];
let devicetype = [{ value: 'Android', }, { value: 'iPhone', },{ value: 'AndroidTab', }, { value: 'iPad', }];

export default class AddDetails extends React.Component {
  static navigationOptions = ({navigation})=>({
    headerTitle: "Add New",
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
       newUserId:"",
       updateVal: [],
      isVisible: false,
      modules: this.props.navigation.getParam('titleName', ''), //parameter from navigation
     }
  }
  onChange = (key, val) => {
    if(this.state.modules == "Add/Edit Person"){ 
      if(key=="fname"){
        this.state.updateVal.fname= val;
      } else if(key=="lname"){
        this.state.updateVal.lname= val;
      } else if(key=="team"){
        this.state.updateVal.team= val;
      }else if(key=="location"){
        this.state.updateVal.location= val;
      }else if(key=="isAdmin"){
        this.state.updateVal.isadmin= val;
      }
    }else{
      if(key=="devicename"){
        this.state.updateVal.devicename= val;
      } else if(key=="devicetype"){
        this.state.updateVal.devicetype= val;
      } else if(key=="team"){
        this.state.updateVal.team= val;
      }else if(key=="location"){
        this.state.updateVal.location= val;
      }else if(key=="isActive"){
        this.state.updateVal.isactive= val;
      }
    }
  }
  generateUserId=()=>{
    db.transaction(tx => {
      tx.executeSql('select * from users where location=?', [this.state.updateVal.location], (tx, results) => {
        if(this.state.updateVal.location == "Chennai"){
          this.setState({newUserId:"mcl-" + (results.rows.length+1)});
        }else{
          this.setState({newUserId:"hyd-" + (results.rows.length+1)});
        }    
      });
    });
  }
  updateChangesToDB=()=>{
    if(this.state.modules == "Add/Edit Person"){
      this.generateUserId(); //generate user id from the existing list
      alert(this.state.newUserId);
      db.transaction((tx)=> {
        tx.executeSql(
          'INSERT INTO users [(userId, firstname, lastname, isadmin, location, team)] VALUES (?,?,?,?,?,?)',
          ["mcl-7", this.state.updateVal.fname, this.state.updateVal.lname, this.state.updateVal.isadmin, this.state.updateVal.location, this.state.updateVal.team],
          (tx, results) => {
            console.log('Results',results.rowsAffected);
            alert(results.rowsAffected);
            if(results.rowsAffected>0){
              Alert.alert( 'Success', 'User details added successfully',
                [
                  {text: 'Ok', onPress: () => this.props.navigation.push('ViewCustomList', {titleName:"Add/Edit Person"})},
                  //{text: 'Ok', onPress: () => this.props.},
                ],
                { cancelable: false }
              );
            }else{
              alert('INSERT Failed');
            }
          });
        });
    } else{
      
    }
    
  }
  render() {
   return (
//Conditional blocks to display listview with Person data or Device data(multiple variations)
//<KeyboardAvoidingView style={{flex:1,}} behavior="padding" enabled>
    <View style={{flex: 1}}> 
      {this.state.modules == "Add/Edit Person" ?
          <View style={{flex: 1, flexDirection: 'column',justifyContent: 'flex-start', borderWidth: 1, borderColor: '#D5D8DC'}}>
             <View style={{flex: 1, flexDirection:'column', paddingBottom: 5}}>
                   <View style={customstyle.row_details2}>
                     <Input onChangeText={fname=>this.onChange('fname',fname)} defaultValue={""}
                     label='First Name' placeholder='First Name' value={this.state.fname} labelStyle={customstyle.labelSTY}/>
                   </View>
                   <View style={customstyle.row_details2}>
                     <Input onChangeText={lname=>this.onChange('lname',lname)} defaultValue={""}
                     label='Last Name' placeholder='Last Name' value={this.state.lname} labelStyle={customstyle.labelSTY}/>
                   </View>
                   <View style={customstyle.row_details2}>
                    <Dropdown onChangeText={team => this.onChange('team',team)} 
                    label='Team' data={team} value={""} containerStyle={customstyle.dropdown} labelFontSize={14.0} />
                   </View>
                    <View style={customstyle.row_details2}>
                    <Dropdown onChangeText={loc => this.onChange('location',loc)}
                    label='Location' data={loc} value={""} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                   </View>
                   <View style={customstyle.row_details2}>
                    <Dropdown onChangeText={flag => this.onChange('isAdmin',flag)}
                    label='Is Admin?' data={flag} value={"n"} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                   </View>
            </View>
            <View style={{flex: 0.2, flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 5}}>
                <TouchableOpacity
                  onPress={() => {this.updateChangesToDB()}}
                  style={customstyle.button}>
                    <Text style={{ color: '#FFF', fontSize: 14 }}>SAVE</Text>
                </TouchableOpacity>
            </View>
           </View>    
            :   <View style={{flex: 1, flexDirection: 'column',justifyContent: 'flex-start', borderWidth: 1, borderColor: '#D5D8DC'}}>
                  <View style={{flex: 1, flexDirection:'column', paddingBottom: 5, paddingLeft:5}}>
                    <View style={customstyle.row_details2}>
                         <Dropdown onChangeText={devicetype=>this.onChange('devicetype',devicetype)}
                         label='Device Type' data={devicetype} value={this.state.updateVal.devicetype} containerStyle={customstyle.dropdown} labelFontSize={14.0} />
                        </View>
                    
                      <View style={customstyle.row_details2}>
                        <Input onChangeText={name=>this.onChange('devicename',name)} defaultValue={""}
                          label='Device Name' placeholder='Device Name' value={this.state.name} labelStyle={customstyle.labelSTY}/>
                        </View>
                        <View style={customstyle.row_details2}>
                         <Dropdown onChangeText={team=>this.onChange('team',team)}
                         label='Team' data={team} value={""} containerStyle={customstyle.dropdown} labelFontSize={14.0} />
                        </View>
                         <View style={customstyle.row_details2}>
                         <Dropdown onChangeText={loc => this.onChange('location',loc)}
                         label='Location' data={loc} value={""} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                        </View>
                        <View style={customstyle.row_details2}>
                         <Dropdown onChangeText={flag => this.onChange('isActive',flag)}
                         label='Device active?' data={flag} value={"y"} containerStyle={customstyle.dropdown}  labelFontSize={14.0} />
                        </View>
                      </View>
                    <View style={{flex: 0.2, flexDirection: 'row',alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 5}}>
                        <TouchableOpacity
                          onPress={() => {this.updateChangesToDB()}}
                          style={customstyle.button}>
                            <Text style={{ color: '#FFF', fontSize: 14 }}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>    
            }
        </View>
        //</KeyboardAvoidingView> 
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
    button: {
      backgroundColor: '#03A9F4',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      width: 200,
      marginRight:40,
      marginLeft:40,
      marginTop:20,
      marginBottom: 20,
      borderRadius:10,
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