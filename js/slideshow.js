// Slideshow configuration
const DISPLAY_DURATION = 10000; // How long each image shows (ms)
const FADE_OUT_DURATION = 1000; // Fade out duration (ms)
const MAX_CONCURRENT_IMAGES = 1; // Maximum images on screen at once

// Position options: corners and center
const positions = [
  "pos-top-left",
  "pos-top-right",
  "pos-bottom-left",
  "pos-bottom-right",
  "pos-center",
];

// Animation options
const animations = [
  "slide-in-left",
  "slide-in-right",
  "slide-in-top",
  "slide-in-bottom",
  "fade-in",
];

// Track active images
let activeImages = [];
let currentImageIndex = 0;
let shuffledImages = [];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Get random item from array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Create and display an image
 */
function displayImage(imageData) {
  const container = document.getElementById("slideshow-container");

  // Create image element
  const img = document.createElement("img");
  img.src = imageData.path.replace(/^\//, ""); // Remove leading slash for relative path
  img.className = "slideshow-image";
  img.alt = imageData.filename;

  // Add random position
  let position = getRandomItem(positions);

  // Ensure no two images share the same position
  const occupiedPositions = activeImages.map((imgInfo) => {
    const classes = imgInfo.element.className.split(" ");
    return classes.find((cls) => positions.includes(cls));
  });

  let attempts = 0;
  while (occupiedPositions.includes(position) && attempts < 10) {
    position = getRandomItem(positions);
    attempts++;
  }

  img.classList.add(position);

  // Add random animation
  const animation = getRandomItem(animations);

  // If position is center, avoid slide-in animations
  if (position === "pos-center" && animation.startsWith("slide-in")) {
    img.classList.add("fade-in");
  } else {
    img.classList.add(animation);
  }

  // Add to container
  container.appendChild(img);

  // Trigger animation by adding active class
  setTimeout(() => {
    img.classList.add("active");
  }, 10);

  // Track active image
  const imageInfo = {
    element: img,
    timestamp: Date.now(),
  };
  activeImages.push(imageInfo);

  // Schedule removal
  setTimeout(() => {
    removeImage(img);
  }, DISPLAY_DURATION);

  // Limit concurrent images
  if (activeImages.length > MAX_CONCURRENT_IMAGES) {
    const oldest = activeImages[0];
    removeImage(oldest.element);
  }
}

/**
 * Remove an image with fade out
 */
function removeImage(imgElement) {
  // Start fade out
  imgElement.classList.remove("active");

  // Remove from DOM after fade
  setTimeout(() => {
    if (imgElement.parentNode) {
      imgElement.parentNode.removeChild(imgElement);
    }

    // Remove from active images tracking
    activeImages = activeImages.filter((img) => img.element !== imgElement);
  }, FADE_OUT_DURATION);
}

/**
 * Show next image in the shuffled sequence
 */
function showNextImage() {
  if (shuffledImages.length === 0) {
    console.log("No images available in gallery");
    return;
  }

  // Get next image
  const imageData = shuffledImages[currentImageIndex];
  displayImage(imageData);

  // Move to next image, reshuffle when we reach the end
  currentImageIndex++;
  if (currentImageIndex >= shuffledImages.length) {
    currentImageIndex = 0;
    shuffledImages = shuffleArray(galleryImages);
  }
}

/**
 * Initialize slideshow
 */
function initSlideshow() {
  if (!galleryImages || galleryImages.length === 0) {
    console.log("No images found in gallery/");
    document.body.innerHTML =
      '<div style="color: white; text-align: center; padding: 50px; font-size: 20px;">No images found in gallery/. Please add some images and rebuild.</div>';
    return;
  }

  console.log(`Starting slideshow with ${galleryImages.length} images`);

  // Shuffle images initially
  shuffledImages = shuffleArray(galleryImages);

  // Show first image immediately
  showNextImage();

  // Continue showing images at intervals
  setInterval(showNextImage, DISPLAY_DURATION / MAX_CONCURRENT_IMAGES);
}

// Start slideshow when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSlideshow);
} else {
  initSlideshow();
}
