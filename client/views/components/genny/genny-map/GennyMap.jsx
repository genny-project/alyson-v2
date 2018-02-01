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

    getDataFromCode = (root) => {
        
        let data = BaseEntityQuery.getEntityChildren(root);
        if(!data || data.length == 0) { return []; }
        
        const doEntitiesHaveAttribute = this.checkChildrenForAttributes(data);
        
        console.log(doEntitiesHaveAttribute);
        if (doEntitiesHaveAttribute) {
            let mapData = this.getMapData(data);
            console.log(mapData);
            return mapData;
        }
        else {
            return this.getDataFromCode(data);
        }
    }

    checkChildrenForAttributes = (data) => {
        
        let hasAttributes = false;
        
        data.map(baseEntity => {
            let attributes = baseEntity.attributes;
            if (attributes) {
                Object.keys(attributes).map(attribute_key => {
                    switch(attribute_key) {
                        case 'PRI_PICKUP_ADDRESS_SUBURB':
                        case 'PRI_PICKUP_ADDRESS_STATE':
                        case 'PRI_DROPOFF_ADDRESS_SUBURB':
                        case 'PRI_DROPOFF_ADDRESS_STATE':
                        case 'PRI_CURRENT_POSITION':
                            hasAttributes = true;
                            break;
                        default:
                            return null;
                    }
                });
            }
        });

        return hasAttributes;
    }

    getMapData = (baseEntities) => {
        let markers = [];
        let routes = [];
        baseEntities.map(baseEntity => {
            
            let attributes = baseEntity.attributes;

            let originSuburb;
            let originState;
            let destSuburb;
            let destState;
            
            if (attributes){
                Object.keys(attributes).map(attribute_key => {

                    switch(attribute_key) {
                        case 'PRI_PICKUP_ADDRESS_SUBURB':
                            originSuburb = attributes[attribute_key].value;
                            break;
                        case 'PRI_PICKUP_ADDRESS_STATE':
                            originState = attributes[attribute_key].value;
                            break;
                        case 'PRI_DROPOFF_ADDRESS_SUBURB':
                            destSuburb = attributes[attribute_key].value;
                            break;
                        case 'PRI_DROPOFF_ADDRESS_STATE':
                            destState = attributes[attribute_key].value;
                            break;
                        case 'PRI_CURRENT_POSITION':
                            markers.push({
                                lat: attributes[attribute_key].lat,
                                lng: attributes[attribute_key].lng
                            });
                            break;
                        default:
                            return null;
                    }
                });
                let originAddress = originSuburb + ', ' + originState;
                let destAddress = destSuburb + ', ' + destState;

                routes.push({
                    origin: originAddress,
                    dest: destAddress
                });
            }
        });

        return {markers: markers, routes: routes};
    }

    render() {

        const { root, style, mapStyle, ...rest } = this.props;
        const componentStyle = { ...style};
        let mapData = this.getDataFromCode(root);

        return (
            <div className="genny-map" style={componentStyle}>
                <MapDisplay
                    {...rest}
                    style={mapStyle}
                    markers={mapData && mapData.markers}
                    routes={mapData && mapData.routes}
                />
            </div>
        );
    }
}

export default GennyMap;
