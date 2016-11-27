// Commands:
//  esa - Work in progress...

module.exports = controller => {
  controller.hears('esa', 'direct_message', (bot, message) => {

    bot.reply(message, {
      attachments:[
        {
          title: 'Do you want to interact with my buttons?',
          callback_id: '123',
          attachment_type: 'default',
          actions: [
            {
              'name':'yes',
              'text': 'Yes',
              'value': 'yes',
              'type': 'button',
            },
            {
              'name':'no',
              'text': 'No',
              'value': 'no',
              'type': 'button',
            }
          ]
        }
      ]
    });
  });
};
//module.exports = controller => {
//  controller.hears([/esa/], 'direct_message,direct_mention,mention', (bot, message) => {
//    
//  });
//};

