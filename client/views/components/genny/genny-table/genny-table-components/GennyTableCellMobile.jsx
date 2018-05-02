import React, { Component } from 'react';
import { array, bool, object } from 'prop-types';
import { IconSmall } from 'views/components';

class GennyTableCellMobile extends Component {

    static defaultProps = {
        data: [],
        row: {},
        original: {},
    }

    static propTypes = {
        data: array,
        ow: object,
        original: object,
    }

    state = {
        isOpen: {},
    }

    onClick = (code) => {
        this.setState(prevState => ({
            isOpen: {
                ...this.state.isOpen,
                [code]: !prevState.isOpen[code],
            }
        }));

    }

    renderField = (data) => {
        console.log(data);
        // switch (dataType) {

        //     case 'Image': {
        //         return <ImageView src={valueState || value} style={{ width: '30px', height: '30px' }} />;
        //     }

        //     case 'link': {
        //         return <a href={valueState || value}>Click Here</a>;
        //     }

        //     case 'java.lang.Boolean': {
        //         return (
        //             <input
        //                 checked={valueState || value}
        //                 type="checkbox"
        //             />
        //         );
        //     }

        //     case 'Mobile': 
        //     case 'Email' : {
        //         <span className='table-mobile-cell-cell'>{attributeObj && attributeObj.value}</span>;
        //     }
        // }
    }

    render() {

        const { data, row, original } = this.props;
        const { isOpen } = this.state;

        return (
            <div className='table-mobile-cell'>
                    <IconSmall
                        className='table-mobile-icon clickable'
                        onClick={() => this.onClick(original.baseEntityCode)}
                        name={isOpen[original.baseEntityCode] ? 'expand_more' : 'chevron_right'}
                    />
                {
                    data.map((attribute, i ) => {

                        if ( i ===  0 || i > 0 && isOpen[original.baseEntityCode] === true ) {
                            const attributeObj = original[attribute.attributeCode];
                            
                            return (

                                <div key={i} className={`${ i === 0 ? 'table-mobile-cell-header' : 'table-mobile-cell-row'} ${ isOpen[original.baseEntityCode] ? 'header-divider' : null }`}>
                                    <span className='table-mobile-cell-cell'>{attribute.name}:</span>
                                    <span className='table-mobile-cell-cell'>{attributeObj && attributeObj.value}</span>
                                    {//this.renderField()
                                    }
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }

}

export default GennyTableCellMobile;
