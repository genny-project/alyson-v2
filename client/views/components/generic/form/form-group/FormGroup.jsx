import './formGroup.scss';
import React, { Component } from 'react';
import { array, string, func, bool } from 'prop-types';
import { Input, Button } from 'views/components';
import { Grid } from '@genny-project/layson';
import { GennyBridge } from 'utils/genny';

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
        code: string,
        submitButtons: array,
        onSubmit: func,
        onGroupValidation: func,
        isHorizontal: bool,
        onMount: func,
        handleValidation: func
    }

    state = {
        isFormValidated: false,
        animatedButtons: {},
        isMobile: window.getScreenSize() == 'sm',
        children: []
    }

    componentWillMount() {
        this.children = {};
    }

    componentDidMount() {

        this._ismounted = true;
        //console.log('MOUNTED: ', this.props.title);

        if (this.props.onMount) {
            this.props.onMount(this.props.title, null, this.state.isFormValidated);
        }

        this.setChildrenState();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentWillUpdate() {
        this.children = {};
        this.state.animatedButtons = {};
    }

    renderData = (data) => {

        /* conditional render here: if there is only 1 question in the form group and
        * this question is of data_Type boolean, we do not show the input as the form group
        * will be showing [YES] or [NO] buttons
        */

        let shouldRenderInputs = true;

        if(data.length == 1) {
          const dataFirst = data[0];
          if(dataFirst.type == "java.lang.Boolean") {
            shouldRenderInputs = false;
          }
        }

        const { isHorizontal } = this.props;

        //this.inputRefs = {};
        if(data.length == 0) return null;

        return data.map((child, index) => {

            //check if child is a React Element, and if yes, then render that element
            if (child.$$typeof) {
                //return child;
                return React.cloneElement(child, {
                    onMount: this.setChildInitial,
                    handleValidation: this.updateChildState
                });
            }
            //if child is NOT a React Element, ie: it is a data object, render that data as a Input Element
            else {

                if(shouldRenderInputs == true) {

                  return (
                      <Input
                          {...child}
                          onMount={this.setChildInitial}
                          onValidation={
                              (argument1, argument2, argument3, argument4, argument5) => {
                                  this.updateChildState(argument5, argument1, argument4);
                                  child.onValidation(argument1, argument2, argument3);
                              }
                          }
                          onValidationFail={
                              (argument1, argument2, argument3, argument4, argument5) => {
                                  this.updateChildState(argument5, argument1, argument4);
                              }
                          }
                          key={index}
                          style={
                              isHorizontal && !this.state.isMobile && data.length > 1 ?
                              { marginLeft: '5px', marginRight: '5px', marginBottom: '10px', width: 'calc(50% - 10px)' }
                              :
                              { marginBottom: '10px', width: '100%' }
                          }
                      />
                  );
                }

                return null;
            }
        });
    }

    setChildInitial = (name, value, isValid) => {
        //console.log('* initial', name);
        this.children[name] = {
            value: value,
            isValid: isValid
        };
    }

    setChildrenState = () => {
        //console.log('SET', this.props.title);

        this.setState({
            children: this.children
        }, () => {
            this.checkIfFormIsValid();
        });
    }

    updateChildState = (id, value, isValid) => {
        // console.log('UPDATE', this.props.title);
        // console.log('-- current', this.state.children);
        // console.log('++ adding', id, value, isValid);
        this.state.children[id] = {
            value: value,
            isValid: isValid
        };
        this.checkIfFormIsValid();
    }

    checkIfFormIsValid() {

        if(this._ismounted) {
            // console.log('');
            // console.log('-------------------');
            // console.log('CHECK IF "', this.props.title, '" IS VALID');

            const { children }= this.state;
            // console.log(children);
            const isFormValid = Object.keys(children).every(child_key => {
                const child = children[child_key];
                const isChildValid = child.isValid != null ? child.isValid : true;
                return isChildValid;
            });

            // console.log('RESULT: ', isFormValid);
            this.setState({
                isFormValidated: isFormValid
            }, () => {
                if (this.props.handleValidation) {
                    // console.log('updating parent');
                    this.props.handleValidation(this.props.title, null, isFormValid);
                }
            });

        }
    }

    renderFormButtons(buttons) {

        const { animatedButtons, isFormValidated } = this.state;

        return (
            <Grid rows={1} cols={buttons.length}>
                {
                    buttons.map((button, index) => {

                        const isDisabled = (
                            button == 'form-submit' ||
                            button == 'form-confirm' ||
                            button == 'form-accept' ||
                            button == 'form-next'
                        ) && !isFormValidated;

                        return (
                            <Button
                                key={index}
                                style={{ margin : `10px ${index < buttons.length - 1 ? '10px' : '0'} 10px 0` }}
                                position={[0, index]}
                                disabled={ isDisabled || animatedButtons[button]}
                                className={`form-button ${button} ${animatedButtons[button] ? 'animate' : ''}`}
                                onClick={() => this.onSubmitClick(button)}
                            >
                                <div className={'button-spinner'} />
                            </Button>
                        );
                    })
                }
            </Grid>
        );
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

    askForConfirmation(text) {
        return confirm(text);
    }

    render() {

        const { data, title, submitButtons, isHorizontal } = this.props;
        const subforms = this.renderData(data);
        if(subforms == null) return null;

        return (
            <div className="form-group">
                <div className="form-group-title" onClick={this.onClick}>
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
