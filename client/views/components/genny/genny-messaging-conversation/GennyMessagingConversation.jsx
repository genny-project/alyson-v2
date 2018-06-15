import './GennyMessagingConversation.scss';
import React, { Component } from 'react';
import { string, func, array, bool} from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { Grid } from '@genny-project/layson';
import { GennyButton, ImageView, DateLabel, IconSmall} from 'views/components';
import moment from 'moment';

class GennyMessagingConversation extends Component {

    static defaultProps = {
        title: '',
        messages: [],
        useNewMessageAttributes: false
    }

    static propTypes = {
        title: string,
        messages: array,
        onClick: func,
        root: string,
        itemCode: string,
        buttonCode: string,
        maxLength: bool,
        useNewMessageAttributes: bool,
    };

    state = {
        canSendMessage: false,
        messageText: '',
        createdMessages: [],
        filterText: null,
        filterType: null,
    }

    onTextChange = (e) => {
        this.setState({
            messageText: e.target.value
        }, () => {
            let div = this.divRef;
            this.checkHeight(div);
        });
    }

    checkHeight = (div) => {
        if (div.scrollHeight > div.offsetHeight) {
            div.rows = div.rows + 1;
        }
        else if ( div.rows > 3 ) {
            div.rows = div.rows - 1;
            this.checkHeight(div);
        }
    }

