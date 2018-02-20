import './formGroup.scss';
import React, { Component } from 'react';
import { array, string, func, bool } from 'prop-types';
import { Input, Button } from 'views/components';
import { Grid } from '@genny-project/layson';

class FormGroup extends Component {

  static defaultProps = {
    data: [],
    title: '',
    submitButtons: [],
    onGroupValidation: null,
    onSubmit: null,
  }

  static propTypes = {
    data: array,
    title: string,
    submitButtons: array,
    onSubmit: func,
    onGroupValidation: func,
    isHorizontal: bool,
  }

  state = {
    isFormValidated: false,
    animatedButtons: {},
    isMobile: window.getScreenSize() == 'sm',
  }

  componentWillMount() {
    this.inputRefs = {};
  }

  componentDidMount() {

      this._ismounted = true;
      this.checkIfFormIsValid();
  }

  componentWillUnmount() {
      this._ismounted = false;
  }

  componentWillUpdate() {
    this.inputRefs = {};
    this.state.animatedButtons = {};
  }

  checkIfFormIsValid() {

    if(this._ismounted) {

      const isInputValid = this.isFormGroupValid(false);
      const isFormValid = isInputValid.every(input => {return input;});

      if(isFormValid) {
        if(this.state.isFormValidated == false){
          this.setState({
              isFormValidated: true
          });
        }
      }
      else {
        if(this.state.isFormValidated == true) {
          this.setState({
              isFormValidated: false
          });
        }
      }
    }
  }

  renderData = (data) => {

    const { isHorizontal } = this.props;

    this.inputRefs = {};
    if(data.length == 0) return null;

    return data.map((child, index) => {

      if (child.$$typeof) {
        return child;
      } else {
        return (
          <Input
            {...child}
            ref={ inputRef => this.inputRefs[child.identifier] == null ? this.inputRefs[child.identifier] = inputRef : null}
            onValidation={(argument1, argument2, argument3) => { console.log('checking'); this.checkIfFormIsValid(); child.onValidation(argument1, argument2, argument3); }}
            key={index}
            style={isHorizontal && !this.state.isMobile && data.length > 1 ?
              { marginLeft: '5px', marginRight: '5px', marginBottom: '10px', width: 'calc(50% - 10px)' } :
              { marginBottom: '10px', width: '100%' }}
            />
          );
        }
      });
    }

    onSubmitClick = (button) => {

      // first we validate all the inputs and see if we get any error.
      if(this.props.onSubmit) {

        let buttonCode = button.replace('form-', '');
        const next = (btnCode) => {

          if(this.props.onSubmit(btnCode)) {
            let animatedButtons = this.state.animatedButtons;
            animatedButtons[button] = animatedButtons[button] ? !animatedButtons[button] : true;
            this.setState({
              animatedButtons: animatedButtons
            });
          }
        };

        if(buttonCode.indexOf('confirm') != -1) {

          if(this.askForConfirmation('Please confirm your submission')) {
            next('submit');
          }
        }
        else if (buttonCode.indexOf('accept') != -1) {
          next('submit');
        }
        else {
          next(buttonCode);
        }
      }
    }

    askForConfirmation(text, next) {
      return confirm(text);
    }

    isFormGroupValid = (showStyle) => {

      return Object.keys(this.inputRefs).map(ref => {
        let input = this.inputRefs[ref];
        return input ? input.isValid(showStyle) : true;
      });
    }

    renderFormButtons(buttons) {

      const { animatedButtons, isFormValidated } = this.state;

      return (
        <Grid rows={1} cols={buttons.length}>
          {
            buttons.map((button, index) => {

              const isDisabled = ( button == 'form-submit' ||  button == 'form-confirm' || button == 'form-accept') && !isFormValidated;

              return (
                <Button
                  key={index}
                  style={{ margin : `10px ${index < buttons.length - 1 ? '10px' : '0'} 10px 0` }}
                  position={[0, index]}
                  disabled={ isDisabled || animatedButtons[button]}
                  className={`form-button ${button} ${animatedButtons[button] ? 'animate' : ''}`}
                  onClick={() => this.onSubmitClick(button)}>
                  {
                    <div className={'button-spinner'} />
                  }
                </Button>
              );
            })
          }
        </Grid>
      );
    }

    render() {

      const { data, title, submitButtons, isHorizontal } = this.props;
      const subforms = this.renderData(data);

      if(subforms == null) return null;

      return (
        <div className="form-group">
          <div className="form-group-title">
            {title}
          </div>
          <div style={isHorizontal && !this.state.isMobile ? { 'display': 'flex', 'flexWrap': 'wrap' } : null}>
            {subforms}
          </div>
          {
            submitButtons.length > 0 ? this.renderFormButtons(submitButtons) : null
          }
        </div>
      );
    }

  }

  export default FormGroup;
