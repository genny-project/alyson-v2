import './formGroup.scss';
import React, { Component } from 'react';
import { array, string, func, object } from 'prop-types';
import { Input } from 'views/components';

class FormGroup extends Component {

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

    render() {

        const { data, title, onSubmit } = this.props;

        let inputs = this.renderData(data);

        return (
            <div className="form-group">
                <div className="form-group-title">
                    {title}
                </div>
                {inputs}
                {(onSubmit) ? <Input className="submit" type="Button" onClick={onSubmit} name="Submit" /> : null}
            </div>
        );
    }

}

export default FormGroup;
