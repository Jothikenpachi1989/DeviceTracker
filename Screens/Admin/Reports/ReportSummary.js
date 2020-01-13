import React, {Component} from 'react';
import { StyleSheet, Text, View,Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button,Avatar} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {LineChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

export default class ReportSummary extends React.Component {
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
      entriesViewData: [],

    }
this.getWeekData('2019-12-29', '2019-12-31');
  }
  
  getWeekData=(fromDate,toDate)=>{
    
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM entries', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            assetid: results.rows.item(i).assetid,
            pickuptime: results.rows.item(i).pickuptime,
            devicename: results.rows.item(i).devicename,
            returntime: results.rows.item(i).returntime,
          });
        }
        alert(results.rows.length);
        this.setState({entriesViewData: temp,});
      });
    });
    
  }
  render() {
   return (
  <View style={{flex: 1}}>
    <View style={{flex: 0.2, backgroundColor: '#444444'}}>
    </View>
      <View style={{flex: 1, backgroundColor: '#EBF5FB'}}>
      <LineChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel={"$"}
    yAxisSuffix={"k"}
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
    
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
      </View>
      <View style={{flex: 2}}>
      <SwipeListView
          data={this.state.entriesViewData}
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
              <TouchableOpacity style={[customstyle.backRightBtn, customstyle.backRightBtnRight]} onPress={ _ => this.rightKey(rowMap, data.item.key,data.item.userid) }>
              <Text style={customstyle.backTextWhite}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-70}
          onSwipeValueChange={this.onSwipeValueChange}
        /> 
      </View>
  </View>   
    
  )
  }
}
const customstyle = StyleSheet.create(
  {
    
  });