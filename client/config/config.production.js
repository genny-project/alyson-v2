module.exports = {
  'backendEnabled': true,
  'backendLayouts': true,
  'genny': {
    'host': process.env.FORCE_REACT_BRIDGE_HOST || '{{REACT_BRIDGE_HOST}}',
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
