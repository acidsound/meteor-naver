Package.describe({
  name: 'spectrum:naver',
  version: '0.0.1',
  summary: 'Naver OAuth flow',
  git: 'https://github.com/acidsound/meteor-naver',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'client');
  api.use('random', 'client');
  api.use('peerlibrary:xml2js');
  api.use('service-configuration', ['client', 'server']);

  api.export('Naver');

  api.addFiles(
      ['naver_configure.html', 'naver_configure.js'],
      'client');

  api.addFiles('naver_server.js', 'server');
  api.addFiles('naver_client.js', 'client');
});