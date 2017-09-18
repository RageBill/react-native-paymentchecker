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
  Picker,
  DatePickerAndroid
} from 'react-native';
import Prompt from 'react-native-prompt';

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
      cards: [],
      card: null,
      cardNum: 0,
      choices: ['Puzzle and Dragons', 'Clash Royale', 'Apple'],
      choice: null,
      choiceNum: 0,
      date: null,
      promptVisible: false,
      picking: 'Create New Card'
    }
  }

  componentDidMount() {
    let sections = this.state.sections;
    let cards = [];
    for(let i = 0; i < sections.length; i++){
      cards.push(sections[i].title);
    }
    this.setState({
      cards: cards,
      card: this.state.sections[0].title,
      choice: this.state.choices[1]
    });
  }

  pickCard = (value, index) => {
    // Check if creating new choices
    if(value == 'Add New Card...'){
      this.setState({promptVisible: true, picking: 'Create New Card'});
    } else {
      this.setState({card: value, cardNum: index});
    }
  }

  pickChoice = (value, index) => {
    // Check if creatng new choices
    if(value == 'Add New Choice...'){
      this.setState({promptVisible: true, picking: 'Create New Choice'});
    } else {
      this.setState({choice: value, choiceNum: index});
    }
  }

  handleSubmit = () => {
    // Getting the date
    let date = this.state.date;
    // If date is empty, set to today's date
    if(!date){
      // Getting today's date
      let today = new Date();
      let day = today.getDay();
      switch(day){
        case 0: day = 'Sun'; break;
        case 1: day = 'Mon'; break;
        case 2: day = 'Tue'; break;
        case 3: day = 'Wed'; break;
        case 4: day = 'Thu'; break;
        case 5: day = 'Fri'; break;
        case 6: day = 'Sat'; break;
      }
      // Formatting the date, e.g. 17-9-2017 (Sun)
      date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() + ' [' + day + ']';
    }
    // Getting the list sections
    let sections = this.state.sections;
    // Getting the text input, prepending the date, appending the choice
    let text = [date, '$' + this.state.text, this.state.choice].join(' ');
    // Pushing the text input as new item
    sections[this.state.cardNum].data.push(text);
    // Setting the new state
    let nextState = {
      sections: sections,
      text: ''
    }
    this.setState(() => nextState);
  }

  render() {
    return (
      <View style={styles.container}>
        <Prompt
          title={this.state.picking}
          placeholder='New Entry Here'
          visible={ this.state.promptVisible }
          onCancel={ () => this.setState({
            promptVisible: false
          }) }
          onSubmit={ (value) => {
            if(this.state.picking == 'Create New Card'){
              let sections = this.state.sections;
              sections.push({title: value, data:[]});
              let cards = [];
              for(let i = 0; i < sections.length; i++){
                cards.push(sections[i].title);
              }
              this.setState({promptVisible: false, sections: sections, cards: cards});
            } else {
              let choices = this.state.choices;
              choices.push(value);
              this.setState({promptVisible: false, choices: choices});
            }
          } }
        />
        <SectionList
          sections={this.state.sections}
          renderSectionHeader={({section, index}) => <Header title={section.title}/>}
          renderItem={({item}) => <Entry text={item} key={item}/>}
        />
        <View style={styles.newInput}>
          <Text style={{fontSize: 20, flex: 1}}>$</Text>
          <TextInput
            style={{fontSize: 18, flex: 10}}
            placeholder='Price in HKD'
            value={this.state.text}
            onChangeText={(text) => this.setState({text})}
          />
          <Button
            style={{flex: 2}}
            onPress={this.handleSubmit}
            title='Submit'
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <CardPicker
              cards={this.state.cards}
              card={this.state.card}
              cardNum={this.state.cardNum}
              onValueChange={this.pickCard}
            />
          </View>
          <View style={{flex: 1}}>
            <ItemPicker
              choices={this.state.choices}
              choice={this.state.choice}
              choiceNum={this.state.choiceNum}
              onValueChange={this.pickChoice}
            />
          </View>
        </View>
      </View>
    );
  }
}

// The displayed entries component
class Entry extends React.Component {
  render() {
    return (
      <Text style={styles.entry}>{this.props.text}</Text>
    )
  }
}

// The displayed headers component
class Header extends React.Component {
  render() {
    return (
      <Text style={styles.header}>{this.props.title}</Text>
    )
  }
}

// Card picker
class CardPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props}
  }

  // Update the picker after picking
  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }

  render() {
    return (
      <Picker
        selectedValue={this.state.card}
        onValueChange={this.props.onValueChange}
      >
        {this.state.cards.map((card) => {return <Picker.Item label={card} value={card}/>})}
        <Picker.Item label='Add New Card...' value='Add New Card...'/>
      </Picker>
    )
  }
}

// Payment Item Picker
class ItemPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props}
  }

  // Update the picker after picker
  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }

  render() {
    return(
      <Picker
        style={{alignItems: 'center'}}
        selectedValue={this.state.choice}
        onValueChange={this.props.onValueChange}
      >
        {this.state.choices.map((item) => {return <Picker.Item label={item} value={item}/>})}
        <Picker.Item label='Add New Choice...' value='Add New Choice...'/>
      </Picker>
    )
  }
}

const styles = StyleSheet.create({
  // Outermost container
  container: {
    flex: 1,
  },
  // Entries
  entry: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  // Headers
  header: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  // Input textbox
  newInput: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('PaymentChecker', () => PaymentChecker);
