import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Button, Icon, ListItem, Card } from 'react-native-elements';
import { TouchableOpacity, Linking, PermissionsAndroid } from 'react-native';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import Modal from "react-native-modal";
import DeviceList from './DeviceList';
var Person_Code = "", Device_Code = "", flag = false, AuthSuccess= false, DeviceSuccess=false, NextDeivce = false;

const users = [
  {
     name: 'Lawrence',
     avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
  },
  ]

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class ScanPage extends React.Component {
  static navigationOptions = {
    title: 'Scan code',
    headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#2F95D6',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 3,
      },
      headerTitleStyle: {
        fontSize: 18,
      },headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        icon={<Icon name='filter-list' color='#ffffff' />}
        color="#fff"
      />
    ),
  };
  constructor() {
    super();
    this.state = {
      QR_Code_Value: '',
      Start_Scanner: false,
      Person_Code: '',
    };
  }
  //QR scanner method
  open_QR_Code_Scanner=()=> {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
              'title': 'Camera App Permission',
              'message': 'Camera App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({ QR_Code_Value: '' });
            that.setState({ Start_Scanner: true });
            
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      that.setState({ QR_Code_Value: '' });
      that.setState({ Start_Scanner: true });
    }
  }
  //QR Scanner method after code captured.
  onQR_Code_Scan_Done = (QR_Code) => {
    this.setState({ QR_Code_Value: QR_Code });
    this.setState({ Start_Scanner: false });
    if(!flag){
      flag = true;
    Person_Code = QR_Code;
    AuthSuccess = this.validatePersonQRCode(Person_Code);
    if(!AuthSuccess){
        alert("Please use valid QR code to authenticate.")
      }
    } 
    else{
      flag = false;
      Device_Code = QR_Code;
      DeviceSuccess =this.validateDeviceQRCode(Device_Code);
        if(!DeviceSuccess){
          alert("Please use valid QR code to authenticate.")
        }
        else{
          this.toggleModal();
        }
    }
  }
 
  state = {
    isModalVisible: false
  };
 
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    //DeviceSuccess = false;
  };

//Database validation of Person and Device Code
validatePersonQRCode=(Person_Code)=>{

  return true;
}
validateDeviceQRCode=(Device_Code)=>{

  return true;
}
  render() {
   
    const nav = this.props.navigation;
    if (!this.state.Start_Scanner) {
      
      return (
        <View style={styles.MainContainer}>
 
          {!flag && !DeviceSuccess?
              <Text style={{ fontSize: 22, textAlign: 'center' }}>Scan your Person QR Code</Text>  :null
          }
          {flag && AuthSuccess ?
              <View>
                <Text style={{ fontSize: 22, textAlign: 'center' }}>Welcome</Text> 
               <Card containerStyle={{padding: 0}} >
                {
                  users.map((u, i) => {
                    return (
                      <ListItem
                        key={i}
                        roundAvatar
                        title={u.name}
                        avatar={{uri:u.avatar}}
                      />
                    );
                  })
                }
              </Card>
              <Text style={{ fontSize: 22, textAlign: 'center' }}>Scan your Device QR Code</Text> 
              </View>:null
          }
          {DeviceSuccess ? 
              <View style={{ flex: 1 }}>
              
              <Modal isVisible={this.state.isModalVisible}>
                <View style={{ flex: 0.3, backgroundColor: '#ffffff' }}>
                  <Text>Hello!</Text>
                  <Card containerStyle={{padding: 0}} >
                  {
                    users.map((u, i) => {
                      return (
                        <ListItem
                          key={i}
                          roundAvatar
                          title={u.name}
                          avatar={{uri:u.avatar}}
                        />
                      );
                    })
                  }
              </Card> 
                  <Button title="Ok" onPress={this.toggleModal} />
                  <Button title="Scan more" onPress={this.toggleModal} />
                </View>
              </Modal>
            </View>
            :null
            }

          {this.state.QR_Code_Value.includes("QAASS") ?
            <TouchableOpacity
              onPress={this.openLink_in_rowser}
              style={styles.button}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>Open Link in default Browser</Text>
            </TouchableOpacity> : null
          }
                
          <TouchableOpacity
            onPress={this.open_QR_Code_Scanner}
            style={styles.button}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>
              Scan Now
            </Text>
          </TouchableOpacity>
 
        </View>
        
      );
    } 
    return (
      <View style={{ flex: 1 }}>
 
        <CameraKitCameraScreen
          showFrame={true}
          scanBarcode={true}
          laserColor={'#FF3D00'}
          frameColor={'#00C853'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
          }
        />
 
      </View>
    );  
  }
}
const styles = StyleSheet.create({
 
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  button: {
    backgroundColor: '#2979FF',
    alignItems: 'center',
    padding: 12,
    width: 300,
    marginTop: 14
  },
});