import './gennyHeader.scss';
import { customStyle } from './gennyHeaderStyle';
import React, { Component } from 'react';
import { Label, Dropdown, ProfileImageView, IconSmall, GennyTreeView, Header, GennyNotifications } from 'views/components';
import { Grid } from '@genny-project/layson';
import { string, object, bool, array  } from 'prop-types';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';
// import decode_token from 'jwt-decode';

class GennyHeader extends Component {

    static defaultProps = {
        className: '',
        style: {},
        hideSubheader: false,
        userRoles: [
            // {
            //     name: 'Student',
            //     value: true
            // },
            // {
            //     name: 'Amazing',
            //     value: false
            // }
        ],
        showRoles: false
    }

    static propTypes = {
        className: string,
        height: string,
        style: object,
        hideSubheader: bool,
        userRoles: array,
        showRoles: bool,
    };

    state = {
        isOpen: false
    }

    handleProfileClick = () => {
        this.setState(prevState => ({
            isOpen: prevState.isOpen == 'profile' ? false : 'profile'
        }));
    }

    handleNotificationsClick = () => {
        this.setState(prevState => ({
            isOpen: prevState.isOpen == 'notifications' ? false : 'notifications'
        }));
    }

    handleBlur = () => {
        this.setState({
            isOpen: false
        });
    }

    handleLogout = () => {
        this.sendData('LOGOUT', {
            code: 'LOGOUT',
        });
    }

    handleAccount = () => {
        this.sendData('ACCOUNTS', {
            code: 'ACCOUNTS',
        });
        this.setState({
            isOpen: false
        });
    }

    handleProfile = () => {
        this.sendData('PROFILE', {
            code: 'PROFILE',
        });
        this.setState({
            isOpen: false
        });
    }

    handlePaymentMethods = () => {

        this.sendData('PAYMENT_METHODS', {
            code: 'PAYMENT_METHODS',
        });

        this.setState({
            isOpen: false
        });
    }

    handleMessages = () => {
        this.sendData('TV_SELECT', {
            code: 'TV1',
            value: 'GRP_MESSAGES'
        }, 'GRP_MESSAGES');
        this.setState({
            isOpen: false
        });
    }

    sendEvent(event, data) {
        GennyBridge.sendTVEvent(event, data);
    }

    handleClickImage = () => {
        //console.log("clicked profile image");
    }

    sendData(event, data) {
        GennyBridge.sendLogout(event, data);
    }

    onColorChange = (color) => {
        let answer = [
            {
                targetCode: this.props.currentProject,
                attributeCode: 'PRI_COLOR',
                value: color
            }
        ];
        GennyBridge.sendAnswer(answer);
    };

    render() {

        const { style, className, projectTitle, projectGreeting, userName, userImage, hideSubheader, token, userRoles, showRoles } = this.props;
        const { isOpen } = this.state;
        const componentStyle = {
            ...style,
            ...customStyle.gennyHeader
        };

        // let isOwner = currentUser && BaseEntityQuery.getBaseEntityAttribute(currentUser, 'PRI_OWNER' );
        // isOwner = isOwner != null && isOwner.value === true;
        // let isDriver = currentUser && BaseEntityQuery.getBaseEntityAttribute(currentUser, 'PRI_DRIVER' );
        // isDriver = isDriver != null && isDriver.value === true;
        //
        // let session_data = decode_token(token);
        // let roles = session_data.realm_access.roles;
        //
        // let isAdmin = roles.includes('admin');

        let attributes = BaseEntityQuery.getBaseEntityAttributes(GennyBridge.getUser());
        // if(attributes) {
        //     const roles = Object.keys(attributes).filter(attributeKey => {
        //         return (attributes[attributeKey].attributeCode != null && attributes[attributeKey].attributeCode.startsWith("PRI_IS_") != null) ? attributes[attributeKey].attributeCode : false }
        //     );
        //     //console.log( roles );
        // }

        let roles = null;

        if ( userRoles && userRoles.length > 0 ) {
            roles = userRoles
                .filter(role => role.value == true || role.value == 'true')
                .map(role => role.name)
                .join(', ');
        }

        return (
        <div className={`genny-header ${window.getScreenSize()}`} style={componentStyle}>
            <Header
                className='main-header'
                cols={[
                    { style: {
                    flexGrow: '1',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '5px',
                    paddingRight: '5px'
                    }},
                    { style: {
                    flexGrow: '1',
                    justifyContent: 'flex-end',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '5px',
                    paddingRight: '5px'
                    }}
                ]}
                rows={[ { style: { flexGrow: '1', paddingLeft: `${ window.getScreenSize() == 'sm' ? '50px' : '10px' }`, height: '100%' } } ]}
                >
                <h3 position={[0,0]} style={{margin: '0'}}>{projectTitle}</h3>
                {/* <Label
                    position={[0,1]}
                    text={`${isAdmin ? 'ADMIN' : ''} ${isOwner ? 'OWNER' : ''} ${isDriver ? 'DRIVER' : ''}`}
                    style={{
                    marginRight: '5px',
                    fontSize: '0.75em',
                    border: 'solid 1px #BBB',
                    borderRadius: '5px',
                    padding: '2.5px 5px',
                    }}
                /> */}
                { window.getScreenSize() == 'sm' ? null :
                    <ProfileImageView position={[0,1]} isOnline={true} src={userImage} style={{ margin: '5px', width: '30px', minWidth: '30px'}}/>
                }
                { window.getScreenSize() == 'sm' ? null :
                    <Label position={[0,1]} text={`${userName} ${showRoles && roles ? `( ${roles} )` : ''}`}/>
                }
                <Dropdown
                    style={ customStyle.dropdown }
                    position={[0,1]}
                    open={isOpen == 'profile'}
                    onBlur={this.handleBlur}
                    tabIndex='-1'
                    animateHeader={window.getScreenSize() != 'sm'}
                    contentStyle={{
                        boxShadow: "0 3px 20px rgba(0, 0, 0, 0.5)"
                    }}
                    header={
                        window.getScreenSize() == 'sm' ?
                        <ProfileImageView
                            isOnline={true}
                            src={userImage}
                            onClick={this.handleProfileClick}
                            style={{ margin: '5px', width: '30px', minWidth: '30px'}}
                        />
                        :
                        <span style={ customStyle.dropdownSpan }>
                            <IconSmall
                                name="arrow_drop_down"
                                onClick={this.handleProfileClick}
                                style={{color: 'white'}}
                            />
                        </span>
                    }
                >
                    <ul className="dropdown-profile" style={ customStyle.dropdownProfile }>
                        <li style={ customStyle.dropdownLi } onClick={this.handleProfile}><IconSmall name="person" /><span>Profile</span></li>
                        <li style={ customStyle.dropdownLi } onClick={this.handleAccount}><IconSmall name="settings" /><span>Account</span></li>
                        <br/>
                        <li style={ customStyle.dropdownLi } onClick={this.handleLogout}><IconSmall name="power_settings_new" /><span>Log Out</span></li>
                    </ul>
                </Dropdown>
            </Header>
            {
                !hideSubheader ?
                    <Grid className='sub-header' cols={[1]} rows={1} style={ customStyle.subHeader }>
                        <GennyTreeView isHorizontal={true} style={{ backgroundColor: '#333' }} position={[0,0]}/>
                    </Grid>
                : null
            }
        </div>
        );
    }
}

export default GennyHeader;
