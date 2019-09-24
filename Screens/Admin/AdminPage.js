import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, View,ImageBackground, Text} from 'react-native';
import { ListItem } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const list = [
  {
    title: 'Add/Edit Device',
    icon: 'av-timer'
  },
  {
    title: 'Add/Edit Person',
    icon: 'flight-takeoff'
  },
  {
    title: 'Reports',
    icon: 'av-timer'
  },
  {
    title: 'Settings',
    icon: 'flight-takeoff'
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
   }
  render() {
   
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
      <View style={{ flex:2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ffffff', padding: 20}}>
        <View style={styles.roundCorner}>
          <Text style={styles.dashText}>15</Text>
          <TouchableOpacity
                  style={styles.button}>
                    <Text style={styles.buttonText}>
                      Issued Devices
                    </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.roundCorner}>
        <Text style={styles.dashText}>3</Text>
          <TouchableOpacity
                  style={styles.button}>
                    <Text style={styles.buttonText}>
                      Not Returned
                    </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.roundCorner}>
        <Text style={styles.dashText}>95</Text>
          <TouchableOpacity
                  style={styles.button}>
                    <Text style={styles.buttonText}>
                      Total Devices
                    </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View  style={{flex: 5}}>
      {
          list.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
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
    //paddingTop:20,
    //paddingBottom:20,
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
    fontSize: 12, textDecorationLine: 'underline', color: '#3498DB' 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});

