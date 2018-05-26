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
  hammerJS: false
};

SimpleSlideShow.prototype.set = function( options ){
  for( var key in options )
    if( this.settings.hasOwnProperty( key ) )
      this.settings[ key ] = options[ key ];
  return this.settings;
};

SimpleSlideShow.prototype.util = {
  hasClass: function( el, classname ){
    if( el && classname ){
      if( typeof el == 'string' )
        el = document.querySelector( el );
      if( el.nodeType !== document.ELEMENT_NODE && el[ 0 ] )
        el = el[ 0 ];

      function check( classname ){
        if( el.nodeType !== document.ELEMENT_NODE )
          return false;
        else if( !( new RegExp( '\\s' + classname + '\\s' ).test( ' ' + el.className + ' ' ) ) )
          return false;
        else
          return true
      }

      const classnames = classname.split( ' ' );
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
    if( el && classname ){
      if( typeof el == 'string' )
        el = document.querySelectorAll( el );
      if( el.nodeType === document.ELEMENT_NODE )
        el = [ el ];

      function add( classname ){
        for( var j = 0; j < el.length; j++ ){
          if(
            el[ j ].nodeType === document.ELEMENT_NODE &&
            !( new RegExp( '\\s' + classname + '\\s' ).test( ' ' + el[ j ].className + ' ' ) )
          )
            el[ j ].className += el[ j ].className ? ' ' + classname : classname;
        }
      }

      const classnames = classname.split( ' ' );
      for( var i = 0; i < classnames.length; i++ ){
        add( classnames[ i ] );
      }
    }
  },

  removeClass: function( el, classname ){
    if( el && classname ){
      if( typeof el == 'string' )
        el = document.querySelectorAll( el );
      if( el.nodeType === document.ELEMENT_NODE )
        el = [ el ];

      function remove( classname ){
        for( var j = 0; j < el.length; j++ ){
          if( el[ j ].nodeType === document.ELEMENT_NODE )
            el[ j ].className = el[ j ].className.replace( new RegExp( '(?:^|\\s)' + classname + '(?!\\S)' ), '' );
        }
      }

      const classnames = classname.split( ' ' );
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
  var el = this.el,
    settings = this.settings,
    util = this.util;

  for( var i = 0; i < el.length; i++ ){
    var container = el[ i ],
      slide = false;
    for( var i = 0; i < container.children.length; i++ ){
      if( container.children[ i ].nodeName.toLowerCase() === 'ul' ){
        for( var j = 0; j < container.children[ i ].children.length; j++ ){
          if( slide )
            slide.push( container.children[ i ].children[ j ] );
          else
            slide = [ container.children[ i ].children[ j ] ];
        }
      }
    }

    if( !slide )
      return;

    var animating = false,
      slideTransitionDuration = util.getStyle( slide[ 0 ], 'transition-duration' ), // !this grabs opacity transition time vs. transform transition time
      slideTransition = 0;
    if( slideTransitionDuration )
      slideTransition =
        slideTransitionDuration.indexOf( 'ms' ) > -1 ?
          parseFloat( slideTransitionDuration ) :
            parseFloat( slideTransitionDuration ) * 1000;

    if( settings.controls && !document.querySelector( 'button.slide-control.next' ) ){
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

    var index = container.querySelector( 'ol.slide-index' ),
      currentIndexLength = container.querySelectorAll( 'ol.slide-index > li' ).length,
      indexUnderline = container.querySelector( 'div.index-underline' );
    if( settings.index && currentIndexLength !== slide.length ){
      if( !index ){
        index = document.createElement( 'ol' );
        index.className = "slide-index";
        container.appendChild( index );
      }
      for( var i = currentIndexLength; i < slide.length; i++ ){
        var jump = document.createElement( 'li' );
        jump.setAttribute( 'data-target', i );
        if( i === 0 )
          jump.className = "on";
        index.appendChild( jump );
      }
      if( settings.indexUnderline && !indexUnderline ){
        indexUnderline = document.createElement( 'div' );
        indexUnderline.className = "index-underline";
        index.appendChild( indexUnderline );
      }
    }
    else if( !settings.index && container.querySelector( 'ol.slide-index' ) )
      container.removeChild( container.querySelector( 'ol.slide-index' ) );

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
    for( var i = 0; i < slide.length; i++ ){
      // already exists
      if( util.hasClass( slide[ i ], 'on' ) ){
        setupSlide();
        break;
      }
      else if( i === slide.length - 1 ){
        util.addClass( slide[ 0 ], 'on' );
        setupSlide();
      }
    }
    function setupSlide(){
      for( var j = 0; j < slide.length; j++ ){
        if( settings.effect == 'slide' ){
          if( !util.hasClass( slide[ j ], 'on' ) )
            util.addClass( slide[ j ], 'to-left-init' );
        }
        else
          util.removeClass( slide[ j ], 'to-left-init to-left to-right from-left from-right' );
      }
    }

    // updates
    function slideIn( i, direction ){
      util.removeClass( slide[ i ], 'to-left-init' );
      util.removeClass( slide[ i ], 'to-left' );
      util.removeClass( slide[ i ], 'to-right' );
      util.addClass( slide[ i ], 'on from-' + direction );
    }
    function slideOut( i, direction ){
      util.removeClass( slide[ i ], 'on' );
      util.removeClass( slide[ i ], 'from-left' );
      util.removeClass( slide[ i ], 'from-right' );
      util.addClass( slide[ i ], 'to-' + direction );
    }
    function fade( fadeIn, fadeOut ){
      for( var i = 0; i < slide.length; i++ ){
        util.removeClass( slide[ i ], 'off' );
      }
      slide[ fadeOut ].className = 'off';
      util.addClass( slide[ fadeIn ], 'on' );
      setTimeout( function(){
        util.removeClass( slide[ fadeOut ], 'off' );
      }, slideTransition );
    }
    function updateIndex( current ){
      for( var i = 0; i < index.children.length; i++ ){
        if( i === current )
          util.addClass( index.children[ i ], 'on' );
        else
          util.removeClass( index.children[ i ], 'on' );
      }

      if( settings.indexUnderline ){
        var lastJump = index.children[ slide.length - 1 ],
          pos =
            current * ( parseInt( util.getStyle( lastJump, 'width' ) ) + parseInt( util.getStyle( lastJump, 'margin-left' ) ) ) +
              parseInt( util.getStyle( index, 'padding-left' ) );
        indexUnderline.style.left = pos + 'px';
      }
    }
    function slideForward( current ){
      if( settings.effect == 'fade' )
        fade( current + 1, current );
      else{
        slideIn( current + 1, 'right' );
        slideOut( current, 'left' );
      }
      updateIndex( current + 1 );
    }
    function slideBack( current ){
      if( settings.effect == 'fade' )
        fade( current - 1, current );
      else{
        slideIn( current - 1, 'left' );
        slideOut( current, 'right' );
      }
      updateIndex( current - 1 );
    }
    function slideRestart( current ){
      if( settings.effect == 'fade' )
        fade( 0, current );
      else{
        slideIn( 0, 'right' );
        slideOut( current, 'left' );
      }
      updateIndex( 0 );
    }
    function slideLast( current ){
      if( settings.effect == 'fade' )
        fade( slide.length - 1, current );
      else{
        slideIn( slide.length - 1, 'left' );
        slideOut( current, 'right' );
      }
      updateIndex( slide.length - 1 );
    }

    // controls: directional
    function slideControl( el ){
      clearInterval( autoPlay );

      if( !animating ){
        animating = true;

        for( var i = 0; i < slide.length; i++ ){
          if( util.hasClass( slide[ i ], 'on' ) )
            var current = i;
        }

        if( typeof current !== 'undefined' ){
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
      clearInterval( autoPlay );

      if( !animating ){
        animating = true;

        for( var j = 0; j < slide.length; j++ ){
          if( util.hasClass( slide[ j ], 'on' ) )
            var current = j;
        }
        var toSlide = i;

        if( !util.hasClass( index.children[ i ], 'on' ) && typeof current !== 'undefined' ){
          if( toSlide > current ){
            if( settings.effect == 'fade' )
              fade( toSlide, current );
            else{
              slideIn( toSlide, 'right' );
              slideOut( current, 'left' );
            }
            updateIndex( toSlide );
          }
          else{
            if( settings.effect == 'fade' )
              fade( toSlide, current );
            else{
              slideIn( toSlide, 'left' );
              slideOut( current, 'right' );
            }
            updateIndex( toSlide );
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
      for( var i = 0; i < index.children.length; i++ ){
        // reset
        index.children[ i ].removeEventListener(
          'click',
          setSlideIndex
        );
        // set
        index.children[ i ].addEventListener(
          'click',
          setSlideIndex
        );
      }

    // autoplay
    var autoPlay;
    function autoPlayFn(){
      animating = true;

      for( var i = 0; i < slide.length; i++ ){
        if( util.hasClass( slide[ i ], 'on' ) )
          var current = i;
      }

      if( typeof current !== 'undefined' ){
        if( current < slide.length - 1 ) slideForward( current );
        else slideRestart( current );
      }

      setTimeout( function(){
        animating = false;
      }, slideTransition );
    }

    // loading
    function loaded(){
      if( !util.hasClass( container, 'simple-slide-show-ready' ) ){
        util.addClass( container, 'simple-slide-show-ready' );

        slideTransitionDuration = util.getStyle( slide[ 0 ], 'transition-duration' ); // !this grabs opacity transition time vs. transform transition time
        if( slideTransitionDuration )
          slideTransition =
            slideTransitionDuration.indexOf( 'ms' ) > -1 ?
              parseFloat( slideTransitionDuration ) :
                parseFloat( slideTransitionDuration ) * 1000;

        if( settings.autoplay )
          autoPlay = setInterval( autoPlayFn, speed + slideTransition );
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
    var autosizeListener;
    if( settings.autosize ){
      slideHeights();

      if( autosizeListener === undefined ){
        var delay;
        autosizeListener = function(){
          clearTimeout( delay );
          delay = setTimeout( function(){
            slideHeights();
          }, 100 );
        };
        addEventListener( 'resize', autosizeListener );
      }
    }

    // touch
    if( settings.hammerJS && typeof Hammer === 'function' && !container.getAttribute( 'data-sss-touch' ) ){
      var touch = new Hammer( container );
      touch.on( 'panright panleft', touchNav );
      container.setAttribute( 'data-sss-touch', 'true' );
    }
    function touchNav( e ){
      clearInterval( autoPlay );

      if( !animating ){
        animating = true;

        for( var i = 0; i < slide.length; i++ ){
          if( util.hasClass( slide[ i ], 'on' ) )
            var current = i;
        }

        if( typeof current !== 'undefined' ){
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
  }
}

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
if( window.jQuery )
  ( function( $ ){
    jQueryPlugin( 'simpleSlideShow', SimpleSlideShow );
  } )( jQuery );

if( typeof module === 'object' )
  module.exports = SimpleSlideShow;