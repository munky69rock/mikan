// Commands:
//  latex - Render LaTeX

module.exports = controller => {
  controller.hears(
    [/(?:la)?tex (.*)/i],
    'direct_message,direct_mention,mention,ambient',
    (bot, message) => {
      const latex = message.match[1].trim();
      const option = {
        username: 'LaTex',
        icon_url: 'http://www.gmkfreelogos.com/logos/L/img/Latex-1.gif'
      };
      if (latex) {
        option.text = `http://chart.apis.google.com/chart?cht=tx&chl=${encodeURIComponent(
          latex
        )}`;
      } else {
        option.text = 'Usage: latex {LaTeX texts}';
      }
      bot.reply(message, option);
    }
  );
};
