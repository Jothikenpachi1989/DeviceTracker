import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, View,ImageBackground, Text} from 'react-native';
import { ListItem, Badge} from 'react-native-elements';
var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const list = [
  {
    title: 'Add/Edit Device',
    icon: 'av-timer',
    link: 'ViewCustomList'
  },
  {
    title: 'Add/Edit Person',
    icon: 'flight-takeoff',
    link: 'ViewCustomList'
  },
  {
    title: 'Reports',
    icon: 'av-timer',
    link: 'ReportSummary'
  },
  {
    title: 'Settings',
    icon: 'flight-takeoff',
    link: 'ViewCustomList'
  },
  {
    title: 'LogOut',
    icon: 'flight-takeoff',
    link: 'ViewCustomList'
  },
]
export default class AdminPage extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    userId = this.props.navigation.getParam('itemId', '');
    PersonName = this.props.navigation.getParam('name','');
    this.state={
      issuedDevices: 0,
      NotReturned: 0, 
      TotalDevices: 0,
      pendingDevices: 0,
    }
    db.transaction(tx => {
      tx.executeSql('select count(*) as Total, sum(case when devicestatus=="issued" then 1 ELSE 0 END) as IssuedDevices from devices', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          this.setState({TotalDevices: results.rows.item(i).Total});
          this.setState({issuedDevices: results.rows.item(i).IssuedDevices});
        }
      });
    });
    db.transaction(tx => {
      tx.executeSql('select count(*) as NotReturned from entries where defaults="Y" AND returntime is NULL', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          this.setState({NotReturned: results.rows.item(i).NotReturned});
        }
      });
    });
    db.transaction(tx => {
      tx.executeSql('select sum(case when devicestatus=="pending" then 1 ELSE 0 END) as Pending from devices', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          this.setState({pendingDevices: results.rows.item(i).Pending});
        }
      });
    });
   }
  render() {
    const nav = this.props.navigation;
    return (
    <View style={{flex: 1}}>
      <View style={{flex: 2}} >
        <ImageBackground
          accessibilityRole={'image'}
          source={require('../../images/DIMSplash.png')}
          style={styles.background}
          imageStyle={styles.logo}>
          <Text style={styles.text}>Welcome, {this.PersonName}</Text>
        </ImageBackground>
      </View>
      <View style={{flex:0.5}}>
      <View style={{backgroundColor: '#FA8072', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#FFFFFF', padding: 5}}>Super User Dashboard</Text>
        </View>
      </View>
      <View style={{ flex:2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ffffff', padding: 10}}>
        <View style={styles.roundCorner}>
          <TouchableOpacity onPress={()=>{this.props.navigation.push("ViewCustomList", {titleName:"Issued Devices"})}}
                  style={styles.button}>
                    <Text style={styles.dashText}>{this.state.issuedDevices}</Text>
                    <Text style={styles.buttonText}>
                      Issued Devices
                    </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.roundCorner}>
          <TouchableOpacity onPress={()=>{this.props.navigation.push("ViewCustomList", {titleName:"Not Returned"})}}
                  style={styles.button}>
                    <Text style={styles.dashText}>{this.state.NotReturned}</Text>
                    <Text style={styles.buttonText}>
                      Not Returned
                    </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.roundCorner}>
          <TouchableOpacity onPress={()=>{this.props.navigation.push("ViewCustomList", {titleName:"Total Devices"})}}
                  style={styles.button}>
                    <Text style={styles.dashText}>{this.state.TotalDevices}</Text>
                    <Text style={styles.buttonText}>
                      Total Devices
                    </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 0.7, paddingBottom:20}}>
        <TouchableOpacity onPress={()=>{this.props.navigation.push("PendingDevice", {titleName:"pending"})}}
            
            style={styles.buttonTouch}>
              <View style={{flexDirection: "row"}}>
              <Text style={{ color: '#ffffff', fontSize: 15 , fontWeight: 'bold', paddingRight: 10 }}>Pending returned device</Text>
              <Badge value={this.state.pendingDevices + ""} status="warning"></Badge>
              </View>
          </TouchableOpacity>  
        </View>
      <View  style={{flex: 5}}>
      {
          list.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              onPress={()=>{this.props.navigation.push(item.link, {titleName: item.title})}}
              leftIcon={{ name: item.icon }}
              bottomDivider
              topDivider
              chevron
            />
          ))
        }
      </View>
      </View>);
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
    backgroundColor:'#EBF5FB',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    alignContent: 'center',
    alignItems: 'center'
  },
  dashText:{
    fontSize: 40,
    paddingTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  buttonText:{
    fontSize: 12, textDecorationLine: 'underline', color: '#3498DB', fontWeight: "bold", paddingBottom: 20
  },
  buttonTouch: {
    backgroundColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    flex: 1,
    height: 100,
    marginRight:30,
    marginLeft:30,
    marginTop:10,
    marginBottom: 10,
    borderRadius:20,
    borderColor: '#566573',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});

