import './ImageMapView.scss';
import React, { Component } from 'react';
import { string, number, oneOf} from 'prop-types';
import { ImageView } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class ImageMapView extends Component {
    static defaultProps = {
        height: 50,
        width: 50,
        iconSize: 'small'
    }

    static propTypes = {
        address: string,
        height: number,
        width: number,
        iconSize: oneOf(
            'small', 'tiny', 'medium'
        )
    };

    state = {
        error: false,
    }



    render() {

        const { src, address, height, width, ...rest } = this.props;

        //const apiKey = BaseEntityQuery.getAliasAttribute('PROJECT', 'PRI_GOOGLE_API_KEY');

        const apiKey = 'AIzaSyDKDQp98g2ip6m1GtdEb7MZxxJLE_840VE';

        const addressString = encodeURI(address);

        let imageString = null;

        if (
            apiKey &&
            // apiKey.value &&
            // typeof apiKey.value === 'string' &&
            addressString &&
            typeof addressString === 'string' &&
            height &&
            width
        ) {
            imageString = `https://maps.googleapis.com/maps/api/streetview?location=${addressString}&size=${width}x${height}&key=AIzaSyDKDQp98g2ip6m1GtdEb7MZxxJLE_840VE`;
        }

        return (
            <GennyImageView
                {...rest}
                style={{
                    ...this.props.style,
                    height: height,
                    width: width,
                }}
                src={imageString}
                proxyUrl="https://images.channel40.com.au/ch400,cy200/"
            />
        );
    }
}

export default ImageMapView;
