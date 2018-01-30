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
    isFormValidated: true,
    animatedButtons: {},
    isMobile: window.getScreenSize() == 'sm',
  }

  componentWillMount() {
    this.inputRefs = [];
  }

  componentDidMount() {

      this._ismounted = true;
      // this.checkIfFormIsValid()
  }

  componentWillUnmount() {
      this._ismounted = false;
  }

  componentWillUpdate() {
    this.inputRefs = [];
    this.state.animatedButtons = {};
  }

  checkIfFormIsValid() {

      if(this._ismounted) {

          const isFormValid = this.isFormGroupValid(false)
          console.log("---------------")
          console.log(isFormValid)
          if(isFormValid && this.state.isFormValidated == false) {

              this.setState({
                  isFormValidated: true
              })
          }
          else {

              if(this.state.isFormValidated == true) {

                  if(isFormValid) {
                      this.setState({
                          isFormValidated: false
                      })
                  }
              }
          }
      }
  }

  renderData = (data) => {

    const { isHorizontal } = this.props;

    return data.map((child, index) => {

      if (child.$$typeof) {
        return child;
      } else {
        return (
          <Input
            ref={inputRef => this.inputRefs.push(inputRef)}
            {...child}
            // onValidation={(argument1, argument2, argument3) => { console.log("checking"); this.checkIfFormIsValid(); child.onValidation(argument1, argument2, argument3); }}
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

        if(this.props.onSubmit(button.replace('form-', ''))) {
          let animatedButtons = this.state.animatedButtons;
          animatedButtons[button] = animatedButtons[button] ? !animatedButtons[button] : true;
          this.setState({
            animatedButtons: animatedButtons
          });
        }
      }
    }

    isFormGroupValid = (showError) => {

        return this.inputRefs.every(input => {
          return input ? input.isValid(showError) : true;
        });
    }

    renderFormButtons(buttons) {

      const { animatedButtons, isFormValidated } = this.state;

      return (
        <Grid rows={1} cols={buttons.length}>
          {
            buttons.map((button, index) => {
              return (
                <Button
                  key={index}
                  style={{ margin : `10px ${index < buttons.length - 1 ? '10px' : '0'} 10px 0` }}
                  position={[0, index]}
                  disabled={animatedButtons[button] || !isFormValidated}
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
