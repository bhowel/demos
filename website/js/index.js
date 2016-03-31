
	// ============================================================================
	// GLOBAL VARS.
	// ============================================================================ 

	// Scroll reveal globals.
	// Scroll reveal shows elements when user scrolls.
	var revealElementsArray = null;
	var currentWindow = null;
	
	// Scroll parallax globals.
	// Scroll parallax moves background at slower rate than foreground.
	var frameRequest = null;
	var transforms = ["transform", 
										"msTransform", 
										"webkitTransform", 
										"mozTransform", 
										"oTransform"]; 
	var transformProperty = null;
	var parallaxContainer = null;
	var isScrolling = false;
	var wheelIsScrolling = false;
	var wheelCount = 0;
	var mouseDelta = 0;

	// ============================================================================
	// UTILITY.
	// ============================================================================
	
	// GET SUPPORTED PROPERTY NAME.
	function getSupportedPropertyName( properties ) {
		for ( var i = 0; i < properties.length; i++ ) {
			if ( typeof document.body.style[properties[i]] !== "undefined" ) {
			  return properties[i];
			}//style property is defined
		}//for all properties
		
		return null;
	}//getSupportedPropertyName
	
	// ============================================================================
	// SCROLL FUNCTIONS.
	// ============================================================================

	// GET SCROLL POSITION.
	function getScrollPosition() {
		if ( document.documentElement.scrollTop === 0 ) {
		  return document.body.scrollTop;
		} else {
		  return document.documentElement.scrollTop;
		}//scrollTop not 0
	}//getScrollPosition
	
	// TRANSFORM ELEMENT Y.
	function transformElementY( element, yPosition ) {
	  var value = "translate3d( 0px" + ", " + yPosition + "px" + ", 0 )";
	  element.style[transformProperty] = value;
	}//transformElementY

	// PARALLAX LOOP. 
	function parallaxLoop() {
		// Adjust background position during scroll.
		if ( isScrolling ) {
		  transformElementY( parallaxContainer, -1 * getScrollPosition() / 2 );
		  isScrolling = false;
		}//isScrolling
	 
		// If user used mousewheel, scroll up or down by 10 pixels.
		if ( wheelIsScrolling ) {
		  window.scrollBy( 0, -mouseDelta * 10 );
		  wheelCount++;
			 
		  // Stop scrolling after 20 ticks.
		  if ( wheelCount > 20 ) {
		    wheelCount = 0;
		    wheelIsScrolling = false;
		    mouseDelta = 0;
		  }//wheelCount gt 20
		}//wheelIsScrolling
			 
		// Call animation function.
		frameRequest( parallaxLoop );
	}//parallaxLoop

	// REVEAL ON SCROLL. 		
	function revealOnScroll() {
		var windowHeight = currentWindow.height();
		var windowTop = currentWindow.scrollTop();
		var windowBottom = ( windowTop + windowHeight );

		// Go through all elements with reveal class.
		// If current element is within viewport, reveal it.
		// If not, hide it.
		$.each( revealElementsArray, function() {
			var element       = $( this );
			var elementHeight = element.outerHeight();
			var elementTop    = element.offset().top;
			var elementBottom = ( elementTop + elementHeight );

			// Reveal or hide current element.
			if ( ( elementBottom >= windowTop ) &&
					 ( elementTop <= windowBottom ) ) {
				element.addClass( "in-view" );
			} else {
				element.removeClass( "in-view" );
			}//not in view
		});
	}//revealOnScroll

	// HANDLE SCROLL EVENT.
	function handleScrollEvent() {
    // Set isScrolling global to true.
    // When isScrolling is true, parallax loop will move background. 
    isScrolling = true;
    
    // Reveal elements that are set to appear on scroll.
    revealOnScroll();
	}//handleScrollEvent

	// HANDLE MOUSE SCROLL EVENT.
	function handleMouseScrollEvent( event ) {
		wheelIsScrolling = true;
			
		// Cancel default scroll behavior.
		if ( event.preventDefault ) {
				event.preventDefault();
		}//preventDefault valid
	 
		// Calculate delta for each browser type.
		if ( event.wheelDelta ) {
				mouseDelta = event.wheelDelta / 120;
		} else if ( event.detail ) {
				mouseDelta = -event.detail / 3;
		}//detail valid
	}//handleMouseScrollEvent
												
	// ============================================================================
	// MAIN FUNCTIONS.
	// ============================================================================

	// START PAGE.
	function startPage() {
    // Set globals for scroll reveal.
    revealElementsArray = $( ".reveal-element" );
    currentWindow = $( window );
 
    // Store function for requestAnimationFrame according to browser.
    frameRequest = ( function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             function( callback ) {
               window.setTimeout( callback, 1000 / 60 );
             };
    })();

    // Set globals for scroll parallax.
    transformProperty = getSupportedPropertyName( transforms );
    parallaxContainer = document.querySelector( ".parallaxContainer" );
	 
		// Add event listeners.
		window.addEventListener( "scroll", handleScrollEvent, false );
		window.addEventListener( "resize", revealOnScroll, false );
		window.addEventListener( "mousewheel", handleMouseScrollEvent, false );
		window.addEventListener( "DOMMouseScroll", handleMouseScrollEvent, false );
	 
		// Start loop that handles scroll parallax.
		parallaxLoop();
		
		// Reveal elements that are already within viewport.
		revealOnScroll();
	}//startPage

  // =============================================================================
	// ON DOC READY.
  // ============================================================================

	$( document ).ready( function() {
    startPage();
	});// ON DOC READY




	