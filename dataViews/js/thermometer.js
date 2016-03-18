
  // ============================================================================
  // THERMOMETER.
  // Requires static.js.
  // Uses prefix th_ for functions.
  // ============================================================================

  // CREATE THERMOMETER.
  // Passed parent_ can be null - do not check for it until finding out whether to add to parent.
  function th_createThermometer( parent_, thermometerID_, heat_, x_, y_, h_, w_, rCorner_, rBulb_, addTicks_ ) {
    var thermometer_;
    if ( stc_isDefined( thermometerID_ ) && stc_isNumber( heat_ ) &&
         stc_isNumber( x_ ) && stc_isNumber( y_ ) && stc_isNumber( h_ ) && stc_isNumber( w_ ) &&
         stc_isNumber( rCorner_ ) && stc_isNumber( rBulb_ ) ) {

      // Create thermometer group.
      thermometer_ = new Kinetic.Group({
        id: thermometerID_, x: x_, y: y_
      });
      if ( thermometer_ ) {
        // Create white rounded rectangle.
        var rectWhite_ = new Kinetic.Rect({
          x: 0, y: 0, height: h_, width: w_,
          fill: s_white, cornerRadius: rCorner_
        });
        if ( rectWhite_ ) { thermometer_.add( rectWhite_ ); }

        // Create white bulb.
        var bulbWhite_ = new Kinetic.Circle ({
          x: w_ * .5, y: h_ - rCorner_,
          radius: rBulb_, fill: s_white
        });
        if ( bulbWhite_ ) { thermometer_.add( bulbWhite_ ); }

        // Create bottom red wedge.
        var makeVisible_ = false;
        if ( heat_ > 0 ) { makeVisible_ = true; }
        var wedgeBottomRed_ = new Kinetic.Wedge({
          name: s_strThermometerWedgeBottom, x: w_ * .5, y: h_ - rCorner_,
          radius: rBulb_, angleDeg: 180, rotationDeg: 0,
          fill: s_red, visible: makeVisible_
        });

        // Create top red wedge.
        makeVisible_ = false;
        if ( heat_ > 1 ) { makeVisible_ = true; }
        var wedgeTopRed_ = new Kinetic.Wedge({
          name: s_strThermometerWedgeTop, x: w_ * .5, y: h_ - rCorner_,
          radius: rBulb_, angleDeg: 180, rotationDeg: 180,
          fill: s_red, visible: makeVisible_
        });

        // Create top red bulb.
        makeVisible_ = false;
        if ( heat_ > 1 ) { makeVisible_ = true; }
        var bulbRed_ = new Kinetic.Circle ({
          name: s_strThermometerBulb, x: w_ * .5, y: ( h_ - rCorner_ ) - 2,
          radius: rBulb_ + 2, fill: s_red, visible: makeVisible_
        });

        // Get thermometer dimensions.
        var objectDim_ = new Object();
        objectDim_ = th_getThermometerDimensions( heat_, h_, rCorner_, rBulb_ );

        // Create red rectangle.
        var rectRed_ = null;
        makeVisible_ = false;
        if ( heat_ > 2 ) { makeVisible_ = true; }
        if ( objectDim_ ) {
          rectRed_ = new Kinetic.Rect({
            name: s_strThermometerRect, x: 0, y: objectDim_.yRect_, height: objectDim_.hTube_, width: w_,
            fill: s_red, visible: makeVisible_
          });
        }//objectDim_ valid

        // Create red circle for hottest heats.
        makeVisible_ = false;
        if ( heat_ > ( s_heatVals.hottest_ - 1 ) ) { makeVisible_ = true; }
        var hotCircleRed_ = new Kinetic.Circle ({
          name: s_strThermometerHotCircle, x: w_ * .5, y: rCorner_,
          radius: w_ * .5, fill: s_red, visible: makeVisible_
        });

        // Add red elements to thermometer group.
        if ( wedgeBottomRed_ ) { thermometer_.add( wedgeBottomRed_ ); }
        if ( wedgeTopRed_ )    { thermometer_.add( wedgeTopRed_ ); }
        if ( rectRed_ )        { thermometer_.add( rectRed_ ); }
        if ( bulbRed_ )        { thermometer_.add( bulbRed_ ); }
        if ( hotCircleRed_ )   { thermometer_.add( hotCircleRed_ ); }

        // Add ticks.
        var ticks_ = null;
        if ( objectDim_ ) {
          if ( addTicks_ ) {
            var ticks_ = new Kinetic.Group({
              x: 0, y: 0
            });
            if ( ticks_ ) {
              var xLine0Short_ = w_ * .65;
              var xLine0Long_  = w_ * .5;
              var xLineEnd_    = w_;
              var tickExtent_  = h_ - ( rCorner_ + objectDim_.hBulb_ );
              var nbrTicks_    = s_thermometerVals.nbrTicks_;
              var yOffset_     = Math.round( tickExtent_ / nbrTicks_ );
              var yLine_       = rCorner_;
              var xLine_;
              for ( var i = 0; i < nbrTicks_; i++ ) {
                xLine_ = xLine0Short_;
                if ( i > 0 && stc_isDivisbleByFive( i ) ) { xLine_ = xLine0Long_; }
                var tick_ = new Kinetic.Line({
                  points: [xLine_, yLine_, xLineEnd_, yLine_],
                  stroke: s_gray6, strokeWidth: 1,
                  lineCap: s_lineCap, lineJoin: s_lineJoin
                });
                if ( tick_ ) {
                  ticks_.add( tick_ );
                  yLine_ = yLine_ + yOffset_;
                }//line_ valid
              }//for freq

              // Add to thermometer group.
              thermometer_.add( ticks_ );
            }//ticks_ valid
          }//addTicks_
        }//objectDim_ valid

        // Add thermometer to parent.
        if ( parent_ ) {
          parent_.add( thermometer_ );
        }//parent_ valid
      }//thermometer_ valid
    }//parameters valid

    // Return thermometer.
    return thermometer_;
  }//th_createThermometer

  // GET THERMOMETER DIMENSIONS
  function th_getThermometerDimensions( heat_, h_, rCorner_, rBulb_ ) {
    // Create object for return.
    var object_ = new Object();

    // Calculate dimensions for thermometer vertical tube (start y and height) and bulb (height).
    // Dimensions are based on passed h_, rCorner_, rBulb_.
    if ( stc_isNumber( heat_ ) && stc_isNumber( h_ ) && stc_isNumber( rCorner_ ) && stc_isNumber( rBulb_ ) ) {
	    // Init start y - corner radius of tube.
	    var yRect_ = rCorner_;

	    // Get bulb height - bulb radius plus corner radius of tube.
	    var hBulb_ = rBulb_ + rCorner_;

	    // Get full height - passed height minus bulb height and corner radius.
	    var hFull_ = ( h_ - hBulb_ ) - rCorner_;

	    // Get tick distance - full height divided by number of ticks for all thermometers.
	    // Tick distance is pixel distance between each tick along tube.
	    var tickDistance_ = Math.round( hFull_ / s_thermometerVals.nbrTicks_ );

	    // Mercury level in tube is set by passed heat.
	    // Adjust heat by subtracting out one heat level.
	    // Causes mercury in tube to rise to tick level instead of above tick.
	    var mercuryLevel_ = heat_ - 1;
	    if ( mercuryLevel_ < 0 ) { mercuryLevel_ = 0; }

	    // Get tube height - one unit of tick distance for each level in mercury level.
	    var hTube_ = mercuryLevel_ * tickDistance_;

	    // Now we can set final value for start y.
	    // Get difference between full height and tube height and add to start y.
	    yRect_ = yRect_ + ( hFull_ - hTube_ );

	    // Set properties for return object.
	    object_.yRect_ = yRect_;
	    object_.hTube_ = hTube_;
	    object_.hBulb_ = hBulb_;
    }//parameters valid

    // Return object.
    return object_;
  }//th_getThermometerDimensions

  // UPDATE THERMOMETER
  function th_updateThermometer( stage_, thermometerID_, heat_, h_, rCorner_, rBulb_ ) {
    if ( stage_ && thermometerID_ && stc_isNumber( heat_ ) && stc_isNumber( h_ ) && stc_isNumber( rCorner_ ) && stc_isNumber( rBulb_ ) ) {
      var thermometer_ = stc_getElement( thermometerID_, stage_ );
      if ( thermometer_ ) {
        // Get thermometer elements.
        var wedgeBottom_ = null; var wedgeTop_ = null; var bulb_ = null; var rect_ = null;
        var children_ = thermometer_.getChildren();
        if ( children_ ) {
          var length_ = children_.length;
          for ( var i = 0; i < length_; i++ ) {
            if ( children_[i].getName() == s_strThermometerWedgeBottom ) { wedgeBottom_ = children_[i]; }
            if ( children_[i].getName() == s_strThermometerWedgeTop )    { wedgeTop_    = children_[i]; }
            if ( children_[i].getName() == s_strThermometerBulb )        { bulb_        = children_[i]; }
            if ( children_[i].getName() == s_strThermometerRect )        { rect_        = children_[i]; }
          }//for length_
        }//children_ valid

        // Get thermometer dimensions.
        var objectDim_ = new Object();
        objectDim_ = th_getThermometerDimensions( heat_, h_, rCorner_, rBulb_ );

        // Hide all elements.
        wedgeBottom_.hide(); wedgeTop_.hide(); bulb_.hide(); rect_.hide();

        // Update elements.
        if ( objectDim_ ) {
          // Update bottom wedge.
          if ( wedgeBottom_ ) {
            if ( heat_ > 0 ) { wedgeBottom_.show(); }
          }//wedgeBottom_ valid

          // Update bottom wedge.
          if ( wedgeTop_ ) {
            if ( heat_ > 1 ) { wedgeTop_.show(); }
          }//wedgeTop_ valid

          // Update bulb.
          if ( bulb_ ) {
            if ( heat_ > 1 ) { bulb_.show(); }
          }//bulb_ valid

          // Update rectangle.
          if ( rect_ ) {
            if ( heat_ > 2 ) {
              var yRect_ = rCorner_; var hBulb_ = rBulb_ + rCorner_;
              rect_.setHeight( objectDim_.hTube_ ); rect_.setY( objectDim_.yRect_ );
              rect_.show();
            }//heat_ gt 2
          }//rect_ valid
        }//objectDim_ valid
      }//thermometer_ valid
    }//parameters valid
  }//th_updateThermometer

  // SHOW THERMOMETER.
  function th_showThermometer( id_, stage_, layer_ ) {
    if ( stc_isDefined( id_ ) && stage_ && layer_ ) {
      var thermometer_ = stc_getElement( id_, stage_ );
      if ( thermometer_ ) {
        thermometer_.show();
        layer_.draw();
      }//thermometer_ valid
    }//id_ stage_ layer_ valid
  }//th_showThermometer

  // HIDE THERMOMETER.
  function th_hideThermometer( id_, stage_, layer_ ) {
    if ( stc_isDefined( id_ ) && stage_ && layer_ ) {
      var thermometer_ = stc_getElement( id_, stage_ );
      if ( thermometer_ ) {
        thermometer_.hide();
        layer_.draw();
      }//thermometer_ valid
    }//id_ stage_ layer_ valid
  }//th_hideThermometer

