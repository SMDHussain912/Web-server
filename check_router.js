var m = require('./routes/auth');
console.log('type:', typeof m);
console.log('keys:', Object.keys(m));
console.log('router:', m.router ? 'exists' : 'missing');
console.log('csrfMiddleware:', typeof m.csrfMiddleware);
