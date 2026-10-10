const fs = require('fs');
const path = require('path');

const base = path.join(process.cwd(), 'frontend', 'app', '(auth)');
const d1 = path.join(base, 'forgot-password');
const d2 = path.join(base, 'reset-password');

if (fs.existsSync(d1)) {
    fs.rmSync(d1, { recursive: true, force: true });
    console.log('Removed', d1);
}
if (fs.existsSync(d2)) {
    fs.rmSync(d2, { recursive: true, force: true });
    console.log('Removed', d2);
}
