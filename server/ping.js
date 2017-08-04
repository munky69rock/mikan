module.exports = webserver => {
  webserver.get('/ping', (req, res) => {
    res.send('pong');
  });
};
