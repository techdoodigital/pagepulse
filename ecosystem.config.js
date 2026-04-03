module.exports = {
  apps: [{
    name: 'citely',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/citely',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M',
  }],
};
