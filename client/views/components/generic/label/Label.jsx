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
    <div className={`label ${props.className || ''}`} style={{...props.style}}>
      <span className="label-text" onClick={props.onClick} style={{...props.textStyle}}>
        {props.text}
      </span>
    </div>
  );
}

export default Label;
