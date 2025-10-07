# lynda-wake

An 11ty-powered randomized image slideshow that displays images from your gallery with beautiful fade and slide-in transitions.

## Features

- 🎲 **Randomized Display**: Images are shown in random order and positions
- 📍 **Dynamic Positioning**: Images appear in random corners or center of the screen
- ✨ **Smooth Transitions**: Multiple animation types including fade-in and slide-in from all directions
- 🔄 **Continuous Loop**: Images cycle automatically with configurable timing
- 🎨 **Responsive Design**: Works on different screen sizes
- 🏗️ **Build-time Generation**: Image list is generated from the filesystem during the build process

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your images to the `images/gallery/` folder
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

3. Build the site:
```bash
npm run build
```

4. The generated site will be in the `_site/` folder

## Development

To run a development server with live reload:
```bash
npm run serve
```

Then open your browser to `http://localhost:8080`

## Configuration

You can customize the slideshow behavior by editing `js/slideshow.js`:

- `DISPLAY_DURATION`: How long each image shows (default: 4000ms)
- `FADE_OUT_DURATION`: Fade out transition time (default: 1000ms)
- `MAX_CONCURRENT_IMAGES`: Maximum images on screen at once (default: 3)

## Project Structure

```
lynda-wake/
├── images/
│   └── gallery/        # Place your images here
├── src/
│   └── index.njk       # Main template
├── css/
│   └── styles.css      # Slideshow styles and animations
├── js/
│   └── slideshow.js    # Slideshow logic
├── .eleventy.js        # 11ty configuration
└── package.json        # Project dependencies
```

## How It Works

1. During the 11ty build process, the `.eleventy.js` configuration reads all image files from `images/gallery/`
2. The image list is passed to the template as a collection
3. The JavaScript receives the image list and randomly shuffles it
4. Images are displayed one by one with random positions and animations
5. When the list is exhausted, it's reshuffled and the cycle continues

## License

ISC