import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, View} from 'react-native';
import {Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

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
       flag: false,
      modules: this.props.navigation.getParam('titleName', ''), //parameter from navigation
    }
    
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
    //If Logic to fetch data from database for Devices or Person List view
    if(this.state.modules == "pending"){ 
      db.transaction(tx => {
        tx.executeSql('select * from entries where entries.pending="yes"', [], (tx, results) => {
          var temp1 = [];
          if(results.rows.length == 0){
              this.setState({flag: false});
          }else{
            this.setState({flag: true});
            //alert(results.rows.length + " " + results.rows.item(0).firstname);
          for (let i = 0; i < results.rows.length; ++i) {
            temp1.push({
              key: `${i}`,
              entries_assetid: results.rows.item(i).assetid,
              entries_devicename: results.rows.item(i).devicename,
              entries_pickuptime: results.rows.item(i).pickuptime,
              entries_userid: results.row.item(i).userid,
              entries_name: results.rows.item(i).firstname + " " + results.rows.item(i).lastname,
              entries_returntime: results.rows.item(i).returntime,
              entries_devicetype: results.rows.item(i).devicetype,
            });
          }
          this.setState({listViewData: temp1,});
        }
        });
      });
      
    }  else if(this.state.modules == "Total Devices"){
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
    if(this.state.modules == "Add/Edit Person"){
      this.props.navigation.push("EditDetails", {titleName:this.state.modules,items: item} );
    } else{
      this.props.navigation.push("EditDetails", {titleName:this.state.modules,items: item} );
    }
  }
  viewOnTap(rowMap, rowKey,item) {
    if(this.state.modules == "Add/Edit Person"){
      this.props.navigation.navigate("ViewDetails", {titleName:this.state.modules,items: item} );
    } else{
      this.props.navigation.navigate("ViewDetails", {titleName:this.state.modules,items: item} );
    }
    
	}
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
  }
  
  render() {
   return (
//Conditional blocks to display listview with Person data or Device data(multiple variations)
    <View style={{flex: 1}}>
      <View style={{flex: 1, paddingBottom:50}}>
        {this.state.modules == "pending" && this.state.flag  == true ? 
         //<View style={customstyle.container}>
         <SwipeListView 
        data={this.state.listViewData}
        keyExtractor={(item,index) => index.toString()}
        renderItem={ (data, rowMap) => (
          <TouchableHighlight
          onPress={ () => this.viewOnTap(rowMap, data.item.key,data.item) }
            style={customstyle.rowFront}
            underlayColor={'#AAA'}
            key={data.item.key}>
          <View style={customstyle.row}>
              <View style={customstyle.row_cell_icon}>
                {data.item.entries_devicetype == "iPhone" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): 
                    data.item.entries_devicetype == "iPad" ? (<Icon name='apple1' type='antdesign' color='#7d7d7d' /> ): (<Icon name='android1' type='antdesign' color='#a4c639' />)}
              </View>
              <View style={customstyle.row_cell_devicename}>
                <Text>{data.item.entries_devicename}</Text>
              </View>
              <View style={customstyle.row_cell_devicename}>
                <Text>{data.item.aentries_ssetid}</Text>
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
      /> //</View>
      : 
        <View style={{flex:1, alignContent: "center"}}>
          <Text>No devices are under review.</Text>
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
      flex: 1,
      marginBottom: 10,
      backgroundColor: '#EBF5FB',
    },
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