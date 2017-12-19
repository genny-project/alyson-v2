import './gennyCarousel.scss';
import React, { Component } from 'react';
import { object, string, number } from 'prop-types';
import { Carousel } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyCarousel extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
    };

    state = {
    }

    generateItems(data) {

        return data.map(item => {

            //TODO : get layout code from BE

            //let layout_code = BaseEntityQuery.getBaseEntityAttribute(be, "PRI_LAYOUT");
            //layout_code = layout_code ? layout_code.value : null;

            let layout_code = 'cardLayout';
            let sublayout = this.props.sublayout[layout_code]; 

            item['layout'] = <LayoutLoader layout={sublayout} />;
            
            return item;
        });
    }  

    render() {

        const { root, style, className, ...rest } = this.props;
        const componentStyle = { ...style, };

        let data = BaseEntityQuery.getEntityChildren(root);
        return (
            <div className={`genny-carousel ${className}`} style={componentStyle}>
                <Carousel 
                    data={ this.generateItems(data) }
                    {...rest}
                />
            </div>
        );
    }
}

export default GennyCarousel;
