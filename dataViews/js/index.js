
  // ============================================================================
  // INDEX.
  // Requires static.js.
  // Uses Kinetic components. Once Kinetic stage/layer are created, do not keep checking them for validity.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

    initApp();

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Page name.
  var i_parentPageName_      = s_message.index_;

  // Icons.
  var i_iconTopShow          = false;
  var i_iconModuleShow       = false;
  var i_iconViewShow         = false;
  var i_iconGlobalShow       = false;

  var i_iconM0Show           = false;

  var i_iconView_M0_V0Show   = false;
  var i_iconView_M0_V1Show   = false;
  var i_iconView_M0_V2Show   = false;

  var i_iconView_M1_V0Show   = false;
  var i_iconView_M1_V1Show   = false;
  var i_iconView_M1_V2Show   = false;

  var i_iconView_M2_V0Show   = false;
  var i_iconView_M2_V1Show   = false;
  var i_iconView_M2_V2Show   = false;
  var i_iconView_M2_V3Show   = false;

  // Module/view.
  var i_moduleCurrent = "";
  var i_viewCurrent   = "";
  var i_pageInitial   = "stats_listHeat.html";
  // "stats_listHeat.html" "stats_heatMap.html" "stats_schemaWheel.html"
  // "mgt_listAgent.html" "mgt_listClient.html" "mgt_listHost.html" "mgt_listProcess.html"

  var i_useModule0 = true;
  var i_useModule1 = false;
  var i_useModule2 = true;
  var i_useModule3 = false;

  var i_useModule0_0 = true;
  var i_useModule0_1 = true;
  var i_useModule0_2 = true;

  var i_useModule1_0 = true;
  var i_useModule1_1 = true;
  var i_useModule1_2 = true;

  var i_useModule2_0 = true;
  var i_useModule2_1 = true;
  var i_useModule2_2 = true;
  var i_useModule2_3 = true;

  // Domain.
  var i_domainName        = s_svcVals.domain_;
  var i_nbrPhysicalShards = 5; // TEST

  // Services.
  var i_arrayStatDB = new Array();

  // Services vals.
  var i_svcVals = {
    nbrStatsDBReq_: 10 };

  // Timer.
  var i_timerRunning  = false;
  var i_timer         = null;
  var i_timerCounter  = 0;
  var i_timerSpeed_   = 1000;

  // Timer flags.
  var i_refresh       = false;
  var i_getStatListDB = false;

  // Modes.
  var i_isTestMode = false;

  // Timeline.
  var i_useTimeline = true;

  // Heat indicator.
  var i_stageHeatIndicator = null;
  var i_layerHeatIndicator = null;
  var i_thermometerDB      = null;
  var i_chartDB            = null;
  var i_nbrTablesDB        = 0;
  var i_heatTotal          = 0;

  // Management module vals.
  var i_serverName = "";
  var i_freeMem    = "";
  var i_totalMem   = "";
  var i_usedMem    = "";
  var i_maxMem     = "";

  // Action vals.
  var i_actionVals = {
    showTree_        : "showTree",
    revertTree_      : "revertTree",
    restoreHierarchy_: "restoreHierarchy",
    returnToLastStep_: "returnToLastStep",
    goToNextStep_    : "goToNextStep" };

  // Text strings.
  var i_uiStr = {
    footer_          : "",
    tipHeatIndicator_: "The chart shows a summary of frequency<br>values.<br><br>The thermometer shows the activity<br>level for the currently-loaded tables.",
    erNotImplemented_: "Not available",
    erBrowser_       : "Please use Firefox for this application.",
    erAbort_         : "Cannot complete error procedure."
  };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // INIT APP.
  function initApp() {

    // DRAGGABLE.

    // Hairline for timeline.
    $( "#_hairline" ).draggable(
    {
    start: function( event, ui ) { tl_startDragTime( ui ); },
    drag:  function( event, ui ) { tl_dragTime( ui ); },
    stop:  function( event, ui ) { tl_endDragTime( ui); }
    },
    { axis: "x" }, { containment: "parent" }
    );

    // Help control.
    $( "#_containerHelp" ).draggable({ handle: "#_handleHelp" });

    // Log dialog control.
		$( "#_containerLog" ).draggable({ handle: "#_handleLog" });

    // EVENT HANDLERS.

    // Window resize.
    $( window ).bind           ( "resizestop", function( event ) { resizeContents(); });

    // Icon images.
    $( ".icon" ).on            ( "mouseover", function( event )  { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on            ( "mouseout", function( event )   { $( this ).css( "opacity", "1" ); });

    // Upper icons.
    $( "#_iconTop0" ).on       ( "click", function( event )      { showModuleIcons(); });
    $( "#_iconTop1" ).on       ( "click", function( event )      { showViewIcons(); });

    // Module icons.
    $( "#_iconM0" ).on         ( "click", function( event )      { stc_loadIframe( "_view", "stats_listHeat.html" ); });
    $( "#_iconM1" ).on         ( "click", function( event )      { stc_loadIframe( "_view", "alyz_recommendations.html" ); });
    $( "#_iconM2" ).on         ( "click", function( event )      { stc_loadIframe( "_view", "mgt_listAgent.html" ); });
    $( "#_iconM3" ).on         ( "click", function( event )      { loadModule( "", "" ); });

    // View icons: Stats.
    $( "#_iconView_M0_V0" ).on ( "click", function( event )      { stc_loadIframe( "_view", "stats_heatMap.html" ); });
    $( "#_iconView_M0_V1" ).on ( "click", function( event )      { stc_loadIframe( "_view", "stats_listHeat.html" ); });
    $( "#_iconView_M0_V2" ).on ( "click", function( event )      { stc_loadIframe( "_view", "stats_schemaWheel.html" ); });

    // View icons: Analyze.
    $( "#_iconView_M1_V0" ).on ( "click", function( event )      { stc_loadIframe( "_view", "alyz_recommendations.html" ); });
    $( "#_iconView_M1_V1" ).on ( "click", function( event )      { stc_loadIframe( "_view", "alyz_shardAnalysis.html" ); });
    $( "#_iconView_M1_V2" ).on ( "click", function( event )      { stc_loadIframe( "_view", "alyz_streamAnalysis.html" ); });

    // View icons: Manage.
    $( "#_iconView_M2_V0" ).on ( "click", function( event )      { stc_loadIframe( "_view", "mgt_listAgent.html" ); });
    $( "#_iconView_M2_V1" ).on ( "click", function( event )      { stc_loadIframe( "_view", "mgt_listClient.html" ); });
    $( "#_iconView_M2_V2" ).on ( "click", function( event )      { stc_loadIframe( "_view", "mgt_listHost.html" ); });
    $( "#_iconView_M2_V3" ).on ( "click", function( event )      { stc_loadIframe( "_view", "mgt_listProcess.html" ); });

    // Global icons.
    $( "#_iconGlobal0" ).on    ( "click", function( event )      { showHelpForModule(); });
    $( "#_iconGlobal1" ).on    ( "click", function( event )      { stc_showLogDialog( true ); });
    $( "#_iconGlobal1" ).on    ( "mouseover", function( event )  { stc_showLogDialog( false ); });
    $( "#_iconGlobal1" ).on    ( "mouseout", function( event )   { stc_hideLogDialog(); });

    // Module 0 (Stats) icons.
    $( "#_iconM0_0" ).on       ( "click", function( event )      { tl_runClock(); });
    $( "#_iconM0_1" ).on       ( "click", function( event )      { tl_stopClock(); });
    $( "#_iconM0_2" ).on       ( "click", function( event )      { tl_resetClock(); tl_runClock(); });
    $( "#_iconM0_3" ).on       ( "click", function( event )      { });
    $( "#_iconM0_4" ).on       ( "click", function( event )      { });

    // Module 0 View 0 (Stats/Heat Map) icons.
    $( "#_iconM0_V0_0" ).on    ( "click", function( event )      { runInView( i_actionVals.showTree_ ); });
    $( "#_iconM0_V0_1" ).on    ( "click", function( event )      { runInView( i_actionVals.restoreHierarchy_ ); });

    // Module 0 View 2 (Stats/Schema Wheel) icons.
    $( "#_iconM0_V2_0" ).on    ( "click", function( event )      { runInView( i_actionVals.showTree_ ); });
    $( "#_iconM0_V2_1" ).on    ( "click", function( event )      { runInView( i_actionVals.revertTree_ ); });

    // Module 1 View 1 (Analyze/Shard Analysis) icons.
    $( "#_iconM1_V1_0" ).on    ( "click", function( event )      { runInView( i_actionVals.returnToLastStep_ ); });
    $( "#_iconM1_V1_1" ).on    ( "click", function( event )      { runInView( i_actionVals.goToNextStep_ ); });
    $( "#_iconM1_V1_2" ).on    ( "click", function( event )      { runInView( i_actionVals.showTree_ ); });
    $( "#_iconM1_V1_3" ).on    ( "click", function( event )      { runInView( i_actionVals.revertTree_ ); });

    // Heat indicator icons.
    $( "#_heatIndicator" ).on  ( "mouseover", function( event )  { handleMouseOverHeat(); });
    $( "#_heatIndicator" ).on  ( "mouseout", function( event )   { mouseOutTooltipLocal( event ); });

    // Help icons.
    $( "#_iconHelpClose" ).on  ( "click", function( event )      { stc_clearHelp(); stc_closeHelp(); });

    // Log dialog icons.
    $( "#_iconLogClose" ).on   ( "click", function( event )      { stc_closeLogDialog(); });

    // Chart icon.
    $( "#_iconChart" ).on      ( "click", function( event )      { displayChartDB(); });

    // CONTENTS/LOAD.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );
    stc_clearHelp();
    stc_initLogDialog();
    stc_closeLogDialog();

    // Create heat indicator.
    initHeatIndicator();

    // Create/init timeline.
    tl_initTimeline();

    // Disable functions for icons that open modules not currently used.
    // If we are only using one module, also disable function (but not title or label) for sole module.
    var modulesOpen_ = 4;
    if ( !i_useModule0 ) { disableIcon( $( "#_iconM0" ) ); modulesOpen_--; }
    if ( !i_useModule1 ) { disableIcon( $( "#_iconM1" ) ); modulesOpen_--; }
    if ( !i_useModule2 ) { disableIcon( $( "#_iconM2" ) ); modulesOpen_--; }
    if ( !i_useModule3 ) { disableIcon( $( "#_iconM3" ) ); modulesOpen_--; }
    if ( modulesOpen_ == 1 ) {
      if ( i_useModule0 ) { disableIcon( $( "#_iconM0" ) ); }
      if ( i_useModule1 ) { disableIcon( $( "#_iconM1" ) ); }
      if ( i_useModule2 ) { disableIcon( $( "#_iconM2" ) ); }
      if ( i_useModule3 ) { disableIcon( $( "#_iconM3" ) ); }
    }//modulesOpen_ is 1

    // Disable functions for icons that open views not currently used.
    // If we are only using one view, also disable function (but not title or label) for sole view.

    // Module 0: Stats.
    var m0ViewsOpen_ = 3;
    if ( !i_useModule0_0 ) { disableIcon( $( "#_iconView_M0_V0" ) ); m0ViewsOpen_--; }
    if ( !i_useModule0_1 ) { disableIcon( $( "#_iconView_M0_V1" ) ); m0ViewsOpen_--; }
    if ( !i_useModule0_2 ) { disableIcon( $( "#_iconView_M0_V2" ) ); m0ViewsOpen_--; }
    if ( m0ViewsOpen_ == 1 ) {
      if ( i_useModule0_0 ) { disableIcon( $( "#_iconView_M0_V0" ) ); }
      if ( i_useModule0_1 ) { disableIcon( $( "#_iconView_M0_V1" ) ); }
      if ( i_useModule0_2 ) { disableIcon( $( "#_iconView_M0_V2" ) ); }
    }//m0ViewsOpen_ is 1

    // Module 1: Analyze.
    var m1ViewsOpen_ = 3;
    if ( !i_useModule1_0 ) { disableIcon( $( "#_iconView_M1_V0" ) ); m1ViewsOpen_--; }
    if ( !i_useModule1_1 ) { disableIcon( $( "#_iconView_M1_V1" ) ); m1ViewsOpen_--; }
    if ( !i_useModule1_2 ) { disableIcon( $( "#_iconView_M1_V2" ) ); m1ViewsOpen_--; }
    if ( m1ViewsOpen_ == 1 ) {
      if ( i_useModule1_0 ) { disableIcon( $( "#_iconView_M1_V0" ) ); }
      if ( i_useModule1_1 ) { disableIcon( $( "#_iconView_M1_V1" ) ); }
      if ( i_useModule1_2 ) { disableIcon( $( "#_iconView_M1_V2" ) ); }
    }//m1ViewsOpen_ is 1

    // Module 2: Manage.
    var m2ViewsOpen_ = 4;
    if ( !i_useModule2_0 ) { disableIcon( $( "#_iconView_M2_V0" ) ); m2ViewsOpen_--; }
    if ( !i_useModule2_1 ) { disableIcon( $( "#_iconView_M2_V1" ) ); m2ViewsOpen_--; }
    if ( !i_useModule2_2 ) { disableIcon( $( "#_iconView_M2_V2" ) ); m2ViewsOpen_--; }
    if ( !i_useModule2_3 ) { disableIcon( $( "#_iconView_M2_V3" ) ); m2ViewsOpen_--; }
    if ( m2ViewsOpen_ == 1 ) {
      if ( i_useModule2_0 ) { disableIcon( $( "#_iconView_M2_V0" ) ); }
      if ( i_useModule2_1 ) { disableIcon( $( "#_iconView_M2_V1" ) ); }
      if ( i_useModule2_2 ) { disableIcon( $( "#_iconView_M2_V2" ) ); }
      if ( i_useModule2_3 ) { disableIcon( $( "#_iconView_M2_V3" ) ); }
    }//m2ViewsOpen_ is 1

    // Disable functions for context icons that are not yet implemented.

    // Module 0: Stats.
    disableIcon( $( "#_iconM0_3" ) );
    disableIcon( $( "#_iconM0_4" ) );
    
    // Get initial page from calling href.
// 		var passedPageName_ = location.href.substring( ( location.href.indexOf( "?" ) + 1 ), location.href.length );
// 		if ( location.href.indexOf( "?" ) < 0 ) {
// 		  passedPageName_ = "";
// 		}//param not valid
// 		var pageNameSplit_ = passedPageName_.split( "&" );
// 		passedPageName_ = new Array();
// 
// 		for ( var i = 0; i < pageNameSplit_.length; i++ ) {
// 				var nameValue_ = pageNameSplit_[i].split( "=" );
// 				nameValue_[1] = nameValue_[1].replace( /\+/g, " " );
// 				passedPageName_[ nameValue_[0] ] = unescape( nameValue_[1] );
// 		}//for each entry in pageNameSplit_
// 
// 		if ( passedPageName_[ "passedPageName" ] != "" ) {
// 		  i_pageInitial = passedPageName_[ "passedPageName" ];
// 		}//passed name is valid
  
    // Load login. Comment out when loading individual modules without login.
    goToLogin();
    
    // Bypass login. Comment out when using login.
    //i_isTestMode = true;
    //goToInitialPage();

  }//initApp

  // ============================================================================
  // LOAD.
  // ============================================================================

  // GO TO LOGIN.
  function goToLogin() {
    stc_loadIframe( "_view", "login.html" );
  }//goToLogin

  // GO TO SETUP.
  function goToSetup() {
    stc_loadIframe( "_view", "setup.html" );
  }//goToSetup

  // GO TO INITIAL PAGE.
  function goToInitialPage() {
    stc_loadIframe( "_view", i_pageInitial );
  }//goToInitialPage

  // INIT LOAD.
  // Stop timer and hide all elements.
  function initLoad() {
    // Stop timer(s).
    chrt_stopChartTimer();
    stopTimer();
    tl_stopClock();

    // Hide modules.
    hideModules();

    // Init and hide all icons.
    hideModuleIcons();
    initViewIcons(); hideViewIcons();
    hideMiscIcons();
    hideIconSets();
    $( "#_iconGlobal1" ).attr( "src", "img/iconMessage.png" );

    // Close help.
    stc_closeHelp();

    // Init log dialog.
    i_log = [];
    stc_initLogDialog();
    stc_closeLogDialog();

    // Hide tooltips.
    stc_hideTooltip( $( "#_tooltip" ) );

    // Hide module title.
    $( "#_titleModule" ).html( "DataViews" );
    $( "#_titleModule" ).hide();

    // Zero out heat indicator.
    zeroOutHeatIndicator();

    // Hide and clear footer.
    $( "#_footer" ).css( "visibility", "hidden" );
    $( "#_textFooter" ).html( "" );

    // Set overflow style for view.
    $( "#_view" ).css( "overflow", "hidden" );

    // Init vars for current module/view.
    i_moduleCurrent = "";
    i_viewCurrent   = "";
  }//initLoad

  // INIT SPECIAL.
  // Perform special init tasks from view.
  function initSpecial( viewName_ ) {
    switch( viewName_ ) {

      case s_module1._1_:
		    // Close help.
		    stc_closeHelp();

		    // Init log icon.
		    $( "#_iconGlobal1" ).attr( "src", "img/iconMessage.png" );

		    // Zero out heat indicator.
		    zeroOutHeatIndicator();

		    // Hide heat indicator.
		    $( "#_heatIndicator" ).css( "visibility", "hidden" );

		    // Hide components used for timeline.
		    toggleShowTimeline( false );

		    // Turn overflow on.
		    toggleUseOverflow( true );
      break;

      default: break;
    }//switch viewName_
  }//initSpecial

  // LOAD MODULE.
  function loadModule( moduleName_, viewName_ ) {
    // Check params.
    if ( !stc_isDefined( moduleName_ ) ) { moduleName_ = ""; }
    if ( !stc_isDefined( viewName_ ) )   { viewName_ = ""; }

    // Init load - stop timer(s) and hide all elements.
    initLoad();

    // Set vars for current module/view.
    i_moduleCurrent = moduleName_;
    i_viewCurrent   = viewName_;

    // Set default log position/height.
    positionMessageLog( 326, 120 );
    stc_setLogHeight( 200 );

    // Set default help position.
    positionHelpDialog( 20, 340 );

    // Set up index page for selected module.
    switch( moduleName_ ) {

      // LOGIN.
      case s_module.login_:
        // Set overflow style for module.
        $( "#_view" ).css( "overflow", "hidden" );

		    // Set log position/height.
		    positionMessageLog( 0, 100 );
		    stc_setLogHeight( 400 );
      break;

      // SETUP.
      case s_module.setup_:
        // Set overflow style for module.
        $( "#_view" ).css( "overflow", "hidden" );

		    // Set log position/height.
		    positionMessageLog( 0, 100 );
		    stc_setLogHeight( 400 );
      break;

      // STATS.
      case s_module._0_:
		    // Show module title.
		    $( "#_titleModule" ).html( "Stats" );
		    $( "#_titleModule" ).show();
		          
        // Do view-specific settings.
        switch( viewName_ ) {

	        case s_module0._0_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Heat Map" );
		    	        
	          // Set overflow style for view.
	          $( "#_view" ).css( "overflow", "hidden" );
	        break;

	        case s_module0._1_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Heat List" );
	          	        
	          // Set overflow style for view.
	          $( "#_view" ).css( "overflow", "auto" );
	        break;

	        case s_module0._2_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Schema Wheel" );
	           
	          // Set overflow style for view.
	          $( "#_view" ).css( "overflow", "hidden" );

				    // Set help position.
				    positionHelpDialog( 360, 120 );
	        break;

          default: break;
        }//switch viewName_

        // Hide heat indicator.
        // Each view will show it again after it runs service to get data for heat indicator.
        $( "#_heatIndicator" ).css( "visibility", "hidden" );

        // Show components used for timeline.
        if ( i_useTimeline ) {
	        toggleShowTimeline( true );
        }//i_useTimeline true

        // Start digital clock for timeline.
        tl_runClock();

        // Start timer for various timed functions.
        startTimer();

		    // Show load tooltip.
		    showLoadTooltip();

		    // Show icon sets.
		    showIconSets( moduleName_, viewName_ );

		    // Show footer.
		    $( "#_footer" ).css( "visibility", "visible" );

      break;
      // STATS END.

      // ANALYZE.
      case s_module._1_:
        // Set overflow style for module.
        $( "#_view" ).css( "overflow", "auto" );

		    // Show module title.
		    $( "#_titleModule" ).html( "Analyze" );
		    $( "#_titleModule" ).show();

		    // Show load tooltip.
		    showLoadTooltip();

		    // Show icon sets.
		    showIconSets( moduleName_, viewName_ );

		    // Show footer.
		    $( "#_footer" ).css( "visibility", "visible" );
      break;

      // MANAGE.
      case s_module._2_:
        // Set overflow style for module.
        $( "#_view" ).css( "overflow", "auto" );

		    // Show module title.
		    $( "#_titleModule" ).html( "Manage" );
		    $( "#_titleModule" ).show();

        // Do view-specific settings.
        switch( viewName_ ) {

	        case s_module2._0_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Agents" );
	        break;

	        case s_module2._1_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Clients" );
	        break;

	        case s_module2._2_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Hosts" );
	        break;

	        case s_module2._3_:
	          // Show module title.
	          $( "#_titleModule" ).html( "Processes" );
	        break;
	        
          default: break;
        }//switch viewName_
        
		    // Show load tooltip.
		    showLoadTooltip();

        // Start timer for various timed functions.
        startTimer();

		    // Show icon sets.
		    showIconSets( moduleName_, viewName_ );

		    // Show footer.
		    $( "#_footer" ).css( "visibility", "visible" );
		    $( "#_textFooter" ).html( i_uiStr.footer_ + "Memory stats: freeMem: " + i_freeMem + " KB; totalMem: " + i_totalMem + " KB; usedMem: " + i_usedMem + " KB; maxMem: " + i_maxMem + " KB" );
      break;

      // PREFERENCES.
      case s_module._3_:
        // Set overflow style for module.
        $( "#_view" ).css( "overflow", "auto" );

		    // Show module title.
		    $( "#_titleModule" ).html( "Preferences" );
		    $( "#_titleModule" ).show();

		    // Show load tooltip.
		    showLoadTooltip();

		    // Show icon sets.
		    showIconSets( moduleName_, viewName_ );

		    // Show footer.
		    $( "#_footer" ).css( "visibility", "visible" );
      break;

      // DEFAULT.
      default:
		    // Show module title.
		    $( "#_titleModule" ).html( "DataViews" );
		    $( "#_titleModule" ).show();

        // Set overflow style for module.
        $( "#_view" ).css( "overflow", "hidden" );

		    // Show icon sets.
		    showIconSets( moduleName_, viewName_ );

        // Load message page.
        i_message = i_uiStr.erNotImplemented_;
        stc_loadIframe( "_view", "message.html" );
      break;

    }//switch moduleName_
  }//loadModule

  // SHOW LOAD TOOLTIP.
  function showLoadTooltip() {
    stc_moveTooltip( $( "#_tooltip" ), 270, 350 );
    stc_showTooltip( $( "#_tooltip" ), s_message.loadPage_, 40, 200, true );
  }//showLoadTooltip

  // HIDE LOAD TOOLTIP.
  function hideLoadTooltip() {
    stc_hideTooltip( $( "#_tooltip" ) );
  }//hideLoadTooltip

  // HIDE MODULES.
  function hideModules() {

    // STATS.

    // Hide heat indicator.
    $( "#_heatIndicator" ).css( "visibility", "hidden" );

    // Hide components used for timeline.
    toggleShowTimeline( false );

  }//hideModules

  // GET PAGE NAME.
  function getPageName() {
    return $( "#" + "_view" ).contents().find( "#" + "_pageName" ).text();
  }//getPageName

  // GET VIEW.
  function getView() {
    return $( "#_view" )[0].contentWindow;
  }//getView

  // TOGGLE USE OVERFLOW.
  function toggleUseOverflow( on_ ) {
    if ( on_ ) {
      $( "#_view" ).css( "overflow", "auto" );
    } else {
      $( "#_view" ).css( "overflow", "hidden" );
    }//on_ false
  }//toggleUseOverflow

  // ============================================================================
  // BASIC INFO SERVICE.
  // ============================================================================

  // GET BASIC INFO.
  function getBasicInfo( module_ ) {
    // Send service.
    var loadMessage_ = s_message.loading_ + " " + s_action.basicInfo_;
    var arrayParams_ = new Array();
    stc_sendService( parent, loadMessage_, s_action.basicInfo_, arrayParams_, returnBasicInfo, testBasicResult_, $( "#_tooltip" ), null );
  }//getBasicInfo

  // RETURN BASIC INFO.
  function returnBasicInfo( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
			  // Store result vars.
	      if ( stc_isDefined( data_.serverName ) ) { i_serverName = data_.serverName; }
	      if ( stc_isDefined( data_.freeMem ) )    { i_freeMem    = data_.freeMem; }
	      if ( stc_isDefined( data_.totalMem ) )   { i_totalMem   = data_.totalMem; }
	      if ( stc_isDefined( data_.usedMem ) )    { i_usedMem    = data_.usedMem; }
	      if ( stc_isDefined( data_.maxMem ) )     { i_maxMem     = data_.maxMem; }

		    // Go to module.
		    switch( getPageName() ) {
		      case s_module2._0_: getView().loadPage(); break;
		      case s_module2._1_: getView().loadPage(); break;
		      case s_module2._2_: getView().loadPage(); break;
		      case s_module2._3_: getView().loadPage(); break;
		      default: break;
		    }//switch getPageName
	    }//status is success
    }//data_ status_ valid
  }//returnBasicInfo

  // ============================================================================
  // ICONS.
  // ============================================================================

  // DISABLE ICON.
  function disableIcon( icon_ ) {
    if ( icon_ ) {
      icon_.off( "click" );
      icon_.off( "mouseover" );
      icon_.off( "mouseout" );
      icon_.removeClass( "icon" );
      icon_.addClass( "iconDisabled" );
    }//icon_ valid
  }//disableIcon

  // HIDE MODULE ICONS.
  function hideModuleIcons() {
    if ( $( "#_modules" ) ) {
      $( "#_view" ).css( "opacity", "1" );
      var yOffset_ = -( $( "#_modules" ).height() );
      $( "#_modules" ).css( "visibility", "hidden" );
      $( "#_modules" ).css( "top", yOffset_ );
      i_iconModuleShow = false;
    }//_modules valid
  }//hideModuleIcons

  // SHOW MODULE ICONS.
  function showModuleIcons() {
    if ( $( "#_modules" ) && $( "#_iconTop" ) ) {
      $( "#_view" ).css( "opacity", "0.6" );
      var x_ = $( "#_iconTop" ).position().left;
      var yOffset_ = $( "#_iconTop" ).position().top + $( "#_iconTop" ).height() + $( "#_modules" ).height() + 5;
      $( "#_modules" ).css( "left", x_ );
      $( "#_modules" ).css( "visibility", "visible" );
      if ( !i_iconModuleShow ) {
        $( "#_modules" ).animate({ top: "+=" + yOffset_ + "px" });
        i_iconModuleShow = true;
      } else {
        hideModuleIcons();
      }//i_iconModuleShow true
    }//_modules _iconTop valid
  }//showModuleIcons

  // INIT VIEW ICONS.
  function initViewIcons() {
    // Module 0: Stats.
    toggleShowSingleIcon( $( "#_iconView_M0_V0" ), $( "#_iconView_M0_V0Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M0_V1" ), $( "#_iconView_M0_V1Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M0_V2" ), $( "#_iconView_M0_V2Text" ), false );

    // Module 1: Analyze.
    toggleShowSingleIcon( $( "#_iconView_M1_V0" ), $( "#_iconView_M1_V0Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M1_V1" ), $( "#_iconView_M1_V1Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M1_V2" ), $( "#_iconView_M1_V2Text" ), false );

    // Module 2: Manage.
    toggleShowSingleIcon( $( "#_iconView_M2_V0" ), $( "#_iconView_M2_V0Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M2_V1" ), $( "#_iconView_M2_V1Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M2_V2" ), $( "#_iconView_M2_V2Text" ), false );
    toggleShowSingleIcon( $( "#_iconView_M2_V3" ), $( "#_iconView_M2_V3Text" ), false );
  }//initViewIcons

  // SET VIEW ICONS.
  function setViewIcons( moduleName_ ) {
    // Check param.
    if ( !stc_isDefined( moduleName_ ) ) { moduleName_ = ""; }

    // Set view icons for selected module.
    switch( moduleName_ ) {

      // Module 0: Stats.
      case s_module._0_:
		    // Set height and top for parent component.
		    $( "#_views" ).css( "height", 195 );
		    $( "#_views" ).css( "top", -195 );

		    // Set individual icons to show.
		    toggleShowSingleIcon( $( "#_iconView_M0_V0" ), $( "#_iconView_M0_V0Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M0_V1" ), $( "#_iconView_M0_V1Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M0_V2" ), $( "#_iconView_M0_V2Text" ), true );
      break;

      // Module 1: Analyze.
      case s_module._1_:
		    // Set height and top for parent component.
		    $( "#_views" ).css( "height", 195 );
		    $( "#_views" ).css( "top", -195 );

		    // Set individual icons to show.
		    toggleShowSingleIcon( $( "#_iconView_M1_V0" ), $( "#_iconView_M1_V0Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M1_V1" ), $( "#_iconView_M1_V1Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M1_V2" ), $( "#_iconView_M1_V2Text" ), true );
      break;

      // Module 2: Manage.
      case s_module._2_:
		    // Set height and top for parent component.
		    $( "#_views" ).css( "height", 260 );
		    $( "#_views" ).css( "top", -260 );

		    // Set individual icons to show.
		    toggleShowSingleIcon( $( "#_iconView_M2_V0" ), $( "#_iconView_M2_V0Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M2_V1" ), $( "#_iconView_M2_V1Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M2_V2" ), $( "#_iconView_M2_V2Text" ), true );
		    toggleShowSingleIcon( $( "#_iconView_M2_V3" ), $( "#_iconView_M2_V3Text" ), true );
      break;

      case s_module._3_: break;

      default: break;

    }//switch moduleName_
  }//setViewIcons

  // HIDE VIEW ICONS.
  function hideViewIcons() {
    if ( $( "#_views" ) ) {
      $( "#_view" ).css( "opacity", "1" );
      var yOffset_ = -( $( "#_views" ).height() );
      $( "#_views" ).css( "visibility", "hidden" );
      $( "#_views" ).css( "top", yOffset_ );
      i_iconViewShow = false;
    }//_views valid
  }//hideViewIcons

  // SHOW VIEW ICONS.
  function showViewIcons() {
    if ( $( "#_views" ) && $( "#_iconTop" ) ) {
      $( "#_view" ).css( "opacity", "0.6" );
      var x_ = $( "#_iconTop" ).position().left + 60;
      var yOffset_ = $( "#_iconTop" ).position().top + $( "#_iconTop" ).height() + $( "#_views" ).height() + 5;
      $( "#_views" ).css( "left", x_ );
      $( "#_views" ).css( "visibility", "visible" );
      if ( !i_iconViewShow ) {
        $( "#_views" ).animate({ top: "+=" + yOffset_ + "px" });
        i_iconViewShow = true;
      } else {
        hideViewIcons();
      }//i_iconViewShow true
    }//_views _iconTop valid
  }//showViewIcons

  // HIDE MISC ICONS.
  function hideMiscIcons() {
    toggleShowSingleIcon( $( "#_iconChart" ), null, false );
  }//hideMiscIcons

  // TOGGLE SHOW SINGLE ICON.
  function toggleShowSingleIcon( icon_, iconText_, show_ ) {
    if ( show_ ) {
	    if ( icon_ )     { icon_.css( "visibility", "visible" ); }
	    if ( iconText_ ) { iconText_.css( "visibility", "visible" ); }
    } else {
	    if ( icon_ )     { icon_.css( "visibility", "hidden" ); }
	    if ( iconText_ ) { iconText_.css( "visibility", "hidden" ); }
    }//show_ false
  }//toggleShowSingleIcon

  // HIDE ICON SETS.
  function hideIconSets() {
    // Global/general.
    hideIconSet( $( "#_iconTop" ) );      i_iconTopShow    = false;
    hideIconSet( $( "#_iconGlobal" ) );   i_iconGlobalShow = false;
    hideIconSet( $( "#_iconSetM0" ) );    i_iconM0Show     = false;

    // Module 0: Stats.
    hideIconSet( $( "#_iconSetM0_V0" ) ); i_iconView_M0_V0Show = false;
    hideIconSet( $( "#_iconSetM0_V1" ) ); i_iconView_M0_V1Show = false;
    hideIconSet( $( "#_iconSetM0_V2" ) ); i_iconView_M0_V2Show = false;

    // Module 1: Analyze.
    hideIconSet( $( "#_iconSetM1_V0" ) ); i_iconView_M1_V0Show = false;
    hideIconSet( $( "#_iconSetM1_V1" ) ); i_iconView_M1_V1Show = false;
    hideIconSet( $( "#_iconSetM1_V2" ) ); i_iconView_M1_V2Show = false;

    // Module 2: Manage.
    hideIconSet( $( "#_iconSetM2_V0" ) ); i_iconView_M2_V0Show = false;
    hideIconSet( $( "#_iconSetM2_V1" ) ); i_iconView_M2_V1Show = false;
    hideIconSet( $( "#_iconSetM2_V2" ) ); i_iconView_M2_V2Show = false;
    hideIconSet( $( "#_iconSetM2_V3" ) ); i_iconView_M2_V3Show = false;

    // Hide icons that are displayed by views.

    // Module 1: Analyze.
    $( "#_iconM1_V1_0" ).css( "visibility", "hidden" );
    $( "#_iconM1_V1_0Text" ).css( "visibility", "hidden" );

    $( "#_iconM1_V1_1" ).css( "visibility", "hidden" );
    $( "#_iconM1_V1_1Text" ).css( "visibility", "hidden" );
  }//hideIconSets

  // HIDE ICON SET.
  function hideIconSet( iconSet_ ) {
    var xOffset_ = 0;
    if ( iconSet_ ) {
	    iconSet_.css( "visibility", "hidden" );
	    xOffset_ = -( iconSet_.width() );
	    iconSet_.css( "left", xOffset_ );
    }//iconSet_ valid
  }//hideIconSet

  // SHOW ICON SETS.
  function showIconSets( moduleName_, viewName_ ) {
    // Check params.
    if ( !stc_isDefined( moduleName_ ) ) { moduleName_ = ""; }
    if ( !stc_isDefined( viewName_ ) )   { viewName_ = ""; }

    // Init vars for menu positions.
    var offset_ = 0; var lastPosition_ = 0;

    // Set view icons for selected module.
    setViewIcons( moduleName_ );

    // Show upper icons (for showing modules and views).
    if ( !i_iconTopShow ) {
      if ( $( "#_iconTop" ) && $( "#_titleModule" ) ) {
        offset_ = ( $( "#_iconTop" ).width() + $( "#_titleModule" ).position().left + $( "#_titleModule" ).width() + 10 );
        $( "#_iconTop" ).css( "left", -( $( "#_iconTop" ).width() ) );
        $( "#_iconTop" ).css( "visibility", "visible" );
        $( "#_iconTop" ).animate({ left: "+=" + offset_ + "px" });
      }//elements valid
      i_iconTopShow = true;
      lastPosition_ = offset_;
    }//i_iconTopShow false

    // Show global icons.
    lastPosition_ = showIconSet( i_iconGlobalShow, $( "#_iconGlobal" ), lastPosition_ );

    // Show icons for selected module.
    switch( moduleName_ ) {

      // STATS.
      case s_module._0_:
        // Show context icons for module.
        if ( i_useTimeline ) {
          lastPosition_ = showIconSet( i_iconM0Show, $( "#_iconSetM0" ), lastPosition_ );
        }//i_useTimeline true

		    // Show icons for selected view.
		    switch( viewName_ ) {
		      case s_module0._0_: lastPosition_ = showIconSet( i_iconView_M0_V0Show, $( "#_iconSetM0_V0" ), lastPosition_ ); break;
		      case s_module0._1_: lastPosition_ = showIconSet( i_iconView_M0_V1Show, $( "#_iconSetM0_V1" ), lastPosition_ ); break;
		      case s_module0._2_: lastPosition_ = showIconSet( i_iconView_M0_V2Show, $( "#_iconSetM0_V2" ), lastPosition_ ); break;
		      case s_module2._0_: lastPosition_ = showIconSet( i_iconView_M2_V0Show, $( "#_iconSetM2_V0" ), lastPosition_ ); break;
		      default: break;
		    }//switch viewName_
      break;
      // STATS END.

      // ANALYZE.
      case s_module._1_:

		    // Show icons for selected view.
		    switch( viewName_ ) {
		      case s_module1._0_: lastPosition_ = showIconSet( i_iconView_M1_V0Show, $( "#_iconSetM1_V0" ), lastPosition_ ); break;
		      case s_module1._1_: lastPosition_ = showIconSet( i_iconView_M1_V1Show, $( "#_iconSetM1_V1" ), lastPosition_ ); break;
		      case s_module1._2_: lastPosition_ = showIconSet( i_iconView_M1_V2Show, $( "#_iconSetM1_V2" ), lastPosition_ ); break;
		      default: break;
		    }//switch viewName_
      break;
      // ANALYZE END.

      // MANAGE.
      case s_module._2_:

		    // Show icons for selected view.
		    switch( viewName_ ) {
		      case s_module2._0_: lastPosition_ = showIconSet( i_iconView_M2_V0Show, $( "#_iconSetM2_V0" ), lastPosition_ ); break;
		      case s_module2._1_: lastPosition_ = showIconSet( i_iconView_M2_V1Show, $( "#_iconSetM2_V1" ), lastPosition_ ); break;
		      case s_module2._2_: lastPosition_ = showIconSet( i_iconView_M2_V2Show, $( "#_iconSetM2_V2" ), lastPosition_ ); break;
		      case s_module2._3_: lastPosition_ = showIconSet( i_iconView_M2_V3Show, $( "#_iconSetM2_V3" ), lastPosition_ ); break;
		      default: break;
		    }//switch viewName_

      break;
      // MANAGE END.

      default: break;

    }//switch moduleName_
  }//showIconSets

  // SHOW ICON SET.
  function showIconSet( i_Showing, iconSet_, lastPosition_ ) {
    var offset_ = 0;
    if ( !i_Showing ) {
      if ( iconSet_ && stc_isNumber( lastPosition_ ) ) {
        offset_ = lastPosition_ + iconSet_.width() + 10;
        iconSet_.css( "visibility", "visible" );
        iconSet_.animate({ left: "+=" + offset_ + "px" });
      }//iconSet_ lastPosition_ valid
      i_Showing = true;
      lastPosition_ = offset_;
    }//i_Showing false
    return lastPosition_;
  }//showIconSet

  // ============================================================================
  // RUN IN/FROM VIEW.
  // ============================================================================

  // RUN IN VIEW.
  function runInView( action_ ) {
    if ( stc_isDefined( action_ ) && getPageName() ) {
      switch( action_ ) {

        case i_actionVals.showTree_:
          // Module 0 View 0 (Stats/Heat Map).
          if ( getPageName() == s_module0._0_ ) {
            getView().tree_showTree();
          }//page is as specified

          // Module 0 View 2 (Stats/Schema Wheel).
          if ( getPageName() == s_module0._2_ ) {
            getView().tree_showTree();
          }//page is as specified

          // Module 1 View 1 (Analyze/Shard Analysis).
          if ( getPageName() == s_module1._1_ ) {
            getView().$( "#_containerSchemaWheel" )[0].contentWindow.tree_showTree();
          }//page is as specified
        break;

        case i_actionVals.revertTree_:
          // Module 0 View 2 (Stats/Schema Wheel).
          if ( getPageName() == s_module0._2_ ) {
            getView().tree_revertTree();
          }//page is as specified

          // Module 1 View 1 (Analyze/Shard Analysis).
          if ( getPageName() == s_module1._1_ ) {
            getView().$( "#_containerSchemaWheel" )[0].contentWindow.tree_revertTree();
          }//page is as specified
        break;

        case i_actionVals.restoreHierarchy_:
          // Module 0 View 0 (Stats/Heat Map).
          if ( getPageName() == s_module0._0_ ) {
            getView().restoreHierarchy();
          }//page is as specified
        break;

        default: break;
      }//switch action_
    }//action_ getPageName valid
  }//runInView

  // TOGGLE SHOW TREE ICONS.
  // Hide/show tree icons from view.
  function toggleShowTreeIcons( show_ ) {
    setIconSpecial( $( "#_iconM1_V1_2" ), show_ );
    setIconSpecial( $( "#_iconM1_V1_2Text" ), show_ );
    setIconSpecial( $( "#_iconM1_V1_3" ), show_ );
    setIconSpecial( $( "#_iconM1_V1_3Text" ), show_ );
  }//toggleShowTreeIcons

  // SET ICON SPECIAL.
  // Hide/show icons from view.
  function setIconSpecial( icon_, show_ ) {
    if ( stc_isDefined( icon_ ) ) {
	    if ( show_ ) {
		    icon_.css( "visibility", "visible" );
		    icon_.css( "visibility", "visible" );
	    } else {
		    icon_.css( "visibility", "hidden" );
		    icon_.css( "visibility", "hidden" );
	    }//show_ false
    }//icon_ valid
  }//setIconSpecial

  // ============================================================================
  // HELP.
  // ============================================================================

  // SHOW HELP DIALOG.
  function showHelpDialog( text_ ) {
    stc_showHelp( text_ );
  }//showHelpDialog

  // POSITION HELP DIALOG.
  function positionHelpDialog( x_, y_ ) {
    stc_moveHelp( x_, y_ );
  }//positionHelpDialog

  // SHOW HELP FOR MODULE.
  function showHelpForModule() {
    var helpDefault_ = "Default help.<br><br>";
    if ( getPageName() ) {
      switch( getPageName() ) {

        case s_module0._0_:
          showHelpDialog( s_help.heatMap_ );
        break;

        case s_module0._1_:
          showHelpDialog( s_help.heatList_ );
        break;

        case s_module0._2_:
          showHelpDialog( s_help.schemaWheel_ );
        break;

        case s_module1._1_:
          showHelpDialog( s_help.shardAnalysis_ );
        break;

        default: showHelpDialog( helpDefault_ ); break;
      }//switch getPageName
    }//getPageName valid
  }//showHelpForModule

  // ============================================================================
  // TIMER.
  // ============================================================================

  // START TIMER.
  function startTimer() {
    if ( !i_timerRunning ) {
      // Set run flag.
      i_timerRunning = true;

      // Reset counter.
      i_timerCounter = 0;

      // Run timer.
      runTimer();
    }//i_timerRunning false
  }//startTimer

  // STOP TIMER.
  function stopTimer() {
    // Stop timer.
    clearTimeout( i_timer );

    // Set run flag.
    i_timerRunning = false;

    // Set timer flags.
    i_refresh       = false;
    i_getStatListDB = false;
  }//stopTimer

  // RUN TIMER.
  function runTimer() {
    // Perform timed functions.
    if ( getPageName() ) {

      // Handle functions that fire every second.
      switch( getPageName() ) {
        case s_module0._0_: if ( i_getStatListDB ) { getView().blinkChart(); } break;
        case s_module0._1_: if ( i_getStatListDB ) { getView().blinkChart(); } break;
        case s_module2._0_: if ( i_getStatListDB ) { getView().blinkChart(); } break;
        case s_module2._1_: if ( i_getStatListDB ) { getView().blinkChart(); } break;
        default: break;
      }//switch getPageName

      // Handle functions that fire every 15 seconds.
      if ( stc_isDivisbleByFifteen( i_timerCounter ) ) {
	      switch( getPageName() ) {
	        case s_module0._0_: if ( i_getStatListDB ) { getView().getStatList(); } break;
	        case s_module0._1_: if ( i_getStatListDB ) { getView().getStatList(); } break;
	        case s_module2._0_: if ( i_getStatListDB ) { getView().getStatList(); } break;
	        case s_module2._1_: if ( i_getStatListDB ) { getView().getStatList(); } break;
	        default: break;
	      }//switch getPageName
      }//divisible by 15

      // Handle functions that fire every 44 seconds.
      if ( stc_isDivisbleBy44( i_timerCounter ) ) {
	      switch( getPageName() ) {
	        case s_module0._1_: if ( i_refresh ) { getView().refreshPage(); } break;
	        default: break;
	      }//switch getPageName
      }//divisible by 44

    }//getPageName valid

    // TEST
    //showHelpDialog( i_getStatListDB + " " + i_refresh + " " + i_timerCounter );

    // Increment counter.
    i_timerCounter++;
    if ( i_timerCounter > 999 ) { i_timerCounter = 0; }

    // Set recursive timer for specified seconds.
    i_timer = setTimeout( "runTimer()", i_timerSpeed_ );
  }//runTimer

  // ============================================================================
  // UTILITY.
  // ============================================================================

  // RESIZE CONTENTS.
  // Fires at end of any browser window resize.
  function resizeContents() {
    if ( $( "#_view" ) ) {
      var h_ = $( "#_view" ).height();
      var w_ = $( "#_view" ).width();
      if ( stc_isNumber( h_ ) && stc_isNumber( w_ ) ) {
	      if ( getPageName() ) {
		      switch( getPageName() ) {
		        case s_module0._0_: getView().resizeContents( h_, w_ ); break;
		        case s_module0._1_: break;
		        case s_module0._2_: break;
		        default         : break;
		      }//switch getPageName
	      }//getPageName valid
      }//h_ w_ valid
    }//_view valid
  }//resizeContents

  // MOUSE OUT TOOLTIP LOCAL.
  function mouseOutTooltipLocal( event ) {
    stc_mouseOutTooltip( $( "#_tooltip" ), event );
  }//mouseOutTooltipLocal

  // ============================================================================
  // MODULE 0 (STATS): STAT DB LIST.
  // ============================================================================

  // GET STAT DB LIST.
  function getStatDBList() {
    // Send service.
    var loadMessage_ = s_message.loading_ + " " + s_action.statsStats_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'queryName',   value: s_action.statsStats_ } );
    arrayParams_.push( { param: 'statType',    value: s_statType.all_ } );
    arrayParams_.push( { param: 'statsTypeId', value: s_statType.random_ } );
    arrayParams_.push( { param: 'rowLimit',    value: i_svcVals.nbrStatsDBReq_ } );
    stc_sendService( parent, loadMessage_, s_action.statsStats_, arrayParams_, returnStatDBList, testStatsResult_, $( "#_tooltip" ), null );
  }//getStatDBList

  // RETURN STAT DB LIST.
  function returnStatDBList( data_, status_ ) {
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
          createStatDBArray( countSuccess_ );

          // Set chart stats and show.
          updateChartDB();
	      }//statInterval_ countSuccess_ valid
	    }//status is success
    }//data_ status_ valid
  }//returnStatDBList

  // CREATE STAT DB ARRAY.
  function createStatDBArray( arrayStat_ ) {
    if ( arrayStat_ ) {
      // Array comes back with more recent values at end.
      // Reverse so most recent are at beginning.
      arrayStat_.reverse();

      // Transfer contents to master array.
      i_arrayStatDB = new Array();
      var length_  = arrayStat_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isNumber( arrayStat_[i] ) ) {
          i_arrayStatDB.push( arrayStat_[i] );
        }//entry valid
      }//for each entry
    }//arrayStat_ valid
  }//createStatDBArray

  // ============================================================================
  // MODULE 0 (STATS): HEAT INDICATOR.
  // ============================================================================

  // INIT HEAT INDICATOR.
  function initHeatIndicator() {
    if ( $( "#_heatIndicator" ) ) {
      // Create stage and layer.
      i_stageHeatIndicator = new Kinetic.Stage({ container: "_heatIndicator", width: 145, height: 130 });
      i_layerHeatIndicator = new Kinetic.Layer();

      // Add layer to stage, then create stage/layer elements.
      if ( i_stageHeatIndicator && i_layerHeatIndicator ) {
        // Add layer to stage.
        i_stageHeatIndicator.add( i_layerHeatIndicator );

        // Create chart that shows frequency for all database tables.
        makeChartDB( s_grayE );

        // Create thermometer that shows heat for all visible tables.
        makeThermometerDB();
      }//i_stageHeatIndicator i_layerHeatIndicator valid
    }//_heatIndicator valid
  }//initHeatIndicator

  // ZERO OUT HEAT INDICATOR.
  // Can be called by junior page, so check if stage and layer are valid.
  function zeroOutHeatIndicator() {
    if ( i_stageHeatIndicator && i_layerHeatIndicator ) {
      // Init stat array and number of tables.
      i_arrayStatDB = new Array();
      i_nbrTablesDB = 0;

      // Hide chart.
      chrt_hideMiniChart( stc_getIdentifier( "", s_strChart ), stc_getIdentifier( "", s_strChartLine ), i_stageHeatIndicator, i_layerHeatIndicator );

      // Init heat.
      i_heatTotal = 0;

      // Hide thermometer.
      th_hideThermometer( stc_getIdentifier( "", s_strThermometer ), i_stageHeatIndicator, i_layerHeatIndicator );
    }//i_stageHeatIndicator i_layerHeatIndicator
  }//zeroOutHeatIndicator

  // MAKE CHART DB.
  // Chart shows frequency for all database tables.
  function makeChartDB( fill_ ) {
    if ( stc_isDefined( fill_ ) ) {
	    var xChart_ = 50;
	    var yChart_ = 12;
	    var hChart_ = 100;
	    var wChart_ = 115;
	    i_chartDB = chrt_createMiniChart( stc_getIdentifier( "", s_strChart ), xChart_, yChart_, hChart_, wChart_, fill_ );
	    if ( i_chartDB ) {
	      i_chartDB.setScale( 0.8 );
	      i_layerHeatIndicator.add( i_chartDB );
	    }//i_chartDB valid
    }//fill_ valid
  }//makeChartDB

  // UPDATE CHART DB.
  function updateChartDB() {
    if ( i_arrayStatDB && $( "#_heatIndicator" ) ) {
      if ( i_arrayStatDB.length > 0 ) {
        // Store number of tables.
        i_nbrTablesDB = i_arrayStatDB.length;

        // Show heat indicator.
        $( "#_heatIndicator" ).css( "visibility", "visible" );

        // Update and show chart.
        i_chartDB = stc_getElement( stc_getIdentifier( "", s_strChart ), i_stageHeatIndicator );
        if ( i_chartDB ) {
          // Set fill and stroke for current page.
          var fill_        = s_grayE;
		      var colorStroke_ = s_gray6;
          if ( getPageName() ) {
            switch( getPageName() ) {
              case s_module0._2_: fill_ = s_color.blueDark_; colorStroke_ = s_white; break;
              case s_module0._0_: fill_ = s_gray7;           colorStroke_ = s_white; break;
              case s_module0._1_: fill_ = s_gray9;           colorStroke_ = s_white; break;
              case s_module1._1_: fill_ = s_color.blueDark_; colorStroke_ = s_white; break;
              default: break;
            }//switch getPageName
          }//getPageName valid

          // Update chart fill.
          chrt_setMiniChartFill( i_chartDB, fill_ );

          // Create chart line.
          var hChart_        = 100;
          var wChart_        = 115;
          var nbrChartSlots_ = 10;
          var hOffset_       = 5;
          var wOffset_       = 5;
          var showPoints_    = false;
          var radiusPoint_   = 7;
          chrt_createChartLine( i_stageHeatIndicator, i_chartDB, stc_getIdentifier( "", s_strChartLine ),
                           i_arrayStatDB, null, hChart_, wChart_, colorStroke_,
                           nbrChartSlots_, hOffset_, wOffset_,
                           showPoints_, radiusPoint_, mouseoverChart, mouseOutTooltipLocal, false, null );

          // Show chart.
          chrt_showMiniChart( stc_getIdentifier( "", s_strChart ), i_stageHeatIndicator, i_layerHeatIndicator );

          // Hide/show chart icon.
          $( "#_iconChart" ).css( "visibility", "hidden" );
			    if ( getPageName() == s_module0._0_ ) {
			      $( "#_iconChart" ).css( "visibility", "visible" );
			    }//getPageName is heatMap
        }//i_chartDB valid
      }//i_arrayStatDB not empty
    }//i_arrayStatDB _heatIndicator valid
  }//updateChartDB

  // DISPLAY CHART DB.
  // Chart shows frequency for all database tables.
  // Fires function in junior page.
  function displayChartDB() {
    if ( getPageName() ) {
      switch( getPageName() ) {
        case s_module0._0_: getView().startStatList( s_statType.random_, s_statType.all_ ); break;
        case s_module0._1_: break;
        case s_module0._2_: break;
        default           : break;
      }//switch getPageName
    }//getPageName valid
  }//displayChartDB

  // MAKE THERMOMETER DB.
  // Thermometer shows heat for all visible tables.
  function makeThermometerDB() {
    // Set thermometer vals.
    // Use static vars for main dimensions (height, width, corner radius, and bulb radius).
    // To create smaller or larger thermometer, multiply static vars by same ratio.
    // Height can be set to a somewhat lower ratio but is best if it is same.
    // Check height with heat set to max to see what works.
    var parent_        = null;
    var thermometerID_ = stc_getIdentifier( "", s_strThermometer );
    var heat_          = 0;
    var xThermometer_  = 15;
    var yThermometer_  = 0;
    var addTicks_      = true;

    // Create thermometer (add to group inside called function).
    i_thermometerDB = th_createThermometer( parent_, thermometerID_, heat_,
                                       xThermometer_, yThermometer_,
                                       s_thermometerVals.height_, s_thermometerVals.width_,
                                       s_thermometerVals.cornerRadius_, s_thermometerVals.bulbRadius_, addTicks_ );
    if ( i_thermometerDB ) { i_layerHeatIndicator.add( i_thermometerDB ); }
  }//makeThermometerDB

  // UPDATE THERMOMETER DB.
  // Can be called by junior page, so check if stage and layer are valid.
  function updateThermometerDB( heatTotal_ ) {
    if ( i_stageHeatIndicator && i_layerHeatIndicator && $( "#_heatIndicator" ) && stc_isNumber( heatTotal_ ) ) {
      // Init heat vars and hide heat indicator elements.
      zeroOutHeatIndicator();

      // Store heat.
      i_heatTotal = heatTotal_;

      // Show heat indicator.
      $( "#_heatIndicator" ).css( "visibility", "visible" );

      // Update and show thermometer.
      i_thermometerDB = stc_getElement( stc_getIdentifier( "", s_strThermometer ), i_stageHeatIndicator );
      if ( i_thermometerDB ) {
        th_updateThermometer( i_stageHeatIndicator, stc_getIdentifier( "", s_strThermometer ),
                           i_heatTotal, s_thermometerVals.height_,
                           s_thermometerVals.cornerRadius_, s_thermometerVals.bulbRadius_ );
        th_showThermometer( stc_getIdentifier( "", s_strThermometer ), i_stageHeatIndicator, i_layerHeatIndicator );
      }//i_thermometerDB valid
    }//i_stageHeatIndicator i_layerHeatIndicator _heatIndicator heatTotal_ valid
  }//updateThermometerDB

  // HANDLE MOUSE OVER HEAT.
  function handleMouseOverHeat() {
    if ( $( "#_heatIndicator" ) && stc_isNumber( i_nbrTablesDB ) && stc_isNumber( i_heatTotal ) ) {
      // Set heat text.
      var heatText_ = stc_getHeatName( i_heatTotal );

      // Set tooltip text.
      var text_ = i_uiStr.tipHeatIndicator_ + "<br><br>Heat: " + heatText_ + ".";

      // Move and show tooltip.
      var x_ = $( "#_heatIndicator" ).position().left + $( "#_heatIndicator" ).width() + 10;
      var y_ = $( "#_heatIndicator" ).position().top - 20;
      stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
      stc_showTooltip( $( "#_tooltip" ), text_, 120, 220, true );
    }//_heatIndicator i_nbrTablesDB i_heatTotal valid
  }//handleMouseOverHeat

  // MOUSEOVER CHART.
  function mouseoverChart( event ) {
    var shape_ = event.targetNode;
    if ( shape_ && shape_.getParent() && $( "#_heatIndicator" ) ) {
      var xTip_ = ( $( "#_heatIndicator" ).position().left + shape_.getParent().getX() + shape_.getX() ) + 20;
      var yTip_ = ( $( "#_heatIndicator" ).position().top + shape_.getParent().getY() + shape_.getY() ) + 20;
      stc_moveTooltip( $( "#_tooltip" ), xTip_, yTip_ );
      stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 40, true );
    }//shape_ parent _heatIndicator valid
  }//mouseoverChart

  // ============================================================================
  // MODULE 0 (STATS): TIMELINE.
  // ============================================================================

  // TOGGLE SHOW TIMELINE.
  function toggleShowTimeline( show_ ) {
    if ( show_ ) {
      // Show components.
      $( "#_dateDigitalContainer" ).css( "visibility", "visible" );
      $( "#_dateDigitalContainer" ).css( "display", "block" );

      $( "#_clockDigitalContainer" ).css( "visibility", "visible" );
      $( "#_clockDigitalContainer" ).css( "display", "block" );

      $( "#_timeline" ).css( "visibility", "visible" );
      $( "#_timeline" ).css( "display", "block" );

      $( "#_hairlineContainer" ).css( "visibility", "visible" );
      $( "#_hairlineContainer" ).css( "display", "block" );

      $( "#_hairline" ).css( "visibility", "visible" );
      $( "#_hairline" ).css( "display", "block" );

      $( "#_hairlineCenter" ).css( "visibility", "visible" );
      $( "#_hairlineCenter" ).css( "display", "block" );
    } else {
	    // Hide components.
	    $( "#_dateDigitalContainer" ).css( "visibility", "hidden" );
	    $( "#_dateDigitalContainer" ).css( "display", "none" );

	    $( "#_clockDigitalContainer" ).css( "visibility", "hidden" );
	    $( "#_clockDigitalContainer" ).css( "display", "none" );

	    $( "#_timeline" ).css( "visibility", "hidden" );
	    $( "#_timeline" ).css( "display", "none" );

	    $( "#_hairlineContainer" ).css( "visibility", "hidden" );
	    $( "#_hairlineContainer" ).css( "display", "none" );

	    $( "#_hairline" ).css( "visibility", "hidden" );
	    $( "#_hairline" ).css( "display", "none" );

	    $( "#_hairlineCenter" ).css( "visibility", "hidden" );
	    $( "#_hairlineCenter" ).css( "display", "none" );
    }//show_ false
  }//toggleShowTimeline


