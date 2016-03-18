
  // ============================================================================
  // CHART.
  // Requires static.js.
  // Uses prefix ch_ for vars, chrt_ for functions.
  // ============================================================================

	// ============================================================================
	// GLOBAL VARS.
	// ============================================================================

  // Animated chart line.

  var ch_timerRunning = false;
  var ch_timer        = null;
  var ch_timerSpeed   = 40;
  var ch_timeCounter  = 0;

  var ch_layer          = null;
  var ch_chartLineGroup = null;
  var ch_statArray      = new Array();
  var ch_statLength     = 0;
  var ch_stroke         = null;

	// ============================================================================
	// FUNCTIONS.
	// ============================================================================

  // CREATE CHART.
  // Chart consists of Kinetic chart line and optional Kinetic grid appearing within html component.
  function chrt_createChart( id_, h_, w_, fontSize_, colorText_, colorGrid_, useGrid_, nbrChartSlots_, nbrYSlots_,
                        xValueIncrement_, hLabelsID_, hLabelStr_, hLabelOffset_, hOffset_, wOffset_ ) {
    var chart_ = null;

    // Create chart.
    if ( stc_isDefined( id_ ) && stc_isNumber( h_ ) && stc_isNumber( w_ ) ) {
      // Create chart group.
      var chart_ = new Kinetic.Group({
        id: id_, x: 0, y: 0, height: h_, width: w_
      });
      if ( chart_ ) {
        if ( useGrid_ ) {
          // Create grid.
          if ( stc_isDefined( fontSize_ ) && stc_isDefined( colorText_ ) && stc_isDefined( colorGrid_ ) &&
               stc_isNumber( nbrChartSlots_ ) && stc_isNumber( nbrYSlots_ ) &&
               stc_isNumber( xValueIncrement_ ) &&
               stc_isDefined( hLabelsID_ ) && stc_isDefined( hLabelStr_ ) &&
               stc_isNumber( hOffset_ ) && stc_isNumber( wOffset_ ) ) {

          chrt_createGrid( chart_, h_, w_, fontSize_, colorText_, colorGrid_, nbrChartSlots_, nbrYSlots_,
                      xValueIncrement_, hLabelsID_, hLabelStr_, hLabelOffset_, hOffset_, wOffset_ );
          }//parameters valid
        }//useGrid_ true
      }//chart_ valid
    }//parameters valid

    // Return chart.
    return chart_;
  }//chrt_createChart

  // CREATE MINI CHART.
  // Mini chart consists of Kinetic chart line (no grid) appearing within Kinetic component.
  function chrt_createMiniChart( id_, x_, y_, h_, w_, fill_ ) {
    var chart_ = null;
    if ( stc_isDefined( id_ ) &&
         stc_isNumber( x_ ) &&
         stc_isNumber( y_ ) &&
         stc_isNumber( h_ ) &&
         stc_isNumber( w_ ) ) {

      // Create chart group.
      var chart_ = new Kinetic.Group({
        id: id_, x: x_, y: y_
      });
      if ( chart_ ) {
        // Create rectangle.
        var rect_ = new Kinetic.Rect({
          name: s_strChartRect, x: 0, y: 0, height: h_, width: w_,
          fill: fill_, cornerRadius: 15, opacity: 1
        });
        if ( rect_ ) { chart_.add( rect_ ); }
      }//chart_ valid
    }//parameters valid

    // Return chart.
    return chart_;
  }//chrt_createMiniChart

  // CREATE GRID.
  // Create horizontal/vertical lines and horizontal labels.
  // Line spacing is based on chart size.
  // Horizontal labels are generated from set increment.
  // Vertical labels are based on range of stat data to display in chart, and must be set later when stats are available.
  function chrt_createGrid( chart_, h_, w_, fontSize_, colorText_, colorGrid_, nbrChartSlots_, nbrYSlots_,
                       xValueIncrement_, hLabelsID_, hLabelStr_, hLabelOffset_, hOffset_, wOffset_ ) {

    if ( chart_ &&
         stc_isNumber( h_ ) && stc_isNumber( w_ ) &&
         stc_isDefined( fontSize_ ) && stc_isDefined( colorText_ ) && stc_isDefined( colorGrid_ ) &&
         stc_isNumber( nbrChartSlots_ ) && stc_isNumber( nbrYSlots_ ) &&
         stc_isNumber( xValueIncrement_ ) &&
         stc_isDefined( hLabelsID_ ) && stc_isDefined( hLabelStr_ ) &&
         stc_isNumber( hLabelOffset_ ) &&
         stc_isNumber( hOffset_ ) && stc_isNumber( wOffset_ ) ) {

      // Create grid parameters.
      // Use x/y positions to draw horizontal and vertical lines.
      // Use x position to position horizontal labels.
      // Remove offset from actual width of chart to leave space on left for vertical labels.
      // Number of slots is number of values to show in chart.
      // Width increment is space between vertical lines. Generate from actual width of chart and number of chart slots.
      // Live width is distance in which we draw lines. Generate from actual width minus one width increment.
      // (Remove one increment, because it defines space after each value, and we don't need last line).
      // Live height is actual height minus offset from bottom to leave space for horizontal labels.
      // Height increment is space between horizontal lines. Generate from live height and number of Y slots.
      var x1_ = 0; var x2_ = 0;
      var y1_ = 0; var y2_ = 0;
      var wIncrement_ = ( w_ - wOffset_ ) / nbrChartSlots_;
      var widthLive_  = w_ - wIncrement_;
      var heightLive_ = h_ - hOffset_;
      var hIncrement_ = 0;
      if ( heightLive_ ) {
        hIncrement_ = heightLive_ / nbrYSlots_;
      }//heightLive_ valid

      // Create grid: vertical lines, horizontal lines, and horizontal labels.
      // We must wait until we have stat data before we can create vertical labels (for y values).
      // Use number of chart slots (same as number of values to show in chart) as number of vertical lines/horizontal labels.
      // (With one added for horizontal lines).
      // Use number of Y slots for horizontal lines/vertical labels.
      if ( stc_isNumber( heightLive_ ) && stc_isNumber( widthLive_ ) && stc_isNumber( wIncrement_ ) && stc_isNumber( hIncrement_ ) ) {
        // Create vertical lines (for x values).
        x1_ = wOffset_;
        y1_ = 1;  y2_ = heightLive_;
        for ( var i = 0; i < nbrChartSlots_; i++ ) {
          var lineV_ = new Kinetic.Line({
            points: [x1_, y1_, x1_, y2_],
            stroke: colorGrid_, strokeWidth: 1,
            lineCap: s_lineCap, lineJoin: s_lineJoin });
          if ( lineV_ ) { chart_.add( lineV_ ); }
          x1_ = x1_ + wIncrement_;
        }//for nbrChartSlots_

        // Create horizontal lines (for y values).
        x1_ = wOffset_; x2_ = widthLive_;
        y1_ = 1;
        for ( var j = 0; j < ( nbrYSlots_ + 1 ); j++ ) {
          var lineH_ = new Kinetic.Line({
            points: [x1_, y1_, x2_, y1_],
            stroke: colorGrid_, strokeWidth: 1,
            lineCap: s_lineCap, lineJoin: s_lineJoin });
          if ( lineH_ ) { chart_.add( lineH_ ); }
          y1_ = y1_ + hIncrement_;
        }//for nbrChartSlots_ plus 1

        // Create horizontal labels (for x values).
        // Position labels vertically by using hLabelOffset_ to move them up from bottom.
        // Store current x position in hLabel_ and use it to build label text.
        // (hLabelStr_ contains unit of measurement).
        // Use passed xValueIncrement_ to increment hLabel_, not actual pixels in horizontal position.
        // Chart x values are mapped to pixel positions.

	      // Create horizontal labels group.
	      var horizontalLabels_ = new Kinetic.Group({
	        id: hLabelsID_, x: wOffset_, y: h_ - hLabelOffset_
	      });

	      // Create labels.
	      if ( horizontalLabels_ ) {
	        x1_         = 0;
	        var hLabel_ = 0;
	        for ( var k = 0; k < nbrChartSlots_; k++ ) {
	          var label_ = new Kinetic.Text({
	            x: x1_, y: 0, fill: colorText_, text: hLabel_ + hLabelStr_,
	            fontSize: fontSize_, fontFamily: s_fontFamily, fontStyle: "bold"
	          });
	          if ( label_ ) { horizontalLabels_.add( label_ ); }
	          x1_ = x1_ + wIncrement_;
	          hLabel_ = hLabel_ + xValueIncrement_;
	        }//for nbrChartSlots_

	        // Add group to chart.
	        chart_.add( horizontalLabels_ );
	      }//horizontalLabels_ valid
      }//heightLive_ wIncrement_ hIncrement_ valid
    }//parameters valid
  }//chrt_createGrid

  // CREATE CHART LINE.
  function chrt_createChartLine( stage_, chart_, chartLineID_,
                            statArrayOriginal_, highestValue_,
                            h_, w_, colorStroke_, nbrChartSlots_, hOffset_, wOffset_,
                            showPoints_, radiusPoint_, mouseOverHandler_, mouseOutHandler_, isAnimated_, layer_ ) {

    if ( stage_ && chart_ &&
         stc_isDefined( chartLineID_ ) &&
         stc_isDefined( statArrayOriginal_ ) &&
         stc_isNumber( h_ ) && stc_isNumber( w_ ) &&
         stc_isDefined( colorStroke_ ) &&
         stc_isNumber( nbrChartSlots_ ) &&
         stc_isNumber( hOffset_ ) && stc_isNumber( wOffset_ ) &&
         stc_isNumber( radiusPoint_ ) &&
         stc_isDefined( mouseOverHandler_ ) && stc_isDefined( mouseOutHandler_ ) ) {

      // Get highest value.
      if ( !stc_isNumber( highestValue_ ) ) { highestValue_ = chrt_getHighestStatValue( statArrayOriginal_ ); }

      // If highest value valid, create chart line.
      if ( stc_isNumber( highestValue_ ) ) {
        // If chart line exists, destroy it, so we can update by creating again.
        var chartLine_;
        chartLine_ = stc_getElement( chartLineID_, stage_ );
        if ( chartLine_ ) {
          chartLine_.destroy();
        }//exists

        // Create chart line group.
        chartLine_ = new Kinetic.Group({
          id: chartLineID_, x: 0, y: 0
        });
        if ( chartLine_ ) {
          // Add to chart.
          chart_.add( chartLine_ );

          // Create raw array that combines passed stats (y coordinate) with generated distance values (x coordinate).
          var statArrayRaw_ = chrt_createChartRawArray( statArrayOriginal_, nbrChartSlots_, w_, wOffset_ );

          // If raw array valid, use it to create chart line and points.
          if ( statArrayRaw_ ) {
            // Create array for chart points.
            // We will use array to draw chart line and chart points.
            var statArray_ = chrt_createChartPointsArray( statArrayRaw_, h_, highestValue_, hOffset_ );

            // If array valid, draw line and points.
            if ( statArray_ ) {
              // Draw chart line and add to group.
              var line_ = null;
              if ( isAnimated_ ) {
                chrt_createSingleChartLineAnimated( layer_, chart_, chartLineID_ + s_strAnimated, statArray_, colorStroke_ );
              } else {
                line_ = chrt_createSingleChartLine( statArray_, colorStroke_ );
              }//isAnimated_ false
              if ( line_ ) { chartLine_.add( line_ ); }

              // Draw chart points. Called function adds to group.
              // Points can be set to show or stay hidden. In either case, they are used to trigger
              // mouseover that shows chart values.
              chrt_createChartPoints( chartLine_, statArray_, showPoints_, radiusPoint_, mouseOverHandler_, mouseOutHandler_ );
            }//statArray_ valid
          }//statArrayRaw_ valid
        }//chartLine_ valid
      }//highestValue_ valid
    }//parameters valid
  }//chrt_createChartLine

  // CREATE VERTICAL LABELS.
  function chrt_createVerticalLabels( stage_, chart_, vLabelsID_, h_, w_,
                                 fontSize_, color_, nbrYSlots_,
                                 statArrayOriginal_, highestValue_,
                                 xForVLabels_, hOffset_, useBottom_ ) {

    if ( stage_  && chart_ && stc_isDefined( vLabelsID_ ) &&
         stc_isNumber( h_ ) && stc_isNumber( w_ ) &&
         stc_isDefined( fontSize_ ) && stc_isDefined( color_ ) &&
         stc_isNumber( nbrYSlots_ ) && stc_isNumber( xForVLabels_ ) && stc_isNumber( hOffset_ ) ) {

      // Get highest value.
      if ( !stc_isNumber( highestValue_ ) ) {
        if ( statArrayOriginal_ ) {
          highestValue_ = chrt_getHighestStatValue( statArrayOriginal_ );
        }//statArrayOriginal_ valid
      }//highestValue_ not valid

      // If highest value valid, create labels.
      if ( stc_isNumber( highestValue_ ) ) {
	      // If vertical labels exist, destroy them, so we can update by creating again.
	      var verticalLabels_;
	      verticalLabels_ = stc_getElement( vLabelsID_, stage_ );
	      if ( verticalLabels_ ) {
	        verticalLabels_.destroy();
	      }//exists

	      // Create vertical labels group.
	      verticalLabels_ = new Kinetic.Group({
	        id: vLabelsID_, x: 0, y: 0
	      });
	      if ( verticalLabels_ ) {
	        // Setup parameters for creating vertical labels.
	        // Live height is actual height minus offset from bottom (offset leaves space for horizontal labels).
	        // Live height defines area in which we draw grid, chart line, and points.
	        // Each chart has customized range based on highest value in stats.
	        // Vertical and value increments increase/decrease based on highest value.
	        // Vertical increment is number of pixels used to represent each point in stat value.
	        // Value increment is used to show text that represents actual value of each y position, instead of pixel value.
	        var y_ = 0;
	        var vIncrement = 0;
	        var heightLive_ = h_ - hOffset_;
	        if ( stc_isNumber( heightLive_ ) ) {
	          y_ = heightLive_;
	          vIncrement = heightLive_ / nbrYSlots_;
	        }//heightLive_ valid
	        var valueIncrement_ = highestValue_ / nbrYSlots_;

	        // Create vertical labels (for y values).
	        // Position labels horizontally by using xForVLabels_ to move them over from left.
	        // Use vLabel_ to build label text.
	        // Use valueIncrement_ to increment vLabel_, not actual pixels in vertical position.
	        // Chart y values are mapped to pixel positions.
	        if ( stc_isNumber( heightLive_ ) && stc_isNumber( vIncrement ) && stc_isNumber( valueIncrement_ ) ) {
	          var vLabel_ = 0;
	          for ( var i = 0; i < ( nbrYSlots_ + 1 ); i++ ) {
	            var addLabel_ = true;
	            if ( i == 0 ) {
	              if ( !useBottom_ ) { addLabel_ = false; }
	            }//i is 0
	            if ( addLabel_ ) {
		            var text_  = stc_addCommas( Math.round( vLabel_ ) );
		            var label_ = new Kinetic.Text({
		              x: xForVLabels_, y: y_, fill: color_, text: text_,
		              fontSize: fontSize_, fontFamily: s_fontFamily, fontStyle: "bold"
		            });
		            if ( label_ ) { verticalLabels_.add( label_ ); }
	            }//addLabel_ true
	            y_ = y_ - vIncrement;
	            vLabel_ = vLabel_ + valueIncrement_;
	          }//for nbrYSlots_ plus 1
	          chart_.add( verticalLabels_ );
	        }//heightLive_ vIncrement valueIncrement_ valid
	      }//verticalLabels_ valid
      }//highestValue_ valid
    }//parameters valid
  }//chrt_createVerticalLabels

  // GET HIGHEST STAT VALUE.
  function chrt_getHighestStatValue( stat_ ) {
    var highestValue_ = 0;
    if ( stat_ ) {
      var length_ = stat_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( stat_[i] ) ) {
          if ( stat_[i] > highestValue_ ) {
            highestValue_ = stat_[i];
          }//entry gt highestValue_
        }//entry valid
      }//for each entry
    }//stat_ valid
    return highestValue_;
  }//chrt_getHighestStatValue

  // CREATE CHART RAW ARRAY.
  // Create array with generated x values mapped to passed y values.
  function chrt_createChartRawArray( statArrayOriginal_, nbrChartSlots_, w_, wOffset_ ) {
    // Init raw array.
    var statArrayRaw_ = new Array();

    // Create raw array.
    if ( statArrayOriginal_ &&
         stc_isNumber( nbrChartSlots_ ) &&
         stc_isNumber( w_ ) &&
         stc_isNumber( wOffset_ ) ) {

      // Setup parameters for setting x values.
      // Remove offset from actual width of chart (leaves space on left for vertical labels).
      // Number of slots is number of values to show in chart.
      // Width increment is space between vertical lines. Generate from actual width of chart and number of slots.
      var wIncrement_ = 0;
      if ( stc_isNumber( w_ ) ) {
        wIncrement_ = ( w_ - wOffset_ ) / nbrChartSlots_;
      }//w_ valid
      var object_ = null;
      var x_ = wOffset_;

      // Set length of new array to length of original stats.
      // If length of returned stats is greater than number of slots available in chart,
      // set new array's length to number of slots.
      var length_ = statArrayOriginal_.length;
      if ( length_ > nbrChartSlots_ ) {
        length_ = nbrChartSlots_;
      }//length_ gt nbrChartSlots_

      // Loop thru returned stats and create array.
      // Array consists of stats (y coordinate) with distance values (x coordinate).
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( statArrayOriginal_[i] ) ) {
          // Setup object. Set y to current value from returned stat array.
          // Set x to incremented value.
          object_ = new Object();
          object_.x = x_;
          object_.y = statArrayOriginal_[i];

          // Add object to new array.
          if ( stc_isDefined( object_ ) ) {
            if ( stc_isNumber( object_.x ) && stc_isNumber( object_.y ) ) {
              // Add object.
              statArrayRaw_.push( object_ );

              // Increment x.
              x_ = x_ + wIncrement_;
            }//x y valid
          }//object_ valid
        }//entry valid
      }//for each entry
    }//parameters valid

    // Return raw array.
    return statArrayRaw_;
  }//chrt_createChartRawArray

  // CREATE CHART POINTS ARRAY.
  // Create array of x/y values for chart line intersections/points.
  // Use generated x values. Convert passed y values into values that will work in chart.
  function chrt_createChartPointsArray( statArrayRaw_, h_, highestValue_, hOffset_ ) {
    // Init stat array.
    var statArray_ = new Array();

    // Create stat array.
    if ( statArrayRaw_ &&
         stc_isNumber( h_ ) &&
         stc_isNumber( highestValue_ ) &&
         stc_isNumber( hOffset_ ) ) {

      // Setup parameters for creating array.
      // Live height is actual height minus offset from bottom (offset leaves space for horizontal labels).
      // Live height defines area in which we draw grid, chart line, and points.
      // Each chart has customized range based on highest value in stats.
      // Vertical and value increments increase/decrease based on highest value.
      // Vertical increment is number of pixels used to represent each point in stat value.
      // Value increment is used to show text that represents actual value of each y position, instead of pixel value.
      var heightLive_ = h_ - hOffset_;
      var valueIncrement_ = 0;
      if ( stc_isNumber( heightLive_ ) ) {
        valueIncrement_ = highestValue_ / heightLive_;
      }//heightLive_ valid
      var y_ = 0;
      var object_ = new Object();

      // Loop thru raw array. Use generated x values as they are.
      // Revise y values so we can use them to draw chart line and points.
      if ( stc_isNumber( heightLive_ ) && stc_isNumber( valueIncrement_ ) ) {
        var length_ = statArrayRaw_.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( stc_isDefined( statArrayRaw_[i] ) ) {
            if ( stc_isNumber( statArrayRaw_[i].x ) && stc_isNumber( statArrayRaw_[i].y ) ) {
              // Create new object.
              object_ = new Object();

              // X is already set for chart, so use it unchanged.
              object_.x = statArrayRaw_[i].x;

              // Get y.
              y_ = statArrayRaw_[i].y;

              // Use unchanged y as name - will appear in tooltip and show actual value of stat.
              object_.name_ = y_;

              // Revise y to work in chart.
              y_ = y_ / valueIncrement_;
              y_ = heightLive_ - y_;

              // Change upper and lower values so they stay in chart.
              if ( y_ < 8 ) { y_ = 8; }
              if ( y_ > heightLive_ ) { y_ = heightLive_; }

              // Add object to new array.
              object_.y = y_;
              statArray_.push( object_ );
            }//x y valid
          }//entry valid
        }//for each entry
      }//heightLive_ valueIncrement_ valid
    }//parameters valid

    // Return new array.
    return statArray_;
  }//chrt_createChartPointsArray

  // CREATE SINGLE CHART LINE.
  function chrt_createSingleChartLine( statArray_, stroke_ ) {
    var line_ = null;
    if ( statArray_ && stc_isDefined( stroke_ ) ) {
      line_ = new Kinetic.Line({
        points: statArray_,
        stroke: stroke_, strokeWidth: 3, lineCap: s_lineCap, lineJoin: s_lineJoin
      });
    }//parameters valid
    return line_;
  }//chrt_createSingleChartLine

  // CREATE CHART POINTS.
  function chrt_createChartPoints( chartLine_, statArray_, showPoints_, radiusPoint_, mouseOverHandler_, mouseOutHandler_ ) {
    if ( chartLine_ && stc_isDefined( statArray_ ) &&
         stc_isNumber( radiusPoint_ ) &&
         stc_isDefined( mouseOverHandler_ ) && stc_isDefined( mouseOutHandler_ ) ) {

      // Loop thru passed array and create point in chart for each x/y position.
      var length_ = statArray_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( statArray_[i] ) ) {
          if ( stc_isDefined( statArray_[i].x ) && stc_isDefined( statArray_[i].y ) && stc_isDefined( statArray_[i].name_ ) ) {
            var opacity_ = 0; if ( showPoints_ ) { opacity_ = 1; }
            var name_    = stc_addCommas( statArray_[i].name_ );
            var point_   = new Kinetic.Circle ({
              name: name_, x: statArray_[i].x, y: statArray_[i].y,
              radius: radiusPoint_, fill: s_white, opacity: opacity_
            });
            if ( point_ ) {
              // Add to group.
              chartLine_.add( point_ );

              // Assign events.
              point_.on( "mouseover", function( event ) {
                mouseOverHandler_( event );
              });
              point_.on( "mouseout", function( event ) {
                mouseOutHandler_( event );
              });
            }//point_ valid
          }//x y valid
        }//entry valid
      }//for each entry
    }//parameters valid
  }//chrt_createChartPoints

  // UPDATE HORIZONTAL LABELS.
  // For time increment type, start value must be a valid date.
  // For number increment value, start value must be a valid number.
  function chrt_updateHorizontalLabels( stage_, horizontalLabelsID_, incrementType_, increment_, startValue_ ) {
    if ( stage_ &&
         stc_isDefined( horizontalLabelsID_ ) &&
         stc_isDefined( incrementType_ ) &&
         stc_isDefined( increment_ ) &&
         stc_isDefined( startValue_ ) ) {

      var horizontalLabels_ = stc_getElement( horizontalLabelsID_, stage_ );
      if ( horizontalLabels_ ) {
        var array_ = horizontalLabels_.getChildren();
        if ( array_ ) {
          var length_ = array_.length;
          var label_  = null;
          for ( var i = 0; i < length_; i++ ) {
            label_ = array_[i];
            if ( label_ ) {
				      switch( incrementType_ ) {

				          case s_svcVals.incrementTime_:
										var mills_    = startValue_.getTime();
										var date_     = new Date( mills_ + increment_ );
										var time_     = date_.getTime();
										var timeText_ = stc_getTimeText( date_, false );
				            label_.setText( timeText_ );
				            startValue_ = new Date( time_ );
				          break;

				          case s_svcVals.incrementNumber_:
				            label_.setText( startValue_ + increment_ );
				            startValue_ = startValue_ + increment_;
				          break;

				          default: break;
				      }//switch incrementType_
            }//label_ valid
          }//for each entry
        }//array_ valid
      }//horizontalLabels_ valid
    }//parameters valid
  }//chrt_updateHorizontalLabels

  // SHOW CHART.
  function chrt_showChart( chartContainerMain_, chartContainer_, titleChart_, iconsChart_ ) {
    // Set position.
    if ( stc_isDefined( chartContainerMain_ ) ) {
	    if ( chartContainerMain_.position().top == 0 && chartContainerMain_.position().left == 0 ) {
	      var x_ = Math.floor( window.innerWidth/3 );
	      var y_ = Math.floor( window.innerHeight/3 );
	      chartContainerMain_.css( "top", y_ );
	      chartContainerMain_.css( "left", x_ );
	    }//position is 0

	    // Show chart.
	    chartContainerMain_.css( "visibility", "visible" );
	    if ( stc_isDefined( chartContainer_ ) ) { chartContainer_.css( "visibility", "visible" ); }
	    if ( stc_isDefined( titleChart_ ) )     { titleChart_.css( "visibility", "visible" ); }
	    if ( stc_isDefined( iconsChart_ ) )     { iconsChart_.css( "visibility", "visible" ); }
    }//chartContainerMain_ valid
  }//chrt_showChart

  // CLEAR CHART.
  function chrt_clearChart( stage_, layer_, arrayChartLine_, hLabelsID_, vLabelsID0_, vLabelsID1_, titleChart_ ) {

    // Init chart title.
    if ( titleChart_ ) { titleChart_.html( s_message.noDataSelected_ ); }

    // Remove chart line(s) and vertical labels.
    if ( stage_ && layer_ ) {

      // Remove chart line(s).
      var chartLineID_ = "";
      var chartLine_   = null;
      if ( stc_isDefined( arrayChartLine_ ) ) {
        var length_ = arrayChartLine_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Normal line.
          chartLineID_ = arrayChartLine_[i];
          if ( stc_isDefined( chartLineID_ ) ) {
	          chartLine_ = stc_getElement( chartLineID_, stage_ );
	          if ( chartLine_ ) { chartLine_.destroy(); }
          }//chartLineID_ valid
        }//for length
      }//arrayChartLine_ valid

      // Clear horizontal labels.
      var horizontalLabels_ = null;
      if ( stc_isDefined( hLabelsID_ ) ) {
	      horizontalLabels_ = stc_getElement( hLabelsID_, stage_ );
	      if ( horizontalLabels_ ) {
	        var array_ = horizontalLabels_.getChildren();
	        if ( array_ ) {
	          var length_ = array_.length;
	          var label_  = null;
	          for ( var i = 0; i < length_; i++ ) {
	            label_ = array_[i];
	            if ( label_ ) {
					      label_.setText( "" );
	            }//label_ valid
	          }//for each entry
	        }//array_ valid
	      }//horizontalLabels_ valid
      }//hLabelsID_ valid

      // Remove vertical labels.
      var verticalLabels_ = null;

      if ( stc_isDefined( vLabelsID0_ ) ) {
	      verticalLabels_ = stc_getElement( vLabelsID0_, stage_ );
	      if ( verticalLabels_ ) { verticalLabels_.destroy(); }
      }//vLabelsID0_ valid

      if ( stc_isDefined( vLabelsID1_ ) ) {
	      verticalLabels_ = stc_getElement( vLabelsID1_, stage_ );
	      if ( verticalLabels_ ) { verticalLabels_.destroy(); }
      }//vLabelsID1_ valid

      // Draw layer.
      layer_.draw();
    }//stage_ layer_ valid
  }//chrt_clearChart

  // HIDE CHART.
  function chrt_hideChart( chartContainerMain_, chartContainer_, titleChart_, iconsChart_ ) {
    if ( stc_isDefined( chartContainerMain_ ) ) { chartContainerMain_.css( "visibility", "hidden" ); }
    if ( stc_isDefined( chartContainer_ ) )     { chartContainer_.css( "visibility", "hidden" ); }
    if ( stc_isDefined( titleChart_ ) )         { titleChart_.css( "visibility", "hidden" ); }
    if ( stc_isDefined( iconsChart_ ) )         { iconsChart_.css( "visibility", "hidden" ); }
  }//chrt_hideChart

  // SET CHART FILL.
  function chrt_setChartFill( chartContainerMain_, fill_ ) {
    if ( stc_isDefined( chartContainerMain_ ) && stc_isDefined( fill_ ) ) {
      chartContainerMain_.css( "background-color", fill_ );
    }//chartContainerMain_ fill_ valid
  }//chrt_setChartFill

  // SHOW MINI CHART.
  function chrt_showMiniChart( chartID_, stage_, layer_ ) {
    if ( stc_isDefined( chartID_ ) && stage_ && layer_ ) {
      var chart_ = stc_getElement( chartID_, stage_ );
      if ( chart_ ) {
        chart_.show();
        layer_.draw();
      }//chart_ valid
    }//chartID_ stage_ layer_ valid
  }//chrt_showMiniChart

  // CLEAR MINI CHART.
  function chrt_clearMiniChart( id_, stage_, layer_ ) {
    if ( stc_isDefined( id_ ) && stage_ && layer_ ) {
      var chartLine_ = stc_getElement( id_, stage_ );
      if ( chartLine_ ) {
        chartLine_.destroy();
        layer_.draw();
      }//chartLine_ valid
    }//id_ stage_ layer_ valid
  }//chrt_clearMiniChart

  // HIDE MINI CHART.
  function chrt_hideMiniChart( chartID_, chartLineID_, stage_, layer_ ) {
    if ( stc_isDefined( chartID_ ) && stc_isDefined( chartLineID_ ) && stage_ && layer_ ) {
      // Clear chart.
      chrt_clearMiniChart( chartLineID_, stage_, layer_ );

      // Hide chart.
      var chart_ = stc_getElement( chartID_, stage_ );
      if ( chart_ ) {
        chart_.hide();
        layer_.draw();
      }//chart_ valid
    }//chartID_ chartLineID_ stage_ layer_ valid
  }//chrt_hideMiniChart

  // SET MINI CHART FILL.
  function chrt_setMiniChartFill( chart_, fill_ ) {
    if ( stc_isDefined( chart_ ) && stc_isDefined( fill_ ) ) {
      var rect_ = null;
      var children_ = chart_.getChildren();
      if ( children_ ) {
        var length_ = children_.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( children_[i].getName() == s_strChartRect ) { rect_ = children_[i]; }
        }//for length
      }//children_ valid
      if ( rect_ ) { rect_.setFill( fill_ ); }
    }//chart_ fill_ valid
  }//chrt_setMiniChartFill

  // CREATE LEGEND.
  function chrt_createLegend( chart_, legendID_, x_, y_, h_, w_, colorText_, colorStroke_, arrayLegend_ ) {
    if ( stc_isDefined( chart_ ) &&
         stc_isDefined( legendID_ ) &&
         stc_isNumber( x_ ) && stc_isNumber( y_ ) &&
         stc_isNumber( h_ ) && stc_isNumber( w_ ) &&
         stc_isDefined( colorText_ ) &&
         stc_isDefined( colorStroke_ ) &&
         stc_isDefined( arrayLegend_ ) ) {

      // Create legend group.
      var legend_ = new Kinetic.Group({
        id: legendID_, x: x_, y: y_, h: h_, w: w_
      });
      if ( legend_ ) {

        // Create rectangle.
        var rect_ = new Kinetic.Rect({
          x: 0, y: 0, height: h_, width: w_,
          fill: s_white, stroke: colorStroke_, strokeWidth: 1
        });
        if ( rect_ ) { legend_.add( rect_ ); }

        // Set up vars for labels.
        var xLabel_ = 5; var yLabel_ = 5;

        // Create labels.
        var length_ = arrayLegend_.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( stc_isDefined( arrayLegend_[i] ) ) {
		        if ( stc_isDefined( arrayLegend_[i].fill_ ) && stc_isDefined( arrayLegend_[i].text_ ) ) {
			        chrt_createLegendLabel( legend_, colorText_, arrayLegend_[i].fill_, arrayLegend_[i].text_, xLabel_, yLabel_ );
				      yLabel_ = yLabel_ + 15;
		        }//fill text valid
          }//entry valid
        }//for length

        // Add to chart.
        chart_.add( legend_ );
      }//legend_ valid
    }//parameters valid
  }//chrt_createLegend

  // CREATE LEGEND LABEL.
  function chrt_createLegendLabel( legend_, colorText_, fill_, text_, x_, y_ ) {
    var textNormalized_ = ""; var textLegend_ = "";
    if ( legend_ && stc_isDefined( colorText_ ) &&
         stc_isDefined( fill_ ) && stc_isDefined( text_ ) ) {

      // Set text.
      textNormalized_ = stc_normalizeText( text_, s_charLimit.legend_ );
      textLegend_     = stc_addEllipsis( text_, textNormalized_, s_charLimit.legend_ );

      // Create text.
      var label_ = new Kinetic.Text({
        x: x_ + 15, y: y_, fill: colorText_,
        fontSize: "12", fontFamily: s_fontFamily,
        text: textLegend_
      });
      if ( label_ ) { legend_.add( label_ ); }

      // Create box.
      var box_ = new Kinetic.Rect({ x: x_, y: y_, height: 10, width: 10, fill: fill_ });
      if ( box_ ) { legend_.add( box_ ); }
    }//parameters valid
  }//chrt_createLegendLabel

  // CLEAR LEGEND.
  function chrt_clearLegend( stage_, layer_, legendID_ ) {
    if ( stage_ && layer_ && stc_isDefined( legendID_ ) ) {
      var legend_ = stc_getElement( legendID_, stage_ );
      if ( legend_ ) { legend_.destroy(); }
      layer_.draw();
    }//parameters valid
  }//chrt_clearLegend

  // ============================================================================
  // ANIMATED CHART LINE.
  // ============================================================================

  // CREATE SINGLE CHART LINE ANIMATED.
  function chrt_createSingleChartLineAnimated( layer_, chart_, chartLineAnimatedID_, statArray_, stroke_ ) {
    if ( stc_isDefined( layer_ ) &&
         stc_isDefined( chart_ ) &&
         stc_isDefined( chartLineAnimatedID_ ) &&
         stc_isDefined( statArray_ ) &&
         stc_isDefined( stroke_ ) ) {

      // Set chart vars.
      ch_layer      = layer_;
      ch_statArray  = statArray_;
      ch_statLength = statArray_.length;
      ch_stroke     = stroke_;

      // Create temporary chart line group.
      // We will destroy it when the animation stops.
      ch_chartLineGroup = new Kinetic.Group({
        id: chartLineAnimatedID_, x: 0, y: 0
      });

      // If group valid, add to chart and animate.
      if ( ch_chartLineGroup ) {
        // Add to group.
        chart_.add( ch_chartLineGroup );

        // Start timer.
        chrt_startChartTimer();
      }//ch_chartLineGroup valid
    }//params valid
  }//chrt_createSingleChartLineAnimated

  // START CHART TIMER.
  function chrt_startChartTimer() {
    if ( !ch_timerRunning ) {
      // Set run flag.
      ch_timerRunning = true;

	    // Init counter.
	    ch_timeCounter = 0;

      // Run timer.
      chrt_runChartTimer();
    }//ch_timerRunning false
  }//chrt_startChartTimer

  // STOP CHART TIMER.
  function chrt_stopChartTimer() {
    // Stop timer.
    clearTimeout( ch_timer );

    // Init counter.
    ch_timeCounter = 0;

    // Null chart vars.
    ch_layer = null;

    // Destroy chart line group (and all its lines).
    if ( ch_chartLineGroup ) { ch_chartLineGroup.destroy(); }

    // Set run flag.
    ch_timerRunning = false;
  }//chrt_stopChartTimer

  // RUN CHART TIMER.
  function chrt_runChartTimer() {
    // Perform timed functions.
    if ( ch_timeCounter < ( ch_statLength - 1 ) ) {
      // Draw one line segment.
	    var x0_ = ch_statArray[ ch_timeCounter ]; var x1_ = ch_statArray[ ch_timeCounter + 1 ];
	    var line_ = null;
	    line_ = new Kinetic.Line({
	      points: [x0_, x1_],
	      stroke: ch_stroke, strokeWidth: 3, lineCap: s_lineCap, lineJoin: s_lineJoin
	    });
      if ( line_ ) { ch_chartLineGroup.add( line_ ); }
      ch_layer.draw();

      // Increment counter.
      ch_timeCounter++;

	    // Set recursive timer for specified seconds.
	    ch_timer = setTimeout( "chrt_runChartTimer()", ch_timerSpeed );
    }  else {
      chrt_stopChartTimer();
    }//ch_timeCounter lt ch_statLength minus 1
  }//chrt_runChartTimer










