const mongoose = require('mongoose');

console.log('Loading schemas...');
try {
  const Faculty = require('./models/Faculty');
  const Class = require('./models/Class');
  const Student = require('./models/Student');

  console.log('Faculty Model loaded successfully.');
  console.log('Class Model loaded successfully.');
  console.log('Student Model loaded successfully.');
  
  // Validate model names
  console.log('Registered Models:', mongoose.modelNames());
  
  if (mongoose.modelNames().includes('Faculty') && 
      mongoose.modelNames().includes('Class') && 
      mongoose.modelNames().includes('Student')) {
    console.log('SUCCESS: All models compiled and registered successfully!');
    process.exit(0);
  } else {
    console.error('ERROR: Missing registered models.');
    process.exit(1);
  }
} catch (error) {
  console.error('Model validation failed:', error);
  process.exit(1);
}
