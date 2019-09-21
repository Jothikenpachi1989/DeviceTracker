import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, View,ImageBackground} from 'react-native';
import { Icon,ListItem , Button, Text} from 'react-native-elements';
import GridView from 'react-native-super-grid';

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
    const items = [
      { name: 'TURQUOISE', code: '#1abc9c' }, 
      { name: 'EMERALD', code: '#2ecc71' },
      { name: 'PETER RIVER', code: '#3498db' }, 
    ];
    return (
    <View style={{flex: 1}}>
      <View style={{flex:1}}>
        <ImageBackground
          accessibilityRole={'image'}
          source={require('../../images/DIMSplash.png')}
          style={styles.background}
          imageStyle={styles.logo}>
          <Text style={styles.text}>Welcome, {PersonName}</Text>
        </ImageBackground>
      </View>
      <View style={{flex:3, backgroundColor: '#2ecc71'}}>
       <GridView
        itemDimension={50}
        items={items}
        style={styles.gridView}
        renderItem={item => (
          <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>{item.code}</Text>
          </View>
        )}
      />
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
  button: {
    backgroundColor: '#2F95D6',
    alignItems: 'center',
    padding: 12,
    width: 200,
    marginTop: 14,
  },
  background: {
    paddingBottom: 40,
    paddingTop: 96,
    paddingHorizontal: 32,
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
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

