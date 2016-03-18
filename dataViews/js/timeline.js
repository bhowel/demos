
	// ============================================================================
	// TIMELINE.
	// Use only in conjunction with index.js.
	// Requires static.js.
	// Uses only minimal data validation: assumes all global numbers and interim date values are valid.
  // Uses prefix g_ for vars, tl_ for functions.
  // Does not use unique prefix for vars, because file is used only in index.js, which has its own var prefix.
  // If file is ever used in another page, it is recommended that the vars get a unique prefix.
	// ============================================================================

	// ============================================================================
	// GLOBAL VARS.
	// ============================================================================

	// Time vars.
	var g_dayNames       = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
	var g_timeArray      = [];
	var g_daysPast       = 6;
	var g_strHoursLast12 = "LAST 12 HOURS";
	var g_strHoursLast8  = "LAST 8 HOURS";
	var g_strHoursLast3  = "LAST 3 HOURS";
	var g_strMinLast50   = "LAST 50 MINUTES";
	var g_strMinLast10   = "LAST 10 MINUTES";

	// Basic milliseconds.
	var g_millsOffset  = 0;
	var g_millsPerMin  = 60000;
	var g_millsPerDay  = ( 24 * 60 * g_millsPerMin );
	var g_millsPerHour = ( 60 * g_millsPerMin );

  // Milliseconds for time sections.
  var g_mills12h  = 12 * 60 * g_millsPerMin;
  var g_mills8h   = 8 * 60 * g_millsPerMin;
  var g_mills3h   = 3 * 60 * g_millsPerMin;
  var g_mills50m  = 50 * g_millsPerMin;
  var g_mills10m  = 10 * g_millsPerMin;
  // Milliseconds for time sections - accumulative.
  var g_mills0 = 0;
  var g_mills1 = g_mills12h;
  var g_mills2 = g_mills12h + g_mills8h;
  var g_mills3 = g_mills12h + g_mills8h + g_mills3h;
  var g_mills4 = g_mills12h + g_mills8h + g_mills3h + g_mills50m;
  var g_mills5 = g_mills12h + g_mills8h + g_mills3h + g_mills50m + g_mills10m;

  // Drag vars.
	var g_dragDate = new Date();

	// Stage/layer vars.
	var g_stageTimeline = null;
	var g_layerTimeline = null;
	var g_hStage = 46;
	var g_wStage = 1431;

	// Graphics vars.
	var g_lineColor       = s_color.blueDark_;
	var g_lineColorAnchor = s_white;
	var g_lineColorPast   = s_color.greenDark_;

	var g_wLine          = 1;
	var g_yLineMainPast  = 10;
	var g_yLineMinorPast = 18;
	var g_yLineAnchor    = 0;
	var g_yLineMain      = 16;
	var g_yLineMinor     = 20;
	var g_yLineEnd       = 44;

	var g_yRect = 26;
	var g_hRect = 19;

	var g_labelColorPast     = s_color.greenDark_;
	var g_textColorYesterday = s_color.greenDark_;
	var g_textColorCurrent   = s_color.blueDark_;

	var g_yLabelRect = 33;
	var g_yLabelText = 35;
	var g_hLabelRect = 12;
	var g_hLabelText = 10;
	var g_wLabel     = 50;

	// Distance vars.
	var g_wDay  = 96;
	var g_px24h = 4;  var g_freq24h = 24;
	var g_px12h = 7;  var g_freq12h = 12; var g_millsPx12h = g_mills12h / ( g_px12h * g_freq12h );
	var g_px8h  = 9;  var g_freq8h  = 16; var g_millsPx8h  = g_mills8h  / ( g_px8h  * g_freq8h );
	var g_px3h  = 31; var g_freq3h  = 6;	var g_millsPx3h  = g_mills3h  / ( g_px3h  * g_freq3h );
	var g_px50m = 20; var g_freq50m = 10; var g_millsPx50m = g_mills50m / ( g_px50m * g_freq50m );
	var g_px10m = 4;  var g_freq10m = 60; var g_millsPx10m = g_mills10m / ( g_px10m * g_freq10m );

  var g_px1 = ( g_px12h * g_freq12h );
  var g_px2 = ( g_px12h * g_freq12h ) + ( g_px8h  * g_freq8h );
  var g_px3 = ( g_px12h * g_freq12h ) + ( g_px8h  * g_freq8h ) + ( g_px3h  * g_freq3h );
  var g_px4 = ( g_px12h * g_freq12h ) + ( g_px8h  * g_freq8h ) + ( g_px3h  * g_freq3h ) + ( g_px50m * g_freq50m );
  var g_px5 = ( g_px12h * g_freq12h ) + ( g_px8h  * g_freq8h ) + ( g_px3h  * g_freq3h ) + ( g_px50m * g_freq50m ) + ( g_px10m * g_freq10m );

	// Animation vars.
	var g_clockRunning = false;
	var g_clockTimer;
	var g_hairlinePositionInitial = 1425;

	// ============================================================================
	// TIME.
	// ============================================================================

	// SET GLOBAL TIME.
	function tl_setGlobalTime() {
		// Get current date/time.
		var currentDate_ = new Date();

	  // Create time object with properties.
	  var objectTime_ = new Object();
	  if ( currentDate_ ) {
	    objectTime_ = tl_setGlobalTimeProperties( currentDate_ );
	  }//currentDate_ valid

	  // Return time object.
	  return objectTime_;
	}//tl_setGlobalTime

	// SET GLOBAL TIME OFFSET.
	function tl_setGlobalTimeOffset() {
		// Get current date/time.
		var currentDate_ = new Date();

	  // Create time object with properties - either current time or offset time.
	  var objectTime_ = new Object();
	  if ( currentDate_ ) {
			// If there is any global date/time offset (set by user when he drags hairline), use it to offset current date/time.
			if ( g_millsOffset > 0 ) {
				var newDate_      = new Date();
				var millsCurrent_ = newDate_.getTime();
				currentDate_      = new Date( millsCurrent_ - g_millsOffset );
			}//g_millsOffset gt 0

		  // Create time object with properties.
		  objectTime_ = tl_setGlobalTimeProperties( currentDate_ );
	  }//currentDate_ valid

	  // Return time object.
	  return objectTime_;
	}//tl_setGlobalTimeOffset

	// SET GLOBAL TIME PROPERTIES.
	function tl_setGlobalTimeProperties( currentDate_ ) {
	  var objectTime_  = new Object();
	  if ( currentDate_ ) {
	    // Get amount of time in milliseconds for today and yesterday.
	    var timeDaybreak_   = new Date( currentDate_.getFullYear(), currentDate_.getMonth(), currentDate_.getDate(), 0,0,0 );
	    var millsToday_     = currentDate_.getTime() - timeDaybreak_.getTime();
	    var millsYesterday_ = g_millsPerDay - millsToday_;

		  // Set properties.
		  objectTime_.date_           = currentDate_;
		  objectTime_.millsToday_     = millsToday_;
		  objectTime_.millsYesterday_ = millsYesterday_;
		  objectTime_.hours_          = currentDate_.getHours();
		  objectTime_.hoursYesterday_ = 24 - currentDate_.getHours();
		  objectTime_.minutes_        = currentDate_.getMinutes();
		  objectTime_.seconds_        = currentDate_.getSeconds();
	  }//currentDate_ valid
	  return objectTime_;
	}//tl_setGlobalTimeProperties

	// ============================================================================
	// DRAG.
	// ============================================================================

	// START DRAG TIME.
	function tl_startDragTime( ui_ ) {
		// Set/get global time to current and store it as stable point from which to offset time during drag.
		var objectTime_ = tl_setGlobalTime();
		if ( objectTime_ ) { g_dragDate = objectTime_.date_; }

		// Stop clock.
		tl_stopClock();

		// Reset clock to current time.
		tl_resetClock();
	}//tl_startDragTime

	// DRAG TIME.
	function tl_dragTime( ui_ ) {
		if ( ui_ ) {
			tl_setDraggedTime( ui_.position.left );
		}//ui_ valid
	}//tl_dragTime

	// SET DRAGGED TIME.
	function tl_setDraggedTime( position_ ) {
		// Get user's current drag position. Use it to offset stored time. Use offset to update global time and show it.
		if ( position_ ) {
	    // Calculate offset per current position, against time stored at start of drag.
	    // To get offset, use time array created when setting up/advancing timeline.
	    // Time array stores how much time to offset for each position on timeline.
			var millsCurrent_ = g_dragDate.getTime();
			g_millsOffset     = g_timeArray[position_] * 1000;

      // Set/get global time. Function will use global offset we just set.
      var objectTime_ = tl_setGlobalTimeOffset();

			// Display offset date and time.
			var newDate_ = new Date( millsCurrent_ - g_millsOffset );
	    if ( objectTime_ && newDate_ ) {
			  $( "#_dateDigital" ).html( tl_getDateLabelByDate( objectTime_.date_ ) );
			  $( "#_clockDigital" ).html( tl_setTimeText( objectTime_.hours_, objectTime_.minutes_, objectTime_.seconds_ ) );
	    }//objectTime_ newDate_ valid
		}//position_ valid
	}//tl_setDraggedTime

	// END DRAG TIME.
	function tl_endDragTime( ui_ ) {
		if ( ui_ ) {
			// Set/get global time. Function will use global offset set in drag.
	    var objectTime_ = tl_setGlobalTimeOffset();

	    // COMMENTED OUT Testing. Advance timeline to match global time.
	    // Left here in case we want to change timeline when user sets new point in time for application.
	    // This can also be used to test tl_advanceTimeline, which can only be seen when normal time needs to update timeline.
	    // In testing, if you drag hairline to past and start clock again, timeline will return to current time condition,
	    // because start clock restores current time.
	    // You can also use this to test reset clock, to see if it advances timeline back to current.
	    //if ( objectTime_ ) { tl_advanceTimeline( objectTime_ ); }
		}//ui_ valid
	}//tl_endDragTime

	// ============================================================================
	// TIMELINE.
	// ============================================================================

	// INIT TIMELINE.
	function tl_initTimeline() {
		// Set and get global time.
		var objectTime_ = tl_setGlobalTime();

		// Create contents.
		if ( objectTime_ ) {
	    // Create stage.
	    g_stageTimeline = new Kinetic.Stage({ container: "_timeline", height: g_hStage, width: g_wStage });

	    // Create layer.
	    g_layerTimeline = new Kinetic.Layer();

		  // Add layer to stage, then create elements.
		  if ( g_stageTimeline && g_layerTimeline ) {
		    // Add layer to stage.
		    g_stageTimeline.add( g_layerTimeline );

		    // Create timeline.
	      tl_createTimeline( objectTime_ );

	      // Set time array, which keeps track of time offset for each point on timeline.
	      tl_setTimeArray( objectTime_ );

	      // Draw layer.
	      g_layerTimeline.draw();
		  }//g_stageTimeline g_layerTimeline valid
		}//objectTime_ valid
	}//tl_initTimeline

	// CREATE TIMELINE.
	function tl_createTimeline( objectTime_ ) {
	  if ( objectTime_ ) {
			// Create time vars from passed time object.
			var minutes_   = objectTime_.minutes_;
			var seconds_   = objectTime_.seconds_;
			var hoursYest_ = objectTime_.hoursYesterday_;

		  // Create basic background.
		  var rectBasic_ = new Kinetic.Rect({
		    x: 0, y: 0, height: g_hStage - 1, width: g_wStage,
	      fill: s_white,  opacity: 0.3
		  });
		  if ( rectBasic_ ) { g_layerTimeline.add( rectBasic_ ); }

	    // Create background for current day.
	    var xStartCurrent_ = g_daysPast * g_wDay;
	    if ( stc_isNumber( xStartCurrent_ ) ) {
			  var rectCurrent_ = new Kinetic.Rect({
			    x: xStartCurrent_, y: 0,
			    height: g_hStage - 1, width: g_wStage - ( g_daysPast * g_wDay ),
			    fill: s_white, opacity: 0.8
			  });
			  if ( rectCurrent_ ) { g_layerTimeline.add( rectCurrent_ ); }
	    }//xStartCurrent_ valid

			// Get distance for yesterday (to show the number of hours within last 24 that belong to yesterday).
			var wYesterday_ = tl_getDistanceForYesterday( objectTime_ );

		  // Create rectangle for yesterday.
		  if ( stc_isNumber( wYesterday_ ) ) {
			  var rectYesterday_ = new Kinetic.Rect({
			    id: stc_getIdentifier( "", s_strTLRectYesterday ), x: xStartCurrent_, y: g_yRect,
			    height: g_hRect, width: wYesterday_,
		      fill: s_color.greenLight_
			  });
				if ( rectYesterday_ ) { g_layerTimeline.add( rectYesterday_ ); }
	    }//wYesterday_ valid

		  // Create rectangle for today.
		  var wToday_ = g_wStage - wYesterday_;
		  if ( stc_isNumber( wYesterday_ ) && stc_isNumber( wToday_ ) ) {
			  var rectToday_ = new Kinetic.Rect({
			    id: stc_getIdentifier( "", s_strTLRectToday ), x: xStartCurrent_ + wYesterday_, y: g_yRect,
			    height: g_hRect, width: wToday_,
		      fill: s_color.blueLight_
			  });
				if ( rectToday_ ) { g_layerTimeline.add( rectToday_ ); }
	    }//wYesterday_ wToday_ valid

	    // Create sections for last 12 hours, 8 hours, 3 hours, 50 minutes, 10 minutes.
	    // Older sections of past time have coarser granularity, starting with 12 hours for oldest section.
	    // Increment x position after creating each section.
	    if ( stc_isNumber( xStartCurrent_ ) ) {
		    tl_createTimeSection( stc_getIdentifier( "", s_strTLLast12Hours ), xStartCurrent_, g_freq12h, g_px12h, g_strHoursLast12 );
		    xStartCurrent_ = ( xStartCurrent_ + ( g_freq12h * g_px12h ) ) -1;

		    tl_createTimeSection( stc_getIdentifier( "", s_strTLLast8Hours ), xStartCurrent_, g_freq8h, g_px8h, g_strHoursLast8 );
		    xStartCurrent_ = xStartCurrent_ + ( g_freq8h * g_px8h );

		    tl_createTimeSection( stc_getIdentifier( "", s_strTLLast3Hours ), xStartCurrent_, g_freq3h, g_px3h, g_strHoursLast3 );
		    xStartCurrent_ = xStartCurrent_ + ( g_freq3h * g_px3h );

		    tl_createTimeSection( stc_getIdentifier( "", s_strTLLast50Minutes ), xStartCurrent_, g_freq50m, g_px50m, g_strMinLast50 );
		    xStartCurrent_ = xStartCurrent_ + ( g_freq50m * g_px50m );

		    tl_createTimeSection( stc_getIdentifier( "", s_strTLLast10Minutes )	, xStartCurrent_, g_freq10m, g_px10m, g_strMinLast10 );
	    }//xStartCurrent_ valid

		  // Create past day sections.
		  var xDay_          = 0;
		  var nbrDaysPassed_ = g_daysPast;
		  if ( stc_isNumber( xDay_ ) && stc_isNumber( nbrDaysPassed_ ) && stc_isNumber( hoursYest_ ) ) {
		    for ( var i = 0; i < g_daysPast; i++ ) {
			    tl_createPastDay( i, xDay_, nbrDaysPassed_, hoursYest_ );
			    xDay_ = xDay_ + g_wDay;
			    nbrDaysPassed_--;
		    }//for g_daysPast
	    }//xDay_ nbrDaysPassed_ hoursYest_ valid

			// Create daybreak component. Component shows position of most recent midnight on timeline
			// and separates past from current sections on timeline.
			if ( rectToday_ ) {
			  var daybreak_ = new Kinetic.Group({ id: stc_getIdentifier( "", s_strTLDaybreak ) , x: rectToday_.getX() - g_wLabel, y: 0 });
			  if ( daybreak_ ) {
		      // Create labels on either side of daybreak for today/yesterday dates.
		      // Create label rectangle for yesterday.
				  var rectLabelYesterday_ = new Kinetic.Rect({
		        x: 0, y: g_yLabelRect, height: g_hLabelRect, width: g_wLabel,
			      fill: s_white
				  });
				  if ( rectLabelYesterday_ ) { daybreak_.add( rectLabelYesterday_ ); }

		      // Create label for yesterday.
		      var textYesterday_ = new Kinetic.Text({
		        id: stc_getIdentifier( "", s_strTLTextYesterday ), x: 0, y: g_yLabelText, height: g_hLabelText, width: g_wLabel,
		        fontSize: 9, fontFamily: s_fontFamily, fontStyle: "bold",
		        align: "center", fill: g_textColorYesterday,
		        text: tl_getDateLabelByDaysPassed( 1 )
		      });
				  if ( textYesterday_ ) { daybreak_.add( textYesterday_ ); }

		      // Create label rectangle for today.
				  var rectLabelToday_ = new Kinetic.Rect({
		        x: g_wLabel + 2, y: g_yLabelRect, height: g_hLabelRect, width: g_wLabel,
			      fill: s_white
				  });
				  if ( rectLabelToday_ ) { daybreak_.add( rectLabelToday_ ); }

		      // Create label for today.
		      var textToday_ = new Kinetic.Text({
		        id: stc_getIdentifier( "", s_strTLTextToday ), x: g_wLabel + 2, y: g_yLabelText, height: g_hLabelText, width: g_wLabel,
		        fontSize: 9, fontFamily: s_fontFamily, fontStyle: "bold",
		        align: "center", fill: g_textColorCurrent,
		        text: tl_getDateLabelByDaysPassed( 0 )
		      });
				  if ( textToday_ ) { daybreak_.add( textToday_ ); }

					// Create line for daybreak.
					var lineDaybreak_ = new Kinetic.Line({
					  points: [g_wLabel, 0, g_wLabel, g_hStage - 1],
					  stroke: s_white, strokeWidth: 2
					});
					if ( lineDaybreak_ ) { daybreak_.add( lineDaybreak_ ); }

					// Add group to layer.
					g_layerTimeline.add( daybreak_ );
			  }//daybreak_ valid
			}//rectToday_ valid
	  }//objectTime_ valid
	}//tl_createTimeline

	// GET DISTANCE FOR YESTERDAY.
	function tl_getDistanceForYesterday( objectTime_ ) {
	  // Set up var to hold yesterday's distance.
	  var distance_ = 0;

	  // Calculate distance.
	  if ( objectTime_ ) {
			// Get yesterday's milliseconds from passed time object.
		  var millsYesterday_ = objectTime_.millsYesterday_;

	    // Get time range - how far yesterday extends up to current time.
	    // For example, if current time is just past midnight, yesterday extends almost completely to now.
	    var range_ = "";
	    if ( millsYesterday_ > g_mills0 ) { range_ = "12h"; }
	    if ( millsYesterday_ > g_mills1 ) { range_ = "8h"; }
	    if ( millsYesterday_ > g_mills2 ) { range_ = "3h"; }
	    if ( millsYesterday_ > g_mills3 ) { range_ = "50m"; }
	    if ( millsYesterday_ > g_mills4)  { range_ = "10m"; }
	    if ( millsYesterday_ > g_mills5 ) { range_ = "done"; }

		  // Get distance for yesterday.
		  // Each range (except oldest range) includes all of preceding range, plus some portion of selected range.
		  var remainingTime_ = 0;
	    switch( range_ ) {
	      case "12h":
	        distance_ = ( millsYesterday_ / g_millsPx12h );
	      break;
	      case "8h":
	        distance_ = ( g_mills12h / g_millsPx12h );
	        remainingTime_ = millsYesterday_ - g_mills1;
	        distance_ = distance_ + ( remainingTime_ / g_millsPx8h );
	      break;
	      case "3h":
	        distance_ = ( g_mills12h / g_millsPx12h ) + ( g_mills8h / g_millsPx8h );
	        remainingTime_ = millsYesterday_ - g_mills2;
	        distance_ = distance_ + ( remainingTime_ / g_millsPx3h );
	      break;
	      case "50m":
	        distance_ = ( g_mills12h / g_millsPx12h ) + ( g_mills8h / g_millsPx8h ) + ( g_mills3h / g_millsPx3h );
	        remainingTime_ = millsYesterday_ - g_mills3;
	        distance_ = distance_ + ( remainingTime_ / g_millsPx50m );
	      break;
	      case "10m":
	        distance_ = ( g_mills12h / g_millsPx12h ) + ( g_mills8h / g_millsPx8h ) + ( g_mills3h / g_millsPx3h ) +
	                    ( g_mills50m / g_millsPx50m );
	        remainingTime_ = millsYesterday_ - g_mills4;
	        distance_ = distance_ + ( remainingTime_ / g_millsPx10m );
	      break;
	      case "done":
	        distance_ = ( g_mills12h / g_millsPx12h ) + ( g_mills8h / g_millsPx8h ) + ( g_mills3h / g_millsPx3h ) +
	                    ( g_mills50m / g_millsPx50m ) + ( g_mills10m / g_millsPx10m );
	      break;
	      default:
	      break;
	    }//switch range_
	  }//objectTime_ valid

    // Return yesterday's distance.
    return distance_;
	}//tl_getDistanceForYesterday

	// CREATE PAST DAY.
	function tl_createPastDay( id_, xDay_, nbrDaysPassed_, hoursYest_ ) {
	  if ( stc_isDefined( id_ ) &&
	       stc_isNumber( xDay_ ) &&
	       stc_isNumber( nbrDaysPassed_ ) &&
	       stc_isNumber( hoursYest_ ) ) {

		  // Create group for this day, then add elements.
		  var dayID_ = s_strDay + id_ + "_";
		  var day_   = new Kinetic.Group({ id: dayID_, x: xDay_, y: 0 });
		  if ( day_ ) {
			  // Create basic rectangle.
			  var rect_ = new Kinetic.Rect({
			    x: 0, y: g_yRect, height: g_hRect, width: g_wDay,
		      fill: s_color.greenLight_
			  });
			  if ( rect_ ) { day_.add( rect_ ); }

	      // Create lines.
	      tl_createPastLines( day_, id_, nbrDaysPassed_, hoursYest_ );

	      // Create label.
	      var labelID_ = s_strLabel + id_ + "_";
	      var label_   = new Kinetic.Group({ id: labelID_, x: 0, y: 0 });
	      if ( label_ ) {
		      // Create label rectangle.
				  var rectLabel_ = new Kinetic.Rect({
		        x: 23, y: g_yLabelRect, height: g_hLabelRect, width: 50,
			      fill: g_labelColorPast
				  });
				  if ( rectLabel_ ) { label_.add( rectLabel_ ); }

		      // Create label.
		      var textID_ = s_strTLTextPast + id_ + "_";
		      var text_   = new Kinetic.Text({
		        id: textID_, x: 23, y: g_yLabelText, height: g_hLabelText, width: g_wLabel,
		        fontSize: 9, fontFamily: s_fontFamily, fontStyle: "normal",
		        align: "center", fill: s_white,
		        text: tl_getDateLabelByDaysPassed( nbrDaysPassed_ )
		      });
				  if ( text_ ) { label_.add( text_ ); }

	        // Add to group.
	        day_.add( label_ );
	      }//label_ valid

			  // Add group to layer.
			  g_layerTimeline.add( day_ );
		  }//day_ valid
	  }//parameters valid
	}//tl_createPastDay

	// CREATE PAST LINES.
	function tl_createPastLines( day_, id_, nbrDaysPassed_, hoursYest_ ) {
	  if ( day_ &&
	       stc_isDefined( id_ ) &&
	       stc_isNumber( nbrDaysPassed_ ) &&
	       stc_isNumber( hoursYest_ ) ) {

	    // Destroy any currently existing lines.
	    var linesExistingID_ = s_strTLLinesPast + id_ + "_";
	    var linesExisting_   = stc_getElement( linesExistingID_, g_stageTimeline );
	    if ( linesExisting_ ) {
	      linesExisting_.destroy();
	    }//linesExisting_ valid

	    // Create lines.
	    var linesPastID_ = s_strTLLinesPast + id_ + "_";
	    var linesPast_   = new Kinetic.Group({ id: linesPastID_, x: 0, y: 0 });
	    if ( day_ && linesPast_ ) {
		    // Set x position, freq, increment.
		    // Freqency is number of lines, increment is distance between lines.
	      var xLine_     = 1;
	      var freq_      = g_freq24h;
	      var increment_ = g_px24h;

		    // If we're dealing with yesterday, adjust frequency and increment
		    // to compensate for hours included in section that shows last 24 hours.
	      if ( nbrDaysPassed_ == 1 ) {
	        freq_      = g_freq24h - hoursYest_;
	        increment_ = g_wDay / freq_;
	      }//nbrDaysPassed_ is 1

	      // Loop.
	      for ( var i = 0; i < freq_; i++ ) {
	        // Set y position.
	        var yLine_ = g_yLineMinorPast;

	        // Set y position for main ticks, which are longer.
	        // First line and every 6th line are main ticks.
	        if ( i > 0 && stc_isDivisbleBySix( i ) ) { yLine_ = g_yLineMainPast; }
	        if ( i == 0 )                        { yLine_ = g_yLineAnchor; }

	        // Create line, add to group, increment x position.
	        var line_ = new Kinetic.Line({
	          points: [xLine_, yLine_, xLine_, g_yLineEnd],
	          stroke: g_lineColorPast, strokeWidth: g_wLine,
	          lineCap: s_lineCap, lineJoin: s_lineJoin
	        });
				  if ( line_ ) {
				    linesPast_.add( line_ );
				    xLine_ = xLine_ + increment_;
				  }//line_ valid
	      }//for freq

	      // Add to group.
	      day_.add( linesPast_ );
	    }//linesPast_ valid
	  }//parameters valid
	}//tl_createPastLines

	// CREATE TIME SECTION.
	function tl_createTimeSection( id_, xHours_, freq_, increment_, labelText_ ) {
	  if ( id_ &&
	       stc_isNumber( xHours_ ) &&
	       stc_isNumber( freq_ ) &&
	       stc_isNumber( increment_ ) &&
	       stc_isDefined( labelText_ ) ) {

		  // Create time section.
		  var hours_ = new Kinetic.Group({ id: id_, x: xHours_, y: 0 });
		  if ( hours_ ) {
	      // Create lines.
	      // Set x position.
	      var xLine_ = 1;

	      // Loop. Freqency is number of lines, increment is distance between lines.
	      for ( var i = 0; i < freq_; i++ ) {
	        // Set line color.
	        var lineColor_ = g_lineColor;

	        // Set first line (anchor line) is to anchor color.
	        if ( i == 0 ) { lineColor_ = g_lineColorAnchor; }

	        // Set y position.
	        var yLine_ = g_yLineMinor;

	        // Set y position for first line (anchor line).
	        // Anchor line reaches to top of rectangle.
	        if ( i == 0 ) { yLine_ = g_yLineAnchor; }

		      // Every other line is main tick, which is longer.
		      if ( stc_isEven( i ) ) { yLine_ = g_yLineMain; }

		      // Lines for last 12 hours are all same length.
	        var idLast12Hours_ = stc_getIdentifier( "", s_strTLLast12Hours );
	        if ( id_ == idLast12Hours_ ) { yLine_ = g_yLineMain; }

	        // Create line, add to group, increment x position.
	        var line_ = new Kinetic.Line({
	          points: [xLine_, yLine_, xLine_, g_yLineEnd],
	          stroke: lineColor_, strokeWidth: g_wLine,
	          lineCap: s_lineCap, lineJoin: s_lineJoin
	        });
				  if ( line_ ) {
				    hours_.add( line_ );
				    xLine_ = xLine_ + increment_;
				  }//line_ valid
	      }//for frequency

	      // Create label.
	      var text_ = new Kinetic.Text({
	        x: 0, y: 6, height: 10, width: increment_ * freq_,
	        fontSize: 9, fontFamily: s_fontFamily, fontStyle: "normal",
	        align: "center", fill: g_textColorCurrent,
	        text: labelText_
	      });
			  if ( text_ ) { hours_.add( text_ ); }

			  // Add group to layer.
			  g_layerTimeline.add( hours_ );
		  }//hours_ valid
	  }//parameters valid
	}//tl_createTimeSection

	// ADVANCE TIMELINE.
	// Redraw/move/reset elements in timeline to match specified date/time.
	// Updates rectangle widths for today/yesterday, daybreak position/labels, past days labels, and ticks/labels in most recent past day.
	function tl_advanceTimeline( objectTime_ ) {
	  if ( objectTime_ ) {
			// Set vars for updates.
			var wYesterday_    = tl_getDistanceForYesterday( objectTime_ );
			var wToday_        = g_wStage - wYesterday_;
			var xStartCurrent_ = g_daysPast * g_wDay;

			// Advance timeline.
			if ( stc_isNumber( wYesterday_ ) && stc_isNumber( wToday_ ) && stc_isNumber( xStartCurrent_ ) ) {
			  // Get elements for updating today/yesterday rectangles and daybreak.
			  var rectYesterday_ = stc_getElement( stc_getIdentifier( "", s_strTLRectYesterday ), g_stageTimeline );
			  var rectToday_     = stc_getElement( stc_getIdentifier( "", s_strTLRectToday ), g_stageTimeline );
			  var daybreak_      = stc_getElement( stc_getIdentifier( "", s_strTLDaybreak ) , g_stageTimeline );
			  var textYesterday_ = stc_getElement( stc_getIdentifier( "", s_strTLTextYesterday ), g_stageTimeline );
			  var textToday_     = stc_getElement( stc_getIdentifier( "", s_strTLTextToday ), g_stageTimeline );

			  // Update today/yesterday rectangles and daybreak.
			  if ( rectYesterday_ && rectToday_ && daybreak_ && textYesterday_ && textToday_ ) {
			    // Set new widths for today and yesterday, and move today to updated x position.
			    // Move daybreak to new x position.
			    rectYesterday_.setWidth( wYesterday_ );
			    rectToday_.setX( xStartCurrent_ + wYesterday_ );
			    rectToday_.setWidth( wToday_ );
			    daybreak_.setX( rectToday_.getX() - g_wLabel );

			    // Update date labels for yesterday and today.
			    textYesterday_.setText( tl_getDateLabelByDaysPassed( 1 ) );
			    textToday_.setText( tl_getDateLabelByDaysPassed( 0 ) );

			    // Draw layer.
			    g_layerTimeline.draw();
			  }//rectYesterday_ rectToday_ daybreak_ textYesterday_ textToday_ valid

			  // Update past days labels.
			  var nbrDaysPassed_ = g_daysPast;
			  if ( stc_isNumber( nbrDaysPassed_ )  ) {
			    for ( var i = 0; i < g_daysPast; i++ ) {
			      var textPastID_ = s_strTLTextPast + i + "_";
				    var textPast_   = stc_getElement( textPastID_, g_stageTimeline );
				    if ( textPast_ ) {
				      textPast_.setText( tl_getDateLabelByDaysPassed( nbrDaysPassed_ ) );
				    }//textPast_ valid
				    nbrDaysPassed_--;
			    }//for g_daysPast
			  }//nbrDaysPassed_ valid

		    // Update ticks/label in most recent past day.
		    // We do this by destroying lines and re-creating them.
		    // Frequency and increment of lines in this section must compensate for number of hours included in yesterday section.
		    var nbrRecentDay_ = g_daysPast - 1;
		    var dayRecentID_  = s_strDay + nbrRecentDay_ + "_";
		    var dayRecent_    = stc_getElement( dayRecentID_, g_stageTimeline );
		    var labelID_      = s_strLabel + nbrRecentDay_ + "_";
		    var label_        = stc_getElement( labelID_, g_stageTimeline );
		    if ( stc_isNumber( nbrRecentDay_ ) && dayRecent_ && label_ ) {
		      tl_createPastLines( dayRecent_, nbrRecentDay_, 1, objectTime_.hoursYesterday_ );
		      label_.moveToTop();
		      g_layerTimeline.draw();
		    }//nbrRecentDay_ dayRecent_ label_ valid

	      // Set time array, which keeps track of time offset for each point on timeline.
	      tl_setTimeArray( objectTime_ );
			}//wYesterday_ wToday_ xStartCurrent_ valid
	  }//objectTime_ valid
	}//tl_advanceTimeline

	// SET TIME ARRAY.
	// Stores offset for each position of draggable hairline. Offset is used to set new time based on user's dragged selection.
	function tl_setTimeArray( objectTime_ ) {
	  if ( objectTime_ ) {
	    // Init array.
	    g_timeArray = [];

      // Set vars for past day section representing most recent past day (yesterday).
      var hoursYest_ = objectTime_.hoursYesterday_;
      var freqYest_  = g_freq24h - hoursYest_;
      var pxYest_    = g_wDay / freqYest_;

	    // Set distances for past days. Distances for last 24 hours are stable, and are stored in globals (g_px1 thru g_px5).
	    var daysBeforeRecent_     = g_daysPast - 1;
	    var distanceBeforeRecent_ = ( daysBeforeRecent_ * g_wDay );
	    var distanceYest_         = g_wDay;
	    var distancePast_         = distanceBeforeRecent_ + distanceYest_;
	    var distanceTotal_        = distancePast_ + g_px5;

	    // Set total seconds per section. Simple multiplication of number of minutes in section by 60 secs per min.
	    // Vars with 24h string are past days not including yesterday.
	    var totalSecs24h_  = g_freq24h * 60 * 60;
	    var totalSecsYest_ = freqYest_ * 60 * 60;
	    var totalSecs12h_  = g_freq12h * 60 * 60;
	    var totalSecs8h_   = ( g_freq8h * 60 * 60 ) * .5;
	    var totalSecs3h_   = ( g_freq3h * 60 * 60 ) * .5;
	    // 50 multiplied by 60.
	    var totalSecs50m_  = 3000;
	    // 10 multiplied by 60.
	    var totalSecs10m_  = 600;

	    // Set number of seconds represented by each pixel in each section.
	    var secondsPerPixel24h_   = Math.round( totalSecs24h_  / ( g_px24h * g_freq24h ) );
	    var secondsPerPixelYest_  = Math.round( totalSecsYest_ / ( pxYest_ * freqYest_ ) );
	    var secondsPerPixel12h_   = Math.round( totalSecs12h_  / ( g_px12h * g_freq12h ) );
	    var secondsPerPixel8h_    = Math.round( totalSecs8h_   / ( g_px8h * g_freq8h ) );
	    var secondsPerPixel3h_    = Math.round( totalSecs3h_   / ( g_px3h * g_freq3h ) );
	    var secondsPerPixel50m_   = Math.round( totalSecs50m_  / ( g_px50m * g_freq50m ) );
	    var secondsPerPixel10m_   = Math.round( totalSecs10m_  / ( g_px10m * g_freq10m ) );
	    var secondsPerPixelDone_  = Math.round( totalSecs10m_  / ( g_px10m * g_freq10m ) );

	    // Set total number of seconds for entire timeline. Used to get final offset.
	    var totalSecsTimeline_ = totalSecs10m_ + totalSecs50m_ + totalSecs3h_  + totalSecs8h_  + totalSecs12h_ + totalSecsYest_ + ( daysBeforeRecent_ * totalSecs24h_ );

	    // Count off each pixel in timeline and assign number of seconds to each position.
	    for ( var i = 0; i < distanceTotal_ + 1; i++ ) {
		    var totalSeconds_ = 0;
		    var distanceCurrent_ = i;

		    // Set distance range.
		    var range_ = "past";
		    if ( i > distanceBeforeRecent_ ) { range_ = "yest"; distanceCurrent_ = i - distanceBeforeRecent_; }
		    if ( i > distancePast_ )         { range_ = "12h";  distanceCurrent_ = i - distancePast_; }
		    if ( i > g_px1 + distancePast_ ) { range_ = "8h";   distanceCurrent_ = i - ( g_px1 + distancePast_ ); }
		    if ( i > g_px2 + distancePast_ ) { range_ = "3h";   distanceCurrent_ = i - ( g_px2 + distancePast_ ); }
		    if ( i > g_px3 + distancePast_ ) { range_ = "50m";  distanceCurrent_ = i - ( g_px3 + distancePast_ ); }
		    if ( i > g_px4 + distancePast_ ) { range_ = "10m";  distanceCurrent_ = i - ( g_px4 + distancePast_ ); }

			  // Get seconds per pixel for current position by range.
		    switch( range_ ) {
		      case "past" : totalSeconds_ = ( distanceCurrent_ * secondsPerPixel24h_ ); break;
		      case "yest" : totalSeconds_ = ( distanceCurrent_ * secondsPerPixelYest_ ) + ( daysBeforeRecent_ * totalSecs24h_ ); ; break;
		      case "12h"  : totalSeconds_ = ( distanceCurrent_ * secondsPerPixel12h_ )  + totalSecsYest_ + ( daysBeforeRecent_ * totalSecs24h_ ); break;
		      case "8h"   : totalSeconds_ = ( distanceCurrent_ * secondsPerPixel8h_ )   + totalSecs12h_ + totalSecsYest_ + ( daysBeforeRecent_ * totalSecs24h_ ); break;
		      case "3h"   : totalSeconds_ = ( distanceCurrent_ * secondsPerPixel3h_ )   + totalSecs8h_  + totalSecs12h_ + totalSecsYest_ + ( daysBeforeRecent_ * totalSecs24h_ ); break;
		      case "50m"  : totalSeconds_ = ( distanceCurrent_ * secondsPerPixel50m_ )  + totalSecs3h_  + totalSecs8h_  + totalSecs12h_ + totalSecsYest_ + ( daysBeforeRecent_ * totalSecs24h_ ); break;
		      case "10m"  : totalSeconds_ = ( distanceCurrent_ * secondsPerPixel10m_ )  + totalSecs50m_ + totalSecs3h_  + totalSecs8h_  + totalSecs12h_ + totalSecsYest_ + ( daysBeforeRecent_ * totalSecs24h_ ); break;
		      default: break;
		    }//switch range_

		    // Subtract seconds for current position from total seconds for timeline, then store in array.
		    g_timeArray.push( totalSecsTimeline_ - totalSeconds_ );
	    }//for g_wStage
	  }//objectTime_ valid
	}//tl_setTimeArray

	// ============================================================================
	// TIMELINE/DIGITAL CLOCK ANIMATION.
	// ============================================================================

	// RUN CLOCK.
	function tl_runClock() {
	  if ( !g_clockRunning ) {
	    // Set run flag.
	    g_clockRunning = true;

	    // Set and get global time.
	    var objectTime_ = tl_setGlobalTime();

	    // Advance timeline to match global time.
	    if ( objectTime_ ) { tl_advanceTimeline( objectTime_ ); }

			// If there is no global date/time offset, restore hairline to initial position.
			if ( g_millsOffset == 0 ) {
			  $( "#_hairline" ).css( "left", g_hairlinePositionInitial );
			}//g_millsOffset gt 0

	    // Start clock timer.
      tl_digitalClockRun();
	  }//g_clockRunning false
	}//tl_runClock

	// STOP CLOCK.
	function tl_stopClock() {
	  // Stop timer.
	  clearTimeout( g_clockTimer );

	  // Set run flag.
	  g_clockRunning = false;
	}//tl_stopClock

	// RESET CLOCK.
	function tl_resetClock() {
	  // Remove any time offset.
	  g_millsOffset = 0;

    // Set and get global time.
    var objectTime_ = tl_setGlobalTime();

	  // Restore current time.
	  if ( objectTime_ ) {
		  // Display date and time.
		  $( "#_dateDigital" ).html( tl_getDateLabelByDate( objectTime_.date_ ) );
			$( "#_clockDigital" ).html( tl_setTimeText( objectTime_.hours_, objectTime_.minutes_, objectTime_.seconds_ ) );

		  // Advance timeline to match global time.
	    tl_advanceTimeline( objectTime_ );

	    // Restore hairline to initial position.
	    $( "#_hairline" ).css( "left", g_hairlinePositionInitial );
	  }//objectTime_ valid
	}//tl_resetClock

	// DIGITAL CLOCK RUN.
	function tl_digitalClockRun() {
		// Set and get global time.
		var objectTime_ = tl_setGlobalTime();

		// Run clock.
		if ( objectTime_ ) {
		  // Set recursive timer.
		  g_clockTimer = setTimeout( "tl_digitalClockRun()", 1000 );

			// If there is any global date/time offset, use it to offset date/time output.
			// If no offset, use current date/time.
			var timeText_ = "";
			if ( g_millsOffset > 0 ) {
				// Get offset date/time.
				var offsetTime_ = tl_setGlobalTimeOffset();
				if ( offsetTime_ ) {
				  // Get text output for clock.
				  timeText_ = tl_setTimeText( offsetTime_.hours_, offsetTime_.minutes_, offsetTime_.seconds_ );

				  // Display date and time.
				  $( "#_dateDigital" ).html( tl_getDateLabelByDate( offsetTime_.date_ ) );
				  if ( timeText_ ) { $( "#_clockDigital" ).html( timeText_ ); }
				}//offsetTime_ valid
			} else {
			  // Get text output for clock.
			  timeText_ = tl_setTimeText( objectTime_.hours_, objectTime_.minutes_, objectTime_.seconds_ );

			  // Display date and time.
				$( "#_dateDigital" ).html( tl_getDateLabelByDate( objectTime_.date_ ) );
				if ( timeText_ ) { $( "#_clockDigital" ).html( timeText_ ); }
			}//no offset

		  // Animate hairline.
		  tl_animateHairline( objectTime_.seconds_ );

		  // Animate daybreak line, then advance timeline.
		  if ( stc_isDivisbleByFive( objectTime_.seconds_ ) ) {
		    tl_animateDaybreak();
		    tl_advanceTimeline( objectTime_ );
		  }//isDivisbleByFive
		}//objectTime_
	}//tl_digitalClockRun

	// SET TIME TEXT.
	function tl_setTimeText( hours_, minutes_, seconds_ ) {
	  var timeText_ = "";
	  if ( stc_isNumber( hours_ ) && stc_isNumber( minutes_ ) && stc_isNumber( seconds_ ) ) {
		  var hoursWork_ = hours_;
		  var d_ = "AM";
		  if ( hours_ >= 12 ) { d_ = "PM"; }
		  if ( hours_ == 0 )  { hoursWork_ = 12; }
		  if ( hours_ > 12 )  { hoursWork_ = hours_ - 12; }
		  var hoursText_ = hoursWork_;
			if ( hoursWork_ < 10 ) { hoursText_ = "0" + hoursWork_; }
		  var minutesText_ = minutes_;
		  var secondsText_ = seconds_;
			if ( minutes_ < 10 ) { minutesText_ = "0" + minutes_; }
			if ( seconds_ < 10 ) { secondsText_ = "0" + seconds_; }
			timeText_ = hoursText_ + ":" + minutesText_ + ":" + secondsText_ + " " + d_;
	  }//parameters valid
	  return timeText_;
	}//tl_setTimeText

	// ANIMATE HAIRLINE.
	function tl_animateHairline( seconds_ ) {
    if ( stc_isNumber( seconds_ ) ) {
	    if ( stc_isEven( seconds_ ) ) {
	      $( "#_hairline" ).css( "opacity", 0.7 );
	    } else {
	      $( "#_hairline" ).css( "opacity", 1 );
	    }//odd
    }//seconds_ valid
	}//tl_animateHairline

	// ANIMATE DAYBREAK.
	function tl_animateDaybreak() {
	  var daybreak_ = stc_getElement( stc_getIdentifier( "", s_strTLDaybreak ) , g_stageTimeline );
	  if ( daybreak_ ) {
	    if ( daybreak_.getOpacity() == 1 ) {
	      daybreak_.setOpacity( 0.7 );
	    } else {
	      daybreak_.setOpacity( 1 );
	    }//opacity not 1
	    g_layerTimeline.draw();
	  }//daybreak_ valid
	}//tl_animateDaybreak

	// ============================================================================
	// UTILITY.
	// ============================================================================

	// GET DAY NAME.
	function tl_getDayName( nbrDaysPassed_ ) {
    var dayName_ = ""
    var objectTime_ = tl_setGlobalTime();
    if ( objectTime_ && stc_isNumber( nbrDaysPassed_ ) && g_dayNames ) {
	    var date_ = objectTime_.date_;
			date_.setDate( date_.getDate() - nbrDaysPassed_ );
	    if ( date_ ) {
	      dayName_ = g_dayNames[ date_.getDay() ];
	    }//date_ valid
    }//objectTime_ nbrDaysPassed_ g_dayNames valid
    return dayName_;
	}//tl_getDayName

	// GET MONTH NUMBER.
	function tl_getMonthNumber( nbrDaysPassed_ ) {
    var monthNumber_ = null;
    var objectTime_ = tl_setGlobalTime();
    if ( objectTime_ && stc_isNumber( nbrDaysPassed_ ) ) {
	    var date_ = objectTime_.date_;
			date_.setDate( date_.getDate() - nbrDaysPassed_ );
	    if ( date_ ) {
	      monthNumber_ = date_.getMonth() + 1;
	    }//date_ valid
    }//objectTime_ nbrDaysPassed_ valid
    return monthNumber_;
	}//tl_getMonthNumber

	// GET DAY NUMBER.
	function tl_getDayNumber( nbrDaysPassed_ ) {
    var dayNumber_ = "";
    var objectTime_ = tl_setGlobalTime();
    if ( objectTime_ && stc_isNumber( nbrDaysPassed_ ) ) {
	    var date_ = objectTime_.date_;
			date_.setDate( date_.getDate() - nbrDaysPassed_ );
	    if ( date_ ) {
	      dayNumber_ = date_.getDate().toString();
	    }//date_ valid
    }//objectTime_ nbrDaysPassed_ valid
    return dayNumber_;
	}//tl_getDayNumber

	// GET DATE LABEL BY DATE.
	function tl_getDateLabelByDate( date_ ) {
    var label_ = "";
    if ( date_ && g_dayNames ) {
      var dayName_     = g_dayNames[ date_.getDay() ];
      var monthNumber_ = date_.getMonth() + 1;
      var dayNumber_   = date_.getDate().toString();
      label_ = dayName_ + " " + monthNumber_ + "/" + dayNumber_;
    }//date_ g_dayNames valid
    return label_;
	}//tl_getDateLabelByDate

	// GET DATE LABEL BY DAYS PASSED.
	function tl_getDateLabelByDaysPassed( nbrDaysPassed_ ) {
    var label_ = "";
    if ( stc_isNumber( nbrDaysPassed_ ) ) {
		  var dayName_     = tl_getDayName( nbrDaysPassed_ );
		  var monthNumber_ = tl_getMonthNumber( nbrDaysPassed_ );
		  var dayNumber_   = tl_getDayNumber( nbrDaysPassed_ );
		  if ( dayName_ && stc_isNumber( monthNumber_ ) && dayNumber_ ) {
		    label_ = dayName_ + " " + monthNumber_ + "/" + dayNumber_;
		  }//dayName_ monthNumber_ dayNumber_ valid
    }//nbrDaysPassed_ valid
    return label_;
	}//tl_getDateLabelByDaysPassed
