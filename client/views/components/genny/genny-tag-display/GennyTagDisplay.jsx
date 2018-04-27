import './gennyTagDisplay.scss';
import React, { Component } from 'react';
import { string, object, array} from 'prop-types';
import { TagDisplay } from 'views/components';

class GennyTagDisplay extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        data: array,
        attributePrefix: string,
        style: object,
        tagStyle: object,
    };

    state = {
    }

    formatData = (data) => {
        return data;
    }

    render() {

        const { data, style, tagStyle, ...rest } = this.props;
        const componentStyle = { ...style};

        let formattedData = this.formatData(data);

        return (
            <div className="genny-tag-display" style={componentStyle}>
                <TagDisplay
                    {...rest}
                    style={tagStyle}
                    data={formattedData}
                />
            </div>
        );
    }
}

export default GennyTagDisplay;
