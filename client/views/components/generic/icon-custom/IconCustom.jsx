import React from 'react';
import './IconCustom.css';


function IconCustom(props) {
  return (
    <div className="icon-custom">

      {props.src ? <img src={this.props.src} /> : <i className='material-icons' style={{ fontSize: 90, color: '#b9b9b9' }}>photo_camera</i>}

    </div>
  );
}
export default IconCustom;
