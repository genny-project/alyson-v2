import './GennyMessaging.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { GennyList, GennyMessagingConversation } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { Grid } from '@genny-project/layson';

class GennyMessaging extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {

    }

    render() {

        const { root, messagesRoot } = this.props;

        const conversationTitle = BaseEntityQuery.getBaseEntityAttribute(messagesRoot, "PRI_TITLE").value;
        let messages = BaseEntityQuery.getLinkedBaseEntities(messagesRoot, "LNK_MESSAGES");
        messages = messages.sort((x, y) => x.created < y.created);

        return (
            <div className="genny-messaging-container">
                <Grid rows={1} cols={[1, 2]}>
                    <GennyList position={[0, 0]} root={root}/>
                    <GennyMessagingConversation position={[0, 1]} title={conversationTitle} messages={messages} root={messagesRoot} />
                </Grid>
            </div>
        );
    }
}

export default GennyMessaging;
