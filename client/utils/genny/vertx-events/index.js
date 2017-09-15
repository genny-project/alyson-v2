import layoutIncoming from './layout.events.incoming.js';
import authOutgoing from './auth.events.outgoing.js';

export default {
  incoming: {
    ...layoutIncoming
  },
  outgoing: {
    ...authOutgoing,
  }
};
