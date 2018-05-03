import './gennyStatus.scss';
import React, { Component } from 'react';
import { string, object, bool } from 'prop-types';
import { Status } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';

class GennyStatus extends Component {

    static defaultProps = {
        root: '',
    }

    static propTypes = {
        root: string,
        style: object,
        statusStyle: object,
    };

    state = {
    }

    getEntityStatus = (root) => {

        let status_color = '#FFCC00';
        let user_status_color = null;

        let be = BaseEntityQuery.getBaseEntity(root);
        if( be != null ) {

            let attributes = be.attributes;
            if( attributes != null ) {

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

            }
        }

        return user_status_color || status_color;
    }

    render() {

        const { root, style, statusStyle, ...rest } = this.props;
        const componentStyle = { ...style};

        const color = this.getEntityStatus(root);

        return (
            <div className="genny-status" style={componentStyle}>
                <Status
                    {...rest}
                    color={color}
                    style={statusStyle}
                />
            </div>
        );
    }
}

export default GennyStatus;
