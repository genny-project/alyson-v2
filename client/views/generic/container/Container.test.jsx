import React from 'react';
import Container from './Container.jsx';
import { shallow } from 'enzyme';


test( 'Children rendering correctly', () => {
  const component = shallow(
    <Container>
      <h1>Child</h1>
    </Container>
  );
  expect( component.text()).toEqual( 'Child' );
});
