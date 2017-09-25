import React from 'react';
import './iconcustom.scss';
import { string } from 'prop-types';


IconCustom.propTypes = {
  src: string
};

function IconCustom(props) {
  return (
    <div className="icon-custom">

      {props.src ? <img src={props.src} /> : <i className='material-icons' style={{ fontSize: 90, color: '#b9b9b9' }}>photo_camera</i>}

    </div>
  );
}

export default IconCustom;

