# Simple Slide-Show v0.1
A simple responsive slide-show. Requires jQuery (1.11+).

## Setup

Include jQuery (1.11+) and the Simple Slide-show plugin files.

```
<!-- Simple Slide-Show Stylesheet -->
<link rel="stylesheet" href="simple-slide-show/simple-slide-show.css">

<!-- Simple Slide-Show jQuery Plugin -->
<script src="simple-slide-show/simple-slide-show.js"></script>
```

Slides are list items wrapped in a container element with the class `simple-slide-show`. Each list item contains a `figure` element that wraps slide content. This `figure` element can take a `background` for full-slide images.

The `loading` class applied to the container and the `on` class applied to the first slide will be added by the jQuery plugin if they are omitted in the HTML, but loading is smoother if they are included.

```
<div class="simple-slide-show loading">
  <ul>
    <li class="on">
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

Call the plugin with jQuery. Settings between brackets are optional. More information in the following section.

```
$( '.simple-slide-show' ).simpleSlideShow({
  speed: 5000,
  controls: true,
  index: true,
  autoplay: true,
  effect: 'fade'
});
```

## Settings

Setting | Type | Default | Description
--- | --- | --- | ---
speed | integer | 5000 | The amount of time in milliseconds between slides
controls | boolean | true | Show directional controls (left and right buttons)
index | boolean | true | Show navigation index controls (persistent sequential buttons)
autoplay* | boolean | true | Slide automatically at speed setting
effect | string | 'slide' | Transition effect: `'slide'` or `'fade'`

\*condense with speed eventually