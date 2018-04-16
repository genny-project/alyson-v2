import React, { Component } from 'react';
import { array, string } from 'prop-types';

class Utils extends Component {

    static propTypes = {
        type: string,
        format: string,
        data: array,
        argumentArray: array
    };

    exclude = (data, args) => {
        console.log(data, args);
        return data.filter(x => x != args[0]);
    }

    render() {
        const { data, type, format, argumentArray} = this.props;
        let newData;

        if (format == 'array') {
            newData = data.split(',');
        }


        if (type == 'exclude') {
            newData = this.exclude(data, argumentArray);
        }
        else {
            if (argumentArray != null) {
                newData = data[type](...argumentArray);
            } else {
                newData = data[type]();
            }
        }
        return <span>{newData}</span>;
    }
}

export default Utils;
