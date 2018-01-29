import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class SublayoutLoader extends Component {
    static propTypes = {
        layoutCode: string,
        style: object,
        className: string,
        aliases: object,
    }

    render() {

        const { layoutCode, sublayouts, style, className, aliases } = this.props;
        const componentStyle = { ...style };
        const sublayout = sublayouts[layoutCode];

        return (
            <div className={`sublayout-loader ${className}`} style={componentStyle} >
                <LayoutLoader layout={sublayout} aliases={aliases}/>;
            </div>
        );
    }
}

export default SublayoutLoader;
