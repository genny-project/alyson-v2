import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, func, array } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { Grid } from '@genny-project/layson';
import { GennyButton, ImageView, DateLabel, IconSmall} from 'views/components';
import moment from 'moment';

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
        messageText: '',
        createdMessages: []
    }

    onTextChange = (e) => {

        this.setState({
            messageText: e.target.value
        });
    }

    onButtonClick = (e) => {

        const newText = this.state.messageText;
        this.setState({
            messageText: '',
            createdMessages: [
                ...this.state.createdMessages,
                {
                    code: 'MSG_X',
                    attributes: {
                        PRI_CREATOR: {
                            attributeCode: 'PRI_CREATOR',
                            value: GennyBridge.getUser()
                        },
                        PRI_MESSAGE: {
                            attributeCode: 'PRI_MESSAGE',
                            value: newText
                        }
                    },
                    weight: 1,
                    created: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
                    //created: moment().toISOString()
                }
            ]
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

    orderMessages = (messages) => {

        let messageArray = [];
        let tempArray = [];

        let finalMessages = messages;
        // this.state.createdMessages.forEach(mess => {
        //     finalMessages.push(mess);
        // });

        finalMessages = messages.sort((x, y) => {
            return x.created < y.created ? 1 : -1;
        });
        
        finalMessages.map((message, index) => {
            if (tempArray.length > 0) {

                const last = tempArray.length - 1;
                const creatorAttr = tempArray[last].attributes.PRI_CREATOR;
                const thisCreatorAttr =  message.attributes.PRI_CREATOR;

                if(!creatorAttr || !thisCreatorAttr) {
                    return false;
                }

                const lastCreator = creatorAttr.value;
                const thisCreator = thisCreatorAttr.value;
                
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

    renderMessages = (messages, currentUser, otherUser) => {
        
        return messages.map((group, groupIndex) => {

            let groupCode = group[0].code;
            let createdBy = BaseEntityQuery.getBaseEntityAttribute(groupCode, 'PRI_CREATOR');
            createdBy = createdBy ? createdBy.value : group[0].attributes.PRI_CREATOR.value;
            group.sort((x, y) => x.created > y.created);

            return (
                <div className={`conversation-message-group ${createdBy == GennyBridge.getUser() ? 'sent' : 'received' }`} key={groupIndex} >
                    {
                        group.map((message, messageIndex) => {

                            let messageCode = message.code;

                            let style = { textAlign: 'left' };
                            let creatorAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_CREATOR') || message.attributes ? message.attributes.PRI_CREATOR : null;
                            let messageTextAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, 'PRI_MESSAGE') || message.attributes ? message.attributes.PRI_MESSAGE : null

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

    renderMobileLayout(title, messages, currentUser, otherUser) {

        return (
        <Grid
            className="messaging-conversation-main"
            rows={[
                '40px',
                { style: { flexGrow: 12 }},
                { style: { flexGrow: 0.5, flexShrink: 0 }}]}
            cols={1}
        >
            <div className="conversation-message-title" position={[0,0]}>
                <div className='conversation-back-button' onClick={this.handleClickBack}>
                    <IconSmall name='arrow_drop_down' style={{ transform: 'rotate(90deg)' }}/>
                    <span>Back</span>
                </div>
                {title}
            </div>
            
            {
                messages && messages.length > 0 ?
                    <div className={`conversation-messages-container ${window.getScreenSize()}`} position={[ 1,0]}>
                         {this.renderMessages(messages, currentUser, otherUser)}
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

    renderWebLayout(title, messages, currentUser, otherUser) {

        return (
            <Grid
                className="messaging-conversation-main"
                rows={[
                    { style: { flexGrow: 12 }},
                    { style: { flexGrow: 0.5, flexShrink: 0 }}]}
                cols={1}
            >
                {
                    messages && messages.length > 0 ?
                        <div className="conversation-messages-container" position={[0 ,0]}>
                            {this.renderMessages(messages, currentUser, otherUser)}

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
            </Grid>
        );
    }
    render() {

        const { root } = this.props;

        const be = BaseEntityQuery.getBaseEntity(root);

        const attribute = BaseEntityQuery.getBaseEntityAttribute(root, 'PRI_TITLE');
        const title = attribute ? attribute.value : '';

        let users = BaseEntityQuery.getLinkedBaseEntities(root, 'LNK_USER');
        const currentUserCode = GennyBridge.getUser();
        const currentUser = users && users.filter(x => x.code == currentUserCode)[0];
        const otherUser = users && users.filter(x => x.code != currentUserCode)[0];

        let messages = BaseEntityQuery.getLinkedBaseEntities(root, 'LNK_MESSAGES');

        const orderedMessages = this.orderMessages(messages);

        if(!root || root == 'null' || !be) {
            return (
                <Grid
                    className="messaging-conversation-main"
                    rows={['40px',1]}
                    cols={1}
                >
                    <div className="conversation-message-title" position={[0,0]}>
                        <div className='conversation-back-button' onClick={this.handleClickBack}>
                            <IconSmall name='arrow_drop_down' style={{ transform: 'rotate(90deg)' }}/>
                            <span>Back</span>
                        </div>
                    </div>
                    <div className="conversation-messages-empty" position={[1,0]}>
                        Welcome to Channel40.<br />
                        There are currently no messages for you to read.
                    </div>
                </Grid>
            );
        }
        else if (window.getScreenSize() == 'sm') {
            return this.renderMobileLayout(title, orderedMessages, currentUser, otherUser);
        }
        else {
            return this.renderWebLayout(title, orderedMessages, currentUser, otherUser);
        }
    }
}

export default GennyMessagingConversation;
