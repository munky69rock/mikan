const token = process.env.token;
const logger = require('./lib/logger.js');

if (!token) {
  logger.error('Error: Specify token in environment');
  process.exit(1);
}

const fs = require('fs');
const Path = require('path');
const help = require('./lib/help.js');
const storage = require('./lib/storage.js');
const EventHook = require('./lib/event_hook.js');
const request = require('request');

const controller = require('botkit').slackbot({
  storage: storage({ path: 'data' })
});

// FIXME: ensure callback to be always executed
controller.hooks = new EventHook(['ambient'], (hooks) => {
  Object.keys(hooks.events).forEach(e => {
    controller.on(e, (bot, message) => {
      logger.debug(`hooks ${e}`);
      controller.hooks.trigger(e, cb => cb(bot, message));
    });
  }); 
});

// handle bot_message
controller.on('bot_message', (bot, message) => {
  if (!message.attachments) {
    return;
  }
  message.attachments.forEach((attachment) => {
    if (attachment.text.match(/<(https?:\/\/[^>\|]+)>/)) {
      const link = RegExp.$1; 
      bot.reply(message, link);
    }
  });
});

// load config if json exists
const configFile = './config.json';
if (fs.existsSync(configFile)) {
  Object.assign(controller.config, require(configFile));
}

// load all scripts
const scriptsPath = Path.join(__dirname, 'scripts');
const paths = [];
fs.readdirSync(scriptsPath).forEach(file => {
  const path = `${scriptsPath}/${file}`;
  paths.push(path);
  require(path)(controller);
});


const userLocalToken = process.env.USER_LOCAL_TOKEN;
if (userLocalToken) {
  controller.on('direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.users.get(message.user, (err, user) => {
      if (err || !user) {
        return;
      }
      const url = `https://chatbot-api.userlocal.jp/api/chat?message=${encodeURIComponent(message.text)}&key=${userLocalToken}&bot_name=mikan&platform=slack&user_name=${user.name}`;
      request.get(url, (err, httpResponse, body) => {
        const res = JSON.parse(body);
        bot.reply(message, res.result);
      });
    });
  });

}

const bot = controller.spawn({
  token
  /* eslint-disable no-unused-vars */
}).startRTM((err, bot, payload) => {
  /* eslint-enable no-unused-vars */
  if (err) {
    return logger.error(err);
  }

  // register cron jobs
  const cronPath = Path.join(__dirname, 'cron');
  fs.readdirSync(cronPath).forEach(file => {
    require(`${cronPath}/${file}`)(bot);
  });

});

bot.botkit.on('rtm_open', () => {
  // parse help message
  paths.forEach(path => {
    help.parse(path, bot.identity.name);
  });
}).on('rtm_close', () => {
  process.exit(1);
});

// load and save team, member and channel data from slack
require('./lib/slack_sync.js')(bot).all();

/*
 * WIP: slack commands or outgoing web hooks
 */

const fetchVariable = (key, defaults) => {
  return process.env[key] || controller.config[key] || defaults;
};

const clientId = fetchVariable('SLACK_APP_CLIENT_ID');
const clientSecret = fetchVariable('SLACK_APP_CLIENT_SECRET');
const port = fetchVariable('port', '3978');
const redirectUri = fetchVariable('uri');

if (clientId && clientSecret && redirectUri) {
  controller.configureSlackApp({
    clientId,
    clientSecret,
    redirectUri,
    scopes: [
      'incoming-webhook',
      'team:read',
      'users:read',
      'channels:read',
      'im:read',
      'im:write',
      'groups:read',
      'emoji:read',
      'chat:write:bot'
    ]
  });

  controller.setupWebserver(port, (err, webserver) => {

    // set up web endpoints for oauth, receiving webhooks, etc.
    controller
      .createHomepageEndpoint(webserver)
      .createOauthEndpoints(webserver, (err,req,res) => {
        logger.log(err, req, res);
      })
      .createWebhookEndpoints(webserver);

    const serverPath = Path.join(__dirname, 'server');
    fs.readdirSync(serverPath).forEach(file => {
      require(`${serverPath}/${file}`)(webserver, controller);
    });
  });

  controller.on('slash_command', (bot, message) => {
    logger.debug(message);
    bot.replyPrivate(message,'Only the person who used the slash command can see this.');
  });
}
