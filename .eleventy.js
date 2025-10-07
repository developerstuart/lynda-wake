const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Copy images directory to output
  eleventyConfig.addPassthroughCopy("images");
  
  // Copy CSS and JS files to output
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  
  // Add a collection to get gallery images
  eleventyConfig.addCollection("galleryImages", function() {
    const galleryPath = path.join(__dirname, 'images/gallery');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(galleryPath)) {
      fs.mkdirSync(galleryPath, { recursive: true });
      return [];
    }
    
    try {
      const files = fs.readdirSync(galleryPath);
      return files
        .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
        .map(file => ({
          filename: file,
          path: `/images/gallery/${file}`
        }));
    } catch (err) {
      console.log('Gallery directory not found or empty');
      return [];
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
