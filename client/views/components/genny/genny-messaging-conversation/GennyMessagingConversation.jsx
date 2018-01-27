import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { Grid } from '@genny-project/layson';

class GennyMessagingConversation extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {

    }

    renderTextInput() {
        return <input placeholder="Type your message..."/>
    }

    renderMessage(message) {

        console.log( message )

        let messageCode = message.code;
        let messageText = BaseEntityQuery.getBaseEntityAttribute(messageCode, "PRI_MESSAGE").value;

        return <div style={{ "textAlign": "right"}}>{messageText}</div>
    }

    renderLayout(messages) {

        return (
        <Grid
            className="genny-messaging-conversation-container"
            rows={[{ "style": { "flexGrow": 1 }}, { "style": { "flexGrow": 12 }}, { "style": { "flexGrow": 0.5 }}]}
            cols={1}>

            <div className="conversation-message-title" position={[0, 0]}> - {"Conversation title"} - </div>
            <div className="conversation-messages-container" position={[1, 0]}>
                {
                    messages.map(message => this.renderMessage(message))
                }
            </div>
            <div className="conversation-message-input" position={[2, 0]}>{this.renderTextInput()}</div>

        </Grid>)
    }

    renderEmpty() {

        return (<Grid className="genny-messaging-conversation-container" rows={1} cols={1}>
            <div className="empty" position={[0, 0]}>No messages</div>
            {/* <div className="conversation-message-input" position={[1, 0]}>{this.renderTextInput()}</div> */}
        </Grid>)
    }

    render() {

        const { root } = this.props;

        const conversationTitle = BaseEntityQuery.getBaseEntityAttribute(root, "PRI_TITLE");
        const link = "LNK_MESSAGES";
        const messages = BaseEntityQuery.getLinkedBaseEntities(root, link);

        if(messages.length == 0) return this.renderEmpty()
        else return this.renderLayout(messages)
    }
}

export default GennyMessagingConversation;
