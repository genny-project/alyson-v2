import './inputTerms.scss';
import React, { Component } from 'react';
import { string, any, bool, func, array, object } from 'prop-types';
import { SubmitStatusIcon, Label,  } from 'views/components';

class InputTerms extends Component {

  static defaultProps = {
    className: '',
    checked: false,
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    checked: bool,
    validation: func,
    identifier: any,
    validationStatus: string,
    handleOnChange: func,
    validationList: array,
    name: string,
    html: string,
    mandatory: bool
  }

  state = {
  }

  handleScroll = () => {
    let div = this.divRef;

    if (div.scrollHeight == div.scrollTop + div.offsetHeight) {
      if(this.props.validation && this.state.isRead != true ) {
        this.setState({
          isRead: true
        });
        this.props.validation(true, this.props.identifier, this.props.validationList);
      }
    }
  }



  render() {
    const { className, html, mandatory, isHorizontal, hideHeader, name, validationStatus } = this.props;
    const {modalContent, isChecked} = this.state;
    return (
      <div className={`input input-terms ${className}`}>
      {
          !isHorizontal && !hideHeader ?
          <div className="input-header">
              {name ? <Label text={name} /> : null}
              {mandatory? <Label className='input-label-required' textStyle={ !validationStatus || validationStatus == 'error' ? {color: '#cc0000'} : null } text="*  required" /> : null}
              <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
          </div> :
          null
        }
        <div className="input-terms-main" ref={(ref) => { this.divRef = ref}} dangerouslySetInnerHTML={{ __html: html }} onScroll={this.handleScroll}/>
      </div>
    );
  }
}

export default InputTerms;
