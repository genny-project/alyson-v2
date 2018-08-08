import './inputHTML.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Editor, EditorState } from 'draft-js';
import { Label } from 'views/components';

class InputHTML extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
    }

    state = {
    }

    onChange() {
    }

    render() {

        const { className, children, style, placeholder, validationStatus, name, type, mandatory } = this.props;
        const componentStyle = { ...style, };
        const {  } = this.state;

        return (
           <div style={componentStyle} className="input input-tags">
                { name ? <div className='input-header'>
                { name && <Label className="input-tags-picker-label" text={name} /> }
                { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : null} text="*  required" /> : null}
                </div> : null }
                <span>Html Input</span>
           </div>
       );
    }
}

export default InputHTML;