    onButtonClick = (e) => {
        let div = this.divRef;
        div.rows = 3;
        const creatorField = this.props.useNewMessageAttributes ? 'PRI_CREATOR_CODE' : 'PRI_CREATOR';
        const contentField = this.props.useNewMessageAttributes ? 'PRI_CONTENT' : 'PRI_MESSAGE';
        
        const newText = this.state.messageText;
        this.setState({
            messageText: '',
            createdMessages: [
                ...this.state.createdMessages,
                {
                    code: 'MSG_X',
                    attributes: {
                        [creatorField]: {
                            attributeCode: creatorField,
                            value: GennyBridge.getUser()
                        },
                        [contentField]: {
                            attributeCode: contentField,
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

    handleKeyPress = (e) => {

        /* numbers not allowed */
        // const re = /^\d+$/;
        // if (e.key == '' || re.test(e.key)) {
        //   e.preventDefault();
        //   return;
        // }

        /* return key on web only */
        if(e.key == "Enter" && window.getScreenSize() != 'sm') {

           e.preventDefault();
           GennyBridge.sendBtnClick('BTN_CLICK', {
               code: this.props.buttonCode ? this.props.buttonCode : 'BTN_SEND_MESSAGE',
               value: JSON.stringify({
                   itemCode: this.props.itemCode || this.props.root,
                   message: this.state.messageText
               })
           });

           this.onButtonClick(e);
        }
    }

    handleFilterText = (event) => {
        const text = event.target.value;
        
        this.setState({
            filterText:  text,
        });
    }

    handleFilterClick = (type) => (event) => {
        this.setState({
            filterType:  type,
        });
    }

    renderTextInput() {
        return (
            <div>
                <textarea
                    pattern="[A-Za-z]"
                    rows={3}
                    onKeyPress={this.handleKeyPress}
                    value={this.state.messageText}
                    onChange={this.onTextChange}
                    placeholder="Type your message..."
                    maxLength={this.props.maxLength}
                    ref={(ref) => { this.divRef = ref;}}
                />
                {
                    this.props.maxLength
                        ? <span style={{ padding: '5px', fontSize: '0.8em' }}>{this.props.maxLength - this.state.messageText.length} characters remaining</span>
                        : null
                }
                <GennyButton
                    className='conversation-button'
                    onClick={this.onButtonClick}
                    disabled={this.state.messageText == ''}
                    buttonCode={this.props.buttonCode ? this.props.buttonCode : 'BTN_SEND_MESSAGE'}
                    value={{
                        itemCode: this.props.itemCode || this.props.root,
                        message: this.state.messageText
                    }}
                    style={{width: '100px', height: '40px'}}
                    type='confirm'
                >
                    <span>Send</span>
                </GennyButton>
            </div>
        );
    }

    filterMessages = (messages) => {

        const { filterText, filterType } = this.state;

        const contentField = this.props.useNewMessageAttributes ? 'PRI_CONTENT' : 'PRI_MESSAGE';

        let filteredMessages = messages;
        
        if (
            filterText !== null &&
            typeof filterText === 'string' &&
            filterText.length > 0 
        ) {
            filteredMessages = filteredMessages.filter(x => x.attributes[contentField].value.toLowerCase().includes(filterText.toLowerCase()) );
        }

        if (
            filterType !== null &&
            typeof filterType === 'string' &&
            filterType.length > 0 
        ) {
            filteredMessages = filteredMessages.filter(x => x.attributes.PRI_CREATOR_TYPE.value.toLowerCase().includes(filterType.toLowerCase()) );
        }

        return filteredMessages;
    }

    orderMessages = (messages) => {

        let messageArray = [];
        let tempArray = [];

        const creatorField = this.props.useNewMessageAttributes ? 'PRI_CREATOR_CODE' : 'PRI_CREATOR';

        let finalMessages = messages;
        // this.state.createdMessages.forEach(mess => {
        //     finalMessages.push(mess);
        // });

        finalMessages = messages.sort((x, y) => {
            if ( this.props.reverseDirection ) {
                return x.created > y.created ? 1 : -1;
            } else {
                return x.created < y.created ? 1 : -1;
            }
        });

        finalMessages.map((message, index) => {
            if (tempArray.length > 0) {

                const last = tempArray.length - 1;
                
                const creatorAttr = tempArray[last].attributes[creatorField];
                const thisCreatorAttr =  message.attributes[creatorField];

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

            if(tempArray.filter(x => x.code == message.code).length == 0) {
                tempArray.push(message);
            }

            if (index == messages.length - 1) {
                messageArray.push(tempArray);
            }

        });

        return messageArray;
    }

    renderMessages = (messages, currentUser, otherUser) => {

        const creatorField = this.props.useNewMessageAttributes ? 'PRI_CREATOR_CODE' : 'PRI_CREATOR';
        const contentField = this.props.useNewMessageAttributes ? 'PRI_CONTENT' : 'PRI_MESSAGE';

        return messages.map((group, groupIndex) => {

            let groupCode = group[0].code;
            let createdBy = BaseEntityQuery.getBaseEntityAttribute(groupCode, creatorField);
            createdBy = createdBy ? createdBy.value : group[0].attributes[creatorField].value;
            group.sort((x, y) => x.created > y.created);

            const userObject = this.props.useNewMessageAttributes
                ? BaseEntityQuery.getBaseEntity(createdBy)
                : otherUser;

            return (
                <div className={`conversation-message-group ${createdBy == GennyBridge.getUser() ? 'sent' : 'received' }`} key={groupIndex} >
                    {
                        group.map((message, messageIndex) => {

                            let messageCode = message.code;

                            let style = { textAlign: 'left' };
                            let creatorAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, creatorField) || message.attributes ? message.attributes[creatorField] : null;
                            let messageTextAttribute = BaseEntityQuery.getBaseEntityAttribute(messageCode, contentField) || message.attributes ? message.attributes[contentField] : null;

                            if(messageTextAttribute && creatorAttribute) {

                                let creator = creatorAttribute.value;

                                let messageText = messageTextAttribute.value;

                                return (
                                    <div className='conversation-message'>
                                        { messageIndex == 0 ?
                                            <div className='message-detail'>
                                                <DateLabel className='time-stamp' format="MMM Do, YYYY HH:mm a">{message.created}</DateLabel>
                                                {
                                                    creator != GennyBridge.getUser() &&
                                                    userObject &&
                                                    userObject.attributes ?
                                                        <span>{userObject.attributes.PRI_FIRSTNAME && userObject.attributes.PRI_FIRSTNAME.value} {userObject.attributes.PRI_LASTNAME && userObject.attributes.PRI_LASTNAME.value}</span>
                                                    : null
                                                }
                                            </div>
                                        : null }
                                        <div  className='conversation-message-content'>
                                            {
                                                creator != GennyBridge.getUser() &&
                                                userObject &&
                                                messageIndex == 0 &&
                                                userObject.attributes
                                                ?
                                                    <ImageView className='conversation-message-image' src={userObject.attributes.PRI_IMAGE_URL && userObject.attributes.PRI_IMAGE_URL.value} />
                                                : null
                                            }

                                            {
                                                creator != GennyBridge.getUser() && userObject && messageIndex != 0 ?
                                                <div className='conversation-message-spacer' />
                                                : null
                                            }

                                            <div
                                                className={`conversation-message-text ${group.length == 1 ? 'single-message' : '' } ${this.props.useNewMessageAttributes ? 'alt-color' : '' }`}
                                                style={style}
                                                key={messageIndex}
                                            >
                                                {messageText}
                                            </div>
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
                { style: { flexGrow: 1 }},
                { style: { flexBasis: '200px', flexShrink: 0 }}]}
            cols={1}
        >
            {
                messages && messages.length > 0 ?
                    <div className={`conversation-messages-container ${window.getScreenSize()}`} position={[ 0,0]}>
                         {this.renderMessages(messages, currentUser, otherUser)}
                    </div>
                : null
            }
            {

                !messages || messages.length <= 0 ?
                    <div className="conversation-messages-empty" position={[0,0]}>
                        Start your conversation with {otherUser && otherUser.attributes.PRI_FIRSTNAME.value}
                    </div>
                : null
            }
            <div className="conversation-message-input" position={[1,0]}>{this.renderTextInput()}</div>
        </Grid>);
    }

    renderWebLayout(title, messages, currentUser, otherUser) {

        const rows = this.props.reverseDirection
            ? [
                { style: { flexGrow: 0, flexShrink: 0 }},
                { style: { flexGrow: 1 }}
            ]
            : [
                { style: { flexGrow: 12 }},
                { style: { flexBasis: '200px', flexShrink: 0 }}
            ];

        const emptyText = this.props.showFilters
            ? 'No messages to diplay'
            : `Start your conversation with ${otherUser && otherUser.attributes.PRI_FIRSTNAME.value}`;

        return (
            <Grid
                className={`messaging-conversation-main ${this.props.className || ''} ${this.props.reverseDirection ? 'reverse-direction' : ''}`}
                rows={rows}
                cols={1}
            >
                {
                    this.props.showFilters
                        ? this.renderFilters(title)
                        : null
                }
                {
                    messages && messages.length > 0 ?
                        <div className="conversation-messages-container" position={[this.props.reverseDirection ? 1 : 0 ,0]}>
                            {this.renderMessages(messages, currentUser, otherUser)}

                        </div>
                    : null
                }
                {
                    !messages || messages.length <= 0 ?
                        <div className="conversation-messages-empty" position={[this.props.reverseDirection ? 1 : 0 ,0]}>
                            {emptyText}
                        </div>
                    : null
                }
                <div className="conversation-message-input" position={[this.props.reverseDirection ? 0 : 1 ,0]}>{this.renderTextInput()}</div>
            </Grid>
        );
    }

    renderFilters = () => {

        const title = BaseEntityQuery.getBaseEntityField(this.props.itemCode, 'name');

        return (
            <div
                className='conversation-filters'
                position={[0,0]}
            >
                {
                    (
                        title &&
                        typeof title === 'string' &&
                        title.length > 0
                    )
                        ? (
                            <div
                                className='filter-title'
                                position={[0,0]}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px 0',
                                    borderTop: '1px solid white',
                                }}
                            >
                                <h3
                                    style={{
                                        color: 'white',
                                        margin: 0,
                                    }}
                                >
                                    {title}
                                </h3>
                            </div>
                        )
                        : null
                }
                
                <div
                    className='conversation-filters-search'    
                >
                    <IconSmall
                        className='conversation-filters-icon'
                        name='search'
                    />
                    <input
                        type='text'
                        className='conversation-filters-input'
                        onChange={this.handleFilterText}
                    />
                </div>
                <div
                    className='conversation-filters-buttons'
                >
                    <div
                        className={`conversation-filters-button ${this.state.filterType == null ? 'selected' : '' }`}
                        onClick={this.handleFilterClick(null)}
                    >
                        ALL
                    </div>
                    <div
                        className={`conversation-filters-button ${this.state.filterType == 'user' ? 'selected' : '' }`}
                        onClick={this.handleFilterClick('user')}
                    >
                        USERS
                    </div>
                    <div
                        className={`conversation-filters-button ${this.state.filterType == 'system' ? 'selected' : '' }`}
                        onClick={this.handleFilterClick('system')}
                    >
                        SYSTEM
                    </div>
                    
                </div>
            </div>
        );
    }

    render() {

        const { root, classNames, reverseDirection, useNewMessageAttributes } = this.props;

        const be = BaseEntityQuery.getBaseEntity(root);

        const attribute = BaseEntityQuery.getBaseEntityAttribute(root, 'PRI_TITLE');
        const title = attribute
            ? attribute.value
            : '';

        let users = BaseEntityQuery.getLinkedBaseEntities(root, 'LNK_USER');
        const currentUserCode = GennyBridge.getUser();
        const currentUser = users && users.filter(x => x.code == currentUserCode)[0];
        const otherUser = users && users.filter(x => x.code != currentUserCode)[0];

        let messages = BaseEntityQuery.getLinkedBaseEntities(root, 'LNK_CORE');
        if (this.props.showFilters) messages = this.filterMessages(messages);
        const orderedMessages = this.orderMessages(messages);

        if(!root || root == 'null') {
            return (
                <Grid
                    className={`messaging-conversation-main ${classNames || ''} ${reverseDirection ? 'reverse-direction' : ''}`}
                    rows={1}
                    cols={1}
                >
                    <div className="conversation-messages-empty" position={[0,0]}>
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
