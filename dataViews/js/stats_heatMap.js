
  // ============================================================================
  // HEAT MAP.
  // Requires static.js.
  // Uses Kinetic components. Once Kinetic stage/layer are created, do not keep checking them for validity.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

	  // Load module/view.
	  parent.loadModule( s_module._0_, s_module0._0_ );

    // Create basic contents.
    createBasicContents();

    // Start process to load tree and select first table in tree for display in canvas.
    startInitialLoad();

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Load vals.
  var g_timerLoad0  = null;
  var g_loadMessage = "";
  var g_isInitLoad  = false;
  var g_xLowest     = 0;
  var g_yLowest     = 0;

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

  // Mini stage/layer.
  var g_stageMini  = null;
  var g_layerMini  = null;
  var g_hStageMini = g_vals.hStage_;
  var g_wStageMini = g_vals.wStage_;
  var g_scaleMini  = g_vals.scaleMini_;

  // Marquee.
  var g_hMarquee = g_vals.hStage_;
  var g_wMarquee = g_vals.wStage_;

	// Data arrays.
	var g_tableSelections = new Array();
	var g_arrayMain       = new Array();
	var g_arrayMini       = new Array();
	var g_arrayQuery      = new Array();
	var g_arrayStat       = new Array();
  var g_arrayLine       = new Array();

  // Services.
  var g_statsID         = "";
  var g_statRequestType = "";

  // Services vals. Timer speed is not used, but is included for documentation.
  var g_svcVals = {
    nbrTablesReq_: 20,
    nbrRowsReq_  : 16,
    nbrStatsReq_ : 10,
    timerSpeed_  : 15000 };

  // Currently-selected object.
  var g_tableSelected    = null;
  var g_querySelected    = null;
  var g_queryRequestType = "";

  // Start positions.
	var g_xStartMini = 0;
	var g_yStartMini = 0;
	var g_xStartMain = 0;
	var g_yStartMain = 0;

  // Query list vals.
  var g_queryVals = {
    hQuery_      : 1000,
    wQuery_      : 290,
    hQuerySingle_: 50,
    wQuerySingle_: 285,
    xQuery_      : 0 };

  // Query list stage/layer.
  var g_stageQuery = null;
  var g_layerQuery = null;

  // Chart.
  var g_chart = null;

  // Chart stage/layer.
  var g_stageChart = null;
  var g_layerChart = null;

  // Chart vals. xIncrement_ should be timerSpeed_/1000.
  var g_chartVals = {
    nbrSlots_  : 10,
    nbrYSlots_ : 10,
    xIncrement_: 15 };

  // Text.
  var g_charLimit = {
    main_  : 19,
    query_ : 40,
    chart_ : 50 };

  // Lines.
  var g_line = {
    opacity_            : 1,
    colorDim_           : s_gray6,
    colorSelected_      : s_white,
    strokeWidthDim_     : 2,
    strokeWidthSelected_: 2 };

  // Text strings.
  var g_uiStr = {
    tipClickTable_   : "Click to select, then click icons for more info.<br>To activate the table&apos;s chart, click the chart icon.",
    tipIntoNav_      : "and any descendants two levels down into the Navigator.",
    tipIntoMain_     : "and any descendants two levels down into the main view.",
    tipFromMarquee_  : "Loading tables found inside the selection rectangle into the main view. Lines between tables will not appear unless each connected table is included.",
    tipHeavy_        : "The selected set of tables is large, and may cause slow performance. To speed up the display, select a table that is lower in the hierarchy.",
    tipFitNav_       : "The selected set of tables is too large to view easily in the Navigator. To improve the display, select a table that is lower in the hierarchy.",
    tipHeat0_        : "Heat is in percentile",
    tipHeat1_        : "out of 24.",
    tipFrequency_    : "frequency",
    tipSelectTable_  : "Please select a table first.",
    tipDetails_      : "Details about",
    titleListAll_    : "All tables",
    titleListSelect_ : "All select queries",
    titleListInsert_ : "All insert queries",
    titleListUpdate_ : "All update queries",
    titleListDelete_ : "All delete queries",
    titleListOther_  : "All other queries",
    erNoMoreQueries_ : "No more queries are available. If you selected a specific type of query, there may be queries available, but not for the selected type.",
    erNoQueryText_   : "Query text not available.",
    erTooHeavy_      : "The selected set of tables is too large to load. Try selecting a table that is lower in the hierarchy.",
    erLoadItem_      : "An error occurred while loading the selected item."
  };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {
    // DRAGGABLE.

    // Mini canvas.
    $( "#_miniContainer" ).draggable({ handle: "#_handleMini" });

    // Query list.
    $( "#_listQuery" ).draggable( { handle: "#_handleQuery" } );

    // Query edit control.
    $( "#_containerQueryEdit" ).draggable({ handle: "#_handleQueryEdit" });

    // Chart.
    $( "#_chartContainerMain" ).draggable();

    // Tree.
    $( "#_treeContainer" ).draggable( { handle: "#_handleTree" } );

    // EVENT HANDLERS.

    // Icon images.
    $( ".icon" ).on                 ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on                 ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

    // Mini canvas icons.
    $( "#_iconInfo" ).on            ( "mouseover", function( event ) { showNavigatorInfo(); });
    $( "#_iconInfo" ).on            ( "mouseout", function( event )  { mouseOutTooltipLocal( event); });
    $( "#_iconZoomOut" ).on         ( "click", function( event )     { scaleContents( "_iconZoomOut" ); });
    $( "#_iconZoomIn" ).on          ( "click", function( event )     { scaleContents( "_iconZoomIn" ); });
    $( "#_iconZoomRestore" ).on     ( "click", function( event )     { scaleContents( "_iconZoomRestore" ); });

    // Query list icons.
    $( "#_iconQueryAll" ).on        ( "click", function( event )     { setupQueryRequest(); getQueryList( g_tableSelected.getId(), s_queryType.all_ ); });
    $( "#_iconQuerySelect" ).on     ( "click", function( event )     { setupQueryRequest(); getQueryList( g_tableSelected.getId(), s_queryType.select_ ); });
    $( "#_iconQueryInsert" ).on     ( "click", function( event )     { setupQueryRequest(); getQueryList( g_tableSelected.getId(), s_queryType.insert_ ); });
    $( "#_iconQueryUpdate" ).on     ( "click", function( event )     { setupQueryRequest(); getQueryList( g_tableSelected.getId(), s_queryType.update_ ); });
    $( "#_iconQueryDelete" ).on     ( "click", function( event )     { setupQueryRequest(); getQueryList( g_tableSelected.getId(), s_queryType.delete_ ); });
    $( "#_iconQueryOther" ).on      ( "click", function( event )     { setupQueryRequest(); getQueryList( g_tableSelected.getId(), s_queryType.other_ ); });
    $( "#_iconQueryClose" ).on      ( "click", function( event )     { closeQueryList(); });

    // Query edit icons.
    $( "#_iconQueryEditChart" ).on   ( "click", function( event )    { getQueryStats(); });
    $( "#_iconQueryEditClose" ).on   ( "click", function( event )    { stc_clearQueryEdit(); stc_closeQueryEdit(); });

    // Chart icons.
    $( "#_iconChartClose" ).on       ( "click", function( event )     { closeChart(); });
    $( "#_iconChartAll" ).on         ( "click", function( event )     { getQueryStatsAll(); });

    // Tree icons.
    $( "#_iconTreeClose" ).on        ( "click", function( event )     { tree_closeTree(); });

    // BASIC CONTENTS.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );
    stc_clearQueryEdit();

    // Create stage(s).
    g_stageMain  = new Kinetic.Stage({ container: "_main", height: g_hStageMain, width: g_wStageMain, draggable: false });
    g_stageMini  = new Kinetic.Stage({ container: "_mini", height: g_hStageMini, width: g_wStageMini });
    g_stageQuery = new Kinetic.Stage({ container: "_canvasQuery", height: g_queryVals.hQuery_, width: g_queryVals.wQuery_ });
    g_stageChart = new Kinetic.Stage({ container: "_chartContainer", height: $( "#_chartContainer" ).height(), width: $( "#_chartContainer" ).width() });

    if ( g_stageMini ) {
      g_stageMini.setScale( g_scaleMini );
      g_stageMini.on( "dragstart", function( event ) { event.cancelBubble = true; event.stopPropagation(); });
      g_stageMini.on( "dragend", function( event )   { event.cancelBubble = true; event.stopPropagation(); });
      g_stageMini.on( "dragmove", function( event )  { event.cancelBubble = true; event.stopPropagation(); });
    }//g_stageMini valid

    // Create layer(s).
    g_layerMain  = new Kinetic.Layer();
    g_layerMini  = new Kinetic.Layer();
    g_layerQuery = new Kinetic.Layer();
    g_layerChart = new Kinetic.Layer();

    // Add layers to stages, then create stage/layer elements.
    if ( g_stageMain && g_stageMini && g_stageQuery && g_stageChart &&
         g_layerMain && g_layerMini && g_layerQuery && g_layerChart )  {

      // Add layer(s) to stage(s).
      g_stageMain.add( g_layerMain );
      g_stageMini.add( g_layerMini );
      g_stageQuery.add( g_layerQuery );
      g_stageChart.add( g_layerChart );

      // Adjust stage size to size of parent iframe.
      parent.resizeContents();

      // Create control for selecting view port.
      createMarquee();

      // Hide zoom icons.
      toggleShowZoomIcons( false );

      // Create basic chart (with no data).
      var fontSize_     = "9";
      var color_        = s_white;
      var useGrid_      = true;
      var hLabelsID_    = stc_getIdentifier( "", s_strChartHLabels );
      var hLabelStr_    = "s";
      var hLabelOffset_ = 30;
      var hOffset_      = 40;
      var wOffset_      = 50;
      g_chart = chrt_createChart( stc_getIdentifier( "", s_strChart ),
                             $( "#_chartContainer" ).height(), $( "#_chartContainer" ).width(),
                             fontSize_, color_, color_, useGrid_,
                             g_chartVals.nbrSlots_, g_chartVals.nbrYSlots_,
                             g_chartVals.xIncrement_, hLabelsID_,
                             hLabelStr_, hLabelOffset_, hOffset_, wOffset_ );
      if ( g_chart ) { g_layerChart.add( g_chart ); }
      $( "#_titleChart" ).css( "color", color_ );

      // Draw layers.
      g_layerChart.draw();
	    g_layerMain.draw();
	    g_layerMini.draw();
    }//stages layers valid
  }//createBasicContents

  // ============================================================================
  // INIT/LOAD.
  // ============================================================================

  // START INITIAL LOAD.
  function startInitialLoad() {
    // Set flag for init load.
    g_isInitLoad = true;

    // Delay first service so canvas can show up right away,
    // then get tree list.
    g_timerLoad0 = setTimeout( "runInitialLoad0()", 200 );
  }//startInitialLoad

  // RUN INITIAL LOAD 0.
  function runInitialLoad0() {

    // Set params.
    var indexPage_            = parent;
    var titleTextTree_        = parent.i_domainName;
    var isEditable_           = false;
    var isDraggable_          = true;
    var recurseAll_           = false;
    var recurseLimit_         = 3;
    var createFlatFile_       = true;
    var colorBackground_      = s_white;
    var colorRowSelected_     = s_grayD;
    var colorRowUnselected_   = s_white;
    var callbackInitialLoad_  = runInitialLoad1;
    var callbackWipeLoad_     = null;
    var callbackSelection_    = runTreeSelect;
    var createHelperFunction_ = null;
    var callbackDropPoints_   = null;

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
	  tree_showTree( 860, 216 );
  }//runInitialLoad0

  // RUN INITIAL LOAD 1.
  function runInitialLoad1() {
    // Stop load timer.
    clearTimeout( g_timerLoad0 );

    // Select first table for canvas.
    g_timerLoad0 = setTimeout( "runInitialLoad2()", 200 );
  }//runInitialLoad1

  // RUN INITIAL LOAD 2.
  function runInitialLoad2() {
    // Stop load timer.
    clearTimeout( g_timerLoad0 );

    // Select first table for canvas. When load is complete, sequence calls runInitialLoad3.
    if ( t_loadMainID != "" && t_loadMainParentName != "" && t_loadMainName != "" && t_loadRowID != "" ) {
	    // Select rows using current vals in selection vars.
	    tree_doSelectRows( t_loadMainID, t_loadMainParentName, t_loadMainName, t_loadRowID );
    } else {
      // Init all content.
      initContent( true, true );
    }//not empty
  }//runInitialLoad2

  // RUN INITIAL LOAD 3.
  function runInitialLoad3() {
    // Set flag to false;
    g_isInitLoad = false;

    // Send service to get stats for all tables in database.
    parent.getStatDBList();
  }//runInitialLoad3

  // INIT STAGE.
  function initStage() {
    // Stop load timer.
    clearTimeout( g_timerLoad0 );

	  // Init chart. Includes timer tracking stop.
	  initChart();

    // Clear and close query list.
    clearQueryList();
    closeQueryList();

    // Clear and close query edit dialog.
    stc_clearQueryEdit();
    stc_closeQueryEdit();

    // Hide tooltip.
    stc_hideTooltip( $( "#_tooltip" ) );
  }//initStage

  // INIT CONTENT.
  function initContent( initMini_, initMain_ ) {
    // Init stage. Includes timer tracking stop.
    initStage();

		// Unselect all elements.
		unselectAllElements();

    // Init mini content.
    if ( initMini_ ) {
	    // Hide zoom icons.
	    toggleShowZoomIcons( false );

	    // Destroy content.
	    destroyContentMini();

		  // Redraw layer.
		  g_layerMini.draw();

	    // Clear out data arrays.
	    // DEPENDENCY: Do after removing elements, since array is used to remove elements.
	    g_arrayMini = new Array();
	    g_arrayMain = new Array();
    }//initMini_ true

    // Init main content.
    if ( initMain_ ) {
	    // Destroy content.
	    destroyContentMain();
	    destroyAllLines();

	    // Destroy global group.
	    var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );
	    if ( groupGlobal_ ) {
	      groupGlobal_.destroy();
	    }//groupGlobal_ valid

	    // Create global group. Used to move all elements on main stage at one time.
	    groupGlobal_ = new Kinetic.Group({
	      id: stc_getIdentifier( "", s_strGroupGlobal ), x: 0, y: 0
	    });
	    if ( groupGlobal_ ) { g_layerMain.add( groupGlobal_ ); }

		  // Redraw layer.
		  g_layerMain.draw();

	    // Clear out data arrays.
	    // DEPENDENCY: Do after removing elements, since arrays are used to remove elements.
	    g_arrayMain  = new Array();
	    g_arrayQuery = new Array();
	    g_arrayStat  = new Array();
	    g_arrayLine  = new Array();

	    // Null vars for currently-selected objects.
	    g_tableSelected = null;
	    g_querySelected = null;
    }//initMain_ true
  }//initContent

  // RUN TREE SELECT.
  // User selects table in tree. Load navigator with selected table and descendants for 2 levels down.
  function runTreeSelect() {
    // Init content.
    initContent( true, true );

    // Close chart.
    closeChart();

    // Load mini content.
    if ( t_loadMainID != "" && t_loadMainParentName != "" && t_loadMainName != "" && t_loadRowID != "" ) {
      runLoad( s_strMiniSelect, t_loadMainID, "", t_loadMainName, null );
    }//load vars valid
  }//runTreeSelect

  // RUN LOAD.
  // Load tables into navigator and/or main canvas according to passed type:
  // s_strMiniSelect   : User selects table in tree. Load navigator with selected table and descendants for 2 levels down.
  //                     Put marquee in default position, then fire load with s_strMarqueeSelect type.
  // s_strMainSelect   : User selects table in navigator. Load main canvas with selected table and descendants for 2 levels down.
  // s_strMarqueeSelect: User or application moves marquee. Load main canvas with all tables intersected by marquee. No checking for descendants.
  function runLoad( type_, mainID_, miniID_, nameSelected_, array_ ) {
    // Stop load timer.
    clearTimeout( g_timerLoad0 );

    // Set name of currently-selected table, if any.
    if ( nameSelected_ == "" ) {
      nameSelected_ = "currently-selected table";
    }//nameSelected_ empty

	  // Create layout array.
    switch( type_ ) {

      case s_strMiniSelect:
		    // Set text for load message.
		    g_loadMessage = g_loadMessage + s_message.loading_ + " " + nameSelected_ + " " + g_uiStr.tipIntoNav_ + " ";

		    // Create mini layout array.
		    createMiniLayout();
      break;

      case s_strMainSelect:
		    // Store IDs, then create layout.
		    if ( stc_isDefined( mainID_ ) && stc_isDefined( miniID_ ) ) {
		      // Store mini and main IDs for use after loading.
		      // Used to select mini and main tables.
			    t_loadMainID = mainID_;
			    t_loadMiniID = miniID_;

			    // Set text for load message.
			    g_loadMessage = g_loadMessage + s_message.loading_ + " " + nameSelected_ + " " + g_uiStr.tipIntoMain_ + " ";

			    // Create main layout array.
			    createMainLayout( mainID_ );
		    }//mainID_ miniID_ valid
      break;

      case s_strMarqueeSelect:
		    if ( stc_isDefined( array_ ) ) {
		      // Init mini and main IDs.
			    t_loadMainID = "";
			    t_loadMiniID = "";

			    // Set text for load message.
			    g_loadMessage = g_loadMessage + g_uiStr.tipFromMarquee_ + " ";

			    // Create main layout from marquee selection.
			    createMainLayoutFromMarquee( array_ );
		    }//array_ valid
      break;

      default: break;
    }//switch type_

    // Perform load animation, then load content.
    if ( $( "#_iconTreeTimer" ) ) {
      $( "#_iconTreeTimer" ).css( "opacity", "0" );
      $( "#_iconTreeTimer" ).css( "visibility", "visible" );
      $( "#_iconTreeTimer" ).animate({ opacity: "1.0" }, 100, function() {
        // Load content.
		    switch( type_ ) {
		      case s_strMiniSelect   : g_timerLoad0 = setTimeout( "loadMini()", 200 ); break;
		      case s_strMainSelect   : g_timerLoad0 = setTimeout( "loadMain( true )", 200 ); break;
		      case s_strMarqueeSelect: g_timerLoad0 = setTimeout( "loadMain( false )", 200 ); break;
		      default: break;
		    }//switch type_
	    });
    }//_iconTreeTimer valid
  }//runLoad

  // END LOAD.
  function endLoad() {
    // Finish load animation.
    if ( $( "#_iconTreeTimer" ) ) {
      $( "#_iconTreeTimer" ).animate({ opacity: "0.0" }, 100, function() {
			   $( "#_iconTreeTimer" ).css( "visibility", "hidden" );
	    });
    }//_iconTreeTimer valid

    // Stop load timer.
    clearTimeout( g_timerLoad0 );
  }//endLoad

  // RESTORE HIERARCHY.
  function restoreHierarchy() {
    // Init content.
    initContent( true, true );

    // Restore hierarchical positions in layout array.
    tree_initFlatTreePositions();

    // Reload existing mini content.
	  runLoad( s_strMiniSelect, "", "", "", null );
  }//restoreHierarchy

  // ============================================================================
  // LAYOUT.
  // ============================================================================

  // CREATE MINI LAYOUT.
  // Create mini layout from selected tree rows.
  function createMiniLayout() {
    // Build layout array.
    if ( stc_isDefined( t_treeSelections ) ) {
      var treeObject_ = new Object();
      var length_     = t_treeSelections.length;
      for ( var i = 0; i < length_; i++ ) {
        // Get object for entry.
        treeObject_ = new Object();
        treeObject_ = tree_getFlatTreeObject( t_treeSelections[i] );

        // Create object for layout array from tree object's properties.
        // Must be completely new object - otherwise, changes to layout array
        // propagate into tree array.
        var obj_              = new Object();
		    obj_.id               = treeObject_.id;
		    obj_.parentID         = treeObject_.parentID;
		    obj_.shardParentName  = treeObject_.shardParentName;
		    obj_.ancestorName     = treeObject_.ancestorName;
		    obj_.parentName       = treeObject_.parentName;
		    obj_.name             = treeObject_.name;
		    obj_.text             = treeObject_.text;
		    obj_.type             = treeObject_.type;
		    obj_.level            = treeObject_.level;
		    obj_.nbrShard         = treeObject_.nbrShard;
		    obj_.keyShard         = treeObject_.keyShard;
		    obj_.avgTime          = treeObject_.avgTime;
		    obj_.totalTimePercent = treeObject_.totalTimePercent;
		    obj_.totalTime        = treeObject_.totalTime;
		    obj_.frequency        = treeObject_.frequency;
		    obj_.heat             = treeObject_.heat;
		    obj_.columns          = new Array(); obj_.columns     = $.merge( [], treeObject_.columns );
		    obj_.foreignKeys      = new Array(); obj_.foreignKeys = $.merge( [], treeObject_.foreignKeys );
		    obj_.tables           = new Array(); obj_.tables      = $.merge( [], treeObject_.tables );
		    obj_.related          = new Array(); obj_.related     = $.merge( [], treeObject_.related );
		    obj_.x                = treeObject_.x;
		    obj_.y                = treeObject_.y;
		    obj_.positionSet      = treeObject_.positionSet;

        // Add object to layout array.
        if ( stc_isDefined( treeObject_ ) ) {
	        g_arrayMini.push( obj_ );
        }//treeObject_ valid
      }//for each entry
    }//t_treeSelections valid

    // Create layout structure.
    // Assigns new positions based on where each table is in hierarchy.
    createLayoutStructure();

    // Update array with any changed positions.
    // Assigns x/y from tree array, which is updated from canvas when user moves tables.
    // DEPENDENCY: Must run after function that assigns positions according to hierarchy, otherwise, hierarchy positions
    // will be wrong.
    updateLayoutPositions( "g_arrayMini" );
  }//createMiniLayout

  // CREATE MAIN LAYOUT.
  // Create layout from selected main table.
  function createMainLayout( id_ ) {
    // Init array for processing.
    g_tableSelections = new Array();

    // Set up processing vars.
    var length_ = 0;

    // Create layout array.
    if ( stc_isDefined( g_arrayMini ) ) {

	    // Create selections array containing passed ID and descendant IDs for two levels.
	    if ( stc_isDefined( id_ ) ) {
        // Add ID to selections array.
        g_tableSelections.push( id_ );

	      // Add descendants.
	      var obj_ = tree_getFlatTreeObject( id_ );
	      if ( stc_isDefined( obj_ ) ) {
	        if ( stc_isDefined( obj_.tables ) ) {
	          if ( obj_.tables.length > 0 ) {
	            // Add IDs for direct descendants.
	            g_tableSelections = $.merge( g_tableSelections, obj_.tables );

				      // Add IDs for descendants for one more level.
				      length_ = obj_.tables.length;
				      for ( var i = 0; i < length_; i++ ) {
				        var objChild_ = tree_getFlatTreeObject( obj_.tables[i] );
					      if ( stc_isDefined( objChild_ ) ) {
					        if ( stc_isDefined( objChild_.tables ) ) {
					          if ( objChild_.tables.length > 0 ) {
					            g_tableSelections = $.merge( g_tableSelections, objChild_.tables );
					          }//objChild_.tables.length gt 0
					        }//objChild_.tables valid
					      }//objChild_ valid
				      }//for each entry
	          }//obj_.tables.length gt 0
	        }//obj_.tables valid
	      }//obj_ valid
	    }//id_ valid

	    // If number of tables not too large to load, continue.
	    // If too large, show log and do not create layout array.
	    if ( g_tableSelections.length < g_vals.loadTooHeavy_ ) {
	      // If heavy but not too large, add text to load message and continue loading.
	      if ( g_tableSelections.length > g_vals.loadHeavy_ ) {
	        g_loadMessage = g_loadMessage + "<span style='color: " + s_red + ";'>" + g_uiStr.tipHeavy_ + " </span>";
	      }//length gt loadHeavy_

		    // Build main layout array by selecting items in selections array from mini layout array.
		    length_ = g_arrayMini.length;
		    for ( var j = 0; j < length_; j++ ) {
		      // If ID is in selections array, add entry to new array.
		      if ( stc_isDefined( g_arrayMini[j].id ) ) {
			      var layoutID_ = g_arrayMini[j].id;
			      var isFound_  = g_tableSelections.indexOf( layoutID_ );
			      if ( isFound_ > -1 ) {
			        g_arrayMain.push( g_arrayMini[j] );
			      }//found
		      }//id_ valid
		    }//for each entry

		    // Update layout array with any changed positions.
		    // Assigns x/y from tree array, which is updated from canvas when user moves tables.
		    // DEPENDENCY: Must run after creating layout array.
		    updateLayoutPositions( "g_arrayMain" );
	    } else {
	      // Number of tables too large to load. Set load message.
	      g_loadMessage = g_uiStr.erTooHeavy_;
	    }//length not lt loadTooHeavy_
    }//g_arrayMini valid
  }//createMainLayout

  // CREATE MAIN LAYOUT FROM MARQUEE.
  // Create main layout from group intersected by marquee.
  function createMainLayoutFromMarquee( arraySelections_ ) {
    // Create layout array.
    if ( stc_isDefined( arraySelections_ ) && stc_isDefined( g_arrayMini ) ) {
      // If overload, add text to load message.
      if ( arraySelections_.length > g_vals.loadHeavy_ ) {
				g_loadMessage = g_loadMessage + "<span style='color: " + s_red + ";'>" + g_uiStr.tipHeavy_ + " </span>";
      }//length gt loadHeavy_

	    // Build layout array from mini layout array.
	    var length_ = g_arrayMini.length;
	    for ( var i = 0; i < length_; i++ ) {
	      // If ID is in selections array, add entry to new array.
	      if ( stc_isDefined( g_arrayMini[i].id ) ) {
		      var layoutID_ = g_arrayMini[i].id;
		      var isFound_  = arraySelections_.indexOf( layoutID_ );
		      if ( isFound_ > -1 ) {
		        g_arrayMain.push( g_arrayMini[i] );
		      }//found
	      }//id_ valid
	    }//for each entry

	    // Update layout array with any changed positions.
	    // Assigns x/y from tree array, which is updated from canvas when user moves tables.
	    // DEPENDENCY: Must run after creating layout array.
	    updateLayoutPositions( "g_arrayMain" );
    }//arraySelections_ g_arrayMini valid
  }//createMainLayoutFromMarquee

  // CREATE LAYOUT STRUCTURE.
  // Set x/y positions for each table in layout array.
  // Layout uses centered hierarchical pattern.
  // Selected item at top, centered above horizontal row of children,
  // then grandchildren in rows/cols under each child.
  function createLayoutStructure() {
    if ( stc_isDefined( t_objectSelected ) ) {
      // Get object for selected item.
      var top_ = new Object();
      var id_  = tree_buildTreeID( t_objectSelected );
      top_     = getMasterProperty( "g_arrayMini", id_, "object_" );

      // Create structure.
      if ( stc_isDefined( top_ ) ) {
	      // Set default x/y for selected item at top.
	      top_.x = g_vals.xLayout_;
	      top_.y = g_vals.yLayout_;

	      // If top has tables, use them to position top, then position tables.
	      if ( stc_isDefined( top_.tables ) ) {
	        if ( top_.tables.length > 0 ) {
				    // Position tables at next two lower levels.
				    // Called function returns total width used by descendants.
				    var descendantWidth_ = createLayoutChildren( top_.tables, top_.level );

				    // Position top item in center, based on descendant width.
				    var xTop_ = ( descendantWidth_ * .5 ) - ( g_vals.wTable_ * .5 );
				    if ( xTop_ < g_vals.xLayout_ ) { xTop_ = g_vals.xLayout_; }
				    top_.x = xTop_;
	        }//tables not empty
	      }//tables valid
      }//top_ valid
    }//t_objectSelected valid
  }//createLayoutStructure

  // CREATE LAYOUT CHILDREN.
  function createLayoutChildren( tables_, levelTop_ ) {
    // Set up descendant width for top level.
    var descendantWidth_ = 0;

    // Process tables.
    if ( stc_isDefined( tables_ ) && stc_isNumber( levelTop_ ) ) {
	    // Set processing vars.
	    var xIncrement_    = 0;
	    var basicWidth_    = g_vals.wTable_ + g_vals.margin_;
	    var childWidth_    = 0;
	    var maxChildWidth_ = 3 * basicWidth_;
	    var x_             = g_vals.xLayout_;

	    // Set y.
	    var y_ = g_vals.yLayout_ + g_vals.hTable_ + g_vals.gutter_;
	    if ( levelTop_ < 1 ) {
	      y_ = g_vals.yLayout_;
	    }//levelTop_ lt 1

	    // Position tables on lower two levels.
	    if ( tables_.length > 0 ) {
	      var child_  = null;
	      var length_ = tables_.length;
	      for ( var i = 0; i < length_; i++ ) {
	        child_ = getMasterProperty( "g_arrayMini", tables_[i], "object_" );
	        if ( stc_isDefined( child_ ) ) {
	          // Set x.
	          x_ = g_vals.xLayout_ + xIncrement_;

	          // Position child at mid-level.
	          child_.x = x_;
	          child_.y = y_;

	          // Init child width.
	          childWidth_ = basicWidth_;

	          // If tables, set child width and position tables.
	          // Limit child width to max of three tables,
	          // since we show lowest level tables in rows of three.
		        if ( stc_isDefined( child_.tables ) ) {
		          if ( child_.tables.length > 0 ) {
			          childWidth_ = childWidth_ * child_.tables.length;
			          if ( child_.tables.length > 3 ) { childWidth_ = maxChildWidth_; }
			          createLayoutDescendants( child_.tables, x_, y_ );
		          }//tables_ not empty
		        }//tables_ valid

	          // Increment descendant width.
	          descendantWidth_ = x_ + childWidth_;

	          // Set x increment.
	          xIncrement_ = xIncrement_ + childWidth_ + g_vals.gutter_;
	        }//child_ valid
	      }//for each entry
	    }//tables_ not empty
    }//parameters valid

    // Return descendant width.
    return descendantWidth_;
  }//createLayoutChildren

  // CREATE LAYOUT DESCENDANTS.
  // Create layout for lowest level of tables (grandchildren of top level).
  // Positions are based on passed x/y of parent.
  // Create 3 columns in 4 rows.
  function createLayoutDescendants( tables_, x_, y_ ) {
    if ( stc_isDefined( tables_ ) && stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
      // Set x/y increments.
      var xIncrement_ = g_vals.wTable_ + g_vals.margin_;
      var yIncrement_ = g_vals.hTable_ + g_vals.gutter_;

      // Set first y.
      y_ = y_ + yIncrement_;

      // Set processing vars.
      var xCurrent_   = 0;
      var yCurrent_   = 0;
      var colCounter_ = 0;
      var rowCounter_ = 0;

      // Loop thru tables and set x/y.
      if ( tables_.length > 0 ) {
	      var child_      = null;
	      var length_     = tables_.length;
	      for ( var i = 0; i < length_; i++ ) {
	        child_ = getMasterProperty( "g_arrayMini", tables_[i], "object_" );
	        if ( stc_isDefined( child_ ) ) {
	          // Set x var and increment column counter.
	          xCurrent_ = x_ + ( colCounter_ * xIncrement_ );
	          colCounter_++;

	          // Set y var.
	          yCurrent_ = y_ + ( rowCounter_ * yIncrement_);

	          // Set child x/y.
	          child_.x = xCurrent_;
	          child_.y = yCurrent_;

	          // If we have created 3 columns, set column counter to 0
	          // and increment row counter.
	          // Next table will start again at original x, one row down.
	          if ( colCounter_ > 2 ) {
	            colCounter_ = 0;
	            rowCounter_++;
	          }//colCounter_ gt 2
	        }//child_ valid
	      }//for each entry
      }//tables_ not empty
    }//params valid
  }//createLayoutDescendants

  // UPDATE LAYOUT POSITIONS.
  // Update array with any changed positions.
  // Assigns x/y from flat tree array, which is updated from canvas when user moves tables.
  function updateLayoutPositions( arrayName_ ) {
    // Get array length.
    var length_ = 0;
    if ( arrayName_ == "g_arrayMain" ) { length_ = g_arrayMain.length; }
    if ( arrayName_ == "g_arrayMini" ) { length_ = g_arrayMini.length; }

    // Set up processing vars.
    var mainID_     = "";
    var entry_      = new Object();
    var treeObject_ = new Object();

    // Update positions from tree array.
    for ( var i = 0; i < length_; i++ ) {
      // Get entry.
      entry_ = new Object();
      if ( arrayName_ == "g_arrayMain" ) { entry_ = g_arrayMain[i]; }
      if ( arrayName_ == "g_arrayMini" ) { entry_ = g_arrayMini[i]; }

      // Get main ID.
      mainID_ = "";
      if ( stc_isDefined( entry_ ) ) { mainID_ = entry_.id; }

      // Get tree object.
      treeObject_ = new Object();
      treeObject_ = tree_getFlatTreeObject( mainID_ );

      // Update positions from tree object.
      if ( stc_isDefined( treeObject_ ) ) {
        if ( treeObject_.positionSet ) {
          entry_.x = treeObject_.x;
          entry_.y = treeObject_.y;
        }//positionSet true
      }//treeObject_ valid
    }//for each entry
  }//updateLayoutPositions

	// ============================================================================
	// TABLE CONTENT.
	// ============================================================================

  // LOAD MINI.
  function loadMini() {
    // Create mini content.
    createContentMini();

    // Stop load timer, then show animation for end load.
    endLoad();

    // Move marquee to default position.
    moveMarquee( 80, 80 );

    // Draw layers.
    g_layerMain.draw();
    g_layerMini.draw();

    // Load content intersected by marquee.
    g_timerLoad0 = setTimeout( "loadMarqueeSelectionFromMini()", 200 );
  }//loadMini

  // LOAD MARQUEE SELECTION FROM MINI.
  function loadMarqueeSelectionFromMini() {
    // Stop load timer.
    clearTimeout( g_timerLoad0 );

    // Load content intersected by marquee.
    var marqueeID_ = stc_getIdentifier( "", s_strMarquee );
    var marquee_   = stc_getElement( marqueeID_, g_stageMini );
    if ( marquee_ ) {
      loadFromMarquee( marquee_ );
    }//marquee_ valid
  }//loadMarqueeSelectionFromMini

  // LOAD MAIN.
  function loadMain( setMarquee_ ) {
    // Create main content. Keeps track of lowest x/y position,
    // which is used later to position global group and marquee.
    createContentMain();

    // Create array with line info for each table.
    createLineArray();

    // Create lines connecting main tables.
    createArrayLines();

    // Stop load timer, then show animation for end load.
    endLoad();

    // Select mini and main tables.
    if ( stc_isDefined( t_loadMainID ) && stc_isDefined( t_loadMiniID ) ) {
      var tableMain_ = stc_getElement( t_loadMainID, g_stageMain );
      var tableMini_ = stc_getElement( t_loadMiniID, g_stageMini );
      if ( stc_isDefined( tableMain_ ) && stc_isDefined( tableMini_ )  ) {
        // Select main table.
        selectMain( tableMain_ );

	      // Select mini table.
	      selectMini( tableMini_ );
      }//tableMain_ tableMini_ valid
    }//t_loadMainID t_loadMiniID valid

    // Reset stage.
    resetStage( 0, 0 );

    // Move global group show it shows in view.
    moveGlobalGroupAnimated( ( -g_xLowest + g_vals.xLayout_ ), ( -g_yLowest + g_vals.yLayout_ ) );

    // Move marquee to just to left and top of selected tables in navigator.
    if ( setMarquee_ ) {
     moveMarquee( ( g_xLowest - g_vals.xLayout_ ), ( g_yLowest - g_vals.yLayout_ ) );
    }//setMarquee_ true

    // Draw layers.
    g_layerMain.draw();
    g_layerMini.draw();

    // Populate message log.
    if ( g_arrayMain.length > 0 ) {
      parent.populateLog( g_loadMessage, s_svcVals.info_ );
    } else {
      if ( g_loadMessage == g_uiStr.erTooHeavy_ ) {
        parent.populateLog( g_loadMessage, s_svcVals.error_ );
      } else {
	      g_loadMessage = g_uiStr.erLoadItem_ + " " + s_message.support_;
	      parent.populateLog( g_loadMessage, s_svcVals.error_ );
      }//g_loadMessage is not g_uiStr.erTooHeavy_
    }//length lt 0
	  g_loadMessage = "";

	  // If this is initial load, send service to get stats for all tables in database.
	  if ( g_isInitLoad ) {
	    runInitialLoad3();
	  }//g_isInitLoad true
  }//loadMain

  // CREATE CONTENT MINI.
  function createContentMini() {
    if (  g_arrayMini ) {
		  // Set up values for creating tables.
		  var mainID_   = null;
		  var type_     = "";
		  var text_     = "";
		  var heat_     = 0;
		  var h_        = g_vals.hTable_;
		  var w_        = g_vals.wTable_;
		  var x_        = 0;
		  var y_        = 0;
		  var xHighest_ = 0;
		  var yHighest_ = 0;

		  // Create mini tables.
		  var length_ = g_arrayMini.length;
		  for ( var i = 0; i < length_; i++ ) {
		    // If entry valid, create table.
	      if ( stc_isDefined( g_arrayMini[i].type ) ) {
	        if ( !tree_isRoot( g_arrayMini[i].type ) ) {
				    if ( stc_isDefined( g_arrayMini[i].id ) &&
				         stc_isDefined( g_arrayMini[i].level ) &&
				         stc_isDefined( g_arrayMini[i].text ) &&
				         stc_isNumber( g_arrayMini[i].heat ) &&
				         stc_isNumber( g_arrayMini[i].x ) &&
				         stc_isNumber( g_arrayMini[i].y ) ) {

				      // Set values.
				      mainID_ = g_arrayMini[i].id;
				      type_   = g_arrayMini[i].type;
				      text_   = g_arrayMini[i].text;
				      heat_   = g_arrayMini[i].heat;
				      x_      = g_arrayMini[i].x;
				      y_      = g_arrayMini[i].y;

				      // Get highest x/y.
				      if ( x_ > xHighest_ ) { xHighest_ = x_; }
				      if ( y_ > yHighest_ ) { yHighest_ = y_; }

				      // If mini table does not exist, create it.
				      var miniID_    = stc_getIdentifier( mainID_, s_strTableMini );
					    var groupMini_ = stc_getElement( miniID_, g_stageMini );
					    if ( !groupMini_ ) {
					      // Create group.
					      var groupMini_ = new Kinetic.Group({
					        id: miniID_,
					        name: text_,
					        x: x_, y: y_, draggable: true
					      });

					      // If group valid, create elements, then add to layer.
				        if ( groupMini_ ) {
					        // Add event handlers.
					        groupMini_.on( "dragstart", function( event ) { event.cancelBubble = true; event.stopPropagation(); });
					        groupMini_.on( "dragend", function( event )   { event.cancelBubble = true; event.stopPropagation(); });
					        groupMini_.on( "dragmove", function( event )  { event.cancelBubble = true; event.stopPropagation(); });

						      // Get fill.
						      var fill_ = stc_getTypeFill( type_);
						      if ( fill_ == s_white ) { fill_ = s_color.blueDark_; }

					        // Create main rectangle.
					        var rect_ = new Kinetic.Rect({
					          id: stc_getIdentifier( mainID_, s_strTableMiniRect ),
					          x: 0, y: 0, width: w_, height: h_,
					          fill: fill_,
					          stroke:	s_white, strokeWidth: 16,
					          lineCap: s_lineCap, lineJoin: s_lineJoin, strokeEnabled: false,
					          cornerRadius: 40, opacity: 1
					        });
					        if ( rect_ ) { groupMini_.add( rect_ ); }

					        // Create label.
						      var label_ = new Kinetic.Text({
						        id: stc_getIdentifier( miniID_, s_strLabel ), x: 0, y: -110,
						        fontSize: 120, fontFamily: s_fontFamily, fontStyle: "bold",
						        align: "left", fill: s_black, visible: false,
						        text: ""
						      });
					        if ( label_ ) { groupMini_.add( label_ ); }

						      // Add heat circle.
						      if ( heat_ >= s_heatVals.hot_ ) {
						        var rHeat_ = 40;
						        var xHeat_ = w_ * .5;
						        var yHeat_ = h_ * .5;
							      var heatCircle_ = new Kinetic.Circle({
							        id: stc_getIdentifier( miniID_, s_strThermometerHotCircle ),
							        x: xHeat_, y: yHeat_,
							        fill: stc_getHeatFill( heat_ ), radius: rHeat_
							      });
							      if ( heatCircle_ ) { groupMini_.add( heatCircle_ ); }
						      }//heat_ not lt hot

					        // Create overlay for handling events.
						      var overlay_ = new Kinetic.Rect({
					          id: stc_getIdentifier( mainID_, s_strTableMiniOverlay ),
					          x: 0, y: 0, width: w_, height: h_,
					          fill: fill_, cornerRadius: 40, opacity: 0
					        });
					        if ( overlay_ ) {
						        // Add event handlers.
						        handleDownMini( overlay_ );
						        handleUpMini( overlay_ );
						        handleMouseOverMini( overlay_ );
						        handleMouseOutMini( overlay_ );

						        // Add to group.
					          groupMini_.add( overlay_ );
					        }//overlay_ valid

					        // Add group to layer.
					        g_layerMini.add( groupMini_ );
				        }//groupMini_ valid
					    }//groupMini_ not valid
			      }//properties valid
	        }//not root
	      }//type valid
	    }//for each table in array

	    // Calculate scale for elements in navigator that shows all tables when dialog is expanded to max.
	    // First, default navigator to minimum size.
	    $( "#_miniContainer" ).css( "height", g_vals.hNavMin_ );
	    $( "#_miniContainer" ).css( "width", g_vals.wNavMin_ );

	    // Also, set scale to default.
      g_scaleMini = g_vals.scaleMini_;
      g_stageMini.setScale( g_scaleMini );

	    // Calculate h/w margins to prevent clipping tables at edges.
	    var marginW_ = ( g_vals.xLayout_ * 2 ) + g_vals.wTable_ + g_vals.margin_;
	    var marginH_ = ( g_vals.yLayout_ * 2 ) + g_vals.hTable_ + g_vals.margin_;

	    // Update highest x/y values from current set of tables.
	    // Add margin to them, then convert to default scale.
	    // We convert to scale because x/y positions are same as those in main screen.
	    xHighest_ = ( xHighest_ + g_vals.wTable_ + marginW_ ) * g_scaleMini;
	    yHighest_ = ( yHighest_ + g_vals.hTable_ + g_vals.gutter_ + marginH_ ) * g_scaleMini;

	    // Get max h/w for navigator.
	    var wMax_ = g_vals.wNavMax_;
	    var hMax_ = g_vals.hNavMax_;

	    // Set up vars for actual h/w needed to include table in navigator.
	    var wActual_ = 0;
	    var hActual_ = 0;

	    // If any table position exceeds max w,
	    // calculate actual w needed to include table in navigator.
	    // Add offset equal to x position of canvas component in html.
	    if ( xHighest_ > wMax_ ) {
	      var xIncrement_ = xHighest_ - wMax_;
	      wActual_        = wMax_ + xIncrement_ + g_vals.wNavMaxOffset_;
	    }//xHighest_ gt wMax_

	    // If any table position exceeds max h,
	    // calculate actual h needed to include table in navigator.
	    // Add offset equal to y position of canvas component in html.
	    if ( yHighest_ > hMax_ ) {
	      var yIncrement_ = yHighest_ - hMax_;
	      hActual_        = hMax_ + yIncrement_ + g_vals.hNavMaxOffset_;
	    }//yHighest_ gt hMax_

	    // Init scale vars to default vals. Provides base from which to compare vals for new scale.
	    var scaleX_  = g_vals.scaleMini_;
	    var scaleY_  = g_vals.scaleMini_;

	    // If actual h/w needed exceeds max, use ratio of max to actual to calculate scale that
	    // reduces all tables to fit into max.
	    if ( wActual_ > wMax_ ) { scaleX_ = ( wMax_ / wActual_ ) * g_vals.scaleMini_; }
	    if ( hActual_ > hMax_ ) { scaleY_ = ( hMax_ / hActual_ ) * g_vals.scaleMini_; }

	    // Get smallest of x/y scales. We will use smallest.
	    var newScale_ = Math.min( scaleX_, scaleY_ );

	    // If new scale is not same as default scale, set elements in navigator to new scale.
	    if ( newScale_ != g_scaleMini ) {
	      // Set to new scale.
	      g_scaleMini = newScale_;
	      g_stageMini.setScale( g_scaleMini );

	      // If scale less than min, add text to load message.
	      if ( newScale_ < g_vals.scaleMiniMin_ ) {
					g_loadMessage = g_loadMessage + "<span style='color: " + s_red + ";'>" + g_uiStr.tipFitNav_ + " </span>";
	      }//newScale_ lt scaleMiniMin_
	    }//newScale_ not same as g_scaleMini

	    // If xHighest_/yHighest_ exceeds min, expand navigator to maximum size.
	    // Because canvas is actually smaller than container, add compensating padding to final height
	    // in order to get full height of container.
	    if ( xHighest_ > g_vals.wNavMin_ || yHighest_ > g_vals.hNavMin_ ) {
	      $( "#_miniContainer" ).animate({ height: g_vals.hNavMax_ + g_vals.hNavMaxPadding_ }, 200, function() {
				   $( "#_miniContainer" ).animate({ width: g_vals.wNavMax_ }, 200, function() { });
		    });
	    }//xHighest_ or yHighest_ greater than min

      // Show zoom icons.
      toggleShowZoomIcons( true );
    }//g_arrayMini valid
  }//createContentMini

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
	    var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );

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
				              id: stc_getIdentifier( mainID_, s_strTableUnderlay ), x: 0, y: 0,
				              height: h_, width: w_,
				              fill: s_grayC, cornerRadius: 20
				            });
				            if ( underlay_ ) { groupMain_.add( underlay_ ); }

							      // Get fill.
							      var fill_ = stc_getTypeFill( type_);
							      if ( fill_ == s_white ) { fill_ = s_color.blueDark_; }

					          // Create main rectangle.
				            var rect_ = new Kinetic.Rect({
				              id: stc_getIdentifier( mainID_, s_strTableRect ), x: 0, y: 0,
				              height: h_, width: w_,
				              fill: fill_, cornerRadius: 20, opacity: g_vals.opacityDim_,
						          stroke: s_white, strokeWidth: 4,
						          lineCap: s_lineCap, lineJoin: s_lineJoin, strokeEnabled: false,
				            });
				            if ( rect_ ) { groupMain_.add( rect_ ); }

					          // Normalize text to exact number of characters.
					          // Insert ellipsis at end to indicate there is more.
					          var textNormalized_ = stc_normalizeText( text_, g_charLimit.main_ );
					          textNormalized_     = stc_addEllipsis( text_, textNormalized_, g_charLimit.main_ );

					          // Create label.
					          var label_ = new Kinetic.Text({
					            id: stc_getIdentifier( mainID_, s_strTableLabel ), x: 0, y: 35,
					            width: w_ - 4, wrap: "word", opacity: g_vals.opacityDim_,
					            fontSize: "13", fontFamily: s_fontFamily, fontStyle: "bold",
					            align: "center", fill: s_black,
					            text: textNormalized_
					          });
					          if ( label_ ) {
					            // Add to group.
					            groupMain_.add( label_ );

					            // Center label.
					            label_.setOffset({ x: -( w_ * .5 ) + ( label_.getWidth() * .5 ) });
					            if ( label_.getHeight() <= 14 ) {
					              label_.setY( 42 );
					            }//height lt or equal 14

					            // Add event handlers.
					            handleMouseOverLabel( label_ );
					            label_.on( "mouseout", function( event ) { mouseOutTooltipLocal( event ); });
					          }//label_ valid

					          // Create chart.
								    var xChart_ = 13;
								    var yChart_ = 81;
								    var hChart_ = 100;
								    var wChart_ = 115;
								    var chart_ = chrt_createMiniChart( stc_getIdentifier( mainID_, s_strTableChart ), xChart_, yChart_, hChart_, wChart_, s_white );
								    if ( chart_ ) {
								      // Set chart scale.
								      chart_.setScale( 0.8 );

								      // Set chart opacity.
								      chart_.setOpacity( g_vals.opacityDim_ );

								      // Add to group.
								      groupMain_.add( chart_ );
								    }//chart_ valid

					          // Create chart icon.
					          var iconChart_ = sh_createIcon( s_strIcon, s_strIconOpen, s_strChart, w_ - 45, 19, downIcon, mouseoverIcon, mouseoutIcon );
					          if ( iconChart_ ) {
					            // Add to group.
					            groupMain_.add( iconChart_ );

					            // Hide icon til selected.
					            sh_toggleShowIcon( groupMain_, s_strIcon + s_strIconOpen + s_strChart, false );
					          }//iconChart_ valid

					          // Create query icon.
					          var iconQuery_ = sh_createIcon( s_strIcon, s_strIconOpen, s_strQueryGroup, w_ - 20, 19, downIcon, mouseoverIcon, mouseoutIcon );
					          if ( iconQuery_ ) {
					            // Add to group.
					            groupMain_.add( iconQuery_ );

					            // Hide icon til selected.
					            sh_toggleShowIcon( groupMain_, s_strIcon + s_strIconOpen + s_strQueryGroup, false );
					          }//iconQuery_ valid

					          // Set thermometer vals.
					          // Use static vars for main dimensions (height, width, corner radius, and bulb radius).
					          // To create smaller or larger thermometer, multiply static vars by same ratio.
					          // Height can be set to a somewhat lower ratio but is best if it is same.
					          // Check height with heat set to max to see what works.
					          var thermometerID_ = stc_getIdentifier( mainID_, s_strTableThermometer );
					          var xThermometer_  = 115;
					          var yThermometer_  = 68;
					          var addTicks_      = true;

							      // Create thermometer (add to group inside called function).
					          if ( stc_isDefined( thermometerID_ ) && stc_isNumber( xThermometer_ ) && stc_isNumber( yThermometer_ ) ) {
					            var thermometer_ = th_createThermometer( groupMain_, thermometerID_, heat_,
					                                                     xThermometer_, yThermometer_,
					                                                     s_thermometerVals.height_, s_thermometerVals.width_,
					                                                     s_thermometerVals.cornerRadius_, s_thermometerVals.bulbRadius_, addTicks_ );
					            if ( thermometer_ ) {
					              // Set opacity.
					              thermometer_.setOpacity( g_vals.opacityDim_ );

					              // Add event handler.
					              handleMouseOverThermometer( thermometer_ );
					              thermometer_.on( "mouseout", function( event ) { mouseOutTooltipLocal( event ); });
					            }//thermometer_ valid
					          }//parameters valid

					          // Add overlay, which prevents inner elements from triggering mouse events until user selects table.
					          var overlay_ = new Kinetic.Rect({
					            id: stc_getIdentifier( mainID_, s_strTableOverlay ),
					            x: 0, y: 0, height: h_, width: w_,
					            fill: s_white, opacity: 0
					          });
					          if ( overlay_ ) {
					            // Add to group.
					            groupMain_.add( overlay_ );

					            // Add event handlers.
					            handleMouseOverMain( overlay_ );
					            overlay_.on( "mouseout", function( event ) { mouseOutTooltipLocal( event ); });
					          }//overlay_ valid

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

  // DESTROY CONTENT MAIN.
  function destroyContentMain() {
    if ( stc_isDefined( g_arrayMain ) ) {
		  var length_ = g_arrayMain.length;
		  for ( var i = 0; i < length_; i++ ) {
		    if ( stc_isDefined( g_arrayMain[i].id ) ) {
		      var element_ = stc_getElement( stc_getIdentifier( g_arrayMain[i].id, "" ), g_stageMain );
		      if ( element_ ) { element_.destroy(); }
	      }//id_ valid
	    }//for each table in array
    }//g_arrayMain valid
  }//destroyContentMain

  // DESTROY CONTENT MINI.
  function destroyContentMini() {
    if ( stc_isDefined( g_arrayMini ) ) {
		  var length_ = g_arrayMini.length;
		  for ( var i = 0; i < length_; i++ ) {
		    if ( stc_isDefined( g_arrayMini[i].id ) ) {
		      var element_ = stc_getElement( stc_getIdentifier( g_arrayMini[i].id, s_strTableMini ), g_stageMini );
		      if ( element_ ) { element_.destroy(); }
	      }//id_ valid
	    }//for each table in array
    }//g_arrayMini valid
  }//destroyContentMini

  // GET MASTER PROPERTY.
  function getMasterProperty( arrayName_, id_, propertyName_ ) {
    // Get array length.
    var length_ = 0;
    if ( arrayName_ == "g_arrayMain" ) { length_ = g_arrayMain.length; }
    if ( arrayName_ == "g_arrayMini" ) { length_ = g_arrayMini.length; }

    // Set up processing vars.
    var mainID_   = "";
    var property_ = null;
    var entry_    = new Object();

    // Loop through array. If ID matches passed ID, set property and break.
    if ( stc_isDefined( id_ ) && stc_isDefined( propertyName_ ) ) {
      for ( var i = 0; i < length_; i++ ) {
        // Get entry.
        entry_ = new Object();
        if ( arrayName_ == "g_arrayMain" ) { entry_ = g_arrayMain[i]; }
        if ( arrayName_ == "g_arrayMini" ) { entry_ = g_arrayMini[i]; }

        // Get main ID.
        mainID_ = "";
        if ( stc_isDefined( entry_ ) ) { mainID_ = entry_.id; }

        // If match, set property.
        if ( mainID_ == id_ ) {

		      switch( propertyName_ ) {

		        case "object_"          : property_ = entry_; break;
		        case "parentID_"        : if ( stc_isDefined( entry_.parentID ) )         { property_ = entry_.parentID; } break;
		        case "type_"            : if ( stc_isDefined( entry_.type ) )             { property_ = entry_.type; } break;
		        case "text_"            : if ( stc_isDefined( entry_.text ) )             { property_ = entry_.text; } break;
		        case "heat_"            : if ( stc_isDefined( entry_.heat ) )             { property_ = entry_.heat; } break;
		        case "avgTime_"         : if ( stc_isDefined( entry_.avgTime ) )          { property_ = entry_.avgTime; } break;
		        case "totalTimePercent_": if ( stc_isDefined( entry_.totalTimePercent ) ) { property_ = entry_.totalTimePercent; } break;
		        case "frequency_"       : if ( stc_isDefined( entry_.frequency ) )        { property_ = entry_.frequency; } break;
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
  // EVENTS - MINI.
  // ============================================================================

  // HANDLE DOWN MINI.
  // NOTE: Do not cancel bubble or propagation, because it prevents mini from dragging.
  function handleDownMini( shape_ ) {
    shape_.on( "mousedown", function( event ) {
      // Handle event.
      if ( shape_ ) {
        if ( shape_.getParent() ) {
	        var parentID_  = shape_.getParent().getId();
	        var tableMini_ = stc_getElement( parentID_, g_stageMini );
	        if ( tableMini_ ) {
	          downMini( tableMini_ );
	        }//tableMini_ valid
        }//parent valid
      }//shape_ valid
    });
  }//handleDownMini

  // DOWN MINI.
  function downMini( tableMini_ ) {
    if ( tableMini_ ) {
      // Hide label.
      toggleShowMiniLabel( tableMini_, false );

      // Store start position.
      g_xStartMini = Math.round( tableMini_.getX() );
      g_yStartMini = Math.round( tableMini_.getY() );
    }//tableMini_ valid
  }//downMini

  // HANDLE UP MINI.
  function handleUpMini( shape_ ) {
    shape_.on( "mouseup", function( event ) {
      // Cancel propagation.
      event.cancelBubble = true;
      event.stopPropagation();

      // Handle event.
      if ( shape_ ) {
        if ( shape_.getParent() ) {
	        var parentID_  = shape_.getParent().getId();
	        var tableMini_ = stc_getElement( parentID_, g_stageMini );
	        if ( tableMini_ ) {
	          upMini( tableMini_ );
	        }//tableMini_ valid
        }//parent valid
      }//shape_ valid
    });
  }//handleUpMini

  // UP MINI.
  function upMini( tableMini_ ) {
    if ( tableMini_ ) {
      // Get ID for corresponding main table.
      var mainID_ = stc_extractIDStr( tableMini_.getId(), s_strTableMini );

      // Store final x/y.
      if ( ( Math.round( tableMini_.getX() ) != g_xStartMini ) || ( Math.round( tableMini_.getY() ) != g_yStartMini ) ) {
        tree_updateFlatTreePosition( mainID_, tableMini_.getX(), tableMini_.getY() );
      }//position changed

      // Load selected table and any direct children
      if ( stc_isDefined( mainID_ ) ) {
	      // Init main content.
	      initContent( false, true );

		    // Close chart.
		    closeChart();

	      // Load main content.
	      runLoad( s_strMainSelect, mainID_, tableMini_.getId(), tableMini_.getName(), null );
      }//mainID_ valid
    }//tableMini_ valid
  }//upMini

  // HANDLE MOUSE OVER MINI.
  function handleMouseOverMini( shape_ ) {
    shape_.on( "mouseover", function() {
      if ( shape_ ) {
        if ( shape_.getParent() ) {
	        var parentID_  = shape_.getParent().getId();
	        var tableMini_ = stc_getElement( parentID_, g_stageMini );
	        if ( tableMini_ ) {
		        // Set opacity.
		        tableMini_.setOpacity( g_vals.opacityDim_ );

		        // Show label.
		        toggleShowMiniLabel( tableMini_, true );
	        }//tableMini_ valid
        }//parent valid
      }//shape_ valid
    });
  }//handleMouseOverMini

  // HANDLE MOUSE OUT MINI.
  function handleMouseOutMini( shape_ ) {
    shape_.on( "mouseout", function() {
      if ( shape_ ) {
        if ( shape_.getParent() ) {
	        var parentID_  = shape_.getParent().getId();
	        var tableMini_ = stc_getElement( parentID_, g_stageMini );
	        if ( tableMini_ ) {
		        // Set opacity.
		        tableMini_.setOpacity( 1.0 );

		        // Hide label.
		        toggleShowMiniLabel( tableMini_, false );
	        }//tableMini_ valid
        }//parent valid
      }//shape_ valid
    });
  }//handleMouseOutMini

  // TOGGLE SHOW MINI LABEL.
  function toggleShowMiniLabel( tableMini_, show_ ) {
    if ( tableMini_ ) {
      var labelID_ = stc_getIdentifier( tableMini_.getId(), s_strLabel );
      var label_   = stc_getElement( labelID_, g_stageMini );
      if ( label_ ) {
        if ( show_ ) {
          // Move table to top.
          tableMini_.moveToTop();

          // If table is positioned past half way point in canvas,
          // push label back to left (switching alignment does not work).
          // Not able to get label width consistently,
          // so use length of text string as base for calculating rough width,
          // then push label to left by that amount.
          label_.setX( 0 );
          var xLabel_ = tableMini_.getX() * g_scaleMini;
          var wLabel  = tableMini_.getName().length;
          var wHalf_  = g_vals.wNavMax_ * .5;
          var xNew_   = 0;
          if ( stc_isNumber( xLabel_ ) && stc_isNumber( wLabel ) && stc_isNumber( wHalf_ ) ) {
	          if ( xLabel_ > ( wHalf_ ) ) {
	            xNew_ = wLabel * 45;
	            label_.setX( -xNew_ );
	          }//xLabel_ gt wNavMax_
          }//xLabel_ wLabel wHalf_ valid

          // Set text.
          label_.setText( tableMini_.getName() );

          // Show label.
          label_.show();
        } else {
          // Hide label.
          label_.hide();

          // Init text.
          label_.setText( "" );
        }//show_ false
        g_layerMini.draw();
      }//label_ valid
    }//tableMini_ valid
  }//toggleShowMiniLabel

  // ============================================================================
  // EVENTS - MAIN.
  // ============================================================================

  // HANDLE DOWN MAIN.
  function handleDownMain( tableMain_ ) {
    tableMain_.on( "mousedown", function( event ) {
      // Cancel propagation.
      event.cancelBubble = true;
      event.stopPropagation();

      // Hide tooltip.
      stc_hideTooltip( $( "#_tooltip" ) );

      if ( tableMain_ ) {
        // Brighten selected table.
        brightenMain( tableMain_ );

	      // Store start position.
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
	        // Kinetic has bug that prevents cancel bubble from working.
	        // If user clicks inner element of table, click also triggers this function, which is unwanted.
	        // However, inner elements can only be clicked if table's overlay is NOT visible.
	        // Therefore, we check whether overlay is visible. If it is, we go ahead with table select.
	        var doSelect_ = false;
	        var overlay_  = stc_getElement( stc_getIdentifier( mainID_, s_strTableOverlay ), g_stageMain );
	        if ( overlay_ ) {
	          if ( overlay_.isVisible() ) {
	            doSelect_ = true;
	          }//visible
	        }//overlay_ valid

	        // If overlay is visible, continue with select function.
	        if ( doSelect_ ) {
	          var miniID_    = stc_getIdentifier( mainID_, s_strTableMini );
	          var tableMini_ = stc_getElement( miniID_, g_stageMini );
	          if ( tableMini_ ) {
					    // Init stage. Includes timer tracking stop.
					    initStage();

					    // Close chart.
					    closeChart();

				      // Unselect all elements
				      unselectAllElements();

	            // Select main table.
	            selectMain( tableMain_ );

	            // Select mini table.
	            selectMini( tableMini_ );
	          }//tableMini_ valid

	          // Draw layers.
	          g_layerMain.draw();
	          g_layerMini.draw();
	        }//doSelect_ true
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

	      // Store final x/y.
	      if ( ( Math.round( x_ ) != g_xStartMain ) || ( Math.round( y_ ) != g_yStartMain ) ) {
	        tree_updateFlatTreePosition( mainID_, x_, y_ );
	      }//position changed

        // Handle event.
        if ( stc_isDefined( mainID_ ) && stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
          // Get corresponding mini table.
          var miniID_    = stc_getIdentifier( mainID_, s_strTableMini );
          var tableMini_ = stc_getElement( miniID_, g_stageMini );

          // Move mini table.
          if ( tableMini_ ) {
            tableMini_.setX( x_ );
            tableMini_.setY( y_ );
            g_layerMini.draw();
          }//tableMini_ valid
        }//mainID_ x_ y_ valid
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
      var parentID_ = getMasterProperty( "g_arrayMain", mainID_, "parentID_" );
      var tables_   = getMasterProperty( "g_arrayMain", mainID_, "tables_" );

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

  // HANDLE MOUSE OVER MAIN.
  function handleMouseOverMain( overlay_ ) {
    overlay_.on( "mouseover", function( event ) {
      // Cancel bubble.
      event.cancelBubble = true;

      // Show tooltip.
      if ( overlay_ && g_stageMain.getMousePosition() ) {
	      // Setup vars for tooltip text.
	      var textTooltip_      = "";
	      var name_             = s_message.notFound_;
	      var avgTime_          = s_message.notFound_;
	      var totalTimePercent_ = s_message.notFound_;
	      var frequency_        = "";

	      // Get main ID, then lookup values for building tooltip text.
	      var mainID_ = stc_extractIDStr( overlay_.getId(), s_strTableOverlay );
	      if ( stc_isDefined( mainID_ ) ) {
	        name_             = getMasterProperty( "g_arrayMain", mainID_, "text_" );
	        avgTime_          = getMasterProperty( "g_arrayMain", mainID_, "avgTime_" );
	        totalTimePercent_ = getMasterProperty( "g_arrayMain", mainID_, "totalTimePercent_" );
	        frequency_        = getMasterProperty( "g_arrayMain", mainID_, "frequency_" );
	      }//mainID_ valid

	      // Build text.
	      textTooltip_ = name_ +
	                     "<br>Average query time: " + avgTime_ + " ms" +
	                     "<br>% of total: " + totalTimePercent_ +
	                     "<br>Frequency: " + frequency_ + "/sec" +
	                     "<br><br>" + g_uiStr.tipClickTable_;

        // Show tooltip.
        var mousePos_ = g_stageMain.getMousePosition();
        var x_        = mousePos_.x + g_vals.margin_;
        var y_        = mousePos_.y + g_vals.margin_;
        stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
        stc_showTooltip( $( "#_tooltip" ), textTooltip_, 120, 260, true );
      }//overlay_ mousePosition valid
    });
  }//handleMouseOverMain

  // HANDLE MOUSE OVER LABEL.
  function handleMouseOverLabel( shape_ ) {
    shape_.on( "mouseover", function( event ) {
      // Cancel bubble.
      event.cancelBubble = true;

      // Handle event.
      if ( shape_ ) {
        var parent_ = shape_.getParent();
        if ( parent_ ) {
          // Show tooltip.
          if ( stc_isDefined( g_stageMain.getMousePosition() ) ) {
            var mousePos_ = g_stageMain.getMousePosition();
            var x_        = mousePos_.x + g_vals.margin_;
            var y_        = mousePos_.y + g_vals.margin_;
            stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
            stc_showTooltip( $( "#_tooltip" ), parent_.getName(), 20, 0, false );
          }//mousePosition valid
        }//parent_ valid
      }//shape_ valid
    });
  }//handleMouseOverLabel

  // HANDLE MOUSE OVER THERMOMETER.
  function handleMouseOverThermometer( shape_ ) {
    shape_.on( "mouseover", function( event ) {
      // Cancel bubble.
      event.cancelBubble = true;

      // Handle event.
      if ( shape_ ) {
        var parent_ = shape_.getParent();
        if ( parent_ ) {
          // Set tooltip text.
          var text_     = s_message.notFound_;
          var heatText_ = getMasterProperty( "g_arrayMain", parent_.getId(), "heat_" );
          if ( stc_isDefined( heatText_ ) ) {
            text_ = g_uiStr.tipHeat0_ + " " + heatText_ + " " + g_uiStr.tipHeat1_;
          }//heat_ valid

          // Show tooltip.
          if ( stc_isDefined( g_stageMain.getMousePosition() ) ) {
            var mousePos_ = g_stageMain.getMousePosition();
            var x_        = mousePos_.x + g_vals.margin_;
            var y_        = mousePos_.y + g_vals.margin_;
            stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
            stc_showTooltip( $( "#_tooltip" ), text_, 20, 0, false );
          }//mousePosition valid
        }//parent_ valid
      }//shape_ valid
    });
  }//handleMouseOverThermometer

  // ============================================================================
  // EVENTS - OTHER.
  // ============================================================================

  // MOUSEOVER ICON.
  function mouseoverIcon( event ) {
    if ( stc_isDefined( event.targetNode ) ) {
      var shape_ = event.targetNode;
      if ( shape_ && stc_isDefined( g_stageMain.getMousePosition() ) ) {
        // Show tooltip.
        var mousePos_ = g_stageMain.getMousePosition();
        var x_        = mousePos_.x + g_vals.margin_;
        var y_        = mousePos_.y + g_vals.margin_;
        stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
        stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 0, false );

        // Perform mouseover effect.
        var parent_ = shape_.getParent();
        if ( parent_ ) {
          parent_.setOpacity( 0.5 );
          g_stageMain.draw();
        }//parent_ valid
      }//shape_ mousePosition valid
    }//targetNode valid
  }//mouseoverIcon

  // MOUSEOUT ICON.
  function mouseoutIcon( event ) {
    if ( stc_isDefined( event.targetNode ) ) {
      var shape_ = event.targetNode;
      if ( shape_ ) {
        // Hide tooltip.
        mouseOutTooltipLocal( event );

        // Perform mouseout effect.
        var parent_ = shape_.getParent();
        if ( parent_ ) {
          parent_.setOpacity( 1 );
          g_stageMain.draw();
        }//parent_ valid
      }//shape_ valid
    }//targetNode valid
  }//mouseoutIcon

  // DOWN ICON.
  function downIcon( event ) {
    // Cancel propagation.
    event.cancelBubble = true;
    event.stopPropagation();

    // Handle event.
    if ( stc_isDefined( event.targetNode ) ) {
      var shape_ = event.targetNode;
      if ( shape_ ) {
	      if ( shape_.getParent() ) {
	        // Get icon name.
	        var iconName_ = shape_.getParent().getName();

	        // Get icon type.
	        var work_ = stc_splitStringBack( iconName_, s_strIcon );
	        var type_ = stc_splitStringFront( work_, "_" );
	        type_     = type_ + "_";

	        // Get icon's component.
	        var component_ = stc_splitStringBack( work_, type_ );

	        // Handle according to type and component.
	        if ( stc_isDefined( type_ ) && stc_isDefined( component_ ) ) {

	          // SWITCH BY TYPE.
	          switch( type_ ) {

              // CLOSE.
              case s_strIconClose:
                switch( component_ ) {
                  default: break;
                }//switch component_
              break;

              // OPEN.
              case s_strIconOpen:
                switch( component_ ) {

                  case s_strChart:
									  // Get stats for selected table.
									  if ( g_tableSelected ) {
										  // Get ID for selected table.
										  var mainID_ = g_tableSelected.getId();

										  // Get stats.
										  if ( stc_isDefined( mainID_ ) ) {
							          startStatList( mainID_, s_statType.table_ );
										  }//mainID_ valid
									  }//g_tableSelected valid
                  break;

                  case s_strQueryGroup :
									  // Get query list for selected table.
									  if ( g_tableSelected ) {
								      setupQueryRequest();
								      getQueryList( g_tableSelected.getId(), s_queryType.all_ );
									  }//g_tableSelected valid
                  break;

                  default: break;

                }//switch component_
              break;

              // DEFAULT.
              default: break;

	          }//switch type_
	          // SWITCH BY TYPE END.

	        }//type_ component_ valid
	      }//parent valid
      }//shape_ valid
    }//targetNode valid
  }//downIcon

  // MOUSEOVER SHAPE.
  function mouseoverShape( event ) {
    if ( event.targetNode ) {
	    var shape_ = event.targetNode;
	    if ( shape_ && g_stageMain.getMousePosition() ) {
	      var mousePos_ = g_stageMain.getMousePosition();
	      var x_ = mousePos_.x + g_vals.margin_;
	      var y_ = mousePos_.y + g_vals.margin_;
	      stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
	      stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 0, false );
	    }//shape_ mousePosition valid
    }//targetNode valid
  }//mouseoverShape

  // MOUSE OUT TOOLTIP LOCAL.
  function mouseOutTooltipLocal( event ) {
    stc_mouseOutTooltip( $( "#_tooltip" ), event );
  }//mouseOutTooltipLocal

  // ============================================================================
  // UNSELECTION.
  // ============================================================================

  // UNSELECT ALL ELEMENTS.
  function unselectAllElements() {
    // Unselect currently-selected table.
    if ( g_tableSelected ) {
      var mainID_ = g_tableSelected.getId();
      unselectTable( mainID_ );
      unselectRelatedTables( mainID_ );
      unselectMini( mainID_ );
    }//g_tableSelected valid

    // Null var for currently-selected table. DEPENDENCY: Do this after unselecting currently-selected table.
    g_tableSelected = null;
  }//unselectAllElements

  // UNSELECT MINI.
  function unselectMini( mainID_ ) {
    if ( stc_isDefined( mainID_ ) ) {
      var rectID_ = stc_getIdentifier( mainID_, s_strTableMiniRect );
      var rect_   = stc_getElement( rectID_, g_stageMini );
      if ( rect_ ) {
        rect_.setStrokeEnabled( false );
      }//rect_ valid
    }//mainID_ valid
  }//unselectMini

  // UNSELECT TABLE.
  function unselectTable( mainID_ ) {
    if ( stc_isDefined( mainID_ ) ) {
      // Set down opacity and stroke of main rectangle.
      var rect_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableRect ), g_stageMain );
      if ( rect_ ) {
        rect_.setOpacity( g_vals.opacityDim_ );
        rect_.setStrokeEnabled( false );
      }//rect_ valid

      // Set down opacity and color of label.
      var label_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableLabel ), g_stageMain );
      if ( label_ ) {
        label_.setOpacity( g_vals.opacityDim_ );
        label_.setFill( s_black );
      }//label_ valid

      // Set down opacity of chart.
      var chart_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableChart ), g_stageMain );
      if ( chart_ ) {
        chart_.setOpacity( g_vals.opacityDim_ );
      }//chart_ valid

      // Set down opacity of thermometer.
      var thermometer_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableThermometer ), g_stageMain );
      if ( thermometer_ ) {
        thermometer_.setOpacity( g_vals.opacityDim_ );
      }//thermometer_ valid

      // Hide chart and query icons.
      sh_toggleShowIcon( g_tableSelected, s_strIcon + s_strIconOpen + s_strChart, false );
      sh_toggleShowIcon( g_tableSelected, s_strIcon + s_strIconOpen + s_strQueryGroup, false );

      // Show overlay, which prevents inner elements from triggering mouse events until user selects table.
      var overlay_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableOverlay ), g_stageMain );
      if ( overlay_ ) {
        overlay_.moveToTop()
        overlay_.show();
      }//overlay_ valid
    }//mainID_ valid
  }//unselectTable

  // UNSELECT RELATED TABLES.
  function unselectRelatedTables( mainID_ ) {
    if ( stc_isDefined( mainID_ ) ) {
	    var related_ = getMasterProperty( "g_arrayMain", mainID_, "related_" );
	    if ( stc_isDefined( related_ ) ) {
	      // Unselect (from limited selection) each one.
        var length_ = related_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Get ID.
          var relatedID_ = related_[i];

          // Set line opacity.
          setLineOpacity( mainID_, relatedID_, false );

		      // Set down opacity of table's component elements.
		      unselectTable( relatedID_ );
        }//for all related tables
	    }//related_ valid
    }//mainID_ valid
  }//unselectRelatedTables

  // ============================================================================
  // SELECTION.
  // ============================================================================

  // SELECT MINI.
  function selectMini( tableMini_ ) {
    if ( tableMini_ ) {
      // Get ID for corresponding main table.
      var mainID_ = stc_extractIDStr( tableMini_.getId(), s_strTableMini );

      // Set stroke of main rectangle.
      var rectID_ = stc_getIdentifier( mainID_, s_strTableMiniRect );
      var rect_   = stc_getElement( rectID_, g_stageMini );
      if ( rect_ ) {
        rect_.setStrokeEnabled( true );
      }//rect_ valid

      // Move table to top.
      tableMini_.moveToTop();
    }//tableMini_ valid
  }//selectMini

  // AUTO SELECT MINI.
  // Programmatically selects mini and consequently main table.
  function autoSelectMini( miniID_ ) {
    var tableMini_ = stc_getElement( miniID_, g_stageMini );
    if ( tableMini_ ) {
      downMini( tableMini_ );
      upMini( tableMini_ );
    }//tableMini_ valid
  }//autoSelectMini

  // SELECT MAIN.
  function selectMain( tableMain_ ) {
    if ( tableMain_ ) {
      // Store selected table.
      g_tableSelected = tableMain_;

      // Get table ID.
      var mainID_ = tableMain_.getId();

      // Select table.
      if ( stc_isDefined( mainID_ ) ) {
        // Brighten selected table.
        brightenMain( tableMain_, mainID_ );

        // Brighten related tables.
        brightenRelatedTables( mainID_ );

        // Hide overlay, which prevents inner elements from triggering mouse events until user selects table.
        var overlay_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableOverlay ), g_stageMain );
        if ( overlay_ ) {
          overlay_.moveToBottom();
          overlay_.hide();
        }//overlay_ valid
      }//mainID_ valid

      // Show chart and query icons.
      sh_toggleShowIcon( tableMain_, s_strIcon + s_strIconOpen + s_strChart, true );
      sh_toggleShowIcon( tableMain_, s_strIcon + s_strIconOpen + s_strQueryGroup, true );

      // Move table to top.
      tableMain_.moveToTop();
    }//tableMain_ valid
  }//selectMain

  // BRIGHTEN MAIN.
  function brightenMain( tableMain_, mainID_ ) {
    if ( tableMain_ && stc_isDefined( mainID_ ) ) {
      // Brighten stroke of main rectangle.
      var rect_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableRect ), g_stageMain );
      if ( rect_ ) {
        rect_.setStrokeEnabled( true );
      }//rect_ valid

      // Brighten opacity of table's component elements.
      brightenTable( mainID_ );
    }//tableMain_ mainID_ valid
  }//brightenMain

  // BRIGHTEN RELATED TABLES.
  function brightenRelatedTables( mainID_ ) {
    if ( stc_isDefined( mainID_ ) ) {
	    var related_ = getMasterProperty( "g_arrayMain", mainID_, "related_" );
	    if ( stc_isDefined( related_ ) ) {
	      // Select (limited selection) each one.
        var length_ = related_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Get ID.
          var relatedID_ = related_[i];

          // Set line opacity.
          setLineOpacity( mainID_, relatedID_, true );

		      // Brighten opacity of table's component elements.
		      brightenTable( relatedID_ );
        }//for all related tables
	    }//related_ valid
    }//mainID_ valid
  }//brightenRelatedTables

  // BRIGHTEN TABLE.
  function brightenTable( mainID_ ) {
    if ( stc_isDefined( mainID_ ) ) {
      // Brighten opacity of main rectangle.
      var rect_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableRect ), g_stageMain );
      if ( rect_ ) {
        rect_.setOpacity( g_vals.opacitySelected_ );
      }//rect_ valid

      // Brighten opacity and color of label.
      var label_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableLabel ), g_stageMain );
      if ( label_ ) {
        label_.setOpacity( g_vals.opacitySelected_ );
        var fill_ = s_black;
        if ( getMainLabelColor( mainID_ ) ) {
          fill_ = getMainLabelColor( mainID_ );
        }//return valid
        label_.setFill( fill_ );
      }//label_ valid

      // Brighten opacity of chart.
      var chart_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableChart ), g_stageMain );
      if ( chart_ ) {
        chart_.setOpacity( g_vals.opacitySelected_ );
      }//chart_ valid

      // Brighten opacity of thermometer.
      var thermometer_ = stc_getElement( stc_getIdentifier( mainID_, s_strTableThermometer ), g_stageMain );
      if ( thermometer_ ) {
        thermometer_.setOpacity( g_vals.opacitySelected_ );
      }//thermometer_ valid
    }//mainID_ valid
  }//brightenTable

  // GET MAIN LABEL COLOR.
  // If table's type uses a dark color, set label color to white.
  function getMainLabelColor( mainID_ ) {
    var fill_ = s_black;
    var type_ = "";
    if ( stc_isDefined( mainID_ ) ) {
	    type_ = getMasterProperty( "g_arrayMain", mainID_, "type_" )
      if ( type_ == s_tableType.global_ ||
           type_ == s_tableType.logOnly_ ||
           type_ == s_tableType.nonRelational_ ) {

        fill_ = s_white;
      }//type_ uses dark color
    }//mainID_ valid
    return fill_;
  }//getMainLabelColor

  // ============================================================================
  // MARQUEE/GLOBAL GROUP/STAGE.
  // ============================================================================

  // CREATE MARQUEE
  function createMarquee() {
    var marquee_ = new Kinetic.Rect({
      id: stc_getIdentifier( "", s_strMarquee ), x: g_vals.xLayout_, y: g_vals.yLayout_,
      width: g_vals.wStage_, height: g_vals.hStage_,
      fill: s_grayE, stroke: s_gray6, strokeWidth: 16, dashArray: s_dash1,
      opacity: 0.8, cornerRadius: 40, draggable: true
    });
    if ( marquee_ ) {
      // Add event handlers.
      marquee_.on( "mousedown", function( event ) { event.cancelBubble = true; event.stopPropagation(); });
      handleDragStartMarquee( marquee_ );
      marquee_.on( "dragmove", function( event )  { event.cancelBubble = true; event.stopPropagation(); });
      handleDragEndMarquee( marquee_ );

      // Add to layer.
      g_layerMini.add( marquee_ );

      // Move to bottom.
      marquee_.moveToBottom();
    }//marquee_ valid
  }//createMarquee

  // MOVE MARQUEE.
  function moveMarquee( x_, y_ ) {
    var marqueeID_ = stc_getIdentifier( "", s_strMarquee );
    var marquee_   = stc_getElement( marqueeID_, g_stageMini );
    if ( marquee_ && stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
        marquee_.setX( x_ ); marquee_.setY( y_ );
    }//parameters valid
  }//moveMarquee

  // SIZE MARQUEE.
  function sizeMarquee( h_, w_ ) {
    var marqueeID_ = stc_getIdentifier( "", s_strMarquee );
    var marquee_   = stc_getElement( marqueeID_, g_stageMini );
    if ( marquee_ && stc_isNumber( h_ ) && stc_isNumber( w_ ) ) {
      marquee_.setHeight( h_ ); marquee_.setWidth( w_ );
    }//parameters valid
    return marquee_;
  }//sizeMarquee

  // HANDLE DRAG START MARQUEE.
  function handleDragStartMarquee( marquee_ ) {
    marquee_.on( "dragstart", function( event ) {
      // Cancel propagation.
      event.cancelBubble = true;
      event.stopPropagation();

      // Set opacity and move to top.
      if ( marquee_ ) {
        marquee_.setOpacity( 0.5 );
        marquee_.moveToTop();
      }//marquee_ valid
    });
  }//handleDragStartMarquee

  // HANDLE DRAG END MARQUEE.
  function handleDragEndMarquee( marquee_ ) {
    marquee_.on( "dragend", function( event ) {
      // Cancel propagation.
      event.cancelBubble = true;
      event.stopPropagation();

      // Set opacity and load content intersected by marquee.
      if ( marquee_ ) {
        marquee_.setOpacity( 0.8 );
        loadFromMarquee( marquee_ );
      }//marquee_ valid
    });
  }//handleDragEndMarquee

  // LOAD FROM MARQUEE.
  function loadFromMarquee( marquee_ ) {
    if ( marquee_ ) {
      // Move to bottom.
      marquee_.moveToBottom();

      // Get selections array.
      var arraySelections_ = new Array();
      arraySelections_ = getMarqueeSelection();

      // Init main content.
      initContent( false, true );

	    // Close chart.
	    closeChart();

      // Load main content.
      runLoad( s_strMarqueeSelect, "", "", "", arraySelections_ );
    }//marquee_ valid
  }//loadFromMarquee

  // GET MARQUEE SELECTION.
  function getMarqueeSelection() {
    // Init array.
    var arraySelections_ = new Array();

     // Check if marquee intersects any table on mini stage.
     var marqueeID_ = stc_getIdentifier( "", s_strMarquee );
     var marquee_   = stc_getElement( marqueeID_, g_stageMini );
    if ( marquee_ ) {
      // Get marquee left, right, top, bottom.
      var r1_ = new Object();
      r1_.left = marquee_.getX(); r1_.right = marquee_.getX() + marquee_.getWidth();
      r1_.top = marquee_.getY(); r1_.bottom = marquee_.getY() + marquee_.getHeight();

      // Check against mini tables on stage.
      if ( stc_isNumber( r1_.left ) && stc_isNumber( r1_.right ) && stc_isNumber( r1_.top ) && stc_isNumber( r1_.bottom ) ) {
        var length_ = g_arrayMini.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( stc_isDefined( g_arrayMini[i].id ) ) {
              // Get table and rectangle.
              var mainID_     = g_arrayMini[i].id;
              var miniID_     = stc_getIdentifier( mainID_, s_strTableMini );
              var tableMini_  = stc_getElement( miniID_, g_stageMini );
              var rectMiniID_ = stc_getIdentifier( mainID_, s_strTableMiniRect );
              var rectMini_   = stc_getElement( rectMiniID_, g_stageMini );
              if ( tableMini_ && rectMini_ ) {
                // Get table left, right, top, bottom.
                var r2_ = new Object();
                r2_.left = tableMini_.getX(); r2_.right = tableMini_.getX() + rectMini_.getWidth();
                r2_.top = tableMini_.getY(); r2_.bottom = tableMini_.getY() + rectMini_.getHeight();

                // Check intersection.
                // If true, add main table ID to array.
                if ( r2_ && stc_isNumber( r2_.left ) && stc_isNumber( r2_.right ) && stc_isNumber( r2_.top ) && stc_isNumber( r2_.bottom ) ) {
                  if ( stc_intersectShape( r1_, r2_ ) ) {
	                  arraySelections_.push( mainID_ );
                  }//intersection
                }//object properties valid
              }//tableMini_ rectMini_
          }//mainID_ valid
        }//for each table in array
      }//object and properties valid
    }//marquee_ valid

    // Return array.
    return arraySelections_;
  }//getMarqueeSelection

  // SCALE GLOBAL GROUP.
  function scaleGlobalGroup( scale_ ) {
    if ( stc_isNumber( scale_ ) ) {
      var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );
      if ( groupGlobal_ ) {
	      g_scaleMain = scale_;
	      groupGlobal_.setScale( g_scaleMain );
      }//groupGlobal_ valid
    }//scale_ valid
  }//scaleGlobalGroup

  // MOVE GLOBAL GROUP.
  function moveGlobalGroup( x_, y_ ) {
    if ( stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
      var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );
      if ( groupGlobal_ ) {
        var xNew_ = x_ * g_scaleMain;
        var yNew_ = y_ * g_scaleMain;
        groupGlobal_.setX( xNew_ ); groupGlobal_.setY( yNew_ );
      }//groupGlobal_ valid
    }//x_ y_ valid
  }//moveGlobalGroup

  // MOVE GLOBAL GROUP ANIMATED.
  function moveGlobalGroupAnimated( x_, y_ ) {
    if ( stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
      var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );
      if ( groupGlobal_ ) {
        // Set final x/y.
        var xNew_ = x_ * g_scaleMain;
        var yNew_ = y_ * g_scaleMain;

	      // Create and play tween.
	      var tween = new Kinetic.Tween({
	        node: groupGlobal_,
	        duration: 0.8,
	        easing: Kinetic.Easings.EaseInOut,
	        x: xNew_,
	        y: yNew_
	      });
	      tween.play();
      }//groupGlobal_ valid
    }//x_ y_ valid
  }//moveGlobalGroupAnimated

  // RESET STAGE.
  function resetStage( x_, y_ ) {
    if ( stc_isNumber( x_ ) && stc_isNumber( y_ ) ) {
      g_stageMain.setX( x_ );
      g_stageMain.setY( y_ );
      g_stageMini.setX( x_ );
      g_stageMini.setY( y_ );
    }//params valid
  }//resetStage

  // ============================================================================
  // QUERY LIST.
  // ============================================================================

  // SETUP QUERY REQUEST.
  function setupQueryRequest() {
    // Init stage. Includes timer tracking stop.
    initStage();

    // Clear out master array.
    g_arrayQuery = new Array();

    // Null var for currently-selected object.
    g_querySelected = null;
  }//setupQueryRequest

  // GET QUERY LIST.
  function getQueryList( id_, filterType_ ) {
    if ( stc_isDefined( id_ ) && stc_isDefined( filterType_ ) && g_arrayQuery ) {
      // Store request type.
      g_queryRequestType = filterType_;

      // Set up ID for request.
      var requestID_ = stc_extractIDStr( id_, s_strTree );

      // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.statsQuery_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName', value: s_action.statsQuerySummary_ } );
	    arrayParams_.push( { param: 'sortBy',    value: s_svcVals.sortByTotalTime_ } );
	    arrayParams_.push( { param: 'queryType', value: filterType_ } );
	    arrayParams_.push( { param: 'tableName', value: requestID_ } );
	    arrayParams_.push( { param: 'rowOffset', value: 0 } );
	    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.statsQuery_, arrayParams_, returnQueryList, testQueryResult_, $( "#_tooltip" ), null );
    }//id_ sortOrder_ g_arrayQuery valid
  }//getQueryList

  // RETURN QUERY LIST.
  function returnQueryList( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var sortBy_    = "";
		    var queryList_ = null;

	      // Set test data.
	      if ( parent.i_isTestMode ) {
		      switch( g_queryRequestType ) {
		        case s_queryType.all_   : data_ = testQueryResult_;       break;
		        case s_queryType.select_: data_ = testQueryResultSelect_; break;
		        case s_queryType.insert_: data_ = testQueryResultInsert_; break;
		        case s_queryType.update_: data_ = testQueryResultUpdate_; break;
		        case s_queryType.delete_: data_ = testQueryResultDelete_; break;
		        case s_queryType.other_ : data_ = testQueryResultOther_;  break;
		        default: break;
		      }//switch g_queryRequestType
	      }//test mode

	      // Get result vals.
	      if ( stc_isDefined( data_.sortBy ) )    { sortBy_    = data_.sortBy; }
	      if ( stc_isDefined( data_.queryList ) ) { queryList_ = data_.queryList; }

	      // Handle result.
	      if ( stc_isDefined( queryList_ ) ) {
	        if ( sortBy_ == s_svcVals.sortByTotalTime_ ) {
	          // Create query array.
	          createQueryArray( queryList_ );

	          // Create and show query list.
					  if ( g_tableSelected ) {
					    createQueryList( g_tableSelected.getId() );
					    showQueryList( g_tableSelected.getId() );
					  }//g_tableSelected valid
	        }//success queryName_ sortBy_ valid
	      }//param valid
	    }//status is success
    }//data_ status_ valid
  }//returnQueryList

  // CREATE QUERY ARRAY.
  function createQueryArray( arrayQueries_ ) {
    if ( g_arrayQuery && arrayQueries_ ) {
      if ( arrayQueries_.length > 0 ) {
        // Create query array.
        var length_ = arrayQueries_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Create object.
          var obj_ = stc_createQueryObject( arrayQueries_[i] );

          // Add object to query array.
          if ( stc_isDefined( obj_ ) ) {
            g_arrayQuery.push( obj_ );
          }//obj_ valid
        }//for each entry
      }//arrayQueries_ not empty
    }//g_arrayQuery arrayQueries_ valid
  }//createQueryArray

  // ============================================================================
  // QUERIES.
  // ============================================================================

  // CREATE QUERY LIST.
  function createQueryList( mainID_ ) {
    // Set error flag.
    var error_ = true;

    if ( stc_isDefined( mainID_ ) && g_arrayQuery ) {
      // Get selected table, get its x/y, then create query list.
      var tableMain_ = stc_getElement( mainID_, g_stageMain );
      if ( tableMain_ ) {
        // Get x/y to use for query list.
        var x_ = 0;
        var y_ = 0;
        var mainX_ = getMasterProperty( "g_arrayMain", mainID_, "x_" );
        var mainY_ = getMasterProperty( "g_arrayMain", mainID_, "y_" );
        if ( stc_isNumber( mainX_ ) && stc_isNumber( mainY_ ) ) {
          x_ = mainX_ + g_vals.wTable_ + 10;
          y_ = mainY_ + 10;
        }//x_ y_ valid

	      // Create query group.
	      var groupQueryID_ = stc_getIdentifier( mainID_, s_strQueryGroup );
	      var groupQuery_ = new Kinetic.Group({
	        id: groupQueryID_, x: x_, y: y_, visible: false
	      });

	      // If query group valid, continue defining group.
	      if ( groupQuery_ ) {
	        // Create each query in array.
	        if ( g_arrayQuery.length > 0 ) {
		        var length_ = g_arrayQuery.length;
		        for ( var i = 0; i < length_; i++ ) {
		          if ( stc_isDefined( g_arrayQuery[i].queryId ) &&
		               stc_isDefined( g_arrayQuery[i].queryType ) &&
		               stc_isDefined( g_arrayQuery[i].queryText ) &&
		               stc_isDefined( g_arrayQuery[i].avgTime ) &&
		               stc_isDefined( g_arrayQuery[i].totalTimePercent ) &&
		               stc_isDefined( g_arrayQuery[i].totalTime ) &&
		               stc_isDefined( g_arrayQuery[i].frequency ) &&
		               stc_isDefined( g_arrayQuery[i].heat ) ) {

		            // Get vars for creating query.
		            var queryID_ = g_arrayQuery[i].queryId;
		            var heat_    = g_arrayQuery[i].heat;
		            var text_    = g_arrayQuery[i].queryText;

		            // Create group that represents individual query.
		            // Name is set to index from master queries array,
		            // and will be used to access properties in array.
		            var query_ = new Kinetic.Group({
		              id: stc_getIdentifier( mainID_, s_strQuery + queryID_ ), name: i,
		              x: 0, y: 0, visible: false
		            });
		            if ( query_ ) {
		              // Create query rectangle.
		              var rect_ = new Kinetic.Rect({
		                id: stc_getIdentifier( mainID_, s_strQueryRect + queryID_ ), x: 0, y: 0,
		                height: g_queryVals.hQuerySingle_, width: g_queryVals.wQuerySingle_,
		                fill: s_color.tan_, opacity: 1,
		                shadowColor: s_gray6, shadowBlur: 1, shadowOffsetX: -1, shadowOffsetY: 1, shadowOpacity: 1
		              });
		              if ( rect_ ) {
		                // Add to group.
		                query_.add( rect_ );

		                // Add event handlers.
		                handleDownQuery( rect_ );
		              }//rect_ valid

		              // Normalize text to exact number of characters.
		              // Insert ellipsis at end to indicate there is more.
		              var textNormalized_ = stc_normalizeText( text_, g_charLimit.query_ );
		              textNormalized_     = stc_addEllipsis( text_, textNormalized_, g_charLimit.query_ );

		              // Create query text.
		              var textQuery_ = new Kinetic.Text({
		                id: stc_getIdentifier( mainID_, s_strQueryText + queryID_ ), x: 7, y: 10,
		                fontSize: "10", fontFamily: s_fontFamilyFixed, fontStyle: "bold",
		                align: "center", fill: s_black,
		                text: textNormalized_
		              });
		              if ( textQuery_ ) {
		                // Add to group.
		                query_.add( textQuery_ );

		                // Add event handlers.
		                handleDownQueryText( textQuery_ );
		                handleMouseOverQuery( textQuery_ );
		                handleMouseOutQuery( textQuery_ );
		              }//textQuery_ valid

				          // Set thermometer vals.
				          // Use static vars for main dimensions (height, width, corner radius, and bulb radius).
				          // To create smaller or larger thermometer, multiply static vars by same ratio.
				          // Height can be set to a somewhat lower ratio but is best if it is same.
				          // Check height with heat set to max to see what works.
		              var thermometerID_           = stc_getIdentifier( mainID_, s_strQueryThermometer + queryID_ );
		              var ratioThermometer_        = 0.4;
		              var hThermometer_            = s_thermometerVals.height_ * 0.3;
		              var wThermometer_            = s_thermometerVals.width_ * ratioThermometer_;
		              var xThermometer_            = g_queryVals.wQuerySingle_ - 20;
		              var yThermometer_            = 4;
		              var cornerRadiusThermometer_ = s_thermometerVals.cornerRadius_ * ratioThermometer_;
		              var bulbRadiusThermometer_   = s_thermometerVals.bulbRadius_ * ratioThermometer_;
		              var addTicks_                = false;

		              // Create thermometer (add to group inside called function).
		              if ( stc_isDefined( thermometerID_ ) &&
		                   stc_isNumber( xThermometer_ ) && stc_isNumber( yThermometer_ ) &&
		                   stc_isNumber( hThermometer_ ) && stc_isNumber( wThermometer_ ) &&
		                   stc_isNumber( cornerRadiusThermometer_ ) && stc_isNumber( bulbRadiusThermometer_ ) ) {

		                th_createThermometer( query_, thermometerID_, heat_,
		                                   xThermometer_, yThermometer_, hThermometer_, wThermometer_,
		                                   cornerRadiusThermometer_, bulbRadiusThermometer_, addTicks_ );
		              }//parameters valid

		              // Add individual group to main group.
		              groupQuery_.add( query_ );
		            }//query_ valid
		          }//parameters valid
		        }//for each element in array

				    // Set error to false.
				    error_ = false;
	        }//g_arrayQuery not empty

	        // Add group to layer.
	        g_layerQuery.add( groupQuery_ );
	      }//groupQuery_ valid
      }//tableMain_ valid
    }//mainID_ g_arrayQuery valid

    // Handle if no data.
    if ( error_ ) {
      parent.populateLog( g_uiStr.erNoMoreQueries_, s_svcVals.info_ );
    }//error_ true
  }//createQueryList

  // SHOW QUERY LIST.
  function showQueryList( mainID_ ) {
    // Get selected table, then show query list.
    if ( stc_isDefined( mainID_ ) && g_arrayQuery && $( "#_listQuery" ) ) {
	    var tableMain_ = stc_getElement( mainID_, g_stageMain );
	    if ( tableMain_ ) {
        // Get query group.
	      var groupQueryID_ = stc_getIdentifier( mainID_, s_strQueryGroup );
	      var groupQuery_   = stc_getElement( groupQueryID_, g_stageQuery );
        if ( groupQuery_ ) {
          // Position and show query group.
          // Don't re-position if dialog has already been positioned.
          var x_ = Math.floor( window.innerWidth/2 ) - g_vals.margin_;
          var y_ = Math.floor( window.innerHeight/2 ) - g_vals.margin_;
          if ( $( "#_listQuery" ).position().top == 0 && $( "#_listQuery" ).position().left == 0 ) {
 	          $( "#_listQuery" ).css( "top", y_ );
	          $( "#_listQuery" ).css( "left", x_ );
          }//never positioned
          $( "#_listQuery" ).css( "visibility", "visible" );
          groupQuery_.setX( 0 ); groupQuery_.setY( 0 );
          groupQuery_.show();

          // Show queries in scrolling list.
          // Returns offset (based on number of queries) used to set stage height.
          var yOff_ = showQueries( mainID_ );

          // Set stage height.
          g_stageQuery.setHeight( yOff_ );

          // Apply jscrollpane to inner div.
          $( "#_canvasQuery" ).jScrollPane();

          // Draw layer.
          g_layerQuery.draw();
        }//groupQuery_ valid
	    }//tableMain_ valid
    }//mainID_ g_arrayQuery _listQuery valid
  }//showQueryList

  // SHOW QUERIES.
  function showQueries( mainID_ ) {
    // Create y offset param.
    var yOff_ = 0;

    // Show queries in scrolling list.
    if ( stc_isDefined( mainID_ ) && stc_isDefined( g_arrayQuery ) ) {
      var length_ = g_arrayQuery.length;
      for ( var i = 0; i < length_; i++ ) {
        var qID_ = stc_getIdentifier( mainID_, s_strQuery + g_arrayQuery[i].queryId );
        var q_   = stc_getElement( qID_, g_stageQuery );
        if ( q_ ) {
          q_.setY( yOff_ ); q_.setX( 0 );
          q_.show();
          g_layerQuery.draw();
          yOff_ = yOff_ + g_queryVals.hQuerySingle_ + 5;
        }//q_ valid
      }//for each entry in array
    }//parameters valid

    // Return y offset.
    return yOff_;
  }//showQueries

  // CLEAR QUERY LIST.
  function clearQueryList() {
    // Destroy all stage contents.
    if ( g_arrayMain ) {
      var length_ = g_arrayMain.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayMain[i] ) ) {
          if ( stc_isDefined( g_arrayMain[i].id ) ) {
            var groupQueryID_ = stc_getIdentifier( g_arrayMain[i].id, s_strQueryGroup );
            var groupQuery_   = stc_getElement( groupQueryID_, g_stageQuery );
            if ( groupQuery_ ) {
              groupQuery_.destroy();
            }//tableMain_ valid
          }//id_ valid
        }//entry valid
      }//for each entry
    }//g_arrayMain valid
  }//clearQueryList

  // CLOSE QUERY LIST.
  function closeQueryList() {
    $( "#_listQuery" ).css( "visibility", "hidden" );
  }//closeQueryList

  // HANDLE DOWN QUERY.
  function handleDownQuery( rect_ ) {
    rect_.on( "mousedown", function( event ) {
      if ( rect_ ) {
        downQuery( rect_, event );
      }//rect_ valid
    });
  }//handleDownQuery

  // HANDLE DOWN QUERY TEXT.
  function handleDownQueryText( text_ ) {
    text_.on( "mousedown", function( event ) {
      if ( stc_isDefined( text_ ) ) {
        // Get query rectangle, then handle event.
        var mainID_ = stc_extractIDStr( text_.getId(), s_strQueryText );
        if ( stc_isDefined( mainID_ ) ) {
          var queryID_ = stc_extractSubIDStr( text_.getId(), s_strQueryText );
          var rectID_  = stc_getIdentifier( mainID_, s_strQueryRect + queryID_ );
          var rect_    = stc_getElement( rectID_, g_stageQuery );
          if ( rect_ ) {
            downQuery( rect_, event );
          }//rect_ valid
        }//mainID_ valid
      }//text_ valid
    });
  }//handleDownQueryText

  // DOWN QUERY.
  function downQuery( rect_, event ) {
    if ( rect_ ) {
      // Cancel bubble.
      event.cancelBubble = true;

      // Clear query edit dialog.
      stc_clearQueryEdit();

      // Draw layer.
      g_layerMain.draw();

      // Get selected query. If valid, show query edit dialog.
      var mainID_  = stc_extractIDStr( rect_.getId(), s_strQueryRect );
      var queryID_ = stc_extractSubIDStr( rect_.getId(), s_strQueryRect );
      if ( stc_isDefined( mainID_ ) && stc_isDefined( queryID_ ) ) {
        var queryComboID_ = stc_getIdentifier( mainID_, s_strQuery + queryID_ );
        var query_        = stc_getElement( queryComboID_, g_stageQuery );
        if ( query_ ) {
          // 	Store selected query.
          g_querySelected = query_;

          // Show query edit dialog.
          openQueryEdit( queryID_ );

          // If chart is showing, populate with chart for query.
          var isChartVisible_ = $( "#_chartContainerMain" ).css( "visibility" );
          if ( isChartVisible_ == "visible" ) {
            getQueryStats();
          }//chart visible
        }//query_ valid
      }//mainID_ queryComboID_ valid
    }//rect_ valid
  }//downQuery

  // OPEN QUERY EDIT.
  function openQueryEdit( queryID_ ) {
    if ( g_arrayQuery && stc_isDefined( queryID_ ) ) {
      // Clear query edit dialog.
      stc_clearQueryEdit();

      // Get query index.
      var queryIndex_ = stc_getQueryIndex( g_arrayQuery, queryID_ );

      // Show query edit dialog.
      if ( stc_isDefined( queryIndex_ ) ) {
        // Set text.
        var text_ = g_uiStr.erNoQueryText_;
        if ( stc_isDefined( g_arrayQuery[queryIndex_].queryText ) ) {
          text_ = g_arrayQuery[queryIndex_].queryText;
        }//text_ valid

        // Set position and move query edit dialog.
        var x_ = Math.floor( window.innerWidth/2 ) + 40;
        var y_ = Math.floor( window.innerHeight/2 ) + 40;
        stc_moveQueryEdit( x_, y_ );

        // Show query edit dialog.
        stc_showQueryEdit( text_ );
      }//queryIndex_ valid
    }//parameters valid
  }//openQueryEdit

  // HANDLE MOUSE OVER QUERY.
  function handleMouseOverQuery( text_ ) {
    text_.on( "mouseover", function( event ) {
      if ( text_ ) {
        // Perform mouseover effect.
        text_.setFill( s_white );
        g_layerQuery.draw();

	      // Setup vars for tooltip text.
	      var textTooltip_      = "";
	      var avgTime_          = "";
	      var totalTimePercent_ = "";
	      var frequency_        = "";

	      // Get query index, then lookup values for building tooltip text.
	      var queryID_    = stc_extractSubIDStr( text_.getId(), s_strQueryText );
	      var queryIndex_ = stc_getQueryIndex( g_arrayQuery, queryID_ );
	      if ( stc_isDefined( queryIndex_ ) ) {
	        if ( stc_isNumber( g_arrayQuery[queryIndex_].avgTime ) )          { avgTime_          = stc_addCommas( g_arrayQuery[queryIndex_].avgTime ); }
	        if ( stc_isNumber( g_arrayQuery[queryIndex_].totalTimePercent ) ) { totalTimePercent_ = g_arrayQuery[queryIndex_].totalTimePercent; }
	        if ( stc_isNumber( g_arrayQuery[queryIndex_].frequency ) )        { frequency_        = stc_addCommas( g_arrayQuery[queryIndex_].frequency ); }
	      }//queryIndex_ valid

	      // Build text.
	      textTooltip_ = "Average query time: " + avgTime_ + " ms" +
	                     "<br>% of total: " + totalTimePercent_ +
	                     "<br>Frequency: " + frequency_ + "/sec" +
	                     "<br><br>Click to view/edit full query.";

        // Position and show tooltip.
        if ( $( "#_listQuery" ) ) {
          var x_ = $( "#_listQuery" ).position().left;
          var y_ = $( "#_listQuery" ).position().top - 100;
          stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
          stc_showTooltip( $( "#_tooltip" ), textTooltip_, 80, 200, true );
        }//_listQuery valid
      }//text_ valid
    });
  }//handleMouseOverQuery

  // HANDLE MOUSE OVER QUERY.
  function handleMouseOutQuery( text_ ) {
    text_.on( "mouseout", function( event ) {
      if ( text_ ) {
        text_.setFill( s_black );
        g_layerQuery.draw();

        // Hide tooltip.
        mouseOutTooltipLocal( event );
      }//text_ valid
    });
  }//handleMouseOutQuery

	// ============================================================================
	// STAT LIST.
	// ============================================================================

  // GET QUERY STATS.
  function getQueryStats() {
	  // For selected table, get stats for selected query.
	  if ( g_querySelected ) {
		  // Get query ID for selected query.
		  var queryComboID_ = g_querySelected.getId();
		  var queryID_      = stc_extractSubIDStr( queryComboID_, s_strQuery );

		  // Get stats.
		  if ( stc_isDefined( queryID_ ) ) {
        startStatList( queryID_, s_statType.query_ ) ;
		  }//queryID_ valid
	  }//g_querySelected valid
  }//getQueryStats

  // GET QUERY STATS ALL.
  function getQueryStatsAll() {
	  // For selected table, get stats for all queries matching selected query.
	  if ( g_querySelected ) {
		  // Get query ID for selected query.
		  var queryComboID_ = g_querySelected.getId();
		  var queryID_      = stc_extractSubIDStr( queryComboID_, s_strQuery );

      // Set request type, then start stat list.
      if ( stc_isDefined( queryID_ )  ) {
	      // Get query index, then get query type.
	      var type_       = s_queryType.all_;
	      var queryIndex_ = stc_getQueryIndex( g_arrayQuery, queryID_ );
	      if ( stc_isDefined( queryIndex_ ) ) {
	        if ( stc_isDefined( g_arrayQuery[queryIndex_].queryType ) ) {
	          type_ = g_arrayQuery[queryIndex_].queryType;
	        }//type_ valid
	      }//index_ valid

	      // Set request type from query type.
	      var requestType_ = s_statType.query_;
	      switch( type_ ) {
	        case s_queryType.all_   : requestType_ = s_statType.query_; break;
	        case s_queryType.select_: requestType_ = s_statType.queryAllSelect_; break;
	        case s_queryType.insert_: requestType_ = s_statType.queryAllInsert_; break;
	        case s_queryType.update_: requestType_ = s_statType.queryAllUpdate_; break;
	        case s_queryType.delete_: requestType_ = s_statType.queryAllDelete_; break;
	        case s_queryType.other_ : requestType_ = s_statType.queryAllOther_; break;
	        default: break;
	      }//switch type_

			  // Get stats.
			  if ( stc_isDefined( requestType_ ) ) {
	        startStatList( queryID_, requestType_ );
			  }//requestType_ valid
      }//queryID_ valid
	  }//g_querySelected valid
  }//getQueryStatsAll

  // START STAT LIST.
  function startStatList( id_, type_ ) {
    if ( stc_isDefined( id_ ) && stc_isDefined( type_ ) ) {
		  // Init chart. Includes timer tracking stop.
		  initChart();

	    // Hide tooltip.
	    stc_hideTooltip( $( "#_tooltip" ) );

	    // Store ID and type.
	    g_statsID         = id_;
	    g_statRequestType = type_;

	    // Start timer tracking that sends request for stat list every n seconds.
	    parent.i_getStatListDB = true;

	    // Send first service request.
	    getStatList();
    }//parameters valid
  }//startStatList

  // GET STAT LIST.
  function getStatList() {
    if ( stc_isDefined( g_statsID ) && stc_isDefined( g_statRequestType ) ) {
	    // TEST Set get stat DB flag.
	    if ( parent.i_isTestMode ) {
			  parent.i_getStatListDB = true;
	    }//is parent.i_isTestMode

      // Set up ID for request.
      var requestID_ = g_statsID;
      if ( g_statRequestType == s_statType.table_ ) {
        requestID_ = stc_extractIDStr( g_statsID, s_strTree );
      }//type is table

	    // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.statsStats_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName',   value: s_action.statsStats_ } );
	    arrayParams_.push( { param: 'statType',    value: g_statRequestType } );
	    arrayParams_.push( { param: 'statsTypeId', value: requestID_ } );
	    arrayParams_.push( { param: 'rowLimit',    value: g_svcVals.nbrStatsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.statsStats_, arrayParams_, returnStatList, testStatsResult_, $( "#_tooltip" ), returnStatListError );
    }//g_statsID g_statRequestType valid
  }//getStatList

  // RETURN STAT LIST ERROR.
  function returnStatListError() {
    // Init charts. Includes timer tracking stop.
    initCharts();
  }//returnStatListError

  // RETURN STAT LIST.
  function returnStatList( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var statValues_  = null;
		    var statInterval_ = "";
		    var countSuccess_ = null;

	      // Get result vals.
	      if ( stc_isDefined( data_.statValues ) )         { statValues_   = data_.statValues[0]; }
		    if ( stc_isDefined( statValues_.statInterval ) ) { statInterval_ = statValues_.statInterval; }
		    if ( stc_isDefined( statValues_.countSuccess ) ) { countSuccess_ = statValues_.countSuccess; }

	      // Handle result.
	      if ( statInterval_ == s_svcVals.seconds15_ &&
	           stc_isDefined( countSuccess_ )  ) {

          // Create stat array.
          createStatArray( countSuccess_ );

          // Set chart stats and show.
          makeChart();
	      }//statInterval_ countSuccess_ valid
	    }//status is success
    }//data_ status_ valid
  }//returnStatList

  // CREATE STAT ARRAY.
  function createStatArray( arrayStat_ ) {
    if ( g_arrayStat && arrayStat_ ) {
      // Array comes back with more recent values at end.
      // Reverse so most recent are at beginning.
      arrayStat_.reverse();

      // Transfer contents to global array.
      g_arrayStat = new Array();
      var length_  = arrayStat_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isNumber( arrayStat_[i] ) ) {
          g_arrayStat.push( arrayStat_[i] );
        }//entry valid
      }//for each entry
    }//g_arrayStat arrayStat_ valid
  }//createStatArray

  // ============================================================================
  // CHART.
  // ============================================================================

  // INIT CHART.
  // Stop timer tracking and clear chart.
  function initChart() {
    // Stop timer tracking.
    parent.i_getStatListDB = false;

    // Stop timer for animated chart line.
    chrt_stopChartTimer();

    // Clear chart.
    clearLocalChart();
  }//initChart

  // CLEAR LOCAL CHART.
  function clearLocalChart() {
    var chartLineID_         = stc_getIdentifier( "", s_strChartLine );
    var chartLineAnimatedID_ = chartLineID_ + s_strAnimated;
    var arrayChartLine_      = new Array();
    arrayChartLine_          = [ chartLineID_, chartLineAnimatedID_ ];
    var vLabelsID_           = stc_getIdentifier( "", s_strChartVLabels );
    chrt_clearChart( g_stageChart, g_layerChart, arrayChartLine_, "", vLabelsID_, "", $( "#_titleChart" ) );
  }//clearLocalChart

  // CLOSE CHART.
  function closeChart() {
    initChart();
    chrt_hideChart( $( "#_chartContainerMain" ), $( "#_chartContainer" ), $( "#_titleChart" ), $( "#_iconsChart" ) );
    $( "#_iconChartAll" ).css( "visibility", "hidden" );
  }//closeChart

  // MAKE CHART.
  function makeChart() {
    // Clear chart.
    clearLocalChart();

    // Get chart container height and width - needed for calculations in setting up chart.
    var h_ = $( "#_chartContainer" ).height();
    var w_ = $( "#_chartContainer" ).width();

    // Process stats and use to create vertical labels and chart line.
    if ( stc_isDefined( g_arrayStat ) && stc_isDefined( g_chart ) && stc_isNumber( h_ ) && stc_isNumber( w_ ) ) {
	    // Handle empty stats.
	    var empty_ = false;
	    if ( g_arrayStat.length < 1 ) {
	      empty_ = true;
	      g_arrayStat = [0,0,0,0,0,0,0,0,0,0];
	    }//empty

      // Set chart line/labels vars.
      var fontSize_     = "10";
      var colorStroke_ = s_white;
      var colorText_   = s_white;
      var hOffset_     = 40;
      var wOffset_     = 50;
      var useBottom_   = true;
      var vLabelsID_   = stc_getIdentifier( "", s_strChartVLabels );
      var xForVLabels_ = 15;
      var showPoints_  = false;
      var radiusPoint_ = 7;

      // Create new date/time.
      var newDate_ = new Date();

	    // Set horizontal labels.
	    chrt_updateHorizontalLabels( g_stageChart, stc_getIdentifier( "", s_strChartHLabels ),
	                                 s_svcVals.incrementTime_, s_svcVals.sec15_, newDate_ );

      // Create vertical labels.
	    chrt_createVerticalLabels( g_stageChart, g_chart, vLabelsID_, h_, w_,
	                               fontSize_, colorText_,
	                               g_chartVals.nbrYSlots_,
	                               g_arrayStat, null, xForVLabels_, hOffset_, useBottom_ );

      // Draw chart line and points.
      chrt_createChartLine( g_stageChart, g_chart, stc_getIdentifier( "", s_strChartLine ),
                            g_arrayStat, null, h_, w_, colorStroke_,
                            g_chartVals.nbrSlots_, hOffset_, wOffset_,
                            showPoints_, radiusPoint_, mouseoverShapeInChart, mouseOutTooltipLocal, true, g_layerChart );

      // Draw layer.
      g_layerChart.draw();

      // Hide/show chart all icon.
      $( "#_iconChartAll" ).css( "visibility", "hidden" );
      if ( g_statRequestType == s_statType.query_ ) {
        $( "#_iconChartAll" ).css( "visibility", "visible" );
      }//g_statRequestType is s_statType.query_

      // Get title and fill.
      var text_           = s_message.notFound_;
      var textNormalized_ = "";
      var title_          = s_message.notFound_;
      var fill_           = s_color.tan_;
      switch( g_statRequestType ) {

        case s_statType.all_:
          title_ = g_uiStr.titleListAll_;
          fill_  = s_color.greenDark_;
        break;

        case s_statType.table_:
          // Get title.
          text_ = getMasterProperty( "g_arrayMain", g_statsID, "text_" );
          if ( stc_isDefined( text_ ) ) {
            textNormalized_ = stc_normalizeText( text_, g_charLimit.chart_ );
            title_          = stc_addEllipsis( text_, textNormalized_, g_charLimit.chart_ );
          }//text_ valid

          // Get fill.
          type_ = getMasterProperty( "g_arrayMain", g_statsID, "type_" );
          if ( stc_isDefined( type_ ) ) {
            fill_ = stc_getTypeFill( type_ );
            if ( fill_ == s_white ) { fill_ = s_color.blueDark_; }
          }//type_ valid
        break;

        case s_statType.query_:
          if ( g_arrayQuery ) {
            var queryIndex_ = stc_getQueryIndex( g_arrayQuery, g_statsID );
            if ( stc_isDefined( queryIndex_ ) ) {
              text_ = g_arrayQuery[queryIndex_].queryText;
              if ( stc_isDefined( text_ ) ) {
                textNormalized_ = stc_normalizeText( text_, g_charLimit.chart_ );
                title_          = stc_addEllipsis( text_, textNormalized_, g_charLimit.chart_ );
                fill_           = s_color.brown_;
              }//text_ valid
            }//queryIndex_ valid
          }//g_arrayQuery valid
        break;

        case s_statType.queryAllSelect_: title_ = g_uiStr.titleListSelect_; fill_ = s_color.blueDark_; break;
        case s_statType.queryAllInsert_: title_ = g_uiStr.titleListInsert_; fill_ = s_color.blueDark_; break;
        case s_statType.queryAllUpdate_: title_ = g_uiStr.titleListUpdate_; fill_ = s_color.blueDark_; break;
        case s_statType.queryAllDelete_: title_ = g_uiStr.titleListDelete_; fill_ = s_color.blueDark_; break;
        case s_statType.queryAllOther_ : title_ = g_uiStr.titleListOther_;  fill_ = s_color.blueDark_; break;

        default: break;

      }//switch g_statRequestType

      // Set title.
      if ( empty_ ) {
        title_ = title_ + " " + s_message.notAvailable_;
      } else {
        title_ = title_ + " " + g_uiStr.tipFrequency_;
      }//empty_ true
      $( "#_titleChart" ).html( title_ );

      // Set chart fill.
      chrt_setChartFill( $( "#_chartContainerMain" ), fill_ );

      // Show chart.
      chrt_showChart( $( "#_chartContainerMain" ), $( "#_chartContainer" ), $( "#_titleChart" ), $( "#_iconsChart" ) );

      // If chart is for table, update chart inside table as well.
      if ( g_statRequestType ) {
        updateTableChart();
      }//g_statRequestType is s_statType.table_
    }//g_arrayStat g_chart h_ w_ valid
  }//makeChart

  // UPDATE TABLE CHART.
  function updateTableChart() {
    if ( g_arrayStat && stc_isDefined( g_statsID ) ) {
      if ( g_arrayStat.length > 0 ) {
        // Update and show chart.
        var chart_ = stc_getElement( stc_getIdentifier( g_statsID, s_strTableChart ), g_stageMain );
        if ( chart_ ) {
          // Set chart line vars.
          var hChart_        = 100;
          var wChart_        = 115;
		      var colorStroke_   = s_gray6;
          var nbrChartSlots_ = 10;
          var hOffset_       = 5;
          var wOffset_       = 5;
          var showPoints_    = false;
          var radiusPoint_   = 7;

		      // Draw chart line and points.
          chrt_createChartLine( g_stageMain, chart_, stc_getIdentifier( g_statsID, s_strTableStat ),
                                g_arrayStat, null, hChart_, wChart_, colorStroke_,
                                nbrChartSlots_, hOffset_, wOffset_,
                                showPoints_, radiusPoint_, mouseoverShape, mouseOutTooltipLocal, false, null );

          // Show chart.
          chrt_showMiniChart( stc_getIdentifier( g_statsID, s_strTableChart ), g_stageMain, g_layerMain );
        }//chart_ valid
      }//g_arrayStat not empty
    }//g_arrayStat g_statsID valid
  }//updateTableChart

  // MOUSEOVER SHAPE IN CHART.
  function mouseoverShapeInChart( event ) {
    if ( event.targetNode ) {
      var shape_ = event.targetNode;
      if ( shape_ && $( "#_chartContainerMain" ) && stc_isDefined( g_stageChart.getMousePosition() ) ) {
        var mousePos_ = g_stageChart.getMousePosition();
        var x_ = $( "#_chartContainerMain" ).position().left + mousePos_.x + g_vals.margin_;
        var y_ = $( "#_chartContainerMain" ).position().top + mousePos_.y + g_vals.margin_;
        stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
        stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 40, true );
      }//parameters valid
    }//targetNode valid
  }//mouseoverShapeInChart

  // BLINK CHART.
  function blinkChart() {
    if ( $( "#_iconChartTimer" ) ) {
      var opacity_ = $( "#_iconChartTimer" ).css( "opacity" );
      if ( opacity_ == 1.0 ) {
        $( "#_iconChartTimer" ).css( "opacity", "0.5" );
      } else {
        $( "#_iconChartTimer" ).css( "opacity", "1.0" );
      }//opacity_ not 1.0
    }//_iconChartTimer valid
  }//blinkChart

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
    var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );

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
	    var arrow_ = stc_getElement( stc_getComboID( sourceID_, targetID_ + s_strArrow ), g_stageMain );
	    if ( !arrow_ ) {
	      // Create new arrow.
	      arrow_ = sh_createDirectionArrow( stc_getComboID( sourceID_, targetID_ + s_strArrow ), g_line.colorDim_, g_line.colorDim_, g_line.opacity_ );
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

  // DIM ALL MAIN LINES.
  // Dim all lines that currently exist.
  function dimAllMainLines() {
    var length_ = g_arrayLine.length;
    for ( var i = 0; i < length_; i++ ) {
      if ( stc_isDefined( g_arrayLine[i].id ) && stc_isDefined( g_arrayLine[i].tables ) ) {
        if ( g_arrayLine[i].tables.length > 0 ) {
          dimChildrenLines( g_arrayLine[i].id, g_arrayLine[i].tables );
        }//length gt 0
      }//parentID_ tables_ valid
    }//for each parent in array
  }//dimAllMainLines

  // DIM CHILDREN LINES.
  function dimChildrenLines( parentID_, tables_  ) {
    if ( stc_isDefined( parentID_ ) && stc_isDefined( tables_ ) ) {
      var length_ = tables_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( tables_[i] ) && tables_[i] != "" ) {
          var line_ = stc_getElement( stc_getComboID( parentID_, tables_[i] ), g_stageMain );
          if ( line_ ) {
            line_.setOpacity( g_line.opacity_ );
            line_.setStroke( s_gray6 );
            line_.setStrokeWidth( g_line.strokeWidthDim_);
          }//line valid
          var arrow_ = stc_getElement( stc_getComboID( parentID_, tables_[i] + s_strArrow ), g_stageMain );
          if ( arrow_ ) {
            arrow_.setOpacity( g_line.opacity_ );
            arrow_.setFill( g_line.colorDim_ );
            arrow_.setStroke( g_line.colorDim_ );
          }//arrow_ valid
        }//entry valid
      }//for each child in array
    }//parentID_ tables_ valid
  }//dimChildrenLines

  // SET LINE OPACITY.
  // Brighten/dim lines for selected table.
  function setLineOpacity( mainID_, relatedID_, bright_ ) {
    if ( stc_isDefined( mainID_ ) && stc_isDefined( relatedID_ ) ) {
      var length_ = g_arrayLine.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( g_arrayLine[i].id ) && stc_isDefined( g_arrayLine[i].tables ) ) {
          if ( g_arrayLine[i].tables.length > 0 ) {
            setChildLineOpacity( mainID_, relatedID_, g_arrayLine[i].id, g_arrayLine[i].tables, bright_ );
          }//length gt 0
        }//parentID_ tables_ valid
      }//for each parent in array
    }//mainID_ relatedID_ valid
  }//setLineOpacity

  // SET CHILD LINE OPACITY.
  function setChildLineOpacity( mainID_, relatedID_, parentID_, tables_, bright_  ) {
    if ( stc_isDefined( mainID_ ) && stc_isDefined( relatedID_ ) && stc_isDefined( parentID_ ) && stc_isDefined( tables_ ) ) {
      var length_ = tables_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( tables_[i] ) && tables_[i] != "" ) {
          if ( ( parentID_ == relatedID_ ) || ( tables_[i] == relatedID_ ) ) {
            if ( ( parentID_ == mainID_ ) || ( tables_[i] == mainID_ ) ) {

	            var line_ = stc_getElement( stc_getComboID( parentID_, tables_[i] ), g_stageMain );
	            if ( line_ ) {
	              if ( bright_ ) {
		              line_.setOpacity( g_line.opacity_ );
		              line_.setStroke( g_line.colorSelected_ );
		              line_.setStrokeWidth( g_line.strokeWidthSelected_ );
	              } else {
			            line_.setOpacity( g_line.opacity_ );
			            line_.setStroke( s_gray6 );
			            line_.setStrokeWidth( g_line.strokeWidthDim_);
	              }//bright_ false
	            }//line valid

	            var arrow_ = stc_getElement( stc_getComboID( parentID_, tables_[i] + s_strArrow ), g_stageMain );
	            if ( arrow_ ) {
	              if ( bright_ ) {
		              arrow_.setOpacity( g_line.opacity_ );
		              arrow_.setFill( g_line.colorSelected_ );
		              arrow_.setStroke( g_line.colorSelected_ );
	              } else {
			            arrow_.setOpacity( g_line.opacity_ );
			            arrow_.setFill( g_line.colorDim_ );
			            arrow_.setStroke( g_line.colorDim_ );
	              }//bright_ false
	            }//arrow_ valid

            }//parentID_ is mainID_ or childID_ is mainID_
          }//parentID_ is relatedID_ or childID_ is relatedID_
        }//entry valid
      }//for each child in array
    }//parameters valid
  }//setChildLineOpacity

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
          var lineMain_ = stc_getElement( stc_getComboID( parentID_, tables_[i] ), g_stageMain );
          if ( lineMain_ ) {
            lineMain_.destroy();
          }//lineMain_ valid
          var arrow_ = stc_getElement( stc_getComboID( parentID_, tables_[i] + s_strArrow ), g_stageMain );
          if ( arrow_ ) {
            arrow_.destroy();
          }//arrow_ valid
        }//entry valid
      }//for each child in array
    }//parentID_ tables_ valid
  }//destroyChildrenLines

  // ============================================================================
  // SIZE/SCALE.
  // ============================================================================

  // RESIZE CONTENTS.
  // Fires at start of session and at end of any browser window resize.
  function resizeContents( _h, _w ) {
    if ( g_stageMain && g_layerMini && stc_isNumber( _h ) && stc_isNumber( _w ) ) {
      // Store and set new stage h/w.
      g_hStageMain = _h;
      g_wStageMain = _w;
      g_stageMain.setHeight( _h );
      g_stageMain.setWidth( _w );

      // Store and set new marquee h/w - same as stage.
      g_hMarquee = g_hStageMain;
      g_wMarquee = g_wStageMain;
      marquee_ = sizeMarquee( g_hMarquee, g_wMarquee );

      // Draw mini layer.
      g_layerMini.draw();
    }//parameters valid
  }//resizeContents()

  // SCALE CONTENTS.
  function scaleContents( iconName_ ) {
    // Get global group.
    var groupGlobal_ = stc_getElement( stc_getIdentifier( "", s_strGroupGlobal ), g_stageMain );

    // Get marquee.
    var marqueeID_ = stc_getIdentifier( "", s_strMarquee );
    marquee_       = stc_getElement( marqueeID_, g_stageMini );

    // Scale global group and marquee.
    if ( groupGlobal_ && marquee_ ) {
      // Scale according to icon clicked by user.
      var scaleMarquee_ = 1;
      switch( iconName_ ) {

          case "_iconZoomOut":
            if ( g_scaleMain > 0.5 ) {
              // Scale group.
              scaleGlobalGroup( getZoomScale( iconName_ ) );
              g_layerMain.draw();

              // Scale marquee.
              scaleMarquee_ = setReverseScale( g_scaleMain );
              sizeMarquee( g_hMarquee * scaleMarquee_, g_wMarquee * scaleMarquee_ );
              g_layerMini.draw();
            }//g_scaleMain gt 0.5
          break;

          case "_iconZoomIn":
            if ( g_scaleMain < 1.2 ) {
              // Scale group.
              scaleGlobalGroup( getZoomScale( iconName_ ) );
              g_layerMain.draw();

              // Scale marquee.
              scaleMarquee_ = setReverseScale( g_scaleMain );
              sizeMarquee( g_hMarquee * scaleMarquee_, g_wMarquee * scaleMarquee_ );
              g_layerMini.draw();
            }//g_scaleMain lt 1.2
          break;

          case "_iconZoomRestore":
            // Scale group.
              scaleGlobalGroup( 1 );
              g_layerMain.draw();

            // Scale marquee.
            scaleMarquee_ = 1;
            sizeMarquee( g_hMarquee * scaleMarquee_, g_wMarquee * scaleMarquee_ );
            g_layerMini.draw();
          break;

          default: break;
      }//switch iconName_

      // Enable/disable zoom icons.
      setZoomIcons();
    }//groupGlobal_ marquee_ valid
  }//scaleContents

  // TOGGLE SHOW ZOOM ICONS.
  function toggleShowZoomIcons( show_ ) {
    if ( show_ ) {
      setZoomIcons();
    } else {
	    $( "#_iconZoomOut" ).css( "visibility", "hidden" );
	    $( "#_iconZoomIn" ).css( "visibility", "hidden" );
	    $( "#_iconZoomRestore" ).css( "visibility", "hidden" );
    }//show_ false
  }//toggleShowZoomIcons

  // SET ZOOM ICONS.
  function setZoomIcons() {
    $( "#_iconZoomOut" ).css( "visibility", "visible" );
    $( "#_iconZoomIn" ).css( "visibility", "visible" );
    $( "#_iconZoomRestore" ).css( "visibility", "visible" );
    if ( g_scaleMain > 1.1 )  { $( "#_iconZoomIn" ).css( "visibility", "hidden" ); }
    if ( g_scaleMain < 0.6 )  { $( "#_iconZoomOut" ).css( "visibility", "hidden" ); }
    if ( g_scaleMain == 1.0 ) { $( "#_iconZoomRestore" ).css( "visibility", "hidden" ); }
  }//setZoomIcons

  // GET ZOOM SCALE.
  function getZoomScale( iconName_ ) {
    var zoomScale_ = 1;
    switch( iconName_ ) {
        case "_iconZoomOut":
          switch( g_scaleMain ) {
              case 0.6: zoomScale_ = 0.5; break;
              case 0.7: zoomScale_ = 0.6; break;
              case 0.8: zoomScale_ = 0.7; break;
              case 0.9: zoomScale_ = 0.8; break;
              case 1.0: zoomScale_ = 0.9; break;
              case 1.1: zoomScale_ = 1.0; break;
              case 1.2: zoomScale_ = 1.1; break;
              default: break;
          }//switch g_scaleMain
        break;

        case "_iconZoomIn":
          switch( g_scaleMain ) {
              case 0.5: zoomScale_ = 0.6; break;
              case 0.6: zoomScale_ = 0.7; break;
              case 0.7: zoomScale_ = 0.8; break;
              case 0.8: zoomScale_ = 0.9; break;
              case 0.9: zoomScale_ = 1.0; break;
              case 1.0: zoomScale_ = 1.1; break;
              case 1.1: zoomScale_ = 1.2; break;
              default: break;
          }//switch g_scaleMain
        break;

        default: break;
    }//switch iconName_
    return zoomScale_;
  }//getZoomScale

  // SET REVERSE SCALE.
  function setReverseScale( scale_ ) {
    var reverseScale_ = 1;
    switch( scale_ ) {
        case 0.5: reverseScale_ = 1.5; break;
        case 0.6: reverseScale_ = 1.4; break;
        case 0.7: reverseScale_ = 1.3; break;
        case 0.8: reverseScale_ = 1.2; break;
        case 0.9: reverseScale_ = 1.1; break;
        case 1.0: reverseScale_ = 1.0; break;
        case 1.1: reverseScale_ = 0.9; break;
        case 1.2: reverseScale_ = 0.8; break;
        default: break;
    }//switch scale_
    return reverseScale_;
  }//setReverseScale

  // ============================================================================
  // NAVIGATOR INFO.
  // ============================================================================

  // SHOW NAVIGATOR INFO.
  function showNavigatorInfo() {
    var text_ = g_uiStr.tipSelectTable_;
    if ( g_tableSelected ) {
      // Get ID for selected main table.
      mainID_ = g_tableSelected.getId();

      // Get tooltip text.
      var text_ = s_message.notFound_;
      if ( stc_isDefined( mainID_ ) ) {
        var mainText_ = getMasterProperty( "g_arrayMain", mainID_, "text_" );
        if ( stc_isDefined( mainText_ ) ) {
          text_ = g_uiStr.tipDetails_ + " " + mainText_;
        }//text_ valid
      }//mainID_ valid
    }//g_tableSelected valid

    // Show tooltip.
    if ( $( "#_miniContainer" ) ) {
      var x_ = ( $( "#_miniContainer" ).position().left + $( "#_miniContainer" ).width() ) + g_vals.margin_;
      var y_ = $( "#_miniContainer" ).position().top + 20;
      stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
      stc_showTooltip( $( "#_tooltip" ), text_, 20, 0, false );
    }//_miniContainer valid
  }//showNavigatorInfo
