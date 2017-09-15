import layoutIncoming from './layout.events.incoming.js';
import authOutgoing from './auth.events.outgoing.js';
import baseEntity from './baseEntity.events.incoming.js';

export default {
  incoming: {
    ...layoutIncoming,
    ...baseEntity
  },
  outgoing: {
    ...authOutgoing,
  }
};
