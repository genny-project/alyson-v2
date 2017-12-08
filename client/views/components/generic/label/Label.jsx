import React from 'react';
import { string } from 'prop-types';
import './label.scss';

Label.propTypes = {
  className: string,
  text: string
};

Label.defaultProps = {
  text: ''
};

function Label(props) {
  return (
    <div className={`label ${props.className || ''}`}>
      <span className="label-text" onClick={props.onClick}>
        {props.text}
      </span>
    </div>
  );
}

export default Label;
