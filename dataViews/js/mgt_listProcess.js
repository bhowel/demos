
  // ============================================================================
  // LIST PROCESS.
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
  var g_list        = s_listType.process_;
  var g_cat         = s_listType.primary_;
  var g_messageType = "";

  // Services vals.
  var g_svcVals = {
    nbrRowsReq_ : 16 };

  // Selected objects.
  var g_arrayProcess    = new Array();
  var g_processSelected = "";

  // Text.
  var g_charLimit = {
    main_   : 19,
    header_ : 70  };

  // Text strings.
  var g_uiStr = {
    titleListHostsProcesses_: "Hosts & Processes",
    tipHostStatus_          : "Status for all hosts that are running any processes.",
    successMessageResult_   : "Message result is",
    erSelectMessageType_    : "Please select a message type."
  };

  // ============================================================================
  // LOAD/INIT.
  // ============================================================================

  // LOAD PAGE.
  function loadPage() {
	  // Load module/view.
	  parent.loadModule( s_module._2_, s_module2._3_ );

    // Init page.
    initPage();

    // Get list.
    setupListRequest( s_listType.process_ );
    getList();
  }//loadPage

  // INIT PAGE.
  function initPage() {
    // Event handlers.

    // List view controls.
    $( "#_btnRefresh" ).on         ( "click", function( event ) { parent.populateLog( s_message.refreshMain_, s_svcVals.info_ ); setupListRequest( s_listType.process_ ); getList(); });

    // List controls.
    $( "#_btnSelAllProcess" ).on   ( "click", function( event ) { toggleSelectAllRows( true ); });
    $( "#_btnUnselAllProcess" ).on ( "click", function( event ) { toggleSelectAllRows( false ); });
    $( "#_btnSendProcess" ).on     ( "click", function( event ) { handleMessageRequest( $( "#_dropdownMsgTypeProcess" ).val() ); });

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
  }//initPage

  // ============================================================================
  // LIST MAIN SERVICE.
  // ============================================================================

  // SETUP LIST REQUEST.
  function setupListRequest( type_ ) {
    // Hide lists.
    $( "#_divProcess" ).css( "visibility", "hidden" );
    $( "#_divProcess" ).css( "display", "none" );

    // Null vars for currently-selected object.
    g_arrayProcess = new Array();

    // Store list type.
    g_list = "";
    if ( stc_isDefined( type_ ) ) {
      g_list = type_;
    }//type_ valid
  }//setupListRequest

  // GET LIST.
  function getList() {
    // Send service.
    var loadMessage_ = s_message.loading_ + " " + g_list + " " + s_message.list_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'queryName', value: s_action.mgmtList_ } );
    arrayParams_.push( { param: 'listName',  value: g_list } );
    arrayParams_.push( { param: 'cat',       value: g_cat } );
    arrayParams_.push( { param: 'rowOffset', value: 0 } );
    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
    stc_sendService( parent, loadMessage_, s_action.mgmtProcess_, arrayParams_, returnList, resultProcess_, $( "#_tooltip" ), null );
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
          createListMain( resultList_, $( "#_listHeaderProcess" ), $( "#_listProcess" ) );
        }//list valid
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

    // Init list title.
    $( "#_titleListProcess" ).html( "" );
    $( "#_divProcess" ).css( "visibility", "visible" );

    // Show list.
    $( "#_divProcess" ).css( "display", "block" );

    // Set error flag.
    var error_ = true;

    // LIST.

    // Create list.
    if ( arrayMaster_ && listHeader_ && listData_ ) {

      // HEADER.

      // Build header row.
      var rowHeader_ = buildHeaderProcess();
      if ( rowHeader_ ) { listHeader_.append( rowHeader_ ); }

      // DATA.

      // Create data rows.
      if ( arrayMaster_.length > 0 ) {
        // Create rows.
        var length_ = arrayMaster_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Get ID.
          var id_ = "";
          if ( stc_isDefined( arrayMaster_[i].hostAddress ) ) { id_ = arrayMaster_[i].hostAddress; }

		      // Set row ID.
		      var rowID_ = stc_getIdentifier( "", s_strRow + "_" + g_list + "_" + i );

		      // Build data row.
		      var row_ = row_ = buildDataProcess( id_, rowID_, arrayMaster_[i] );
		      if ( row_ ) { listData_.append( row_ ); }
        }//for each entry

        // EVENTS.
        // Assign event handlers to elements in list.
        $( ".rowDataProcess" ).on ( "click", function( event )     { clickRow( $( this ) ); });
        $( ".rowDataProcess" ).on ( "mouseover", function( event ) { mouseoverRow( $( this ) ); });
        $( ".rowDataProcess" ).on ( "mouseout", function( event )  { mouseoutRow( $( this ) ); });

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
  // LIST EVENTS.
  // ============================================================================

  // HIGHLIGHT ROW.
  function highlightRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.css( "background-color", s_gray9 );
	  }//row_ valid
  }//highlightRow

  // HIGHLIGHT MOUSEOVER ROW.
  function highlightMouseoverRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.css( "background-color", s_grayB );
	  }//row_ valid
  }//highlightMouseoverRow

  // UNHIGHLIGHT ROW.
  function unhighlightRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.css( "background-color", s_grayD );
	  }//row_ valid
  }//unhighlightRow

  // SELECT ROW.
  function selectRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.attr( "data-selected", "true" );
	  }//row_ valid
  }//selectRow

  // UNSELECT ROW.
  function unselectRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      row_.attr( "data-selected", "false" );
	  }//row_ valid
  }//unselectRow

  // MOUSEOVER ROW.
  function mouseoverRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      highlightMouseoverRow( row_ );
	  }//row_ valid
  }//mouseoverRow

  // MOUSEOUT ROW.
  function mouseoutRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
	    isSel_ = row_.attr( "data-selected" );
	    if ( stc_isDefined( isSel_ ) ) {
		    if ( isSel_ == "true" ) {
		      highlightRow( row_ );
		    } else {
		      unhighlightRow( row_ );
		    }//isSel_ false
	    }//isSel_ valid
	  }//row_ valid
  }//mouseoutRow

  // CLICK ROW.
  function clickRow( row_ ) {
	  if ( stc_isDefined( row_ ) ) {
      // Get ID and selected row ID.
      var id_    = row_.attr( "name" );
      var rowID_ = row_.attr( "id" );

      // Handle this row.
      if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) ) {
        // Get row's selected status.
        var isSel_ = row_.attr( "data-selected" );
			  if ( stc_isDefined( isSel_ ) ) {
			    // Select/unselect row.
			    if ( isSel_ == "true" ) {
			      // Set row to unselected state.
			      unhighlightRow( row_ );
			      unselectRow( row_ );
			    } else {
		        // Set row to selected state.
		        highlightRow( row_ );
		        selectRow( row_ );
			    }//isSel_ false

			    // Select/unselect ID.
			    if ( isSel_ == "true" ) {
			      // Remove ID from array.
			      var arrayID_ = $.merge( [], g_arrayProcess );
			      g_arrayProcess = new Array();
			      g_arrayProcess = stc_removeFromArray( g_arrayProcess, arrayID_, id_ );
			    } else {
		        // Store ID.
				    g_arrayProcess.push( id_ );
			    }//isSel_ false
			  }//isSel_ valid
      }//id_ rowID_ valid
	  }//row_ valid
  }//clickRow

  // TOGGLE SELECT ALL ROWS.
  // Select/unselect all rows in selected list.
  // To do this, we insert/delete IDs into/from selected ID array,
  // and set all rows to selected/unselected state.
  function toggleSelectAllRows( select_ ) {
    if ( select_ ) {
      g_arrayProcess = new Array();
	    $( "table#_listProcess > tbody > tr" ).each( function() {
	      if ( stc_isDefined( $( this ).attr( "id" ) ) ) {
	        g_arrayProcess.push( $( this ).attr( "name" ) );
	      }//id valid
	    });
	    highlightRow( $( ".rowDataProcess" ) ); selectRow( $( ".rowDataProcess" ) );
    } else {
      g_arrayProcess = new Array();
      unhighlightRow( $( ".rowDataProcess" ) ); unselectRow( $( ".rowDataProcess" ) );
    }//select_ false
  }//toggleSelectAllRows

  // ============================================================================
  // MESSAGE SERVICE.
  // ============================================================================

  // HANDLE MESSAGE REQUEST.
  function handleMessageRequest( messageType_ ) {
    // Init stored parameters.
    g_messageType = ""

	  // Check if service parameters are valid.
	  var message_ = "";
	  var error_   = false;
	  if ( !stc_isDefined( messageType_ ) ) {
      message_ = g_uiStr.erSelectMessageType_ + " ";
      error_   = true;
	  }//messageType_ not valid
	  if ( !stc_isDefined( g_arrayProcess ) ) {
      message_ = message_ + s_message.erSelectRows_ + " ";
      error_   = true;
	  }//g_arrayProcess not valid
	  if ( stc_isDefined( g_arrayProcess ) && g_arrayProcess.length == 0 ) {
      message_ = message_ + s_message.erSelectRows_ + " ";
      error_   = true;
	  }//g_arrayProcess valid and empty

	  // If any parameter not valid, show error.
	  // If all parameters valid, store parameters and send service request.
	  if ( error_ ) {
      // Populate message log.
      parent.populateLog( message_, s_svcVals.error_ );
	  } else {
	    // Store parameters.
      g_messageType= messageType_;

			// Confirm service request and send.
			var yes_ = confirm( s_message.confirmRequest_ + " " + messageType_ + "." );
			if ( yes_ ) {
			  // Send service request.
			  getMessage();
			}//yes_ true
	  }//yes_ false
  }//handleMessageRequest

  // GET MESSAGE.
  function getMessage() {
    if ( stc_isDefined( g_messageType ) && stc_isDefined( g_arrayProcess ) ) {
      if ( g_messageType != "" && g_arrayProcess.length > 0 ) {
	      // Send service.
		    var loadMessage_ = s_message.send0_ + " " + g_messageType + " " + s_message.send1_ + " " + g_list + "...";
		    var arrayParams_ = new Array();
		    arrayParams_.push( { param: 'queryName',    value: s_action.message_ } );
		    arrayParams_.push( { param: 'messageType',  value: g_messageType } );
		    arrayParams_.push( { param: 'arrayMessage', value: g_arrayProcess } );
		    stc_sendService( parent, loadMessage_, s_action.mgmtMessage_, arrayParams_, returnMessage, resultMessage_, $( "#_tooltip" ), null );
      }//parameters not empty
    }//parameters valid
  }//getMessage

  // RETURN MESSAGE.
  function returnMessage( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    if ( stc_isDefined( data_.message ) ) {
		      // Populate message log.
		      parent.populateLog( g_uiStr.successMessageResult_ + " " + data_.message + " for " + g_messageType + " on " + g_list + ".", s_svcVals.success_ );

	        // Do setup and send refresh service.
		      setupListRequest( g_list );
		      getList();
		    }//message valid
	    }//status is success
    }//data_ status_ valid
  }//returnMessage

  // ============================================================================
  // LIST PROCESS DETAILS.
  // Note: lists are 940 pixels wide.
  // ============================================================================

  // ============================================================================
  // LIST PROCESS.
  // ============================================================================

  // BUILD HEADER PROCESS.
  function buildHeaderProcess() {
    // Set list title.
    $( "#_titleListProcess" ).html( g_uiStr.titleListHostsProcesses_ );
    $( "#_titleListProcess" ).attr( "title", g_uiStr.tipHostStatus_ );

    // Set td widths.
    var w0_ = "85px"; var w1_ = "35px"; var w2_  = "70px"; var w3_ = "75px";
    var w4_ = "35px"; var w5_ = "55px"; var w6_  = "35px"; var w7_ = "35px";
    var w8_ = "35px"; var w9_ = "50px"; var w10_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Host address'><div>Host address</td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='PID'         ><div>PID         </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Process name'><div>Process name</td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Version'     ><div>Version     </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Uptime'      ><div>Uptime      </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Memory'      ><div>Memory      </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Threads'     ><div>Threads     </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Log warning' ><div>Log warning </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Log error'   ><div>Log error   </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Last update' ><div>Last update </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Status'      ><div>Status      </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderProcess

  // BUILD DATA PROCESS.
  function buildDataProcess( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "85px"; var w1_ = "35px"; var w2_  = "70px"; var w3_ = "75px";
	    var w4_ = "35px"; var w5_ = "55px"; var w6_  = "35px"; var w7_ = "35px";
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

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w10_, status_ );

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w5_, memoryPercent_, mb_ );

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataProcess' data-selected='false'>" +
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
  }//buildDataProcess







