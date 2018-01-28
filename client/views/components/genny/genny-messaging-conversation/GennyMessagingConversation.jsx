import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { Grid } from '@genny-project/layson';
import { GennyButton } from 'views/components';

class GennyMessagingConversation extends Component {

    static defaultProps = {
        title: '',
        messages: []
    }

    static propTypes = {
        title: string,
        messages: array,
    };

    state = {
        canSendMessage: false,
        messageText: ''
    }

    onTextChange = (e) => {

        this.setState({
            messageText: e.target.value
        })
    }

    onButtonClick = (e) => {

        this.setState({
            messageText: ''
        })
    }

    renderTextInput() {
        return <div>
            <input onChange={this.onTextChange} placeholder="Type your message..."/>
            {
                this.state.messageText.length > 0 ?
                <GennyButton
                    onClick={this.onButtonClick}
                    disabled={this.state.canSendMessage}
                    buttonCode={"BTN_SEND_MESSAGE"}
                    value={{ "itemCode": this.props.root, "value": this.state.messageText }}
                    buttonStyle={ { background: "none", border: "1px solid black" }}>
                    <p>Send</p>
                </GennyButton>
                : null
            }
        </div>
    }

    renderMessage(message) {

        let messageCode = message.code;

        let style = { "textAlign": "left" };
        let creatorAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, "PRI_CREATOR");
        let messageTextAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, "PRI_MESSAGE");

        if(messageTextAttribute && creatorAttribute) {

            let creator = creatorAttribute.value;
            if(creator == GennyBridge.getUser()) {
                style = { "textAlign": "right" }
            }

            let messageText = messageTextAttribute.value;
            return <div style={style}>{messageText}</div>
        }

        return null;
    }

    renderLayout(title, messages) {

        return (
        <Grid
            className="genny-messaging-conversation-container"
            rows={[{ "style": { "flexGrow": 1 }}, { "style": { "flexGrow": 12 }}, { "style": { "flexGrow": 0.5 }}]}
            cols={1}>

            <div className="conversation-message-title" position={[0, 0]}>{title}</div>
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

        const { root, title, messages } = this.props;

        if(messages.length == 0) return this.renderEmpty()
        else return this.renderLayout(title, messages)
    }
}

export default GennyMessagingConversation;
