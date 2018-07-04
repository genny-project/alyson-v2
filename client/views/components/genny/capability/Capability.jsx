import React, { PureComponent } from 'react';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';

class Capability extends PureComponent {

    static defaultProps = {

    }

    static propTypes = {

    };

    state = {
    }

    hasUserGotCapabilities = ( capabilities ) => {

        /* we get the user code */
        const userCode = GennyBridge.getUser();

        if( userCode ) {

            /* we get the roles linked to this user */
            const roles = BaseEntityQuery.getLinkedBaseEntitiesByValue( userCode, "ROLE" );
            if( roles != null ) {

                /* we loop through the roles to try and find the required capability */
                for (var i = 0; i < roles.length; i++) {

                    const role = roles[i];

                    if(role && role.attributes) {

                        const roleCapabilitiesAttribute = role.attributes["LNK_SELECT_CAPABILITY"];
                        if(roleCapabilitiesAttribute) {

                            /* we compare with the required capabilities */
                            const value = roleCapabilitiesAttribute.value;
                            if(value) {

                                try {

                                    const roleCapabilities = JSON.parse( value );
                                    for (var j = 0; j < roleCapabilities.length; j++) {

                                        const currentCapability = roleCapabilities[j];
                                        if(capabilities.includes(currentCapability)) { return true }
                                    }
                                }
                                catch( e ) {

                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    render() {

        const { capabilities, children, defaultChildren } = this.props;

        let shouldRender = false;
        if( capabilities ) {
            shouldRender = this.hasUserGotCapabilities(capabilities);
        }

        if(shouldRender) {
            return (
                <div style={{ height: "100%" }}>
                    {children}
                </div>
            )
        }

        return (
            <div style={{ height: "100%" }}>
                {defaultChildren}
            </div>
        );
    }
}

export default Capability;
