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
