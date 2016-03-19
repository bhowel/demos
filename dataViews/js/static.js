
  // ============================================================================
  // STATIC - COMMON VARS AND FUNCTIONS.
  // Uses prefix s_ for vars, stc_ for functions.
  // ============================================================================

  // ============================================================================
  // STATIC VARS.
  // ============================================================================

  // Modules strings.
  var s_module = {
    login_: "login",
    setup_: "setup",
    _0_   : "stats",
    _1_   : "analyze",
    _2_   : "manage",
    _3_   : "preferences" };

  // Module/views strings: Stats.
  var s_module0 = {
    _0_: "heatMap",
    _1_: "listHeat",
    _2_: "schemaWheel" };

  // Module/views strings: Analyze.
  var s_module1 = {
    _0_: "recommendations",
    _1_: "shardAnalysis",
    _2_: "streamAnalysis" };

  // Module/views strings: Manage.
  var s_module2 = {
    _0_: "listAgent",
    _1_: "listClient",
    _2_: "listHost",
    _3_: "listProcess" };

  // Services strings.
  var s_parentRef       = null;
  var s_serviceCallback = null;
  var s_errorCallback   = null;
  var s_tooltipRef      = null;

  var s_action = {
    login_                   : "login",
    setup_                   : "statsSetup",
    basicInfo_               : "basicInfo",
    message_                 : "message",
    drillDown_               : "drillDown",
    treeBuild_               : "treeBuild",
    treeUpdate_              : "treeUpdate",
    statsTable_              : "statsTableSummaryList",
    statsQuery_              : "statsQuerySummaryList",
    statsStats_              : "statsQuery",
    statsTableSummary_       : "tableSummaryList",
    statsQuerySummary_       : "querySummaryList",
    mgmtList_                : "mgmtList",
    mgmtAgent_               : "mgmtAgent",
    mgmtClient_              : "mgmtClient",
    mgmtHost_                : "mgmtHost",
    mgmtProcess_             : "mgmtProcess",
    mgmtDrillDown_           : "DrillDown",
    mgmtStats_               : "mgmtStats",
    mgmtMessage_             : "mgmtMessage" };

  var s_queryType = {
    all_   : "ALL",
    select_: "SELECT",
    insert_: "INSERT",
    update_: "UPDATE",
    delete_: "DELETE",
    other_ : "OTHER" };

  var s_statType = {
    all_                  : "frequencyAll",
    table_                : "frequencyByTable",
    query_                : "frequencyByQuery",
    queryAllSelect_       : "frequencyByTableBySelect",
    queryAllInsert_       : "frequencyByTableByInsert",
    queryAllUpdate_       : "frequencyByTableByUpdate",
    queryAllDelete_       : "frequencyByTableByDelete",
    queryAllOther_        : "frequencyByTableByOther",
    agent_                : "agent",
    client_               : "client",
    agentMinLatency_      : "agentMinLatency",
    agentMaxLatency_      : "agentMaxLatency",
    agentAvgLatency_      : "agentAvgLatency",
    agentThroughput_      : "agentThroughput",
    replicationMinLatency_: "replicationMinLatency",
    replicationMaxLatency_: "replicationMaxLatency",
    replicationAvgLatency_: "replicationAvgLatency",
    replicationThroughput_: "replicationThroughput",
    total_                : "total",
    globalRead_           : "globalRead",
    globalWrite_          : "globalWrite",
    shardRead_            : "shardRead",
    shardWrite_           : "shardWrite",
    parallel_             : "parallel",
    process_              : "process",
    failedQuery_          : "failedQuery",
    random_               : "random" };

  var s_listType = {
    replication_       : "replication",
    chainedReplication_: "chained-replication",
    query_             : "query",
    procedure_         : "procedure",
    stream_            : "stream",
    messageDD_         : "messageDD",
    alertDD_           : "alertDD",
    host_              : "host",
    hostIP_            : "hostIP",
    processDD_         : "processDD",
    usageDD_           : "usageDD",
    process_           : "process",
    client_            : "client",
    connectionDD_      : "connectionDD",
    primary_           : "primary",
    secondary0_        : "secondary0",
    secondary1_        : "secondary1" };

  var s_messageType = {
    stop_                   : "stop",
    start_                  : "start",
    restart_                : "restart",
    stopMonitoringProcess_  : "stop_monitoring_process",
    stopProcess_            : "stop_process",
    startProcess_           : "start_process",
    restartProcess_         : "restart_process",
    pauseReplication_       : "pause_replication",
    resumeReplication_      : "resume_replication",
    snapshotDataLogsFull_   : "snapshot_data_logs_full",
    snapshotLogsFull_       : "snapshot_logs_full",
    snapshotLogsIncremental_: "snapshot_logs_incremental",
    promoteSecondary_       : "promote_secondary" };

  var s_svcVals = {
    domain_         : "EXAMPLE",
    json_           : "json",
    timeout_        : 30000,
    info_           : "info",
    error_          : "error",
    success_        : "success",
    ok_             : "OK",
    failed_         : "FAILED",
    complete_       : "complete",
    selected_       : "selected",
    sec15_          : 15000,
    seconds15_      : "15-SECOND",
    sortByTotalTime_: "totalTime",
    sortByFrequency_: "frequency",
    directionNew_   : "new",
    directionPrev_  : "prev",
    directionNext_  : "next",
    incrementTime_  : "time",
    incrementNumber_: "number" };

  var s_tableType = {
    shardTreeGlobal_    : "GLOBAL_SHARD_TREE",
    shardTreeRelational_: "RELATIONAL_SHARD_TREE",
    shardTreeStatic_    : "STATIC_SHARD_TREE",
    global_             : "GLOBAL",
    child_              : "SHARD_CHILD",
    static_             : "STATIC",
    logOnly_            : "LOG_ONLY",
    nonRelational_      : "NON_RELATIONAL" };

  var s_shardVals = {
    actionShardRead_       : "SHARD_READ",
    actionShardWrite_      : "SHARD_WRITE",
    actionGlobalRead_      : "GLOBAL_READ",
    actionGlobalWrite_     : "GLOBAL_WRITE",
    actionMultiShardUpdate_: "MULTI_SHARD_UPDATE",
    actionParallel_        : "PARALLEL",
    actionError_           : "ERROR",
    actionNone_            : "NONE",
    shardStrategyModulus_  : "modulus",
    shardStrategyStripes_  : "shardingStripes" };

  // Messages.
  var s_message = {
    support_       : "Please contact customer support for assistance.",
    loading_       : "Loading",
    loadPage_      : "Loading page...",
    send0_         : "Sending",
    send1_         : "request for",
    none_          : "none",
    notFound_      : "Not found",
    notAvailable_  : "(not yet available)",
    noDataSelected_: "No data has been selected.",
    noMoreRows_    : "No more rows to show.",
    comingSoon_    : "Coming Soon",
    refreshDetail_ : "Refreshing detail lists.",
    refreshMain_   : "Refreshing main list.",
    list_          : "list...",
    listDrilldown_ : "drilldown lists...",
    index_         : "index",
    confirmRequest_: "Click OK to confirm the request for",
    confirmDelete_ : "Click OK to confirm deleting the selected item.",
    erApplication_ : "There is an error in the application.",
    erSelectRows_  : "Please select one or more rows.",
    erInfo_        : "Requested information has an error.",
    erDefaultNbr_  : "Numbering for default names is disabled. To get a unique name, change the default name.",
    erInput_       : "The highlighted input field(s) have missing or incorrect data. Mouse over the field(s) for more information."
  };

  // Text.
  var s_fontFamily      = "Helvetica, sans-serif";
  var s_fontFamilyFixed = "Courier";

  var s_charLimit = {
    legend_ : 21  };

  // Lines.
  var s_lineCap  = "round";
  var s_lineJoin = "round";

	// Dashed line arrays. dash - gap - dash - gap
	var s_dash0 = [5, 2, 5, 2];
	var s_dash1 = [25, 15, 25, 15];

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

  // Type colors. DO NOT USE ANYWHERE ELSE - use stc_getTypeFill instead.
  var s_colorType = {
    global_       : s_color.bluePurple_,
    root_         : s_color.orange_,
    child_        : s_color.greenLight_,
    static_       : s_color.turquoise_,
    logOnly_      : s_color.blueDark_,
    nonRelational_: s_color.purple_ };
  var s_arrayColorsType = [s_colorType.global_, s_colorType.root_, s_colorType.child_, s_colorType.static_, s_colorType.logOnly_, s_colorType.nonRelational_];

  // Heat colors. DO NOT USE ANYWHERE ELSE - use stc_getTypeFill instead.
  var s_colorHeat = {
    cold_: "#0000DD",
    cool_: "#6600CC",
    warm_: "#CC0099",
    hot_ : "#FF0033"  };

  // Heat names. DO NOT USE ANYWHERE ELSE - use stc_getHeatName instead.
  var s_nameHeat = {
    cold_: "Cold",
    cool_: "Cool",
    warm_: "Warm",
    hot_ : "Hot"  };

  // Heat.
  // Elements with heat below cold_ are too cold to emphasize.
  var s_heatVals = {
    cold_    : 6,
    warm_    : 15,
    hot_     : 20,
    hottest_ : 24 };

  // Thermometer.
  var s_thermometerVals = {
    height_      : 125,
    width_       : 18,
    cornerRadius_: 10,
    bulbRadius_  : 15,
    nbrTicks_    : 23 };

  // Numbers.
  var s_infinity = 1.7976931348623157E+10308;

  // Log.
  var s_logOpen_ = false;

  // ============================================================================
  // TESTING.
  // ============================================================================

  // INIT TEST FIELD.
  function stc_initTestField() {
    $( "#_testField" ).html( "" );
    $( "#_testField" ).css( "visibility", "visible" );
  }//stc_initTestField

  // ============================================================================
  // TOOLTIP.
  // ============================================================================

  // CLEAR TOOLTIP.
  function stc_clearTooltip( tooltip_ ) {
    if ( stc_isDefined( tooltip_ ) ) {
      tooltip_.html( "" );
    }//tooltip_ valid
  }//stc_clearTooltip

  // MOVE TOOLTIP.
  function stc_moveTooltip( tooltip_, x_, y_ ) {
    if ( stc_isDefined( tooltip_ ) ) {
	    tooltip_.css( "left", x_ );
	    tooltip_.css( "top", y_ );
    }//tooltip_ valid
  }//stc_moveTooltip

  // HIDE TOOLTIP.
  function stc_hideTooltip( tooltip_ ) {
    if ( stc_isDefined( tooltip_ ) ) {
	    tooltip_.html( "" );
	    tooltip_.css( "visibility", "hidden" );
    }//tooltip_ valid
  }//stc_hideTooltip

  // SHOW TOOLTIP.
  function stc_showTooltip( tooltip_, text_, height_, w_, useWidth_ ) {
    if ( stc_isDefined( tooltip_ ) ) {
	    // Set text.
	    tooltip_.html( "" );
	    if ( text_ ) { tooltip_.html( text_ ); }

	    // Set height.
	    tooltip_.css( "height", 20 );
	    height_ = parseInt( height_ );
	    if ( stc_isNumber( height_ ) ) { tooltip_.css( "height", height_ ); }

	    // Set width.
	    var width_ = 100;
	    if ( text_ ) { width_ = text_.length * 6; }
	    tooltip_.css( "width", width_ );
	    w_ = parseInt( w_ );
	    if ( useWidth_ && stc_isNumber( w_ ) && w_ > 0 ) {
	      tooltip_.css( "width", w_ );
	    }//useWidth_ w_ valid and w_ gt 0

	    // Show.
	    tooltip_.css( "visibility", "visible" );
    }//tooltip_ valid
  }//stc_showTooltip

  // MOUSE OUT TOOLTIP.
  function stc_mouseOutTooltip( tooltip_, event ) {
    if ( stc_isDefined( tooltip_ ) ) {
      stc_hideTooltip( tooltip_ );
    }//tooltip_ valid
  }//stc_mouseOutTooltip

  // ============================================================================
  // HELP.
  // ============================================================================

  // CLEAR HELP.
  function stc_clearHelp() {
    if ( stc_isDefined( $( "#_textHelp" ) ) ) {
	    $( "#_textHelp" ).html( "");
    }//_textHelp valid
  }//stc_clearHelp

  // CLOSE HELP.
  function stc_closeHelp() {
    if ( stc_isDefined( $( "#_containerHelp" ) ) ) {
	    $( "#_containerHelp" ).css( "visibility", "hidden" );
    }//_containerHelp valid
  }//stc_closeHelp

  // SHOW HELP.
  function stc_showHelp( text_ ) {
	  if ( stc_isDefined( $( "#_containerHelp" ) ) && stc_isDefined( $( "#_textHelp" ) ) ) {
      $( "#_textHelp" ).html( "" );
      if ( stc_isDefined( text_ ) ) {
        $( "#_textHelp" ).html( text_ );
        $( "#_containerHelp" ).css( "visibility", "visible" );
      }//text_ valid
	  }//_containerHelp _textHelp valid
  }//stc_showHelp

  // MOVE HELP.
  function stc_moveHelp( x_, y_ ) {
    if ( stc_isDefined( $( "#_containerHelp" ) ) ) {
      $( "#_containerHelp" ).css( "left", x_ );
      $( "#_containerHelp" ).css( "top", y_ );
    }//_containerHelp valid
  }//stc_moveHelp

  // GET HELP.
  function stc_getHelp( url_ ) {
    $.ajax({
      url          : url_,
      dataType     : "text",
      success: function( data_ ){
        // Replace all new lines with break tag.
        data_ = data_.replace(/\n/g, '<br />');

        // Show help.
        stc_showHelp( data_ );
      },
      error: function(){
        stc_showHelp( s_message.erInfo_ + " " + s_message.support_ );
      }
    });
  }//stc_getHelp

  // ============================================================================
  // LOG.
  // ============================================================================

  // INIT LOG DIALOG.
  function stc_initLogDialog() {
    if ( stc_isDefined( $( "#_textLog" ) ) ) {
	    $( "#_textLog" ).html( "");
    }//_textLog valid
    s_logOpen_ = false;
  }//stc_initLogDialog

  // CLOSE LOG DIALOG.
  function stc_closeLogDialog() {
    if ( stc_isDefined( $( "#_containerLog" ) ) ) {
	    $( "#_containerLog" ).css( "visibility", "hidden" );
	    s_logOpen_ = false;
    }//_containerLog valid
  }//stc_closeLogDialog

  // HIDE LOG DIALOG.
  function stc_hideLogDialog() {
    if ( stc_isDefined( $( "#_containerLog" ) ) ) {
	    if ( !s_logOpen_ ) {
	      $( "#_containerLog" ).css( "visibility", "hidden" );
	    }//s_logOpen_ false
    }//_containerLog valid
  }//stc_hideLogDialog

  // POPULATE LOG DIALOG.
  function stc_populateLogDialog( messageString_ ) {
	  if ( stc_isDefined( $( "#_containerLog" ) ) && stc_isDefined( $( "#_textLog" ) ) ) {
      $( "#_textLog" ).html( "" );
      if ( stc_isDefined( messageString_ ) ) {
        $( "#_textLog" ).html( messageString_ );
      }//messageString_ valid
	  }//_containerLog _textLog valid
  }//stc_populateLogDialog

  // SHOW LOG DIALOG.
  function stc_showLogDialog( setOpen_ ) {
	  if ( stc_isDefined( $( "#_containerLog" ) ) ) {
	    $( "#_containerLog" ).css( "visibility", "visible" );
	    if ( setOpen_ ) { s_logOpen_ = true; }
	  }//_containerLog valid
  }//stc_showLogDialog

  // MOVE LOG DIALOG.
  function stc_moveLogDialog( x_, y_ ) {
    if ( stc_isDefined( $( "#_containerLog" ) ) ) {
	    if ( $( "#_containerLog" ).position().top == 0 && $( "#_containerLog" ).position().left == 0 ) {
	      $( "#_containerLog" ).css( "left", x_ );
	      $( "#_containerLog" ).css( "top", y_ );
	    }//never positioned
    }//_containerLog valid
  }//stc_moveLogDialog

  // SET LOG HEIGHT.
  function stc_setLogHeight( h_ ) {
    if ( stc_isDefined( $( "#_containerLog" ) ) ) {
      $( "#_containerLog" ).css( "height", h_ );
    }//_containerLog valid
  }//stc_setLogHeight

  // ANIMATE LOG ICON.
  function stc_animateLogIcon( icon_, type_ ) {
    if ( stc_isDefined( icon_ )  && stc_isDefined( type_ ) ) {
      switch( type_ ) {
        case s_svcVals.info_:
          icon_.attr( "src", "img/iconMessageInfo.png" );
        break;

        case s_svcVals.success_:
		      icon_.attr( "src", "img/iconMessageSuccess.png" );
		      icon_.animate({ top: "-=10px" }, 500, function() {
		        icon_.animate({ top: "+=10px" }, 500, function() { });
			    });
        break;

        case s_svcVals.error_:
		      icon_.attr( "src", "img/iconMessageError.png" );
		      icon_.animate({ left: "-=10px" }, 500, function() {
		        icon_.animate({ left: "+=10px" }, 500, function() { });
			    });
        break;

        default: break;
      }//switch type_
    }//icon_ type_ valid
  }//stc_animateLogIcon

  // ============================================================================
  // QUERY EDIT.
  // ============================================================================

  // CLEAR QUERY EDIT.
  function stc_clearQueryEdit() {
    if ( stc_isDefined( $( "#_textQueryEdit" ) ) ) {
	    $( "#_textQueryEdit" ).html( "");
    }//_textQueryEdit valid
  }//stc_clearQueryEdit

  // CLOSE QUERY EDIT.
  function stc_closeQueryEdit() {
    if ( stc_isDefined( $( "#_containerQueryEdit" ) ) ) {
	    $( "#_containerQueryEdit" ).css( "visibility", "hidden" );
    }//_containerQueryEdit valid
  }//stc_closeQueryEdit

  // SHOW QUERY EDIT.
  function stc_showQueryEdit( text_ ) {
	  if ( stc_isDefined( $( "#_containerQueryEdit" ) ) && stc_isDefined( $( "#_textQueryEdit" ) ) ) {
      $( "#_textQueryEdit" ).html( "" );
      if ( stc_isDefined( text_ ) ) {
        $( "#_textQueryEdit" ).html( text_ );
        $( "#_containerQueryEdit" ).css( "visibility", "visible" );
      }//text_ valid
	  }//_containerQueryEdit _textQueryEdit valid
  }//stc_showQueryEdit

  // MOVE QUERY EDIT.
  function stc_moveQueryEdit( x_, y_ ) {
    if ( stc_isDefined( $( "#_containerQueryEdit" ) ) ) {
	    if ( $( "#_containerQueryEdit" ).position().top == 0 && $( "#_containerQueryEdit" ).position().left == 0 ) {
	      $( "#_containerQueryEdit" ).css( "left", x_ );
	      $( "#_containerQueryEdit" ).css( "top", y_ );
	    }//never positioned
    }//_containerQueryEdit valid
  }//stc_moveQueryEdit

  // ============================================================================
  // QUERIES.
  // ============================================================================

  // GET QUERY INDEX.
  // Extract query array index.
  function stc_getQueryIndex( queries_, queryID_ ) {
    var queryIndex_;
    if ( queries_ ) {
      var length_ = queries_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( queries_[i].queryId == queryID_ ) {
          queryIndex_ = i;
        }//query IDs match
      }//for each entry
    }//queries_ valid
    return queryIndex_;
  }//stc_getQueryIndex

  // CREATE QUERY OBJECT.
  function stc_createQueryObject( entry_ ) {
    // Create object for return.
    var obj_ = new Object();

    // Set object properties.
    if ( stc_isDefined( entry_ ) ) {
      // Init properties.
      obj_.queryId          = null;
      obj_.queryType        = "";
      obj_.queryText        = "";
      obj_.avgTime          = 0;
      obj_.totalTimePercent = 0;
      obj_.totalTime        = 0;
      obj_.frequency        = 0;
      obj_.heat             = 0;

      // Set properties.
      if ( stc_isDefined( entry_.queryId ) &&
           stc_isDefined( entry_.queryType ) &&
           stc_isDefined( entry_.queryText ) &&
           stc_isDefined( entry_.avgTime ) &&
           stc_isDefined( entry_.totalTimePercent ) &&
           stc_isDefined( entry_.totalTime ) &&
           stc_isDefined( entry_.frequency ) &&
           stc_isDefined( entry_.heat ) ) {

        obj_.queryId          = entry_.queryId;
        obj_.queryType        = entry_.queryType;
        obj_.queryText        = entry_.queryText;
        obj_.avgTime          = parseInt( entry_.avgTime );
        obj_.totalTimePercent = parseInt( entry_.totalTimePercent );
        obj_.totalTime        = parseInt( entry_.totalTime );
        obj_.frequency        = parseInt( entry_.frequency );
        obj_.heat             = parseInt( entry_.heat );
      }//properties valid
    }//entry_ valid

    // Return object.
    return obj_;
  }//stc_createQueryObject

  // ============================================================================
  // LOAD.
  // ============================================================================

  // LOAD IFRAME
  function stc_loadIframe( iframeElement_, newSource_ ) {
    var iframeElement_ = window.document.getElementById( iframeElement_ );
    if ( iframeElement_ ) {
        iframeElement_.src = newSource_;
    }//iframe valid
  }//stc_loadIframe

  // ============================================================================
  // SERVICES.
  // ============================================================================

  // SEND SERVICE.
  function stc_sendService( parentRef_, loadMessage_, action_, arrayParams_, callback_, testResult_, tooltipRef_, errorCallback_ ) {
	  if ( stc_isDefined( parentRef_ ) && stc_isDefined( loadMessage_ ) && stc_isDefined( action_ ) && stc_isDefined( arrayParams_ ) && stc_isDefined( callback_ ) && stc_isDefined( tooltipRef_ ) ) {
	    // Store parent ref.
	    s_parentRef = parentRef_;

	    // Store callbacks.
	    s_serviceCallback = callback_;
	    s_errorCallback   = errorCallback_;

	    // Store tooltip ref.
	    s_tooltipRef = tooltipRef_;

	    // Show load tooltip.
	    stc_moveTooltip( s_tooltipRef, 20, 100 );
	    stc_showTooltip( s_tooltipRef, loadMessage_, 20, 0, false );

	    // Set start info.
	    var p0_ = '/manage/web?action=json&query_id={"action":"';

      // Set request type.
	    var p1_ = '';
      switch( action_ ) {
        case s_action.login_: p1_ = '", "loginRequest":{'; break;
        case s_action.setup_: p1_ = '", "setupRequest":{'; break;
        default             : p1_ = '", "queryRequest":{'; break;
      }//switch action_

	    // Set up processing vars.
      var params_ = "";
      var param_  = "";
      var value_  = "";

      // Add domain name to params.
      if ( action_ != s_action.login_ && action_ != s_action.setup_ ) {
	      if ( arrayParams_.length > 0 ) {
	        param_ = '"' + 'domain' + '":"' + s_parentRef.i_domainName + '",';
	      } else {
	        param_ = '"' + 'domain' + '":"' + s_parentRef.i_domainName + '"';
	      }//arrayParams_ empty
	      params_ = params_ + param_;
      }//action is not login or setup

      // Add passed params.
      var length_ = arrayParams_.length;
      for ( var i = 0; i < length_; i++ ) {
        if ( stc_isDefined( arrayParams_[i].param ) && stc_isDefined( arrayParams_[i].value ) ) {
          if ( i < ( length_ - 1 ) ) {
            param_ = '"' + arrayParams_[i].param + '":"' + arrayParams_[i].value + '",';
          } else {
            param_ = '"' + arrayParams_[i].param + '":"' + arrayParams_[i].value + '"';
          }//i not lt length_ - 1
          params_ = params_ + param_;
        }//param value valid
      }//for each entry

      // Add ending info.
	    var p2_  = '}}';

	    // Concatenate URL.
	    var url_ = p0_ + action_ + p1_ + params_ + p2_;

	    // Send service.
	    if ( !s_parentRef.i_isTestMode ) {
				// Populate/show message log.	
				var message_ = "";
				if ( action_ == s_action.login_ || action_ == s_action.setup_ ) {
					message_ = "Web services are disabled for this demo. To run the application with demo data, click Demo Login.";
				} else {
					message_ = "Web services are disabled for this demo.";
				}//action is not login or setup			
				s_parentRef.populateLog( message_, "" );
				s_parentRef.showLog();

				// Hide load tooltip.
				stc_hideTooltip( s_tooltipRef );
	    } else {
		    var data_         = new Object();
		    data_.status      = s_svcVals.success_;
		    data_.message     = "";
		    data_.queryResult = testResult_;
		    if ( stc_isDefined( data_ ) ) {
		      stc_returnService( data_ );
		    } else {
		      s_parentRef.populateLog( s_message.erInfo_ + " Action: " + action_ + ".", s_svcVals.error_ );
		    }//data_ not valid
	    }//is s_parentRef.i_isTestMode
	  }//params valid
  }//stc_sendService

  // RETURN SERVICE.
  function stc_returnService( data_ ) {
    // Hide load tooltip.
    stc_hideTooltip( s_tooltipRef );

    // Set error flag.
    var error_ = true;

    // Setup result vals.
    var status_  = "";
    var message_ = "";

    // Get status and message vals.
    if ( stc_isDefined( data_.status ) ) { status_  = data_.status; }
    if ( stc_isDefined( data_.message) ) { message_ = data_.message; }

    // If returned data valid, fire callback.
    if ( stc_isDefined( data_.queryResult ) ) {
      // Set error to false.
      error_ = false;

	    // Fire callback.
	    if ( stc_isDefined( s_serviceCallback ) ) {
	      s_serviceCallback( data_.queryResult, status_, message_ );
	    }//s_serviceCallback valid
    } else if ( stc_isDefined( data_.loginResponse ) ) {
      // Set error to false.
      error_ = false;

	    // Fire callback.
	    if ( stc_isDefined( s_serviceCallback ) ) {
	      s_serviceCallback( data_.loginResponse, status_, message_ );
	    }//s_serviceCallback valid
    } else if ( stc_isDefined( data_.setupRequest ) ) {
      // Set error to false.
      error_ = false;

	    // Fire callback.
	    if ( stc_isDefined( s_serviceCallback ) ) {
	      s_serviceCallback( data_.setupRequest, status_, message_ );
	    }//s_serviceCallback valid
    }//data_ valid

    // If data in error, handle error.
    if ( error_ ) {
      var errorMessage_ = s_message.erInfo_;
      if ( message_ != "" ) {
        errorMessage_ = message_;
      }//message_ not empty
      s_parentRef.populateLog( errorMessage_, s_svcVals.error_ );
    }//error_ true
  }//stc_returnService

  // ============================================================================
  // IDENTIFIERS.
  // ============================================================================

  // String identifiers.
  // Preceded by underscore if gets affix.

  // Heat Map: main table.
  var s_strTableUnderlay    = "_underlayMain";
  var s_strTableRect        = "_rectMain";
  var s_strTableLabel       = "_textMain";
  var s_strTableChart       = "_chartMain";
  var s_strTableStat        = "_statMain";
  var s_strTableThermometer = "_thermometerMain";
  var s_strTableOverlay     = "_overlayMain";

  // Heat Map: mini table.
  var s_strTableMini            = "_Mini";
  var s_strTableMiniOverlay     = "_overlayMini";
  var s_strTableMiniRect        = "_rectMini";
  var s_strTableMiniStat        = "_statMini";
  var s_strTableMiniThermometer = "_thermometerMini";

  // Heat Map: selection types.
  var s_strMiniSelect    = "mini";
  var s_strMainSelect    = "main";
  var s_strMarqueeSelect = "marquee";

  // Schema Wheel.
  var s_strPoints         = "points_";
  var s_strMasterPoint    = "_masterPoint";
  var s_strPoint          = "_point";
  var s_strConnectors     = "connectors_";
  var s_strUnderlays      = "underlays_";
  var s_strUnderlay       = "_underlay";
  var s_strUnderlayCircle = "_underlayCircle";
  var s_strLabels         = "labels_";
  var s_strLabelText      = "_labelText";
  var s_strLabelRect      = "_labelRect";
  var s_strDropPoint      = "_dropPoint";

  // Queries.
  var s_strQueryGroup       = "_groupQuery";
  var s_strQuery            = "_query_";
  var s_strQueryRect        = "_rectQuery_";
  var s_strQueryText        = "_textQuery_";
  var s_strQueryThermometer = "_thermometerQuery_";

  // Query sub-identifier strings.
  var s_strQAll    = "_" + s_queryType.all_;
  var s_strQSelect = "_" + s_queryType.select_;
  var s_strQInsert = "_" + s_queryType.insert_;
  var s_strQUpdate = "_" + s_queryType.update_;
  var s_strQDelete = "_" + s_queryType.delete_;
  var s_strQOther  = "_" + s_queryType.other_;

  // Chart.
  var s_strChart0       = "_chart0_";
  var s_strChart1       = "_chart1_";
  var s_strChart        = "chart_";
  var s_strChartRect    = "chartRect_";
  var s_strChartLine    = "chartLine_";
  var s_strChartHLabels = "chartHLabels_";
  var s_strChartVLabels = "chartVLabels_";
  var s_strVLabelsLeft  = "left_";
  var s_strVLabelsRight = "right_";
  var s_strLegend       = "legend_";

  // Thermometer.
  var s_strThermometer            = "thermometer_";
  var s_strThermometerWedgeBottom = "wedgeBottomRed_";
  var s_strThermometerWedgeTop    = "wedgeTopRed_";
  var s_strThermometerBulb        = "bulbRed_";
  var s_strThermometerRect        = "rectRed_";
  var s_strThermometerHotCircle   = "hotCircleRed_";

  // Icons.
  var s_strIcon      = "icon_";
  var s_strIconOpen  = "open_";
  var s_strIconClose = "close_";
  var s_strIconLoad  = "load_";

  // Interface elements.
  var s_strCircleLoad     = "circleLoad_";
  var s_strGroupGlobal    = "groupGlobal_";
  var s_strMarquee        = "marquee_";
  var s_strHeatIndicator  = "heatIndicator_";
  var s_strTree           = "_tree_";
  var s_strAll            = "all_";
  var s_strRow            = "_row";
  var s_strCell           = "_cell";
  var s_strArrow          = "_arrow";
  var s_strAnimated       = "_animated";
  var s_strImage          = "_image";
  var s_strImageToggle    = "_imageToggle";
  var s_strImageHeat      = "_imageHeat";
  var s_strImageUpdate    = "_imageUpdate";
  var s_strStream         = "_stream";
  var s_strInput          = "_input";
  var s_strCheckbox       = "_checkbox";
  var s_strListItem       = "_listItem";
  var s_strDomainName     = "d_";
  var s_strViewName       = "v_";
  var s_strStaticRoot     = "st_";
  var s_strRelationalRoot = "rt_";

  // Timeline.
  var s_strTLRectYesterday = "rectYesterday_";
  var s_strTLRectToday     = "rectToday_";
  var s_strTLLast12Hours   = "last12Hours_";
  var s_strTLLast8Hours    = "last8Hours_";
  var s_strTLLast3Hours    = "last3Hours_";
  var s_strTLLast50Minutes = "last50Minutes_";
  var s_strTLLast10Minutes = "last10Minutes_";
  var s_strTLDaybreak      = "daybreak_";
  var s_strTLTextYesterday = "textYesterday_";
  var s_strTLTextToday     = "textToday_";

  // Timeline affix strings.
  var s_strDay             = "day";
  var s_strLabel           = "label";
  var s_strTLTextPast      = "textPast";
  var s_strTLLinesPast     = "linesPast";

  // GET IDENTIFIER.
  function stc_getIdentifier( id_, selection_ ) {
    var identifier_ = "";
    identifier_ = id_ + selection_;
    return identifier_;
  }//stc_getIdentifier

  // GET COMBO ID.
  function stc_getComboID( sourceID_, targetID_ ) {
    return sourceID_ + "_" + targetID_;
  }//stc_getComboID

  // EXTRACT ID STR.
  // Provides central point from which to extract ID string.
  function stc_extractIDStr( source_, string_ ) {
    var identifier_ = stc_splitStringFront( source_, string_ );
    return identifier_;
  }//stc_extractIDStr

  // EXTRACT SUB ID STR.
  // Provides central point from which to extract sub-identifier string.
  function stc_extractSubIDStr( source_, string_ ) {
    var sub_ = stc_splitStringBack( source_, string_ );
    return sub_;
  }//stc_extractSubIDStr

  // ============================================================================
  // ELEMENTS.
  // ============================================================================

  // GET ELEMENT.
  // Get Kinetic element.
  function stc_getElement( elementID_, stageName_ ) {
    var element_ = null;
    element_ = stageName_.get( "#" + elementID_ )[0];
    return element_;
  }//stc_getElement

  // CREATE STATUS CELL
  function stc_createStatusCell( w_, status_ ) {
    var cellStatus_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + status_  + "</td>";
    switch( status_ ) {
      case s_svcVals.ok_    : break;
      case s_svcVals.failed_:
        cellStatus_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" +
                      "<img src='img/iconDanger.png' style='vertical-align: middle;' />" + "&nbsp;" + status_ +
                      "</td>";
      break;
      default: break;
    }//switch status_
    return cellStatus_;
  }//stc_createStatusCell

  // CREATE MEMORY CELL
  function stc_createMemoryCell( w_, memoryPercent_, mb_ ) {
    // Init cell.
    var cellMemory_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + s_message.notFound_  + "</td>";

    // Build cell.
    memoryPercent_ = parseInt( memoryPercent_ );
    mb_            = parseInt( mb_ );
    if ( stc_isNumber( memoryPercent_ ) && stc_isNumber( mb_ ) ) {
      // Build text string.
      var memoryStr_ = memoryPercent_ + "%" + " of " + stc_addCommas( mb_ ) + " MB";

	    // Build image string.
	    var imgStr_ = "<img src='img/iconCaution.png' style='vertical-align: middle;' />";
	    if ( memoryPercent_ > 50 ) { imgStr_ = "<img src='img/iconDanger.png' style='vertical-align: middle;' />"; }

	    // Build cell.
	    cellMemory_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + memoryStr_  + "</td>";
	    if ( memoryPercent_ > 30 ) {
	      cellMemory_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" +
	                    imgStr_ + "&nbsp;" + memoryStr_ +
	                    "</td>";
	    }//memoryPercent_ gt 30
    }//memoryPercent_ mb_ valid

    // Return cell.
    return cellMemory_;
  }//stc_createMemoryCell

  // CREATE SEVERITY CELL
  function stc_createSeverityCell( w_, severity_ ) {
    // Init cell.
    var cellSeverity_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + s_message.notFound_  + "</td>";

    // Build cell.
    severity_ = parseInt( severity_ );
    if ( stc_isNumber( severity_ ) ) {
      cellSeverity_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + severity_  + "</td>";
      var imgStr_ = "<img src='img/iconCaution.png' style='vertical-align: middle;' />";
      if ( severity_ > 8 ) { imgStr_ = "<img src='img/iconDanger.png' style='vertical-align: middle;' />"; }
      if ( severity_ > 5 ) {
        cellSeverity_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + imgStr_ + "&nbsp;" + severity_ + "</td>";
      }//gt 5
    }//severity_ valid as number

    // Return cell.
    return cellSeverity_;
  }//stc_createSeverityCell

  // CREATE USAGE CELL
  function stc_createUsageCell( w_, usedPercent_ ) {
    // Init cell.
    var cellUsage_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + s_message.notFound_  + "</td>";

    // Build cell.
    usedPercent_ = parseInt( usedPercent_ );
    if ( stc_isNumber( usedPercent_ ) ) {
	    // Build image string.
	    var imgStr_ = "<img src='img/iconCaution.png' style='vertical-align: middle;' />";
	    if ( usedPercent_ > 50 ) { imgStr_ = "<img src='img/iconDanger.png' style='vertical-align: middle;' />"; }

	    // Build cell.
	    cellUsage_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" + usedPercent_  + "</td>";
	    if ( usedPercent_ > 30 ) {
	      cellUsage_ = "<td class='lsCell' width='" + w_ + "' style='min-width: " + w_ + ";'>" +
	                    imgStr_ + "&nbsp;" + usedPercent_ +
	                    "</td>";
	    }//usedPercent_ gt 30
    }//usedPercent_ valid

    // Return cell.
    return cellUsage_;
  }//stc_createUsageCell

  // ============================================================================
  // LIST ARRAYS.
  // ============================================================================

  // IS ROW SELECTED.
  function stc_isRowSelected( array_, str_ ) {
    var isSelected_ = false;
    var length_     = array_.length;
    for ( var i = 0; i < length_; i++ ) {
      if ( str_ == array_[i] ) {
        isSelected_ = true;
        break;
      }//match
    }//for each entry
    return isSelected_;
  }//stc_isRowSelected

  // REMOVE FROM ARRAY.
  function stc_removeFromArray( array_, arrayWork_, entry_ ) {
    if ( stc_isDefined( array_ ) && stc_isDefined( arrayWork_ ) && stc_isDefined( entry_ ) ) {
	    var length_ = arrayWork_.length;
	    for ( var i = 0; i < length_; i++ ) {
	      if ( arrayWork_[i] != entry_ ) {
	        array_.push( arrayWork_[i] );
	      }//entry does not match passed entry_
	    }//for each entry
    }//params valid
    return array_;
  }//stc_removeFromArray

  // ============================================================================
  // COLORS/HEAT.
  // ============================================================================

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

  // GET HEAT FILL.
  function stc_getHeatFill( heat_ ) {
    var returnFill_ = s_white;
    heat_ = parseInt( heat_ );
    if ( stc_isNumber( heat_ ) ) {
      if ( heat_ > -1 ) {
        returnFill_ = s_colorHeat.cold_;
      }//gt 0
      if ( heat_ > 6 ) {
        returnFill_ = s_colorHeat.cool_;
      }//gt 6
      if ( heat_ > 12 ) {
        returnFill_ = s_colorHeat.warm_;
      }//gt 12
      if ( heat_ > 18 ) {
        returnFill_ = s_colorHeat.hot_;
      }//gt 18
    }//heat_ valid
    return returnFill_;
  }//stc_getHeatFill

  // GET HEAT NAME.
  function stc_getHeatName( heat_ ) {
    var name_    = s_nameHeat.cold_;
    heat_ = parseInt( heat_ );
    if ( stc_isNumber( heat_ ) ) {
      if ( heat_ > -1 ) {
        returnFill_ = s_nameHeat.cold_;
      }//gt 0
      if ( heat_ > 6 ) {
        returnFill_ = s_nameHeat.cool_;
      }//gt 6
      if ( heat_ > 12 ) {
        returnFill_ = s_nameHeat.warm_;
      }//gt 12
      if ( heat_ > 18 ) {
        returnFill_ = s_nameHeat.hot_;
      }//gt 18
    }//heat_ valid
    return name_;
  }//stc_getHeatName

  // GET HEAT BAR CLASS.
  function stc_getHeatBarClass( percentage_ ) {
    var class_ = "lpHeat3";
    if ( stc_isNumber( percentage_ ) ) {
      if ( percentage_ > 0 ) {
        class_ = "lpHeat0";
      }//gt 0
      if ( percentage_ > 25 ) {
        class_ = "lpHeat1";
      }//gt 25
      if ( percentage_ > 50 ) {
        class_ = "lpHeat2";
      }//gt 50
      if ( percentage_ > 75 ) {
        class_ = "lpHeat3";
      }//gt 75
    }//percentage_ valid
    return class_;
  }//stc_getHeatBarClass

  // ============================================================================
  // VALIDATION.
  // ============================================================================

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

  // IS INPUT NUMERIC.
  function stc_isInputNumeric( val_ ) {
    var validChars_ = "1234567890"
    var isValid_    = true;
    var temp_       = "";
    var length_     = val_.length;
    for ( var i = 0; i < length_; i++ ) {
      temp_ = "" + val_.substring( i, i + 1 );
      if ( validChars_.indexOf( temp_ ) < 0) { isValid_ = false; }
    }//for each char
    return isValid_;
  }//stc_isInputNumeric

  // ============================================================================
  // NUMBERS.
  // ============================================================================

  // IS EVEN
  function stc_isEven( value ) {
    return ( value%2 == 0 );
  }//stc_isEven

  // IS DVISIBLE BY FOUR
  function stc_isDivisbleByFour( value ) {
    return ( value%4 == 0 );
  }//stc_isDivisbleByFour

  // IS DVISIBLE BY FIVE
  function stc_isDivisbleByFive( value ) {
    return ( value%5 == 0 );
  }//stc_isDivisbleByFive

  // IS DVISIBLE BY SIX
  function stc_isDivisbleBySix( value ) {
    return ( value%6 == 0 );
  }//stc_isDivisbleBySix

  // IS DVISIBLE BY FIFTEEN
  function stc_isDivisbleByFifteen( value ) {
    return ( value%15 == 0 );
  }//stc_isDivisbleByFifteen

  // IS DVISIBLE BY 44
  function stc_isDivisbleBy44( value ) {
    return ( value%44 == 0 );
  }//stc_isDivisbleBy44

  // GET RANDOM NUMBER.
  function stc_getRandomNumber( n1_, n2_ ) {
   var nbr_ = n1_ + Math.floor( Math.random() * n2_ );
   return nbr_;
  }//stc_getRandomNumber

  // ADD COMMAS.
	function stc_addCommas( n_ ) {
		n_ += '';
		var x_   = n_.split( '.' );
		var x1_  = x_[0];
		var x2_  = x_.length > 1 ? '.' + x_[1] : '';
		var rgx_ = /(\d+)(\d{3})/;
		while ( rgx_.test( x1_ ) ) {
			x1_ = x1_.replace( rgx_, '$1' + ',' + '$2' );
		}
		return x1_ + x2_;
	}//stc_addCommas

  // GET DEFAULT NUMBER.
  // Get unique number for creating default names, which are built from standard prefix + number.
  // Procedure:
  // Search thru existing names to find names that use standard prefix.
  // Get next n chars after prefix. If numeric, store chars as number.
  // Keep comparing number with baseline (starts at 0) so we end up with largest one.
  // Increment largest number, pad with leading chars, then
  // return to use in creating next default name.
  function stc_getDefaultNumber( indexPageRef_, array_, propertyName_, prefixSrc_, nbrLength_, nbrLimit_, charPad_ ) {
    // Create return var.
    var nbrStr_ = "";

    if ( stc_isDefined( indexPageRef_ ) && stc_isDefined( array_ ) &&
         stc_isDefined( propertyName_ ) && stc_isDefined( prefixSrc_ ) &&
         stc_isNumber( nbrLength_ ) && stc_isNumber( nbrLimit_ ) &&
         stc_isDefined( charPad_ ) ) {

	    // Set up processing vars.
	    var nbr_          = "";
	    var nbrMax_       = 0;
	    var length_       = array_.length;
	    var entry_        = "";
	    var prefix_       = "";
	    var prefixLength_ = prefixSrc_.length;
	    var charPad_      = "0";

	    // Loop thru data file and check each entry.
	    for ( var i = 0; i < length_; i++ ) {
	      // Get entry.
	      entry_ = array_[i][propertyName_];

	      // Get prefix (string that equals standard prefix).
	      prefix_ = entry_.slice( 0, prefixLength_ );

	      // If prefix correct, get unique number that follows prefix.
	      if ( prefix_ == prefixSrc_ ) {
	        // Get prefix_.length + nbrLength_ chars after prefix.
	        nbr_ = entry_.slice( prefix_.length, prefixLength_ + nbrLength_ );

	        // If retrieved chars are numeric, store and compare with max.
	        if ( stc_isInputNumeric( nbr_ ) ) {
	          nbr_ = parseInt( nbr_ );
	          if ( nbr_ > nbrMax_ ) {
	            nbrMax_ = nbr_;
	          }//nbr_ gt nbrMax_
	        }//is numeric
	      }//prefix_ not empty
	    }//for each entry

	    // Increment max.
	    nbrMax_++;

	    // If max now greater than capacity, start over.
	    // Populate log with warning to user - default numbering will not work from this point.
	    if ( nbrMax_ > nbrLimit_ ) {
	      nbrMax_ = 0;
	      indexPageRef_.populateLog( s_message.erDefaultNbr_, s_svcVals.error_ );
	    }//nbrMax_ gt nbrLimit_

	    // Pad unique number with zeros.
	    nbrStr_ = stc_padString( nbrMax_.toString(), charPad_, nbrLength_ );
    }//params valid

    // Return number string.
    return nbrStr_;
  }//stc_getDefaultNumber

  // ============================================================================
  // STRINGS.
  // ============================================================================

  // SPLIT STRING FRONT.
  function stc_splitStringFront( str, fragment_ ) {
   var str_;
   var i = str.indexOf( fragment_ );
   if ( i > 0 ) {
     str_ = str.slice( 0, i );
   } else {
     str_ = "";
   }//i not lt 0
   return str_;
  }//stc_splitStringFront

  // SPLIT STRING BACK.
  function stc_splitStringBack( str, fragment_ ) {
   var str_ = str.split( fragment_ );
   return str_[1];
  }//stc_splitStringBack

  // SET CHAR AT.
  function stc_setCharAt( str_, index_, char_ ) {
    if ( index_ > str_.length - 1 ) return str_;
    return str_.substr( 0, index_ ) + char_ + str_.substr( index_ + 1 );
  }//stc_setCharAt

  // NORMALIZE TEXT.
  function stc_normalizeText( textCurrent_, textStandardLength_ ) {
    // Trim text if over standard length.
    return textCurrent_.substring( 0, textStandardLength_ );
  }//stc_normalizeText

  // ADD ELLIPSIS.
  // Use after normalizing text.
  function stc_addEllipsis( textRaw_, textNormalized_, charLimit_ ) {
    if ( textRaw_ ) {
      if ( textRaw_.length > charLimit_ ) {
        textNormalized_ = stc_setCharAt( textNormalized_, charLimit_ - 1, "." );
        textNormalized_ = stc_setCharAt( textNormalized_, charLimit_ - 2, "." );
        textNormalized_ = stc_setCharAt( textNormalized_, charLimit_ - 3, "." );
        textNormalized_ = stc_setCharAt( textNormalized_, charLimit_ - 4, " " );
      }//textRaw_ longer than limit
    }//textRaw_ valid
    return textNormalized_;
  }//stc_addEllipsis

  // PAD STRING.
  // Pad string with leading chars.
  function stc_padString( str_, char_, length_ ) {
    while ( str_.length < length_ ) {
      str_ = char_ + str_;
    }//str_.length lt length
		return str_;
  }//stc_padString

  // REMOVE ENTRY STRING.
  // Remove fragment from encapsulating string when fragment is array entry.
  // This function removes extra commas that are not removed by simple search and replace.
  function stc_removeEntryString( str_, fragment_ ) {
    // Set up return string.
    var returnStr_ = "";

    // Set up vars for processing.
    var lengthFront_   = "";
    var lastCharFront_ = "";
    var strBack_       = "";
    var lengthBack_    = "";
    var firstCharBack_ = "";

    // Remove fragment.
    if ( stc_isDefined( str_ ) && stc_isDefined( fragment_ ) ) {
	    // Get portion of string that appears before fragment.
	    // Remove any comma that appears before fragment.
	    strFront_      = stc_splitStringFront( str_, fragment_ );
	    lengthFront_   = strFront_.length - 1;
	    lastCharFront_ = strFront_[lengthFront_];
	    if ( lastCharFront_ == "," ) {
	      strFront_ = strFront_.slice( 0, lengthFront_ );
	    }//lastCharFront_ is comma

	    // Get portion of string that appears after fragment.
	    // If fragment is first entry in its array (last char of front will be bracket),
	    // remove any comma that appears after fragment.
	    strBack_       = stc_splitStringBack( str_, fragment_ );
	    lengthBack_    = strBack_.length - 1;
	    firstCharBack_ = strBack_[0];
	    if ( lastCharFront_ == "[" && firstCharBack_ == "," ) {
	      strBack_ = strBack_.slice( 1 );
	    }//lastCharFront_ is bracket firstCharBack_ is comma

	    // Remove source by concatenating updated front and back.
	    returnStr_ = strFront_ + strBack_;
    }//str_ fragment_ valid

    // Return updated string.
    return returnStr_;
  }//stc_removeEntryString

  // ============================================================================
  // TIME.
  // ============================================================================

	// GET TIME TEXT.
	function stc_getTimeText( time_, includeDaylight_ ) {
	  var timeText_ = "";

	  if ( time_ ) {
		  var hours_   = time_.getHours();
		  var minutes_ = time_.getMinutes();
		  var seconds_ = time_.getSeconds();
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
				timeText_ = hoursText_ + ":" + minutesText_ + ":" + secondsText_;
				if ( includeDaylight_ ) { timeText_ = timeText_ + " " + d_; }
		  }//parameters valid
	  }//time_ valid

	  return timeText_;
	}//stc_getTimeText

  // ============================================================================
  // INTERSECTION.
  // ============================================================================

  // CHECK SHAPE INTERSECTION.
  function stc_checkShapeIntersection( objSource_, arrayTargets_ ) {
    // Init return object.
    var objReturn_       = new Object();
    objReturn_.intersect = false;
    objReturn_.id        = "";

    // Init return flag.
    var returnNow_ = false;

    // Check if source intersects any target in array.
    if ( stc_isDefined( objSource_ ) && stc_isDefined( arrayTargets_ ) ) {
      var length_ = arrayTargets_.length;
      for ( var i = 0; i < length_; i++ ) {
        // If source not same as target and it intersects target,
        // set properties and break for return.
        if ( ( arrayTargets_[i].id != objSource_.id ) && stc_intersectShape( objSource_, arrayTargets_[i] ) ) {
          objReturn_.intersect = true;
          objReturn_.id        = arrayTargets_[i].id;
          returnNow_           = true;
          break;
	      }//ids do not match and intersection

	      // Break for return.
	      if ( returnNow_ ) { break; }
      }//for each entry in array
    }//params valid

    // Return object.
    return objReturn_;
  }//stc_checkShapeIntersection

  // INTERSECT SHAPE.
  function stc_intersectShape( obj0_, obj1_ ) {
    var intersect_  = false;
    var fromSide_   = false;
    var fromTop_    = false;
    var fromBottom_ = false;

    if ( ( obj0_.left < obj1_.right ) && ( obj0_.right > obj1_.left ) )   { fromSide_ = true; }
    if ( ( obj0_.left == obj1_.left ) || ( obj0_.right == obj1_.right ) ) { fromSide_ = true; }

    if ( ( obj0_.top < obj1_.bottom ) && ( obj0_.bottom > obj1_.top ) )   { fromBottom_ = true; }
    if ( ( obj0_.bottom > obj1_.top ) && ( obj0_.top < obj1_.bottom ) )   { fromTop_    = true; }

    if ( obj0_.top == obj1_.top ) { fromTop_ = true; } if ( obj0_.bottom == obj1_.bottom ) { fromBottom_ = true; }
    if ( fromSide_ && ( fromBottom_ || fromTop_ ) ) { intersect_ = true; }
    return intersect_;
  }//stc_intersectShape

  // ============================================================================
  // HELP FILES.
  // ============================================================================

  var s_help = {
    heatMap_    : "Help text",
    heatList_   : "Help text",
    schemaWheel_: "Help text"
  };


