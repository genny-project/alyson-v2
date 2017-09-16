import './home.scss';
import React, { Component } from 'react';
// import { Input } from 'views/generic';
// import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
// import emailMask from 'text-mask-addons/dist/emailMask'
// import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { Card } from 'views/components/generic';

class Home extends Component {
  render() {
    	/* const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy')
    	const numberMask = createNumberMask({
        prefix: '$',
        suffix: '.00' // This will put the dollar sign at the end, with a space.
      }) */
    const text1 = 'Byron Beep';
    const text2 = 'Toll';
    const level = 'warning';
    const data = [
      { 'name': 'Number', 'icon': 'smartphone', 'value': '0400-000-000' },
      { 'name': 'Address', 'icon': 'place', 'value': '121 Cardigan St, Carlton 3053 VIC' },
      { 'name': 'Date', 'icon': 'event_note', 'value': '14-09-2017' },
      { 'name': 'Email', 'icon': 'email', 'value': 'byron@gmail.com' },
    ];
    const buttons = [
      { 'name': 'Save', 'icon': 'check_circle', 'value': 'SAVE ITEM', 'class': 'confirm small' },
      { 'name': 'Delete', 'icon': 'cancel', 'value': 'DELETE ITEM', 'class': 'cancel small' },
    ];

    return (
      <div className="home">
        <p>Home</p>

        {/* <Input type="text" name="Username" pattern=".{1,15}" />
          <Input type="text"/>
          <Input type="password" />
          <Input type="text" name="First Name" optional/>
          <Input type="text" name="Last Name" readOnly defaultValue="Bryan" />
         	<Input type="masked" name="Masked Field" mask={[ ]} />
         	<Input type="masked" name="Masked Field" mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} placeHolder="(XXX) XXX-XXXX" guide={false} />
         	<Input type="masked" name="No Mask" mask={false} />
         	<Input type="masked" name="Email Mask" mask={emailMask} placeHolder="email@email.com" guide={false}/>
         	<Input type="masked" name="Date Pipe" mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} placeHolder="DD-MM-YYYY" guide={false} pipe={autoCorrectedDatePipe} />
         	<Input type="masked" name="Number" mask={numberMask}/>*/}

        <div className="column">
         <Card text1={text1} text2={text2} data={data} buttons={buttons} level={level} />
        </div>
      </div>
    );
  }
}

export default Home;
