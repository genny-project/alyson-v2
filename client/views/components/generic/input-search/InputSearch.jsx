import './inputSearch.scss';
import React, { Component } from 'react';
import { string, object, bool, func } from 'prop-types';
import { Label, InputText, IconSmall } from 'views/components';

class InputSearch extends Component {

    static defaultProps = {
        className: '',
        prefix: '',
    }

    static propTypes = {
        className: string,
        prefix: string,
        style: object,
        value: string,
        mandatory: bool,
        validation: func,
        validationStatus: string,
        name: string
    }

    state = {
        hasChanges: false,
    }

    handleClearInput = () => {
        const { validationList, validation, identifier, onBlur } = this.props;
        
        if(onBlur) onBlur();    
        if(validation) validation('', identifier, validationList);
    }
    
    render() {

        const { name, value, ...rest } = this.props;
        return (
            <div className="input input-search">
                { name ?
                    <div className='input-header'>
                        <Label text={name} />
                    </div>
                : null }
                <div className='input-search-main'>
                    <IconSmall
                        className='input-search-icon-search'
                        name='search'
                    />
                    <InputText
                        {...rest}
                        hideHeader
                        style={{ width: '100%' }}
                        value={value}
                        validationStatus='normal'
                    />
                    <IconSmall
                        className='input-search-icon-clear clickable'
                        name='clear'
                        onClick={this.handleClearInput}
                    />
                </div>
            </div>
        );
    }
}

export default InputSearch;
