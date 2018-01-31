import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class SublayoutLoader extends Component {
    static propTypes = {
        layoutCode: string,
        style: object,
        className: string,
        aliases: object,
        sublayouts: any
    }

    render() {

        const { layoutCode, sublayouts, style, className, aliases } = this.props;
        const componentStyle = { ...style };

        if (sublayouts) {
            const sublayout = sublayouts[layoutCode];

            if (sublayout) {
                return (
                    <div className={`sublayout-loader ${className}`} style={componentStyle} >
                        <LayoutLoader layout={sublayout} aliases={aliases}/>
                    </div>
                );
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}

export default SublayoutLoader;
