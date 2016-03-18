
  // ============================================================================
	// SCHEMA WHEEL.
  // Requires static.js.
  // Uses Kinetic components. Once Kinetic stage/layer are created, do not keep checking them for validity.
  // ============================================================================

	// ON DOC READY
	$( document ).ready( function() {

	  // Set default parent ref.
	  g_indexPageRef = parent;

	  // Get parent ref. Set view according to parent.
	  if ( parent.i_parentPageName_ == s_message.index_ ) {
		  // Load module/view.
		  g_indexPageRef.loadModule( s_module._0_, s_module0._2_ );
	  } else {
	    // Store parent ref.
	    g_indexPageRef = parent.parent;

	    // Set background color.
	    $( "#_main" ).attr( "class", "bgBasic" );

	    // Set log position.
      g_indexPageRef.positionMessageLog( 326, 130 );

		  // Show help
      g_indexPageRef.showHelpDialog( s_help.createRelationships_ + s_help.schemaWheel_ );
      g_indexPageRef.positionHelpDialog( 360, 130 );
	  }//parent not index

	  // Create basic contents.
	  createBasicContents();

    // Get tree list. Service callback creates tree.
    if ( g_stageMain && g_layerMain ) {
      // Set params.
      // NOTE: Schema Wheel always recurses through all nested items for tree selection.
      // Tree selection produces 2 results: top-level object with nested items and flat array of IDs.
      // Flat array is used to determine number of points to create, object is used to create points.
      // Setting recurse to false will result in flat array with wrong number of IDs, which produces
      // overlapping points on wheel.
      var indexPage_            = g_indexPageRef;
      var titleTextTree_        = g_indexPageRef.i_domainName;
      var isEditable_           = true;
      var isDraggable_          = true;
      var recurseAll_           = true;
      var recurseLimit_         = 0;
      var createFlatFile_       = false;
      var colorBackground_      = s_white;
      var colorRowSelected_     = s_grayD;
      var colorRowUnselected_   = s_white;
      var callbackInitialLoad_  = runInitialLoad;
      var callbackWipeLoad_     = wipeOutLoad;
      var callbackSelection_    = createWheelElements;
      var createHelperFunction_ = createHelper;
      var callbackDropPoints_   = toggleShowDropPoints;

      // Get and set up tree.
      tree_setupTree( indexPage_, $( "#_helper" ), $( "#_containerTree" ), "_handleTree", $( "#_tree" ),
                      $( "#_listTree" ), $( "#_titleTree" ), titleTextTree_,
                      $( "#_iconTreeClose" ), $( "#_iconTreeEdit" ), $( "#_iconTreeRegenerate" ), $( "#_iconTreeDelete" ), $( "#_iconAddTreeStatic" ), $( "#_iconAddTreeRelational" ),
                      $( "#_containerRelation" ), "_handleRelation", $( "#_formRelation" ), $( "#_titleRelation" ), $( "#_iconRelationClose" ),
                      isEditable_, isDraggable_, recurseAll_, recurseLimit_, createFlatFile_,
	                    colorBackground_, colorRowSelected_, colorRowUnselected_,
	                    callbackInitialLoad_, callbackWipeLoad_, callbackSelection_, createHelperFunction_, callbackDropPoints_ );
			tree_setupTreeRequest();
			tree_getTree( s_action.treeBuild_ );
		  tree_showTree( 20, 120 );
    }//stages layers valid

	})// ON DOC READY

	// ============================================================================
	// GLOBAL VARS.
	// ============================================================================

  // Index page ref.
  var g_indexPageRef = "";

  // Basic vals.
  var g_vals = {
    loadTooHeavy_: 60,
    charLimit_   : 15 };

	// Main stage/layer.
	var g_stageMain  = null;
	var g_layerMain  = null;
	var g_hStageMain = 800;
	var g_wStageMain = 1430;

	// Schema wheel.
  var g_xCenter     = 0;
  var g_yCenter     = 400;
  var g_radiusWheel = 250;

  // Points.
	var g_angleIncrement = 0;
  var g_pointGroup     = null;
  var g_indexPoint     = 0;

	// Data arrays.
	var g_arrayPoints    = new Array();
	var g_arrayConnector = new Array();
	var g_arrayArrow     = new Array();

  // Currently-selected object.
	var g_pointSelected = null;

	// Drop points.
	var g_arrayDropPosition = new Array();
	var g_xDropPoints       = 0;
	var g_yDropPoints       = 0;
	var g_pointDrag         = null;
  var g_pointDropover     = null;

  // Text strings.
  var g_uiStr = {
    tipIntoMain_: "and any descendants into the main view.",
    erTooHeavy_ : "The selected set of tables is too large to load. Try selecting a table that is lower in the hierarchy."
  };

	// ============================================================================
	// BASIC CONTENT.
	// ============================================================================

	// CREATE BASIC CONTENTS.
	function createBasicContents() {

		// EVENT HANDLERS.

		// Icon images.
		$( ".icon" ).on ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
		$( ".icon" ).on ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

    // Assign window keydown events. Updates var in tree.js.
    $( window ).bind( "keydown", function( event ) {
      if ( event.keyCode == 16 ) { t_SHIFTDown = true; }
    });

    $( window ).bind( "keyup", function( event ) {
      if ( event.keyCode == 16 ) { t_SHIFTDown = false; }
    });

    // CONTENTS.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip0" ) );
    stc_clearTooltip( $( "#_tooltip1" ) );

    // Set tree height.
		$( "#_containerTree" ).css( "height", 500 );

    // Create stage and layer for wheel.
    g_stageMain = new Kinetic.Stage({ container: "_main", height: g_hStageMain, width: g_wStageMain, draggable: true });
    g_layerMain = new Kinetic.Layer();

	  // Add layer to stage, create schema wheel, assign event handlers for stage.
	  if ( g_stageMain && g_layerMain ) {
	    // Add layer to stage.
	    g_stageMain.add( g_layerMain );

	    // Create schema wheel.
	    createSchemaWheel();

	    // Assign event handler(s) for stage.
	    handleStageDragEnd( g_stageMain );
	  }//g_stageMain g_layerMain valid

    // Hide load tooltip.
    g_indexPageRef.hideLoadTooltip();
	}//createBasicContents

	// CREATE SCHEMA WHEEL.
	function createSchemaWheel() {
    g_xCenter = g_wStageMain * .5;

    var schemaWheel_ = new Kinetic.Circle({
      x: g_xCenter, y: g_yCenter,
      radius: g_radiusWheel,
      fillRadialGradientStartPoint: [0, 0],
      fillRadialGradientStartRadius: g_radiusWheel,
      fillRadialGradientEndPoint: [0, -300],
      fillRadialGradientEndRadius: g_radiusWheel * .2,
      fillRadialGradientColorStops: [0, s_color.blueLight_, 1, s_white],
      stroke: s_color.blueLight_, strokeWidth: 5
    });

    var overlay_ = new Kinetic.Circle({
      x: g_xCenter, y: g_yCenter - g_radiusWheel * .5,
      radius: g_radiusWheel * .5, scaleX: 1.3,
      fillRadialGradientStartPoint: [0, 0],
      fillRadialGradientStartRadius: g_radiusWheel * .5,
      fillRadialGradientEndPoint: [0, -200],
      fillRadialGradientEndRadius: g_radiusWheel * .1,
      fillRadialGradientColorStops: [0, s_color.blueLight_, 1, s_white]
    });

    // Add event handlers, then add elements to layer.
    if ( schemaWheel_ && overlay_ ) {
	    // Add event handlers.
	    handleClickWheel( schemaWheel_ );
	    handleClickWheel( overlay_ );

      // Add to layer.
      g_layerMain.add( schemaWheel_ );
      g_layerMain.add( overlay_ );
      g_layerMain.draw();
    }//schemaWheel_ overlay_ valid
	}//createSchemaWheel

  // RUN INITIAL LOAD.
  function runInitialLoad() {
    if ( t_loadMainID != "" && t_loadMainParentName != "" && t_loadMainName != "" && t_loadRowID != "" ) {
	    // Select rows using current vals in selection vars. Eventually comes back here and fires createWheelElements.
	    tree_doSelectRows( t_loadMainID, t_loadMainParentName, t_loadMainName, t_loadRowID );
    } else {
      // Destroy any existing elements.
      destroyWheelElements( true );
    }//not empty

    // Send service to get stats for all tables in database.
    g_indexPageRef.getStatDBList();
  }//runInitialLoad

  // WIPE OUT LOAD.
  function wipeOutLoad() {
    // Destroy any existing elements. Used when user is doing something that does not reload tree, such as creating new root.
    destroyWheelElements( true );
  }//wipeOutLoad

  // CREATE WHEEL ELEMENTS.
  function createWheelElements() {
    // Destroy any existing elements.
    destroyWheelElements( true );

    // Init processing vars.
    g_arrayPoints    = new Array();
    g_arrayConnector = new Array();
    g_arrayArrow     = new Array();
    g_angleIncrement = 0;
    g_pointGroup     = null;
    g_xDropPoints    = g_xCenter + g_stageMain.getX();
    g_yDropPoints    = g_yCenter + g_stageMain.getY();

    // If number of tables not too large to load, continue.
    // If too large, show log and do not create wheel elements.
    if ( t_treeSelections.length < g_vals.loadTooHeavy_ ) {
	    // Set text for load message.
	    if ( stc_isDefined( t_loadMainID ) ) {
		    // COMMENTED OUT. Not actually needed, and it interferes with error messages. Populate message log.
		    //g_indexPageRef.populateLog( s_message.loading_ + " " + t_loadMainName + " " + g_uiStr.tipIntoMain_, s_svcVals.success_ );
	    }//t_loadMainID valid

	    // Create points.
	    doCreatePoints();
	    connectPoints();
	    createUnderlay();
	    createLabels();
	    createDropPoints();

	    // Move points to top.
	    if ( g_pointGroup ) { g_pointGroup.moveToTop(); }
	    g_layerMain.draw();
    } else {
      // Number of tables too large to load. Populate message log.
      g_indexPageRef.populateLog( g_uiStr.erTooHeavy_, s_svcVals.error_ );
    }//length not lt loadTooHeavy_
	}//createWheelElements

	// DESTROY WHEEL ELEMENTS.
	function destroyWheelElements( destroyAll_ ) {
    if ( destroyAll_ ) {
		  if ( stc_isDefined( $( ".dropPoint" ) ) ) { $( ".dropPoint" ).remove(); }
		  if ( stc_isDefined( g_pointGroup ) ) { g_pointGroup.destroy(); }
    }//destroyAll_ true

	  var connectorGroup_ = stc_getElement( stc_getIdentifier( "", s_strConnectors ), g_stageMain );
	  if ( stc_isDefined( connectorGroup_ ) ) { connectorGroup_.destroy(); }

	  var groupUnderlay_ = stc_getElement( stc_getIdentifier( "", s_strUnderlays ), g_stageMain );
	  if ( stc_isDefined( groupUnderlay_ ) ) { groupUnderlay_.destroy(); }

	  var labelGroup_ = stc_getElement( stc_getIdentifier( "", s_strLabels ), g_stageMain );
	  if ( stc_isDefined( labelGroup_ ) ) { labelGroup_.destroy(); }

    g_layerMain.draw();
	}//destroyWheelElements

	// ============================================================================
	// POINTS.
	// ============================================================================

	// DO CREATE POINTS.
	function doCreatePoints() {
		if ( stc_isDefined( t_objectSelected ) && stc_isDefined( t_treeSelections ) ) {
	    // Create group for handling points.
	    g_pointGroup = new Kinetic.Group({
	      id: stc_getIdentifier( "", s_strPoints ), x: g_xCenter, y: g_yCenter
	    });

	    // Set angle increment.
	    g_angleIncrement = 360 / t_treeSelections.length;

	    // Set point index.
	    g_indexPoint = 0;

	    // Create point array and draw points for each table in selected tree object.
      // Draw first point.
	    if ( !tree_isRoot( t_objectSelected.type ) ) {
		    // Build ID.
		    var id_ = tree_buildTreeID( t_objectSelected );

        // Create point object and add to group.
        if ( stc_isDefined( id_ ) ) {
		      createOnePoint( id_, t_objectSelected );
        }//id_ valid
	    }//not root

	    // Recurse.
	    if ( stc_isDefined( t_objectSelected.tables )  ) {
	      if ( t_objectSelected.tables.length > 0 ) {
	        createPoints( t_objectSelected.tables );
	      }//tables not empty
	    }//tables valid

	    // Add group to layer.
	    g_layerMain.add( g_pointGroup );
		}//params valid
	}//doCreatePoints

	// CREATE POINTS.
	function createPoints( obj_ ) {
    for ( i in obj_ ) {
      if ( typeof( obj_[i] ) == "object" ) {
		    if ( !tree_isRoot( obj_[i].type ) ) {
			    // Build ID.
			    var id_ = tree_buildTreeID( obj_[i] );

	        // Create point object and add to group.
	        if ( stc_isDefined( id_ ) ) {
			      createOnePoint( id_, obj_[i] );
	        }//id_ valid
		    }//not root

        // Recurse.
        createPoints( obj_[i] );
      }//if object
    }//for each obj_
	}//createPoints

	// CREATE ONE POINT.
	function createOnePoint( id_, obj_ ) {
		if ( stc_isDefined( g_pointGroup ) && stc_isDefined( id_ ) && stc_isDefined( obj_ ) ) {
	    // Init properties.
	    var point_              = new Object();
	    point_.id               = id_;
	    point_.parentName       = "";
	    point_.name             = "";
	    point_.type             = "";
	    point_.avgTime          = 0;
	    point_.totalTimePercent = 0;
	    point_.totalTime        = 0;
	    point_.frequency        = 0;
	    point_.heat             = 0;
	    point_.tables           = new Array();
	    point_.angle            = ( g_angleIncrement * g_indexPoint );
	    point_.x                = ( g_radiusWheel * Math.cos( ( g_angleIncrement * g_indexPoint ) * ( Math.PI / 180 ) ) );
	    point_.y                = ( g_radiusWheel * Math.sin( ( g_angleIncrement * g_indexPoint ) * ( Math.PI / 180 ) ) );
	    point_.onLeft           = false;

	    // Set properties.
	    if ( stc_isDefined( obj_.parentName ) )       { point_.parentName       = obj_.parentName; }
	    if ( stc_isDefined( obj_.name ) )             { point_.name             = obj_.name; }
	    if ( stc_isDefined( obj_.type ) )             { point_.type             = obj_.type; }
      if ( stc_isDefined( obj_.avgTime ) )          { point_.avgTime          = stc_addCommas( parseInt( obj_.avgTime ) ); }
      if ( stc_isDefined( obj_.totalTimePercent ) ) { point_.totalTimePercent = parseInt( obj_.totalTimePercent ); }
      if ( stc_isDefined( obj_.totalTime ) )        { point_.totalTime        = stc_addCommas( parseInt( obj_.totalTime ) ); }
      if ( stc_isDefined( obj_.frequency ) )        { point_.frequency        = stc_addCommas( parseInt( obj_.frequency ) ); }
      if ( stc_isDefined( obj_.heat ) )             { point_.heat             = parseInt( obj_.heat ); }

	    // Build simple array of IDs for tables property.
	    var tablesWork_ = tree_buildTablesIDArray( obj_ );
	    point_.tables   = $.merge( point_.tables, tablesWork_ );

	    // If point is on left side of circle, set it up for label text to go other way.
	    if ( point_.angle > 90 && point_.angle < 270 ) {
	      point_.angle += 180; point_.onLeft = true;
	    }//angle gt 90 and lt 270

		  // Add point to point arrays.
		  g_arrayPoints.push( point_ );

	    // Set point params.
	    var radius_      = 7;
	    var strokeWidth_ = 2;
	    var fill_        = s_white;
	    if ( stc_getHeatFill( point_.heat ) ) {
	      fill_ = stc_getHeatFill( point_.heat );
	    }//fill valid

	    // If heat is low, set color to nondescript.
	    if ( point_.heat < s_heatVals.cold_ ) {
	      fill_ = s_white;
	    }//heat_ lt s_heatVals.cold_

	    // Draw point.
	    // Set name to index, so we can use it to look up properties.
	    var pointCircle_ = new Kinetic.Circle({
	      id: stc_getIdentifier( point_.id, s_strPoint ),
	      name: g_indexPoint, draggable: true,
	      x: point_.x, y: point_.y,
	      fill: fill_,
	      radius: radius_,
	      stroke: s_white, strokeWidth: strokeWidth_
	    });
	    if ( pointCircle_ ) {
	      // Add event handlers.
	      handleClickPoint( pointCircle_ );
	      handleMouseOverPoint( pointCircle_ );
	      handleMouseOutPoint( pointCircle_ );
	      handlePointDragStart( pointCircle_ );
	      handlePointDragMove( pointCircle_ );
	      handlePointDragEnd( pointCircle_ );

	      // Add point to group.
	      g_pointGroup.add( pointCircle_ );
	    }//pointCircle_ valid

	    // Increment index.
	    g_indexPoint++;
		}//params valid
	}//createOnePoint

	// CONNECT POINTS.
	function connectPoints() {
	  if ( g_arrayPoints ) {
	    // Create group for handling connectors.
	    var connectorGroup_ = new Kinetic.Group({
	      id: stc_getIdentifier( "", s_strConnectors ) , x: g_xCenter, y: g_yCenter
	    });
	    if ( connectorGroup_ ) {
		    // Connect points for each table in g_arrayPoints.
		    var length_ = g_arrayPoints.length;
		    for ( var i = 0; i < length_; i++ ) {
				  if ( stc_isDefined( g_arrayPoints[i].id ) &&
				       stc_isDefined( g_arrayPoints[i].tables ) &&
				       stc_isNumber( g_arrayPoints[i].x ) &&
				       stc_isNumber( g_arrayPoints[i].y ) ) {

					  if ( g_arrayPoints[i].tables.length > 0 ) {
              connectChildrenPoints( connectorGroup_, g_arrayPoints[i].id, g_arrayPoints[i].tables, g_arrayPoints[i].x, g_arrayPoints[i].y );
					  }//tables_ not empty
				  }//parameters valid
		    }//for each table

		    // Add group to layer.
		    g_layerMain.add( connectorGroup_ );
	    }//connectorGroup_ valid
	  }//g_arrayPoints valid
	}//connectPoints

	// CONNECT CHILDREN POINTS.
	function connectChildrenPoints( connectorGroup_, sourceID_, tables_, x_, y_ ) {
		if ( stc_isDefined( connectorGroup_ ) &&
		     stc_isDefined( sourceID_ ) &&
		     stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {

			// Loop thru children and connect current table to its child tables.
			var length_ = tables_.length;
			for ( var i = 0; i < length_; i++ ) {
			  // Get target properties.
			  var targetID_ = tables_[i];
			  var xTarget_  = 0;
			  var yTarget_  = 0;
			  if ( stc_isDefined( targetID_ ) ) {
				  xTarget_  = getPointProperty( targetID_, "x_" );
				  yTarget_  = getPointProperty( targetID_, "y_" );
			  }//targetID_ valid

			  // Set parameters and create connector.
			  if ( stc_isDefined( targetID_ ) &&
			       stc_isNumber( xTarget_ ) && stc_isNumber( yTarget_ ) ) {

			    if ( targetID_ !== sourceID_ ) {
					  // Round source x/y.
					  x_ = Math.round( x_ );
					  y_ = Math.round( y_ );

					  // Set target x/y.
					  var x3_ = Math.round( xTarget_ );
					  var y3_ = Math.round( yTarget_ );

					  // Set curve tension.
					  var tension_ = .75;

					  // Calculate offsets used to determine midway points.
					  var x2Offset_ = 0;
					  if ( x_ > x3_ ) { x2Offset_ = x_ - x3_; }
					  if ( x3_ > x_ ) { x2Offset_ = -( x3_ - x_ ); }
					  x2Offset_ = ( x2Offset_ * .5 ) + 20;

					  var y2Offset_ = 0;
					  if ( y_ > y3_ ) { y2Offset_ = y_ - y3_; }
					  if ( y3_ > y_ ) { y2Offset_ = -( y3_ - y_ ); }
					  y2Offset_ = ( y2Offset_ * .5 ) + 20;

			      // Create connector.
			      if ( stc_isNumber( x2Offset_ ) &&
			           stc_isNumber( y2Offset_ ) &&
			           stc_isNumber( x3_ ) && stc_isNumber( y3_ ) ) {

			        connectPoint( connectorGroup_, sourceID_, targetID_, x_, y_, x2Offset_, y2Offset_, x3_, y3_, tension_ );
			      }//numbers valid
			    }//targetID_ is not sourceID_
			  }//targetID_ xTarget_ yTarget_ valid
			}//for each child in array
		}//parameters valid
	}//connectChildrenPoints

	// CONNECT POINT.
	function connectPoint( connectorGroup_, sourceID_, targetID_, x1_, y1_, x2Offset_, y2Offset_, x3_, y3_, tension_ ) {
    if ( connectorGroup_ &&
         stc_isDefined( sourceID_ ) &&
         stc_isDefined( targetID_ ) &&
         stc_isNumber( x1_ ) && stc_isNumber( y1_ ) &&
         stc_isNumber( x2Offset_ ) && stc_isNumber( y2Offset_ ) &&
         stc_isNumber( x3_ ) && stc_isNumber( y3_ ) &&
         stc_isNumber( tension_ ) ) {

	    // Set the midway points and adjust if they go beyond bounds of schema wheel.
	    var x2_ = x3_ + x2Offset_;
	    var y2_ = y3_ + y2Offset_;

	    if ( x2_ < -g_radiusWheel ) { x2_ = -g_radiusWheel + 20; }
	    if ( x2_ > g_radiusWheel )  { x2_ = g_radiusWheel - 20; }

	    if ( y2_ < -g_radiusWheel ) { y2_ = -g_radiusWheel + 20; }
	    if ( y2_ > g_radiusWheel )  { y2_ = g_radiusWheel - 20; }

	    // Create connector.
	    if ( stc_isNumber( x2_ ) && stc_isNumber( y2_ ) ) {
		    var curve_ = new Kinetic.Spline({
		      id: stc_getComboID( sourceID_, targetID_ ),
		      points: [ { x: x1_, y: y1_ }, { x: x2_, y: y2_ }, { x: x3_, y: y3_ } ],
		      stroke: s_white, strokeWidth: 1,
		      lineCap: s_lineCap, lineJoin: s_lineJoin,
		      tension: tension_, opacity: 0.2
		    });

		    // Add to group and push IDs to array.
		    if ( curve_ ) {
		      // Add to group.
		      connectorGroup_.add( curve_ );

			    // Add IDs to shortcut array.
			    var connector_      = new Object();
			    connector_.id       = stc_getComboID( sourceID_, targetID_ );
			    connector_.sourceID = sourceID_;
			    connector_.targetID = targetID_;
			    if ( connector_ ) {
			      g_arrayConnector.push( connector_ );
			    }//connector_ valid
		    }//curve_ valid

		    // Create direction arrow.
		    var arrow_ = sh_createDirectionArrow( stc_getComboID( sourceID_, targetID_ + s_strArrow ), s_white, s_white, 1.0 );

		    // Add to group, push ID to array, set properties, hide.
		    if ( arrow_ ) {
		      // Add to group.
		      connectorGroup_.add( arrow_ );

			    // Add ID to shortcut array.
		      g_arrayArrow.push( stc_getComboID( sourceID_, targetID_ + s_strArrow ) );

		      // Set position.
		      arrow_.setX( x2_ );
		      arrow_.setY( y2_ );

	        // Subtract mid position from start position.
	        var xArrow_ = x3_ - x1_;
	        var yArrow_ = y3_ - y1_;

	        // Get rotation.
	        var rot_ = ( ( Math.atan2( yArrow_, xArrow_ ) * 180/Math.PI ) );

	        // Set rotation.
	        if ( stc_isNumber( rot_ ) ) {
	          arrow_.setRotationDeg( rot_ );
	        }//rot_ valid

	        // Hide.
	        arrow_.hide();
		    }//arrow_ valid
	    }//numbers valid
    }//parameters valid
	}//connectPoint

	// CREATE UNDERLAY.
	function createUnderlay() {
	  if ( g_arrayPoints ) {
	    // Create group for handling underlays.
	    var groupUnderlay_ = new Kinetic.Group({
	      id: stc_getIdentifier( "", s_strUnderlays ), x: g_xCenter, y: g_yCenter
	    });
	    if ( groupUnderlay_ ) {
	      // Create underlay for each table in g_arrayPoints.
		    var length_ = g_arrayPoints.length;
		    for ( var i = 0; i < length_; i++ ) {
			    if ( stc_isDefined( g_arrayPoints[i].id ) &&
			         stc_isDefined( g_arrayPoints[i].heat ) &&
			         stc_isNumber( g_arrayPoints[i].x ) &&
			         stc_isNumber( g_arrayPoints[i].y ) ) {

				    // Get ID.
				    var id_ = g_arrayPoints[i].id;

			      // Get heat.
			      var heat_ = g_arrayPoints[i].heat;

				    // Create underlay group.
				    var underlay_ = new Kinetic.Group({
				      id: stc_getIdentifier( id_, s_strUnderlay ),
				      x: ( g_arrayPoints[i].x ) - 18, y: ( g_arrayPoints[i].y ) - 18,
				      listening: true
				    });
				    if ( underlay_ ) {
			        // Add circle.
				      var underlayCircle_ = sh_createPointUnderlay( stc_getIdentifier( id_, s_strUnderlayCircle ) );
				      if ( underlayCircle_ ) {
				        // Set opacity.
				        underlayCircle_.setOpacity( 0.2 );

				        // Add to group.
				        underlay_.add( underlayCircle_ );
				      }//underlayCircle_ valid

				      // Add underlay group to main group, then set properties.
				      groupUnderlay_.add( underlay_ );
				      underlay_.setScale( .35 );

				      // If heat is low, hide underlay.
					    if ( heat_ < s_heatVals.cold_ ) {
					      underlay_.hide();
					    }//heat_ lt s_heatVals.cold_
					  }//underlay_ valid
			    }//properties valid
		    }//for each table

		    // Add group to layer.
		    g_layerMain.add( groupUnderlay_ );
	    }//groupUnderlay_ valid
	  }//g_arrayPoints valid
	}//createUnderlay

	// CREATE LABELS.
	// Labels consist of text and rectangle under text.
	function createLabels() {
	  if ( g_arrayPoints ) {
	    // Create group for handling labels.
	    var labelGroup_ = new Kinetic.Group({
	      id: stc_getIdentifier( "", s_strLabels ), x: g_xCenter, y: g_yCenter
	    });
	    if ( labelGroup_ ) {
	      // Create labels for each table in g_arrayPoints.
	      var length_ = g_arrayPoints.length;
		    for ( var i = 0; i < length_; i++ ) {
		      if ( stc_isDefined( g_arrayPoints[i].id ) &&
		           stc_isDefined( g_arrayPoints[i].name ) &&
		           stc_isNumber( g_arrayPoints[i].heat ) &&
		           stc_isNumber( g_arrayPoints[i].x ) &&
		           stc_isNumber( g_arrayPoints[i].y ) &&
		           stc_isNumber( g_arrayPoints[i].angle ) ) {

				    // Get ID.
				    var id_ = g_arrayPoints[i].id;

			      // Set basic text.
						var textWork_ = "";
						if ( g_arrayPoints[i].name !== "" ) {
						  textWork_ = g_arrayPoints[i].name;
						}//name_ not empty

			      // Normalize text to exact number of characters.
						// Insert ellipsis at end to indicate there is more.
						var textNormalized_ = stc_normalizeText( textWork_, g_vals.charLimit_ );
						textNormalized_     = stc_addEllipsis( g_arrayPoints[i].name, textNormalized_, g_vals.charLimit_ );
						textNormalized_     = "     " + textNormalized_ + "     ";

			      // Set text parameters.
			      var x_     = g_arrayPoints[i].x;
			      var y_     = g_arrayPoints[i].y;
			      var angle_ = g_arrayPoints[i].angle;

			      // Create text.
			      var labelText_ = new Kinetic.Text({
			        id: stc_getIdentifier( id_, s_strLabelText ), x: x_, y: y_,
			        fontSize: 12, fontFamily: s_fontFamily, fontStyle: "bold",
			        align: "left", fill: s_white, rotationDeg: angle_,
			        text: textNormalized_
			      });
			      if ( labelText_ ) {
					    // If point is on left side of circle, position text other way.
					    var xAlt_ = 0;
					    var yAlt_ = 0;
				      if ( g_arrayPoints[i].onLeft == true ) {
				        xAlt_ = x_ - labelText_.getTextWidth() * Math.cos( ( angle_ ) * ( Math.PI / 180 ) );
				        yAlt_ = y_ - labelText_.getTextWidth() * Math.sin( ( angle_ ) * ( Math.PI / 180 ) );
				        if ( stc_isNumber( xAlt_ ) && stc_isNumber( yAlt_ ) ) {
					        labelText_.setX( xAlt_ );
					        labelText_.setY( yAlt_ );
				        }//numbers valid
				      }//angle_ gt 90 and lt 270

				      // Set rectangle parameters.
				      // Must be offset, because position/angle of point defines vector that is used by Kinetic as top, not center, of text.
				      // Because rectangle's position/angle are based on text position/angle, that vector is also used for rectangle.
				      var xRect_      = labelText_.getX();
				      var yRect_      = labelText_.getY();
				      var hRect_      = labelText_.getTextHeight() * 2;
				      var wRect_      = labelText_.getTextWidth();
				      var offsetRect_ = labelText_.getTextHeight();
				      xRect_           = xRect_ + ( offsetRect_ * Math.sin( angle_ * ( Math.PI / 180 ) ) );
				      yRect_           = yRect_ - ( offsetRect_ * Math.cos( angle_ * ( Math.PI / 180 ) ) );

				      // Create rectangle.
				      if ( stc_isNumber( xRect_ ) && stc_isNumber( yRect_ ) &&
				           stc_isNumber( hRect_ ) && stc_isNumber( wRect_ ) &&
				           stc_isNumber( labelText_.getRotationDeg() ) &&
				           stc_isDefined( stc_getTypeFill( g_arrayPoints[i].type ) ) ) {

					      // Get fill.
					      var fill_ = stc_getTypeFill( g_arrayPoints[i].type );
					      if ( fill_ == "#ffffff" ) { fill_ = s_color.blueDark_; }

					      // Create rectangle.
					      var labelRect_ = new Kinetic.Rect({
					        id: stc_getIdentifier( id_, s_strLabelRect ),
					        x: xRect_, y: yRect_, height: hRect_, width: wRect_,
					        fill: fill_, rotationDeg: labelText_.getRotationDeg(),
					        cornerRadius: 12
					      });

					      // Add rectangle to group. If table is low heat, hide rectangle.
					      if ( labelRect_ ) {
					        // Add to group.
					        labelGroup_.add( labelRect_ );

						      // Hide label for tables with low heat.
						      if ( g_arrayPoints[i].heat < s_heatVals.cold_ ) {
						        labelText_.hide();
						        labelRect_.hide();
						      }//heat_ lt s_heatVals.cold_
					      }//labelRect_ valid
				      }//parameters valid

				      // Offset text.
				      // Must be offset, because position/angle of point defines vector that is used by Kinetic as top, not center, of text.
				      // Do this after creating rectangle.
				      var factorText_ = labelText_.getTextHeight() * .5;
				      var xText_      = labelText_.getX() + ( factorText_ * Math.sin( angle_ * ( Math.PI / 180 ) ) );
				      var yText_      = labelText_.getY() - ( factorText_ * Math.cos( angle_ * ( Math.PI / 180 ) ) );
				      if ( stc_isNumber( xText_ ) && stc_isNumber( yText_ ) ) {
				        labelText_.setX( xText_ );
				        labelText_.setY( yText_ );
				      }//numbers valid

				      // Add text to group. To put it on top of rectangle, do this after adding rectangle to group.
				      labelGroup_.add( labelText_ );

			        // Add event handlers.
			        handleMouseOverLabel( labelText_ );
			        handleMouseOutLabel( labelText_ );
			      }//labelText_ valid
		      }//properties valid
		    }//for each table

		    // Add group to layer.
		    g_layerMain.add( labelGroup_ );
	    }//labelGroup_ valid
	  }//g_arrayPoints valid
	}//createLabels

	// CREATE DROP POINTS.
	function createDropPoints() {
	  if ( g_arrayPoints && stc_isDefined( $( "#_dropPoints" ) ) ) {
      // Create drop point for each table in g_arrayPoints.
	    var length_ = g_arrayPoints.length;
	    for ( var i = 0; i < length_; i++ ) {
		    if ( stc_isDefined( g_arrayPoints[i].id ) &&
		         stc_isNumber( g_arrayPoints[i].x ) &&
		         stc_isNumber( g_arrayPoints[i].y ) ) {

			    // Get ID and name.
			    var id_   = stc_getIdentifier( g_arrayPoints[i].id, s_strDropPoint );
			    var name_ = g_arrayPoints[i].name;

			    // Get position.
			    var x_        = g_xDropPoints + ( g_arrayPoints[i].x - 7 );
			    var y_        = g_yDropPoints + ( g_arrayPoints[i].y - 7 );
			    var position_ = "position: absolute; " + "top: " + y_ + "px; left: " + x_ + "px;";

			    // Create drop point. Append to parent and assign events.
			    var dropPoint_ = "<div id='" + id_ + "' name='" + name_ + "' class='dropPoint' style='" + position_ + "'>&nbsp;</div>";
			    if ( dropPoint_ ) {
		        // Append to parent.
		        $( "#_dropPoints" ).append( dropPoint_ );

		        // Assign events.
		        $( "#" + id_ ).droppable ({
		          accept   : "*",
		          tolerance: "pointer"
		        });
		        $( "#" + id_ ).on ( "dropover", function( event, ui ) { handleDropPoint( event, ui, "dropover" ); } );
		        $( "#" + id_ ).on ( "dropout", function( event, ui )  { handleDropPoint( event, ui, "dropout" ); } );
		        $( "#" + id_ ).on ( "drop", function( event, ui )     { handleDropPoint( event, ui, "drop" ); } );
				  }//dropPoint_ valid
		    }//properties valid
	    }//for each table
	  }//params valid
	}//createDropPoints

	// GET POINT PROPERTY.
	function getPointProperty( id_, selection_ ) {
    var property_ = "";
		var length_   = g_arrayPoints.length;
		for ( var i = 0; i < length_; i++ ) {
	    if ( stc_isDefined( g_arrayPoints[i].id ) ) {
		    if ( g_arrayPoints[i].id == id_ ) {
			    switch( selection_ ) {

		        case "heat_"            : if ( stc_isNumber( g_arrayPoints[i].heat ) )             { property_ = g_arrayPoints[i].heat; }             break;
		        case "name_"            : if ( stc_isDefined( g_arrayPoints[i].name ) )            { property_ = g_arrayPoints[i].name; }             break;
		        case "avgTime_"         : if ( stc_isNumber( g_arrayPoints[i].avgTime ) )          { property_ = g_arrayPoints[i].avgTime; }          break;
		        case "totalTimePercent_": if ( stc_isNumber( g_arrayPoints[i].totalTimePercent ) ) { property_ = g_arrayPoints[i].totalTimePercent; } break;
		        case "totalTime_"       : if ( stc_isNumber( g_arrayPoints[i].totalTime ) )        { property_ = g_arrayPoints[i].totalTime; }        break;
		        case "frequency_"       : if ( stc_isNumber( g_arrayPoints[i].frequency ) )        { property_ = g_arrayPoints[i].frequency; }        break;
		        case "x_"               : if ( stc_isNumber( g_arrayPoints[i].x ) )                { property_ = g_arrayPoints[i].x; }                break;
		        case "y_"               : if ( stc_isNumber( g_arrayPoints[i].y ) )                { property_ = g_arrayPoints[i].y; }                break;

		        default: break;
			    }//switch selection_

				    break;
		    }//id_ matches current ID
		  }//id_ valid
		}//for each point in array
    return property_;
	}//getPointProperty

	// ============================================================================
	// EVENTS.
	// ============================================================================

	// HANDLE STAGE DRAG END.
	function handleStageDragEnd( stage_ ) {
    stage_.on( "dragend", function( event ) {
	    if ( stc_isDefined( stage_ ) ) {
	      // Use end x/y of stage to recalculate x/y for drop points.
	      g_xDropPoints = g_xCenter + stage_.getX();
	      g_yDropPoints = g_yCenter + stage_.getY();

	      // Move drop points.
	      moveDropPoints();
	    }//stage_ valid
    });
	}//handleStageDragEnd

	// HANDLE CLICK WHEEL.
	function handleClickWheel( shape_ ) {
    shape_.on( "click", function( event ) {
	    unselectAllPoints();
    });
	}//handleClickWheel

	// HANDLE CLICK POINT.
	function handleClickPoint( pointCircle_ ) {
    pointCircle_.on( "click", function( event ) {
      if ( pointCircle_ ) {
		    selectPoint( pointCircle_ );
      }//pointCircle_ valid
    });
	}//handleClickPoint

	// SELECT POINT.
	function selectPoint( pointCircle_ ) {
    if ( pointCircle_ && pointCircle_.getParent() ) {
	    // Unselect all points.
	    unselectAllPoints();

	    // Select this point.
	    g_pointSelected =  pointCircle_;

      // Set scale.
      pointCircle_.setScale( 1.5 );

      // Brighten connectors. If table has low heat, show label.
      var id_ = stc_extractIDStr( pointCircle_.getId(), s_strPoint );
      if ( stc_isDefined( id_ ) ) {
	      // Brighten table's connectors.
	      brightenSelectedConnectors( id_ );

		    // If table is low heat, show label.
		    toggleShowLabel( id_, true );
      }//id_ valid
    }//pointCircle_ parent valid
	}//selectPoint

	// UNSELECT ALL POINTS.
	function unselectAllPoints() {
	  // Close relation form.
	  tree_closeRelationForm();

    // Hide tooltips.
    stc_hideTooltip( $( "#_tooltip0" ) );
    stc_hideTooltip( $( "#_tooltip1" ) );

    // Unselect any currently-selected point.
    if ( g_pointSelected ) {
      // Restore scale.
      g_pointSelected.setScale( 1 );
    }//g_pointSelected valid

    // Null var for currently-selected point.
    g_pointSelected = null;

    // Dim all connectors.
    dimAllConnectors();

    // Hide all arrows.
    hideAllArrows();

    // Hide all low heat labels.
    hideAllLowHeatLabels();

    // Draw layer.
    g_layerMain.draw();
	}//unselectAllPoints

	// BRIGHTEN SELECTED CONNECTORS.
	function brightenSelectedConnectors( pointID_ ) {
    if ( g_arrayConnector ) {
      var length_ = g_arrayConnector.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayConnector[i].sourceID ) &&
             stc_isDefined( g_arrayConnector[i].targetID ) &&
             stc_isDefined( g_arrayConnector[i].id ) ) {

	        if ( g_arrayConnector[i].sourceID == pointID_ || g_arrayConnector[i].targetID == pointID_ ) {
		        var connector_ = stc_getElement( g_arrayConnector[i].id, g_stageMain );
		        if ( connector_ ) {
		          // Brighten connector.
		          connector_.setOpacity( 1 );
		          connector_.setStrokeWidth( 2 );

		          // Show arrow.
	            var arrowID_ = stc_getComboID( g_arrayConnector[i].sourceID, g_arrayConnector[i].targetID + s_strArrow );
	            var arrow_   = stc_getElement( arrowID_, g_stageMain );
	            if ( arrow_ ) { arrow_.show(); }

	            // Move connectors to top.
	            var connectorGroup_ = stc_getElement( stc_getIdentifier( "", s_strConnectors ), g_stageMain );
	            if ( connectorGroup_ ) { connectorGroup_.moveToTop(); }

	            // Move points to top.
	            if ( g_pointGroup ) { g_pointGroup.moveToTop(); }
		        }//connector_ valid
	        }//matches point ID
        }//sourceID_ targetID_ id_ valid
      }//for all connectors
    }//g_arrayConnector valid
    g_layerMain.draw();
	}//brightenSelectedConnectors

	// DIM ALL CONNECTORS.
	function dimAllConnectors() {
    if ( g_arrayConnector ) {
      var length_ = g_arrayConnector.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayConnector[i].id ) ) {
	        var connector_ = stc_getElement( g_arrayConnector[i].id, g_stageMain );
	        if ( connector_ ) {
	          // Dim connectors.
	          connector_.setOpacity( 0.2 );
	          connector_.setStrokeWidth( 1 );

            // Move labels to top.
            var labelGroup_ = stc_getElement( stc_getIdentifier( "", s_strLabels ), g_stageMain );
            if ( labelGroup_ ) { labelGroup_.moveToTop(); }

            // Move points to top.
            if ( g_pointGroup ) { g_pointGroup.moveToTop(); }
	        }//connector_ valid
        }//id_ valid
      }//for all connectors
    }//g_arrayConnector valid
    g_layerMain.draw();
	}//dimAllConnectors

	// HIDE ALL ARROWS.
	function hideAllArrows() {
    if ( g_arrayArrow ) {
      var length_ = g_arrayArrow.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayArrow[i] ) ) {
	        var arrow_ = stc_getElement( g_arrayArrow[i], g_stageMain );
	        if ( arrow_ ) { arrow_.hide(); }
        }//entry valid
      }//for all arrows
    }//g_arrayArrow valid
    g_layerMain.draw();
	}//hideAllArrows

	// HIDE ALL LOW HEAT LABELS.
	function hideAllLowHeatLabels() {
    if ( g_arrayPoints ) {
      var length_ = g_arrayPoints.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayPoints[i].id ) ) {
	        toggleShowLabel( g_arrayPoints[i].id, false )
        }//entry valid
      }//for all points
    }//g_arrayPoints valid
    g_layerMain.draw();
	}//hideAllLowHeatLabels

	// TOGGLE SHOW LABEL.
	// Hide/show label for table with low heat.
	function toggleShowLabel( id_, show_ ) {
    if ( stc_isDefined( id_ ) ) {
	    var heat_ = getPointProperty( id_, "heat_" );
	    if ( stc_isDefined( heat_ ) ) {
		    if ( heat_ < s_heatVals.cold_ ) {
		      var labelText_ = stc_getElement( stc_getIdentifier( id_, s_strLabelText ), g_stageMain );
		      var labelRect_ = stc_getElement( stc_getIdentifier( id_, s_strLabelRect ), g_stageMain );
		      if ( labelText_ && labelRect_ ) {
		        // Show or hide label.
		        if ( show_ ) {
			        labelText_.show();
			        labelRect_.show();
		        } else {
			        labelText_.hide();
			        labelRect_.hide();
		        }//show_ false

		        // Draw layer.
		        g_layerMain.draw();
		      }//labelText_ labelRect_ valid
			  }//heat_ lt s_heatVals.cold_
	    }//heat_ valid
    }//id_ valid
	}//toggleShowLabel

	// HANDLE MOUSE OVER LABEL.
	function handleMouseOverLabel( labelText_ ) {
    labelText_.on( "mouseover", function( event ) {
      if ( labelText_ ) {
	      var id_ = stc_extractIDStr( labelText_.getId(), s_strLabelText );
	      if ( stc_isDefined( id_ ) ) {
		      var pointCircleID_ = stc_getIdentifier( id_, s_strPoint );
	        var pointCircle_   = stc_getElement( pointCircleID_, g_stageMain );
	        if ( pointCircle_ ) {
	          // Show tooltip.
	          showPointTooltip( pointCircle_, pointCircleID_, $( "#_tooltip1" ) );
	        }//pointCircle_ valid
	      }//id_ valid
      }//labelText_ valid
    });
	}//handleMouseOverLabel

	// HANDLE MOUSE OUT LABEL.
	function handleMouseOutLabel( labelText_ ) {
    labelText_.on( "mouseout", function( event ) {
      // Hide tooltip.
      stc_hideTooltip( $( "#_tooltip1" ) );
    });
	}//handleMouseOutLabel

	// HANDLE MOUSE OVER POINT.
	function handleMouseOverPoint( pointCircle_ ) {
    pointCircle_.on( "mouseover", function( event ) {
      if ( pointCircle_ ) {
	      overPoint( pointCircle_ );
      }//pointCircle_ valid
    });
	}//handleMouseOverPoint

	// HANDLE MOUSE OUT POINT.
	function handleMouseOutPoint( pointCircle_ ) {
    pointCircle_.on( "mouseout", function( event ) {
      if ( pointCircle_ ) {
        outPoint( pointCircle_ );
      }//pointCircle_ valid
    });
	}//handleMouseOutPoint

	// OVER POINT.
	function overPoint( pointCircle_ ) {
    if ( pointCircle_ ) {
      if ( pointCircle_ != g_pointSelected ) {
	      // Apply over effect to point.
	      pointCircle_.setScale( 1.5 );

	      // Draw layer.
	      g_layerMain.draw();
      }//not selected

      // Show tooltip.
      showPointTooltip( pointCircle_, pointCircle_.getId(), $( "#_tooltip0" ) );
    }//pointCircle_ valid
	}//overPoint

	// OUT POINT.
	function outPoint( pointCircle_ ) {
    if ( pointCircle_ ) {
      if ( pointCircle_ != g_pointSelected ) {
	      // Apply out effect to point.
	      pointCircle_.setScale( 1 );

	      // Draw layer.
	      g_layerMain.draw();
      }//not selected

      // Hide tooltip.
      stc_hideTooltip( $( "#_tooltip0" ) );
    }//pointCircle_ valid
	}//outPoint

  // SHOW POINT TOOLTIP.
  function showPointTooltip( pointCircle_, pointCircleID_, tooltip_ ) {
    if ( pointCircle_ && stc_isDefined( pointCircleID_ ) && stc_isDefined( tooltip_ ) ) {
      // Extract ID, then create and show tooltip.
      var id_ = stc_extractIDStr( pointCircleID_, s_strPoint );
      if ( stc_isDefined( id_ ) ) {
	      // Setup vars for tooltip text.
	      var name_             = "";
	      var avgTime_          = "";
	      var totalTimePercent_ = "";
	      var frequency_        = "";

	      // Look up values for tooltip text.
	      var index_ = parseInt( pointCircle_.getName() );
	      if ( g_arrayPoints && stc_isNumber( index_ ) ) {
	        if ( stc_isDefined( g_arrayPoints[index_].name ) )            { name_             = g_arrayPoints[index_].name; }
	        if ( stc_isDefined( g_arrayPoints[index_].avgTime ) )         { avgTime_          = stc_addCommas( g_arrayPoints[index_].avgTime ); }
	        if ( stc_isNumber( g_arrayPoints[index_].totalTimePercent ) ) { totalTimePercent_ = g_arrayPoints[index_].totalTimePercent; }
	        if ( stc_isDefined( g_arrayPoints[index_].frequency ) )       { frequency_        = stc_addCommas( g_arrayPoints[index_].frequency ); }
	      }//g_arrayPoints index_ valid

	      // Set tooltip text.
	      var text_ = name_ + "<br>" +
	                  "<br>Average query time: " + avgTime_ + " ms" +
	                  "<br>% of total: " + totalTimePercent_ +
	                  "<br>Frequency: " + frequency_ + "/sec" +
	                  "<br><br>To move the table," +
	                  "<br>drag the point onto another table.";

	      // Position and show tooltip.
        if ( stc_isDefined( g_stageMain.getMousePosition() ) ) {
          var mousePos_ = g_stageMain.getMousePosition();
          var x_ = mousePos_.x + 20;
          var y_ = mousePos_.y - 20;
          stc_moveTooltip( tooltip_, x_, y_ );
          stc_showTooltip( tooltip_, text_, 130, 200, true );
        }//mouse position valid
      }//id_ valid
    }//pointCircle_ pointCircleID_ tooltip_ valid
  }//showPointTooltip

	// ============================================================================
	// DRAG AND DROP.
	// ============================================================================

	// CREATE HELPER.
	// Invoked from tree, not schema wheel.
	// Helper is element used to represent tree item dragged by user. It resides in schema wheel so it can remain
	// above and separate from tree and can be used in both tree and schema wheel.
	// Once it invoked by user, it becomes child of list in tree and no longer works as it should.
	// So we destroy it and recreate it at drag end. This causes helper to work correctly on next drag event.
	function createHelper() {
	  // Remove and recreate helper element.
	  $( "#_helper" ).remove();
	  $( "<div id='_helper' class='bgHelper'></div>" ).appendTo( "body" );
	  return $( "#_helper" );
	}//createHelper

	// TOGGLE SHOW DROP POINTS.
	// Invoked from both tree and schema wheel.
	function toggleShowDropPoints( show_ ) {
	  if ( stc_isDefined( $( "#_dropPoints" ) ) ) {
	    if ( show_ ) {
	      $( "#_dropPoints" ).css( "visibility", "visible" );
	    } else {
	      $( "#_dropPoints" ).css( "visibility", "hidden" );
	    }//not show
	  }//_dropPoints valid
	}//toggleShowDropPoints

  // HANDLE DROP POINT.
  function handleDropPoint( event, ui, action_ ) {
	  // Cancel event propagation.
	  event.stopPropagation();

	  // Get row and handle specified action.
	  var id_ = null;
	  if ( stc_isDefined( action_ ) && stc_isDefined( event.target.id ) ) {
	    id_ = event.target.id;
		  if ( stc_isDefined( id_ ) ) {
		    var dropPoint_ = $( "#" + id_ );
		    if ( stc_isDefined( dropPoint_ ) ) {
		      // Get point circle ID.
		      var pointCircleID_ = stc_splitStringFront( id_, s_strDropPoint );
		      pointCircleID_ = stc_getIdentifier( pointCircleID_, s_strPoint );

		      // Handle specified action.
		      if ( stc_isDefined( pointCircleID_ ) ) {
			      switch( action_ ) {

			        case "dropover":
					      // Highlight point.
				        var pointCircle_ = stc_getElement( pointCircleID_, g_stageMain );
				        if ( pointCircle_ ) {
				          overPoint( pointCircle_ );
				        }//pointCircle_ valid
			        break;

			        case "dropout":
						    // Unhighlight point.
				        var pointCircle_ = stc_getElement( pointCircleID_, g_stageMain );
				        if ( pointCircle_ ) {
				          outPoint( pointCircle_ );
				        }//pointCircle_ valid
			        break;

			        case "drop":
			          // Hide drop points.
			          toggleShowDropPoints( false );

			          // Get source and target table IDs.
			          var sourceID_ = $( "#_helper" ).attr( "name" );
			          var targetID_ = stc_splitStringFront( id_, s_strDropPoint );

					      // Update table drop.
					      tree_doUpdateTableDrop( "schemaWheel", sourceID_, targetID_ );
			        break;

			        default: break;
			      }//switch action_
		      }//pointCircleID_ valid
		    }//dropPoint_ valid
		  }//id_ valid
	  }//params valid
  }//handleDropPoint

  // MOVE DROP POINTS.
  // Move drop points so they stay on top of points after user moves stage.
  function moveDropPoints() {
	  if ( g_arrayPoints ) {
	    var length_ = g_arrayPoints.length;
	    for ( var i = 0; i < length_; i++ ) {
		    if ( stc_isDefined( g_arrayPoints[i].id ) &&
		         stc_isNumber( g_arrayPoints[i].x ) &&
		         stc_isNumber( g_arrayPoints[i].y ) ) {

			    // Get ID.
			    var id_ = stc_getIdentifier( g_arrayPoints[i].id, s_strDropPoint );

			    // Set new position and move drop point.
			    if ( $( "#" + id_ ) ) {
			      // Set new position.
			      var x_ = g_xDropPoints + ( g_arrayPoints[i].x - 7 );
			      var y_ = g_yDropPoints + ( g_arrayPoints[i].y - 7 );

			      // Move drop point.
		        $( "#" + id_ ).css( "top", y_ );
		        $( "#" + id_ ).css( "left", x_ );
				  }//drop point valid
		    }//properties valid
	    }//for each table
	  }//params valid
	}//moveDropPoints

	// CREATE DROP POSITION ARRAY.
  // Create array of drop point positions. Used to detect dropover targets when user drags point.
  function createDropPositionArray() {
	  g_arrayDropPosition = new Array();
	  if ( stc_isDefined( g_arrayPoints ) ) {
	    var obj_    = new Object();
	    var radius_ = 7;
	    var length_ = g_arrayPoints.length;
	    for ( var i = 0; i < length_; i++ ) {
		    if ( stc_isDefined( g_arrayPoints[i].id ) &&
		         stc_isNumber( g_arrayPoints[i].x ) &&
		         stc_isNumber( g_arrayPoints[i].y ) ) {

			    // Set properties.
			    obj_        = new Object();
			    obj_.id     = g_arrayPoints[i].id;
					obj_.left   = g_arrayPoints[i].x - radius_;
					obj_.right  = g_arrayPoints[i].x + radius_;
					obj_.bottom = g_arrayPoints[i].y + radius_;
					obj_.top		= g_arrayPoints[i].y - radius_;

					// Add object to array.
					g_arrayDropPosition.push( obj_ );
		    }//properties valid
	    }//for each table
	  }//params valid
	}//createDropPositionArray

	// HANDLE POINT DRAG START.
	function handlePointDragStart( pointCircle_ ) {
    pointCircle_.on( "dragstart", function( event ) {
	    // Unselect all points.
	    unselectAllPoints();

	    // Init var for dragged point.
	    g_pointDrag = null;

	    // Handle event.
	    if ( stc_isDefined( pointCircle_ ) ) {
	      // Store dragged point.
	      g_pointDrag = pointCircle_;

	      // Create array of drop point positions. Used to detect dropover targets when user drags point.
	      createDropPositionArray();

	      // Hide tooltips.
	      stc_hideTooltip( $( "#_tooltip0" ) );
	      stc_hideTooltip( $( "#_tooltip1" ) );

	      // Move point to top.
	      pointCircle_.moveToTop();

	      // Draw layer.
	      g_layerMain.draw();
	    }//pointCircle_ valid
    });
	}//handlePointDragStart

	// HANDLE POINT DRAG MOVE.
	function handlePointDragMove( pointCircle_ ) {
    pointCircle_.on( "dragmove", function( event ) {
	    // Highlight and store drop target.
	    if ( stc_isDefined( pointCircle_ ) ) {
		    highlightPointDropTarget( pointCircle_ );
	    }//pointCircle_ valid
    });
	}//handlePointDragMove

	// HANDLE POINT DRAG END.
	function handlePointDragEnd( pointCircle_ ) {
    pointCircle_.on( "dragend", function( event ) {
	    if ( stc_isDefined( pointCircle_ ) ) {
	      // Get index.
	      var index_ = parseInt( pointCircle_.getName() );

	      // Update x/y and point angle.
	      // Once user moves point, we can no longer use special angles,
	      // because those are based on position around wheel.
	      if ( stc_isDefined( index_ ) ) {
	        if ( stc_isNumber( g_arrayPoints[index_].x ) && stc_isNumber( g_arrayPoints[index_].y ) ) {
	          g_arrayPoints[index_].x      = pointCircle_.getX();
	          g_arrayPoints[index_].y      = pointCircle_.getY();
	          g_arrayPoints[index_].angle  = 0;
	          g_arrayPoints[index_].onLeft = false;
	        }//x y valid
	      }//index_ valid

		    // Highlight and store any drop target.
			  highlightPointDropTarget( pointCircle_ );

			  // Unhighlight any drop target and perform drop functions.
		    if ( stc_isDefined( g_pointDropover ) ) {
		      // Unhighlight target.
		      outPoint( g_pointDropover );

		      // Perform drop functions.
		      handlePointDropTarget();
		    }//g_pointDropover valid

	      // Redraw wheel elements to match new point positions.
	      destroyWheelElements( false );
		    connectPoints();
		    createUnderlay();
		    createLabels();

		    // Move points to top.
		    if ( g_pointGroup ) { g_pointGroup.moveToTop(); }
		    g_layerMain.draw();
	    }//pointCircle_ valid
    });
	}//handlePointDragEnd

	// HIGHLIGHT POINT DROP TARGET.
	function highlightPointDropTarget( pointCircle_ ) {
    // Remove highlight from last target, then set to null.
    if ( stc_isDefined( g_pointDropover ) ) {
      outPoint( g_pointDropover );
      g_pointDropover = null;
    }//g_pointDropover valid

    // Highlight and store drop target.
    if ( stc_isDefined( pointCircle_ ) ) {
	    // Create object with position properties.
	    var obj_    = new Object();
	    var radius_ = 7;
	    var x_      = pointCircle_.getX();
	    var y_      = pointCircle_.getY();
			obj_.left   = x_ - radius_;
			obj_.right  = x_ + radius_;
			obj_.bottom = y_ + radius_;
			obj_.top		= y_ - radius_;

			// Set object ID.
			var pointCircleID_ = pointCircle_.getId();
	    var id_            = stc_splitStringFront( pointCircleID_, s_strPoint );
	    obj_.id            = id_;

			// Check for intersection with any other point.
			var target_ = null;
			if ( stc_isDefined( obj_ ) ) {
			  target_ = stc_checkShapeIntersection( obj_, g_arrayDropPosition );
			}//obj_ valid

			// Highlight and store any drop target.
			if ( stc_isDefined( target_ )  ) {
			  if ( target_.intersect ) {
	        var targetCircleID_ = stc_getIdentifier( target_.id, s_strPoint );
	        var targetCircle_   = stc_getElement( targetCircleID_, g_stageMain );
	        if ( targetCircle_ ) {
	          // Store target.
	          g_pointDropover = targetCircle_;

	          // Highlight target.
	          overPoint( targetCircle_ );
	        }//targetCircle_ valid
			  }//intersect
			}//target_ valid
    }//pointCircle_ valid
	}//highlightPointDropTarget

	// HANDLE POINT DROP TARGET.
	function handlePointDropTarget() {
    if ( stc_isDefined( g_pointDrag ) && stc_isDefined( g_pointDropover ) ) {
      // Get source and target table IDs.
      var sourceID_ = g_pointDrag.getId();
      sourceID_     = stc_splitStringFront( sourceID_, s_strPoint );
      var targetID_ = g_pointDropover.getId();
      targetID_     = stc_splitStringFront( targetID_, s_strPoint );

      // Update table drop.
      tree_doUpdateTableDrop( "schemaWheel", sourceID_, targetID_ );
    }//g_pointDrag g_pointDropover valid
	}//handlePointDropTarget















