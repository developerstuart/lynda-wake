const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // Copy CSS and JS files to output
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");

  // Add a collection to get gallery images with optimization
  eleventyConfig.addCollection("galleryImages", async function () {
    const galleryPath = path.join(__dirname, "gallery");
    const outputPath = path.join(__dirname, "_site/gallery");

    // Create directory if it doesn't exist
    if (!fs.existsSync(galleryPath)) {
      fs.mkdirSync(galleryPath, { recursive: true });
      return [];
    }

    try {
      const files = fs.readdirSync(galleryPath);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );

      // Process and optimize images
      const optimizedImages = await Promise.all(
        imageFiles.map(async (file) => {
          const inputPath = path.join(galleryPath, file);
          const isSvg = /\.svg$/i.test(file);

          // Skip optimization for SVG files, just copy them
          if (isSvg) {
            return {
              filename: file,
              path: `/gallery/${file}`,
              optimized: false,
            };
          }

          // Optimize raster images
          try {
            const metadata = await Image(inputPath, {
              widths: [1600], // Multiple sizes for responsive images
              formats: ["webp"], // Output formats
              outputDir: outputPath,
              urlPath: "/gallery/",
              filenameFormat: function (id, src, width, format, options) {
                const extension = path.extname(src);
                const name = path.basename(src, extension);
                return `${name}-${width}w.${format}`;
              },
              // Use memory cache for performance
              useCache: true,
              sharpOptions: {
                // Add compression options
                jpeg: {
                  quality: 80,
                },
                webp: {
                  quality: 80,
                },
              },
            });

            // Use the largest webp version as the primary image
            const webpVersions = metadata.webp || [];
            const largestWebp = webpVersions[webpVersions.length - 1];

            if (largestWebp) {
              return {
                filename: file,
                path: largestWebp.url,
                optimized: true,
                metadata: metadata,
              };
            }

            // Fallback to jpeg if webp generation failed
            const jpegVersions = metadata.jpeg || [];
            const largestJpeg = jpegVersions[jpegVersions.length - 1];

            if (largestJpeg) {
              return {
                filename: file,
                path: largestJpeg.url,
                optimized: true,
                metadata: metadata,
              };
            }

            // Fallback to original if optimization failed
            return {
              filename: file,
              path: `/gallery/${file}`,
              optimized: false,
            };
          } catch (err) {
            console.warn(`Failed to optimize ${file}:`, err.message);
            return {
              filename: file,
              path: `/gallery/${file}`,
              optimized: false,
            };
          }
        })
      );

      return optimizedImages;
    } catch (err) {
      console.log("Gallery directory not found or empty");
      return [];
    }
  });

  // Copy non-optimized images as fallback
  eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
