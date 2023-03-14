router.get('/airbnb/:id/dogparks', async (req, res) => {
    const { id } = req.params;
    try {
      // Find the Airbnb by id
      const airbnb = await Airbnb.findById(id);
  
      // Use the neighbourhood to find all dogparks in the same neighbourhood
      const dogparks = await Dogpark.aggregate([
        {
          $match: { neighbourhood: airbnb.neighbourhood },
        },
      ]);
  
      // Return the dogparks
      res.status(200).json(dogparks);
    } catch (error) {
      // Return an error if there's an issue
      res.status(500).json({ error: error.message });
    }
  });
  
  // Export the router
  module.exports = router;