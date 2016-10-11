// slide-show
var autoPlay;

( function( $ ){
	$.fn.simpleSlideShow = function( options ){

		// default options
		var settings = $.extend({
			speed: 5000,
			controls: true,
			index: true,
			autoplay: true,
			effect: 'slide',
			autosize: true
		}, options );

		return this.each( function(){
			var $container = $( this ),
				$slide = $container.children( 'ul' ).children( 'li' ),
				slideCount = $container.children( 'ul' ).children( 'li' ).length,
				animating = false,
				slideTransition = 0;
			if( $slide.css( 'transition-duration' ) )
				var slideTransition =
					( $slide.css( 'transition-duration' ).indexOf( 'ms' ) > -1 ) ?
						parseFloat( $slide.css( 'transition-duration' ) ) :
							parseFloat( $slide.css( 'transition-duration' ) ) * 1000;
			var directions =
				settings.controls ?
					'<button type="button" class="slide-control prev"></button>' +
					'<button type="button" class="slide-control next"></button>'
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
				index = '<ol class="slide-index">' + slideMarks + '</ol>';
			}

			$container.addClass( 'simple-slide-show loading' );
			if( settings.effect == 'fade' )
				$container.addClass( 'fade' );
			$container.children( 'ul' ).children( 'li:first-child' ).addClass( 'on' );
			$container.append( '<div class="slide-controls">' + directions + '</div>' + index );

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
				$container.find( '.slide-index > li.on' ).removeClass( 'on' );
				$container.find( '.slide-index > li' ).eq( current ).addClass( 'on' );
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
			function autoPlayFn(){
				var current = $container.children( 'ul' ).children( '.on' ).index();

				if( current < slideCount - 1 ) slideForward( current );
				else slideRestart( current );
			}

			// loading
			$( window ).on( 'load', function(){
				if( $container.hasClass( 'loading' ) ){
					$container.removeClass( 'loading' );
					if( settings.autoplay )
						autoPlay = setInterval( autoPlayFn, settings.speed + slideTransition );
				}
			} );
			// hacky fallback if window load never resolves:
			setTimeout( function(){
				if( $container.hasClass( 'loading' ) ){
					$container.removeClass( 'loading' );
					if( settings.autoplay )
						autoPlay = setInterval( autoPlayFn, settings.speed + slideTransition );
				}
			}, 4000 );

			if( settings.autosize ){
				/*
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
				*/
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