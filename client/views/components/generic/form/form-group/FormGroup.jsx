import './formGroup.scss';
import React, { Component } from 'react';
import { array } from 'prop-types';

class FormGroup extends Component {

    static defaultProps = {
        children: [],
    }

    static propTypes = {
      children: array,
    }

    render() {

        const { children } = this.props;

        return (
            <div className="form-group">

                <div className="form-group-title">
                    {children.title}
                </div>
                {children.content}
            </div>
        );
    }

}

export default FormGroup;
