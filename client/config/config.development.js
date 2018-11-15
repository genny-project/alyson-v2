module.exports = {
  'backendEnabled': true,
  'backendLayouts': true,
  'genny': {
    'host': 'http://bridge-staging.pcss.io',
    'bridge': {
      'port': '8088',
      'endpoints': {
        'vertex': 'frontend',
        'service': 'api/service',
        'events': 'api/events'
      }
    }
  }
};
