import './inputRating.scss';
import React, { Component } from 'react';
import { string, bool, array, object, any, func, number } from 'prop-types';
import { Label, SubmitStatusIcon, IconSmall } from 'views/components';

class InputRating extends Component {

  static defaultProps = {
    className: '',
    validationList: [],
    name: '',
    placeholder: '',
    mandatory: false,
    identifier: null,
    validationStatus: null,

    iconFull: 'star',
    iconNone: 'star_border',
    total: 5,
    value: 5,
    size: 32
  }

  static propTypes = {
    className: string,
    style: object,
    validationList: array,
    name: string,
    placeholder: string,
    mandatory: bool,
    validation: func,
    identifier: any,
    validationStatus: string,
    handleOnChange: func,
    hideHeader: bool,
    isHorizontal: bool,

    size: number,
    color: string,

    iconFull: string,
    iconHalf: string,
    iconNone: string,
    total: number,
    value: number,
  }

  state = {
    currentHover: null
  }

  handleClick = (event, value) => {

    const { handleOnChange } = this.props;
    if(handleOnChange) handleOnChange(value);

    this.setState({
      clicked: value
    });

    if(this.props.onValidation) {
        console.log(this.props.data);

        this.props.onValidation(value, this.props.data);
    }
  }

  handleHover = (event, value) => {
    this.setState({
      currentHover: event.type == 'react-mouseover' ? value : null
    });
  }

  renderIcons = () => {
    const {value, total, iconFull, iconNone, size } = this.props;
    const {currentHover, clicked} = this.state;

    let icons = [];

    for(let i = 1; i < (total + 1); i++) {

      icons.push(
        <IconSmall
          name={value >= i ? iconFull : iconNone}
          size={size}
          className={`input-rating-icon clickable ${currentHover && currentHover >= i ? 'hover' : ''}  ${clicked == i ? 'clicked' : '' }`}
          onClick={() => this.handleClick(event, i)}
          onMouseOver={() => this.handleHover(event, i)}
          onMouseOut={() => this.handleHover(event, i)}
        />
      );
    }
    return icons;
  }

  render() {

    const { className, style, name, mandatory, validationStatus, isHorizontal, hideHeader, } = this.props;
    const componentStyle = { ...style, };

    return <div className={`input input-rating ${className} ${validationStatus || ''}`} style={componentStyle}>
      {
        !isHorizontal && !hideHeader ?
          <div className="input-header">
            {name ? <Label text={name} /> : null}
            {mandatory? <Label className='input-label-required' textStyle={ !validationStatus || validationStatus == 'error' ? {color: '#cc0000'} : ''} text="*  required" /> : null}
            <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
          </div> :
        null
      }
      <div className='rating-display-container'>
        {this.renderIcons()}
      </div>
    </div>;
  }
}

export default InputRating;
