import './home.scss';
import React, { Component } from 'react';
import {  } from 'views/components/generic';
// import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import { Card, Form, Label, Input } from 'views/components/generic';

class Home extends Component {

  componentDidMount() {
    document.getElementById( 'mounting-preview' ).remove();
  }
  
  render() {

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

    const questionGroup = {
      'itemsPerPage' : 2,
      'showProgress' : true,
      'style' : 'default',
      'asks' : [
        { 'id' : '0001',
          'type' : 'text',
          'name': 'FirstName',
          'placeholder': 'Enter First Name Here',
          'mask' : /^[0-9]{0,}(\.{0,1}[0-9]{0,2})?$/,
          'validationlist' : [
            { 'validation' : /^[0-9]{0,}(\.{0,1}[0-9]{0,2})?$/ },
          ],
          'expiry' : 'date',
          'optional' : false,
          'disabled' : false,
          'refusal' : false,
        },
        { 'id' : '0002',
          'type' : 'text',
          'name': 'LastName',
          'placeholder': 'Enter Last Name Here',
        },
        { 'id' : '0003',
          'type' : 'text',
          'name': 'Input 3',
          'placeholder': 'Enter Input 3 Here',
        },
        { 'id' : '0004',
          'type' : 'text',
          'name': 'Input 4',
          'placeholder': 'Enter Input 4 Here',
        },
        { 'id' : '0005',
          'type' : 'text',
          'name': 'Input 5',
          'placeholder': 'Enter Input 5 Here',
        },
        { 'id' : '0006',
          'type' : 'text',
          'name': 'Input 6',
          'placeholder': 'Enter Input 6 Here',
        },
        { 'id' : '0007',
          'type' : 'text',
          'name': 'Input 7',
          'placeholder': 'Enter Input 7 Here',
        },
        { 'id' : '0008',
          'type' : 'text',
          'name': 'Input 8',
          'placeholder': 'Enter Input 8 Here',
        },
        { 'id' : '0009',
          'type' : 'text',
          'name': 'Input 9',
          'placeholder': 'Enter Input 9 Here',
        },
        { 'id' : '0010',
          'type' : 'text',
          'name': 'Input 10',
          'placeholder': 'Enter Input 10 Here',
        },
      ],
    };

    return (
      <div className="home">
        <p>Home</p>

        <div className="column2">
         <Form questionGroup={questionGroup} />
        </div>
      </div>
    );
  }
}

export default Home;
