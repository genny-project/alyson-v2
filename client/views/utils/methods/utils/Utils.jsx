import React, { Component } from 'react';
import { array, string } from 'prop-types';

class Utils extends Component {

    static propTypes = {
        type: string,
        format: string,
        data: array,
        argumentArray: array
    };

    render() {
        const { data, type, format, argumentArray} = this.props;
        let newData = data;
        let newArguments = argumentArray;

        if (format == 'array') {
            newData = data.split(',');
        }
        
        switch (type) {
            case 'filter-inc':
                if (argumentArray != null) {
                    newData = newData.filter(x => x == newArguments);
                }
            break;
            case 'filter-exc':
                if (argumentArray != null) {
                    newData = newData.filter(x => x != newArguments);
                }
            break;
            default:
                if (argumentArray != null) {
                    newData = newData[type](...newArguments);
                } else {
                    newData = newData[type]();
                } 
        }
    
        return <span>{newData}</span>;
    }
}

export default Utils;
