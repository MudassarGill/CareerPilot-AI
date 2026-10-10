const fs = require('fs');
const path = require('path');

const p1 = path.join(__dirname, 'frontend', 'app', 'forgot-password');
const p2 = path.join(__dirname, 'frontend', 'app', 'reset-password');

if (fs.existsSync(p1)) {
    fs.rmSync(p1, { recursive: true, force: true });
    console.log('Removed', p1);
}
if (fs.existsSync(p2)) {
    fs.rmSync(p2, { recursive: true, force: true });
    console.log('Removed', p2);
}
