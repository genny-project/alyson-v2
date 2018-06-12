import './gennyStatus.scss';
import React, { Component } from 'react';
import { string, object, bool } from 'prop-types';
import { Status, Spinner } from 'views/components';
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

        let global_status = '#FFCC00';
        let user_status = null;

        let be = BaseEntityQuery.getBaseEntity(root);
        if( be != null ) {

            let attributes = be.attributes;
            if( attributes != null ) {

                const userCode = GennyBridge.getUser();

                const attributeKeys = Object.keys(attributes);
                for (var i = 0; i < attributeKeys.length; i++) {

                  let attribute_key = attributeKeys[i];

                  /* we check for a specific user status */
                  if(attribute_key.startsWith('STA') && attribute_key.indexOf(userCode) > -1) {
                      user_status = attributes[attribute_key].value;
                  }

                  /* we check for a global status */
                  if(attribute_key == 'STA_STATUS') {
                      global_status = attributes[attribute_key].value || global_status;
                  }
                }
            }
        }

        return user_status || global_status;
    }

    renderStatus(status) {

        const { style, statusStyle, ...rest } = this.props;

        if(status == null) {
            status = "green";
        }

        switch(status) {

            case "loading":
                return <Spinner loaderType={"bar"} width={20} widthUnit="px" color={"green"} style={{ "marginTop": "-10px" }}/>

            default:
                return <Status
                    {...rest}
                    color={status}
                    style={statusStyle}
                />
        }
    }

    render() {

        const { root, style, statusStyle, ...rest } = this.props;
        const componentStyle = { ...style};

        const status = this.getEntityStatus(root);

        return (
            <div className="genny-status" style={componentStyle}>
                {this.renderStatus(status)}
            </div>
        );
    }
}

export default GennyStatus;
