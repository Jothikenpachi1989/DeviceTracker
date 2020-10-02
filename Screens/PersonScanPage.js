import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Button, Icon} from 'react-native-elements';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { ScrollView } from 'react-native-gesture-handler';

var SQlite = require('react-native-sqlite-storage')
var db = SQlite.openDatabase({name: 'dataSource.db', createFromLocation: '~Datasource.db'});
var Location ,isAdmin, Name, QR_Code_Value;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
export default class PersonScanPage extends React.Component {
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
      Start_Scanner: false,
    };
    QR_Code_Value = '';
      isAdmin = false;
      Location = '';
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
            QR_Code_Value = '';
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
      QR_Code_Value = '';
      that.setState({ Start_Scanner: true });
    }
  }
  //QR Scanner method after code captured.
onQR_Code_Scan_Done = (QR_Code) => {
    QR_Code_Value =  QR_Code;
    this.setState({ Start_Scanner: false });
  
  var tempStr = QR_Code.split("_");
    db.transaction(tx => {
      tx.executeSql('select firstname, lastname, userid, isadmin from users WHERE userid = ?', [tempStr[1]], (tx, results) => {
        if(results.rows.length > 0){
          //this.setState({Name : results.rows.item(0).firstname + " " + results.rows.item(0).lastname});
            if(results.rows.item(0).isadmin == 'y'){
              isAdmin = true;
            }
            //alert(results.rows.item(0).userid + " " + this.state.Name);
            this.props.navigation.navigate('DeviceScanPage',{itemId : results.rows.item(0).userid, name: (results.rows.item(0).firstname + " " + results.rows.item(0).lastname), admin: results.rows.item(0).isadmin});
        }
        else{
          alert("Please scan valid Person QR code to authenticate.")
        }
      });
    });  
}
  render() {  
    const nav = this.props.navigation;
    if (!this.state.Start_Scanner) {
      return (<ScrollView>
        <View style={styles.MainContainer}>
             <View style={{flex: 3,alignItems: 'center',justifyContent: 'space-evenly',paddingTop: 15,}}>
                <Image style={{paddingTop: 10}} source={require('../images/scan-icon.png')} style={{width: 150, height: 150}} />
                <Text style={{ fontSize: 22, textAlign: 'center',padding: 10, }}>Scan your Person QR Code</Text> 
                <Text style={{ fontSize: 12, textAlign: 'center',padding: 10, }}>User Login</Text>   
              </View>
              <View style={{flex: 1,alignItems: 'center',justifyContent: 'space-evenly',padding: 10,}}>
              <TouchableOpacity
                  onPress={this.open_QR_Code_Scanner}
                  style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 14 }}>
                      Scan Now
                    </Text>
                </TouchableOpacity>
              </View>
        </View></ScrollView>
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
          onReadCode={event => this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)}
        />
 
      </View>
    );  
  }
}
const styles = StyleSheet.create({
 
  MainContainer: {
    flex: 1,
     alignItems: 'center',
     alignContent: 'center',
    justifyContent: 'flex-end',
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  button: {
    backgroundColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: 200,
    marginRight:40,
    marginLeft:40,
    marginTop:20,
    marginBottom: 20,
    borderRadius:10,
  },
  
});