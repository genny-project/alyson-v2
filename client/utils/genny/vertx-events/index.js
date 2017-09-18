import layoutIncoming from './layout.events.incoming.js';
import authOutgoing from './auth.events.outgoing.js';
import authIncoming from './auth.events.incoming.js';
import baseEntity from './baseEntity.events.incoming.js';

export default {
  incoming: {
    ...layoutIncoming,
    ...baseEntity,
    ...authIncoming
  },
  outgoing: {
    ...authOutgoing,
  }
};
