import layoutIncoming from './layout.events.incoming.js';
import authOutgoing from './auth.events.outgoing.js';
import authIncoming from './auth.events.incoming.js';
import redirectIncoming from './redirect.events.incoming.js';
import baseEntity from './baseEntity.events.incoming.js';
import askIncoming from './ask.events.incoming.js';
import answerIncoming from './answer.events.incoming.js';
import askOutgoing from './ask.events.outgoing.js';
import attributeIncoming from './attribute.events.incoming.js';
import aliasIncoming from './alias.events.incoming.js';
import treeView from './treeView.events.outgoing.js';
import notificationIncoming from './notification.events.incoming.js';
import btnOutgoing from './btn.events.outgoing.js';
import bucketDropOutgoing from './bucket.events.outgoing';
import cmdIncoming from './cmd.events.incoming';
import cmdOutgoing from './cmd.events.outgoing';

export default {
  incoming: {
    ...layoutIncoming,
    ...baseEntity,
    ...askIncoming,
    ...attributeIncoming,
    ...notificationIncoming,
    ...authIncoming,
    ...aliasIncoming,
    ...redirectIncoming,
    ...answerIncoming,
    ...cmdIncoming,
  },
  outgoing: {
    ...authOutgoing,
    ...askOutgoing,
    ...treeView,
    ...btnOutgoing,
    ...bucketDropOutgoing,
    ...cmdOutgoing,
  }
};
