import React, {Component} from 'react';
import {Platform, StyleSheet,TouchableOpacity, Text, View, ImageBackground, Button} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class HomePage extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super(props)
    this.state = {
      issuedDevices: 0,
      NotReturned: 0, 
      TotalDevices: 0,
    }
    db.transaction(tx => {
      tx.executeSql('select count(*) as Total, sum(case when devicestatus=="issued" then 1 ELSE 0 END) as IssuedDevices from devices', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          this.setState({TotalDevices: results.rows.item(i).Total});
          this.setState({issuedDevices: results.rows.item(i).IssuedDevices});
        }
      });
    });
  }
  render() {
    const nav = this.props.navigation;
    return (<ScrollView>
      <View style={{flex: 1, paddingBottom: 5}}>
        <View style={{flex: 2}} >
          <ImageBackground
            accessibilityRole={'image'}
            source={require('../images/DIMSplash.png')}
            style={styles.background}
            imageStyle={styles.logo}>
            <Text style={styles.text}>Welcome</Text>
          </ImageBackground>
        </View>
        <View style={{flex:0.5,backgroundColor: '#3498DB', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFFFFF', padding: 5}}>Device Inventory Management</Text>
        </View>
        <View style={{ flex:2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ffffff', padding: 20}}>
          <View style={styles.roundCorner}>
            <Text style={styles.dashText}>{this.state.issuedDevices}</Text>
                <Text style={styles.buttonText}>
                  Issued
                </Text>
          </View>
          <View style={styles.roundCorner}>
          <Text style={styles.dashText}>{this.state.NotReturned}</Text>
                      <Text style={styles.buttonText}>
                        Not Returned
                      </Text>
          </View>
          <View style={styles.roundCorner}>
          <Text style={styles.dashText}>{this.state.TotalDevices}</Text>
                      <Text style={styles.buttonText}>
                        Total Devices
                      </Text>
          </View>
        </View>
        <View  style={{flex: 5, justifyContent: 'space-around' , alignSelf: 'stretch' , alignItems: 'center'}}>
         <TouchableOpacity
            onPress={() => nav.navigate('PersonScan')}
            style={styles.buttonTouch}>
              <Text style={{ color: '#ffffff', fontSize: 15 , fontWeight: 'bold' }}>Reserve A Device</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>  nav.navigate('DeviceList')}
            style={styles.buttonTouch}>

              <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold' }}>View Device List</Text>
          </TouchableOpacity>
             
        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
   
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  background: {
    paddingBottom: 40,
    paddingTop: 40,
    //paddingHorizontal: 32,
    backgroundColor: '#EBF5FB',
  },
  logo: {
    opacity: 0.1,
    overflow: 'visible',
    resizeMode: 'cover',
    marginLeft: 0,
    marginBottom: 0,
  },
  text: {
    fontSize: 40,
    fontWeight: '600',
    textAlign: 'center',
    color: 'black',
  },
  roundCorner:{
    width: 100, height: 100,
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    //paddingTop:20,
    //paddingBottom:20,
    backgroundColor:'#EBF5FB',
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    alignContent: 'center',
    alignItems: 'center',
    
  },
  dashText:{
    fontSize: 40,
    paddingTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  buttonText:{
    fontSize: 12, 
    paddingBottom: 10,
  },
  buttonTouch: {
    backgroundColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: 200,
    flex: 1,
    height: 60,
    marginRight:40,
    marginLeft:40,
    marginTop:20,
    marginBottom: 20,
    borderRadius:10,
    borderColor: '#566573',
  },
});

