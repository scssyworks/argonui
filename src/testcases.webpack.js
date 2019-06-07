// Import test cases
const context = require.context('./source/templates/components', true, /\.spec\.js$/);
context.keys().forEach(context);
