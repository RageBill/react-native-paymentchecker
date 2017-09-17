/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  SectionList,
  Button,
  Picker
} from 'react-native';

export default class PaymentChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [
        {
          title: 'First Card',
          data: ['PAD']
        },
        {
          title: 'Second Card',
          data: ['Clash Royale', 'PPS']
        }
      ],
      text: '',
      choice: 'Puzzle and Dragons',
      choiceNum: 0
    }
  }

  handleSubmit = () => {
    let sections = this.state.sections;
    let text = this.state.text;
    sections[this.state.choiceNum].data.push(text);
    let nextState = {
      sections: sections,
      text: ''
    }
    this.setState(() => nextState);
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.sections}
          renderSectionHeader={({section, index}) => <Header title={section.title}/>}
          renderItem={({item}) => <Entry text={item} key={item}/>}
        />
        <View style={styles.newInput}>
          <Text style={{fontSize: 20, flex: 1}}>New:</Text>
          <TextInput
            style={{fontSize: 18, flex: 4}}
            placeholder='New Entry'
            value={this.state.text}
            onChangeText={(text) => this.setState({text})}
          />
          <Button
            style={{flex: 1}}
            onPress={this.handleSubmit}
            title='Submit'
          />
        </View>
        <View>
          <Picker
            selectedValue={this.state.choice}
            onValueChange={(value, index) => this.setState({choice: value, choiceNum: index})}
          >
            <Picker.Item label='Puzzle and Dragons' value='Puzzle and Dragons' />
            <Picker.Item label='Clash Royale' value='Clash Royale' />
          </Picker>
        </View>
      </View>
    );
  }
}

class Entry extends React.Component {
  render() {
    return (
      <Text style={styles.text}>{this.props.text}</Text>
    )
  }
}

class Header extends React.Component {
  render() {
    return (
      <Text style={styles.sectionHeader}>{this.props.title}</Text>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  newInput: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('PaymentChecker', () => PaymentChecker);
