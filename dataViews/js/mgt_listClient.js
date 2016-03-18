
  // ============================================================================
  // LIST CLIENT.
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
  var g_list = s_listType.client_;
  var g_cat  = s_listType.primary_;

  var g_statRequestType = "";

  // Services vals. Timer speed is not used, but is included for documentation.
  var g_svcVals = {
    nbrRowsReq_ : 16,
    nbrStatsReq_: 10,
    timerSpeed_ : 15000 };

  // Selected objects.
  var g_clientSelected = "";
  var g_titleSelected  = "";

  // View vals.
  var g_viewVals = {
    list_     : "list",
    drillDown_: "drillDown" };

  // Chart.
  var g_chart0 = null;

  // Chart stage/layer.
  var g_stageChart0 = null;
  var g_layerChart0 = null;

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
		xLegend_           : 54,
		yLegend_           : 7,
		colorTextLeg_      : s_gray5,
		colorStrokeLeg_    : s_gray5,
		// To size chart, use following values and mult by common factor (used 1.08 here).
		//hOffset_           : 32,
		//wOffset_           : 45,
		//hLabelOffset_      : 24,
		//xForVLabelsL_      : 10,
		//xForVLabelsROffset_: 68,
		hOffset_           : 38,
		wOffset_           : 48,
		hLabelOffset_      : 28,
		xForVLabelsL_      : 11,
		xForVLabelsROffset_: 82,
		// To size legend, use following values and mult by common factor.
		hLegend_           : 132,
		wLegend_           : 125 };

  // Chart/legend vals.
  var g_lineColor0 = s_color.orangeLight_; var g_lineColor1 = s_color.greenLight_;
  var g_lineColor2 = s_color.blueLight_;   var g_lineColor3 = s_color.tan_;
  var g_lineColor4 = s_color.turquoise_;   var g_lineColor5 = s_color.greenDark_;
  var g_lineColor6 = s_color.blueDark_;    var g_lineColor7 = s_red;
  var g_legText0   = "Total";
  var g_legText1   = "Global read";
  var g_legText2   = "Global write";
  var g_legText3   = "Shard read";
  var g_legText4   = "Shard write";
  var g_legText5   = "Parallel";
  var g_legText6   = "Process";
  var g_legText7   = "Failed query";

  // Text.
  var g_charLimit = {
    main_   : 19,
    header_ : 70  };

  // Text strings.
  var g_uiStr = {
    tipDriverInstances_      : "JDBC Driver",
    tipChart0_               : "Shows queries/second.",
    titleChart0_             : "Throughput...",
    titleListDriverInstances_: "JDBC Driver Instances",
    titleListDBConnections_  : "Database Connections by Shard"
  };

  // ============================================================================
  // LOAD/INIT.
  // ============================================================================

  // LOAD PAGE.
  function loadPage() {
	  // Load module/view.
	  parent.loadModule( s_module._2_, s_module2._1_ );

    // Init page.
    initPage();

    // Get list view.
    getView( g_viewVals.list_ );
  }//loadPage

  // INIT PAGE.
  function initPage() {
    // Event handlers.

    // List view controls.
    $( "#_btnRefresh" ).on          ( "click", function( event ) { parent.populateLog( s_message.refreshMain_, s_svcVals.info_ ); setupListRequest( s_listType.client_ ); getList(); });

    // Drilldown view controls.
    $( "#_btnRefreshDrillDown" ).on ( "click", function( event ) { parent.populateLog( s_message.refreshDetail_, s_svcVals.info_ ); setupListRequestDD(); getListDD(); });
    $( "#_btnReturn" ).on           ( "click", function( event ) { getView( g_viewVals.list_ ); });

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

    // Set chart size.
    $( "#_chartContainerMain0" ).css( "height", "288px" );
    $( "#_chartContainerMain0" ).css( "width", "948px" );
    $( "#_chartContainer0" ).css( "height", "252px" );
    $( "#_chartContainer0" ).css( "width", "960px" );

    // Create stage and layer for chart.
    var h0_ = $( "#_chartContainer0" ).height();
    var w0_ = $( "#_chartContainer0" ).width();

    g_stageChart0 = new Kinetic.Stage({ container: "_chartContainer0", height: h0_, width: w0_ });
    g_layerChart0 = new Kinetic.Layer();

    // Add layer to stage, then create chart.
    if ( g_stageChart0 && g_layerChart0 ) {
      // Add layer to stage.
      g_stageChart0.add( g_layerChart0 );

      // Set up chart vars.
      var chartID0_   = stc_getIdentifier( s_strChart0, s_strChart );
      var hLabelsID0_ = stc_getIdentifier( s_strChart0, s_strChartHLabels );
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
    }//stage layer valid
  }//initPage

  // ============================================================================
  // GET VIEW.
  // ============================================================================

  // GET VIEW.
  function getView( view_ ) {
	  // Init charts.
	  initCharts();

	  // Switch view.
	  if ( view_ == g_viewVals.list_ ) {
	    // Show list view, hide drilldown view.
	    $( "#_viewList" ).css( "visibility", "visible" );      $( "#_viewList" ).css( "display", "block" );
	    $( "#_viewDrillDown" ).css( "visibility", "hidden" );  $( "#_viewDrillDown" ).css( "display", "none" );

	    // Get list. Callback sends request for stats service.
	    setupListRequest( s_listType.client_ );
	    getList();
	  } else {
	    // Hide list view, show drilldown view.
	    $( "#_viewList" ).css( "visibility", "hidden" );       $( "#_viewList" ).css( "display", "none" );
	    $( "#_viewDrillDown" ).css( "visibility", "visible" ); $( "#_viewDrillDown" ).css( "display", "block" );

	    // Show client ID.
	    var text_           = g_uiStr.tipDriverInstances_ + " " + g_titleSelected;
	    var textNormalized_ = stc_normalizeText( text_, g_charLimit.header_ );
	    var nameDisplay_    = stc_addEllipsis( text_, textNormalized_, g_charLimit.header_ );
	    $( "#_clientName" ).html( nameDisplay_ ); $( "#_clientName" ).attr( "title", text_ );

      // Send request for drilldown list service.
      setupListRequestDD(); getListDD();
	  }//view_ not g_viewVals.list_
  }//getView

  // ============================================================================
  // LIST MAIN SERVICE.
  // ============================================================================

  // SETUP LIST REQUEST.
  function setupListRequest( type_ ) {
    // Hide lists.
    $( "#_divClient" ).css( "visibility", "hidden" );
    $( "#_divClient" ).css( "display", "none" );

		// Store service vals.
    g_statRequestType = s_statType.client_;

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
    stc_sendService( parent, loadMessage_, s_action.mgmtClient_, arrayParams_, returnList, resultClient_, $( "#_tooltip" ), null );
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
	        // Create list.
	        createListMain( resultList_, $( "#_listHeaderClient" ), $( "#_listClient" ) );

	        // Send request for stats service.
					startStatList();
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

    // Init list title.
    $( "#_titleListClient" ).html( "" );
    $( "#_divClient" ).css( "visibility", "visible" );

    // Show list.
    $( "#_divClient" ).css( "display", "block" );

    // Set error flag.
    var error_ = true;

    // LIST.

    // Create list.
    if ( arrayMaster_ && listHeader_ && listData_ ) {

      // HEADER.

      // Build header row.
      var rowHeader_ = buildHeaderClient();
      if ( rowHeader_ ) { listHeader_.append( rowHeader_ ); }

      // DATA.

      // Create data rows.
      if ( arrayMaster_.length > 0 ) {
        // Create rows.
        var length_ = arrayMaster_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Get ID.
          var id_ = "";
          if ( stc_isDefined( arrayMaster_[i].driverUUID ) ) { id_ = arrayMaster_[i].driverUUID; }

		      // Set row ID.
		      var rowID_ = stc_getIdentifier( "", s_strRow + "_" + g_list + "_" + i );

		      // Build data row.
		      var row_ = row_ = buildDataClient( id_, rowID_, arrayMaster_[i] );
		      if ( row_ ) { listData_.append( row_ ); }
        }//for each entry

        // EVENTS.
        // Assign event handlers to elements in list.

        $( ".clickForDrillDown" ).on ( "click", function( event ) { clickDrillDown( $( this ) ); });

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
    $( "#_divDD0" ).css( "visibility", "hidden" );
    $( "#_divDD0" ).css( "display", "none" );
  }//setupListRequestDD

  // GET LIST DRILLDOWN.
  function getListDD() {
    // TEST Set test result.
    if ( parent.i_isTestMode ) {
      resultDrillDownClient_.listName = g_list;
      resultDrillDownClient_.cat      = g_cat;
      resultDrillDownClient_.ID       = g_clientSelected;
    }//is parent.i_isTestMode

    // Send service.
    var loadMessage_ = s_message.loading_ + " " + g_list + " " + g_clientSelected + " " + s_message.listDrilldown_;
    var arrayParams_ = new Array();
    arrayParams_.push( { param: 'queryName', value: s_action.drillDown_ } );
    arrayParams_.push( { param: 'listName',  value: g_list } );
    arrayParams_.push( { param: 'cat',       value: g_cat } );
    arrayParams_.push( { param: 'ID',        value: g_clientSelected } );
    arrayParams_.push( { param: 'rowOffset', value: 0 } );
    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
    stc_sendService( parent, loadMessage_, s_action.mgmtDrillDown_, arrayParams_, returnListDD, resultDrillDownClient_, $( "#_tooltip" ), null );
  }//getListDD

  // RETURN LIST DRILLDOWN.
  function returnListDD( data_, status_ ) {
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
		    // Setup result vals.
		    var listName_    = "";
		    var cat_         = "";
		    var ID_          = "";
		    var connections_ = null;

	      // Get result vals.
	      if ( stc_isDefined( data_.listName ) )    { listName_    = data_.listName; }
	      if ( stc_isDefined( data_.cat ) )         { cat_         = data_.cat; }
	      if ( stc_isDefined( data_.ID ) )          { ID_          = data_.ID; }
	      if ( stc_isDefined( data_.connections ) ) { connections_ = data_.connections; }

	      // Handle result.
	      if ( listName_ == g_list &&
	           cat_ == g_cat &&
	           ID_ == g_clientSelected ) {

	        // Create list.
	        if ( stc_isDefined( connections_ ) ) {
	          createListDD( connections_, s_listType.connectionDD_, $( "#_listHeaderDD0" ), $( "#_listDD0" ) );
	        }//connections_ valid
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

	    // Init list title.
	    $( "#titleListDD0" ).html( "" );

	    // Show list.
			$( "#_divDD0" ).css( "visibility", "visible" );
			$( "#_divDD0" ).css( "display", "block" );

	    // Set error flag.
	    var error_ = true;

	    // LIST.

	    // Create list.
	    if ( arrayMaster_ && listHeader_ && listData_ ) {

	      // HEADER.

	      // Build header row.
	      var rowHeader_ = buildHeaderConnections();
	      if ( rowHeader_ ) { listHeader_.append( rowHeader_ ); }

	      // DATA.

	      // Create data rows.
	      if ( arrayMaster_.length > 0 ) {
	        // Create rows.
	        var length_ = arrayMaster_.length;
	        for ( var i = 0; i < length_; i++ ) {
	          // Get ID.
	          var id_ = "";
			      if ( stc_isDefined( arrayMaster_[i].shard ) ) {
			        id_ = arrayMaster_[i].shard;
			      }//shard_ valid

			      // Set row ID. Replace any white spaces first.
			      var noSpaceID_ = id_.replace( /\s/g, "_" );
			      var rowID_     = stc_getIdentifier( noSpaceID_, s_strRow + "_" + list_ + "_" + i );

			      // Build data row.
			      var row_ = buildDataConnections( id_, rowID_, arrayMaster_[i] );
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
  function clickDrillDown( cell_ ) {
	  if ( stc_isDefined( cell_ ) ) {
      // Get ID and title.
      var id_    = cell_.parent().attr( "name" );
      var title_ = cell_.attr( "title" );

      // Set vals and get view.
      if ( stc_isDefined( id_ ) && stc_isDefined( title_ ) ) {
		    // Store selected/service vals.
		    g_clientSelected = id_;
		    g_titleSelected  = title_;

        // Get drilldown view.
        getView( g_viewVals.drillDown_ );
      }//id_ title_ valid
	  }//cell_ valid
  }//clickDrillDown

  // ============================================================================
  // STAT SERVICE.
  // ============================================================================

  // START STAT LIST.
  function startStatList() {

    // TIMER/CHART
    // Init charts. Includes timer tracking stop.
    initCharts();

    // LEGEND.

    // Create legend for chart 0.
    var arrayLegend_ = new Array();
    arrayLegend_ = [
                     { fill_:g_lineColor0, text_:g_legText0 },
                     { fill_:g_lineColor1, text_:g_legText1 },
                     { fill_:g_lineColor2, text_:g_legText2 },
                     { fill_:g_lineColor3, text_:g_legText3 },
                     { fill_:g_lineColor4, text_:g_legText4 },
                     { fill_:g_lineColor5, text_:g_legText5 },
                     { fill_:g_lineColor6, text_:g_legText6 },
                     { fill_:g_lineColor7, text_:g_legText7 }
                   ];
    g_chart0 = stc_getElement( stc_getIdentifier( s_strChart0, s_strChart ), g_stageChart0 );
    if ( g_chart0 ) {
      chrt_createLegend( g_chart0, stc_getIdentifier( s_strChart0, s_strLegend ),
                         g_chartVals.xLegend_, g_chartVals.yLegend_, g_chartVals.hLegend_, g_chartVals.wLegend_,
                         g_chartVals.colorTextLeg_, g_chartVals.colorStrokeLeg_, arrayLegend_ );
    }//g_chart0 valid

    // START
    // Start timer tracking that sends request for stat list every n seconds.
    parent.i_getStatListDB = true;

    // Send first service request.
    getStatList();
  }//startStatList

  // GET STAT LIST.
  function getStatList() {
    if ( stc_isDefined( g_statRequestType ) ) {
      // Get start time.
      var date_ = new Date(); var time_ = date_.getTime();

      // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.mgmtStats_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName',   value: s_action.statsStats_ } );
	    arrayParams_.push( { param: 'statType',    value: g_statRequestType } );
	    arrayParams_.push( { param: 'statsTypeId', value: s_statType.random_ } );
	    arrayParams_.push( { param: 'startTime',   value: time_ } );
	    arrayParams_.push( { param: 'rowLimit',    value: g_svcVals.nbrStatsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.mgmtStats_, arrayParams_, returnStatList, testStatsClientResult_, $( "#_tooltip" ), returnStatListError );
    }//g_statRequestType valid
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
	           statsTypeId_ == s_statType.random_ &&
	           stc_isDefined( statValues_ )  ) {

		      // Create stat arrays.
				  // Arrays come back with more recent values at end.
				  // Reverse so most recent are at beginning.
		      var statName_  = "";
		      var stat_      = new Array();
		      var arrayRaw0_ = new Array();
		      var length_   = statValues_.length;
		      for ( var i = 0; i < length_; i++ ) {
		        if ( stc_isDefined( statValues_[i] ) ) {
			        if ( statValues_[i].countSuccess ) {
			          // Get and reverse stat.
			          stat_ = new Array(); stat_ = statValues_[i].countSuccess;
			          stat_.reverse();

					      // If stat name is not correct, null stat.
					      if ( stc_isDefined( statValues_[i].statName ) ) { statName_ = statValues_[i].statName; }
					      if ( stc_isDefined( statName_ ) ) {
						      switch( i ) {
						        case 0: if ( statName_ != s_statType.total_ )       { stat_ = null; } break;
						        case 1: if ( statName_ != s_statType.globalRead_ )  { stat_ = null; } break;
						        case 2: if ( statName_ != s_statType.globalWrite_ ) { stat_ = null; } break;
						        case 3: if ( statName_ != s_statType.shardRead_ )   { stat_ = null; } break;
						        case 4: if ( statName_ != s_statType.shardWrite_ )  { stat_ = null; } break;
						        case 5: if ( statName_ != s_statType.parallel_ )    { stat_ = null; } break;
						        case 6: if ( statName_ != s_statType.process_ )     { stat_ = null; } break;
						        case 7: if ( statName_ != s_statType.failedQuery_ ) { stat_ = null; } break;
						        default: break;
						      }//switch i
					      }//statName_ valid

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
			      if ( arrayRaw0_.length > 7 ) {
			        arrayStat_ = new Array();
					    arrayStat_ = [
					                     { stat_:arrayRaw0_[0], stroke_:g_lineColor0 },
					                     { stat_:arrayRaw0_[1], stroke_:g_lineColor1 },
					                     { stat_:arrayRaw0_[2], stroke_:g_lineColor2 },
					                     { stat_:arrayRaw0_[3], stroke_:g_lineColor3 },
					                     { stat_:arrayRaw0_[4], stroke_:g_lineColor4 },
					                     { stat_:arrayRaw0_[5], stroke_:g_lineColor5 },
					                     { stat_:arrayRaw0_[6], stroke_:g_lineColor6 },
					                     { stat_:arrayRaw0_[7], stroke_:g_lineColor7 }
					                   ];
			        makeCharts( arrayStat_, g_stageChart0, g_layerChart0,
			                    $( "#_chartContainer0" ), $( "#_chartContainerMain0" ), g_chart0, s_strChart0,
			                    $( "#_titleChart0" ), g_uiStr.titleChart0_,
			                    s_svcVals.incrementTime_, s_svcVals.sec15_, newDate_, mouseoverChart0 );
			        $( "#_chartContainerMain0" ).css( "visibility", "visible" ); $( "#_chartContainerMain0" ).css( "display", "block" );
			        $( "#_titleChart0" ).attr( "title", g_uiStr.tipChart0_ );
			      }//array valid
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

    // Clear chart 0.
    var chartLineID0_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 0 );
    var chartLineID1_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 1 );
    var chartLineID2_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 2 );
    var chartLineID3_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 3 );
    var chartLineID4_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 4 );
    var chartLineID5_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 5 );
    var chartLineID6_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 6 );
    var chartLineID7_   = stc_getIdentifier( s_strChart0, s_strChartLine + s_strChartLine + 7 );
    var arrayChartLine_ = new Array();
    arrayChartLine_     = [ chartLineID0_, chartLineID1_, chartLineID2_, chartLineID3_ ];
    var hLabelsID_      = stc_getIdentifier( s_strChart0, s_strChartHLabels );
    var vLabelsID0_     = stc_getIdentifier( s_strChart0, s_strChartVLabels ) + s_strVLabelsLeft;
    var vLabelsID1_     = stc_getIdentifier( s_strChart0, s_strChartVLabels ) + s_strVLabelsRight;
    chrt_clearChart( g_stageChart0, g_layerChart0, arrayChartLine_, hLabelsID_, vLabelsID0_, vLabelsID1_, $( "#_titleChart0" ) );

    // Clear legend 0.
    chrt_clearLegend( g_stageChart0, g_layerChart0, stc_getIdentifier( s_strChart0, s_strLegend ) );

    // Hide chart.
    $( "#_chartContainerMain0" ).css( "visibility", "hidden" );
    $( "#_chartContainerMain0" ).css( "display", "none" );
  }//initCharts

  // MAKE CHARTS.
  // Stat parameters must be filled starting with stat0_, then stat1_ and so on.
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

  // BLINK CHART.
  function blinkChart() {
    if ( $( "#_iconChartTimer0" ) ) {
      var opacity_ = $( "#_iconChartTimer0" ).css( "opacity" );
      if ( opacity_ == 1.0 ) {
        $( "#_iconChartTimer0" ).css( "opacity", "0.5" );
      } else {
        $( "#_iconChartTimer0" ).css( "opacity", "1.0" );
      }//opacity_ not 1.0
    }//_iconChartTimer0 valid
  }//blinkChart

  // ============================================================================
  // UTILITY.
  // ============================================================================

  // MOUSE OUT TOOLTIP LOCAL.
  function mouseOutTooltipLocal( event ) {
    stc_mouseOutTooltip( $( "#_tooltip" ), event );
  }//mouseOutTooltipLocal

  // ============================================================================
  // LIST CLIENT DETAILS.
  // Note: lists are 940 pixels wide.
  // ============================================================================

  // ============================================================================
  // LIST CLIENT.
  // ============================================================================

  // BUILD HEADER CLIENT.
  function buildHeaderClient() {
    // Set list title.
    $( "#_titleListClient" ).html( g_uiStr.titleListDriverInstances_ );

    // Set td widths.
    var w0_  = "75px"; var w1_  = "35px"; var w2_  = "75px"; var w3_  = "75px";
    var w4_  = "65px"; var w5_  = "35px"; var w6_  = "35px"; var w7_  = "35px";
    var w8_  = "35px"; var w9_  = "35px"; var w10_ = "35px"; var w11_ = "35px";
    var w12_ = "35px"; var w13_ = "35px"; var w14_ = "35px"; var w15_ = "35px";
    var w16_ = "35px"; var w17_ = "50px"; var w18_ = "55px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Host'                       ><div>Host</div>                   </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='PID'                        ><div>PID</div>                    </td>" +
    "<td width='" + w2_  + "' style='min-width: " + w2_  + ";' title='Driver UUID'                ><div>Driver UUID</div>            </td>" +
    "<td width='" + w3_  + "' style='min-width: " + w3_  + ";' title='Driver version'             ><div>Driver version</div>         </td>" +
    "<td width='" + w4_  + "' style='min-width: " + w4_  + ";' title='Memory'                     ><div>Memory</div>                 </td>" +
    "<td width='" + w5_  + "' style='min-width: " + w5_  + ";' title='Threads'                    ><div>Threads</div>                </td>" +
    "<td width='" + w6_  + "' style='min-width: " + w6_  + ";' title='Total database connections' ><div>Total DB conn</div>          </td>" +
    "<td width='" + w7_  + "' style='min-width: " + w7_  + ";' title='Current shard reads'        ><div>Cur shard reads</div>        </td>" +
    "<td width='" + w8_  + "' style='min-width: " + w8_  + ";' title='Current shard writes'       ><div>Cur shard writes</div>       </td>" +
    "<td width='" + w9_  + "' style='min-width: " + w9_  + ";' title='Current parallel'           ><div>Cur parallel</div>           </td>" +
    "<td width='" + w10_ + "' style='min-width: " + w10_ + ";' title='Current processes'          ><div>Cur processes</div> </td>" +
    "<td width='" + w11_ + "' style='min-width: " + w11_ + ";' title='Historical shard reads'     ><div>Hist shard reads</div>       </td>" +
    "<td width='" + w12_ + "' style='min-width: " + w12_ + ";' title='Historical shard writes'    ><div>Hist shard writes</div>      </td>" +
    "<td width='" + w13_ + "' style='min-width: " + w13_ + ";' title='Historical parallel'        ><div>Hist parallel</div>          </td>" +
    "<td width='" + w14_ + "' style='min-width: " + w14_ + ";' title='Historical processes'       ><div>Hist processes</div></td>" +
    "<td width='" + w15_ + "' style='min-width: " + w15_ + ";' title='Log warning'                ><div>Log warning</div>            </td>" +
    "<td width='" + w16_ + "' style='min-width: " + w16_ + ";' title='Log error'                  ><div>Log error</div>              </td>" +
    "<td width='" + w17_ + "' style='min-width: " + w17_ + ";' title='Last update'                ><div>Last update</div>            </td>" +
    "<td width='" + w18_ + "' style='min-width: " + w18_ + ";' title='Status'                     ><div>Status</div>                 </td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderClient

  // BUILD DATA CLIENT.
  function buildDataClient( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_  = "75px"; var w1_  = "35px"; var w2_  = "75px"; var w3_  = "75px";
	    var w4_  = "65px"; var w5_  = "35px"; var w6_  = "35px"; var w7_  = "35px";
	    var w8_  = "35px"; var w9_  = "35px"; var w10_ = "35px"; var w11_ = "35px";
	    var w12_ = "35px"; var w13_ = "35px"; var w14_ = "35px"; var w15_ = "35px";
	    var w16_ = "35px"; var w17_ = "50px"; var w18_ = "55px";

      // Init display values.
      var host_                  = s_message.notFound_;
      var PID_                   = s_message.notFound_;
      var driverUUID_            = s_message.notFound_;
      var driverVersion_         = s_message.notFound_;
      var memoryPercent_         = s_message.notFound_;
      var mb_                    = s_message.notFound_;
      var threads_               = s_message.notFound_;
      var totalDBConnections_    = s_message.notFound_;
      var currentShardReads_     = s_message.notFound_;
      var currentShardWrites_    = s_message.notFound_;
      var currentParallel_       = s_message.notFound_;
      var currentProcesses_      = s_message.notFound_;
      var historicalShardReads_  = s_message.notFound_;
      var historicalShardWrites_ = s_message.notFound_;
      var historicalParallel_    = s_message.notFound_;
      var historicalProcesses_   = s_message.notFound_;
      var logWarning_            = s_message.notFound_;
      var logError_              = s_message.notFound_;
      var updateLast_            = s_message.notFound_;
      var status_                = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.host ) )                  { host_                  = entry_.host; }
      if ( stc_isDefined( entry_.PID ) )                   { PID_                   = entry_.PID; }
      if ( stc_isDefined( entry_.driverUUID ) )            { driverUUID_            = entry_.driverUUID; }
      if ( stc_isDefined( entry_.driverVersion ) )         { driverVersion_         = entry_.driverVersion; }
      if ( stc_isDefined( entry_.memoryPercent ) )         { memoryPercent_         = entry_.memoryPercent; }
      if ( stc_isDefined( entry_.mb ) )                    { mb_                    = entry_.mb; }
      if ( stc_isDefined( entry_.threads ) )               { threads_               = stc_addCommas( parseInt( entry_.threads ) ); }
      if ( stc_isDefined( entry_.totalDBConnections ) )    { totalDBConnections_    = stc_addCommas( parseInt( entry_.totalDBConnections ) ); }
      if ( stc_isDefined( entry_.currentShardReads ) )     { currentShardReads_     = stc_addCommas( parseInt( entry_.currentShardReads ) ); }
      if ( stc_isDefined( entry_.currentShardWrites ) )    { currentShardWrites_    = stc_addCommas( parseInt( entry_.currentShardWrites ) ); }
      if ( stc_isDefined( entry_.currentParallel ) )       { currentParallel_       = stc_addCommas( parseInt( entry_.currentParallel ) ); }
      if ( stc_isDefined( entry_.currentProcesses ) )      { currentProcesses_      = stc_addCommas( parseInt( entry_.currentProcesses ) ); }
      if ( stc_isDefined( entry_.historicalShardReads ) )  { historicalShardReads_  = stc_addCommas( parseInt( entry_.historicalShardReads ) ); }
      if ( stc_isDefined( entry_.historicalShardWrites ) ) { historicalShardWrites_ = stc_addCommas( parseInt( entry_.historicalShardWrites ) ); }
      if ( stc_isDefined( entry_.historicalParallel ) )    { historicalParallel_    = stc_addCommas( parseInt( entry_.historicalParallel ) ); }
      if ( stc_isDefined( entry_.historicalProcesses ) )   { historicalProcesses_   = stc_addCommas( parseInt( entry_.historicalProcesses ) ); }
      if ( stc_isDefined( entry_.logWarning ) )            { logWarning_            = stc_addCommas( parseInt( entry_.logWarning ) ); }
      if ( stc_isDefined( entry_.logError ) )              { logError_              = stc_addCommas( parseInt( entry_.logError ) ); }
      if ( stc_isDefined( entry_.updateLast ) )            { updateLast_            = entry_.updateLast; }
      if ( stc_isDefined( entry_.status ) )                { status_                = entry_.status; }

      // Create memory cell.
      var cellMemory_ = stc_createMemoryCell( w4_, memoryPercent_, mb_ );

      // Create status cell.
      var cellStatus_ = stc_createStatusCell( w18_, status_ );

      // Create clickdown cell.
      var cellClickdown_ = "<td class='lsCell clickForDrillDown' width='" + w2_ + "' style='min-width: " + w2_ + ";'" +
                           " title='instance " + driverUUID_ + " on " + host_ + "'>" +
                           "<a href='#'>" + driverUUID_ + "</a>" +
                           "</td>";

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataClient'>" +
             "<td class='lsCell' width='" + w0_  + "' style='min-width: " + w0_  + "; text-decoration: none;'>" + host_                  + "</td>" +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + ";'                       >" + PID_                   + "</td>" +
             cellClickdown_ +
             "<td class='lsCell' width='" + w3_  + "' style='min-width: " + w3_  + ";'                       >" + driverVersion_         + "</td>" +
             cellMemory_ +
             "<td class='lsCell' width='" + w5_  + "' style='min-width: " + w5_  + "; text-align: right;'    >" + threads_               + "</td>" +
             "<td class='lsCell' width='" + w6_  + "' style='min-width: " + w6_  + "; text-align: right;'    >" + totalDBConnections_    + "</td>" +
             "<td class='lsCell' width='" + w7_  + "' style='min-width: " + w7_  + "; text-align: right;'    >" + currentShardReads_     + "</td>" +
             "<td class='lsCell' width='" + w8_  + "' style='min-width: " + w8_  + "; text-align: right;'    >" + currentShardWrites_    + "</td>" +
             "<td class='lsCell' width='" + w9_  + "' style='min-width: " + w9_  + "; text-align: right;'    >" + currentParallel_       + "</td>" +
             "<td class='lsCell' width='" + w10_ + "' style='min-width: " + w10_ + "; text-align: right;'    >" + currentProcesses_      + "</td>" +
             "<td class='lsCell' width='" + w11_ + "' style='min-width: " + w11_ + "; text-align: right;'    >" + historicalShardReads_  + "</td>" +
             "<td class='lsCell' width='" + w12_ + "' style='min-width: " + w12_ + "; text-align: right;'    >" + historicalShardWrites_ + "</td>" +
             "<td class='lsCell' width='" + w13_ + "' style='min-width: " + w13_ + "; text-align: right;'    >" + historicalParallel_    + "</td>" +
             "<td class='lsCell' width='" + w14_ + "' style='min-width: " + w14_ + "; text-align: right;'    >" + historicalProcesses_   + "</td>" +
             "<td class='lsCell' width='" + w15_ + "' style='min-width: " + w15_ + "; text-align: right;'    >" + logWarning_            + "</td>" +
             "<td class='lsCell' width='" + w16_ + "' style='min-width: " + w16_ + "; text-align: right;'    >" + logError_              + "</td>" +
             "<td class='lsCell' width='" + w17_ + "' style='min-width: " + w17_ + ";'                       >" + updateLast_            + "</td>" +
             cellStatus_ +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataClient

  // ============================================================================
  // DRILLDOWN.
  // ============================================================================

  // BUILD HEADER CONNECTIONS.
  function buildHeaderConnections() {
    // Set list title.
    $( "#titleListDD0" ).html( g_uiStr.titleListDBConnections_ );

    // Set td widths.
    var w0_ = "100px"; var w1_ = "35px";

    // Create header row.
    var rowHeader_ = "<tr>" +
    "<td width='" + w0_  + "' style='min-width: " + w0_  + ";' title='Shard'             ><div>Shard</div>             </td>" +
    "<td width='" + w1_  + "' style='min-width: " + w1_  + ";' title='Pooled connections'><div>Pooled connections</div></td>" +
    "<tr>";

    // Return header row.
    return rowHeader_;
  }//buildHeaderConnections

  // BUILD DATA CONNECTIONS.
  function buildDataConnections( id_, rowID_, entry_ ) {
    // Init row.
    var row_ = null;

    // Build row.
    if ( stc_isDefined( id_ ) && stc_isDefined( rowID_ ) && stc_isDefined( entry_ ) ) {
	    // Set td widths.
	    var w0_ = "100px"; var w1_ = "35px";

      // Init display values.
      var shard_             = s_message.notFound_;
      var pooledConnections_ = s_message.notFound_;

      // Get display values.
      if ( stc_isDefined( entry_.shard ) )             { shard_             = entry_.shard; }
      if ( stc_isDefined( entry_.pooledConnections ) ) { pooledConnections_ = stc_addCommas( parseInt( entry_.pooledConnections ) ); }

      // Create row and add to list.
      // To store unchanged ID in row, assign it to name attribute, which does not have to be unique.
      row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='rowDataDDConnection'>" +
             "<td class='lsCell' width='" + w0_  + "' style='min-width: " + w0_  + "; text-decoration: none;'>" + shard_              + "</td>" +
             "<td class='lsCell' width='" + w1_  + "' style='min-width: " + w1_  + "; text-align: right;'    >" + pooledConnections_  + "</td>" +
             "<tr>";
    }//parameters valid

    // Return row.
    return row_;
  }//buildDataConnections