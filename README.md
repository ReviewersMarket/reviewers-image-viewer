# Reviewers Image Viewer

## Getting Started
### Install

To get started, simply install the module via NPM:

```bash
npm install reviewers-image-viewer
```

### Usage
Once the library has been installed, import the CSS file within your React app's `index.js` file. You'll also need to import the function to initialize.

```jsx
import {initReviewersImageView} from 'reviewers-image-viewer'
import 'reviewers-image-viewer/dist/index.css'
```

```js
  useEffect(() => {
        initReviewersImageView("");
  }, []);
```

The two plan types are `individual` and `team`.

Navigate to the React component where you wish to insert a lightbox, and import the component required:
```jsx
import {Slideshow} from 'reviewers-image-viewer'
```

Next, wrap the images in the `Slideshow` component:
```jsx
<Slideshow className="container grid grid-cols-3 gap-2 mx-auto">
    <img className="w-full rounded" src="https://source.unsplash.com/pAKCx4y2H6Q/1400x1200" />
    <img className="w-full rounded" src="https://source.unsplash.com/AYS2sSAMyhc/1400x1200" />  
    <img className="w-full rounded" src="https://source.unsplash.com/Kk8mEQAoIpI/1600x1200" />
    <img className="w-full rounded" src="https://source.unsplash.com/HF3X2TWv1-w/1600x1200" />
</Slideshow> 
```

### Next.js Guide
To get started with Next.js, be sure to take a look at, which shows how to set-up Lightbox.js and create an image gallery that opens the lightbox when an image is clicked on.

### Full Example
```jsx
import React, { Component } from 'react'

import {Slideshow} from 'reviewers-image-viewer'
import 'reviewers-image-viewer/dist/index.css'

class Demo extends Component {
  render() {
    return 
          <Slideshow>
                  <img className="w-full rounded" src="https://source.unsplash.com/pAKCx4y2H6Q/1400x1200" />
                  <img className="w-full rounded" src="https://source.unsplash.com/AYS2sSAMyhc/1400x1200" />  
                  <img className="w-full rounded" src="https://source.unsplash.com/Kk8mEQAoIpI/1600x1200" />
                  <img className="w-full rounded" src="https://source.unsplash.com/HF3X2TWv1-w/1600x1200" />
          </Slideshow> 
  }
}
```
### 📚 Documentation

### Types Available
Several types have been provided, which have varying features to cater to your project's requirements.

These include:
- **Slideshow w/ thumbnails**:  A lightbox which displays images along with thumbnails underneath, so that users can navigate to other imagery in the slideshow.
- **Full-screen**: A lightbox which displays images at full-screen width and height. Simply set the `fullScreen` prop to `true`
for the `Slideshow` component.
- **Image**: Another lightbox is provided for displaying a single image only. See the documentation for the.

## Props
| Prop Name      | Description |
| ----------- | ----------- |
| theme      | The theme to be applied. Options include day, night, lightbox |
| fullScreen   | Whether to display images so that they take up the screen's full width and height |
| backgroundColor   | The background color, as a CSS color name, RGBA value or HEX code |
| iconColor   | Icon color, as a CSS color name, RGBA value or HEX code       |
| thumbnailBorder   | The color of the thumbnails' borders, as a CSS color name, RGBA value or HEX code |
| showThumbnails   | Whether or not to show image thumbnails.        |
| slideshowInterval   | The time in milliseconds before the slideshow transitions to the next image. |
| animateThumbnails   | Whether or not to animate the thumbnails as they enter the view. |
| imgAnimation   | The image animation type to show between image transitions in the slideshow, options include "fade" and "imgDrag" |