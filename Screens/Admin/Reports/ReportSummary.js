import React, {Component} from 'react';
import { StyleSheet, Text, View,Animated,TouchableOpacity,TouchableHighlight} from 'react-native';
import { Button,Avatar} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import {LineChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5
};
const data = [
  {
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Beijing",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "New York",
    population: 8538000,
    color: "#ffffff",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Moscow",
    population: 11920000,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }
];
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
      listType: 'FlatList',
      listViewData: [],
      
    }
    this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });
   
  }
  
	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		//this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
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
        /> 
      </View>
  </View>   
    
  )
  }
}
const customstyle = StyleSheet.create(
  {
    
  });