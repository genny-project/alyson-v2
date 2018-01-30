import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, func, array } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
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
        handleClickBack: func,
        root: string
    };

    state = {
        canSendMessage: false,
        messageText: ''
    }

    onTextChange = (e) => {

        this.setState({
            messageText: e.target.value
        });
    }

    onButtonClick = (e) => {

        this.setState({
            messageText: ''
        });
    }

    handleClickBack = () => {
        const { handleClickBack } = this.props;
        if (handleClickBack) handleClickBack();
    }

    renderTextInput() {
        return <div>
            <input onChange={this.onTextChange} placeholder="Type your message..."/>
            {
                this.state.messageText.length > 0 ?
                <GennyButton
                    onClick={this.onButtonClick}
                    disabled={this.state.canSendMessage}
                    buttonCode='BTN_SEND_MESSAGE'
                    value={{ itemCode: this.props.root, value: this.state.messageText }}
                    buttonStyle={ { background: 'none', border: '1px solid black' }}>
                    <p>Send</p>
                </GennyButton>
                : null
            }
        </div>;
    }

    renderMessage(message, index) {

        let messageCode = message.code;

        let style = { textAlign: 'left' };
        let creatorAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_CREATOR');
        let messageTextAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_MESSAGE');

        if(messageTextAttribute && creatorAttribute) {

            let creator = creatorAttribute.value;
            if(creator == GennyBridge.getUser()) {
                style = { textAlign: 'right' };
            }

            let messageText = messageTextAttribute.value;
            return <div style={style} key={index}>{messageText}</div>;
        }

        return null;
    }

    renderLayout(title, messages) {

        return (
        <Grid
            className="genny-messaging-conversation-container"
            rows={[
                '30px',
                { style: { flexGrow: 12 }},
                { style: { flexGrow: 0.5 }}]}
            cols={1}>

            {
                messages ?
                    <div className="conversation-message-title" position={[0,0]}>
                        { window.getScreenSize() == 'sm' ? <span onClick={this.handleClickBack}>Back</span> : null }
                        {title}
                    </div>
                : null
            }
            {
                messages && messages.length > 0 ?
                    <div className="conversation-messages-container" position={[1,0]}>
                        {
                            messages.map((message, index) => this.renderMessage(message, index))
                        }
                    </div>
                : null
            }
            {
                !messages || messages.length <= 0 ?
                    <div className="empty" position={[1,0]}>
                        No messages
                    </div>
                : null
            }
            <div className="conversation-message-input" position={[2,0]}>{this.renderTextInput()}</div>

        </Grid>);
    }

    render() {

        const { root, title, messages } = this.props;

        if(!root) {
            return (
                <div className="empty" >
                    No Conversations
                </div>
            );
        }
        else { return this.renderLayout(title, messages);
        }
    }
}

export default GennyMessagingConversation;
