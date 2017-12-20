import './formGroup.scss';
import React, { PureComponent } from 'react';
import { array, string, func } from 'prop-types';
import { Input } from '../../';

class FormGroup extends PureComponent {

    static defaultProps = {
        data: [],
        title: '',
        onSubmit: null,
    }

    static propTypes = {
      data: array,
      title: string,
      onSubmit: func,
    }

    renderData = (data) => {

        return data.map((child, index) => {

            if (child.$$typeof){
                return child
            } else {
                return <Input key={index} {...child}/>
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
