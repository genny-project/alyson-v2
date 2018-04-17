//import './GennyMessaging.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { GennyList } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import moment from 'moment';

class GennyMessagingList extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {
        isOpen: true,
        isMobile: window.getScreenSize() == 'sm'
    }

    componentDidMount() {

        const value = {
            rootCode: this.props.root,
            code: this.props.messagesRoot
        };

        const conversations = BaseEntityQuery.getEntityChildren(this.props.root);
        if (window.getScreenSize() != 'sm' && conversations.length > 0) this.handleClickConversation(value);
    }

    handleClickConversation = (listItemProps) => {

        let btnValue = {
            hint: listItemProps.rootCode,
            itemCode: listItemProps.code,
            userCode: GennyBridge.getUser()
        };
        btnValue = JSON.stringify(btnValue);

        GennyBridge.sendBtnClick('BTN_CLICK', {
            code: 'BTN_SEE_CONVERSATION',
            value: btnValue
        });

        this.setState({
            isOpen: false,
            selectedItem: listItemProps.code,
            messagesRoot: listItemProps.code,
        });
    }

    getContactAliases = (data) => {
        let contactAliases = [];

        data.map(conversation => {
            let users = BaseEntityQuery.getLinkedBaseEntities(conversation.code, 'LNK_USER');
            //console.log(users);
            const currentUserCode = GennyBridge.getUser();
            //console.log(currentUserCode);
            const otherUser = users && users.filter(x => x.code != currentUserCode)[0];
            //console.log(otherUser);
            if (otherUser && otherUser.code) {
                contactAliases.push({
                    CONTACT: otherUser.code
                });
            }
        });
        return contactAliases;
    }

    render() {

        const { root } = this.props;
        const { selectedItem } = this.state;

        const conversations = BaseEntityQuery.getLinkedBaseEntities(root, 'LNK_CHAT');
        //console.log(conversations);
      
        let contactAliases = this.getContactAliases(conversations);
        //console.log(contactAliases);
        return (
            <div className="genny-messaging-list">
                <GennyList
                    position={[0, 0]}
                    root={root}
                    localAliases={contactAliases}
                    onItemClick={this.handleClickConversation}
                    selectedItem={selectedItem}
                />
            </div>
        );
    }
}

export default GennyMessagingList;
