import './gennyMap.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { MapDisplay } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class GennyMap extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
        style: object,
        mapStyle: object,
    };

    state = {
    }

    getMarkers = (baseEntities) => {
        console.log('==================');
        // map baseEntities
        
        let markers = [];
        baseEntities.map(be => {

            //for each baseEntity
            let attributes = be.attributes;
            //get attributes
            Object.keys(attributes).map(attribute_key => {

                if (attribute_key == 'PRI_CURRENT_POSITION') {

                    console.log(attribute_key, attributes[attribute_key]);
                    markers.push({
                        lat: attributes[attribute_key].lat,
                        lng: attributes[attribute_key].lng
                    });
                }
            });
        });

        return markers;
    }

    getRoutes = (baseEntities) => {
        console.log('==================');
        // map baseEntities
        
        let routes = [];
        baseEntities.map(be => {

            //for each baseEntity
            let attributes = be.attributes;
            //get attributes

            let origin = {};
            let dest = {};

            console.log(Object.keys(attributes));
            
            Object.keys(attributes).map(attribute_key => {

                console.log(attribute_key, attributes[attribute_key]);
                    

                //PRI_PICKUP_ADDRESS_SUBURB + PRI_PICKUP_ADDRESS_STATE
                // OR
                //PRI_PICKUP_ADDRESS_FULL

                // AND

                //PRI_DROPOFF_ADDRESS_SUBURB + PRI_DROPOFF_ADDRESS_STATE
                // OR
                //PRI_DROPOFF_ADDRESS_FULL

                if (attribute_key == 'PRI_PICKUP_ADDRESS_SUBURB') {
                    
                }
            });

            routes.push({
                lat: attributes[attribute_key].lat,
                lng: attributes[attribute_key].lng
            });
        });

        return routes;
    }

    render() {

        const { root, style, mapStyle, ...rest } = this.props;
        const componentStyle = { ...style};
        let data = BaseEntityQuery.getEntityChildren(root);
        let markers = this.getMarkers(data);
        let routes = this.getRoutes(data);
        
        return (
            <div className="genny-map" style={componentStyle}>
                <MapDisplay
                    {...rest}
                    style={mapStyle}
                    markers={markers}
                    routes={routes}
                />
            </div>
        );
    }
}

export default GennyMap;
