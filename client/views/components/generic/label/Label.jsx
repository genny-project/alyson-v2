import React from 'react';
import { string } from 'prop-types';
import './label.scss';


Label.propTypes = {
  text: string
};

Label.defaultProps = {
  text: 'Label Example'
};


function Label(props) {
  return (
    <div>
      <span className="label">
        {props.text}
      </span>
    </div>
  );
}

export default Label;

