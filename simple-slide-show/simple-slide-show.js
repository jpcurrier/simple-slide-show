/*! Simple Slide-Show 1.0.0 | MIT *
 * https://github.com/jpcurrier/simple-slide-show !*/
( function( $ ){
	$.fn.simpleSlideShow = function( options ){

		// default options
		var settings = $.extend({
			autoplay: true,
			controls: true,
			index: true,
			effect: 'slide',
			autosize: true
		}, options );

		return this.each( function(){
			var $container = $( this ),
				$slide = $container.children( 'ul' ).children( 'li' ),
				slideCount = $slide.length,
				animating = false,
				slideTransition = 0;
			if( $slide.css( 'transition-duration' ) )
				var slideTransition =
					( $slide.css( 'transition-duration' ).indexOf( 'ms' ) > -1 ) ?
						parseFloat( $slide.css( 'transition-duration' ) ) :
							parseFloat( $slide.css( 'transition-duration' ) ) * 1000;
			var directions =
				settings.controls ?
					'<button class="slide-control prev"><div></div></button>' +
					'<button class="slide-control next"><div></div></button>'
						: '';
			var index = '';
			if( settings.index ){
				var slideMarks = '';
				for( var i = 0; i < slideCount; i++ ){
					var firstClass =
						( i == 0 ) ?
							' class="on"' :
							'';
					slideMarks += '<li data-target="' + i + '"' + firstClass + '></li>';
				}
				index = '<ol class="slide-index">' + slideMarks + '<div class="index-underline"></div></ol>';
			}
			var speed =
				settings.autoplay === true ?
					5000 : // default
						settings.autoplay;

			$container.addClass( 'simple-slide-show' );
			if( settings.effect == 'fade' )
				$container.addClass( 'fade' );
			$container.children( 'ul' ).children( 'li:first-child' ).addClass( 'on' );
			$container.append( directions + index );

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
					fade( slideCount - 1, current );
				else{
					slideIn( slideCount - 1, 'left' );
					slideOut( current, 'right' );
				}
				updateIndex( slideCount - 1 );
			}
			function slideIn( i, direction ){
				$slide.eq( i )
					.removeClass( 'to-left to-right' )
					.addClass( 'on from-' + direction );
			}
			function slideOut( i, direction ){
				$slide.eq( i )
					.removeClass( 'on from-left from-right' )
					.addClass( 'to-' + direction );
			}
			function fade( fadeIn, fadeOut ){
				$container.children( 'ul' ).children( '.off' ).removeClass( 'off' );
				$slide.eq( fadeOut ).attr( 'class', 'off' );
				$slide.eq( fadeIn ).addClass( 'on' );
				setTimeout( function(){
					$slide.eq( fadeOut ).removeAttr( 'class' );
				}, slideTransition );
			}
			function updateIndex( current ){
				$container.find( '.slide-index > .on' ).removeClass( 'on' );
				$container.find( '.slide-index > li' ).eq( current ).addClass( 'on' );

				// move underline
				var pos = $( '.slide-index > .on' ).index() * $( '.slide-index > li:last-of-type' ).outerWidth( true ) + parseInt( $( '.slide-index' ).css( 'padding-left' ) );
				$( '.index-underline' ).css( 'left', pos );
			}

			// controls: directional
			$container.on( 'click', '.slide-control', function(){
				clearInterval( autoPlay );

				if( !animating ){
					animating = true;

					var current = $container.children( 'ul' ).children( '.on' ).index();

					if( $( this ).hasClass( 'prev' ) ){
						if( current > 0 ) slideBack( current );
						else slideLast( current );
					}

					if( $( this ).hasClass( 'next' ) ){
						if( current < slideCount - 1 ) slideForward( current );
						else slideRestart( current );
					}

					setTimeout( function(){
						animating = false;
					}, slideTransition );
				}
			});
			// controls: indexed
			$container.on( 'click', '.slide-index > li', function(){
				clearInterval( autoPlay );

				if( !animating ){
					animating = true;

					var toSlide = $( this ).index();
					var current = $container.children( 'ul' ).children( '.on' ).index();

					if( !$( this ).hasClass( 'on' ) ){
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
			});

			// autoplay
			var autoPlay;
			function autoPlayFn(){
				var current = $container.children( 'ul' ).children( '.on' ).index();

				animating = true;

				if( current < slideCount - 1 ) slideForward( current );
				else slideRestart( current );

				setTimeout( function(){
					animating = false;
				}, slideTransition );
			}

			// loading
			$( window ).on( 'load', function(){
				if( !$container.hasClass( 'simple-slide-show-ready' ) ){
					$container.addClass( 'simple-slide-show-ready' );
					if( settings.autoplay )
						autoPlay = setInterval( autoPlayFn, speed + slideTransition );
				}
			} );
			// hacky fallback if window load never resolves:
			setTimeout( function(){
				if( !$container.hasClass( 'simple-slide-show-ready' ) ){
					$container.addClass( 'simple-slide-show-ready' );
					if( settings.autoplay )
						autoPlay = setInterval( autoPlayFn, speed + slideTransition );
				}
			}, 4000 );

			if( settings.autosize ){
				function slideHeights(){
					var padding = parseInt( $slide.children( 'figure' ).css( 'padding-top' ), 10 ) + parseInt( $slide.children( 'figure' ).css( 'padding-bottom' ), 10 ),
						tallest = 0;
					$slide.each( function(){
						var h = 0;
						$( this ).children( 'figure' ).children().each( function(){
							if( $( this ).css( 'position' ) != 'absolute' && $( this ).css( 'position' ) != 'fixed' )
								h += Math.ceil( $( this ).outerHeight( true ) );
						} );
						tallest = h > tallest ? h : tallest;
					} );
					$container.css({ height: tallest + padding });
				}
				slideHeights();

				var delay;
				$( window ).on( 'resize', function(){
					clearTimeout( delay );
					delay = setTimeout( function(){
						slideHeights();
					}, 100 );
				} );
			}

			// detect: Android
			// this should eventually be replaced by something targeted to specific feature support
			var ua = navigator.userAgent.toLowerCase();
			var isAndroid = ua.indexOf( 'android' ) > -1; //&& ua.indexOf("mobile");
			if( isAndroid ){
				$( 'body' ).addClass( 'ua-android' );
			}

		});
	};
} )( jQuery );