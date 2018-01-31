import './GennyMessaging.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { GennyList, GennyMessagingConversation } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { Grid } from '@genny-project/layson';
import moment from 'moment';

class GennyMessaging extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {
        isOpen: true,
        isMobile: window.getScreenSize() == 'sm'
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

        console.log(listItemProps);

        this.setState({
            isOpen: false,
            selectedItem: listItemProps.code
        });
    }

    handleClickBack = () => {
        this.setState({
            isOpen: true
        });
    }

    orderMessages = (messages) => {

        let messageArray = [];
        let tempArray = [];

         messages.map((message, index) => {

            if (tempArray.length > 0) {
                const last = tempArray.length - 1;
                const lastCreator = tempArray[last].attributes.PRI_CREATOR.value;
                const thisCreator = message.attributes.PRI_CREATOR.value;
                
                if (lastCreator != thisCreator) {
                    messageArray.push(tempArray);
                    tempArray = [];
                }
                else {
                    const lastDateTime = moment(tempArray[last].created).format('YYYY-MM-DD HH');
                    const thisDateTIme = moment(message.created).format('YYYY-MM-DD HH');

                    if (lastDateTime != thisDateTIme) {
                        messageArray.push(tempArray);
                        tempArray = [];
                    }
                }
            }
            tempArray.push(message);
            if (index == messages.length - 1) {
                messageArray.push(tempArray);
            }
        });
        

        return messageArray;
    }

    render() {

        const { root, messagesRoot } = this.props;
        const { isOpen, isMobile, selectedItem } = this.state;

        const conversationTitle = BaseEntityQuery.getBaseEntityAttribute(messagesRoot, 'PRI_TITLE').value;
        const conversations = BaseEntityQuery.getEntityChildren(root);
        let messages = BaseEntityQuery.getLinkedBaseEntities(messagesRoot, 'LNK_MESSAGES');
        messages = messages.sort((x, y) => x.created < y.created);
        
        const orderedMessages = this.orderMessages(messages);

        let users = BaseEntityQuery.getLinkedBaseEntities(messagesRoot, 'LNK_USER');
        const currentUserCode = GennyBridge.getUser();
        const currentUser = users && users.filter(x => x.code == currentUserCode)[0];
        const otherUser = users && users.filter(x => x.code != currentUserCode)[0];


        return (
            <div className="genny-messaging-container">
                <Grid
                    rows={1}
                    cols={[
                        { className: `col message-list ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : '' }` },
                        { className: `col message-detail ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : '' }` }
                    ]}
                >
                    <GennyList
                        position={[0, 0]}
                        root={root}
                        localAliases={{ CONTACT: otherUser.code }}
                        onItemClick={this.handleClickConversation}
                        selectedItem={selectedItem}
                    />
                    <GennyMessagingConversation
                        position={[0, 1]}
                        title={conversationTitle}
                        currentUser={currentUser}
                        otherUser={otherUser}
                        messages={orderedMessages}
                        root={messagesRoot}
                        onClick={this.handleClickBack}
                    />
                </Grid>
            </div>
        );
    }
}

export default GennyMessaging;
