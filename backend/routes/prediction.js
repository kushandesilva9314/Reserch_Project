const express = require('express');
const router = express.Router();
const Sales = require('../models/sales_schema');

router.get('/:email', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default; 

    const { email } = req.params;

    const salesData = await Sales.findOne({ email });
    if (!salesData) return res.status(404).json({ message: 'Sales data not found' });

    const predictionResponse = await fetch('http://127.0.0.1:5001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_data: salesData.sales }),
    });

    const predictionData = await predictionResponse.json();

    if (predictionData.error) {
      return res.status(500).json({ message: 'Prediction failed', error: predictionData.error });
    }

    res.json({ predicted_sales: predictionData.predicted_sales });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 
