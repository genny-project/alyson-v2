module.exports = {
  'backendEnabled': true,
  'backendLayouts': true,
  'genny': {
    'host': `http://${window.location.hostname}:8088`,
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
