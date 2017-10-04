import layoutIncoming from './layout.events.incoming.js';
import authOutgoing from './auth.events.outgoing.js';
import authIncoming from './auth.events.incoming.js';
import redirectIncoming from './redirect.events.incoming.js';
import baseEntity from './baseEntity.events.incoming.js';
import treeViewExpand from './treeViewExpand.events.outgoing.js';

export default {
  incoming: {
    ...layoutIncoming,
    ...baseEntity,
    ...authIncoming,
    ...redirectIncoming
  },
  outgoing: {
    ...authOutgoing,
    ...treeViewExpand,
  }
};
