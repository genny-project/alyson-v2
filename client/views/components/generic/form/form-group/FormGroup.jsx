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
        console.log('MOUNTED: ', this.props.title);
            
        // if (this.props.onMount) {
        //     console.log(this.props.title, this.state.isFormValidated);
        //     this.props.onMount(this.props.code, null, this.state.isFormValidated);
        // }

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

        const { isHorizontal } = this.props;

        //this.inputRefs = {};
        if(data.length == 0) return null;

        return data.map((child, index) => {

            //check if child is a React Element, and if yes, then render that element
            if (child.$$typeof) {
                //return child;
                return React.cloneElement(child, {
                    onMount: this.onMount,
                    onValidCheck: this.checkIfFormIsValid
                });
            }
            //if child is NOT a React Element, ie: it is a data object, render that data as a Input Element 
            else {

                return (
                    <Input
                        {...child}
                        onMount={this.onMount}
                        onValidation={
                            (argument1, argument2, argument3, argument4, argument5) => { 
                                this.updateChildState(argument5, argument1, argument4);
                                child.onValidation(argument1, argument2, argument3);
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
        });
    }

    onMount = (a, b, c) => {
        
        this.children[a] = {
            value: b,
            isValid: c
        };
    }

    setChildrenState = () => {

        console.log('setState', this.props.title);

        this.setState({
            children: this.children
        }, () => {
            this.checkIfFormIsValid();
        });
    }

    updateChildState = (id, value, isValid) => {
        console.log('========================');
        console.log(id, value, isValid);
        this.setState({
            children: {
                ...this.state.children,
                [id]: {
                    value: value,
                    isValid: isValid
                }
            }
        }, () => {
            this.checkIfFormIsValid();
        });
    }

    checkIfFormIsValid() {

        if(this._ismounted) {

            console.log('-------------------');
            console.log('CHECK IF "', this.props.title, '" IS VALID');

            if (this.props.onValidCheck) console.log( 'calling..');

            const { children }= this.state;
            console.log(children, Object.keys(children));
            const isFormValid = Object.keys(children).every(child_key => {
                const child = children[child_key];
                const isChildValid = child && child.isValid != null ? child.isValid : true;
                return isChildValid;
            });
            
            console.log('. . . . . . . . . . .');
            console.log('RESULT: ', isFormValid);
            if(isFormValid) {
                if(this.state.isFormValidated == false){
                    this.setState({
                        isFormValidated: true
                    }, () => {
                        console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~');
                        console.log('is form valid? ', this.props.title, this.state.isFormValidated);
                        if (this.props.onValidCheck) this.props.onValidCheck();
                        if (this.props.onMount) {
                            this.props.onMount(this.props.code, null, this.state.isFormValidated);
                        }
                    });
                }
                else {
                    console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~');
                    console.log('is form valid? ', this.props.title, this.state.isFormValidated);
                    if (this.props.onValidCheck) this.props.onValidCheck();
                    if (this.props.onMount) {
                        this.props.onMount(this.props.code, null, this.state.isFormValidated);
                    }
                }
            }
            else {
                if(this.state.isFormValidated == true) {
                    this.setState({
                        isFormValidated: false
                    }, () => {
                        console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~');
                        console.log('is form valid? ', this.props.title, this.state.isFormValidated);
                        if (this.props.onValidCheck) this.props.onValidCheck();
                        if (this.props.onMount) {
                            this.props.onMount(this.props.code, null, this.state.isFormValidated);
                        }
                    });
                }
                else {
                    console.log('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~');
                    console.log('is form valid? ', this.props.title, this.state.isFormValidated);
                    if (this.props.onValidCheck) this.props.onValidCheck();
                    if (this.props.onMount) {
                        this.props.onMount(this.props.code, null, this.state.isFormValidated);
                    }
                }
            }
        }
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
