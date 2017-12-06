import React, { Component } from 'react';
import { string } from 'prop-types';

class GennyTableCell extends Component {

    static defaultProps = {
        code: '',
        value: '',
    }

    static propTypes = {
        code: string,
        value: string,
    }

    render() {
        return (
            <span
                style={{
                fontSize: '14px',
                color: (() => {

                        if(this.props.code) {
                            if(this.props.code.startsWith("PRI_")) return 'black';
                            if(this.props.code.startsWith("FBK_")) return '#3B5998';
                        }

                        return null;
                    })()
                }}>
                {this.props.value}
            </span>
        );
    }

}

export default GennyTableCell;
