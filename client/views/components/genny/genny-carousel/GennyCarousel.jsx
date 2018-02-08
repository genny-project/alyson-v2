import './gennyList.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { Carousel } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class GennyCarousel extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
    };

    state = {
    }

    renderItems = (attribute) => {
        
        let array = [];

        attribute.map(item => {
            if (item.uploadURL != null) {
                array.push({
                    img: item.uploadURL,
                    id: item.id || null
                });
            }
        });
        return array;
    }

    render() {

        const { root, ...rest } = this.props;

        const attribute = BaseEntityQuery.getBaseEntityAttribute(root, 'PRI_IMAGE_URL');
        const items = this.renderItems(attribute);

        return (
            <div className="genny-carousel">
                <Carousel
                    items={items}
                    {...rest}
                />
            </div>
        );
    }
}

export default GennyCarousel;
