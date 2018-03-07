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

        
        let be = BaseEntityQuery.getBaseEntity(root);

        let attributes = be.attributes;

        let status_color = '#5cb85c';

        const userCode = GennyBridge.getUser();

        Object.keys(attributes).forEach(attribute_key => {

            if(attribute_key == 'STA_STATUS') {
                status_color = attributes[attribute_key].value || status_color;
            }
            
            if(attribute_key.startsWith('STA') && attribute_key.indexOf(userCode) > -1 ) {
                status_color = attributes[attribute_key].value || status_color;
            }
        });

        return status_color;
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
