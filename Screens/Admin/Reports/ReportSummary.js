import React, {Component} from 'react';
import { StyleSheet, Text, View,FlatList,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Card} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {BarChart} from "react-native-chart-kit";
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
      teambased: [],
      locationbased: [],
      teambaseddefault: [],
    }
this.getWeekData('2019-12-29', '2019-12-31');
  }
  
  getWeekData=(fromDate,toDate)=>{
    db.transaction(tx => {
      tx.executeSql('SELECT devices.team as teamname, count(devices.assetid) as noofdevices FROM entries LEFT JOIN devices ON entries.assetid = devices.assetid WHERE strftime("%Y",entries.pickuptime) = strftime("%Y",date("now"))  AND  strftime("%m",entries.pickuptime) = strftime("%m",date("now"))', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            teamname: results.rows.item(i).teamname,
            noofdevices: results.rows.item(i).noofdevices,
          });
        }
        this.setState({teambased: temp,});
      });
    });
    db.transaction(tx => {
      tx.executeSql('SELECT devices.location as teamlocation, count(devices.assetid) as noofdevices FROM entries LEFT JOIN devices ON entries.assetid = devices.assetid WHERE strftime("%Y",entries.pickuptime) = strftime("%Y",date("now"))  AND  strftime("%m",entries.pickuptime) = strftime("%m",date("now"))', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            teamlocation: results.rows.item(i).teamlocation,
            noofdevices: results.rows.item(i).noofdevices,
          });
        }
        this.setState({locationbased: temp,});
      });
    });
    db.transaction(tx => {
      tx.executeSql('SELECT devices.team as teamname, count(entries.defaults) as defaults FROM entries LEFT JOIN devices ON entries.assetid = devices.assetid WHERE strftime("%Y",entries.pickuptime) = strftime("%Y",date("now"))  AND  strftime("%m",entries.pickuptime) = strftime("%m",date("now"))', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push({
            key: `${i}`,
            teamname: results.rows.item(i).teamname,
            defaults: results.rows.item(i).defaults,
          });
          
        }
        this.setState({teambaseddefault: temp,});
      });
    });
    
  }
  render() {
   return (
  <View style={{flex: 1}}>
    <View style={{flex: 0.2, backgroundColor: '#444444'}}>
    <Text style={{color:'#ffffff'}}>Today</Text>
    </View>
    <View style={{flex: 1, backgroundColor: '#EBF5FB'}}>
      <BarChart
        data={{
          labels: ["12-29", "12-30", "12-31", "01-01", "01-02", "01-03"],
          datasets: [
            {data: [20, 45, 28, 80, 99, 43],},
          ],
        }}
        width={Dimensions.get('window').width - 5}
        height={120}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      </View>
      <View style={{flex: 2}}>
        <Card title="Team based Device Usage">{
      <SwipeListView
              data={this.state.teambased}
              keyExtractor={(item,index) => index.toString()}
              renderItem={ (data, rowMap) => (
                <TouchableHighlight
                  style={customstyle.rowFront}
                  underlayColor={'#AAA'}
                  key={data.item.key}
                >
                <View style={customstyle.row}>
                    
                    <View style={customstyle.row_cell_devicename}>
                      <Text>{data.item.teamname}</Text>
                    </View>
                    <View style={customstyle.row_cell_place}>
                      <Text style={customstyle.row_cell_temp}>{data.item.noofdevices}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />}</Card>
            <Card title="Location based Device Usage">{
      <SwipeListView
              data={this.state.locationbased}
              keyExtractor={(item,index) => index.toString()}
              renderItem={ (data, rowMap) => (
                <TouchableHighlight
                  style={customstyle.rowFront}
                  underlayColor={'#AAA'}
                  key={data.item.key}
                >
                <View style={customstyle.row}>
                    
                    <View style={customstyle.row_cell_devicename}>
                      <Text>{data.item.teamlocation}</Text>
                    </View>
                    <View style={customstyle.row_cell_place}>
                      <Text style={customstyle.row_cell_temp}>{data.item.noofdevices}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />}</Card>
            <Card title="Team based Defaulted Entries">{
      <SwipeListView
              data={this.state.teambaseddefault}
              keyExtractor={(item,index) => index.toString()}
              renderItem={ (data, rowMap) => (
                <TouchableHighlight
                  style={customstyle.rowFront}
                  underlayColor={'#AAA'}
                  key={data.item.key}
                >
                <View style={customstyle.row}>
                    
                    <View style={customstyle.row_cell_devicename}>
                      <Text>{data.item.teamname}</Text>
                    </View>
                    <View style={customstyle.row_cell_place}>
                      <Text style={customstyle.row_cell_temp}>{data.item.defaults}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />}</Card>
      </View>
      
  </View>   
    
  )
  }
}
const customstyle = StyleSheet.create(
  {
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
    row_cell_devicename: {
      flex: 1,
      paddingLeft: 10,
      flexDirection: 'column',
    },    
    row_cell_temp: {
      color: '#111111',
      paddingLeft: 10,
      flex: 0,
    },
    row_cell_place: {
      flexDirection: 'column',
      paddingRight: 10,
    },
  });