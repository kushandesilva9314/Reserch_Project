const express = require('express');
const router = express.Router();
const Sales = require('../models/sales_schema');
const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden - Invalid token" });
      req.email = decoded.email;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//
router.get('/get-sales', authenticate, async (req, res) => {
  try {
    const email = req.email;
    const salesData = await Sales.findOne({ email });
    res.status(200).json(salesData || { email, sales: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales data", error });
  }
});


router.post('/add-sales', authenticate, async (req, res) => {
    try {
      const { sales, amount } = req.body;
      const email = req.email;
      let salesData = await Sales.findOne({ email });
  
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
      if (!salesData) {
        
        if (!Array.isArray(sales) || sales.length !== 24 || sales.some(val => typeof val !== 'number' || val <= 0)) {
          return res.status(400).json({ message: "Must provide exactly 24 valid monthly sales values." });
        }
        salesData = new Sales({ email, sales, lastUpdated: Date.now() });
      } else {
        
        if (typeof amount !== 'number' || amount <= 0) {
          return res.status(400).json({ message: "Amount must be a valid positive number." });
        }
  
       
        const lastUpdatedMonth = new Date(salesData.lastUpdated);
        lastUpdatedMonth.setDate(1);
  
         if (salesData.lastUpdated && lastUpdatedMonth >= currentMonth) {
          return res.status(400).json({ message: "Sales update for this month is locked. Wait until next month." });
        }
        
        salesData.sales.shift();
        salesData.sales.push(amount);
        salesData.lastUpdated = Date.now();
      }
  
      await salesData.save();
      res.status(200).json({ message: "Sales data updated successfully", salesData });
    } catch (error) {
      res.status(500).json({ message: "Error adding sales data", error });
    }
  });
  


router.delete('/delete-sales', authenticate, async (req, res) => {
  try {
    const email = req.email;
    await Sales.deleteOne({ email });
    res.status(200).json({ message: 'Sales data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sales data", error });
  }
});

module.exports = router;
