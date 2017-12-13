import React, { Component } from 'react';
import { string, object } from 'prop-types';

class GennyTableCell extends Component {

    static defaultProps = {
        original: {},
        value: '',
    }

    static propTypes = {
        original: object,
        value: string,
    }

    render() {

        const { original, value } = this.props;

        return (
            <span
                style={{
                fontSize: '14px',
                color: (() => {

                        if(original) {

                            if(original.inferred == true) return '#cd201f';
                            if(original.code.startsWith("PRI_")) return 'black';
                            if(original.code.startsWith("FBK_")) return '#3B5998';
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
