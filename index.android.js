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
import Prompt from 'react-native-prompt';
import DatePicker from 'react-native-datepicker';

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
    // Check if creating new card / removing a card
    if(value == 'Add New Card...'){
      this.setState({promptVisible: true, picking: 'Create New Card'});
    } else if(value == 'Remove Card...'){
      this.setState({promptVisible: true, picking: 'Remove Card'});
    } else {
      this.setState({card: value, cardNum: index});
    }
  }

  pickChoice = (value, index) => {
    // Check if creatng new choices / removing a choice
    if(value == 'Add New Choice...'){
      this.setState({promptVisible: true, picking: 'Create New Choice'});
    } else if(value == 'Remove Choice...') {
      this.setState({promptVisible: true, picking: 'Remove Choice'});
    } else {
      this.setState({choice: value, choiceNum: index});
    }
  }

  pickDate = () => {

  }

  handleSubmit = () => {
    // Getting the date
    let date = this.state.date;
    // If date is empty, set to today's date
    if(!date){
      // Getting today's date
      let today = new Date();
      // Format day to DD
      let day = today.getDate();
      day = (day < 10)? '0'+day : day;
      // Format month to MM
      let month = today.getMonth() + 1;
      month = (month < 10)? '0'+month : month;
      let year = today.getFullYear();
      // Formatting the date to DD-MM-YYYY
      date = day + '-' + month + '-' + year;
    }
    // Getting the list sections
    let sections = this.state.sections;
    // Getting the text input, prepending the date, appending the choice
    let text = ['[' + date + ']', '$ ' + this.state.text, this.state.choice].join(' ');
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
          placeholder={(this.state.picking == 'Create New Card' || this.state.picking == 'Create New Choice')? 'New Entry Here' : 'Item Name To Remove'}
          visible={ this.state.promptVisible }
          onCancel={ () => this.setState({ promptVisible: false }) }
          onSubmit={ (value) => {
            if(this.state.picking == 'Create New Card'){
              let sections = this.state.sections;
              sections.push({title: value, data:[]});
              let cards = [];
              for(let i = 0; i < sections.length; i++){
                cards.push(sections[i].title);
              }
              this.setState({promptVisible: false, sections: sections, cards: cards});
            } else if(this.state.picking == 'Create New Choice'){
              let choices = this.state.choices;
              choices.push(value);
              this.setState({promptVisible: false, choices: choices});
            } else if(this.state.picking == 'Remove Card'){
              let sections = this.state.sections;
              let index = null;
              for(let i = 0; i < sections.length; i++){
                if(value == sections[i].title){
                  index = i;
                  break;
                }
              }
              if(index != null){
                sections.splice(index, 1);
                let cards = [];
                for(let i = 0; i < sections.length; i++){
                  cards.push(sections[i].title);
                }
                this.setState({promptVisible: false, sections: sections, cards: cards})
              } else {
                this.setState({promptVisible: false});
              }
            } else if(this.state.picking == 'Remove Choice'){
              let choices = this.state.choices;
              let index = null;
              for(let i = 0; i < choices.length; i++){
                if(value == choices[i]){
                  index = i;
                  break;
                }
              }
              if(index != null){
                choices.splice(index, 1);
                this.setState({promptVisible: false, choices: choices});
              } else {
                this.setState({promptVisible: false});
              }
            }
          } }
        />
        <SectionList
          sections={this.state.sections}
          renderSectionHeader={({section, index}) => <Header title={section.title}/>}
          renderItem={({item}) => <Entry text={item}/>}
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
        <View style={{alignItems: 'center'}}>
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode='date'
            androidMode='spinner'
            placeholder='Select Date'
            format='DD-MM-YYYY'
            minDate='01-09-2000'
            maxDate='30-09-2030'
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(date) => {this.setState({date: date})}}
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
        {this.state.cards.map((card) => {return <Picker.Item label={card} value={card} key={card}/>})}
        <Picker.Item label='Add New Card...' value='Add New Card...'/>
        <Picker.Item label='Remove Card...' value='Remove Card...'/>
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
        {this.state.choices.map((item) => {return <Picker.Item label={item} value={item} key={item}/>})}
        <Picker.Item label='Add New Choice...' value='Add New Choice...'/>
        <Picker.Item label='Remove Choice...' value='Remove Choice...'/>
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
