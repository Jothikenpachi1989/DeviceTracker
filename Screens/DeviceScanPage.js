import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Alert} from 'react-native';
import { Button, Icon, Card} from 'react-native-elements';
import { TouchableOpacity, Linking, PermissionsAndroid } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit'

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
var Location = "", PersonName = "", userId="";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
export default class DeviceScanPage extends React.Component {
  static navigationOptions = {
    title: 'Device Scan code',
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
  constructor(props) {
    super(props);
    this.state = {
      QR_Code_Value: '',
      Start_Scanner: false,
      Device_Code: '',
      AuthSuccess: true, 
      DeviceSuccess: false, 
      NextDeivce: false,
      DeviceName: '', 
      validDevice: false,
      deviceIssued: 'False',
      isAdmin: false,
    };
    /*this.state = {
      userId: props.navigation.state.params.itemId,
    }*/
   userId = this.props.navigation.getParam('itemId', '');
   PersonName = this.props.navigation.getParam('name','');
   admin = this.props.navigation.getParam('admin','');
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
      this.state.Device_Code = QR_Code;
      this.validateDeviceQRCode(this.state.Device_Code);
  }
//Database validation of Device Code
validateDeviceQRCode=(Device_Code)=>{
  db.transaction(tx => {
    tx.executeSql('select devicename, devicestatus, devicetype, assetid from devices WHERE assetid =?', [Device_Code], (tx, results) => {
     if(results.rows.length > 0){
        this.setState({validDevice : true});
        this.setState({DeviceName : results.rows.item(0).devicename + "-" + results.rows.item(0).assetid});
        if(results.rows.item(0).devicestatus == "issued"){
          alert("This device is already issued. Please scan other devices.");
          this.setState({deviceIssued: "True"});
          this.setState({DeviceSuccess : false});
        }else{
          //Valid Device flow to update DB
          this.setState({DeviceSuccess : true});
          this.updateDeviceEntry(userId,this.state.Device_Code);
        }
      }
      else{
        this.setState({validDevice : false});
        this.setState({DeviceSuccess : false});
        alert("Please scan valid Device code.");
      }
    });
  });
}
updateDeviceEntry = (userid, mobassetid) => {
  var check = false;
  var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var timestamp = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec;
      db.transaction((tx)=> {
          tx.executeSql(
            'Insert Into entries (assetid, devicename,userid,firstname,lastname,pickuptime) Select devices.assetid,devices.devicename,users.userid,users.firstname,users.lastname,? from devices,users where users.userid = ? AND devices.assetid = ?',
            [timestamp,userid, mobassetid],
            (tx, results) => {
              console.log('Results',results.rowsAffected);
              if(results.rowsAffected>0){
                check = true;
              }else{
                alert('Device Entry Failed');
              }
            }
          );
        });
        db.transaction((tx)=> {
          tx.executeSql(
            'update devices SET devicestatus="issued" WHERE assetid = ?',
            [mobassetid],
            (tx, results) => {
              if(results.rowsAffected>0 && check ){
                this.state.Device_Code = "";
                check = false;
                Alert.alert(
                  'Success',
                  this.state.DeviceName + " is now issued to " + PersonName,
                  [
                    {text: 'Scan More', onPress: () => {this.scanmore}},
                    {text: 'View My Devices', onPress: () => {this.props.navigation.navigate('UserPage',{itemId : userId})}},
                  ],
                  {cancelable: false},
                ); 
                }else{
                alert('Device Entry Failed');
              }
            }
          );
        });
        
};
//Navigation from Scan page to User Page when tap on Ok in the success popup
toUserPage=()=>{
  this.setState({DeviceSuccess : false});
  this.state.Device_Code = "";
  this.state.AuthSuccess= true;
  this.props.navigation.navigate('UserPage',{itemId : userId}); 
}
toAdminPage=()=>{
  this.props.navigation.navigate('AdminPage',{itemId : userId,PersonName: PersonName});
}
//Scan more devices from pop up
scanmore=()=>{
  this.setState({DeviceSuccess : false});
  this.state.Device_Code = "";
  this.state.AuthSuccess= true;
}
  render() {
   
    const nav = this.props.navigation;
     //const userid = nav.getParam('itemId', '');  
      
    if (!this.state.Start_Scanner) {
      
      return (
        <View style={styles.MainContainer}>
            <View style={{alignItems: 'center',justifyContent: 'center',padding: 12,}}>
              <Text style={{ fontSize: 22, textAlign: 'center',padding: 12, }}>Welcome, {PersonName}</Text> 
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
              <TouchableOpacity
                onPress={this.toUserPage}
                style={styles.button}>
                  <Text style={{ color: '#FFF', fontSize: 14 }}>
                    View My Devices
                  </Text>
              </TouchableOpacity>
              {admin=='y' ?
              <TouchableOpacity
              onPress={this.toAdminPage}
              style={styles.button}>
                <Text style={{ color: '#FFF', fontSize: 14 }}>
                  Super User
                </Text>
            </TouchableOpacity>
              :null}
            </View>
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