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

        const { code, value } = this.props;

        return (
            <span
                style={{
                fontSize: '14px',
                color: (() => {

                        if(code) {
                            if(code.startsWith("PRI_")) return 'black';
                            if(code.startsWith("FBK_")) return '#3B5998';
                        }

                        return null;
                    })()
                }}>
                {value}
            </span>
        );
    }

}

export default GennyTableCell;
