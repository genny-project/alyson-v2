import './formGroup.scss';
import React, { Component } from 'react';
import { array, string } from 'prop-types';

class FormGroup extends Component {

    static defaultProps = {
        children: [],
        title: '',
    }

    static propTypes = {
      children: array,
      title: string,
    }

    render() {

        const { children, title } = this.props;

        return (
            <div className="form-group">
                <div className="form-group-title">
                    {title}
                </div>
                {children}
            </div>
        );
    }

}

export default FormGroup;
