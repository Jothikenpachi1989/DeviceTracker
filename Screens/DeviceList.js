import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Button, Icon, SearchBar, ButtonGroup } from 'react-native-elements';
import { ListItem } from 'react-native-elements'

const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  
]
export default class DeviceList extends React.Component {
  static navigationOptions = {
    headerTitle: 'Device List',
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        icon={<Icon name='filter-list' color='#ffffff' />}
        color="#fff"
      />
    ),
  };
  state = {
    search: '',
  };
  constructor () {
    super()
  }
  updateSearch = search => {
    this.setState({ search });
  };
  
  render() {
    const buttons = ['Hello', 'World', 'Buttons']
    const { selectedIndex } = this.state
    const { search } = this.state;

  return (

    <View style={{flex: 1}}>
      <SearchBar 
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
      />
      {
    list.map((l, i) => (
        <ListItem
          key={i}
          leftAvatar={{ source: { uri: l.avatar_url } }}
          title={l.name}
          subtitle={l.subtitle}
        />
      ))
    }
     
    </View>
  )
  }
}
