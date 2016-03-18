
  // ON DOC READY
  $( document ).ready( function() {

    // Create basic contents.
    createBasicContents();

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  var s_infinity = 1.7976931348623157E+10308;

  var s_tableType = {
    shardTreeGlobal_    : "GLOBAL_SHARD_TREE",
    shardTreeRelational_: "RELATIONAL_SHARD_TREE",
    shardTreeStatic_    : "STATIC_SHARD_TREE",
    global_             : "GLOBAL",
    child_              : "SHARD_CHILD",
    static_             : "STATIC",
    logOnly_            : "LOG_ONLY",
    nonRelational_      : "NON_RELATIONAL" };
    
  // Basic colors.
  var s_grayE = "#eeeeee";
  var s_grayD = "#dddddd";
  var s_grayC = "#cccccc";
  var s_grayB = "#bbbbbb";
  var s_grayA = "#aaaaaa";
  var s_gray9 = "#999999";
  var s_gray6 = "#666666";
  var s_gray7 = "#777777";
  var s_gray5 = "#555555";
  var s_gray3 = "#333333";
  var s_white = "#ffffff";
  var s_black = "#000000";
  var s_red   = "#FF0033";

  // Interface colors.
  var s_color = {
    whiteNear_    : "#FBFBFB",
    orangeLight_  : "#EDA121",
    orange_       : "#ED863A",
    greenLight_   : "#7ABD43",
    greenDark_    : "#3C5C21",
    turquoise_    : "#78C9AA",
    turquoiseGray_: "#7C9799",
    blueLight_    : "#41B2C3",
    blueDark_     : "#156997",
    bluePurple_   : "#635CA8",
    purple_       : "#8865AB",
    tan_          : "#C6C2A1",
    brown_        : "#922822",
    yellow_       : "#FFFF00",
    yellowLight_  : "#FFFF99",
    amber_        : "#FF9900" };
  
  // Basic vals.
  // Changes in hNavMax_ and wNavMax_ must reflect values in canvasMiniContainer class in css.
  // hNavMax_ must be 30 less than max-height in css.
  // wNavMax_ must be same as max-width in css.
  var g_vals = {
    hStage_         : 710,
    wStage_         : 1430,
    xLayout_        : 100,
    yLayout_        : 100,
    wTable_         : 150,
    hTable_         : 210,
    scaleMain_      : 1.0,
    scaleMini_      : 0.1,
    hNavMax_        : 270,
    hNavMaxOffset_  : 50,
    hNavMaxPadding_ : 30,
    wNavMax_        : 600,
    wNavMaxOffset_  : 10,
    hNavMin_        : 180,
    wNavMin_        : 350,
    scaleMiniMin_   : .05,
    loadHeavy_      : 30,
    loadTooHeavy_   : 50,
    gutter_         : 50,
    margin_         : 20,
    opacityDim_     : 0.5,
    opacitySelected_: 1 };

  // Main stage/layer.
  var g_stageMain  = null;
  var g_layerMain  = null;
  var g_hStageMain = g_vals.hStage_;
  var g_wStageMain = g_vals.wStage_;
  var g_scaleMain  = g_vals.scaleMain_;

	// Data arrays.
	var g_arrayMain = [{"id":"player_tree_rt_player","parentID":"rt_player_tree_testTree_","shardParentName":"rt_player","ancestorName":"testTree_","parentName":"rt_player","name":"player","text":"player","type":"SHARD_CHILD","level":1,"nbrShard":0,"keyShard":"Not found","avgTime":"500","totalTimePercent":50,"totalTime":"500","frequency":"100","heat":24,"columns":["player01","player02","player03","player04"],"foreignKeys":[],"tables":["player_auth_tree_player","player_friend_tree_player","player_game_tree_player","player_game_component_tree_player","player_game_round_tree_player","player_stat_tree_player","player_transaction_tree_player"],"related":["player_auth_tree_player","player_friend_tree_player","player_game_tree_player","player_game_component_tree_player","player_game_round_tree_player","player_stat_tree_player","player_transaction_tree_player","rt_player_tree_testTree_"],"x":805,"y":100,"positionSet":false},{"id":"player_auth_tree_player","parentID":"player_tree_rt_player","shardParentName":"rt_player","ancestorName":"rt_player","parentName":"player","name":"player_auth","text":"player_auth","type":"SHARD_CHILD","level":2,"nbrShard":0,"keyShard":"Not found","avgTime":"100,000","totalTimePercent":10,"totalTime":"100,000","frequency":"70,000","heat":20,"columns":["player_auth01","player_auth02","player_auth03","player_auth04"],"foreignKeys":[{"table":"player_auth","reference":"player","key":"player01","fk":"player_auth01"}],"tables":[],"related":["player_tree_rt_player"],"x":100,"y":360,"positionSet":false},{"id":"player_friend_tree_player","parentID":"player_tree_rt_player","shardParentName":"rt_player","ancestorName":"rt_player","parentName":"player","name":"player_friend","text":"player_friend","type":"SHARD_CHILD","level":2,"nbrShard":0,"keyShard":"Not found","avgTime":"70","totalTimePercent":70,"totalTime":"70","frequency":"50","heat":17,"columns":["player_friend01","player_friend02","player_friend03"],"foreignKeys":[{"table":"player_friend","reference":"player","key":"player02","fk":"player_friend03"}],"tables":["player_game_opponent_tree_player_friend"],"related":["player_game_opponent_tree_player_friend","player_tree_rt_player"],"x":320,"y":360,"positionSet":false},{"id":"player_game_opponent_tree_player_friend","parentID":"player_friend_tree_player","shardParentName":"rt_player","ancestorName":"player","parentName":"player_friend","name":"player_game_opponent","text":"player_game_opponent","type":"SHARD_CHILD","level":3,"nbrShard":0,"keyShard":"Not found","avgTime":"60","totalTimePercent":60,"totalTime":"60","frequency":"40","heat":15,"columns":["player_game_opponent01","player_game_opponent02","player_game_opponent03"],"foreignKeys":[{"table":"player_game_opponent","reference":"player_friend","key":"player_friend01","fk":"player_game_opponent02"}],"tables":["player_test_tree_player_game_opponent"],"related":["player_test_tree_player_game_opponent","player_friend_tree_player"],"x":320,"y":620,"positionSet":false},{"id":"player_game_tree_player","parentID":"player_tree_rt_player","shardParentName":"rt_player","ancestorName":"rt_player","parentName":"player","name":"player_game","text":"player_game","type":"SHARD_CHILD","level":2,"nbrShard":0,"keyShard":"Not found","avgTime":"490","totalTimePercent":49,"totalTime":"490","frequency":"95","heat":23,"columns":["player_game01","player_game02","player_game03"],"foreignKeys":[{"table":"player_game","reference":"player","key":"player01","fk":"player_game02"}],"tables":["player_game_opponent_tree_player_game","player_game_round_tree_player_game"],"related":["player_game_opponent_tree_player_game","player_game_round_tree_player_game","player_tree_rt_player"],"x":540,"y":360,"positionSet":false},{"id":"player_game_opponent_tree_player_game","parentID":"player_game_tree_player","shardParentName":"rt_player","ancestorName":"player","parentName":"player_game","name":"player_game_opponent","text":"player_game_opponent","type":"SHARD_CHILD","level":3,"nbrShard":0,"keyShard":"Not found","avgTime":"60","totalTimePercent":60,"totalTime":"60","frequency":"40","heat":15,"columns":["player_game_opponent01","player_game_opponent02","player_game_opponent03"],"foreignKeys":[{"table":"player_game_opponent","reference":"player_game","key":"player_game01","fk":"player_game_opponent01"}],"tables":[],"related":["player_game_tree_player"],"x":540,"y":620,"positionSet":false},{"id":"player_game_round_tree_player_game","parentID":"player_game_tree_player","shardParentName":"rt_player","ancestorName":"player","parentName":"player_game","name":"player_game_round","text":"player_game_round","type":"SHARD_CHILD","level":3,"nbrShard":0,"keyShard":"Not found","avgTime":"20","totalTimePercent":20,"totalTime":"20","frequency":"30","heat":8,"columns":["player_game_round01","player_game_round02","player_game_round03"],"foreignKeys":[{"table":"player_game_round","reference":"player_game","key":"player_game01","fk":"player_game_round03"}],"tables":[],"related":["player_game_tree_player"],"x":710,"y":620,"positionSet":false},{"id":"player_game_component_tree_player","parentID":"player_tree_rt_player","shardParentName":"rt_player","ancestorName":"rt_player","parentName":"player","name":"player_game_component","text":"player_game_component","type":"SHARD_CHILD","level":2,"nbrShard":0,"keyShard":"Not found","avgTime":"250","totalTimePercent":25,"totalTime":"250","frequency":"90","heat":22,"columns":["player_game_component01","player_game_component02","player_game_component03"],"foreignKeys":[{"table":"player_game_component","reference":"player","key":"player01","fk":"player_game_component02"}],"tables":[],"related":["player_tree_rt_player"],"x":930,"y":360,"positionSet":false},{"id":"player_game_round_tree_player","parentID":"player_tree_rt_player","shardParentName":"rt_player","ancestorName":"rt_player","parentName":"player","name":"player_game_round","text":"player_game_round","type":"SHARD_CHILD","level":2,"nbrShard":0,"keyShard":"Not found","avgTime":"20","totalTimePercent":20,"totalTime":"20","frequency":"30","heat":8,"columns":["player_game_round01","player_game_round02","player_game_round03"],"foreignKeys":[{"table":"player_game_round","reference":"player","key":"player01","fk":"player_game_round02"}],"tables":[],"related":["player_tree_rt_player"],"x":1150,"y":360,"positionSet":false},{"id":"player_stat_tree_player","parentID":"player_tree_rt_player","shardParentName":"rt_player","ancestorName":"rt_player","parentName":"player","name":"player_stat","text":"player_stat","type":"SHARD_CHILD","level":2,"nbrShard":0,"keyShard":"Not found","avgTime":"50","totalTimePercent":50,"totalTime":"50","frequency":"35","heat":10,"columns":["player_stat01","player_stat02","player_stat03"],"foreignKeys":[{"table":"player_stat","reference":"player","key":"player01","fk":"player_stat03"}],"tables":[],"related":["player_tree_rt_player"],"x":1370,"y":360,"positionSet":false}];
  var g_arrayLine = new Array();

  // Positions.
	var g_xStartMain = 0;
	var g_yStartMain = 0;
  var g_xLowest    = 0;
  var g_yLowest    = 0;	

  // Text.
  var g_charLimit = {
    main_  : 19,
    query_ : 40,
    chart_ : 50 };

  // Lines.
  var s_lineCap  = "round";
  var s_lineJoin = "round";

  var g_line = {
    opacity_            : 1,
    colorDim_           : s_gray6,
    colorSelected_      : s_white,
    strokeWidthDim_     : 2,
    strokeWidthSelected_: 2 };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {

    // Create stage(s).
    g_stageMain  = new Kinetic.Stage({ container: "_main", height: 800, width: 2000, draggable: false });

    // Create layer(s).
    g_layerMain  = new Kinetic.Layer();

		// Add layer(s) to stage(s).
		g_stageMain.add( g_layerMain );

		// Create global group. Used to move all elements on main stage at one time.
		groupGlobal_ = new Kinetic.Group({
			id: "groupGlobal_", x: 0, y: 0
		});
		if ( groupGlobal_ ) { g_layerMain.add( groupGlobal_ ); }
		
		// Create table content.
		createContentMain();
		
    // Create array with line info for each table.
    createLineArray();

    // Create lines connecting main tables.
    createArrayLines();
    
		// Draw layer.
		g_layerMain.draw();	    
  }//createBasicContents

	// ============================================================================
	// TABLE CONTENT.
	// ============================================================================

  // CREATE CONTENT MAIN.
  function createContentMain() {
    if (  g_arrayMain ) {
		  // Set up values for creating tables.
		  var mainID_ = null;
		  var type_   = "";
		  var text_   = "";
		  var heat_   = 0;
		  var h_      = g_vals.hTable_;
		  var w_      = g_vals.wTable_;
		  var x_      = g_vals.xLayout_;
		  var y_      = g_vals.yLayout_;
		  g_xLowest   = s_infinity;
		  g_yLowest   = s_infinity;

	    // Get global group.
	    var groupGlobal_ = stc_getElement( "groupGlobal_", g_stageMain );

	    // Create main tables.
	    if ( groupGlobal_ ) {
	      var length_ = g_arrayMain.length;
	      for ( var i = 0; i < length_; i++ ) {
		      if ( stc_isDefined( g_arrayMain[i].type ) ) {
		        if ( !tree_isRoot( g_arrayMain[i].type ) ) {
			        if ( stc_isDefined( g_arrayMain[i].id ) &&
			             stc_isDefined( g_arrayMain[i].level ) &&
			             stc_isDefined( g_arrayMain[i].text ) &&
			             stc_isNumber( g_arrayMain[i].heat ) &&
			             stc_isNumber( g_arrayMain[i].x ) &&
			             stc_isNumber( g_arrayMain[i].y ) ) {

					      // Set values.
					      mainID_ = g_arrayMain[i].id;
					      type_   = g_arrayMain[i].type;
					      text_   = g_arrayMain[i].text;
					      heat_   = g_arrayMain[i].heat;
					      x_      = g_arrayMain[i].x;
					      y_      = g_arrayMain[i].y;

					      // Get lowest x/y.
					      if ( x_ < g_xLowest ) { g_xLowest = x_; }
					      if ( y_ < g_yLowest ) { g_yLowest = y_; }

					      // If table does not exist, create it.
						    var groupMain_ = stc_getElement( mainID_, g_stageMain );
						    if ( !groupMain_ ) {
				          // Create group.
				          var groupMain_ = new Kinetic.Group({
				            id: mainID_, name: text_, x: x_, y: y_,
				            opacity: 1, draggable: true
				          });

				          // If group valid, create elements, then add to global group.
				          if ( groupMain_ ) {
				            // Add event handler for group.
				            handleUpMain( groupMain_ );
					          handleDownMain( groupMain_ );
					          handleDragEndMain( groupMain_ );
					          handleMoveMain( groupMain_ );

					          // Create opaque underlay.
				            var underlay_ = new Kinetic.Rect({
				              id: mainID_ + "_underlayMain", x: 0, y: 0,
				              height: h_, width: w_,
				              fill: s_grayC, cornerRadius: 20
				            });
				            if ( underlay_ ) { groupMain_.add( underlay_ ); }

							      // Get fill.
							      var fill_ = stc_getTypeFill( type_);
							      if ( fill_ == s_white ) { fill_ = s_color.blueDark_; }

					          // Create main rectangle.
				            var rect_ = new Kinetic.Rect({
				              id: mainID_ + "_rectMain", x: 0, y: 0,
				              height: h_, width: w_,
				              fill: fill_, cornerRadius: 20, opacity: g_vals.opacityDim_,
						          stroke: s_white, strokeWidth: 4,
						          lineCap: s_lineCap, lineJoin: s_lineJoin, strokeEnabled: false,
				            });
				            if ( rect_ ) { groupMain_.add( rect_ ); }

				            // Add group to global group.
				            groupGlobal_.add( groupMain_ );
				          }//groupMain_ valid
						    }//groupMain_ not valid
			        }//properties valid
		        }//not root
		      }//type valid
	      }//for each table in array
	    }//groupGlobal_ valid
    }//g_arrayMain valid
  }//createContentMain

  // IS ROOT.
	function tree_isRoot( type_ ) {
    var isShardTreeRoot_ = false;
    if ( stc_isDefined( type_ ) ) {
	    if ( type_ == s_tableType.shardTreeGlobal_ ||
	         type_ == s_tableType.shardTreeRelational_ ||
	         type_ == s_tableType.shardTreeStatic_ ) {
	      isShardTreeRoot_ = true;
	    }//is root
    }//type_ valid
    return isShardTreeRoot_;
  }//tree_isRoot

  // GET MASTER PROPERTY.
  function getMasterProperty( id_, propertyName_ ) {
    // Get array length.
    var length_ = g_arrayMain.length;

    // Set up processing vars.
    var mainID_   = "";
    var property_ = null;
    var entry_    = new Object();

    // Loop through array. If ID matches passed ID, set property and break.
    if ( stc_isDefined( id_ ) && stc_isDefined( propertyName_ ) ) {
      for ( var i = 0; i < length_; i++ ) {
        // Get entry.
        entry_ = g_arrayMain[i];

        // Get main ID.
        mainID_ = entry_.id;

        // If match, set property.
        if ( mainID_ == id_ ) {

		      switch( propertyName_ ) {

		        case "object_"          : property_ = entry_; break;
		        case "parentID_"        : if ( stc_isDefined( entry_.parentID ) )         { property_ = entry_.parentID; } break;
		        case "type_"            : if ( stc_isDefined( entry_.type ) )             { property_ = entry_.type; } break;
		        case "text_"            : if ( stc_isDefined( entry_.text ) )             { property_ = entry_.text; } break;
		        case "tables_"          : if ( stc_isDefined( entry_.tables ) )           { property_ = entry_.tables; } break;
		        case "parentName_"      : if ( stc_isDefined( entry_.parentName ) )       { property_ = entry_.parentName; } break;
		        case "related_"         : if ( stc_isDefined( entry_.related ) )          { property_ = entry_.related; } break;
		        case "x_"               : if ( stc_isDefined( entry_.x ) )                { property_ = entry_.x; } break;
		        case "y_"               : if ( stc_isDefined( entry_.y ) )                { property_ = entry_.y; } break;

		        default: break;

		      }//switch propertyName_

		      // Break.
		      break;
        }//mainID_ matches id_
      }//for each table in array
    }//params valid

    // Return property.
    return property_;
  }//getMasterProperty

  // ============================================================================
  // EVENTS - MAIN.
  // ============================================================================

  // HANDLE DOWN MAIN.
  function handleDownMain( tableMain_ ) {
    tableMain_.on( "mousedown", function( event ) {
      // Cancel propagation.
      event.cancelBubble = true;
      event.stopPropagation();

      // Store start position.
      if ( tableMain_ ) {	      
	      g_xStartMain = Math.round( tableMain_.getX() );
	      g_yStartMain = Math.round( tableMain_.getY() );
      }//tableMain_ valid
    });
  }//handleDownMain

  // HANDLE UP MAIN.
  function handleUpMain( tableMain_ ) {
    tableMain_.on( "mouseup", function( event ) {
      if ( tableMain_ ) {
        var mainID_ = tableMain_.getId();
        if ( stc_isDefined( mainID_ ) ) {

        }//mainID_ valid
      }//tableMain_ valid
    });
  }//handleUpMain

  // HANDLE DRAG END MAIN.
  function handleDragEndMain( tableMain_ ) {
    tableMain_.on( "dragend", function() {
      if ( tableMain_ ) {
        // Get ID for main table.
        var mainID_ = tableMain_.getId();

        // Get x/y.
        var x_ = tableMain_.getX();
        var y_ = tableMain_.getY();
      }//tableMain_ valid
    });
  }//handleDragEndMain

  // HANDLE MOVE MAIN.
  function handleMoveMain( tableMain_ ) {
    tableMain_.on( "dragmove", function() {
      if ( tableMain_ ) {
        // Get ID for main table.
        var mainID_ = tableMain_.getId();

        // Move lines for main table.
        if ( stc_isDefined( mainID_ ) ) {
          moveLinesMain( tableMain_, mainID_, tableMain_.getX(), tableMain_.getY() );
        }//mainID_ valid
      }//tableMain_ valid
    });
  }//handleMoveMain

  // MOVE LINES MAIN.
  function moveLinesMain( tableMain_, mainID_, x_, y_ ) {
    if ( tableMain_ && stc_isDefined( mainID_ ) &&
         stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {

      // Get parent ID and tables properties.
      var parentID_ = getMasterProperty( mainID_, "parentID_" );
      var tables_   = getMasterProperty( mainID_, "tables_" );

      // Move line from parent to self.
      if ( stc_isDefined( parentID_ ) ) {
	      var parent_ = stc_getElement( parentID_, g_stageMain );
	      var self_   = new Array(); self_.push( mainID_ );
	      if ( stc_isDefined( parent_ ) && stc_isDefined( self_ ) ) {
	        drawLines( parent_, self_, parent_.getX(), parent_.getY(), true );
	      }//parent_ self_ valid
      }//parentID_ valid

      // Move line(s) from self to children.
      if ( stc_isDefined( tables_ ) ) {
	      drawLines( tableMain_, tables_, x_, y_, true );
      }//tables_ valid
    }//parameters valid
  }//moveLinesMain

  // ============================================================================
  // LINES.
  // ============================================================================

  // CREATE LINE ARRAY.
  // Create array with line info for all tables.
  function createLineArray() {
    var length_ = g_arrayMain.length;
    for ( var i = 0; i < length_; i++ ) {
      if ( stc_isDefined( g_arrayMain[i].tables ) && stc_isDefined( g_arrayMain[i].id ) ) {
        var tables_ = g_arrayMain[i].tables;
        if ( stc_isDefined( tables_ ) ) {
            if ( tables_.length > 0 ) {
	            var childrenArray_ = new Array();
	            childrenArray_ = createLineArrayChildren( tables_ );
	            if ( stc_isDefined( childrenArray_ ) ) {
	              if ( childrenArray_.length > 0 ) {
		              var line_     = new Object();
		              line_.id      = g_arrayMain[i].id;
		              line_.tables  = childrenArray_;
		              g_arrayLine.push( line_ );
	              }//childrenArray_ not empty
	            }//childrenArray_ valid
            }//tables_ not empty
        }//children valid
      }//tables_ id_ valid
    }//for each table in array
  }//createLineArray

  // CREATE LINE ARRAY CHILDREN.
  function createLineArrayChildren( tables_ ) {
    var childrenArray_ = new Array();
    if ( stc_isDefined( tables_ ) ) {
      var length_ = tables_.length;
      for ( var i = 0; i < length_; i++ ) {
        childrenArray_.push( tables_[i] );
      }//for each child in array
    }//tables_ valid
    return childrenArray_;
  }//createLineArrayChildren

  // CREATE ARRAY LINES.
  // Create lines between parent and child tables.
  function createArrayLines() {
    if ( stc_isDefined( g_arrayLine ) ) {
      // Loop thru array and move/create line for each parent.
      var length_ = g_arrayLine.length;
      for ( var i = 0; i < length_; i++ ) {

        // Get parent and parent ID.
        var parentID_ = "";
        var parent_   = null;
        if ( stc_isDefined( g_arrayLine[i].id ) ) {
          parentID_ = g_arrayLine[i].id;
          parent_   = stc_getElement( parentID_, g_stageMain );
        }//entry valid

        // Create line.
        if ( parent_ ) {
          drawLines( parent_, g_arrayLine[i].tables, parent_.getX(), parent_.getY(), false );
        }//parent valid
      }//for each child in array
    }//g_arrayLine valid
  }//createArrayLines

  // DRAW LINES.
  // Create or move lines from one parent to all its children.
  function drawLines( parent_, tables_, x_, y_, move_ ) {
    if ( stc_isDefined( parent_ ) && stc_isDefined( tables_ ) && stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
      // Set up processing vars.
      var parentID_ = parent_.getId();
      var childID_  = "";
      var child_    = null;
      var lineID_   = "";
      var line_     = null;

      // Create or move line between parent and each child.
      if ( stc_isDefined( parentID_ ) ) {
	      if ( tables_.length > 0 ) {
	        var length_ = tables_.length;
	        for ( var i = 0; i < length_; i++ ) {
	          // Get current child.
	          childID_ = "";
	          child_   = null;
		        if ( stc_isDefined( tables_[i] ) ) {
		          childID_ = tables_[i];
		          child_   = stc_getElement( childID_, g_stageMain );
		        }//entry valid

	          // If child valid, handle line.
	          if ( child_ ) {
	            // Set up line ID and get line.
	            lineID_ = parentID_ + "_" + childID_;
	            line_   = null;
	            line_   = stc_getElement( lineID_, g_stageMain );

	            // Create or move line.
	            // DO NOT CHECK FOR VALIDITY OF LINE. It is valid to have invalid line_. This is initial condition and will trigger creation of line.
	            drawOneLine( line_, parent_, parentID_, child_, childID_, x_, y_, child_.getX(), child_.getY(), move_ );
	          }//mult valid
	        }//for each mult in array
	      }//tables_ not empty
      }//parentID_ is valid
    }//parameters valid
  }//drawLines

  // DRAW ONE LINE.
  function drawOneLine( line_, source_, sourceID_, target_, targetID_, startX_, startY_, endX_, endY_, move_ ) {
    // Get global group.
    var groupGlobal_ = stc_getElement( "groupGlobal_", g_stageMain );

    // Draw/move line.
    if ( stc_isDefined( groupGlobal_ ) &&
         stc_isDefined( source_ ) && stc_isDefined( target_ ) &&
         stc_isDefined( sourceID_ ) && stc_isDefined( targetID_ ) &&
         stc_isNumber( startX_ ) && stc_isNumber( startY_ ) &&
         stc_isNumber( endX_ ) && stc_isNumber( endY_ ) ) {

      // Set passed x/y to start/end in centers of rectangles.
      // Puts line origins in centers of tables.
      startX_ = g_vals.wTable_ * .5 + startX_;
      startY_ = g_vals.hTable_ * .5 + startY_;
      endX_   = g_vals.wTable_ * .5 + endX_;
      endY_   = g_vals.hTable_ * .5 + endY_;

      // Get distances between tables.
      var distanceX_ = 0;
      if ( startX_ > endX_ ) {
        distanceX_ = endX_ - startX_;
      } else {
        distanceX_ = -( startX_ - endX_ );
      }//end not lt start
      var distanceY_ = 0;
      if ( endY_ > startY_ ) {
        distanceY_ = endY_ - startY_;
      } else {
        distanceY_ = -( startY_ - endY_ );
      }//end not lt start

      // Set interim points.
      var x2_ = startX_; var y2_ = startY_; var x3_ = endX_; var y3_ = endY_;
      if ( startY_ < endY_ ) {
        x2_ = startX_; y2_ = startY_ + distanceY_;
        x3_ = endX_; y3_ = y2_;
      } else {
        x2_ = startX_ + distanceX_; y2_ = startY_;
        x3_ = x2_; y3_ = endY_;
      }//startY_ gt endY_

      // Move or create line.
      if ( line_ ) {
        // Move line.
        if ( move_ ) {
	        var points_ = line_.getPoints();
	        points_     = [startX_, startY_, x2_, y2_, x3_, y3_, endX_, endY_];
	        if ( stc_isDefined( points_ ) ) { line_.setPoints( points_ ); }

		      // Move line arrow.
		      drawLineArrow( groupGlobal_, sourceID_, targetID_, startX_, endX_, x3_, y2_ );
        }//move_ true
      } else {
        // Set up line ID.
        var lineID_ = sourceID_ + "_" + targetID_;

        // Create line.
        var line_ = new Kinetic.Line({
          id: lineID_, name: lineID_,
          points: [startX_, startY_, x2_, y2_, x3_, y3_, endX_, endY_],
          stroke: g_line.colorDim_, strokeWidth: g_line.strokeWidthDim_,
          lineCap: s_lineCap, lineJoin: s_lineJoin,
          opacity: g_line.opacity_
        });

        // Add arrow at end, then add line to layer and move to bottom.
        if ( line_ ) {
		      // Create line arrow.
	        drawLineArrow( groupGlobal_, sourceID_, targetID_, startX_, endX_, x3_, y2_ );

          // Add line to layer.
          groupGlobal_.add( line_ );

          // Move to bottom.
          line_.moveToBottom(); g_layerMain.draw();
        }//line_ valid
      }//line not valid

    }//parameters valid
  }//drawOneLine

  // DRAW LINE ARROW.
  // Create or move arrow at end of line.
  function drawLineArrow( groupGlobal_, sourceID_, targetID_, startX_, endX_, x3_, y2_ ) {
    if ( stc_isDefined( groupGlobal_ ) &&
         stc_isDefined( sourceID_ ) && stc_isDefined( targetID_ ) &&
         stc_isNumber( startX_ ) && stc_isNumber( endX_ ) &&
         stc_isNumber( x3_ ) && stc_isNumber( y2_ ) ) {

	    // Find out if arrow already exists. If not, create it.
	    // Either way, set position and rotation afterward.
	    var arrow_ = stc_getElement( sourceID_ + "_" + targetID_ + "_arrow", g_stageMain );
	    if ( !arrow_ ) {
	      // Create new arrow.
	      arrow_ = sh_createDirectionArrow( sourceID_ + "_" + targetID_ + "_arrow", g_line.colorDim_, g_line.colorDim_, g_line.opacity_ );
		    if ( arrow_ ) {
		      // Set name.
		      arrow_.setName( "From " + sourceID_ + " to " + targetID_ );

		      // Add to group.
		      groupGlobal_.add( arrow_ );

			    // Assign event handlers.
			    arrow_.on( "mouseover", function( event ) {
			      mouseoverShape( event );
			    });
			    arrow_.on( "mouseout", function( event ) {
			      mouseOutTooltipLocal( event );
			    });
		    }//arrow_ valid
	    }//does not exist

	    // Set position and rotation for existing or new arrow.
	    if ( arrow_ ) {
        // Calculate position and rotation.
        var xArrow_ = x3_; var yArrow_ = y2_; var rot_ = 0;
	      if ( startX_ > endX_ ) {
	        xArrow_ = ( xArrow_ + ( g_vals.wTable_ * .5 ) ) + 13;
	        rot_ = 180;
	      } else {
	        xArrow_ = ( xArrow_ - ( g_vals.wTable_ * .5 ) ) - 13;
	      }//end not lt start

	      // Hide arrow if we're crossing over midpoint.
	      var xLeft_  = endX_ - ( g_vals.wTable_ * .5 );
	      var xRight_ = endX_ + ( g_vals.wTable_ * .5 );
	      if ( startX_ > xLeft_ && startX_ < xRight_ ) {
	        arrow_.hide();
	      } else {
	        arrow_.show();
	      }//not midpoint

	      // Set position.
	      arrow_.setX( xArrow_ ); arrow_.setY( yArrow_ );

        // Set rotation.
        if ( stc_isNumber( rot_ ) ) { arrow_.setRotationDeg( rot_ ); }
	    }//arrow_ valid
    }//parameters valid
  }//drawLineArrow

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

  // DESTROY ALL LINES.
  function destroyAllLines() {
    // Destroy lines and arrows in main and navigator maps.
    var length_ = g_arrayLine.length;
    for ( var i = 0; i < length_; i++ ) {
      if ( stc_isDefined( g_arrayLine[i].id ) && stc_isDefined( g_arrayLine[i].tables ) ) {
        if ( g_arrayLine[i].tables.length > 0 ) {
          destroyChildrenLines( g_arrayLine[i].id, g_arrayLine[i].tables );
        }//length gt 0
      }//parentID_ tables_ valid
    }//for each parent in array
  }//destroyAllLines

  // DESTROY CHILDREN LINES.
  function destroyChildrenLines( parentID_, tables_  ) {
    if ( stc_isDefined( parentID_ ) && stc_isDefined( tables_ ) ) {
      var length_ = tables_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( tables_[i] ) && tables_[i] != "" ) {
          var lineMain_ = stc_getElement( parentID_ + "_" + tables_[i], g_stageMain );
          if ( lineMain_ ) {
            lineMain_.destroy();
          }//lineMain_ valid
          var arrow_ = stc_getElement( parentID_ + "_" + tables_[i] + "_arrow", g_stageMain );
          if ( arrow_ ) {
            arrow_.destroy();
          }//arrow_ valid
        }//entry valid
      }//for each child in array
    }//parentID_ tables_ valid
  }//destroyChildrenLines
  
  // ============================================================================
  // UTILITY.
  // ============================================================================

  // Type colors. DO NOT USE ANYWHERE ELSE - use stc_getTypeFill instead.
  var s_colorType = {
    global_       : s_color.bluePurple_,
    root_         : s_color.orange_,
    child_        : s_color.greenLight_,
    static_       : s_color.turquoise_,
    logOnly_      : s_color.blueDark_,
    nonRelational_: s_color.purple_ };
  var s_arrayColorsType = [s_colorType.global_, s_colorType.root_, s_colorType.child_, s_colorType.static_, s_colorType.logOnly_, s_colorType.nonRelational_];

  // GET TYPE FILL.
  function stc_getTypeFill( type_ ) {
    var returnFill_ = s_white;
    if ( s_arrayColorsType ) {
      switch( type_ ) {
        case s_tableType.global_       : returnFill_ = s_arrayColorsType[ 0 ]; break;
        case s_tableType.child_        : returnFill_ = s_arrayColorsType[ 2 ]; break;
        case s_tableType.static_       : returnFill_ = s_arrayColorsType[ 3 ]; break;
        case s_tableType.logOnly_      : returnFill_ = s_arrayColorsType[ 4 ]; break;
        case s_tableType.nonRelational_: returnFill_ = s_arrayColorsType[ 5 ]; break;
        default: break;
      }//switch type_
    }//s_arrayColorsType valid
    return returnFill_;
  }//stc_getTypeFill
  
  // IS DEFINED
  function stc_isDefined( value_ ) {
      var valueIsDefined_ = false;
      if ( value_ !== null && value_ !== undefined ) { valueIsDefined_ = true; }
      return valueIsDefined_;
  }//stc_isDefined

  // IS NUMBER
  function stc_isNumber( nbr_ ) {
      return typeof nbr_ == "number" && !isNaN( nbr_ ) && isFinite( nbr_ );
  }//stc_isNumber
  
  // GET ELEMENT.
  // Get Kinetic element.
  function stc_getElement( elementID_, stageName_ ) {
    var element_ = null;
    element_ = stageName_.get( "#" + elementID_ )[0];
    return element_;
  }//stc_getElement
  
