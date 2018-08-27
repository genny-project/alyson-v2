import React from 'react';
import {string,number} from 'prop-types';

const LimitCharshelper = (input, maxCharacters = 250) => {
  let output = input;
  if (input && input.length > maxCharacters) {
    output = `${input.substring(0, maxCharacters)}...`;
  }
  return output;
};

const LimitCharacters = ({data, to}) => { 
  return (
    <div>
    { LimitCharshelper(data, to) }
    </div>
  );
};


LimitCharacters.propTypes = { 
  data: string,
  to: number
};


export default LimitCharacters;
