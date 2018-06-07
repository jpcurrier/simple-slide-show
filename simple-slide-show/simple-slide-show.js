//! Simple Slide-Show 2.0.0 | MIT
// https://github.com/jpcurrier/simple-slide-show
'use strict';

function SimpleSlideShow( el, options ){
  this.el = el;
  if( typeof el === 'string' )
    this.el = document.querySelectorAll( el );
  if( el.nodeType === document.ELEMENT_NODE )
    this.el = [ el ];

  this.set( options );

  this.init();
}

SimpleSlideShow.prototype.settings = {
  autoplay: true,
  controls: true,
  index: true,
  indexUnderline: true,
  effect: 'slide',
  autosize: true,
  hammerJS: false,
  onBuild: null
};

SimpleSlideShow.prototype.set = function( options ){
  for( var key in options )
    if( this.settings.hasOwnProperty( key ) )
      this.settings[ key ] = options[ key ];
  return this.settings;
};

SimpleSlideShow.prototype.util = {
  hasClass: function( el, classname ){
    function check( classname ){
      if( el.nodeType !== document.ELEMENT_NODE )
        return false;
      else if( !( new RegExp( '\\s' + classname + '\\s' ).test( ' ' + el.className + ' ' ) ) )
        return false;
      else
        return true;
    }

    if( el && classname ){
      if( typeof el == 'string' )
        el = document.querySelector( el );
      if( el.nodeType !== document.ELEMENT_NODE && el[ 0 ] )
        el = el[ 0 ];

      var classnames = classname.split( ' ' );
      for( var i = 0; i < classnames.length; i++ ){
        if( check( classnames[ i ] ) )
          continue;
        else
          return false;
      }
      return true;
    }
  },

  addClass: function( el, classname ){
    function add( classname ){
      for( var j = 0; j < el.length; j++ ){
        if(
          el[ j ].nodeType === document.ELEMENT_NODE &&
          !( new RegExp( '\\s' + classname + '\\s' ).test( ' ' + el[ j ].className + ' ' ) )
        )
          el[ j ].className += el[ j ].className ? ' ' + classname : classname;
      }
    }

    if( el && classname ){
      if( typeof el == 'string' )
        el = document.querySelectorAll( el );
      if( el.nodeType === document.ELEMENT_NODE )
        el = [ el ];

      var classnames = classname.split( ' ' );
      for( var i = 0; i < classnames.length; i++ ){
        add( classnames[ i ] );
      }
    }
  },

  removeClass: function( el, classname ){
    function remove( classname ){
      for( var j = 0; j < el.length; j++ ){
        if( el[ j ].nodeType === document.ELEMENT_NODE )
          el[ j ].className = el[ j ].className.replace( new RegExp( '(?:^|\\s)' + classname + '(?!\\S)' ), '' );
      }
    }

    if( el && classname ){
      if( typeof el == 'string' )
        el = document.querySelectorAll( el );
      if( el.nodeType === document.ELEMENT_NODE )
        el = [ el ];

      var classnames = classname.split( ' ' );
      for( var i = 0; i < classnames.length; i++ ){
        remove( classnames[ i ] );
      }
    }
  },

  getStyle: function( el, prop ){
    if( getComputedStyle )
      return getComputedStyle( el ).getPropertyValue( prop );
    else if( el.currentStyle )
      return el.currentStyle[ prop.replace( /-([a-z])/gi, function ( g ){ return g[ 1 ].toUpperCase(); } ) ];
  }
};

SimpleSlideShow.prototype.init = function(){
  for( var i = 0; i < this.el.length; i++ )
    this.build( this.el[ i ] );
};

