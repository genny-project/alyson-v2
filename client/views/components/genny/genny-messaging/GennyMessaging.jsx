import './GennyMessaging.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { GennyList, GennyMessagingConversation } from 'views/components';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { Grid } from '@genny-project/layson';

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

    render() {

        const { root, messagesRoot } = this.props;
        const { isOpen, isMobile, selectedItem } = this.state;

        const conversationTitle = BaseEntityQuery.getBaseEntityAttribute(messagesRoot, 'PRI_TITLE').value;
        let messages = BaseEntityQuery.getLinkedBaseEntities(messagesRoot, 'LNK_MESSAGES');

        messages = messages.sort((x, y) => x.created < y.created);
        
        return (
            <div className="genny-messaging-container">
                <Grid
                    rows={1}
                    cols={[
                        { className: `col message-list ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : '' }` },
                        { className: `col message-detail ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : '' }` }
                    ]}
                >
                    <GennyList position={[0, 0]} root={root} onItemClick={this.handleClickConversation} selectedItem={selectedItem}/>
                    <GennyMessagingConversation position={[0, 1]} title={conversationTitle} messages={messages} root={messagesRoot} onClick={this.handleClickBack}/>
                </Grid>
            </div>
        );
    }
}

export default GennyMessaging;