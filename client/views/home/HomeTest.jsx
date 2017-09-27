import './home.scss';
import React, { Component } from 'react';
import { Input } from 'views/components/generic';
// import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import { Card, Form, Label } from 'views/components/generic';

class Home extends Component {


  componentDidMount() {
    document.getElementById( 'mounting-preview' ).remove();
  }
  

  render() {
    	/* const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy')
    	const numberMask = createNumberMask({
        prefix: '$',
        suffix: '.00' // This will put the dollar sign at the end, with a space.
      }) */


    // const text1 = 'Byron';
    // const text2 = 'Toll';
    // const level = 'warning';
    // const data = [
    //   { 'name': 'Number', 'icon': 'smartphone', 'value': '0400-000-000' },
    //   { 'name': 'Address', 'icon': 'place', 'value': '121 Cardigan St, Carlton 3053 VIC' },
    //   { 'name': 'Date', 'icon': 'event_note', 'value': '14-09-2017' },
    //   { 'name': 'Email', 'icon': 'email', 'value': 'byron@gmail.com' },
    // ];
    // const buttons = [
    //   { 'name': 'Save', 'icon': 'check_circle', 'value': 'SAVE ITEM', 'class': 'confirm small' },
    //   { 'name': 'Delete', 'icon': 'cancel', 'value': 'DELETE ITEM', 'class': 'cancel small' },
    // ];


    const question = [
      { 'id' : '0001',
        'type' : 'text',
        'name': 'FirstName',
        'placeholder': 'Enter First Name Here',
        'mask' : /\d/,
        'validationlist' : [
          { 'validation' : '123355' },
          { 'validation' : '123355' }
        ],
        'expiry' : 'date',
        'optional' : false,
        'disabled' : false,
        'refusal' : false,

      },
    ];

    const questions = [
      { 'id' : '0001', 'type' : 'text', 'name': 'Question 1', 'placeholder': 'Description for question 1', 'validation' : '', 'optional' : true },
      { 'id' : '0002', 'type' : 'textarea', 'name': 'Question 2', 'placeholder': 'Description for question 2', 'validation' : '' },
      { 'id' : '0003', 'type' : 'email', 'name': 'Question 3', 'placeholder': 'Description for question 3', 'validation' : '' },
      { 'id' : '0004', 
        'type' : 'password',
        'name': 'Question 4',
        'placeholder': 'Description for question 4',
        'validation' : '' },
      { 'id' : '0005', 'type' : 'phone', 'name': 'Question 5', 'placeholder': '(XXX) XXX-XXXX', 'validation' : '' },
      { 'id' : '0006',
        'type' : 'dropdown',
        'name': 'Question 6',
        'placeholder':'Description for question 6',
        'validation' : '',
        'options' : [
          { 'name' : 'option 1', 'value' : '1' },
          { 'name' : 'option 2', 'value' : '2' },
          { 'name' : 'option 3', 'value' : '3' },
        ],
      },
    ];

    return (
      <div className="home">
        <p>Home</p>

        <div className="column2">
         <Form questions={question} />
        </div>
        <div className="column2">
         <Form questions={questions} />
        </div>
        <Label>Hello</Label>
      </div>
    );
  }
}

export default Home;
