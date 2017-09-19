import React, {Component} from 'react';


class IconSmall extends Component {

  constructor(props){
    super(props);
  }

  static defaultProps = {
    fontSize: 18,
    name: 'android'
  }

  render(){
    return(
      <i className="material-icons" style={{fontSize: this.props.size }}>{this.props.name}</i>

    );
  }
}


export defualt IconSmall;
