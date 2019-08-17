import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import { Button, Icon, Card} from 'react-native-elements';
import { TouchableOpacity, Linking, PermissionsAndroid } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import Modal from "react-native-modal";

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
var Location = "";

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
      isAdmin: false,
      Device_Code: '',
      flag: false,
      AuthSuccess: false, 
      DeviceSuccess: false, 
      NextDeivce: false,
      PersonName: '', 
      DeviceName: '', 
      validDevice: false,
      deviceIssued: 'False',
      userId: '',
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
  onQR_Code_Scan_Done = (QR_Code) => {
   this.setState({ QR_Code_Value: QR_Code });
    this.setState({ Start_Scanner: false });
    if(this.state.flag == true){
      
    }
    else{
      this.setState({Person_Code : QR_Code});
      alert(this.state.Person_Code + " " + QR_Code);
    }
  }
  //QR Scanner method after code captured.
  onQR_Code_Scan_Done_1 = (QR_Code) => {
    this.setState({ QR_Code_Value: QR_Code });
    this.setState({ Start_Scanner: false });
    if(!this.state.flag){
      this.setState({Person_Code : QR_Code});
      alert(this.state.Person_Code + " " + QR_Code);
      this.validatePersonQRCode(this.state.Person_Code);
        if(!this.state.AuthSuccess){
          alert("Please scan valid Person QR code to authenticate.")
          this.setState({flag: false});
        }
        else{
          this.setState({flag: true});
        }
    } 
    else{
      this.setState({flag: false});
      this.state.Device_Code = QR_Code;
      this.validateDeviceQRCode(this.state.Device_Code);
        if(this.state.DeviceSuccess){
          if(this.state.deviceIssued == "issued"){
            alert("Please scan avaliable device code to reserve.")
          } else{
            alert("Please scan valid Device code.")
          }
         }
        else{
          this.toggleModal();
        }
    }
  }
 
  state = {
    isModalVisible: false
  };
 //Database validation of Person Code and get Person details
validatePersonQRCode=(PersonCode)=>{
  //var regex=/([a-zA-Z]{3}[_][a-zA-Z]{3}[-][0-9]{1}[_][a-zA-Z]{3}[_][A-Z]{3})/;
  var tempStr = PersonCode.split("_");
    if(tempStr[3] == "Che"){Location = "Chennai"}
    else if(tempStr[3] == "Hyd"){Location = "Hydrabad"}
    this.setState({userId: tempStr[1]});
   db.transaction(tx => {
      tx.executeSql('select firstname, lastname, isadmin from users WHERE userid = ? and location= ?', [tempStr[1],Location], (tx, results) => {
        if(results.rows.length > 0){
          this.setState({AuthSuccess : true});
          this.setState({PersonName : results.rows.item(0).firstname + " " + results.rows.item(0).lastname});
            if(results.rows.item(0).isadmin == 'y'){
              this.setState({isAdmin : true});
            }
        }
        else{
          this.setState({AuthSuccess : false});
        }
      });
    });  
}
//Database validation of Device Code
validateDeviceQRCode=(Device_Code)=>{
  db.transaction(tx => {
    tx.executeSql('select devicename, devicestatus, devicetype from devices WHERE assetid =?', [Device_Code], (tx, results) => {
     if(results.rows.length > 0){
        this.setState({validDevice : true});
        this.setState({DeviceSuccess : true});
        this.setState({DeviceName : results.rows.item(0).devicename + "-" + results.rows.item(0).devicetype});
        if(results.rows.item(0).devicestatus == "issued"){
          alert("This device is already issued. Please scan other devices.")
          this.setState({deviceIssued: "True"});
          this.setState({DeviceSuccess : false});
        }
      }
      else{
        this.setState({validDevice : false});
        this.setState({DeviceSuccess : false});
      }
    });
  });
}
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    //this.state.DeviceSuccess = false;
  };

//Navigation from Scan page to User Page when tap on Ok in the success popup
navigateToUserPage=()=>{
  this.setState({ isModalVisible: !this.state.isModalVisible });
  this.state.DeviceSuccess = false;
  this.state.Device_Code = "";
  this.state.flag = false;
  this.state.AuthSuccess= false;
   this.props.navigation.navigate('UserPage',{itemId : this.state.userId});
   this.state.Person_Code = "";
}
//Scan more devices from pop up
scanmore=()=>{
  this.setState({ isModalVisible: !this.state.isModalVisible });
  this.state.DeviceSuccess = false;
  this.state.Person_Code = "";
  this.state.Device_Code = "";
  this.state.flag = true;
  this.state.AuthSuccess= true;
   //this.props.navigation.navigate('UserPage');
}
  render() {
   
    const nav = this.props.navigation;
    if (!this.state.Start_Scanner) {
      
      return (
        <View style={styles.MainContainer}>
          {!this.state.flag && !this.state.DeviceSuccess?
              <View style={{alignItems: 'center',justifyContent: 'center',padding: 12,}}>
                <Image source={require('../images/scan-icon.png')} />
                <Text style={{ fontSize: 22, textAlign: 'center',padding: 12, }}>Scan your Person QR Code</Text> 
                <Text style={{ fontSize: 12, textAlign: 'center',padding: 12, }}>User Login</Text>   
                <TouchableOpacity
                  onPress={this.open_QR_Code_Scanner}
                  style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 14 }}>
                      Scan Now
                    </Text>
                </TouchableOpacity>
              </View>:null
          }
          {this.state.flag && this.state.AuthSuccess ?
              <View style={{alignItems: 'center',justifyContent: 'center',padding: 12,}}>
              <Text style={{ fontSize: 22, textAlign: 'center',padding: 12, }}>Welcome, {this.state.PersonName}</Text> 
              <Image source={require('../images/scan-icon.png')} />
              <Text style={{ fontSize: 22, textAlign: 'center',padding: 12, }}>Scan your Device</Text> 
              <Text style={{ fontSize: 12, textAlign: 'center',padding: 12, }}>Device Issues or Return</Text> 
              <TouchableOpacity
                onPress={this.open_QR_Code_Scanner}
                style={styles.button}>
                  <Text style={{ color: '#FFF', fontSize: 14 }}>
                    Scan Now
                  </Text>
              </TouchableOpacity>
              </View>:null
          }
          {this.state.DeviceSuccess ? 
              <View style={{ flex: 1 }}>
              
              <Modal isVisible={this.state.isModalVisible}>
              <Card containerStyle={{alignItems: 'center', }}
                title='Success'
                titleStyle={{fontSize: 18,}}
                >
                <Text style={{marginBottom: 10,}}>
                  {this.state.DeviceName} is now issued to {this.state.PersonName}.
                  </Text>
                  <View style={{flexDirection: 'column', alignItems: 'center',}}>
                    
                    <Button
                      onPress={this.scanmore}
                      backgroundColor='#03A9F4'
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, width:150,}}
                      raised
                      title='Scan More' />

                      <Button
                      onPress =  {this.navigateToUserPage}
                      buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,width:150, backgroundColor: '#ffffff',}}
                      title='OK' 
                      type = 'clear'
                      raised
                      titleStyle={{color: '#616161'}}/>
                  </View>
              </Card>
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
    backgroundColor: '#2F95D6',
    alignItems: 'center',
    padding: 12,
    width: 200,
    marginTop: 14,
  },
  
});