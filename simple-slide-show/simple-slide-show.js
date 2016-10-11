// detect: Android
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf( 'android' ) > -1; //&& ua.indexOf("mobile");
if( isAndroid ){
	$( 'body' ).addClass( 'android' );
}

// slide-show
var autoPlay;

function slideHeights(){
	$( '.testimonials' ).each( function(){
		var padding = parseInt( $( this ).css( 'padding-top' ), 10 ) + parseInt( $( this ).css( 'padding-bottom' ), 10 );

		var tallest = 0;
		$( this ).find( '.simple-slide-show > ul > li > figure > div > div > div' ).each( function(){
			var h = $( this ).outerHeight( true );
			if( h > tallest )
				tallest = h;
		});
		$( this ).css({ 'height': tallest + padding });
	} );
}
slideHeights();

( function( $ ){
	$.fn.simple-slide-show > ulhow = function( options ){

		// default options
		var settings = $.extend({
			speed: 5000,
			controls: true,
			index: true,
			autoplay: true,
			effect: 'slide'
		}, options );

		return this.each( function(){
			var container = $( this );
			var slide = container.find( '.simple-slide-show > ul > li' );
			var slideCount = container.find( '.simple-slide-show > ul > li' ).length;
			if( slide.css( 'transition-duration' ) ){
				var slideTransition =
					( slide.css( 'transition-duration' ).indexOf( 'ms' ) > -1 ) ?
						parseFloat( slide.css( 'transition-duration' ) ) :
							parseFloat( slide.css( 'transition-duration' ) ) * 1000;
			}
			else
				var slideTransition = 0;
			var directions = settings.controls ?
				'<button type="button" class="slide-control prev"></button>' +
				'<button type="button" class="slide-control next"></button>'
				: '';
			if( settings.index ){
				var slideMarks = '';
				for( var i = 0; i < slideCount; i++ ){
					var firstClass =
						( i == 0 ) ?
							' class="on"' :
							'';
					slideMarks += '<li data-target="' + i + '"' + firstClass + '></li>';
				}
				var index = '<ol class="slide-index">' + slideMarks + '</ol>';
			}
			else
				var index = '';
			var animating = false;

			container.addClass( 'slide-show loading' );
			if( settings.effect == 'fade' )
				container.addClass( 'fade' );
			container.find( '.simple-slide-show > ul > li:first-child' ).addClass( 'on' );
			container.append( '<div class="slide-controls">' + directions + '</div>' + index );

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
				slide.eq( i )
					.removeClass( 'to-left to-right' )
					.addClass( 'on from-' + direction );
			}
			function slideOut( i, direction ){
				slide.eq( i )
					.removeClass( 'on from-left from-right' )
					.addClass( 'to-' + direction );
			}
			function fade( fadeIn, fadeOut ){
				container.find( '.simple-slide-show > ul > .off' ).removeClass( 'off' );
				slide.eq( fadeOut ).attr( 'class', 'off' );
				slide.eq( fadeIn ).addClass( 'on' );
				setTimeout( function(){
					slide.eq( fadeOut ).removeAttr( 'class' );
				}, slideTransition );
			}
			function updateIndex( current ){
				container.find( '.slide-index > li.on' ).removeClass( 'on' );
				container.find( '.slide-index > li' ).eq( current ).addClass( 'on' );
			}

			// controls: directional
			container.on( 'click', '.slide-control', function(){
				clearInterval( autoPlay );

				if( !animating ){
					animating = true;

					var current = container.find( '.simple-slide-show > ul > li.on' ).index();

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
			container.on( 'click', '.slide-index > li', function(){
				clearInterval( autoPlay );

				if( !animating ){
					animating = true;

					var toSlide = $( this ).index();
					var current = container.find( '.simple-slide-show > ul > li.on' ).index();

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

			// touch events
			if( !container.parent().hasClass( 'shirt-showcase' ) ){
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
			}

			// autoplay
			function autoPlayFn(){
				var current = container.find( '.simple-slide-show > ul > li.on' ).index();

				if( current < slideCount - 1 ) slideForward( current );
				else slideRestart( current );
			}

			// loading
			$( window ).on( 'load', function(){
				if( container.hasClass( 'loading' ) ){
					container.removeClass( 'loading' );
					if( settings.autoplay )
						autoPlay = setInterval( autoPlayFn, settings.speed + slideTransition );
				}
			} );
			// hacky fallback if window load never resolves:
			setTimeout( function(){
				if( container.hasClass( 'loading' ) ){
					container.removeClass( 'loading' );
					if( settings.autoplay )
						autoPlay = setInterval( autoPlayFn, settings.speed + slideTransition );
				}
			}, 4000 );

		});
	};
} )( jQuery );