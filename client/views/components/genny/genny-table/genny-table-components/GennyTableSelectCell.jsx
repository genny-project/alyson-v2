import React, { Component } from 'react';
import { array, object, bool, string } from 'prop-types';

class GennyTableSelectCell extends Component {

    static defaultProps = {
        cellInfo: {},
    }

    static propTypes = {
        dataType: string,
    }

    state = {
    }

    handleClick = () => {
        if (this.props.onClick) this.props.onClick(this.props.beCode);
    }

    render() {
        const { isSelected } = this.props;

        return (
            <div className='table-checkbox'>
                <input
                    checked={isSelected}
                    type="checkbox"
                    onClick={this.handleClick}
                />
            </div>
        );
    }

}

export default GennyTableSelectCell;
