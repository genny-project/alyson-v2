import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, func, array } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { Grid } from '@genny-project/layson';
import { GennyButton, ImageView, DateLabel, IconSmall} from 'views/components';

class GennyMessagingConversation extends Component {

    static defaultProps = {
        title: '',
        messages: []
    }

    static propTypes = {
        title: string,
        messages: array,
        onClick: func,
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
        const { onClick } = this.props;

        if (onClick) onClick();
    }

    renderTextInput() {
        return <div>
            <textarea value={this.state.messageText} onChange={this.onTextChange} placeholder="Type your message..." />
                <GennyButton
                    className='conversation-button'
                    onClick={this.onButtonClick}
                    disabled={this.state.messageText == ''}
                    buttonCode='BTN_SEND_MESSAGE'
                    value={{ itemCode: this.props.root, value: this.state.messageText }}
                    style={{width: '100px', height: '50px'}}
                    type='confirm'
                    >
                    <p>Send</p>
                </GennyButton>
        </div>;
    }

    renderMessages = (messages) => {

        const {currentUser, otherUser} = this.props;

        return messages.map((group, groupIndex) => {

            let groupCode = group[0].code;

            let createdBy = BaseEntityQuery.getBaseEntityAttribute(groupCode, 'PRI_CREATOR');
            createdBy = createdBy ? createdBy.value : '-';
            group.sort((x, y) => x.created > y.created);

            return (

                <div className={`conversation-message-group ${createdBy == GennyBridge.getUser() ? 'sent' : 'received' }`} key={groupIndex} >
                    {
                        group.map((message, messageIndex) => {

                            let messageCode = message.code;

                            let style = { textAlign: 'left' };
                            let creatorAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_CREATOR');
                            let messageTextAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_MESSAGE');

                            if(messageTextAttribute && creatorAttribute) {

                                let creator = creatorAttribute.value;

                                let messageText = messageTextAttribute.value;

                                return (
                                    <div className='conversation-message'>
                                        { messageIndex == 0 ?
                                            <div className='message-detail'>
                                                <DateLabel className='time-stamp' format="MMM Do, YYYY HH:mm a">{message.created}</DateLabel>
                                                {
                                                    creator != GennyBridge.getUser() && otherUser ?
                                                        <span>{otherUser.attributes.PRI_FIRSTNAME.value} {otherUser.attributes.PRI_LASTNAME.value}</span>
                                                    : null
                                                }
                                            </div>
                                        : null }
                                        <div  className='conversation-message-content'>
                                            {
                                                creator != GennyBridge.getUser() && otherUser && messageIndex == 0 ?
                                                    <ImageView className='conversation-message-image' src={otherUser.attributes.PRI_IMAGE_URL.value} />
                                                : null
                                            }

                                            {
                                                creator != GennyBridge.getUser() && otherUser && messageIndex != 0 ?
                                                <div className='conversation-message-spacer' />
                                                : null
                                            }

                                            <div className={`conversation-message-text ${group.length == 1 ? 'single-message' : '' }`} style={style} key={messageIndex}>{messageText}</div>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            );
        });
    }

    renderMobileLayout(title, messages, otherUser) {

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
                messages ?
                    <div className="conversation-message-title" position={[0,0]}>
                        <div className='conversation-back-button' onClick={this.handleClickBack}>
                            <IconSmall name='arrow_drop_down' style={{ transform: 'rotate(90deg)' }}/>
                            <span>Back</span>
                        </div>
                        {title}
                    </div>
                : null
            }
            {
                messages && messages.length > 0 ?
                    <div className={`conversation-messages-container ${window.getScreenSize()}`} position={[ 1,0]}>
                         {this.renderMessages(messages)}
                    </div>
                : null
            }
            {

                !messages || messages.length <= 0 ?
                    <div className="conversation-messages-empty" position={[1,0]}>
                        Start your conversation with {otherUser && otherUser.attributes.PRI_FIRSTNAME.value}
                    </div>
                : null
            }
            <div className="conversation-message-input" position={[ 2 ,0]}>{this.renderTextInput()}</div>
        </Grid>);
    }

    renderWebLayout(title, messages, otherUser) {

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
                        {this.renderMessages(messages)}

                    </div>
                : null
            }
            {
                !messages || messages.length <= 0 ?
                    <div className="conversation-messages-empty" position={[ 0 ,0]}>
                        Start your conversation with {otherUser && otherUser.attributes.PRI_FIRSTNAME.value}
                    </div>
                : null
            }
            <div className="conversation-message-input" position={[ 1 ,0]}>{this.renderTextInput()}</div>
        </Grid>);
    }

    render() {

        const { root, title, messages, otherUser } = this.props;

        if(!root) {
            return (
                <div className="conversation-messages-empty" >
                    No Conversations
                </div>
            );
        }
        else if (window.getScreenSize() == 'sm') {
            return this.renderMobileLayout(title, messages, otherUser);
        }
        else {
            return this.renderWebLayout(title, messages, otherUser);
        }
    }
}

export default GennyMessagingConversation;
