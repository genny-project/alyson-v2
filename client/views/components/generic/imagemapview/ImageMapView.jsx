import './ImageMapView.scss';
import React, { Component } from 'react';
import { string, number, oneOf} from 'prop-types';
import { ImageView } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { GennyBridge } from 'utils/genny';

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

        const { src, address, height, width, children, ...rest } = this.props;

        //const apiKey = BaseEntityQuery.getAliasAttribute('PROJECT', 'PRI_GOOGLE_API_KEY');

        const apiKey = 'AIzaSyDKDQp98g2ip6m1GtdEb7MZxxJLE_840VE';

        const addressString = encodeURI(address);

        let imageString = null;
        const proxyAttribute = BaseEntityQuery.getBaseEntityAttribute(GennyBridge.getProject(), 'PRI_IMAGE_PROXY_URL');
        let proxy = null;
        if(proxyAttribute) {
            proxy = proxyAttribute.value;
        }

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
            <div>
                <div
                    position={[0, 0]}
                    {...rest}
                    style={{
                        ...this.props.style,
                        height: height,
                        width: width,
                        'backgroundRepeat': 'noRepeat',
                        'backgroundImage': 'url("' + imageString + '")',
                        'backgroundSize': 'cover',
                        'backgroundPositionY': 'center'
                    }}
                    src={imageString}
                    proxyUrl={proxy}
                />
                <div
                    position={[1, 0]}
                    >
                    {children}
                </div>
            </div>
        );
    }
}

export default ImageMapView;
 