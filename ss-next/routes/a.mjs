export default (app) => {
    app.get('/a', (req, res) => {
      res.send('This is a response for /a');
    });
  };