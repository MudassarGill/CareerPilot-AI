const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect fill="#F5F7FB" width="800" height="600"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#66728C">Image Placeholder</text>
</svg>`;

const files = [
    'hero-8.jpg', 'hero-9.jpg', 'hero-10.jpg', 'hero-11.jpg', 'hero-12.jpg',
    'auth-1.jpg', 'auth-2.jpg', 'auth-3.jpg', 'about-1.jpg', 'founder.jpg',
    'logo-mark.png', 'og-image.jpg', 'not-found.svg', 'error.svg',
    'empty-notifications.svg', 'empty-generic.svg', 'success.svg'
];

files.forEach(file => {
    const filePath = path.join(imgDir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, svgContent);
        console.log("Created placeholder:", file);
    }
});
