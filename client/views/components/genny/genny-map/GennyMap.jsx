import './gennyMap.scss';
import React, { Component } from 'react';
import { string, object, bool } from 'prop-types';
import { MapDisplay } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class GennyMap extends Component {

    static defaultProps = {
        root: '',
        hideRoutes: false,
        hideMarkers: false,
    }

    static propTypes = {
        root: string,
        style: object,
        mapStyle: object,
        hideRoutes: bool,
        hideMarkers: bool
    };

    state = {
    }

    getDataFromCode = (root) => {

        let data = BaseEntityQuery.getBaseEntity(root);

        if(!data || data.length == 0) {

            let children = BaseEntityQuery.getEntityChildren(root);
            if(!children || children.length == 0) { return []; }

            const childAttributes = this.checkChildrenForAttributes(children);

            if (childAttributes) {
                let mapData = this.getChildrenMapData(children);
                return mapData;
            }
            else {
                let markers = [];
                let routes = [];
                children.map( child => {
                    if (child && child.code) {
                        let result = this.getDataFromCode(child.code);
                        if (result.markers && result.markers.length > 0) {
                            result.markers.map(marker => {
                                markers.push(marker);
                            });
                        }
                        if (result.routes && result.routes.length > 0) {
                            result.routes.map(route => {
                                routes.push(route);
                            });
                        }
                    }
                });
                let mapData = { markers: markers, routes: routes };
                return mapData;
            }
        }

        const entityAttribute = this.checkEntityForAttributes(data);

        if (entityAttribute) {
            let mapData = this.getEntityMapData(data);
            return mapData;
        }
        else {

            let children = BaseEntityQuery.getEntityChildren(root);
            if(!children || children.length == 0) { return []; }

            const childAttributes = this.checkChildrenForAttributes(children);

            if (childAttributes) {
                let mapData = this.getChildrenMapData(children);
                return mapData;
            }
            else {
                let markers = [];
                let routes = [];
                children.map( child => {
                    if (child && child.code) {
                        let result = this.getDataFromCode(child.code);
                        if (result.markers && result.markers.length > 0) {
                            result.markers.map(marker => {
                                markers.push(marker);
                            });
                        }
                        if (result.routes && result.routes.length > 0) {
                            result.routes.map(route => {
                                routes.push(route);
                            });
                        }
                    }
                });
                let mapData = { markers: markers, routes: routes };
                return mapData;
            }
        }
    }

    checkEntityForAttributes = (data) => {

        let hasAttributes = false;

        let attributes = data.attributes;
        if (attributes) {
            Object.keys(attributes).map(attribute_key => {
                switch(attribute_key) {
                    case 'PRI_PICKUP_ADDRESS_SUBURB':
                    case 'PRI_PICKUP_ADDRESS_STATE':
                    case 'PRI_DROPOFF_ADDRESS_SUBURB':
                    case 'PRI_DROPOFF_ADDRESS_STATE':
                    case 'PRI_CURRENT_POSITION':
                    case 'PRI_POSITION_LAT':
                    case 'PRI_POSITION_LON':
                        hasAttributes = true;
                        break;
                    default:
                        return null;
                }
            });
            }

        return hasAttributes;
    }

    getEntityMapData = (baseEntity) => {

        let markers = [];
        let routes = [];

        let attributes = baseEntity.attributes;

        let originSuburb;
        let originState;
        let destSuburb;
        let destState;

        if (attributes) {

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
                    default:
                        return null;
                }
            });

            // live position
            if(attributes.PRI_POSITION_LONGITUDE!= null && attributes.PRI_POSITION_LATITUDE != null) {

                markers.push({
                    lat: parseFloat(attributes.PRI_POSITION_LATITUDE.value),
                    lng: parseFloat(attributes.PRI_POSITION_LONGITUDE.value)
                });
            }

            let originAddress = originSuburb + ', ' + originState;
            let destAddress = destSuburb + ', ' + destState;

            routes.push({
                origin: originAddress,
                dest: destAddress
            });
        }

        return {markers: markers, routes: routes};
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
                        case 'PRI_POSITION_LATITUDE':
                        case 'PRI_POSITION_LONGITUDE':
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

    getChildrenMapData = (baseEntities) => {

        let markers = [];
        let routes = [];
        baseEntities.map(baseEntity => {

            let attributes = baseEntity.attributes;

            let originSuburb;
            let originState;
            let destSuburb;
            let destState;

            if (attributes) {

                let text = '<div>'+
                    '<span style="font-weight: 1000;" >' + attributes.PRI_TITLE.value + '</span>' +
                    '<div>' + 
                        '<span>' + 'Pickup: ' + attributes.PRI_PICKUP_ADDRESS_SUBURB.value + ', ' + attributes.PRI_PICKUP_ADDRESS_STATE.value + '</div>' +
                    '</div>' +
                    '<div>' + 
                        '<span>' + 'Delivery: ' + attributes.PRI_DROPOFF_ADDRESS_SUBURB.value + ', ' + attributes.PRI_DROPOFF_ADDRESS_STATE.value + '</div>' +
                    '</div>' +
                '</div>';

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
                                lat: parseFloat(attributes[attribute_key].lat),
                                lng: parseFloat(attributes[attribute_key].lng),
                                text: text
                            });
                            break;
                        default:
                            return null;
                    }
                });

                // live position
                if(attributes.PRI_POSITION_LONGITUDE != null && attributes.PRI_POSITION_LATITUDE != null && this.props.hideMarkers != true ) {
                    markers.push({
                        lat: parseFloat(attributes.PRI_POSITION_LATITUDE.value),
                        lng: parseFloat(attributes.PRI_POSITION_LONGITUDE.value),
                        text: text
                    });
                }

                let originAddress = originSuburb + ', ' + originState;
                let destAddress = destSuburb + ', ' + destState;

                if ( !this.props.hideRoutes == true) {
                    routes.push({
                        origin: originAddress,
                        dest: destAddress
                    });
                }
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
                    markers={mapData && mapData.markers }
                    routes={mapData && mapData.routes }
                />
            </div>
        );
    }
}

export default GennyMap;
