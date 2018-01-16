import './formGroup.scss';
import React, { Component } from 'react';
import { array, string, func, object } from 'prop-types';
import { Input, Button } from 'views/components';
import { Grid } from '@genny-project/layson'

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
    }

    state = {
        isFormValidated: true,
        animatedButtons: {}, // TODO: hum.
        isMobile: window.getScreenSize() == 'sm'
    }

    componentWillMount() {
        this.inputRefs = [];
    }

    componentWillUpdate() {
        this.inputRefs = [];
        this.state.animatedButtons = {};
    }

    renderData = (data) => {

        const { isHorizontal } = this.props;

        return data.map((child, index) => {

            if (child.$$typeof) {
                return child
            } else {
                return (
                    <Input
                        ref={inputRef => this.inputRefs.push(inputRef)}
                        key={index} {...child}
                        style={isHorizontal && !this.state.isMobile ?
                            { "marginLeft": "5px", "marginRight": "5px", "marginBottom": "10px", "width": "calc(50% - 10px)" } :
                            { "marginBottom": "5px" }}
                    />
                )
            }
        });
    }

    onSubmitClick = (button) => {

        // first we validate all the inputs and see if we get any error.
        if(this.props.onSubmit) {

            if(this.props.onSubmit(button.replace('form-', ''))) {
                let animatedButtons = this.state.animatedButtons
                animatedButtons[button] = animatedButtons[button] ? !animatedButtons[button] : true;
                this.setState({
                    animatedButtons: animatedButtons
                })
            }
        }
    }

    isFormGroupValid = () => {

        return this.inputRefs.map(input => {
            return input ? input.isValid() : true;
        });
    }

    renderFormButtons(buttons) {

        const { animatedButtons } = this.state;

        return (
            <Grid rows={1} cols={buttons.length}>
                {
                    buttons.map((button, index) => {
                        return (
                            <Button
                                key={index}
                                style={{ "margin" : "10px" }}
                                position={[0, index]}
                                disabled={animatedButtons[button]}
                                className={`form-button ${button} ${animatedButtons[button] ? "animate" : ""}`}
                                onClick={() => this.onSubmitClick(button)}>
                                {
                                    <div className={"spinner"} />
                                }
                            </Button>
                        )
                    })
                }
            </Grid>
        )
    }

    render() {

        const { data, title, submitButtons, isHorizontal } = this.props;
        const subforms = this.renderData(data);

        return (
            <div className="form-group">
                <div className="form-group-title">
                    {title}
                </div>
                <div style={isHorizontal && !this.state.isMobile ? { "display": "flex", "flexWrap": "wrap" } : null}>
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
