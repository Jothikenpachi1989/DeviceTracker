import React, {Component} from 'react';
import {Container, Header, Title, Button, Icon} from 'native-base';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);   
   userId = this.props.navigation.getParam('itemId', '');
   PersonName = this.props.navigation.getParam('name','');
   }
  render() {
    return (
      <Container>
          <Header>
              <Button transparent>
                  <Icon name="ios-arrow-back" />
              </Button>
              <Title>Header</Title>
              <Button transparent>
                  <Icon name="ios-menu" />
              </Button>
          </Header>
          <Content>
              <Text>This is new design</Text>
          </Content>
          <Footer>
              <Button transparent>
                  <Icon name="ios-call" />
              </Button>

              <Title>Footer</Title>

              <Button transparent >
                  <Icon name="ios-chatbubbles" />
              </Button>
          </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
   
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

