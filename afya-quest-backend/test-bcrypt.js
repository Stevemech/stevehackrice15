const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    console.log('Testing bcrypt...');
    
    // Test hashing
    const password = 'demo123';
    console.log('Original password:', password);
    
    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated:', salt);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword);
    
    // Test comparison
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password matches:', isMatch);
    
    // Test with the hash from database
    const dbHash = '$2a$10$YourHashHere'; // We'll get this from DB
    
    console.log('\nBcrypt test completed successfully!');
  } catch (error) {
    console.error('Bcrypt test failed:', error);
  }
}

testBcrypt();