import './formGroup.scss';
import React, { PureComponent } from 'react';
import { array, string, func, object } from 'prop-types';
import { Input } from '../../';

class FormGroup extends PureComponent {

    static defaultProps = {
        data: [],
        title: '',
        onSubmit: null,
        onGroupValidation: null,
    }

    static propTypes = {
      data: array,
      title: string,
      onSubmit: func,
      onGroupValidation: func,
    }

    state = {
        mandatoryAnswers: {},
    }

    onInputValidation = (newValue, data, mandatory) => {

        if(mandatory && data.code) {

            let identifier = data.identifier;
            this.state.mandatoryAnswers[identifier] = true;
            // this.updateGroupButton()

            // if(this.props.onGroupValidation) this.props.onGroupValidation(this);
        }

        console.log( this.state )
    }

    renderData = (data) => {

        return data.map((child, index) => {

            if (child.$$typeof){
                return child
            } else {

                if(child.mandatory) {

                    // first we check if the question is mandatory.
                    // if it is we save the information to check it has been correctly filled later on
                    this.state.mandatoryAnswers[child.identifier] = child.value != null;
                }

                return <Input key={index} {...child} onValidation={(newValue, data, mandatory) => {
                    this.onInputValidation(newValue, data, mandatory);
                    child.onValidation(newValue, data, mandatory);
                }}/>
            }
        });
    }

    render() {

        const { data, title, onSubmit } = this.props;

        return (
            <div className="form-group">
                <div className="form-group-title">
                    {title}
                </div>
                {this.renderData(data)}
                {onSubmit ? <Input className="submit" type="Button" onClick={onSubmit} name="Submit" /> : null}
            </div>
        );
    }

}

export default FormGroup;
