import React, { Component } from 'react';
import { string } from 'prop-types';

class GennyTableHeader extends Component {

    static defaultProps = {
        title: 'Header',
    }

    static propTypes = {
        title: string,
    }

    render() {
        return (
            <div className='table-header'>
                <span>{this.props.title}</span>
            </div>
        );
    }

}

export default GennyTableHeader;