SimpleSlideShow.prototype.build = function( container ){
  var settings = this.settings,
    util = this.util,
    slide = false;
  for( var j = 0; j < container.children.length; j++ ){
    if( container.children[ j ].nodeName.toLowerCase() === 'ul' ){
      for( var k = 0; k < container.children[ j ].children.length; k++ ){
        if( slide )
          slide.push( container.children[ j ].children[ k ] );
        else
          slide = [ container.children[ j ].children[ k ] ];
      }
    }
  }

  if( !slide )
    return;

  var animating = false,
    slideTransitionDuration = util.getStyle( slide[ 0 ], 'transition-duration' ), // fade
    slideTransition = 0;
  if( settings.effect === 'slide' ){
    var slideStyle = document.createElement( 'div' );
    slideStyle.style.display = 'none';
    slideStyle.className = 'from-left';
    slideStyle.appendChild( document.createElement( 'figure' ) );
    document.body.appendChild( slideStyle );
    slideTransitionDuration = util.getStyle( slideStyle.firstChild, 'animation-duration' ); // slide
    document.body.removeChild( slideStyle );
  }
  if( slideTransitionDuration )
    slideTransition =
      slideTransitionDuration.indexOf( 'ms' ) > -1 ?
        parseFloat( slideTransitionDuration ) :
          parseFloat( slideTransitionDuration ) * 1000;

  if( settings.controls ){
    util.addClass( container, 'slide-controls' );
    if( !document.querySelector( 'button.slide-control.next' ) ){
      var prevButton = document.createElement( 'button' ),
        nextButton = document.createElement( 'button' );
      prevButton.appendChild( document.createElement( 'div' ) );
      prevButton.className = "slide-control prev";
      nextButton.appendChild( document.createElement( 'div' ) );
      nextButton.className = "slide-control next";
      container.appendChild( prevButton );
      container.appendChild( nextButton );
      prevButton.addEventListener(
        'click',
        function(){
          slideControl( prevButton );
        }
      );
      nextButton.addEventListener(
        'click',
        function(){
          slideControl( nextButton );
        }
      );
    }
  }
  else
    util.removeClass( container, 'slide-controls' );

  function getCurrent(){
    for( var i = 0; i < slide.length; i++ )
      if( util.hasClass( slide[ i ], 'on' ) )
        return i;
  }
  var index = container.querySelector( 'ol.slide-index' ),
    indexUnderline = container.querySelector( 'div.index-underline' ),
    slideOn = getCurrent() || 0,
    i;
  if( index ){ // reset
    var jumps = index.getElementsByTagName( 'li' );
    for( i = jumps.length - 1; i >= 0; i-- )
      index.removeChild( index.firstChild );
  }
  else{
    index = document.createElement( 'ol' );
    index.className = "slide-index";
    container.appendChild( index );
  }
  if( settings.index ){
    for( i = 0; i < slide.length; i++ ){
      var jump = document.createElement( 'li' );
      jump.setAttribute( 'data-target', i );
      if( i === slideOn )
        jump.className = "on";
      index.appendChild( jump );
    }
    if( !indexUnderline ){
      indexUnderline = document.createElement( 'div' );
      indexUnderline.className = "index-underline";
    }
    index.appendChild( indexUnderline );
  }
  // show/hide underline
  if( settings.indexUnderline )
    util.addClass( index, 'underline' );
  else
    util.removeClass( index, 'underline' );

  var speed =
    settings.autoplay === true ?
      5000 : // default
        settings.autoplay;

  util.addClass( container, 'simple-slide-show' );
  if( settings.effect == 'fade' )
    util.addClass( container, 'fade' );
  else
    util.removeClass( container, 'fade' );

  // "on" slide
  util.addClass( slide[ slideOn ], 'on' );
  for( i = 0; i < slide.length; i++ ){
    if( settings.effect == 'slide' ){
      if( !util.hasClass( slide[ i ], 'on' ) )
        util.addClass( slide[ i ], 'to-left-init' );
    }
    else
      util.removeClass( slide[ i ], 'to-left-init to-left to-right from-left from-right' );
  }

  // updates
  function slideIn( i, direction ){
    util.removeClass( slide[ i ], 'to-left-init to-left to-right' );
    util.addClass( slide[ i ], 'on from-' + direction );
  }
  function slideOut( i, direction ){
    util.removeClass( slide[ i ], 'on from-left from-right' );
    util.addClass( slide[ i ], 'to-' + direction );
  }
  function fade( fadeIn, fadeOut ){
    for( var i = 0; i < slide.length; i++ )
      util.removeClass( slide[ i ], 'off' );
    slide[ fadeOut ].className = 'off';
    util.addClass( slide[ fadeIn ], 'on' );
    setTimeout( function(){
      util.removeClass( slide[ fadeOut ], 'off' );
    }, slideTransition );
  }
  function updateIndex( current ){
    for( var i = 0; i < index.children.length; i++ ){
      if( i === Number( current ) )
        util.addClass( index.children[ i ], 'on' );
      else
        util.removeClass( index.children[ i ], 'on' );
    }

    if( settings.indexUnderline )
      indexUnderline.style.left = index.children[ current ].offsetLeft + 'px';
  }
  function slideForward( current ){
    if( settings.effect == 'fade' )
      fade( current + 1, current );
    else{
      slideIn( current + 1, 'right' );
      slideOut( current, 'left' );
    }
    if( settings.index )
      updateIndex( current + 1 );
  }
  function slideBack( current ){
    if( settings.effect == 'fade' )
      fade( current - 1, current );
    else{
      slideIn( current - 1, 'left' );
      slideOut( current, 'right' );
    }
    if( settings.index )
      updateIndex( current - 1 );
  }
  function slideRestart( current ){
    if( settings.effect == 'fade' )
      fade( 0, current );
    else{
      slideIn( 0, 'right' );
      slideOut( current, 'left' );
    }
    if( settings.index )
      updateIndex( 0 );
  }
  function slideLast( current ){
    if( settings.effect == 'fade' )
      fade( slide.length - 1, current );
    else{
      slideIn( slide.length - 1, 'left' );
      slideOut( current, 'right' );
    }
    if( settings.index )
      updateIndex( slide.length - 1 );
  }

  // controls: directional
  function slideControl( el ){
    stopAutoPlay();

    if( !animating ){
      animating = true;

      var current = getCurrent();
      if( current !== undefined ){
        if( util.hasClass( el, 'prev' ) ){
          if( current > 0 ) slideBack( current );
          else slideLast( current );
        }

        if( util.hasClass( el, 'next' ) ){
          if( current < slide.length - 1 ) slideForward( current );
          else slideRestart( current );
        }
      }

      setTimeout( function(){
        animating = false;
      }, slideTransition );
    }
  }

  // controls: indexed
  function slideIndex( i ){
    stopAutoPlay();

    if( !animating ){
      animating = true;

      var toSlide = i,
        current;
      for( var j = 0; j < slide.length; j++ )
        if( util.hasClass( slide[ j ], 'on' ) )
          current = j;

      if( !util.hasClass( index.children[ i ], 'on' ) && current !== undefined ){
        if( toSlide > current ){
          if( settings.effect == 'fade' )
            fade( toSlide, current );
          else{
            slideIn( toSlide, 'right' );
            slideOut( current, 'left' );
          }
        }
        else{
          if( settings.effect == 'fade' )
            fade( toSlide, current );
          else{
            slideIn( toSlide, 'left' );
            slideOut( current, 'right' );
          }
        }
        updateIndex( toSlide );
      }

      setTimeout( function(){
        animating = false;
      }, slideTransition );
    }
  }

  function setSlideIndex( e ){
    slideIndex( e.currentTarget.getAttribute( 'data-target' ) );
  }
  if( index )
    for( i = 0; i < index.children.length; i++ ){
      index.children[ i ].addEventListener(
        'click',
        setSlideIndex
      );
    }

  // autoplay
  var autoPlay = container.getAttribute( 'data-s-play' );
  function autoPlayFn(){
    animating = true;

    var current = getCurrent();
    if( current !== undefined ){
      if( current < slide.length - 1 ) slideForward( current );
      else slideRestart( current );
    }

    setTimeout( function(){
      animating = false;
    }, slideTransition );
  }
  function startAutoPlay(){
    autoPlay = setInterval( autoPlayFn, speed + slideTransition );
    container.setAttribute( 'data-s-play', autoPlay );
  }
  function stopAutoPlay(){
    var autoPlay = container.getAttribute( 'data-s-play' ); // otherwise var gets stuck with value at first call?
    clearInterval( autoPlay );
    container.removeAttribute( 'data-s-play' );
  }
  if( util.hasClass( container, 'simple-slide-show-ready' ) && settings.autoplay && !autoPlay )
    startAutoPlay();

  // loading
  function loaded(){
    if( !util.hasClass( container, 'simple-slide-show-ready' ) ){
      util.addClass( container, 'simple-slide-show-ready' );

      slideTransitionDuration = util.getStyle( slide[ 0 ], 'transition-duration' ); // fade
      if( settings.effect === 'slide' ){
        var slideStyle = document.createElement( 'div' );
        slideStyle.style.display = 'none';
        slideStyle.className = 'from-left';
        slideStyle.appendChild( document.createElement( 'figure' ) );
        document.body.appendChild( slideStyle );
        slideTransitionDuration = util.getStyle( slideStyle.firstChild, 'animation-duration' ); // slide
        document.body.removeChild( slideStyle );
      }

      if( slideTransitionDuration )
        slideTransition =
          slideTransitionDuration.indexOf( 'ms' ) > -1 ?
            parseFloat( slideTransitionDuration ) :
              parseFloat( slideTransitionDuration ) * 1000;

      if( settings.autoplay )
        startAutoPlay();
    }
  }
  addEventListener( 'load', loaded );
  setTimeout( loaded, 5000 ); // hacky fallback if window load never resolves

  // sizing
  function slideHeights(){
    var padding = parseInt( util.getStyle( slide[ 0 ].querySelector( 'figure' ), 'padding-top' ) ) + parseInt( util.getStyle( slide[ 0 ].querySelector( 'figure' ), 'padding-bottom' ) ),
      tallest = 0;

    for( var i = 0; i < slide.length; i++ ){
      var h = 0,
        slideContent = slide[ i ].querySelector( 'figure' ).children;
      for( var j = 0; j < slideContent.length; j++ ){
        if( util.getStyle( slideContent[ j ], 'position' ) != 'absolute' && util.getStyle( slideContent[ j ], 'position' ) != 'fixed' )
          h += Math.ceil( slideContent[ j ].offsetHeight + parseInt( util.getStyle( slideContent[ j ], 'margin-top' ) ) + parseInt( util.getStyle( slideContent[ j ], 'margin-bottom' ) ) );
      }
      tallest = h > tallest ? h : tallest;
    }
    container.style.height = tallest + padding + 'px';
  }
  var delay,
    autosizeListener = function(){
      clearTimeout( delay );
      delay = setTimeout( function(){
        if( container.getAttribute( 'data-s-size' ) === 'true' )
          slideHeights();
      }, 100 );
    };
  if( settings.autosize ){
    slideHeights();
    if( !container.getAttribute( 'data-s-size' ) ) // only add listener once
      addEventListener( 'resize', autosizeListener );
    container.setAttribute( 'data-s-size', 'true' );
  }
  else if( container.getAttribute( 'data-s-size' ) === 'true' ){ // disable
    container.style.height = '';
    container.setAttribute( 'data-s-size', 'false' );
  }

  // touch
  if( settings.hammerJS && typeof Hammer === 'function' && !container.getAttribute( 'data-s-touch' ) ){
    var touch = new Hammer( container );
    touch.on( 'panright panleft', touchNav );
    container.setAttribute( 'data-s-touch', 'true' );
  }
  function touchNav( e ){
    stopAutoPlay();

    if( !animating ){
      animating = true;

      var current = getCurrent();
      if( current !== undefined ){
        if( e.type === 'panright' ){
          if( current > 0 ) slideBack( current );
          else slideLast( current );
        }
        if( e.type === 'panleft' ){
          if( current < slide.length - 1 ) slideForward( current );
          else slideRestart( current );
        }
      }

      setTimeout( function(){
        animating = false;
      }, slideTransition );
    }
  }

  /*
  // detect: Android
  // this should eventually be replaced by something targeted to specific feature support
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = ua.indexOf( 'android' ) > -1;
  if( isAndroid )
    util.addClass( document.querySelector( 'body' ), 'ua-android' );
  */

  if( typeof settings.onBuild === 'function' )
    settings.onBuild();
};

// jQuery plugin
function jQueryPlugin( namespace, PluginClass ){
  $.fn[ namespace ] = function( options ){
    return this.each( function( i, el ){
      var instance = $.data( el, namespace );
      if( instance ){
        instance.set( options );
        instance.init();
      }
      else{
        // initialize new instance
        instance = new PluginClass( el, options );
        $.data( el, namespace, instance );
      }
    });
  };
}
if( typeof jQuery !== 'undefined' )
  ( function( $ ){
    jQueryPlugin( 'simpleSlideShow', SimpleSlideShow );
  } )( jQuery );

if( typeof module === 'object' )
  module.exports = SimpleSlideShow;