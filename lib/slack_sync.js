const logger = './logger.js';

class SlackSync {
  constructor(bot) {
    this.api = bot.api;
    this.storage = bot.botkit.storage;
  }

  all() {
    this.team();
    this.users();
    this.channels();
    this.groups();
  }

  team() {
    // @ https://api.slack.com/methods/team.info
    this.api.team.info({}, (err, res) => {
      if (err) {
        return logger.error(err);
      }

      if (this._isValidResponse(res, 'team')) {
        this.storage.teams.save({
          id: res.team.id,
          name: res.team.name,
        }, this._errorHandler);
      }
    });
  }

  users() {
    // @ https://api.slack.com/methods/users.list
    this.api.users.list({}, (err, res) => {
      if (err) {
        return logger.error(err);
      }

      if (this._isValidResponse(res, 'members')) {
        res.members.forEach(member => {
          this.storage.users.save({
            id: member.id,
            name: member.name,
          }, this._errorHandler);
        });
      }
    });
  }

  channels() {
    // @ https://api.slack.com/methods/channels.list
    this.api.channels.list({}, (err, res) => {
      if (err) {
        return logger.error(err);
      }

      if (this._isValidResponse(res, 'channels')) {
        res.channels.forEach(channel => {
          this.storage.channels.save({
            id: channel.id,
            name: channel.name,
          }, this._errorHandler);
        });
      }
    });
  }

  // private channels
  groups() {
    // @ https://api.slack.com/methods/groups.list
    this.api.groups.list({ exclude_archived: 1 }, (err, res) => {
      if (err) {
        return logger.error(err);
      }

      if (this._isValidResponse(res, 'groups')) {
        res.groups.forEach(group => {
          this.storage.channels.save({
            id: group.id,
            name: group.name,
          }, this._errorHandler);
        });
      }
    });
  }

  _isValidResponse(res, prop) {
    return res.hasOwnProperty(prop) && res.ok;
  }

  _errorHandler(err) {
    if (err) {
      logger.error(err);
    }
  }
}

module.exports = bot => {
  return new SlackSync(bot);
};
