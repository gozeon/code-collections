export default (app) => {
    app.get('/b', (req, res) => {
      res.send('This is a response for /b');
    });
  };