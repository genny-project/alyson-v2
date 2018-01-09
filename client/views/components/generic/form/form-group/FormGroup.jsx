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
    }

    renderData = (data) => {

        return data.map((child, index) => {

            if (child.$$typeof) {
                return child
            } else {
                return (
                    <Input key={index} {...child} />
                )
            }
        });
    }

    renderFormButtons(buttons) {

        return (
            <Grid rows={1} cols={buttons.length}>
                {
                    buttons.map((button, index) => {
                        return <Button style={{ "margin" : "10px" }} position={[0, index]} className={button} onClick={this.props.onSubmit} />
                    })
                }
            </Grid>
        )
    }

    render() {

        const { data, title, submitButtons } = this.props;

        let inputs = this.renderData(data);

        console.log("== " + title + " ==")
        console.log( submitButtons )

        return (
            <div className="form-group">
                <div className="form-group-title">
                    {title}
                </div>
                {inputs}
                {
                    submitButtons.length > 0 ? this.renderFormButtons(submitButtons) : null
                }
            </div>
        );
    }

}

export default FormGroup;
