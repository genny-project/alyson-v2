import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { ImageView } from 'views/components';

class GennyTableCell extends Component {

    static defaultProps = {
        original: {},
        value: '',
        dataType: '',
    }

    static propTypes = {
        original: object,
        value: string,
        dataType: string,
    }

    render() {

        const { original, value, dataType } = this.props;

        switch (dataType) {

            case "Image": {
                return <ImageView src={value} style={{ "width": "30px", "height": "30px", "borderRadius": "25px" }} />
            }

            default: {

                return (
                    <span
                        style={{
                        fontSize: '14px',
                        color: (() => {

                                if(original && original.code) {

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
    }

}

export default GennyTableCell;
