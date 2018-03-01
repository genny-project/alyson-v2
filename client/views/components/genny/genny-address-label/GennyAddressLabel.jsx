import './gennyAddressLabel.scss';
import React, { Component } from 'react';
import { string, object, } from 'prop-types';
import { AddressLabel } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

class GennyAddressLabel extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
        attributePrefix: string,
        style: object,
        labelStyle: object,
    };

    state = {
    }

    getDataFromCode = (root) => {

        const {attributePrefix} = this.props;

        let data = BaseEntityQuery.getBaseEntity(root);
        if(data) {

            let attributes = data.attributes;
            if (attributes) {

                let address = {};
                Object.keys(attributes).map(attribute_key => {

                    switch(attribute_key) {
                        case `${attributePrefix}_ADDRESS1`:
                            address['street_address'] = attributes[`${attributePrefix}_ADDRESS1`].value;
                            break;
                        case `${attributePrefix}_SUBURB`:
                            address['suburb'] = attributes[`${attributePrefix}_SUBURB`].value;
                            break;
                        case `${attributePrefix}_STATE`:
                            address['state'] = attributes[`${attributePrefix}_STATE`].value;
                            break;
                        case `${attributePrefix}_POSTCODE`:
                            address['postal_code'] = attributes[`${attributePrefix}_POSTCODE`].value;
                            break;
                        case `${attributePrefix}_COUNTRY`:
                            address['country'] = attributes[`${attributePrefix}_COUNTRY`].value;
                            break;
                        default:
                            return null;
                    }
                });

                return address;
            }
        }
    }

    render() {

        const { root, style, labelStyle, attributePrefix, ...rest } = this.props;
        const componentStyle = { ...style};

        let addressData = this.getDataFromCode(root);

        return (
            <div className="genny-addressLabel" style={componentStyle}>
                <AddressLabel
                    {...rest}
                    style={labelStyle}
                    addressData={addressData}
                />
            </div>
        );
    }
}

export default GennyAddressLabel;
