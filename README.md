
# PNG Transparency Checker

## Overview

PNG Transparency Checker is a Chrome extension that helps you determine whether an image is a true PNG with a transparent background or a fake PNG. By right-clicking on an image and selecting "Check if PNG is Transparent," you can quickly verify the transparency status of the image.

## Features

- Adds a context menu item for images.
- Checks if an image is a true PNG with a transparent background.
- Alerts the user about the transparency status of the selected image.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where you downloaded the repository.
5. The extension is now installed and ready to use.

## Usage

1. Navigate to any webpage with images.
2. Right-click on an image.
3. Select "Check if PNG is Transparent" from the context menu.
4. An alert will notify you whether the image is a true PNG with a transparent background or not.

## Project Structure

```
├── background.js
├── manifest.json
├── popup.html
├── style.css
└── icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### `manifest.json`

Defines the properties and permissions of the Chrome extension.

### `background.js`

Handles the creation of the context menu item and the core logic for checking image transparency.

### `popup.html`

Creates a simple popup interface for the extension.

### `style.css`

Provides basic styling for the popup.

### Icons

Contains the icons for the extension in sizes 16x16, 48x48, and 128x128 pixels.

## Code Explanation

### `background.js`

```javascript
// When the extension is installed, create a context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkImage", // Unique identifier for the context menu item
    title: "Check if PNG is Transparent", // Text displayed in the context menu
    contexts: ["image"] // Show this context menu item only when right-clicking on an image
  });
});

// Add a listener for clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Check if the clicked context menu item is our "checkImage" item
  if (info.menuItemId === "checkImage") {
    // Execute the script to check image transparency in the current tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id }, // The tab where the script should be executed
      function: checkImageTransparency, // The function to execute
      args: [info.srcUrl] // Pass the image URL to the function
    });
  }
});

// Function to check if an image has a transparent background
function checkImageTransparency(imageUrl) {
  // Fetch the image from the provided URL
  fetch(imageUrl)
    .then(response => response.blob()) // Convert the response to a blob
    .then(blob => createImageBitmap(blob)) // Create an ImageBitmap from the blob
    .then(imageBitmap => {
      // Create a canvas element to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      ctx.drawImage(imageBitmap, 0, 0); // Draw the image on the canvas

      // Get the image data from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let isTransparent = false;

      // Loop through the alpha values of the image data to check for transparency
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) { // Alpha value less than 255 means transparency
          isTransparent = true;
          break;
        }
      }

      // Display an alert based on the transparency check
      if (isTransparent) {
        alert('This is a true PNG with a transparent background.');
      } else {
        alert('This PNG does not have a transparent background.');
      }
    })
    .catch(error => console.error('Error checking image transparency:', error)); // Handle errors
}
```

### `style.css`

```css
/* Basic styling for the popup */

body {
  width: 200px; /* Set the width of the popup */
  font-family: Arial, sans-serif; /* Use Arial font */
  margin: 0;
  padding: 10px;
  background-color: #f9f9f9; /* Light grey background color */
}

h1 {
  font-size: 18px; /* Set the font size for the header */
  margin-bottom: 10px; /* Add some space below the header */
}

p {
  font-size: 14px; /* Set the font size for the paragraph */
  margin: 0;
  padding: 0;
}
```

### `popup.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>PNG Transparency Checker</title>
  <link rel="stylesheet" type="text/css" href="style.css"> <!-- Link to the CSS file -->
</head>
<body>
  <h1>PNG Checker</h1>
  <p>Select an image and right-click to check transparency.</p>
  <script src="popup.js"></script> <!-- Link to the JavaScript file -->
</body>
</html>
```

## Credits

- [Somar Kesen](https://github.com/somarkn99)
- [All Contributors](../../contributors)

Let's Connect
-------

- [Linkedin](https://www.linkedin.com/in/somarkn99/)
- [website](https://www.somar-kesen.com/)
- [facebook](https://www.facebook.com/SomarKesen)
- [instagram](https://www.instagram.com/somar_kn/)

Hire Me :fire:
-------
By the way, I'm available to work as freelancer, feel free to communicate with me in order to transform your project from an idea to reality.

You Can contact me for freelancer job vie email :
```
freelancer@somar-kesen.com
```
