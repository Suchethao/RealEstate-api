const listingRoutes = (app, fs) => {
    // variables
    const dataPath = './data/listings.json';
  
    // READ
    app.get('/listings', (req, res) => {
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
  
        res.send(JSON.parse(data));
      });
    });
  };
  
  module.exports = listingRoutes;