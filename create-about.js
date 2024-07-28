const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'dist/ghsl-client/browser', 'index.html');
const destinationPath = path.join(__dirname, 'dist/ghsl-client/browser', 'about.html');

function copyAndRename() {
  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error('Error copying the file:', err);
      return;
    }
    console.log('File copied and renamed successfully!');
  });
}

copyAndRename();
