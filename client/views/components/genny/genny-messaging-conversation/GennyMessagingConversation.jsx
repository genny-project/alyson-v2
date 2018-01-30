import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, func, array } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { Grid } from '@genny-project/layson';
import { GennyButton, ImageView, Button, IconSmall} from 'views/components';

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

        console.log('click', handleClickBack)
        if (handleClickBack) handleClickBack();
    }

    renderTextInput() {
        return <div>
            <input onChange={this.onTextChange} placeholder="Type your message..."/>
            <GennyButton
                onClick={this.onButtonClick}
                disabled={this.state.canSendMessage}
                buttonCode='BTN_SEND_MESSAGE'
                value={{ itemCode: this.props.root, value: this.state.messageText }}
                type='confirm'>
                <p>Send</p>
            </GennyButton>
        </div>;
    }

    renderMessage(message, index) {

        const {currentUser, otherUser} = this.props;

        let messageCode = message.code;

        let style = { textAlign: 'left' };
        let creatorAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_CREATOR');
        let messageTextAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_MESSAGE');

        console.log(creatorAttribute);
        console.log(message);

        if(messageTextAttribute && creatorAttribute) {

            let creator = creatorAttribute.value;

            let messageText = messageTextAttribute.value;
            return (
                <div className={`conversation-message ${creator == GennyBridge.getUser() ? 'sent' : 'received' }`}>
                    {
                        creator != GennyBridge.getUser() && otherUser ?
                            <ImageView className='conversation-message-image' src={otherUser.attributes.PRI_IMAGE_URL} />
                        : null
                    }
                    <div className='conversation-message-text' style={style} key={index}>{messageText}</div>

                </div>
            );
        }

        return null;
    }

    renderMobileLayout(title, messages) {

        return (
        <Grid
            className="messaging-conversation-main"
            rows={[
                '40px',
                { style: { flexGrow: 12 }},
                { style: { flexGrow: 0.5 }}]}
            cols={1}
        >
            {
                messages && window.getScreenSize() == 'sm' ?
                    <div className="conversation-message-title" position={[0,0]}>
                        <span onClick={this.handleClickBack}>Back</span>
                        { window.getScreenSize() == 'sm' ?
                            <div className='conversation-back-button' onClick={this.handleClickBack}>
                                <IconSmall name='arrow_drop_down' style={{ transform: 'rotate(-90deg)' }}/>
                                <span>Back</span>
                            </div>
                        : null }
                        {title}
                    </div>
                : null
            }
            {
                messages && messages.length > 0 ?
                    <div className="conversation-messages-container" position={[ 1,0]}>
                        {
                            messages.map((message, index) => this.renderMessage(message, index))
                        }
                    </div>
                : null
            }
            {

                !messages || messages.length <= 0 ?
                    <div className="conversation-messages-empty" position={[1,0]}>
                        No messages
                    </div>
                : null
            }
            <div className="conversation-message-input" position={[ 2 ,0]}>{this.renderTextInput()}</div>
        </Grid>);
    }

    renderWebLayout(title, messages) {

        return (
        <Grid
            className="messaging-conversation-main"
            rows={[
                { style: { flexGrow: 12 }},
                { style: { flexGrow: 0.5 }}]}
            cols={1}
        >
            {
                messages && messages.length > 0 ?
                    <div className="conversation-messages-container" position={[0 ,0]}>
                        {
                            messages.map((message, index) => this.renderMessage(message, index))
                        }
                    </div>
                : null
            }
            {
                !messages || messages.length <= 0 ?
                    <div className="empty" position={[ 0 ,0]}>
                        No messages
                    </div>
                : null
            }
            <div className="conversation-message-input" position={[ 1 ,0]}>{this.renderTextInput()}</div>
        </Grid>);
    }

    render() {

        const { root, title, messages } = this.props;

        if(!root) {
            return (
                <div className="conversation-messages-empty" >
                    No Conversations
                </div>
            );
        }
        else if (window.getScreenSize() == 'sm') {
            return this.renderMobileLayout(title, messages);
        }
        else {
            return this.renderWebLayout(title, messages);
        }
    }
}

export default GennyMessagingConversation;
