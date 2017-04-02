module.exports = [
  { basePath: '/', file: require('./Root') },
  { basePath: '/users/', file: require('./Users') },
  { basePath: '/slack-clients/', file: require('./SlackClients') },
  { basePath: '/hosts/', file: require('./Hosts') }
];
