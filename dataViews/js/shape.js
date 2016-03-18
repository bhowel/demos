
	// ============================================================================
	// CUSTOM SHAPES.
  // Requires static.js.
  // Uses prefix sh_ for functions.
	// ============================================================================

	// ============================================================================
	// ICONS.
	// ============================================================================

	// CREATE ICON.
	function sh_createIcon( name_, type_, component_, x_, y_, clickHandler_, mouseoverHandler_, mouseoutHandler_ ) {
	  var iconGroup_ = null;
	  if ( stc_isDefined( name_ ) && stc_isDefined( type_ ) &&
	       component_ &&
	       stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {

	    // Create icon group.
	    var iconGroup_ = new Kinetic.Group({
	      name: name_ + type_ + component_, x: x_, y: y_
	    });
	    if ( iconGroup_ ) {
		    // Create circle.
		    var radius_ = 11;
		    var circle_ = new Kinetic.Circle ({
		      x: 0, y: 0, radius: radius_,
		      fill: s_white, opacity: 0.4
		    });
		    if ( circle_ ) { iconGroup_.add( circle_ ); }

	      // Create icon graphic and name according to type.
	      var iconName_ = "";

		    // SWITCH BY TYPE.
		    switch( type_ ) {

		        // CLOSE.
		        case s_strIconClose:
				      // Set name.
				      iconName_ = "Close";

					    // Create x graphic.
					    var lineClose0_ = new Kinetic.Line({
					      points: [1.0, 1.1, 7.3, 7.3],
					      stroke: s_white, strokeWidth: 2, lineCap: s_lineCap, lineJoin: s_lineJoin
					    });
				      if ( lineClose0_ ) {
					      // Position line.
					      lineClose0_.setX( -4 ); lineClose0_.setY( -4 );

					      // Add to group.
					      iconGroup_.add( lineClose0_ );
				      }//lineClose0_ valid
					    var lineClose1_ = new Kinetic.Line({
					      points: [7.3, 1.0, 1.0, 7.3],
					      stroke: s_white, strokeWidth: 2, lineCap: s_lineCap, lineJoin: s_lineJoin
					    });
				      if ( lineClose1_ ) {
					      // Position line.
					      lineClose1_.setX( -4 ); lineClose1_.setY( -4 );

					      // Add to group.
					      iconGroup_.add( lineClose1_ );
				      }//lineClose1_ valid
		        break;
		        // CLOSE END.

		        // OPEN.
		        case s_strIconOpen:

					    // SWITCH BY COMPONENT.
					    switch( component_ ) {

					        // OPEN CHART.
					        case s_strChart:
					          // Set name.
					          iconName_ = "Open chart";

								    // Create chart line.
								    var lineChart_ = new Kinetic.Line({
								      points: [1.0, 7.8, 4.1, 1.0, 8.8, 9.2, 11.9, 3.4, 13.9, 5.8],
								      stroke: s_white, strokeWidth: 2, lineCap: s_lineCap, lineJoin: s_lineJoin
								    });
							      if ( lineChart_ ) {
								      // Position line.
								      lineChart_.setX( -7 ); lineChart_.setY( -6 );

								      // Add to group.
								      iconGroup_.add( lineChart_ );
							      }//lineChart_ valid
					        break;

					        // OPEN QUERIES.
					        case s_strQueryGroup:
					          // Set name.
					          iconName_ = "Open queries";

								    // Create stacked rectangles.
								    var stack_ = new Kinetic.Shape({
								      drawFunc: function( canvas ) {
								        var context_ = canvas.getContext();
									      context_.beginPath();
									      context_.moveTo(13.3, 10.3);
									      context_.lineTo(12.5, 9.9);
									      context_.lineTo(7.7, 12.9);
									      context_.bezierCurveTo(7.4, 13.1, 7.1, 13.2, 6.8, 13.2);
									      context_.bezierCurveTo(6.4, 13.2, 6.1, 13.1, 5.8, 12.9);
									      context_.lineTo(1.0, 9.9);
									      context_.lineTo(0.3, 10.3);
									      context_.bezierCurveTo(-0.1, 10.5, -0.1, 10.9, 0.3, 11.1);
									      context_.lineTo(6.1, 14.8);
									      context_.bezierCurveTo(6.3, 14.9, 6.5, 15.0, 6.8, 15.0);
									      context_.bezierCurveTo(7.0, 15.0, 7.2, 14.9, 7.4, 14.8);
									      context_.lineTo(13.3, 11.1);
									      context_.bezierCurveTo(13.6, 10.9, 13.6, 10.5, 13.3, 10.3);
									      context_.closePath();
									      context_.fillStyle = "rgb(255, 255, 255)";
									      context_.fill();

									      context_.beginPath();
									      context_.moveTo(13.3, 7.1);
									      context_.lineTo(12.5, 6.6);
									      context_.lineTo(7.7, 9.7);
									      context_.bezierCurveTo(7.4, 9.8, 7.1, 9.9, 6.8, 9.9);
									      context_.bezierCurveTo(6.4, 9.9, 6.1, 9.8, 5.8, 9.7);
									      context_.lineTo(1.0, 6.6);
									      context_.lineTo(0.3, 7.1);
									      context_.bezierCurveTo(-0.1, 7.3, -0.1, 7.7, 0.3, 7.9);
									      context_.lineTo(6.1, 11.6);
									      context_.bezierCurveTo(6.3, 11.7, 6.5, 11.7, 6.8, 11.7);
									      context_.bezierCurveTo(7.0, 11.7, 7.2, 11.7, 7.4, 11.6);
									      context_.lineTo(13.3, 7.9);
									      context_.bezierCurveTo(13.6, 7.7, 13.6, 7.3, 13.3, 7.1);
									      context_.closePath();
									      context_.fill();

									      context_.beginPath();
									      context_.moveTo(13.3, 3.8);
									      context_.lineTo(7.4, 0.2);
									      context_.bezierCurveTo(7.2, 0.1, 7.0, 0.0, 6.8, 0.0);
									      context_.bezierCurveTo(6.5, 0.0, 6.3, 0.1, 6.1, 0.2);
									      context_.lineTo(0.3, 3.8);
									      context_.bezierCurveTo(-0.1, 4.1, -0.1, 4.4, 0.3, 4.7);
									      context_.lineTo(6.1, 8.3);
									      context_.bezierCurveTo(6.3, 8.4, 6.5, 8.5, 6.8, 8.5);
									      context_.bezierCurveTo(7.0, 8.5, 7.2, 8.4, 7.4, 8.3);
									      context_.lineTo(13.3, 4.7);
									      context_.bezierCurveTo(13.6, 4.4, 13.6, 4.1, 13.3, 3.8);
									      context_.closePath();
									      context_.fill();
								      }
								    });
							      if ( stack_ ) {
								      // Position stack.
								      stack_.setX( -7 ); stack_.setY( -8 );

								      // Add to group.
								      iconGroup_.add( stack_ );
							      }//stack_ valid
					        break;

					        // DEFAULT.
					        default: break;

					    }//switch component_
					    // SWITCH BY COMPONENT END.

		        break;
		        // OPEN END.

		        // DEFAULT.
		        default: break;

		    }//switch type_
		    // SWITCH BY TYPE END.

		    // Create overlay to help trigger mouse down.
		    var overlay_ = new Kinetic.Circle ({
		      name: iconName_, x: 0, y: 0, radius: radius_,
		      fill: s_white, opacity: 0
		    });
		    if ( overlay_ ) { iconGroup_.add( overlay_ ); }

		    // Assign events.
		    if ( clickHandler_ && mouseoverHandler_ && mouseoutHandler_ ) {
			    iconGroup_.on( "mousedown", function( event ) {
			      clickHandler_( event );
			    });

			    iconGroup_.on( "mouseover", function( event ) {
			      mouseoverHandler_( event );
			    });

			    iconGroup_.on( "mouseout", function( event ) {
			      mouseoutHandler_( event );
			    });
		    }//parameters valid
	    }//iconGroup_ valid
	  }//parameters valid

    // Return group.
    return iconGroup_;
	}//sh_createIcon

	// TOGGLE SHOW ICON.
	// Toggle hide/show icon in element.
	// Does not draw layer - must draw in calling unction.
	function sh_toggleShowIcon( parent_, iconName_, show_ ) {
    if ( parent_ ) {
      var arrayIcons_ = parent_.get( "." + iconName_ );
      if ( arrayIcons_ && arrayIcons_.length > 0 ) {
        var icon_ = arrayIcons_[0];
		    if ( icon_ ) {
		      if ( show_ ) {
		        icon_.show();
		      } else {
		        icon_.hide();
		      }//hide
		    }//icon_ valid
      }//arrayIcons_ valid and not empty
    }//parent_ valid
	}//sh_toggleShowIcon

	// ============================================================================
	// SCHEMA WHEEL (POINTS AND ARROWS).
	// ============================================================================

	// CREATE POINT UNDERLAY.
	function sh_createPointUnderlay( id_ ) {
    var underlay_ = null;
    if ( stc_isDefined( id_ ) ) {
	    underlay_ = new Kinetic.Shape({
	      id: id_,
	      drawFunc: function( canvas ) {
	        var context_ = canvas.getContext();

		      // Ring 0.
		      context_.beginPath();
		      context_.moveTo(88.4, 50.0);
		      context_.bezierCurveTo(88.4, 71.2, 71.2, 88.4, 50.0, 88.4);
		      context_.bezierCurveTo(28.7, 88.4, 11.5, 71.2, 11.5, 50.0);
		      context_.bezierCurveTo(11.5, 28.7, 28.7, 11.5, 50.0, 11.5);
		      context_.bezierCurveTo(71.2, 11.5, 88.4, 28.7, 88.4, 50.0);
		      context_.closePath();
		      context_.fillStyle = "rgb(255, 255, 255)";
		      context_.fill();

		      // Ring 1.
		      context_.beginPath();
		      context_.moveTo(99.9, 50.0);
		      context_.bezierCurveTo(99.9, 77.6, 77.6, 99.9, 50.0, 99.9);
		      context_.bezierCurveTo(22.4, 99.9, 0.0, 77.6, 0.0, 50.0);
		      context_.bezierCurveTo(0.0, 22.4, 22.4, 0.0, 50.0, 0.0);
		      context_.bezierCurveTo(77.6, 0.0, 99.9, 22.4, 99.9, 50.0);
		      context_.closePath();
		      context_.fill();
	      }
	    });
    }//id_ valid

    // Return underlay.
    return underlay_;
	}//sh_createPointUnderlay

	// CREATE DIRECTION ARROW.
	function sh_createDirectionArrow( id_, fill_, stroke_, opacity_ ) {
    var arrow_ = null;
    if ( stc_isDefined( id_ ) && stc_isDefined( fill_ ) && stc_isDefined( stroke_ ) && stc_isDefined( opacity_ ) ) {
	    arrow_ = new Kinetic.Polygon({
	      id: id_, name: id_, points: [10, 0, 0, -2, 0, 2, 10, 0],
	      fill: fill_, stroke: stroke_, opacity: opacity_,
	      strokeWidth: 2
	    });
    }//parameters valid

    // Return arrow.
    return arrow_;
	}//sh_createDirectionArrow

