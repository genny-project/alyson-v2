import './formGroup.scss';
import React, { PureComponent } from 'react';
import { array, string } from 'prop-types';
import { Input } from '../../';

class FormGroup extends PureComponent {

    static defaultProps = {
        data: [],
        title: '',
    }

    static propTypes = {
      data: array,
      title: string,
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

        const { data, title } = this.props;
        
        return (
            <div className="form-group">
                <div className="form-group-title">
                    {title}
                </div>
                {this.renderData(data)}
            </div>
        );
    }

}

export default FormGroup;
