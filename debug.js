const path = require('path');
const appPath = path.resolve(__dirname, 'backend', 'src', 'app.js');
console.log('Attempting to load backend from:', appPath);
try {
  require(appPath);
  console.log('Backend loaded successfully!');
} catch (err) {
  console.error('FAILED TO LOAD BACKEND');
  console.error(err);
}
