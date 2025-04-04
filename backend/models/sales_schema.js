const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  sales: { 
    type: [Number], 
    required: true, 
    validate: {
      validator: function(arr) {
        return Array.isArray(arr) && arr.length === 24 && arr.every(n => typeof n === 'number' && !isNaN(n));
      },
      message: 'Sales must be an array of exactly 24 numbers.'
    }
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sales', salesSchema);
