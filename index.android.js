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
  AsyncStorage,
  TouchableHighlight,
  Alert
} from 'react-native';
import Prompt from 'react-native-prompt';
import DatePicker from 'react-native-datepicker';

export default class PaymentChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      text: '',
      cards: [],
      card: null,
      cardNum: 0,
      choices: [],
      choice: null,
      choiceNum: 0,
      date: null,
      promptVisible: false,
      picking: 'Create New Card'
    }
  }

  // Fetching Data from AsyncStorage
  componentWillMount() {
    AsyncStorage.getItem('sections').then((value) => {
      if(value){
        let sections = JSON.parse(value);
        let sections_formatted = [];
        let cards = [];
        for(let i = 0; i < sections.length; i++){
          let sectionObject = {
            title: sections[i].title,
            data: []
          };
          cards.push(sections[i].title);
          for(let j = 0; j < sections[i].data.length; j++){
            sectionObject.data.push(sections[i].data[j]);
          }
          sections_formatted.push(sectionObject);
        }
        card = (cards.length == 0)? '' : cards[0];
        // Force Creating New Card if none exists
        let promptVisible = this.state.promptVisible;
        if(cards.length == 0){
          promptVisible = true;
        }
        let choices = (this.state.choices.length == 0)? [] : this.state.choices;
        let choice = (choices.length == 0)? '' : choices[0];
        this.setState({promptVisible: promptVisible, cards: cards, card: card, choices: choices, choice: choice, sections: sections_formatted});
      } else {
        this.setState({promptVisible: true, sections: [], cards: [], card: '', picking: 'Create New Card'});
      }
    }).done(() => {
      if(this.state.cards.length == 0 && !this.state.promptVisible){
        this.setState({promptVisible: true, picking: 'Create New Card'});
      }
    });
    AsyncStorage.getItem('choices').then((value) => {
      value = JSON.parse(value);
      let choices = (value)? value : [];
      let choice = (choices[0])? choices[0] : '';
      this.setState({choices: choices, choice: choice});
    }).done(() => {
      if(this.state.choices.length == 0 && !this.state.promptVisible){
        this.setState({promptVisible: true, picking: 'Create New Choice'});
      }
    });
  }

  saveItems = (sections) => {
    AsyncStorage.setItem('sections', JSON.stringify(sections));
  }

  saveChoices = (choices) => {
    AsyncStorage.setItem('choices', JSON.stringify(choices));
  }

  confirmedRemoveEntry = (name) => {
    let sections = this.state.sections;
    let entry = name.split('-');
    let title = entry[0];
    let index = entry[1];
    for(let i = 0; i < sections.length; i++){
      if(sections[i].title == title){
        sections[i].data.splice(index,1);
        break;
      }
    }
    this.saveItems(sections);
    this.setState({sections: sections});
  }

  removeEntry = (name) => {
    Alert.alert(
      'Delete Entry',
      'Remove this entry?',
      [
      {text: 'Confirm', onPress: () => this.confirmedRemoveEntry(name)},
      {text: 'Cancel', style: 'cancel'}
    ],
    {cancelable: true});
  }

  pickCard = (value, index) => {
    // Check if creating new card / removing a card
    if(value == 'Add New Card...'){
      this.setState({promptVisible: true, picking: 'Create New Card', card: value, cardNum: index});
      this.forceUpdate();
    } else if(value == 'Remove Card...'){
      this.setState({promptVisible: true, picking: 'Remove Card', card: value, cardNum: index});
      this.forceUpdate();
    } else {
      this.setState({card: value, cardNum: index});
      this.forceUpdate();
    }
  }

  pickChoice = (value, index) => {
    // Check if creatng new choices / removing a choice
    if(value == 'Add New Choice...'){
      this.setState({promptVisible: true, picking: 'Create New Choice', choice: value, choiceNum: index});
      this.forceUpdate();
    } else if(value == 'Remove Choice...') {
      this.setState({promptVisible: true, picking: 'Remove Choice', choice: value, choiceNum: index});
      this.forceUpdate();
    } else {
      this.setState({choice: value, choiceNum: index});
      this.forceUpdate();
    }
  }

  submitPrompt = (value) => {
    if(this.state.picking == 'Create New Card'){
      let sections = this.state.sections;
      sections.push({title: value, data:[]});
      let cards = [];
      for(let i = 0; i < sections.length; i++){
        cards.push(sections[i].title);
      }
      this.saveItems(sections);
      if(this.state.choices.length == 0){
        this.setState({promptVisible: true, picking: 'Create New Choice', sections: sections, cards: cards, card: cards[0], cardNum: 0});
      } else {
        this.setState({promptVisible: false, sections: sections, cards: cards, card: cards[0], cardNum: 0});
      }      
    } else if(this.state.picking == 'Create New Choice'){
      let choices = this.state.choices;
      choices.push(value);
      this.saveChoices(choices);
      this.setState({promptVisible: false, choices: choices, choice: choices[0], choiceNum: 0});
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
        let card = (cards.length == 0)? '' : cards[0];
        this.saveItems(sections);
        this.setState({promptVisible: false, sections: sections, cards: cards, card: card, cardNum: 0})
      } else {
        let card = (this.state.cards.length == 0)? '' : this.state.cards[0];
        this.saveItems(sections);
        this.setState({promptVisible: false, card: card, cardNum: 0});
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
        let choice = (choices.length == 0)? '' : choices[0];
        this.saveChoices(choices);
        if(choices.length == 0){
          this.setState({promptVisible: true, picking: 'Create New Choice', choices: choices, choice: choice, choiceNum: 0});
        } else {
          this.setState({promptVisible: false, choices: choices, choice: choice, choiceNum: 0});
        }
      } else {
        let choice = (this.state.choices.length == 0)? '' : this.state.choices[0];
        this.saveChoices(choices);
        if(choices.length == 0){
          this.setState({promptVisible: true, picking: 'Create New Choice', choice: choice, choiceNum: 0});
        } else {
          this.setState({promptVisible: false, choice: choice, choiceNum: 0});
        }
      }
    }
  }

  cancelPrompt = () => {
    if(this.state.picking == 'Create New Card'|| this.state.picking == 'Remove Card'){
      if(this.state.cards.length != 0){
        this.setState({promptVisible: false, card: this.state.cards[0], cardNum: 0});
      }
    } else if(this.state.picking == 'Create New Choice' || this.state.picking == 'Remove Choice'){
      if(this.state.choices.length != 0){
        this.setState({promptVisible: false, choice: this.state.choices[0], choiceNum: 0});
      }
    }
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
    this.saveItems(sections);
    this.setState(() => nextState);
  }

  render() {
    return (
      <View style={styles.container}>
        <PopUpPrompt
          picking={this.state.picking}
          promptVisible={ this.state.promptVisible }
          cancelPrompt={this.cancelPrompt}
          submitPrompt={this.submitPrompt}
        />
        <SectionList
          sections={this.state.sections}
          renderSectionHeader={({section, index}) => <Header title={section.title} key={index}/>}
          renderItem={({item, index, section}) => <Entries text={item} removeEntry={this.removeEntry} name={section.title + '-' + index}/>}
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
class Entries extends React.Component {
  render() {
    return (
      <TouchableHighlight onLongPress={() => this.props.removeEntry(this.props.name)} underlayColor='white'>
        <View>
          <Text style={styles.entries}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
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
        selectedValue={this.state.card? this.state.card : ''}
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
        selectedValue={this.state.choice? this.state.choice : ''}
        onValueChange={this.props.onValueChange}
      >
        {this.state.choices.map((item) => {return <Picker.Item label={item} value={item} key={item}/>})}
        <Picker.Item label='Add New Choice...' value='Add New Choice...'/>
        <Picker.Item label='Remove Choice...' value='Remove Choice...'/>
      </Picker>
    )
  }
}

class PopUpPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...this.props}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }

  render() {
    return(
      <Prompt
          title={this.state.picking}
          placeholder={(this.state.picking == 'Create New Card' || this.state.picking == 'Create New Choice')? 'New Entry Here' : 'Item Name To Remove'}
          visible={this.state.promptVisible}
          onCancel={this.props.cancelPrompt}
          onSubmit={this.props.submitPrompt}
        />
    )
  }
}

const styles = StyleSheet.create({
  // Outermost container
  container: {
    flex: 1,
  },
  // Entries
  entries: {
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
