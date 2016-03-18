
  // ============================================================================
  // LIST HOST.
  // Requires static.js.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

	  // Load module/view.
	  if ( parent.i_serverName != "" &&
	       parent.i_freeMem    != "" &&
	       parent.i_totalMem   != "" &&
	       parent.i_usedMem    != "" &&
	       parent.i_maxMem     != "" ) {

	    loadPage();
	  } else {
	    parent.getBasicInfo( s_module._2_ );
	  }//vars empty

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Services. Cat is only used as a placeholder for service vals.
  var g_list = s_listType.host_;
  var g_cat  = s_listType.primary_;

  // Services vals.
  var g_svcVals = {
    nbrRowsReq_ : 16 };

  // Selected objects.
  var g_hostSelected = "";

  // View vals.
  var g_viewVals = {
    list_     : "list",
    drillDown_: "drillDown" };

  // Text.
  var g_charLimit = {
    main_   : 19,
    header_ : 70  };

  // Text strings.
  var g_uiStr = {
    tipHost_           : "Host",
    tipHostStatus_     : "Status for all hosts that are running any processes.",
    titleListHosts_    : "Hosts...",
    titleListHostsIP_  : "Hosts IP",
    titleListProcesses_: "Processes",
    titleListDiskUsage_: "Disk Usage Statistics"
  };

  // ============================================================================
  // LOAD/INIT.
  // ============================================================================

  // LOAD PAGE.
  function loadPage() {
	  // Load module/view.
	  parent.loadModule( s_module._2_, s_module2._2_ );

    // Init page.
    initPage();

    // Get first list. Callback gets next list.
    setupListRequest( s_listType.host_ );
    getList();
  }//loadPage

  // INIT PAGE.
  function initPage() {
    // Event handlers.

    // List view controls.
    $( "#_btnRefresh" ).on          ( "click", function( event ) { parent.populateLog( s_message.refreshMain_, s_svcVals.info_ ); setupListRequest( s_listType.host_ ); getList(); });

    // Drilldown view controls.
    $( "#_btnRefreshDrillDown" ).on ( "click", function( event ) { parent.populateLog( s_message.refreshDetail_, s_svcVals.info_ ); setupListRequestDD(); getListDD(); });
    $( "#_btnReturn" ).on           ( "click", function( event ) { toggleViewContents( g_viewVals.list_ ); });

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );

    // Hide load tooltip.
    parent.hideLoadTooltip();

    // Show server name.
    var serverName_ = s_message.notFound_;
    if ( parent.i_serverName != "" ) {
      serverName_ = parent.i_serverName;
    }//parent.i_serverName valid
    var textNormalized_ = stc_normalizeText( serverName_, g_charLimit.header_ );
    var nameDisplay_    = stc_addEllipsis( serverName_, textNormalized_, g_charLimit.header_ );
    $( "#_serverName0" ).html( nameDisplay_ ); $( "#_serverName0" ).attr( "title", serverName_ );
    $( "#_serverName1" ).html( nameDisplay_ ); $( "#_serverName1" ).attr( "title", serverName_ );

    // Show list view.
    toggleViewContents( g_viewVals.list_ );
  }//initPage

  // TOGGLE VIEW CONTENTS.
  function toggleViewContents( view_ ) {
	  if ( view_ == g_viewVals.list_ ) {
	    // Show list view, hide drilldown view.
	    $( "#_viewList" ).css( "visibility", "visible" );      $( "#_viewList" ).css( "display", "block" );
	    $( "#_viewDrillDown" ).css( "visibility", "hidden" );  $( "#_viewDrillDown" ).css( "display", "none" );
	  } else {
	    // Hide list view, show drilldown view.
	    $( "#_viewList" ).css( "visibility", "hidden" );       $( "#_viewList" ).css( "display", "none" );
	    $( "#_viewDrillDown" ).css( "visibility", "visible" ); $( "#_viewDrillDown" ).css( "display", "block" );

	    // Show host ID.
	    var text_           = g_uiStr.tipHost_ + " " + g_hostSelected;
	    var textNormalized_ = stc_normalizeText( text_, g_charLimit.header_ );
	    var nameDisplay_    = stc_addEllipsis( text_, textNormalized_, g_charLimit.header_ );
	    $( "#_hostName" ).html( nameDisplay_ ); $( "#_hostName" ).attr( "title", text_ );
	  }//view_ not g_viewVals.list_
  }//toggleViewContents

  // ============================================================================
  // LIST MAIN SERVICE.
  // ============================================================================

  // SETUP LIST REQUEST.
  function setupListRequest( type_ ) {
    // Hide lists.
    $( "#_divHost" ).css( "visibility", "hidden" );   $( "#_divHost" ).css( "display", "none" );
    $( "#_divHostIP" ).css( "visibility", "hidden" ); $( "#_divHostIP" ).css( "display", "none" );

    // Store list type.
    g_list = "";
    if ( stc_isDefined( type_ ) ) {
      g_list = type_;
    }//type_ valid
  }//setupListRequest

  // GET LIST.
  function getList() {
    // TEST Set test result.
    if ( parent.i_isTestMode ) {
	    // Set up test data object.
	    var testResult_ = new Object();

      // Get test data according to current list.
      switch( g_list ) {
        case s_listType.host_  : if ( resultHost_ )   { testResult_ = resultHost_; } break;
        case s_listType.hostIP_: if ( resultHostIP_ ) { testResult_ = resultHostIP_; } break;
        default: break;
      }//switch g_list
    }//is parent.i_isTestMode

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + g_list + " " + s_message.list_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'listName',  value: g_list } );
    arrayParams_.push( { param: 'cat',       value: g_cat } );
    arrayParams_.push( { param: 'rowOffset', value: 0 } );
    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
    stc_sendService( parent, loadMessage_, s_action.mgmtList_, arrayParams_, returnList, testResult_, $( "#_tooltip" ), null );
  }//getList

  // RETURN LIST.
  function returnList( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var resultList_ = null;
		    var listName_   = "";
		    var cat_        = "";

	      // Get result vals.
	      if ( stc_isDefined( data_.resultList ) ) { resultList_ = data_.resultList; }
	      if ( stc_isDefined( data_.listName ) )   { listName_   = data_.listName; }
	      if ( stc_isDefined( data_.cat ) )        { cat_        = data_.cat; }

	      // Handle result.
	      if ( stc_isDefined( resultList_ ) ) {
		      switch( g_list ) {

	          case s_listType.host_:
	            // Create list.
	            if ( listName_ == g_list && cat_ == s_listType.primary_ ) {
	              createListMain( resultList_, $( "#_listHeaderHost" ), $( "#_listHost" ) );
	            }//list valid

					    // Send next service.
					    g_list = s_listType.hostIP_;
					    getList();
	          break;

	          case s_listType.hostIP_:
	            // Create list.
	            if ( listName_ == g_list && cat_ == s_listType.primary_ ) {
	              createListMain( resultList_, $( "#_listHeaderHostIP" ), $( "#_listHostIP" ) );
	            }//list valid
	          break;

	          default: break;

		      }//switch g_list
	      }//resultList_ valid
	    }//status is success
    }//data_ status_ valid
  }//returnList

  // ============================================================================
  // LIST MAIN.
  // ============================================================================

  // CREATE LIST MAIN.
  function createListMain( arrayMaster_, listHeader_, listData_ ) {

	  // INIT.

    // Init list.
    listHeader_.empty();
    listData_.empty();

    // Init list title and show list.
    switch( g_list ) {

      case s_listType.host_:
		    $( "#_titleListHost" ).html( "" );
		    $( "#_divHost" ).css( "visibility", "visible" ); $( "#_divHost" ).css( "display", "block" );
      break;

      case s_listType.hostIP_:
		    $( "#_titleListHostIP" ).html( "" );
		    $( "#_divHostIP" ).css( "visibility", "visible" ); $( "#_divHostIP" ).css( "display", "block" );
      break;

      default: break;
    }//switch g_list

    // Set error flag.
    var error_ = true;

    // LIST.

    // Create list.
    if ( arrayMaster_ && listHeader_ && listData_ ) {

      // HEADER.

      // Build header row.
      var rowHeader_ = null;
      switch( g_list ) {
        case s_listType.host_  : rowHeader_ = buildHeaderHost();   break;
        case s_listType.hostIP_: rowHeader_ = buildHeaderHostIP(); break;
        default: break;
      }//switch g_list
      if ( rowHeader_ ) { listHeader_.append( rowHeader_ ); }

      // DATA.

      // Create data rows.
      if ( arrayMaster_.length > 0 ) {
        // Create rows.
        var length_ = arrayMaster_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Get ID.
          var id_ = "";
		      switch( g_list ) {

		        case s_listType.host_:
		          if ( stc_isDefined( arrayMaster_[i].hostAddress ) ) { id_ = arrayMaster_[i].hostAddress; }
		        break;

		        case s_listType.hostIP_:
		          if ( stc_isDefined( arrayMaster_[i].host ) )        { id_ = arrayMaster_[i].host; }
		        break;

		        default: break;
		      }//switch g_list

		      // Set row ID.
		      var rowID_ = stc_getIdentifier( "", s_strRow + "_" + g_list + "_" + i );

		      // Build data row.
		      var row_ = null;
		      switch( g_list ) {
	          case s_listType.host_  : row_ = buildDataHost( id_, rowID_, arrayMaster_[i] );   break;
	          case s_listType.hostIP_: row_ = buildDataHostIP( id_, rowID_, arrayMaster_[i] ); break;
	          default: break;
		      }//switch g_list
		      if ( row_ ) { listData_.append( row_ ); }
        }//for each entry

        // EVENTS.
        // Assign event handlers to elements in list.
	      switch( g_list ) {
	        case s_listType.host_:
	          $( ".clickForDrillDown" ).on ( "click", function( event ) { clickDrillDown( s_listType.host_, $( this ) ); });
	        break;
	        default: break;
	      }//switch g_list

        // Set error to false.
        error_ = false;
      }//arrayMaster_ not empty
    }//parameters valid

    // NO DATA.
    // If no data, add no-data row.
    if ( error_ ) {
      listData_.empty();
      listData_.append( "<tr class='row'>" + "<td style='text-decoration: none;'>" + s_message.noMoreRows_ + "</td>" + "<tr>" );
    }//error_ true
  }//createListMain

  // ============================================================================
  // DRILLDOWN SERVICE.
  // ============================================================================

  // SETUP LIST REQUEST DRILLDOWN.
  function setupListRequestDD() {
    // Hide lists.
    $( "#_divDD0" ).css( "visibility", "hidden" ); $( "#_divDD0" ).css( "display", "none" );
    $( "#_divDD1" ).css( "visibility", "hidden" ); $( "#_divDD1" ).css( "display", "none" );
  }//setupListRequestDD

  // GET LIST DRILLDOWN.
  function getListDD() {
    // TEST Set test result.
    if ( parent.i_isTestMode ) {
	    resultDrillDownHost_.ID = g_hostSelected;
    }//is parent.i_isTestMode

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + g_list + " " + g_hostSelected + " " + s_message.listDrilldown_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'queryName', value: s_action.drillDown_ } );
    arrayParams_.push( { param: 'listName',  value: g_list } );
    arrayParams_.push( { param: 'cat',       value: g_cat } );
    arrayParams_.push( { param: 'ID',        value: g_hostSelected } );
    arrayParams_.push( { param: 'rowOffset', value: 0 } );
    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
    stc_sendService( parent, loadMessage_, s_action.mgmtDrillDown_, arrayParams_, returnListDD, resultDrillDownHost_, $( "#_tooltip" ), null );
  }//getListDD

  // RETURN LIST DRILLDOWN.
  function returnListDD( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var listName_    = "";
		    var cat_         = "";
		    var ID_          = "";
		    var process_     = null;
		    var usage_       = null;

	      // Get result vals.
	      if ( stc_isDefined( data_.listName ) )    { listName_    = data_.listName; }
	      if ( stc_isDefined( data_.cat ) )         { cat_         = data_.cat; }
	      if ( stc_isDefined( data_.ID ) )          { ID_          = data_.ID; }
	      if ( stc_isDefined( data_.process ) )     { process_     = data_.process; }
	      if ( stc_isDefined( data_.usage ) )       { usage_       = data_.usage; }

	      // Handle result.
	      if ( listName_ == g_list &&
	           cat_ == g_cat &&
	           ID_ == g_hostSelected ) {

	        // Create lists.
	        if ( stc_isDefined( process_ ) ) {
	          createListDD( process_, s_listType.processDD_, $( "#_listHeaderDD0" ), $( "#_listDD0" ) );
	        }//process_ valid

	        if ( stc_isDefined( usage_ ) ) {
	          createListDD( usage_, s_listType.usageDD_, $( "#_listHeaderDD1" ), $( "#_listDD1" ) );
	        }//usage_ valid
	      }//listName_ cat_ ID_ valid
	    }//status is success
    }//data_ status_ valid
  }//returnListDD

  // ============================================================================
  // DRILLDOWN.
  // ============================================================================

  // CREATE LIST DRILLDOWN.
  function createListDD( arrayMaster_, list_, listHeader_, listData_ ) {
    if ( list_ ) {

	    // INIT.

	    // Init list.
	    listHeader_.empty();
	    listData_.empty();

	    // Init list title and show list.
	    switch( list_ ) {

	      case s_listType.processDD_:
			    $( "#titleListDD0" ).html( "" );
			    $( "#_divDD0" ).css( "visibility", "visible" ); $( "#_divDD0" ).css( "display", "block" );
	      break;

	      case s_listType.usageDD_:
			    $( "#titleListDD1" ).html( "" );
			    $( "#_divDD1" ).css( "visibility", "visible" ); $( "#_divDD1" ).css( "display", "block" );
	      break;

	      default: break;
	    }//switch list_

	    // Set error flag.
	    var error_ = true;

	    // LIST.

	    // Create list.
	    if ( arrayMaster_ && listHeader_ && listData_ ) {

	      // HEADER.

	      // Build header row.
	      var rowHeader_ = null;
	      switch( list_ ) {
          case s_listType.processDD_: rowHeader_ = buildHeaderProcesses(); break;
          case s_listType.usageDD_  : rowHeader_ = buildHeaderUsage();     break;
          default: break;
	      }//switch list_
	      if ( rowHeader_ ) { listHeader_.append( rowHeader_ ); }

	      // DATA.

	      // Create data rows.
	      if ( arrayMaster_.length > 0 ) {
	        // Create rows.
	        var length_ = arrayMaster_.length;
	        for ( var i = 0; i < length_; i++ ) {
	          // Get ID.
	          var id_ = "";
			      switch( list_ ) {

			        case s_listType.processDD_:
			          if ( stc_isDefined( arrayMaster_[i].hostAddress ) ) { id_ = arrayMaster_[i].hostAddress; }
			        break;

			        case s_listType.usageDD_:
			          if ( stc_isDefined( arrayMaster_[i].path ) )        { id_ = arrayMaster_[i].path; }
			        break;

			        default: break;
			      }//switch list_

			      // Set row ID.
			      var rowID_ = stc_getIdentifier( "", s_strRow + "_" + list_ + "_" + i );

			      // Build data row.
			      var row_ = null;
			      switch( list_ ) {
		          case s_listType.processDD_: row_ = buildDataProcesses( id_, rowID_, arrayMaster_[i] ); break;
		          case s_listType.usageDD_  : row_ = buildDataUsage( id_, rowID_, arrayMaster_[i] );     break;
		          default: break;
			      }//switch list_
			      if ( row_ ) { listData_.append( row_ ); }
	        }//for each entry

	        // Set error to false.
	        error_ = false;
	      }//arrayMaster_ not empty
	    }//parameters valid

	    // NO DATA.
	    // If no data, add no-data row.
	    if ( error_ ) {
	      listData_.empty();
	      listData_.append( "<tr class='row'>" + "<td style='text-decoration: none;'>" + s_message.noMoreRows_ + "</td>" + "<tr>" );
	    }//error_ true
    }//list_ valid
  }//createListDD

  // ============================================================================
  // LIST EVENTS.
  // ============================================================================

  // CLICK DRILLDOWN.
  function clickDrillDown( list_, cell_ ) {
	  if ( stc_isDefined( list_ ) && stc_isDefined( cell_ ) ) {
      // Get ID.
      var id_ = cell_.parent().attr( "name" );

      // Set vals, toggle view, then send service request.
      if ( stc_isDefined( id_ ) ) {
        // Set list type.
		    g_list = list_;

		    // Store selected/service vals.
		    g_hostSelected = id_;

        // Toggle to drilldown view.
        toggleViewContents( g_viewVals.drillDown_ );

        // Send request for drilldown list service.
        setupListRequestDD(); getListDD();
      }//id_ valid
	  }//list_ cell_ valid
  }//clickDrillDown

  // ============================================================================
  // LIST HOST DETAILS.
  // Note: lists are 940 pixels wide.
  // ============================================================================

  // ============================================================================
  // LIST HOST.
  // ============================================================================

  // BUILD HEADER HOST.
  function buildHeaderHost() {
    // Set list title.
    $( "#_titleListHost" ).html( g_uiStr.titleListHosts_ );
    $( "#_titleListHost" ).attr( "title", g_uiStr.tipHostStatus_ );

    // Set td widths.
    var w0_ = "100px"; var w1_ = "100px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Host address'><div>Host address</div></td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Status'      ><div>Status</div>      </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderHost

  // BUILD DATA HOST.
  function buildDataHost( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
      var w0_ = "100px"; var w1_ = "100px";

      // Init display values.
      var hostAddress_ = s_message.notFound_;
      var status_      = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.hostAddress ) ) { hostAddress_ = entry_.hostAddress; }
      if ( stc_isDefined( entry_.status ) )      { status_      = entry_.status; }

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w1_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'>" +
                           "<a href='#'>" + hostAddress_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataHost'>" +
             cellClickdown_ +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataHost

  // BUILD HEADER HOST IP.
  function buildHeaderHostIP() {
    // Set list title.
    $( "#_titleListHostIP" ).html( g_uiStr.titleListHostsIP_ );

    // Set td widths.
    var w0_ = "100px"; var w1_ = "100px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Host'        ><div>Host</div>        </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Host address'><div>Host address</div></td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderHostIP

  // BUILD DATA HOST IP.
  function buildDataHostIP( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "100px"; var w1_ = "100px";

      // Init display values.
      var host_        = s_message.notFound_;
      var hostAddress_ = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.host ) )        { host_        = entry_.host; }
      if ( stc_isDefined( entry_.hostAddress ) ) { hostAddress_ = entry_.hostAddress; }

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataHostIP'>" +
             "<td class='lsCell' width='" + w0_ + "' style='min-width: " + w0_ + "; text-decoration: none;'>" + host_ + "</td>" +
             "<td class='lsCell' width='" + w1_ + "' style='min-width: " + w1_ + ";'                       >" + hostAddress_ + "</td>" +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataHostIP

  // ============================================================================
  // DRILLDOWN.
  // ============================================================================

  // BUILD HEADER PROCESSES.
  function buildHeaderProcesses() {
    // Set list title.
    $( "#titleListDD0" ).html( g_uiStr.titleListProcesses_ );

    // Set td widths.
    var w0_ = "75px"; var w1_ = "35px"; var w2_  = "70px"; var w3_ = "75px";
    var w4_ = "35px"; var w5_ = "65px"; var w6_  = "35px"; var w7_ = "35px";
    var w8_ = "35px"; var w9_ = "50px"; var w10_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Host address'><div>Host address</div></td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='PID'         ><div>PID</div>         </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Process name'><div>Process name</div></td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Version'     ><div>Version</div>     </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Uptime'      ><div>Uptime</div>      </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Memory'      ><div>Memory</div>      </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Threads'     ><div>Threads</div>     </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Log warning' ><div>Log warning</div> </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Log error'   ><div>Log error</div>   </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Last update' ><div>Last update</div> </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Status'      ><div>Status</div>      </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderProcesses

  // BUILD DATA PROCESSES.
  function buildDataProcesses( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "75px"; var w1_ = "35px"; var w2_  = "70px"; var w3_ = "75px";
	    var w4_ = "35px"; var w5_ = "65px"; var w6_  = "35px"; var w7_ = "35px";
	    var w8_ = "35px"; var w9_ = "50px"; var w10_ = "55px";

      // Init display values.
      var hostAddress_   = s_message.notFound_;
      var PID_           = s_message.notFound_;
      var processName_   = s_message.notFound_;
      var version_       = s_message.notFound_;
      var uptime_        = s_message.notFound_;
      var memoryPercent_ = s_message.notFound_;
      var mb_            = s_message.notFound_;
      var threads_       = s_message.notFound_;
      var logWarning_    = s_message.notFound_;
      var logError_      = s_message.notFound_;
      var updateLast_    = s_message.notFound_;
      var status_        = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.hostAddress ) )   { hostAddress_   = entry_.hostAddress; }
      if ( stc_isDefined( entry_.PID ) )           { PID_           = entry_.PID; }
      if ( stc_isDefined( entry_.processName ) )   { processName_   = entry_.processName; }
      if ( stc_isDefined( entry_.version ) )       { version_       = entry_.version; }
      if ( stc_isDefined( entry_.uptime ) )        { uptime_        = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) ) { memoryPercent_ = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )            { mb_            = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )       { threads_       = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.logWarning ) )    { logWarning_    = stc_addCommas( parseInt( entry_.logWarning ) ); }
      if ( stc_isDefined( entry_.logError ) )      { logError_      = stc_addCommas( parseInt( entry_.logError ) ); }
      if ( stc_isDefined( entry_.updateLast ) )    { updateLast_    = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )        { status_        = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w5_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w10_, status_ );

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataDDProcess'>" +
             "<td class='lsCell' width='" + w0_  + "' style='min-width: " + w0_  + "; text-decoration: none;'>" + hostAddress_ + "</td>" +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                       >" + PID_         + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                       >" + processName_ + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                       >" + version_     + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                       >" + uptime_      + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;'    >" + threads_     + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + "; text-align: right;'    >" + logWarning_  + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;'    >" + logError_    + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + ";'                       >" + updateLast_  + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataProcesses

  // BUILD HEADER USAGE.
  function buildHeaderUsage() {
    // Set list title.
    $( "#titleListDD1" ).html( g_uiStr.titleListDiskUsage_ );

    // Set td widths.
    var w0_ = "85px"; var w1_ = "85px"; var w2_ = "85px"; var w3_ = "85px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_ + "' style='min-width: " + w0_ + ";' title='Path'     ><div>Path</div>     </td>" +
    "<td width='" + w1_ + "' style='min-width: " + w1_ + ";' title='Total'    ><div>Total</div>    </td>" +
    "<td width='" + w2_ + "' style='min-width: " + w2_ + ";' title='Available'><div>Available</div></td>" +
    "<td width='" + w3_ + "' style='min-width: " + w3_ + ";' title='Used %'   ><div>Used %</div>   </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderUsage

  // BUILD DATA USAGE.
  function buildDataUsage( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "85px"; var w1_ = "85px"; var w2_ = "85px"; var w3_ = "85px";

      // Init display values.
      var path_        = s_message.notFound_;
      var total_       = s_message.notFound_;
      var available_   = s_message.notFound_;
      var usedPercent_ = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.path ) )        { path_        = entry_.path; }
      if ( stc_isDefined( entry_.total ) )       { total_       = stc_addCommas( parseInt( entry_.total ) ); }
      if ( stc_isDefined( entry_.available ) )   { available_   = stc_addCommas( parseInt( entry_.available ) ); }
      if ( stc_isDefined( entry_.usedPercent ) ) { usedPercent_ = entry_.usedPercent; }

      // Create used percent cell.
      var cellUsage_ = stc_createUsageCell( w3_, usedPercent_ );

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataDDUsage'>" +
             "<td class='lsCell' width='" + w0_ + "' style='min-width: " + w0_ + "; text-decoration: none;'>" + path_        + "</td>" +
             "<td class='lsCell' width='" + w1_ + "' style='min-width: " + w1_ + "; text-align: right;'    >" + total_       + "</td>" +
             "<td class='lsCell' width='" + w2_ + "' style='min-width: " + w2_ + "; text-align: right;'    >" + available_   + "</td>" +
             cellUsage_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataUsage

