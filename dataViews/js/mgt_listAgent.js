
  // ============================================================================
  // LIST AGENT.
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

  // Services.
  var g_list           = s_listType.replication_;
  var g_cat            = s_listType.primary_;
  var g_getPrimary     = true;
  var g_getSecondary0  = false;
  var g_getSecondary1  = false;

  var g_messageType    = "";
  var g_arrayMessage   = new Array();

  var g_statRequestType = "";

  // Services vals. Timer speed is not used, but is included for documentation.
  var g_svcVals = {
    nbrRowsReq_ : 16,
    nbrStatsReq_: 10,
    timerSpeed_ : 15000 };

  // Selected objects.
  var g_arrayP        = new Array();
  var g_arrayS0       = new Array();
  var g_arrayS1       = new Array();
  var g_arrayDDAlert  = new Array();
  var g_agentSelected = "";
  var g_titleSelected = "";

  // View vals.
  var g_viewVals = {
    list_     : "list",
    drillDown_: "drillDown" };

  // Chart.
  var g_chart0 = null;
  var g_chart1 = null;

  // Chart stage/layer.
  var g_stageChart0 = null;
  var g_layerChart0 = null;

  var g_stageChart1 = null;
  var g_layerChart1 = null;

  // Chart vals. xValueIncrement_ should be timerSpeed_/1000.
  var g_chartVals = {
    nbrSlots_          : 10,
    nbrYSlots_         : 5,
    xValueIncrement_   : 15,
		colorGrid_         : s_grayB,
		useGrid_           : true,
		fontSize_          : "12",
		colorText_         : s_gray5,
		showPoints_        : false,
		radiusPoint_       : 7,
		xLegend_           : 50,
		yLegend_           : 6,
		colorTextLeg_      : s_gray5,
		colorStrokeLeg_    : s_gray5,
		// To size chart, use following values and mult by common factor.
		hOffset_           : 32,
		wOffset_           : 45,
		hLabelOffset_      : 24,
		xForVLabelsL_      : 10,
		xForVLabelsROffset_: 68,
		// To size legend, use following values and mult by common factor.
		hLegend_           : 132,
		wLegend_           : 125 };

  // Chart/legend vals.
  var g_lineColor0 = s_color.orangeLight_; var g_lineColor1 = s_color.greenLight_;
  var g_lineColor2 = s_color.blueLight_;   var g_lineColor3 = s_color.tan_;
  var g_lineColor4 = s_color.orangeLight_; var g_lineColor5 = s_color.greenLight_;
  var g_lineColor6 = s_color.blueLight_;   var g_lineColor7 = s_color.tan_;
  var g_legText0   = "Min latency (ms)";   var g_legText1   = "Max latency (ms)";
  var g_legText2   = "Avg latency (ms)";   var g_legText3   = "Throughput";
  var g_legText4   = "Min latency (ms)";   var g_legText5   = "Max latency (ms)";
  var g_legText6   = "Avg latency (ms)";   var g_legText7   = "Throughput";

  // Text.
  var g_charLimit = {
    main_   : 19,
    header_ : 70  };

  // Text strings.
  var g_uiStr = {
    tipAgent_            : "Agent",
    tipChart0_           : "Shows processing times for incoming messages to the agent.",
    tipChart1_           : "Shows latency for writing transactions to the binary replication logs.",
    titleChart0_         : "Agent latency...",
    titleChart1_         : "Replication log latency...",
    titleListRep0_       : "Primary Replication Agents",
    titleListRep1_       : "Secondary Replication Agents",
    titleListChainSend_  : "Chained Replication Agents (Senders)",
    titleListChainRec0_  : "Chained Replication Agents (Primary Receivers)",
    titleListChainRec1_  : "Chained Replication Agents (Secondary Receivers)",
    titleListQuery_      : "Query Agents",
    titleListProcedure_  : "Procedure Agents",
    titleListStream_     : "Stream Agents",
    titleMessageStats_   : "Messaging Stats",
    titleLogEntry_       : "Latest Log Warning/Error",
    titleAlerts_         : "Recent Alerts",
    successMessageResult_: "Message result is",
    erSelectCat_         : "Please select Primary and/or Secondary.",
    erSelectMessageType_ : "Please select a message type."
  };

  // ============================================================================
  // LOAD/INIT.
  // ============================================================================

  // LOAD PAGE.
  function loadPage() {
	  // Load module/view.
	  parent.loadModule( s_module._2_, s_module2._0_ );

    // Init page.
    initPage();

    // Get default first list. Callback gets next list.
    handleListRequest();
  }//loadPage

  // INIT PAGE.
  function initPage() {
    // Event handlers.

    // List view controls.

    $( "#_dropdownListType" ).on    ( "change", function( event ) { toggleEnableCat( $( "#_dropdownListType" ).val() ); });
    $( "#_btnGetList" ).on          ( "click", function( event )  { handleListRequest(); });

    // List controls.
    $( "#_btnSelAllP" ).on          ( "click", function( event )  { toggleSelectAllRows( s_listType.primary_, true ); });
    $( "#_btnUnselAllP" ).on        ( "click", function( event )  { toggleSelectAllRows( s_listType.primary_, false ); });
    $( "#_btnSendP" ).on            ( "click", function( event )  { handleMessageRequest( s_listType.primary_, $( "#_dropdownMsgTypeP" ).val(), g_arrayP ); });

    $( "#_btnSelAllS0" ).on         ( "click", function( event )  { toggleSelectAllRows( s_listType.secondary0_, true ); });
    $( "#_btnUnselAllS0" ).on       ( "click", function( event )  { toggleSelectAllRows( s_listType.secondary0_, false ); });
    $( "#_btnSendS0" ).on           ( "click", function( event )  { handleMessageRequest( s_listType.secondary0_, $( "#_dropdownMsgTypeS0" ).val(), g_arrayS0 ); });

    $( "#_btnSelAllS1" ).on         ( "click", function( event )  { toggleSelectAllRows( s_listType.secondary1_, true ); });
    $( "#_btnUnselAllS1" ).on       ( "click", function( event )  { toggleSelectAllRows( s_listType.secondary1_, false ); });
    $( "#_btnSendS1" ).on           ( "click", function( event )  { handleMessageRequest( s_listType.secondary1_, $( "#_dropdownMsgTypeS1" ).val(), g_arrayS1 ); });

    // Drilldown view controls.
    $( "#_btnRefreshDrillDown" ).on ( "click", function( event )  { parent.populateLog( s_message.refreshDetail_, s_svcVals.info_ ); setupListRequestDD(); getListDD(); });
    $( "#_btnReturn" ).on           ( "click", function( event )  { toggleViewContents( g_viewVals.list_ ); });

    // Drilldown list controls.
    $( "#_btnSelAllDD2" ).on        ( "click", function( event )  { toggleSelectAllRows( s_listType.alertDD_, true ); });
    $( "#_btnUnselAllDD2" ).on      ( "click", function( event )  { toggleSelectAllRows( s_listType.alertDD_, false ); });
    $( "#_btnSendDD2" ).on          ( "click", function( event )  { handleMessageRequest( s_listType.alertDD_, $( "#_dropdownMsgTypeDD2" ).val(), g_arrayDDAlert ); });

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

    // Create stages and layers for charts.
    var h0_ = $( "#_chartContainer0" ).height();
    var w0_ = $( "#_chartContainer0" ).width();

    var h1_ = $( "#_chartContainer1" ).height();
    var w1_ = $( "#_chartContainer1" ).width();

    g_stageChart0 = new Kinetic.Stage({ container: "_chartContainer0", height: h0_, width: w0_ });
    g_layerChart0 = new Kinetic.Layer();

    g_stageChart1 = new Kinetic.Stage({ container: "_chartContainer1", height: h1_, width: w1_ });
    g_layerChart1 = new Kinetic.Layer();

    // Add layers to stages, then create charts.
    if ( g_stageChart0 && g_layerChart0 && g_stageChart1 && g_layerChart1 ) {
      // Add layers to stages.
      g_stageChart0.add( g_layerChart0 );
      g_stageChart1.add( g_layerChart1 );

      // Set up chart vars.
      var chartID0_   = stc_getIdentifier( s_strChart0, s_strChart );
      var chartID1_   = stc_getIdentifier( s_strChart1, s_strChart );
      var hLabelsID0_ = stc_getIdentifier( s_strChart0, s_strChartHLabels );
      var hLabelsID1_ = stc_getIdentifier( s_strChart1, s_strChartHLabels );
      var hLabelStr_  = "";

      // Create basic chart 0 (with no data).
      g_chart0 = chrt_createChart( chartID0_, h0_, w0_,
                              g_chartVals.fontSize_, g_chartVals.colorText_,
                              g_chartVals.colorGrid_, g_chartVals.useGrid_,
                              g_chartVals.nbrSlots_, g_chartVals.nbrYSlots_,
                              g_chartVals.xValueIncrement_, hLabelsID0_,
                              hLabelStr_, g_chartVals.hLabelOffset_,
                              g_chartVals.hOffset_, g_chartVals.wOffset_ );
      if ( g_chart0 ) { g_layerChart0.add( g_chart0 ); }

      // Set title color.
      $( "#_titleChart0" ).css( "color", g_chartVals.colorText_ );

      // Draw layer.
      g_layerChart0.draw();

      // Create basic chart 1 (with no data).
      g_chart1 = chrt_createChart( chartID1_, h1_, w1_,
                              g_chartVals.fontSize_, g_chartVals.colorText_,
                              g_chartVals.colorGrid_, g_chartVals.useGrid_,
                              g_chartVals.nbrSlots_, g_chartVals.nbrYSlots_,
                              g_chartVals.xValueIncrement_, hLabelsID1_,
                              hLabelStr_, g_chartVals.hLabelOffset_,
                              g_chartVals.hOffset_, g_chartVals.wOffset_ );
      if ( g_chart1 ) { g_layerChart1.add( g_chart1 ); }

      // Set title color.
      $( "#_titleChart1" ).css( "color", g_chartVals.colorText_ );

      // Draw layer.
      g_layerChart1.draw();
    }//stages layers valid

    // Show list view.
    toggleViewContents( g_viewVals.list_ );
  }//initPage

  // TOGGLE ENABLE CAT.
  function toggleEnableCat( type_ ) {
      switch( type_ ) {
        case s_listType.replication_       : $( "#_cat1" ).attr( "disabled", false ); break;
        case s_listType.chainedReplication_: $( "#_cat1" ).attr( "disabled", false ); break;
        case s_listType.query_             : $( "#_cat1" ).attr( "disabled", true ); $( "#_cat1" ).attr( "checked", false ); break;
        case s_listType.procedure_         : $( "#_cat1" ).attr( "disabled", true ); $( "#_cat1" ).attr( "checked", false ); break;
        case s_listType.stream_            : $( "#_cat1" ).attr( "disabled", true ); $( "#_cat1" ).attr( "checked", false ); break;
        default: break;
      }//switch type_
  }//toggleEnableCat

  // TOGGLE VIEW CONTENTS.
  function toggleViewContents( view_ ) {
	  // Init charts.
	  initCharts();

	  // Switch view.
	  if ( view_ == g_viewVals.list_ ) {
	    // Show list view, hide drilldown view.
	    $( "#_viewList" ).css( "visibility", "visible" );      $( "#_viewList" ).css( "display", "block" );
	    $( "#_viewDrillDown" ).css( "visibility", "hidden" );  $( "#_viewDrillDown" ).css( "display", "none" );
	  } else {
	    // Hide list view, show drilldown view.
	    $( "#_viewList" ).css( "visibility", "hidden" );       $( "#_viewList" ).css( "display", "none" );
	    $( "#_viewDrillDown" ).css( "visibility", "visible" ); $( "#_viewDrillDown" ).css( "display", "block" );

	    // Show agent ID.
	    var text_           = g_uiStr.tipAgent_ + " " + g_agentSelected + " " + g_titleSelected;
	    var textNormalized_ = stc_normalizeText( text_, g_charLimit.header_ );
	    var nameDisplay_    = stc_addEllipsis( text_, textNormalized_, g_charLimit.header_ );
	    $( "#_agentName" ).html( nameDisplay_ ); $( "#_agentName" ).attr( "title", text_ );
	  }//view_ not g_viewVals.list_
  }//toggleViewContents

  // ============================================================================
  // LIST MAIN SERVICE.
  // ============================================================================

  // HANDLE LIST REQUEST.
  function handleListRequest() {
	  if ( !$( "#_cat0" ).is( ":checked" ) && !$( "#_cat1" ).is( ":checked" ) ) {
      // Populate message log.
      parent.populateLog( g_uiStr.erSelectCat_, s_svcVals.error_ );
	  } else {
	    // Set up and send service request.
		  setupListRequest();
		  getList();
	  }//one or both checkboxes is checked
  }//handleListRequest

  // SETUP LIST REQUEST.
  function setupListRequest() {
    // Hide lists.
    $( "#_divP" ).css( "visibility", "hidden" );  $( "#_divP" ).css( "display", "none" );
    $( "#_divS0" ).css( "visibility", "hidden" ); $( "#_divS0" ).css( "display", "none" );
    $( "#_divS1" ).css( "visibility", "hidden" ); $( "#_divS1" ).css( "display", "none" );

    // Null vars for currently-selected object.
    g_arrayP  = new Array();
    g_arrayS0 = new Array();
    g_arrayS1 = new Array();

    // Store list type.
    g_list = "";
    if ( $( "#_dropdownListType" ) ) {
      g_list = $( "#_dropdownListType" ).val();
    }//_dropdownListType valid

    // Set cat flags. Do not set _cat1 to checked for query, procedure, stream types.
    g_getPrimary    = false;
    g_getSecondary0 = false;
    g_getSecondary1 = false;
		if ( $( "#_cat0" ).is( ":checked" ) ) { g_getPrimary = true; }
    if ( $( "#_cat1" ).is( ":checked" ) ) {
      switch( g_list ) {
        case s_listType.replication_       : g_getSecondary0 = true; break;
        case s_listType.chainedReplication_: g_getSecondary0 = true; g_getSecondary1 = true; break;
        case s_listType.query_             : break;
        case s_listType.procedure_         : break;
        case s_listType.stream_            : break;
        default: break;
      }//switch g_list
		}//1 checked
  }//setupListRequest

  // SETUP REFRESH REQUEST.
  function setupRefreshRequest( list_, cat_ ) {
    // Store list type.
    g_list = "";
    if ( stc_isDefined( list_ ) ) {
      g_list = list_;
    }//list_ valid

    // Set cat flags.
    g_getPrimary    = false;
    g_getSecondary0 = false;
    g_getSecondary1 = false;
    if ( stc_isDefined( cat_ ) ) {
	    switch( cat_ ) {
        case s_listType.primary_   : g_getPrimary    = true; break;
        case s_listType.secondary0_: g_getSecondary0 = true; break;
        case s_listType.secondary1_: g_getSecondary1 = true; break;
        default: break;
	    }//switch cat_
    }//cat_ valid
  }//setupRefreshRequest

  // GET LIST.
  function getList() {
    // Determine which cat to get.
    g_cat = "";
    if ( g_getPrimary ) {
      g_cat = s_listType.primary_; g_getPrimary = false;
    } else if ( g_getSecondary0 ) {
      g_cat = s_listType.secondary0_; g_getSecondary0 = false;
    } else if ( g_getSecondary1 ) {
      g_cat = s_listType.secondary1_; g_getSecondary1 = false;
    }//secondary1_

    // TEST Set test result.
    if ( parent.i_isTestMode ) {
	    // Set up test data object.
	    var testResult_ = new Object();

      // Get test data according to current list and cat.
      switch( g_list ) {

        case s_listType.replication_:
		      switch( g_cat ) {
		        case s_listType.primary_   : if ( resultRepPrim_ )  { testResult_ = resultRepPrim_; } break;
		        case s_listType.secondary0_: if ( resultRepSec_ )   { testResult_ = resultRepSec_; }  break;
		        case s_listType.secondary1_: break;
		        default: break;
		      }//switch g_cat
        break;

        case s_listType.chainedReplication_:
		      switch( g_cat ) {
		        case s_listType.primary_   : if ( resultChRepSender_ )    { testResult_ = resultChRepSender_; }    break;
		        case s_listType.secondary0_: if ( resultChRepPrimRecvr_ ) { testResult_ = resultChRepPrimRecvr_; } break;
		        case s_listType.secondary1_: if ( resultChRepSecRecvr_ )  { testResult_ = resultChRepSecRecvr_; }  break;
		        default: break;
		      }//switch g_cat
        break;

        case s_listType.query_    : if ( resultQuery_ )     { testResult_ = resultQuery_; }     break;
        case s_listType.procedure_: if ( resultProcedure_ ) { testResult_ = resultProcedure_; } break;
        case s_listType.stream_   : if ( resultStream_ )    { testResult_ = resultStream_; }    break;

        default: break;

      }//switch g_list
    }//is parent.i_isTestMode

    // Send service. NOTE: Create static strings for final version.
    if ( !parent.i_isTestMode ) {

			$.ajax({
			    url: "/manage/servlet",
			    type: "POST",
			    data: JSON.stringify({
			        action: "replicationAgentList"
			    }),
			    dataType: s_svcVals.json_,
			    contentType: "application/json",
			    success: function( data, textStatus, jqXHR ) {
			      parent.showHelpDialog( data.processList.length + " agents<br>" + JSON.stringify ( data.processList ) );

			            //"host", "processId", "processName", "role", "shard", "localReplState",
			            //"memUsed", "memTotal", "memUsage",
			            //"threadCount", "files", "uptime", "uptimeString"
			    },
			    error: function ( jqXHR, textStatus, errorThrown ) {
			      // Set error message.
			      var message_ =
			        "Agents: " + g_list + " " + g_cat +
			        "<br>Status text: " + textStatus + ":" + errorThrown +
			        "<br>"              + jqXHR.responseText;

			      // Populate message log.
			      parent.populateLog( message_, s_svcVals.error_ );
			    }//error
			});

    } else {
	    // Send service.
	    var loadMessage_ = s_message.loading_ + " " + g_list + " " + g_cat + " " + s_message.list_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName', value: s_action.mgmtList_ } );
	    arrayParams_.push( { param: 'listName',  value: g_list } );
	    arrayParams_.push( { param: 'cat',       value: g_cat } );
		  arrayParams_.push( { param: 'rowOffset', value: 0 } );
		  arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.mgmtAgent_, arrayParams_, returnList, testResult_, $( "#_tooltip" ), null );
    }//is parent.i_isTestMode
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
	      if ( stc_isDefined( resultList_ )  ) {
	        if ( g_cat == s_listType.primary_ ) {
	          // Create list.
	          if ( listName_ == g_list && cat_ == s_listType.primary_ ) {
	            createListMain( resultList_, $( "#_listHeaderP" ), $( "#_listP" ) );
	          }//list valid

				    // Send next service.
				    if ( g_getSecondary0 ) {
				      g_cat = s_listType.secondary0_;
				      getList();
				    }//g_getSecondary0 true
	        } else if ( g_cat == s_listType.secondary0_ ) {
	          // Create list.
	          if ( listName_ == g_list && cat_ == s_listType.secondary0_ ) {
	            createListMain( resultList_, $( "#_listHeaderS0" ), $( "#_listS0" ) );
	          }//list valid

				    // Send next service.
				    if ( g_getSecondary1 ) {
				      g_cat = s_listType.secondary1_;
				      getList();
				    }//g_getSecondary1 true
	        } else if ( g_cat == s_listType.secondary1_ ) {
	          // Create list.
	          if ( listName_ == g_list && cat_ == s_listType.secondary1_ ) {
	            createListMain( resultList_, $( "#_listHeaderS1" ), $( "#_listS1" ) );
	          }//list valid
	        }//g_cat is secondary1_
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
    switch( g_cat ) {

      case s_listType.primary_:
		    $( "#_titleListP" ).html( "" );
		    $( "#_divP" ).css( "visibility", "visible" ); $( "#_divP" ).css( "display", "block" );
      break;

      case s_listType.secondary0_:
		    $( "#_titleListS0" ).html( "" );
		    $( "#_divS0" ).css( "visibility", "visible" ); $( "#_divS0" ).css( "display", "block" );
      break;

      case s_listType.secondary1_:
		    $( "#_titleListS1" ).html( "" );
		    $( "#_divS1" ).css( "visibility", "visible" ); $( "#_divS1" ).css( "display", "block" );
      break;

      default: break;
    }//switch g_cat

    // Set error flag.
    var error_ = true;

    // LIST.

    // Create list.
    if ( arrayMaster_ && listHeader_ && listData_ ) {

      // HEADER.

      // Build header row.
      var rowHeader_ = null;
      switch( g_list ) {

        case s_listType.replication_:
          if ( g_cat == s_listType.primary_ ) {
            rowHeader_ = buildHeaderReplicationPrimary();
          } else if ( g_cat == s_listType.secondary0_ ) {
            rowHeader_ = buildHeaderReplicationSecondary();
          }//g_cat is secondary0_
        break;

        case s_listType.chainedReplication_:
          if ( g_cat == s_listType.primary_ ) {
            rowHeader_ = buildHeaderCReplicationSender();
          } else if ( g_cat == s_listType.secondary0_ ) {
            rowHeader_ = buildHeaderCReplicationReceiver0();
          } else if ( g_cat == s_listType.secondary1_ ) {
            rowHeader_ = buildHeaderCReplicationReceiver1();
          }//g_cat is secondary1_
        break;

        case s_listType.query_    : rowHeader_ = buildHeaderQuery(); break;
        case s_listType.procedure_: rowHeader_ = buildHeaderProcedure(); break;
        case s_listType.stream_   : rowHeader_ = buildHeaderStream(); break;

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
          if ( stc_isDefined( arrayMaster_[i].agent ) )  { id_ = arrayMaster_[i].agent; }

		      // Set row ID. Replace any white spaces first.
		      var noSpaceID_ = id_.replace( /\s/g, "_" );
		      var rowID_     = stc_getIdentifier( noSpaceID_, s_strRow + "_" + g_list + "_" + g_cat + "_" + i );

		      // Build data row.
		      var row_ = null;
		      switch( g_list ) {

	          case s_listType.replication_:
            if ( g_cat == s_listType.primary_ ) {
              row_ = buildDataReplicationPrimary( id_, rowID_, arrayMaster_[i] );
            } else if ( g_cat == s_listType.secondary0_ ) {
              row_ = buildDataReplicationSecondary( id_, rowID_, arrayMaster_[i] );
            }//g_cat is secondary0_
	          break;

	          case s_listType.chainedReplication_:
            if ( g_cat == s_listType.primary_ ) {
              row_ = buildDataCReplicationSender( id_, rowID_, arrayMaster_[i] );
            } else if ( g_cat == s_listType.secondary0_ ) {
              row_ = buildDataCReplicationReceiver0( id_, rowID_, arrayMaster_[i] );
            } else if ( g_cat == s_listType.secondary1_ ) {
              row_ = buildDataCReplicationReceiver1( id_, rowID_, arrayMaster_[i] );
            }//g_cat is secondary1_
	          break;

	          case s_listType.query_    : row_ = buildDataQuery( id_, rowID_, arrayMaster_[i] ); break;
	          case s_listType.procedure_: row_ = buildDataProcedure( id_, rowID_, arrayMaster_[i] ); break;
	          case s_listType.stream_   : row_ = buildDataStream( id_, rowID_, arrayMaster_[i] ); break;

	          default: break;
		      }//switch g_list
		      if ( row_ ) { listData_.append( row_ ); }
        }//for each entry

        // EVENTS.
        // Assign event handlers to elements in list.
	      switch( g_cat ) {

	        case s_listType.primary_:
		        $( ".rowDataP" ).on          ( "click", function( event )     { clickRow( s_listType.primary_, $( this ) ); });
		        $( ".rowDataP" ).on          ( "mouseover", function( event ) { mouseoverRow( $( this ) ); });
		        $( ".rowDataP" ).on          ( "mouseout", function( event )  { mouseoutRow( $( this ) ); });
		        $( ".clickForDrillDown" ).on ( "click", function( event )     { clickDrillDown( event, s_listType.primary_, $( this ) ); });
	        break;

	        case s_listType.secondary0_:
		        $( ".rowDataS0" ).on         ( "click", function( event )     { clickRow( s_listType.secondary0_, $( this ) ); });
		        $( ".rowDataS0" ).on         ( "mouseover", function( event ) { mouseoverRow( $( this ) ); });
		        $( ".rowDataS0" ).on         ( "mouseout", function( event )  { mouseoutRow( $( this ) ); });
		        $( ".clickForDrillDown" ).on ( "click", function( event )     { clickDrillDown( event, s_listType.secondary0_, $( this ) ); });
	        break;

	        case s_listType.secondary1_:
		        $( ".rowDataS1" ).on         ( "click", function( event )     { clickRow( s_listType.secondary1_, $( this ) ); });
		        $( ".rowDataS1" ).on         ( "mouseover", function( event ) { mouseoverRow( $( this ) ); });
		        $( ".rowDataS1" ).on         ( "mouseout", function( event )  { mouseoutRow( $( this ) ); });
		        $( ".clickForDrillDown" ).on ( "click", function( event )     { clickDrillDown( event, s_listType.secondary1_, $( this ) ); });
	        break;

	        default: break;
	      }//switch g_cat

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
    $( "#_divDD2" ).css( "visibility", "hidden" ); $( "#_divDD2" ).css( "display", "none" );

    // Null vars for currently-selected object.
    g_arrayDDAlert = new Array();
  }//setupListRequestDD

  // GET LIST DRILLDOWN.
  function getListDD() {
    // TEST Set test result.
    if ( parent.i_isTestMode ) {
      resultDrillDownAgent_.listName = g_list;
      resultDrillDownAgent_.cat      = g_cat;
      resultDrillDownAgent_.ID       = g_agentSelected;
    }//is i_isTestMode

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + g_list + " " + g_agentSelected + " " + s_message.listDrilldown_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'queryName', value: s_action.drillDown_ } );
    arrayParams_.push( { param: 'listName',  value: g_list } );
    arrayParams_.push( { param: 'cat',       value: g_cat } );
    arrayParams_.push( { param: 'ID',        value: g_agentSelected } );
    arrayParams_.push( { param: 'rowOffset', value: 0 } );
    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
    stc_sendService( parent, loadMessage_, s_action.mgmtDrillDown_, arrayParams_, returnListDD, resultDrillDownAgent_, $( "#_tooltip" ), null );
  }//getListDD

  // RETURN LIST DRILLDOWN.
  function returnListDD( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var listName_            = "";
		    var cat_                 = "";
		    var ID_                  = "";
		    var messageStats_        = null;
		    var lastLogWarnMessage_  = null;
		    var lastLogErrorMessage_ = null;
		    var alerts_              = null;

	      // Get result vals.
	      if ( stc_isDefined( data_.listName ) )            { listName_            = data_.listName; }
	      if ( stc_isDefined( data_.cat ) )                 { cat_                 = data_.cat; }
	      if ( stc_isDefined( data_.ID ) )                  { ID_                  = data_.ID; }
	      if ( stc_isDefined( data_.messageStats ) )        { messageStats_        = data_.messageStats; }
	      if ( stc_isDefined( data_.lastLogWarnMessage ) )  { lastLogWarnMessage_  = data_.lastLogWarnMessage; }
	      if ( stc_isDefined( data_.lastLogErrorMessage ) ) { lastLogErrorMessage_ = data_.lastLogErrorMessage; }
	      if ( stc_isDefined( data_.alerts ) )              { alerts_              = data_.alerts; }

	      // Handle result.
	      if ( listName_ == g_list && cat_ == g_cat && ID_ == g_agentSelected ) {
	        if ( stc_isDefined( messageStats_ ) ) {
	          createListDD( messageStats_, s_listType.messageDD_, $( "#_listHeaderDD0" ), $( "#_listDD0" ) );
	        }//messageStats_ valid

	        if ( stc_isDefined( lastLogWarnMessage_ ) && stc_isDefined( lastLogErrorMessage_ ) ) {
	          showLogDD( lastLogWarnMessage_, lastLogErrorMessage_ );
	        }//lastLogWarnMessage_ lastLogErrorMessage_ valid

	        if ( stc_isDefined( alerts_ ) ) {
	          createListDD( alerts_, s_listType.alertDD_, $( "#_listHeaderDD2" ), $( "#_listDD2" ) );
	        }//alerts_ valid

	        // Send request for stats service.
					startStatList();
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

	      case s_listType.messageDD_:
			    $( "#titleListDD0" ).html( "" );
			    $( "#_divDD0" ).css( "visibility", "visible" ); $( "#_divDD0" ).css( "display", "block" );
	      break;

	      case s_listType.alertDD_:
			    $( "#titleListDD2" ).html( "" );
			    $( "#_divDD2" ).css( "visibility", "visible" ); $( "#_divDD2" ).css( "display", "block" );
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
          case s_listType.messageDD_: rowHeader_ = buildHeaderMessages(); break;
          case s_listType.alertDD_  : rowHeader_ = buildHeaderAlerts(); break;
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
		          case s_listType.messageDD_: if ( stc_isDefined( arrayMaster_[i].channel ) )  { id_  = arrayMaster_[i].channel; } break;
		          case s_listType.alertDD_  : if ( stc_isDefined( arrayMaster_[i].alertNbr ) ) { id_  = arrayMaster_[i].alertNbr; } break;
		          default: break;
			      }//switch list_

			      // Set row ID. Replace any white spaces first.
			      var noSpaceID_ = id_.replace( /\s/g, "_" );
			      var rowID_     = stc_getIdentifier( noSpaceID_, s_strRow + "_" + list_ + "_" + i );

			      // Build data row.
			      var row_ = null;
			      switch( list_ ) {
		          case s_listType.messageDD_: row_ = buildDataMessages( id_, rowID_, arrayMaster_[i] ); break;
		          case s_listType.alertDD_  : row_ = buildDataAlerts( id_, rowID_, arrayMaster_[i] ); break;
		          default: break;
			      }//switch list_
			      if ( row_ ) { listData_.append( row_ ); }
	        }//for each entry

	        // EVENTS.
	        // Assign event handlers to elements in list.
		      switch( list_ ) {

		        case s_listType.alertDD_:
			        $( ".rowDataDDAlert" ).on ( "click", function( event )     { clickRow( s_listType.alertDD_, $( this ) ); });
			        $( ".rowDataDDAlert" ).on ( "mouseover", function( event ) { mouseoverRow( $( this ) ); });
			        $( ".rowDataDDAlert" ).on ( "mouseout", function( event )  { mouseoutRow( $( this ) ); });
		        break;

		        default: break;
		      }//switch list_

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

  // SHOW LOG DRILLDOWN.
  function showLogDD( msgWarning_, msgError_ ) {
    // Set list title.
    $( "#titleListDD1" ).html( g_uiStr.titleLogEntry_ );

    // Init textareas.
    $( "#_textAreaDD1_0" ).html( "None." );
    $( "#_textAreaDD1_1" ).html( "None." );

    // Show section.
    $( "#_divDD1" ).css( "visibility", "visible" );
    $( "#_divDD1" ).css( "display", "block" );

    // Insert values.
    if ( msgWarning_ ) { $( "#_textAreaDD1_0" ).html( msgWarning_ ); }
    if ( msgError_ )   { $( "#_textAreaDD1_1" ).html( msgError_ ); }
  }//showLogDD

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
  function clickRow( cat_, row_ ) {
	  if ( stc_isDefined( cat_ ) && stc_isDefined( row_ ) ) {
      // Get ID and selected row ID.
      var id_    = row_.attr( "name" );
      var rowID_ = row_.attr( "id" );

      // Handle this row.
      if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) ) {
        // Get row's selected status.
        var isSel_ = row_.attr( "data-selected" );
			  if ( stc_isDefined( isSel_ ) ) {
	        // Set up work array for removing IDs.
		      var arrayID_ = new Array();

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

			    // Select/unselect ID according to cat.
			    switch( cat_ ) {
			      case s_listType.primary_:
					    if ( isSel_ == "true" ) {
					      // Remove ID from array.
					      arrayID_ = $.merge( [], g_arrayP );
					      g_arrayP = new Array();
					      g_arrayP = stc_removeFromArray( g_arrayP, arrayID_, id_ );
					    } else {
				        // Store ID.
						    g_arrayP.push( id_ );
					    }//isSel_ false
			      break;

			      case s_listType.secondary0_:
					    if ( isSel_ == "true" ) {
					      // Remove ID from array.
					      arrayID_  = $.merge( [], g_arrayS0 );
					      g_arrayS0 = new Array();
					      g_arrayS0 = stc_removeFromArray( g_arrayS0, arrayID_, id_ );
					    } else {
				        // Store ID.
						    g_arrayS0.push( id_ );
					    }//isSel_ false
			      break;

			      case s_listType.secondary1_:
					    if ( isSel_ == "true" ) {
					      // Remove ID from array.
					      arrayID_  = $.merge( [], g_arrayS1 );
					      g_arrayS1 = new Array();
					      g_arrayS1 = stc_removeFromArray( g_arrayS1, arrayID_, id_ );
					    } else {
				        // Store ID.
						    g_arrayS1.push( id_ );
					    }//isSel_ false
			      break;

			      case s_listType.alertDD_:
					    if ( isSel_ == "true" ) {
					      // Remove ID from array.
					      arrayID_       = $.merge( [], g_arrayDDAlert );
					      g_arrayDDAlert = new Array();
					      g_arrayDDAlert = stc_removeFromArray( g_arrayDDAlert, arrayID_, id_ );
					    } else {
				        // Store ID.
						    g_arrayDDAlert.push( id_ );
					    }//isSel_ false
			      break;

			      default: break;
			    }//switch cat_
			  }//isSel_ valid
      }//id_ rowID_ valid
	  }//cat_ row_ valid
  }//clickRow

  // CLICK DRILLDOWN.
  function clickDrillDown( event, cat_, cell_ ) {
	  // Cancel propagation.
	  event.stopPropagation();

	  // Handle event.
	  if ( stc_isDefined( cat_ ) && stc_isDefined( cell_ ) ) {
      // Get ID and title.
      var id_    = cell_.parent().attr( "name" );
      var title_ = cell_.attr( "title" );

      // Set vals, toggle view, then send service request.
      if ( stc_isDefined( id_ ) && stc_isDefined( title_ ) ) {
        // Set cat.
		    g_cat = cat_;

		    // Store selected/service vals.
		    g_agentSelected   = id_;
		    g_titleSelected   = title_;
		    g_statRequestType = s_statType.agent_;

        // Toggle to drilldown view.
        toggleViewContents( g_viewVals.drillDown_ );

        // Send request for drilldown list service.
        // After handling list service, callback will send stats service.
        setupListRequestDD(); getListDD();
      }//id_ title_ valid
	  }//cat_ cell_ valid
  }//clickDrillDown

  // TOGGLE SELECT ALL ROWS.
  // Select/unselect all rows in selected list.
  // To do this, we insert/delete IDs into/from selected ID array,
  // and set all rows to selected/unselected state.
  function toggleSelectAllRows( cat_, select_ ) {
    if ( stc_isDefined( cat_ ) ) {
      switch( cat_ ) {

        case s_listType.primary_:
		      if ( select_ ) {
		        g_arrayP = new Array();
				    $( "table#_listP > tbody > tr" ).each( function() {
				      if ( stc_isDefined( $( this ).attr( "id" ) ) ) {
				        g_arrayP.push( $( this ).attr( "name" ) );
				      }//id valid
				    });
				    highlightRow( $( ".rowDataP" ) ); selectRow( $( ".rowDataP" ) );
		      } else {
		        g_arrayP = new Array();
		        unhighlightRow( $( ".rowDataP" ) ); unselectRow( $( ".rowDataP" ) );
		      }//select_ false
        break;

        case s_listType.secondary0_:
		      if ( select_ ) {
		        g_arrayS0 = new Array();
				    $( "table#_listS0 > tbody > tr" ).each( function() {
				      if ( stc_isDefined( $( this ).attr( "id" ) ) ) {
				        g_arrayS0.push( $( this ).attr( "name" ) );
				      }//id valid
				    });
				    highlightRow( $( ".rowDataS0" ) ); selectRow( $( ".rowDataS0" ) );
		      } else {
		        g_arrayS0 = new Array();
		        unhighlightRow( $( ".rowDataS0" ) ); unselectRow( $( ".rowDataS0" ) );
		      }//select_ false
        break;

        case s_listType.secondary1_:
		      if ( select_ ) {
		        g_arrayS1 = new Array();
				    $( "table#_listS1 > tbody > tr" ).each( function() {
				      if ( stc_isDefined( $( this ).attr( "id" ) ) ) {
				        g_arrayS1.push( $( this ).attr( "name" ) );
				      }//id valid
				    });
				    highlightRow( $( ".rowDataS1" ) ); selectRow( $( ".rowDataS1" ) );
		      } else {
		        g_arrayS1 = new Array();
		        unhighlightRow( $( ".rowDataS1" ) ); unselectRow( $( ".rowDataS1" ) );
		      }//select_ false
        break;

        case s_listType.alertDD_:
		      if ( select_ ) {
		        g_arrayDDAlert = new Array();
				    $( "table#_listDD2 > tbody > tr" ).each( function() {
				      if ( stc_isDefined( $( this ).attr( "id" ) ) ) {
				        g_arrayDDAlert.push( $( this ).attr( "name" ) );
				      }//id valid
				    });
		        highlightRow( $( ".rowDataDDAlert" ) ); selectRow( $( ".rowDataDDAlert" ) );
		      } else {
		        g_arrayDDAlert = new Array();
		        unhighlightRow( $( ".rowDataDDAlert" ) ); unselectRow( $( ".rowDataDDAlert" ) );
		      }//select_ false
        break;

        default: break;
      }//switch cat_
    }//cat_ valid
  }//toggleSelectAllRows

  // ============================================================================
  // MESSAGE SERVICE.
  // ============================================================================

  // HANDLE MESSAGE REQUEST.
  function handleMessageRequest( cat_, messageType_, array_ ) {
    // Store selected cat.
    g_cat = cat_;

    // Init stored parameters.
    g_messageType  = "";
    g_arrayMessage = new Array();

	  // Check if service parameters are valid.
	  var message_ = "";
	  var error_   = false;
	  if ( !stc_isDefined( messageType_ ) ) {
      message_ = g_uiStr.erSelectMessageType_ + "  ";
      error_   = true;
	  }//messageType_ not valid
	  if ( !stc_isDefined( array_ ) ) {
      message_ = message_ + s_message.erSelectRows_ + " ";
      error_   = true;
	  }//array_ not valid
	  if ( stc_isDefined( array_ ) ) {
      if ( array_.length == 0 ) {
	      message_ = message_ + s_message.erSelectRows_ + " ";
	      error_   = true;
      }//empty
	  }//array_ valid

	  // If any parameter not valid, show error.
	  // If all parameters valid, store parameters and send service request.
	  if ( error_ ) {
      // Populate message log.
      parent.populateLog( message_, s_svcVals.error_ );
	  } else {
	    // Store parameters.
      g_messageType  = messageType_;
      g_arrayMessage = array_;

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
    if ( stc_isDefined( g_messageType ) && stc_isDefined( g_arrayMessage ) ) {
      if ( g_messageType != "" && g_arrayMessage.length > 0 ) {
	      // Send service.
		    var loadMessage_ = s_message.send0_ + " " + g_messageType + " " + s_message.send1_ + " " + g_list + " " + g_cat + "...";
		    var arrayParams_ = new Array();
		    arrayParams_.push( { param: 'queryName',    value: s_action.message_ } );
		    arrayParams_.push( { param: 'messageType',  value: g_messageType } );
		    arrayParams_.push( { param: 'arrayMessage', value: g_arrayMessage } );
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
		      parent.populateLog( g_uiStr.successMessageResult_ + " " + data_.message + " for " + g_messageType + " on " + g_list + " " + g_cat + ".", s_svcVals.success_ );

		      // Initialize selected ID arrays.
		      // Do setup and send refresh service.
		      switch( g_cat ) {

		        case s_listType.primary_:
		          g_arrayP = new Array();
				      setupRefreshRequest( g_list, g_cat );
				      getList();
		        break;

		        case s_listType.secondary0_:
		          g_arrayS0 = new Array();
				      setupRefreshRequest( g_list, g_cat );
				      getList();
		        break;

		        case s_listType.secondary1_:
		          g_arrayS1 = new Array();
				      setupRefreshRequest( g_list, g_cat );
				      getList();
		        break;

		        case s_listType.alertDD_:
		          g_arrayDDAlert = new Array();
		          setupListRequestDD();
		          getListDD();
		        break;

		        default: break;
		      }//switch g_cat
		    }//message valid
	    }//status is success
    }//data_ status_ valid
  }//returnMessage

  // ============================================================================
  // STAT SERVICE.
  // ============================================================================

  // START STAT LIST.
  function startStatList() {

    // TIMER/CHART
    // Init charts. Includes timer tracking stop.
    initCharts();

    // LEGEND.

    // Set up vars for creating legend.
    var arrayLegend_ = new Array();

    // Create legend for chart 0.
    arrayLegend_ = [
                     { fill_:g_lineColor0, text_:g_legText0 },
                     { fill_:g_lineColor1, text_:g_legText1 },
                     { fill_:g_lineColor2, text_:g_legText2 },
                     { fill_:g_lineColor3, text_:g_legText3 }
                   ];
    g_chart0 = stc_getElement( stc_getIdentifier( s_strChart0, s_strChart ), g_stageChart0 );
    if ( g_chart0 ) {
      chrt_createLegend( g_chart0, stc_getIdentifier( s_strChart0, s_strLegend ),
                         g_chartVals.xLegend_, g_chartVals.yLegend_, g_chartVals.hLegend_, g_chartVals.wLegend_,
                         g_chartVals.colorTextLeg_, g_chartVals.colorStrokeLeg_, arrayLegend_);
    }//g_chart0 valid

    // Create legend for chart 1.
    arrayLegend_ = new Array();
    arrayLegend_ = [
                     { fill_:g_lineColor4, text_:g_legText4 },
                     { fill_:g_lineColor5, text_:g_legText5 },
                     { fill_:g_lineColor6, text_:g_legText6 },
                     { fill_:g_lineColor7, text_:g_legText7 }
                   ];
    g_chart1 = stc_getElement( stc_getIdentifier( s_strChart1, s_strChart ), g_stageChart1 );
    if ( g_chart1 ) {
      chrt_createLegend( g_chart1, stc_getIdentifier( s_strChart1, s_strLegend ),
                         g_chartVals.xLegend_, g_chartVals.yLegend_, g_chartVals.hLegend_, g_chartVals.wLegend_,
                         g_chartVals.colorTextLeg_, g_chartVals.colorStrokeLeg_, arrayLegend_ );
    }//g_chart1 valid

    // START
    // Start timer tracking that sends request for stat list every n seconds.
    parent.i_getStatListDB = true;

    // Send first service request.
    getStatList();
  }//startStatList

  // GET STAT LIST.
  function getStatList() {
    if ( stc_isDefined( g_agentSelected ) && stc_isDefined( g_statRequestType ) ) {
	    // TEST Set test result.
	    if ( parent.i_isTestMode ) {
			  testStatsAgentResult_.statsTypeId = g_agentSelected;
	    }//is parent.i_isTestMode

      // Get start time.
      var date_ = new Date(); var time_ = date_.getTime();

      // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.mgmtStats_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName',   value: s_action.statsStats_ } );
	    arrayParams_.push( { param: 'statType',    value: g_statRequestType } );
	    arrayParams_.push( { param: 'statsTypeId', value: g_agentSelected } );
	    arrayParams_.push( { param: 'startTime',   value: time_ } );
	    arrayParams_.push( { param: 'rowLimit',    value: g_svcVals.nbrStatsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.mgmtStats_, arrayParams_, returnStatList, testStatsAgentResult_, $( "#_tooltip" ), returnStatListError );
    }//g_agentSelected g_statRequestType valid
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
		    var statType_    = "";
		    var statsTypeId_ = "";
		    var statValues_  = null;

	      // Get result vals.
	      if ( stc_isDefined( data_.statType ) )    { statType_    = data_.statType; }
	      if ( stc_isDefined( data_.statsTypeId ) ) { statsTypeId_ = data_.statsTypeId; }
	      if ( stc_isDefined( data_.statValues ) )  { statValues_  = data_.statValues; }

	      // Handle result.
	      if ( statType_ == g_statRequestType &&
	           statsTypeId_ == g_agentSelected &&
	           stc_isDefined( statValues_ )  ) {

		      // Create stat arrays.
				  // Arrays come back with more recent values at end.
				  // Reverse so most recent are at beginning.
		      var countSuccess_ = null;
		      var statName_     = "";
		      var stat_         = new Array();
		      var arrayRaw0_    = new Array();
		      var length_       = statValues_.length;
		      for ( var i = 0; i < length_; i++ ) {
		        if ( stc_isDefined( statValues_[i] ) ) {
		          // Get vals.
		          countSuccess_ = null;
		          statName_     = "";
		          if ( stc_isDefined( statValues_[i].countSuccess ) ) { countSuccess_ = statValues_[i].countSuccess; }
		          if ( stc_isDefined( statValues_[i].statName ) )     { statName_     = statValues_[i].statName; }

			        // If vals valid, add stat to raw array.
			        if ( stc_isDefined( countSuccess_ ) && stc_isDefined( statName_ ) ) {
			          // Get and reverse stat.
			          stat_ = new Array(); stat_ = countSuccess_;
			          stat_.reverse();

					      // If stat name is not correct, null stat.
					      switch( i ) {
					        case 0: if ( statName_ != s_statType.agentMinLatency_ )       { stat_ = null; } break;
					        case 1: if ( statName_ != s_statType.agentMaxLatency_ )       { stat_ = null; } break;
					        case 2: if ( statName_ != s_statType.agentAvgLatency_ )       { stat_ = null; } break;
					        case 3: if ( statName_ != s_statType.agentThroughput_ )       { stat_ = null; } break;
					        case 4: if ( statName_ != s_statType.replicationMinLatency_ ) { stat_ = null; } break;
					        case 5: if ( statName_ != s_statType.replicationMaxLatency_ ) { stat_ = null; } break;
					        case 6: if ( statName_ != s_statType.replicationAvgLatency_ ) { stat_ = null; } break;
					        case 7: if ( statName_ != s_statType.replicationThroughput_ ) { stat_ = null; } break;
					        default: break;
					      }//switch i

			          // Add stat to raw array.
			          arrayRaw0_.push( stat_ );
			        }//object valid
		        }//entry valid
		      }//for length

		      // Create new date/time.
		      var newDate_ = new Date();

		      // Combine stat arrays with their line colors.
		      // Update and show charts.
		      if ( stc_isDefined( arrayRaw0_ ) ) {
			      var arrayStat_ = new Array();
			      // Chart 0.
			      if ( arrayRaw0_.length > 3 ) {
			        arrayStat_ = new Array();
					    arrayStat_ = [
					                     { stat_:arrayRaw0_[0], stroke_:g_lineColor0 },
					                     { stat_:arrayRaw0_[1], stroke_:g_lineColor1 },
					                     { stat_:arrayRaw0_[2], stroke_:g_lineColor2 },
					                     { stat_:arrayRaw0_[3], stroke_:g_lineColor3 }
					                   ];
			        makeCharts( arrayStat_, g_stageChart0, g_layerChart0,
			                    $( "#_chartContainer0" ), $( "#_chartContainerMain0" ), g_chart0, s_strChart0,
			                    $( "#_titleChart0" ), g_uiStr.titleChart0_,
			                    s_svcVals.incrementTime_, s_svcVals.sec15_, newDate_, mouseoverChart0 );
			        $( "#_chartContainerMain0" ).css( "visibility", "visible" ); $( "#_chartContainerMain0" ).css( "display", "block" );
			        $( "#_titleChart0" ).attr( "title", g_uiStr.tipChart0_ );
			      }//array valid

			      // Chart 1.
			      if ( g_list == s_listType.replication_ || g_list == s_listType.chainedReplication_ ) {
				      if ( arrayRaw0_.length > 7 ) {
				        arrayStat_ = new Array();
						    arrayStat_ = [
						                     { stat_:arrayRaw0_[4], stroke_:g_lineColor4 },
						                     { stat_:arrayRaw0_[5], stroke_:g_lineColor5 },
						                     { stat_:arrayRaw0_[6], stroke_:g_lineColor6 },
						                     { stat_:arrayRaw0_[7], stroke_:g_lineColor7 }
						                   ];
					        makeCharts( arrayStat_, g_stageChart1, g_layerChart1,
					                    $( "#_chartContainer1" ), $( "#_chartContainerMain1" ), g_chart1, s_strChart1,
					                    $( "#_titleChart1" ), g_uiStr.titleChart1_,
					                    s_svcVals.incrementTime_, s_svcVals.sec15_, newDate_, mouseoverChart1 );
				        $( "#_chartContainerMain1" ).css( "visibility", "visible" ); $( "#_chartContainerMain1" ).css( "display", "block" );
				        $( "#_titleChart1" ).attr( "title", g_uiStr.tipChart1_ );
				      }//array valid
			      }//replication_ or chainedReplication_
		      }//arrayRaw0_ valid
	      }//statType_ statsTypeId_ statValues_ valid
	    }//status is success
    }//data_ status_ valid
  }//returnStatList

  // ============================================================================
  // CHART.
  // ============================================================================

  // INIT CHARTS.
  // Stop timer tracking and clear charts.
  function initCharts() {
    // Stop timer tracking.
    parent.i_getStatListDB = false;

    // Set up vars for clearing charts.
    var arrayChartLine_ = new Array();
    var chartLineID0_ = ""; var chartLineID1_ = ""; var chartLineID2_ = ""; var chartLineID3_ = "";
    var hLabelsID_ = ""; var vLabelsID0_ = ""; var vLabelsID1_ = "";

    // Clear chart 0.
    chartLineID0_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 0 );
    chartLineID1_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 1 );
    chartLineID2_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 2 );
    chartLineID3_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 3 );
    arrayChartLine_ = [ chartLineID0_, chartLineID1_, chartLineID2_, chartLineID3_ ];
    hLabelsID_      = stc_getIdentifier( s_strChart0, s_strChartHLabels );
    vLabelsID0_     = stc_getIdentifier( s_strChart0, s_strChartVLabels ) + s_strVLabelsLeft;
    vLabelsID1_     = stc_getIdentifier( s_strChart0, s_strChartVLabels ) + s_strVLabelsRight;
    chrt_clearChart( g_stageChart0, g_layerChart0, arrayChartLine_, hLabelsID_, vLabelsID0_, vLabelsID1_, $( "#_titleChart0" ) );

    // Clear chart 1.
    chartLineID0_   = stc_getIdentifier( s_strChart1, s_strChartLine + s_strChartLine + 4 );
    chartLineID1_   = stc_getIdentifier( s_strChart1, s_strChartLine + s_strChartLine + 5 );
    chartLineID2_   = stc_getIdentifier( s_strChart1, s_strChartLine + s_strChartLine + 6 );
    chartLineID3_   = stc_getIdentifier( s_strChart1, s_strChartLine + s_strChartLine + 7 );
    arrayChartLine_ = new Array();
    arrayChartLine_ = [ chartLineID0_, chartLineID1_, chartLineID2_, chartLineID3_ ];
    hLabelsID_      = stc_getIdentifier( s_strChart1, s_strChartHLabels );
    vLabelsID0_     = stc_getIdentifier( s_strChart1, s_strChartVLabels ) + s_strVLabelsLeft;
    vLabelsID1_     = stc_getIdentifier( s_strChart1, s_strChartVLabels ) + s_strVLabelsRight;
    chrt_clearChart( g_stageChart1, g_layerChart1, arrayChartLine_, hLabelsID_, vLabelsID0_, vLabelsID1_, $( "#_titleChart1" ) );

    // Clear legend 0.
    chrt_clearLegend( g_stageChart0, g_layerChart0, stc_getIdentifier( s_strChart0, s_strLegend ) );

    // Clear legend 1.
    chrt_clearLegend( g_stageChart1, g_layerChart1, stc_getIdentifier( s_strChart1, s_strLegend ) );

    // Hide charts.
    $( "#_chartContainerMain0" ).css( "visibility", "hidden" ); $( "#_chartContainerMain0" ).css( "display", "none" );
    $( "#_chartContainerMain1" ).css( "visibility", "hidden" ); $( "#_chartContainerMain1" ).css( "display", "none" );
  }//initCharts

  // MAKE CHARTS.
  function makeCharts( arrayStat_, stage_, layer_,
                       chartContainer_, chartContainerMain_, chart_, subID_,
                       titleChart_, titleText_,
                       incrementType_, increment_, startValue_, mouseoverChart_ ) {

    if ( stc_isDefined( arrayStat_ ) && stc_isDefined( stage_ ) && stc_isDefined( layer_ ) &&
         stc_isDefined( chartContainer_ ) &&
         stc_isDefined( chartContainerMain_ ) &&
         stc_isDefined( chart_ ) && stc_isDefined( subID_ ) &&
         stc_isDefined( titleChart_ ) && stc_isDefined( titleText_ ) &&
         stc_isDefined( incrementType_ ) && stc_isDefined( increment_ ) &&
         stc_isDefined( startValue_ ) && stc_isDefined( mouseoverChart_ ) ) {

		  // Get chart container height and width - needed for calculations in setting up chart.
		  var h_ = chartContainer_.height();
		  var w_ = chartContainer_.width();

		  // Get highest value.

		  // Set up work array.
		  var arrayWork_ = null;

		  // Create merge array from first entry in stat array.
		  if ( stc_isDefined( arrayStat_[0] ) ) {
			  if ( stc_isDefined( arrayStat_[0].stat_ ) ) {
			    arrayWork_ = $.merge( [], arrayStat_[0].stat_ );
			  }//stat 0 valid
		  }//first entry valid

      // Merge all other entries from stat array into work array.
      var length_ = arrayStat_.length;
      for ( var i = 1; i < length_; i++ ) {
        if ( stc_isDefined( arrayStat_[i] ) ) {
			    if ( stc_isDefined( arrayStat_[i].stat_ ) ) {
			      $.merge( arrayWork_, arrayStat_[i].stat_ );
			    }//stat_ valid
        }//entry valid
      }//for length

		  // Get highest value from work array.
		  var highestValue_ = 0;
		  if ( arrayWork_ ) {
		    highestValue_ = chrt_getHighestStatValue( arrayWork_ );
		  }//arrayWork_ valid

		  // Create chart lines, points, labels, title, and show.
		  if ( stc_isNumber( h_ ) && stc_isNumber( w_ ) && stc_isNumber( highestValue_ ) ) {
		    // Set chart line/labels vars.
		    var vLabelsID_    = stc_getIdentifier( subID_, s_strChartVLabels );
		    var xForVLabelsR_ = ( w_ - g_chartVals.xForVLabelsROffset_ );
		    var radiusPoint_  = 7;

		    // Set horizontal labels.
		    chrt_updateHorizontalLabels( stage_, stc_getIdentifier( subID_, s_strChartHLabels ),
		                                 s_svcVals.incrementTime_, increment_, startValue_ );

		    // Create vertical labels.
		    // Left.
		    chrt_createVerticalLabels( stage_, chart_, vLabelsID_ + s_strVLabelsLeft, h_, w_,
		                               g_chartVals.fontSize_, g_chartVals.colorText_,
		                               g_chartVals.nbrYSlots_, null, highestValue_,
		                               g_chartVals.xForVLabelsL_, g_chartVals.hOffset_, true );

		    // Right.
		    chrt_createVerticalLabels( stage_, chart_, vLabelsID_ + s_strVLabelsRight, h_, w_,
		                               g_chartVals.fontSize_, g_chartVals.colorText_,
		                               g_chartVals.nbrYSlots_, null, ( highestValue_ * .5 ),
		                               xForVLabelsR_, g_chartVals.hOffset_, false );

		    // Draw chart lines and points.
        length_ = arrayStat_.length;
        for ( var i = 0; i < length_; i++ ) {
          if ( stc_isDefined( arrayStat_[i] ) ) {
		        if ( stc_isDefined( arrayStat_[i].stat_ ) && stc_isDefined( arrayStat_[i].stroke_ ) ) {
					    if ( arrayStat_[i].stat_.length < 1 ) { arrayStat_[i].stat_ = [0,0,0,0,0,0,0,0,0,0]; }
					    var lineID_ = "chartLine" + i + "_";
					    chrt_createChartLine( stage_, chart_, stc_getIdentifier( subID_, s_strChartLine + lineID_ ),
					                          arrayStat_[i].stat_, highestValue_, h_, w_, arrayStat_[i].stroke_,
					                          g_chartVals.nbrSlots_, g_chartVals.hOffset_, g_chartVals.wOffset_,
					                          g_chartVals.showPoints_, g_chartVals.radiusPoint_,
					                          mouseoverChart_, mouseOutTooltipLocal, false, null );
		        }//stat_ stroke_ valid
          }//entry valid
        }//for length

		    // Move legend to top.
		    var legend_ = stc_getElement( stc_getIdentifier( subID_, s_strLegend ), stage_ );
		    if ( legend_ ) { legend_.moveToTop(); }

		    // Draw layer.
		    layer_.draw();

		    // Set title.
		    titleChart_.html( titleText_ );

		    // Set chart fill.
		    chrt_setChartFill( chartContainerMain_, s_grayE );

		    // Show chart.
		    chrt_showChart( chartContainerMain_, chartContainer_, titleChart_, null );
		  }//h_ w_ valid
    }//parameters valid
  }//makeCharts

  // MOUSEOVER CHART 0.
  function mouseoverChart0( event ) {
    if ( event.targetNode ) {
      var shape_ = event.targetNode;
      if ( shape_ && $( "#_chartContainerMain0" ) && stc_isDefined( g_stageChart0.getMousePosition() ) ) {
        var mousePos_ = g_stageChart0.getMousePosition();
        var x_ = $( "#_chartContainerMain0" ).position().left + mousePos_.x + 20;
        var y_ = $( "#_chartContainerMain0" ).position().top + mousePos_.y + 20;
        stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
        stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 40, true );
      }//parameters valid
    }//targetNode valid
  }//mouseoverChart0

  // MOUSEOVER CHART 1.
  function mouseoverChart1( event ) {
    if ( event.targetNode ) {
      var shape_ = event.targetNode;
      if ( shape_ && $( "#_chartContainerMain1" ) && stc_isDefined( g_stageChart1.getMousePosition() ) ) {
        var mousePos_ = g_stageChart1.getMousePosition();
        var x_ = $( "#_chartContainerMain1" ).position().left + mousePos_.x + 20;
        var y_ = $( "#_chartContainerMain1" ).position().top + mousePos_.y + 20;
        stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
        stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 40, true );
      }//parameters valid
    }//targetNode valid
  }//mouseoverChart1

  // BLINK CHART.
  function blinkChart() {
    var opacity_ = "";

    if ( $( "#_iconChartTimer0" ) ) {
      opacity_ = $( "#_iconChartTimer0" ).css( "opacity" );
      if ( opacity_ == 1.0 ) {
        $( "#_iconChartTimer0" ).css( "opacity", "0.5" );
      } else {
        $( "#_iconChartTimer0" ).css( "opacity", "1.0" );
      }//opacity_ not 1.0
    }//_iconChartTimer0 valid

    if ( g_list == s_listType.replication_ || g_list == s_listType.chainedReplication_ ) {
	    if ( $( "#_iconChartTimer1" ) ) {
	      opacity_ = $( "#_iconChartTimer1" ).css( "opacity" );
	      if ( opacity_ == 1.0 ) {
	        $( "#_iconChartTimer1" ).css( "opacity", "0.5" );
	      } else {
	        $( "#_iconChartTimer1" ).css( "opacity", "1.0" );
	      }//opacity_ not 1.0
	    }//_iconChartTimer1 valid
    }//replication_ or chainedReplication_
  }//blinkChart

  // ============================================================================
  // UTILITY.
  // ============================================================================

  // MOUSE OUT TOOLTIP LOCAL.
  function mouseOutTooltipLocal( event ) {
    stc_mouseOutTooltip( $( "#_tooltip" ), event );
  }//mouseOutTooltipLocal

  // ============================================================================
  // LIST AGENT DETAILS.
  // Note: lists are 940 pixels wide.
  // ============================================================================

  // ============================================================================
  // LIST REPLICATION.
  // ============================================================================

  // BUILD HEADER REPLICATION PRIMARY.
  function buildHeaderReplicationPrimary() {
    // Set list title.
    $( "#_titleListP" ).html( g_uiStr.titleListRep0_ );

    // Set td widths.
    var w0_  = "35px"; var w1_  = "35px";  var w2_  = "75px"; var w3_  = "75px";
    var w4_  = "40px"; var w5_  = "75px";  var w6_  = "35px"; var w7_  = "65px";
    var w8_  = "55px"; var w9_  = "60px";  var w10_ = "40px"; var w11_ = "70px";
    var w12_ = "40px"; var w13_ = "125px"; var w14_ = "60px"; var w15_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Agent'                             ><div>Agent</div>                  </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + "; text-align: right;' title='Shards'         ><div>Shards</div>                 </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Version'                           ><div>Version</div>                </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Host'                              ><div>Host</div>                   </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='PID'                               ><div>PID</div>                    </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Agent role'                        ><div>Agent role</div>             </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Log TPS'                           ><div>Log TPS</div>                </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Last logged transaction'           ><div>Last logged transaction</div></td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Remote Replicator'                 ><div>Remote replicator</div>      </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Last remote replicated transaction'><div>Last remote repl TX</div>    </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Uptime'                            ><div>Uptime</div>                 </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + ";' title='Memory'                            ><div>Memory</div>                 </td>" +
    "<td width='" + w12_ + "' style='min-width: " + w12_ + ";' title='Threads'                           ><div>Threads</div>                </td>" +
    "<td width='" + w13_ + "' style='min-width: " + w13_ + ";' title='Stats'                             ><div>Stats</div>                  </td>" +
    "<td width='" + w14_ + "' style='min-width: " + w14_ + ";' title='Last update'                       ><div>Last update</div>            </td>" +
    "<td width='" + w15_ + "' style='min-width: " + w15_ + ";' title='Status'                            ><div>Status</div>                 </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderReplicationPrimary

  // BUILD DATA REPLICATION PRIMARY.
  function buildDataReplicationPrimary( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "35px"; var w1_  = "35px";  var w2_  = "75px"; var w3_  = "75px";
	    var w4_  = "40px"; var w5_  = "75px";  var w6_  = "35px"; var w7_  = "65px";
	    var w8_  = "55px"; var w9_  = "60px";  var w10_ = "40px"; var w11_ = "70px";
	    var w12_ = "40px"; var w13_ = "125px"; var w14_ = "60px"; var w15_ = "55px";

      // Init display values.
      var agent_            = s_message.notFound_;
      var shards_           = s_message.notFound_;
      var version_          = s_message.notFound_;
      var host_             = s_message.notFound_;
      var PID_              = s_message.notFound_;
      var role_             = s_message.notFound_;
      var logTPS_           = s_message.notFound_;
      var loggedTXLast_     = s_message.notFound_;
      var remoteReplicator_ = s_message.notFound_;
      var remoteReplTXLast_ = s_message.notFound_;
      var uptime_           = s_message.notFound_;
      var memoryPercent_    = s_message.notFound_;
      var mb_               = s_message.notFound_;
      var threads_          = s_message.notFound_;
      var stats_            = s_message.notFound_;
      var updateLast_       = s_message.notFound_;
      var status_           = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )            { agent_            = entry_.agent; }
      if ( stc_isDefined( entry_.shards ) )           { shards_           = stc_addCommas( parseInt( entry_.shards ) ); }
      if ( stc_isDefined( entry_.version ) )          { version_          = entry_.version; }
      if ( stc_isDefined( entry_.host ) )             { host_             = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )              { PID_              = entry_.PID; }
      if ( stc_isDefined( entry_.role ) )             { role_             = entry_.role; }
      if ( stc_isDefined( entry_.logTPS ) )           { logTPS_           = stc_addCommas( parseInt( entry_.logTPS ) ); }
      if ( stc_isDefined( entry_.loggedTXLast ) )     { loggedTXLast_     = stc_addCommas( parseInt( entry_.loggedTXLast ) ); }
      if ( stc_isDefined( entry_.remoteReplicator ) ) { remoteReplicator_ = entry_.remoteReplicator; }
      if ( stc_isDefined( entry_.remoteReplTXLast ) ) { remoteReplTXLast_ = entry_.remoteReplTXLast; }
      if ( stc_isDefined( entry_.uptime ) )           { uptime_           = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) )    { memoryPercent_    = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )               { mb_               = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )          { threads_          = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )            { stats_            = entry_.stats; }
      if ( stc_isDefined( entry_.updateLast ) )       { updateLast_       = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )           { status_           = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w11_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w15_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataP' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + "; text-align: right;' >" + shards_           + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + version_          + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + host_             + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + PID_              + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + ";'                    >" + role_             + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;' >" + logTPS_           + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + "; text-align: right;' >" + loggedTXLast_     + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + ";'                    >" + remoteReplicator_ + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + ";'                    >" + remoteReplTXLast_ + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + uptime_           + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w12_ + "' style='min-width: " + w12_ + "; text-align: right;' >" + threads_          + "</td>" +
             "<td class='lsCell' width='" + w13_ + "' style='min-width: " + w13_ + ";'                    >" + stats_            + "</td>" +
             "<td class='lsCell' width='" + w14_ + "' style='min-width: " + w14_ + ";'                    >" + updateLast_       + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataReplicationPrimary

  // BUILD HEADER REPLICATION SECONDARY.
  function buildHeaderReplicationSecondary() {
    // Set list title.
    $( "#_titleListS0" ).html( g_uiStr.titleListRep1_ );

    // Set td widths.
    var w0_  = "35px"; var w1_  = "35px";  var w2_  = "75px"; var w3_  = "75px";
    var w4_  = "35px"; var w5_  = "70px";  var w6_  = "30px"; var w7_  = "60px";
    var w8_  = "50px"; var w9_  = "55px";  var w10_ = "35px"; var w11_ = "65px";
    var w12_ = "35px"; var w13_ = "120px"; var w14_ = "60px"; var w15_ = "50px";
    var w16_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Agent'                           ><div>Agent</div>                  </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + "; text-align: right;' title='Shards'       ><div>Shards</div>                 </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Version'                         ><div>Version</div>                </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Host'                            ><div>Host</div>                   </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='PID'                             ><div>PID</div>                    </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Agent role'                      ><div>Agent role</div>             </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Log TPS'                         ><div>Log TPS</div>                </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Last logged transaction'         ><div>Last logged transaction</div></td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Local Applier'                   ><div>Local Applier</div>          </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Last locally applied transaction'><div>Last locally applied TX</div></td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Uptime'                          ><div>Uptime</div>                 </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + ";' title='Memory'                          ><div>Memory</div>                 </td>" +
    "<td width='" + w12_ + "' style='min-width: " + w12_ + ";' title='Threads'                         ><div>Threads</div>                </td>" +
    "<td width='" + w13_ + "' style='min-width: " + w13_ + ";' title='Stats'                           ><div>Stats</div>                  </td>" +
    "<td width='" + w14_ + "' style='min-width: " + w14_ + ";' title='Suspect transaction'             ><div>Suspect TX</div>             </td>" +
    "<td width='" + w15_ + "' style='min-width: " + w15_ + ";' title='Last update'                     ><div>Last update</div>            </td>" +
    "<td width='" + w16_ + "' style='min-width: " + w16_ + ";' title='Status'                          ><div>Status</div>                 </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderReplicationSecondary

  // BUILD DATA REPLICATION SECONDARY.
  function buildDataReplicationSecondary( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "35px"; var w1_  = "35px";  var w2_  = "75px"; var w3_  = "75px";
	    var w4_  = "35px"; var w5_  = "70px";  var w6_  = "30px"; var w7_  = "60px";
	    var w8_  = "50px"; var w9_  = "55px";  var w10_ = "35px"; var w11_ = "65px";
	    var w12_ = "35px"; var w13_ = "120px"; var w14_ = "60px"; var w15_ = "50px";
	    var w16_ = "55px";

      // Init display values.
      var agent_           = s_message.notFound_;
      var shards_          = s_message.notFound_;
      var version_         = s_message.notFound_;
      var host_            = s_message.notFound_;
      var PID_             = s_message.notFound_;
      var role_            = s_message.notFound_;
      var logTPS_          = s_message.notFound_;
      var loggedTXLast_    = s_message.notFound_;
      var localApplier_    = s_message.notFound_;
      var localApplTXLast_ = s_message.notFound_;
      var uptime_          = s_message.notFound_;
      var memoryPercent_   = s_message.notFound_;
      var mb_              = s_message.notFound_;
      var threads_         = s_message.notFound_;
      var stats_           = s_message.notFound_;
      var suspectTX_       = s_message.notFound_;
      var updateLast_      = s_message.notFound_;
      var status_          = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )           { agent_           = entry_.agent; }
      if ( stc_isDefined( entry_.shards ) )          { shards_          = stc_addCommas( parseInt( entry_.shards ) ); }
      if ( stc_isDefined( entry_.version ) )         { version_         = entry_.version; }
      if ( stc_isDefined( entry_.host ) )            { host_            = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )             { PID_             = entry_.PID; }
      if ( stc_isDefined( entry_.role ) )            { role_            = entry_.role; }
      if ( stc_isDefined( entry_.logTPS ) )          { logTPS_          = stc_addCommas( parseInt( entry_.logTPS ) ); }
      if ( stc_isDefined( entry_.loggedTXLast ) )    { loggedTXLast_    = stc_addCommas( parseInt( entry_.loggedTXLast ) ); }
      if ( stc_isDefined( entry_.localApplier ) )    { localApplier_    = entry_.localApplier; }
      if ( stc_isDefined( entry_.localApplTXLast ) ) { localApplTXLast_ = entry_.localApplTXLast; }
      if ( stc_isDefined( entry_.uptime ) )          { uptime_          = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) )   { memoryPercent_   = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )              { mb_              = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )         { threads_         = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )           { stats_           = entry_.stats; }
      if ( stc_isDefined( entry_.suspectTX ) )       { suspectTX_       = entry_.suspectTX; }
      if ( stc_isDefined( entry_.updateLast ) )      { updateLast_      = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )          { status_          = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w11_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w16_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataS0' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + "; text-align: right;' >" + shards_           + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + version_          + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + host_             + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + PID_              + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + ";'                    >" + role_             + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;' >" + logTPS_           + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + "; text-align: right;' >" + loggedTXLast_     + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + ";'                    >" + localApplier_ + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + ";'                    >" + localApplTXLast_ + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + uptime_           + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w12_ + "' style='min-width: " + w12_ + "; text-align: right;' >" + threads_          + "</td>" +
             "<td class='lsCell' width='" + w13_ + "' style='min-width: " + w13_ + ";'                    >" + stats_            + "</td>" +
             "<td class='lsCell' width='" + w14_ + "' style='min-width: " + w14_ + ";'                    >" + suspectTX_       + "</td>" +
             "<td class='lsCell' width='" + w15_ + "' style='min-width: " + w15_ + ";'                    >" + updateLast_       + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataReplicationSecondary

  // ============================================================================
  // LIST CHAINED REPLICATION.
  // ============================================================================

  // BUILD HEADER CHAINED REPLICATION SENDER.
  function buildHeaderCReplicationSender() {
    // Set list title.
    $( "#_titleListP" ).html( g_uiStr.titleListChainSend_ );

    // Set td widths.
    var w0_  = "35px"; var w1_ = "75px"; var w2_  = "75px";  var w3_  = "35px";
    var w4_  = "70px"; var w5_ = "50px"; var w6_  = "55px";  var w7_  = "35px";
    var w8_  = "65px"; var w9_ = "40px"; var w10_ = "115px"; var w11_ = "50px";
    var w12_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + "px;' title='Agent'                     ><div>Agent</div>             </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + "px;' title='Version'                   ><div>Version</div>           </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + "px;' title='Host'                      ><div>Host</div>              </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + "px;' title='PID'                       ><div>PID</div>               </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + "px;' title='Agent role'                ><div>Agent role</div>        </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + "px;' title='Remote Replicator'         ><div>Remote Replicator</div> </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + "px;' title='Last Remotely Replicated'  ><div>Last Remotely Repl</div></td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + "px;' title='Uptime'                    ><div>Uptime</div>            </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + "px;' title='Memory'                    ><div>Memory</div>            </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + "px;' title='Threads'                   ><div>Threads</div>           </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + "px;' title='Stats'                     ><div>Stats</div>             </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + "px;' title='Last update'               ><div>Last update</div>       </td>" +
    "<td width='" + w12_ + "' style='min-width: " + w12_ + "px;' title='Status'                    ><div>Status</div>            </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderCReplicationSender

  // BUILD DATA CHAINED REPLICATION SENDER.
  function buildDataCReplicationSender( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "35px"; var w1_ = "75px"; var w2_  = "75px";  var w3_  = "35px";
	    var w4_  = "70px"; var w5_ = "50px"; var w6_  = "55px";  var w7_  = "35px";
	    var w8_  = "65px"; var w9_ = "40px"; var w10_ = "115px"; var w11_ = "50px";
	    var w12_ = "55px";

      // Init display values.
      var agent_            = s_message.notFound_;
      var version_          = s_message.notFound_;
      var host_             = s_message.notFound_;
      var PID_              = s_message.notFound_;
      var role_             = s_message.notFound_;
      var remoteReplicator_ = s_message.notFound_;
      var remoteReplLast_   = s_message.notFound_;
      var uptime_           = s_message.notFound_;
      var memoryPercent_    = s_message.notFound_;
      var mb_               = s_message.notFound_;
      var threads_          = s_message.notFound_;
      var stats_            = s_message.notFound_;
      var updateLast_       = s_message.notFound_;
      var status_           = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )            { agent_             = entry_.agent; }
      if ( stc_isDefined( entry_.version ) )          { version_           = entry_.version; }
      if ( stc_isDefined( entry_.host ) )             { host_              = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )              { PID_               = entry_.PID; }
      if ( stc_isDefined( entry_.role ) )             { role_              = entry_.role; }
      if ( stc_isDefined( entry_.remoteReplicator ) ) { remoteReplicator_  = entry_.remoteReplicator; }
      if ( stc_isDefined( entry_.remoteReplLast ) )   { remoteReplLast_    = entry_.remoteReplLast; }
      if ( stc_isDefined( entry_.uptime ) )           { uptime_            = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) )    { memoryPercent_     = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )               { mb_                = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )          { threads_           = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )            { stats_             = entry_.stats; }
      if ( stc_isDefined( entry_.updateLast ) )       { updateLast_        = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )           { status_            = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w8_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w12_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataP' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                    >" + version_          + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + host_             + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + PID_              + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + role_             + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + ";'                    >" + remoteReplicator_ + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + ";'                    >" + remoteReplLast_   + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + ";'                    >" + uptime_           + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + "; text-align: right;' >" + threads_          + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + stats_            + "</td>" +
             "<td class='lsCell' width='" + w11_ + "' style='min-width: " + w11_ + ";'                    >" + updateLast_       + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataCReplicationSender

  // BUILD HEADER CHAINED REPLICATION RECEIVER 0.
  function buildHeaderCReplicationReceiver0() {
    // Set list title.
    $( "#_titleListS0" ).html( g_uiStr.titleListChainRec0_ );

    // Set td widths.
    var w0_  = "35px"; var w1_  = "75px";  var w2_  = "75px"; var w3_  = "35px";
    var w4_  = "70px"; var w5_  = "35px";  var w6_  = "35px"; var w7_  = "65px";
    var w8_  = "40px"; var w9_  = "115px"; var w10_ = "50px"; var w11_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Agent'      ><div>Agent</div>      </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Version'    ><div>Version</div>    </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Host'       ><div>Host</div>       </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='PID'        ><div>PID</div>        </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Agent role' ><div>Agent role</div> </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Throughput' ><div>Throughput</div> </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Uptime'     ><div>Uptime</div>     </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Memory'     ><div>Memory</div>     </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Threads'    ><div>Threads</div>    </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Stats'      ><div>Stats</div>      </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Last update'><div>Last update</div></td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + ";' title='Status'     ><div>Status</div>     </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderCReplicationReceiver0

  // BUILD DATA CHAINED REPLICATION RECEIVER 0.
  function buildDataCReplicationReceiver0( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "35px"; var w1_  = "75px";  var w2_  = "75px"; var w3_  = "35px";
	    var w4_  = "70px"; var w5_  = "35px";  var w6_  = "35px"; var w7_  = "65px";
	    var w8_  = "40px"; var w9_  = "115px"; var w10_ = "50px"; var w11_ = "55px";

      // Init display values.
      var agent_         = s_message.notFound_;
      var version_       = s_message.notFound_;
      var host_          = s_message.notFound_;
      var PID_           = s_message.notFound_;
      var role_          = s_message.notFound_;
      var throughput_    = s_message.notFound_;
      var uptime_        = s_message.notFound_;
      var memoryPercent_ = s_message.notFound_;
      var mb_            = s_message.notFound_;
      var threads_       = s_message.notFound_;
      var stats_         = s_message.notFound_;
      var updateLast_    = s_message.notFound_;
      var status_        = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )         { agent_         = entry_.agent; }
      if ( stc_isDefined( entry_.version ) )       { version_       = entry_.version; }
      if ( stc_isDefined( entry_.host ) )          { host_          = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )           { PID_           = entry_.PID; }
      if ( stc_isDefined( entry_.role ) )          { role_          = entry_.role; }
      if ( stc_isDefined( entry_.throughput ) )    { throughput_    = stc_addCommas( parseInt( entry_.throughput ) ); }
      if ( stc_isDefined( entry_.uptime ) )        { uptime_        = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) ) { memoryPercent_ = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )            { mb_            = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )       { threads_       = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )         { stats_         = entry_.stats; }
      if ( stc_isDefined( entry_.updateLast ) )    { updateLast_    = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )        { status_        = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w7_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w11_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataS0' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                    >" + version_    + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + host_       + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + PID_        + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + role_       + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + "; text-align: right;' >" + throughput_ + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + ";'                    >" + uptime_     + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;' >" + threads_    + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + ";'                    >" + stats_      + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + updateLast_ + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataCReplicationReceiver0

  // BUILD HEADER CHAINED REPLICATION RECEIVER 1.
  function buildHeaderCReplicationReceiver1() {
    // Set list title.
    $( "#_titleListS1" ).html( g_uiStr.titleListChainRec1_ );

    // Set td widths.
    var w0_  = "35px"; var w1_  = "75px";  var w2_  = "75px"; var w3_  = "35px";
    var w4_  = "70px"; var w5_  = "35px";  var w6_  = "35px"; var w7_  = "65px";
    var w8_  = "40px"; var w9_  = "115px"; var w10_ = "50px"; var w11_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Agent'      ><div>Agent</div>      </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Version'    ><div>Version</div>    </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Host'       ><div>Host</div>       </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='PID'        ><div>PID</div>        </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Agent role' ><div>Agent role</div> </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Throughput' ><div>Throughput</div> </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Uptime'     ><div>Uptime</div>     </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Memory'     ><div>Memory</div>     </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Threads'    ><div>Threads</div>    </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Stats'      ><div>Stats</div>      </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Last update'><div>Last update</div></td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + ";' title='Status'     ><div>Status</div>     </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderCReplicationReceiver1

  // BUILD DATA CHAINED REPLICATION RECEIVER 1.
  function buildDataCReplicationReceiver1( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "35px"; var w1_  = "75px";  var w2_  = "75px"; var w3_  = "35px";
	    var w4_  = "70px"; var w5_  = "35px";  var w6_  = "35px"; var w7_  = "65px";
	    var w8_  = "40px"; var w9_  = "115px"; var w10_ = "50px"; var w11_ = "55px";

      // Init display values.
      var agent_         = s_message.notFound_;
      var version_       = s_message.notFound_;
      var host_          = s_message.notFound_;
      var PID_           = s_message.notFound_;
      var role_          = s_message.notFound_;
      var throughput_    = s_message.notFound_;
      var uptime_        = s_message.notFound_;
      var memoryPercent_ = s_message.notFound_;
      var mb_            = s_message.notFound_;
      var threads_       = s_message.notFound_;
      var stats_         = s_message.notFound_;
      var updateLast_    = s_message.notFound_;
      var status_        = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )         { agent_         = entry_.agent; }
      if ( stc_isDefined( entry_.version ) )       { version_       = entry_.version; }
      if ( stc_isDefined( entry_.host ) )          { host_          = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )           { PID_           = entry_.PID; }
      if ( stc_isDefined( entry_.role ) )          { role_          = entry_.role; }
      if ( stc_isDefined( entry_.throughput ) )    { throughput_    = stc_addCommas( parseInt( entry_.throughput ) ); }
      if ( stc_isDefined( entry_.uptime ) )        { uptime_        = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) ) { memoryPercent_ = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )            { mb_            = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )       { threads_       = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )         { stats_         = entry_.stats; }
      if ( stc_isDefined( entry_.updateLast ) )    { updateLast_    = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )        { status_        = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w7_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w11_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataS1' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                    >" + version_    + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + host_       + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + PID_        + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + role_       + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + "; text-align: right;' >" + throughput_ + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + ";'                    >" + uptime_     + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;' >" + threads_    + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + ";'                    >" + stats_      + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + updateLast_ + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataCReplicationReceiver1

  // ============================================================================
  // QUERY.
  // ============================================================================

  // BUILD HEADER QUERY.
  function buildHeaderQuery() {
    // Set list title.
    $( "#_titleListP" ).html( g_uiStr.titleListQuery_ );

    // Set td widths.
    var w0_  = "35px"; var w1_ = "75px"; var w2_  = "85px"; var w3_  = "35px";
    var w4_  = "35px"; var w5_ = "75px"; var w6_  = "35px"; var w7_  = "100px";
    var w8_  = "35px"; var w9_ = "35px"; var w10_ = "35px"; var w11_ = "50px";
    var w12_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + "px;' title='Agent'        ><div>Agent</div>       </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + "px;' title='Version'      ><div>Version</div>      </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + "px;' title='Host'         ><div>Host</div>         </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + "px;' title='PID'          ><div>PID</div>          </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + "px;' title='Uptime'       ><div>Uptime</div>       </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + "px;' title='Memory'       ><div>Memory</div>       </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + "px;' title='Threads'      ><div>Threads</div>      </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + "px;' title='Current stats'><div>Current stats</div></td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + "px;' title='Query success'>Query success</div>     </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + "px;' title='Query failure'><div>Query failure</div></td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + "px;' title='Rollup count' ><div>Rollup count</div> </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + "px;' title='Last update'  ><div>Last update</div>  </td>" +
    "<td width='" + w12_ + "' style='min-width: " + w12_ + "px;' title='Status'       ><div>Status</div>       </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderQuery

  // BUILD DATA QUERY.
  function buildDataQuery( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "35px"; var w1_ = "75px"; var w2_  = "85px"; var w3_  = "35px";
	    var w4_  = "35px"; var w5_ = "75px"; var w6_  = "35px"; var w7_  = "100px";
	    var w8_  = "35px"; var w9_ = "35px"; var w10_ = "35px"; var w11_ = "50px";
	    var w12_ = "55px";

      // Init display values.
      var agent_         = s_message.notFound_;
      var version_       = s_message.notFound_;
      var host_          = s_message.notFound_;
      var PID_           = s_message.notFound_;
      var uptime_        = s_message.notFound_;
      var memoryPercent_ = s_message.notFound_;
      var mb_            = s_message.notFound_;
      var threads_       = s_message.notFound_;
      var stats_         = s_message.notFound_;
      var querySuccess_  = s_message.notFound_;
      var queryFailure_  = s_message.notFound_;
      var rollupCount_   = s_message.notFound_;
      var updateLast_    = s_message.notFound_;
      var status_        = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )         { agent_         = entry_.agent; }
      if ( stc_isDefined( entry_.version ) )       { version_       = entry_.version; }
      if ( stc_isDefined( entry_.host ) )          { host_          = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )           { PID_           = entry_.PID; }
      if ( stc_isDefined( entry_.uptime ) )        { uptime_        = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) ) { memoryPercent_ = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )            { mb_            = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )       { threads_       = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )         { stats_         = entry_.stats; }
      if ( stc_isDefined( entry_.querySuccess ) )  { querySuccess_  = stc_addCommas( parseInt( entry_.querySuccess ) ); }
      if ( stc_isDefined( entry_.queryFailure ) )  { queryFailure_  = stc_addCommas( parseInt( entry_.queryFailure ) ); }
      if ( stc_isDefined( entry_.rollupCount ) )   { rollupCount_   = stc_addCommas( parseInt( entry_.rollupCount ) ); }
      if ( stc_isDefined( entry_.updateLast ) )    { updateLast_    = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )        { status_        = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w5_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w12_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataP' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                    >" + version_      + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + host_         + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + PID_          + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + uptime_       + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;' >" + threads_      + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + ";'                    >" + stats_        + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;' >" + querySuccess_ + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + "; text-align: right;' >" + queryFailure_ + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + "; text-align: right;' >" + rollupCount_  + "</td>" +
             "<td class='lsCell' width='" + w11_ + "' style='min-width: " + w11_ + ";'                    >" + updateLast_   + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataQuery

  // ============================================================================
  // PROCEDURE.
  // ============================================================================

  // BUILD HEADER PROCEDURE.
  function buildHeaderProcedure() {
    // Set list title.
    $( "#_titleListP" ).html( g_uiStr.titleListProcedure_ );

    // Set td widths.
    var w0_ = "35px"; var w1_ = "75px"; var w2_  = "85px"; var w3_  = "35px";
    var w4_ = "35px"; var w5_ = "75px"; var w6_  = "35px"; var w7_  = "100px";
    var w8_ = "35px"; var w9_ = "35px"; var w10_ = "50px"; var w11_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + "px;' title='Agent'        ><div>Agent</div>        </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + "px;' title='Version'      ><div>Version</div>      </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + "px;' title='Host'         ><div>Host</div>         </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + "px;' title='PID'          ><div>PID</div>          </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + "px;' title='Uptime'       ><div>Uptime</div>       </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + "px;' title='Memory'       ><div>Memory</div>       </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + "px;' title='Threads'      ><div>Threads</div>      </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + "px;' title='Current stats'><div>Current stats</div></td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + "px;' title='Query success'><div>Query success</div></td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + "px;' title='Query failure'><div>Query failure</div></td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + "px;' title='Last update'  ><div>Last update</div>  </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + "px;' title='Status'       ><div>Status</div>       </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderProcedure

  // BUILD DATA PROCEDURE.
  function buildDataProcedure( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "35px"; var w1_ = "75px"; var w2_  = "85px"; var w3_  = "35px";
	    var w4_ = "35px"; var w5_ = "75px"; var w6_  = "35px"; var w7_  = "100px";
	    var w8_ = "35px"; var w9_ = "35px"; var w10_ = "50px"; var w11_ = "55px";

      // Init display values.
      var agent_         = s_message.notFound_;
      var version_       = s_message.notFound_;
      var host_          = s_message.notFound_;
      var PID_           = s_message.notFound_;
      var uptime_        = s_message.notFound_;
      var memoryPercent_ = s_message.notFound_;
      var mb_            = s_message.notFound_;
      var threads_       = s_message.notFound_;
      var stats_         = s_message.notFound_;
      var querySuccess_  = s_message.notFound_;
      var queryFailure_  = s_message.notFound_;
      var updateLast_    = s_message.notFound_;
      var status_        = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )         { agent_         = entry_.agent; }
      if ( stc_isDefined( entry_.version ) )       { version_       = entry_.version; }
      if ( stc_isDefined( entry_.host ) )          { host_          = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )           { PID_           = entry_.PID; }
      if ( stc_isDefined( entry_.uptime ) )        { uptime_        = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) ) { memoryPercent_ = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )            { mb_            = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )       { threads_       = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.stats ) )         { stats_         = entry_.stats; }
      if ( stc_isDefined( entry_.querySuccess ) )  { querySuccess_  = stc_addCommas( parseInt( entry_.querySuccess ) ); }
      if ( stc_isDefined( entry_.queryFailure ) )  { queryFailure_  = stc_addCommas( parseInt( entry_.queryFailure ) ); }
      if ( stc_isDefined( entry_.updateLast ) )    { updateLast_    = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )        { status_        = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w5_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w11_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataP' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                    >" + version_      + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + host_         + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + PID_          + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + uptime_       + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;' >" + threads_      + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + ";'                    >" + stats_        + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;' >" + querySuccess_ + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + "; text-align: right;' >" + queryFailure_ + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + updateLast_   + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataProcedure

  // ============================================================================
  // STREAM.
  // ============================================================================

  // BUILD HEADER STREAM.
  function buildHeaderStream() {
    // Set list title.
    $( "#_titleListP" ).html( g_uiStr.titleListStream_ );

    // Set td widths.
    var w0_ = "35px";  var w1_ = "75px"; var w2_  = "85px"; var w3_  = "35px";
    var w4_ = "100px"; var w5_ = "35px"; var w6_  = "75px"; var w7_  = "35px";
    var w8_ = "35px";  var w9_ = "60px"; var w10_ = "50px"; var w11_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + "px;' title='Agent'             ><div>Agent</div>             </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + "px;' title='Version'           ><div>Version</div>           </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + "px;' title='Host'              ><div>Host</div>              </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + "px;' title='PID'               ><div>PID</div>               </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + "px;' title='Replication state' ><div>Replication state</div> </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + "px;' title='Uptime'            ><div>Uptime</div>            </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + "px;' title='Memory'            ><div>Memory</div>            </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + "px;'' title='Threads'          ><div>Threads</div>           </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + "px;'' title='Replication TPS'  ><div>Replication TPS</div>   </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + "px;' title='Last replicated TX'><div>Last replicated TX</div></td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + "px;' title='Last update'       ><div>Last update</div>       </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + "px;' title='Status'            ><div>Status</div>            </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderStream

  // BUILD DATA STREAM.
  function buildDataStream( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "35px";  var w1_ = "75px"; var w2_  = "85px"; var w3_  = "35px";
	    var w4_ = "100px"; var w5_ = "35px"; var w6_  = "75px"; var w7_  = "35px";
	    var w8_ = "35px";  var w9_ = "60px"; var w10_ = "50px"; var w11_ = "55px";

      // Init display values.
      var agent_            = s_message.notFound_;
      var version_          = s_message.notFound_;
      var host_             = s_message.notFound_;
      var PID_              = s_message.notFound_;
      var replicationState_ = s_message.notFound_;
      var uptime_           = s_message.notFound_;
      var memoryPercent_    = s_message.notFound_;
      var mb_               = s_message.notFound_;
      var threads_          = s_message.notFound_;
      var replicatonTPS_    = s_message.notFound_;
      var replTXLast_       = s_message.notFound_;
      var updateLast_       = s_message.notFound_;
      var status_           = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.agent ) )            { agent_            = entry_.agent; }
      if ( stc_isDefined( entry_.version ) )          { version_          = entry_.version; }
      if ( stc_isDefined( entry_.host ) )             { host_             = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )              { PID_              = entry_.PID; }
      if ( stc_isDefined( entry_.replicationState ) ) { replicationState_ = entry_.replicationState; }
      if ( stc_isDefined( entry_.uptime ) )           { uptime_           = entry_.uptime; }
      if ( stc_isDefined( entry_.memoryPercent ) )    { memoryPercent_    = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )               { mb_               = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )          { threads_          = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.replicatonTPS ) )    { replicatonTPS_    = stc_addCommas( parseInt( entry_.replicatonTPS ) ); }
      if ( stc_isDefined( entry_.replTXLast ) )       { replTXLast_       = entry_.replTXLast; }
      if ( stc_isDefined( entry_.updateLast ) )       { updateLast_       = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )           { status_           = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w6_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w11_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w0_ + "' style='min-width: " + w0_ + ";'" +
                           " title='(process " + PID_ + " on " + host_ + ")'" + ">" +
                           "<a href='#'>" + agent_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataP' data-selected='false'>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                    >" + version_          + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                    >" + host_             + "</td>" +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                    >" + PID_              + "</td>" +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                    >" + replicationState_ + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + ";'                    >" + uptime_           + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + "; text-align: right;' >" + threads_          + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;' >" + replicatonTPS_    + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + ";'                    >" + replTXLast_       + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + ";'                    >" + updateLast_       + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataStream

  // ============================================================================
  // DRILLDOWN.
  // ============================================================================

  // BUILD HEADER MESSAGES.
  function buildHeaderMessages() {
    // Set list title.
    $( "#titleListDD0" ).html( g_uiStr.titleMessageStats_ );

    // Set td widths.
    var w0_ = "60px"; var w1_ = "60px"; var w2_ = "60px"; var w3_ = "60px";
    var w4_ = "60px"; var w5_ = "60px"; var w6_ = "60px"; var w7_ = "60px";
    var w8_ = "60px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Channel'            ><div>Channel</div></div>      </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Message count'      ><div>Message count</div>      </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Message/sec'        ><div>Message/sec</div>        </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Byte count'         ><div>Byte count</div>         </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Throughput MBs'     ><div>Throughput MBs</div>     </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Worker threads'     ><div>Worker threads</div>     </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Request timings'    ><div>Request timings</div>    </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Connections'        ><div>Connections</div>        </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Concurrent requests'><div>Concurrent requests</div></td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderMessages

  // BUILD DATA MESSAGES.
  function buildDataMessages( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "60px"; var w1_ = "60px"; var w2_ = "60px"; var w3_ = "60px";
	    var w4_ = "60px"; var w5_ = "60px"; var w6_ = "60px"; var w7_ = "60px";
	    var w8_ = "60px";

      // Init display values.
      var channel_            = s_message.notFound_;
      var messageCount_       = s_message.notFound_;
      var messagePerSecond_   = s_message.notFound_;
      var byteCount_          = s_message.notFound_;
      var throughputMB_       = s_message.notFound_;
      var workerThreads_      = s_message.notFound_;
      var requestTimings_     = s_message.notFound_;
      var connections_        = s_message.notFound_;
      var concurrentRequests_ = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.channel ) )            { channel_            = stc_addCommas( parseInt( entry_.channel ) ); }
      if ( stc_isDefined( entry_.messageCount ) )       { messageCount_       = stc_addCommas( parseInt( entry_.messageCount ) ); }
      if ( stc_isDefined( entry_.messagePerSecond ) )   { messagePerSecond_   = stc_addCommas( parseInt( entry_.messagePerSecond ) ); }
      if ( stc_isDefined( entry_.byteCount ) )          { byteCount_          = stc_addCommas( parseInt( entry_.byteCount ) ); }
      if ( stc_isDefined( entry_.throughputMB ) )       { throughputMB_       = stc_addCommas( parseInt( entry_.throughputMB ) ); }
      if ( stc_isDefined( entry_.workerThreads ) )      { workerThreads_      = stc_addCommas( parseInt( entry_.workerThreads ) ); }
      if ( stc_isDefined( entry_.requestTimings ) )     { requestTimings_     = stc_addCommas( parseInt( entry_.requestTimings ) ); }
      if ( stc_isDefined( entry_.connections ) )        { connections_        = stc_addCommas( parseInt( entry_.connections ) ); }
      if ( stc_isDefined( entry_.concurrentRequests ) ) { concurrentRequests_ = stc_addCommas( parseInt( entry_.concurrentRequests ) ); }

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataDDMessage'>" +
             "<td width='" + w0_  + "' style='min-width: " + w0_  + "; text-align: right; text-decoration: none;'>" + channel_  + "</td>" +
             "<td width='" + w1_  + "' style='min-width: " + w1_  + "; text-align: right;'>" + messageCount_       + "</td>" +
             "<td width='" + w2_  + "' style='min-width: " + w2_  + "; text-align: right;'>" + messagePerSecond_   + "</td>" +
             "<td width='" + w3_  + "' style='min-width: " + w3_  + "; text-align: right;'>" + byteCount_          + "</td>" +
             "<td width='" + w4_  + "' style='min-width: " + w4_  + "; text-align: right;'>" + throughputMB_       + "</td>" +
             "<td width='" + w5_  + "' style='min-width: " + w5_  + "; text-align: right;'>" + workerThreads_      + "</td>" +
             "<td width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;'>" + requestTimings_     + "</td>" +
             "<td width='" + w7_  + "' style='min-width: " + w7_  + "; text-align: right;'>" + connections_        + "</td>" +
             "<td width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;'>" + concurrentRequests_ + "</td>" +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataMessages

  // BUILD HEADER ALERTS.
  function buildHeaderAlerts() {
    // Set list title.
    $( "#titleListDD2" ).html( g_uiStr.titleAlerts_ );

    // Set td widths.
    var w0_ = "60px"; var w1_ = "94px"; var w2_ = "60px"; var w3_ = "60px";
    var w4_ = "94px"; var w5_ = "60px"; var w6_ = "60px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Alert #'     ><div>Alert #</div>     </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Host name'   ><div>Host name</div>   </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Process Name'><div>Process Name</div></td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Severity'    ><div>Severity</div>    </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Message'     ><div>Message</div>     </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Acknowledged'><div>Acknowledged</div></td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Time'        ><div>Time</div>        </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderAlerts

  // BUILD DATA ALERTS.
  function buildDataAlerts( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "60px"; var w1_ = "94px"; var w2_ = "60px"; var w3_ = "60px";
	    var w4_ = "94px"; var w5_ = "60px"; var w6_ = "60px";

      // Init display values.
      var alertNbr_     = s_message.notFound_;
      var hostName_     = s_message.notFound_;
      var processName_  = s_message.notFound_;
      var severity_     = s_message.notFound_;
      var message_      = s_message.notFound_;
      var acknowledged_ = s_message.notFound_;
      var time_         = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.alertNbr ) )     { alertNbr_     = stc_addCommas( parseInt( entry_.alertNbr ) ); }
      if ( stc_isDefined( entry_.hostName ) )     { hostName_     = entry_.hostName; }
      if ( stc_isDefined( entry_.processName ) )  { processName_  = entry_.processName; }
      if ( stc_isDefined( entry_.severity ) )     { severity_     = stc_addCommas( parseInt( entry_.severity ) ); }
      if ( stc_isDefined( entry_.message ) )      { message_      = entry_.message; }
      if ( stc_isDefined( entry_.acknowledged ) ) { acknowledged_ = entry_.acknowledged; }
      if ( stc_isDefined( entry_.time ) )         { time_         = entry_.time; }

      // Create severity cell.
      var cellSeverity_ = stc_createSeverityCell( w3_, severity_ );

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataDDAlert' data-selected='false'>" +
             "<td class='lsCell' width='" + w0_  + "' style='min-width: " + w0_  + "; text-align: right; text-decoration: none;'>" + alertNbr_ + "</td>" +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                   >" + hostName_     + "</td>" +
             "<td class='lsCell' width='" + w2_  + "' style='min-width: " + w2_  + ";'                   >" + processName_  + "</td>" +
             cellSeverity_ +
             "<td class='lsCell' width='" + w4_  + "' style='min-width: " + w4_  + ";'                   >" + message_      + "</td>" +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + ";'                   >" + acknowledged_ + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + ";'                   >" + time_         + "</td>" +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataAlerts

