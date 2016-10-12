# Simple Slide-Show v0.0.1
A simple responsive slide-show. Requires jQuery (1.11+).

## Setup

Include jQuery (1.11+) and the Simple Slide-show plugin files.

```html
<!-- Simple Slide-Show Stylesheet -->
<link rel="stylesheet" href="simple-slide-show/simple-slide-show.css">

<!-- Simple Slide-Show jQuery Plugin -->
<script src="simple-slide-show/simple-slide-show.js"></script>
```

Slides are list items wrapped in a container element (classified `simple-slide-show` in the following example). Each list item contains a `figure` element that wraps slide content. This `figure` element can take a `background` style for full-slide images.

The `loading` class applied to the container and the `on` class applied to the first slide will be added by the jQuery plugin if they are omitted in the HTML, but loading is smoother if they are included in the layout code.

```html
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

Call the plugin with jQuery. Settings between brackets are optional.

```javascript
$( '.simple-slide-show' ).simpleSlideShow({
  autoplay: 5000,
  controls: true,
  index: true,
  effect: 'fade',
  autosize: false
});
```

## Settings

Setting | Type | Default | Description
--- | --- | --- | ---
autoplay | integer or boolean | 5000 | The amount of time in milliseconds between slides. If set to `false` or `0`, the slide-show will not autoplay.
controls | boolean | true | Show directional controls (left and right buttons)
index | boolean | true | Show navigation index controls (persistent sequential buttons)
effect | string | 'slide' | Transition effect: `'slide'` or `'fade'`
autosize | boolean | true | Size slide-show to height of tallest slide content

## Additional Functionality

This plugin integrates well with [Hammer.js](https://github.com/hammerjs/hammer.js) for touch functionality. If Hammer.js is loaded, touch functionality can be enabled by inserting the following code before the `autoPlayFn()` definition inside the `simple-slide-show.js` script.

```javascript
// touch events
var touch = new Hammer( $( container )[ 0 ] );
touch.on( 'panright panleft', function( e ){
  clearInterval( autoPlay );

  if( !animating ){
    animating = true;
    var current = container.find( '.simple-slide-show > ul > li.on' ).index();

    if( e.type == 'panright' ){
      if( current > 0 ) slideBack( current );
      else slideLast( current );
    }
    if( e.type == 'panleft' ){
      if( current < slideCount - 1 ) slideForward( current );
      else slideRestart( current );
    }

    setTimeout( function(){
      animating = false;
    }, slideTransition );
  }
} );
```