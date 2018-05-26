# Simple Slide-Show

A simple responsive slide-show.

Support: Chrome, Firefox, Safari, IE8+. Browsers that do not support CSS3 drop transition effects but retain basic slider functionality.

## Setup

Include the Simple Slide-Show stylesheet and script.

```html
<!-- Simple Slide-Show Stylesheet -->
<link rel="stylesheet" href="simple-slide-show/simple-slide-show.css">

<!-- Simple Slide-Show jQuery Plugin -->
<script src="simple-slide-show/simple-slide-show.js"></script>
```

Slides are list items wrapped in a container element. Each list item contains a `figure` element that wraps slide content. This `figure` element can take a `background` style for full-slide images.

The `simple-slide-show` class on the container is not mandatory in your layout code, but will be added automatically to the container by the script if not already present.

```html
<div class="simple-slide-show">
  <ul>
    <li>
      <figure>
        <p>First Slide</p>
      </figure>
    </li>
    <li>
      <figure>
        <p>Second Slide</p>
      </figure>
    </li>
    <li>
      <figure>
        <p>Third Slide</p>
      </figure>
    </li>
  </ul>
</div>
```

Initialize the plugin on the slide-show container.

```javascript
// jQuery (1.7+) with default settings
$( '.simple-slide-show' ).simpleSlideShow();

// jQuery (1.7+) with custom settings
$( '.simple-slide-show' ).simpleSlideShow({
  autoplay: 5000,
  controls: true,
  index: true,
  indexUnderline: true,
  effect: 'fade',
  autosize: false
});

// vanilla JavaScript with default settings
var simpleSlideShow = new SimpleSlideShow( '.simple-slide-show' );

// vanilla JavaScript with custom settings
var simpleSlideShow = new SimpleSlideShow(
  '.simple-slide-show',
  {
    autoplay: 5000,
    controls: true,
    index: true,
    indexUnderline: true,
    effect: 'fade',
    autosize: false
  }
);
```

## Settings

Setting | Type | Default | Description
--- | --- | --- | ---
autoplay | integer or boolean | 5000 | The amount of time in milliseconds between slides. If set to `false` or `0`, the slide-show will not advance automatically.
controls | boolean | true | Show sequential navigation controls (left and right buttons).
index | boolean | true | Show indexed navigation controls (slide jump buttons).
indexUnderline | boolean | true | Underline current index.
effect | string | 'slide' | Transition effect: `'slide'` or `'fade'`.
autosize | boolean | true | Size slide-show to height of tallest slide content. Set `false` if using CSS to set height of slide-show.
hammerJS | boolean | false | Enable touch functionality if [Hammer.js](https://github.com/hammerjs/hammer.js) is included on your page.