import './gennyMap.scss';
import React, { Component } from 'react';
import { string, object, bool, array } from 'prop-types';
import { MapDisplay } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
const measurement = require('measurement');
const mf = new measurement.Factory();

class GennyMap extends Component {

    static defaultProps = {
        root: '',
        hideRoutes: false,
        polygons: [],
        hideMarkers: false,
    }

    static propTypes = {
        root: string,
        style: object,
        mapStyle: object,
        polygons: array,
        polylines: array,
        hideRoutes: bool,
        hideMarkers: bool,
        btnCode : string
    };

    state = {
    }

    getDataFromCode = (root) => {

        let data = BaseEntityQuery.getBaseEntity(root);

        if(!data || data.length == 0) {

            let children = BaseEntityQuery.getEntityChildren(root);
            console(children);
            if(!children || children.length == 0) { return []; }

            const childAttributes = this.checkChildrenForAttributes(children);
            console(childAttributes);
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
        console('got entity attributes ', entityAttribute);

        if (entityAttribute) {
            let mapData = this.getEntityMapData(root, data);
            return mapData;
        }
        else {

            console.log('getting children of children');
            let children = BaseEntityQuery.getEntityChildren(root);
            if(!children || children.length == 0) { return []; }

            const childAttributes = this.checkChildrenForAttributes(children);

            if (childAttributes) {
                console.log( 'childAttributes');
                let mapData = this.getChildrenMapData(root, children);
                console.log( mapData );
                return mapData;
            }
            else {

                let markers = [];
                let routes = [];

                children.map( child => {

                    if (child && child.code) {

                        let result = this.getDataFromCode(child.code);
                        if (result.markers && result.markers.length > 0) {
                            result.markers.forEach(marker => {
                                markers.push(marker);
                            });
                        }
                        if (result.routes && result.routes.length > 0) {
                            result.routes.forEach(route => {
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
                    case 'PRI_ADDRESS_SUBURB':
                    case 'PRI_ADDRESS_FULL':
                    case 'PRI_ADDRESS_STATE':
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

    getEntityMapData = (root, baseEntity) => {

        let markers = [];
        let routes = [];

        let attributes = baseEntity.attributes;

        let originSuburb;
        let originState;
        let destSuburb;
        let destState;

        if (attributes) {

            let text = this.renderInfowindowContent(root, attributes);

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
                    lng: parseFloat(attributes.PRI_POSITION_LONGITUDE.value),
                    text: text,
                    code: baseEntity.code,
                    root: root
                });
            }

            let originAddress = originSuburb + ', ' + originState;
            let destAddress = destSuburb + ', ' + destState;

            routes.push({
                origin: originAddress,
                dest: destAddress
            });
        }

        return { markers: markers, routes: routes };
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
                        case 'PRI_ADDRESS_SUBURB':
                        case 'PRI_ADDRESS_FULL':
                        case 'PRI_ADDRESS_STATE':
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
        });

        return hasAttributes;
    }

    getChildrenMapData = (root, baseEntities) => {

        let markers = [];
        let routes = [];
        baseEntities.map(baseEntity => {

            let attributes = baseEntity.attributes;

            let originSuburb;
            let originState;
            let destSuburb;
            let destState;

            if (attributes) {

                let text = this.renderInfowindowContent(root, attributes);

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
                                text: text,
                                code: baseEntity.code,
                                root: root
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
                        text: text,
                        code: baseEntity.code,
                        root: root
                    });
                }
                else if(attributes.PRI_ADDRESS_LATITUDE != null && attributes.PRI_ADDRESS_LONGITUDE != null && this.props.hideMarkers != true) {
                    markers.push({
                        lat: parseFloat(attributes.PRI_ADDRESS_LATITUDE.value),
                        lng: parseFloat(attributes.PRI_ADDRESS_LONGITUDE.value),
                        text: text,
                        code: baseEntity.code,
                        root: root
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

    renderInfowindowContent = (root, attributes) => {

        const title = attributes.PRI_TITLE && attributes.PRI_TITLE.value;

        if(GennyBridge.getProject() == 'PRJ_CHANNEL40') {

            let driver = BaseEntityQuery.getLinkedBaseEntity(root,'DRIVER');
            if (driver && driver.value) driver = driver.value;

            const contentDriver = driver && driver.length > 0 ?
                (
                    '<div style="margin-bottom: 5px">' +
                        '<span>' +
                            `Driver: ${driver}` +
                        '</span>' +
                    '</div>'
                ) :
                null;

            const pickupSuburb = ( attributes.PRI_PICKUP_ADDRESS_SUBURB && attributes.PRI_PICKUP_ADDRESS_SUBURB.value ) ? attributes.PRI_PICKUP_ADDRESS_SUBURB.value : null;
            const pickupState = ( attributes.PRI_PICKUP_ADDRESS_STATE && attributes.PRI_PICKUP_ADDRESS_STATE.value ) ? attributes.PRI_PICKUP_ADDRESS_STATE.value : null;
            const dropoffSuburb = ( attributes.PRI_DROPOFF_ADDRESS_SUBURB && attributes.PRI_DROPOFF_ADDRESS_SUBURB.value ) ? attributes.PRI_DROPOFF_ADDRESS_SUBURB.value : null;
            const dropoffState = ( attributes.PRI_DROPOFF_ADDRESS_STATE && attributes.PRI_DROPOFF_ADDRESS_STATE.value ) ? attributes.PRI_DROPOFF_ADDRESS_STATE.value : null;
            const distance =  ( attributes.PRI_TOTAL_DISTANCE_M && attributes.PRI_TOTAL_DISTANCE_M.value ) ? attributes.PRI_TOTAL_DISTANCE_M.value : null;

            let status_color = '#5cb85c';
            let user_status_color = null;

            const userCode = GennyBridge.getUser();

            const attributeKeys = Object.keys(attributes);
            for (var i = 0; i < attributeKeys.length; i++) {

                let attribute_key = attributeKeys[i];

                if(attribute_key == 'STA_STATUS') {
                    status_color = attributes[attribute_key].value || status_color;
                }

                if(attribute_key.startsWith('STA') && attribute_key.indexOf(userCode) > -1) {
                    user_status_color = attributes[attribute_key].value;
                    break;
                }
            }

            let distanceKM = null;
            if (distance ) {
                const newValue = parseFloat(distance.replace(',', ''));
                let measurement = mf.measure(newValue, 'm');
                let convertMeasurement = measurement.as('km');
                convertMeasurement.value = convertMeasurement.value.toFixed(0);
                distanceKM = `${convertMeasurement.as('km')}`;
            }

            let content = (
                '<div>' +
                    '<div style="display: flex; align-items: center; margin-bottom: 5px" >' +
                        `<div style="height: 15px; width: 15px; border-radius: 50%; margin-right: 5px; background: ${user_status_color || status_color}" ></div>` +
                        '<span style="font-weight: 1000;">' +
                            `${title || ''}` +
                        '</span>' +
                    '</div>' +
                    `${contentDriver || ''}` +
                    '<div style="margin-bottom: 5px">' +
                        '<span>' +
                            `Pickup: ${pickupSuburb || ''}, ${pickupState || ''}` +
                        '</span>' +
                    '</div>' +
                    '<div style="margin-bottom: 5px">' +
                        '<span>' +
                            `Delivery: ${dropoffSuburb || ''}, ${dropoffState || ''}` +
                        '</span>' +
                    '</div>' +
                    `${ distance ? `<div style="margin-bottom: 5px"><span>${distanceKM}</span></div>` : '' }` +
                    '<div class="line-break"></div>' +
                    '<div id="map-infowindow" class="map-infowindow-button">' +
                        'See More Details' +
                    '</div>' +
                '</div>'
            );

            return content;
        }
        else if(GennyBridge.getProject() == 'PRJ_PCSS') {

            const addressFull = attributes.PRI_ADDRESS_FULL;

            let content = (
                '<div>' +
                    '<div style="display: flex; align-items: center; margin-bottom: 5px" >' +
                        '<span style="font-weight: 1000;">' +
                            `${title || ''}` +
                        '</span>' +
                    '</div>' +
                    '<div style="margin-bottom: 5px">' +
                        '<span>' +
                            `Property Address: ${addressFull.value || ''}` +
                        '</span>' +
                    '</div>' +
                    '<div class="line-break"></div>' +
                    '<div id="map-infowindow" class="map-infowindow-button">' +
                        'See More Details' +
                    '</div>' +
                '</div>'
            );

            return content;
        }
        else if(GennyBridge.getProject() == 'PRJ_INTERNMATCH') {

            const internshipName = attributes.PRI_NAME && attributes.PRI_NAME.value;
            const addressFull = attributes.PRI_ADDRESS_FULL.value;
            const hostCompany = BaseEntityQuery.getBaseEntity(attributes.LNK_HOST_COMPANY.value);
            const hostCompanyName = hostCompany ? hostCompany.name : null;
            const hostCompanyImage = hostCompany && hostCompany.attributes && hostCompany.attributes.PRI_IMAGE_URL
                ? hostCompany.attributes.PRI_IMAGE_URL.value
                : null;


            let content = (
                '<div>' +
                    '<div style="display: flex; flex-direction: row" >' +            
                        '<div style="margin-right: 5px" >' +            
                            '<img style="width: 50px; height: 50px;" src="' +
                                `${ hostCompanyImage || '' } ` +
                            '" />' +
                        '</div>' +
                        '<div style="margin-right: 5px; display: flex; flex-direction: column" >' +            
                            '<div style="display: flex; align-items: center; margin-bottom: 5px" >' +
                                '<span style="font-weight: 1000;">' +
                                    `${ internshipName || '' } ` +
                                '</span>' +
                            '</div>' +
                            '<div style="margin-bottom: 5px">' +
                                '<span>' +
                                    `${ addressFull || '' } ` +
                                '</span>' +
                            '</div>' +
                            '<div style="margin-bottom: 5px">' +
                                '<span>' +
                                    `${ hostCompanyName || '' } ` +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="line-break"></div>' +
                    '<div id="map-infowindow" class="map-infowindow-button">' +
                        'See More Details' +
                    '</div>' +
                '</div>'
            );
            return content;
        }

    }

    handleInfowindowButtonClick = (code, root) => {

        let value = {
            itemCode: code,
            hint: root
        };

        const isString = (value && value.constructor == String);
        if(isString == false) {
            value.userCode = GennyBridge.getUser();
        }

        let btnValue = (value && value.constructor == String) ? value : JSON.stringify(value);

        GennyBridge.sendBtnClick('BTN_CLICK', {
            code: this.props.btnCode || 'BTN_LOAD_SEE_MORE',
            value: btnValue || null
        });
    }

    render() {

        const { root, style, mapStyle, polygons, polylines, ...rest } = this.props;
        const componentStyle = { ...style};
        let mapData = this.getDataFromCode(root);

        return (
            <div className="genny-map" style={componentStyle}>
                <MapDisplay
                    {...rest}
                    style={mapStyle}
                    markers={mapData && mapData.markers }
                    routes={mapData && mapData.routes }
                    onClick={this.handleInfowindowButtonClick}
                    polygons={polygons}
                    polylines={polylines}
                    suppressMarkers={true}
                />
            </div>
        );
    }
}

export default GennyMap;
