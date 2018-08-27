import React from 'react';
import {string,number} from 'prop-types';

const LimitCharshelper = (input, maxCharacters = 250) => {
  let output = input;
  if (input && input.length > maxCharacters) {
    output = `${input.substring(0, maxCharacters)}...`;
  }
  return output;
};

const LimitCharacters = ({text, limitTo}) => { 
  return (
    <div>
    { LimitCharshelper(text, limitTo) }
    </div>
  );
};


LimitCharacters.propTypes = { 
  text: string,
  limitTo: number
};


export default LimitCharacters;
