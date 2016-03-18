
  // ============================================================================
  // LIST HEAT.
  // Requires static.js.
  // Uses Kinetic components. Once Kinetic stage/layer are created, do not keep checking them for validity.
  // ============================================================================

  // ON DOC READY
  $( document ).ready( function() {

	  // Load module/view.
	  parent.loadModule( s_module._0_, s_module0._1_ );

    // Create basic contents.
    createBasicContents();

    // Get table list. Service callback continues to create content.
    if ( g_stageChart && g_layerChart ) {
	    // Start timer tracking that sends request for table list every n seconds.
	    parent.i_refresh = true;

	    // Send service request.
      handleTableRequest( s_svcVals.sortByTotalTime_, true, s_svcVals.directionNew_, false );
    }//g_stageChart g_layerChart valid

  })// ON DOC READY

  // ============================================================================
  // GLOBAL VARS.
  // ============================================================================

  // Data arrays for services.
  var g_arrayMaster = new Array();
  var g_arrayQuery  = new Array();
  var g_arrayStat   = new Array();

  // Services.
  var g_sortOrderTable  = s_svcVals.sortByTotalTime_;
  var g_sortOrderQuery  = s_svcVals.sortByTotalTime_;
  var g_statsID         = "";
  var g_statRequestType = "";

  // Services vals. Timer speed is not used, but is included for documentation.
  var g_svcVals = {
    nbrRowsReq_ : 12,
    nbrStatsReq_: 10,
    timerSpeed_ : 15000 };

  // Highest slots. Used for creating time/frequency bars in lists.
  var g_highVal1Table = 0;
  var g_highVal2Table = 0;
  var g_highVal1Query = 0;
  var g_highVal2Query = 0;

  // Paging vars.
  var g_pageDirectionTable = s_svcVals.directionNew_;
  var g_pageDirectionQuery = s_svcVals.directionNew_;
  var g_indexTable         = 0;
  var g_indexQuery         = 0;

  // Currently-selected object.
  var g_tableIDSelected  = "";
  var g_tableRowSelected = "";
  var g_queryIDSelected  = "";
  var g_queryRowSelected = "";

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
    main_ : 19,
    query_: 19,
    chart_: 50 };

  // Modes.
  var g_isRefreshing_ = false;

  // Text strings.
  var g_uiStr = {
    tipFrequency_ : "frequency",
    erNoQueryText_: "Query text not available."
  };

  // ============================================================================
  // BASIC CONTENT.
  // ============================================================================

  // CREATE BASIC CONTENTS.
  function createBasicContents() {
    // DRAGGABLE.

    // Query edit control.
    $( "#_containerQueryEdit" ).draggable({ handle: "#_handleQueryEdit" });

    // Chart.
    $( "#_chartContainerMain" ).draggable();

    // EVENT HANDLERS.

    // Table list controls.
    $( "#_btnRefreshTable" ).on      ( "click", function( event )     { refreshPage(); });
    $( "#_btnSortTableTime" ).on     ( "click", function( event )     { handleTableRequest( s_svcVals.sortByTotalTime_, true, s_svcVals.directionNew_, false ); });
    $( "#_btnSortTableFreq" ).on     ( "click", function( event )     { handleTableRequest( s_svcVals.sortByFrequency_, true, s_svcVals.directionNew_, false ); });
    $( "#_iconChartTable" ).on       ( "click", function( event )     { startStatList( g_tableIDSelected, s_statType.table_ ); });
    $( "#_iconPrevTable" ).on        ( "click", function( event )     { handleTableRequest( g_sortOrderTable, false, s_svcVals.directionPrev_, false ); });
    $( "#_iconNextTable" ).on        ( "click", function( event )     { handleTableRequest( g_sortOrderTable, false, s_svcVals.directionNext_, false ); });

    // Query list controls.
    $( "#_btnSortQueryTime" ).on     ( "click", function( event )     { handleQueryRequest( g_tableIDSelected, s_svcVals.sortByTotalTime_, true, s_svcVals.directionNew_ );  });
    $( "#_btnSortQueryFreq" ).on     ( "click", function( event )     { handleQueryRequest( g_tableIDSelected, s_svcVals.sortByFrequency_, true, s_svcVals.directionNew_ ); });
    $( "#_dropdownQueryType" ).on    ( "change", function( event )    { handleQueryRequest( g_tableIDSelected, g_sortOrderQuery, true, s_svcVals.directionNew_ ); });
    $( "#_iconChartQuery" ).on       ( "click", function( event )     { startStatList( g_queryIDSelected, s_statType.query_ ); });
    $( "#_iconPrevQuery" ).on        ( "click", function( event )     { handleQueryRequest( g_tableIDSelected, g_sortOrderQuery, false, s_svcVals.directionPrev_ ); });
    $( "#_iconNextQuery" ).on        ( "click", function( event )     { handleQueryRequest( g_tableIDSelected, g_sortOrderQuery, false, s_svcVals.directionNext_ ); });

    // Icon images.
    $( ".icon" ).on                  ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
    $( ".icon" ).on                  ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

    // Query edit icons.
    $( "#_iconQueryEditClose" ).on   ( "click", function( event )     { stc_clearQueryEdit(); stc_closeQueryEdit(); });

    // Chart icons.
    $( "#_iconChartClose" ).on       ( "click", function( event )     { closeChart(); });

    // CONTENTS.

    // Init fields.
    stc_initTestField();
    stc_clearTooltip( $( "#_tooltip" ) );
    stc_clearQueryEdit();

    // Create stage and layer. Used for chart.
    var h_ = $( "#_chartContainer" ).height();
    var w_ = $( "#_chartContainer" ).width();
    g_stageChart = new Kinetic.Stage({ container: "_chartContainer", height: h_, width: w_ });
    g_layerChart = new Kinetic.Layer();

    // Add layer to stage, then create chart.
    if ( g_stageChart && g_layerChart ) {
      // Add layer to stage.
      g_stageChart.add( g_layerChart );

      // Create basic chart (with no data).
      var fontSize_     = "9";
      var color_        = s_white;
      var useGrid_      = true;
      var hLabelsID_    = stc_getIdentifier( "", s_strChartHLabels );
      var hLabelStr_    = "";
      var hLabelOffset_ = 30;
      var hOffset_      = 40;
      var wOffset_      = 50;
      g_chart = chrt_createChart( stc_getIdentifier( "", s_strChart ), h_,  w_,
                                  fontSize_, color_, color_, useGrid_,
                                  g_chartVals.nbrSlots_, g_chartVals.nbrYSlots_,
                                  g_chartVals.xIncrement_, hLabelsID_,
                                  hLabelStr_, hLabelOffset_, hOffset_, wOffset_ );
      if ( g_chart ) { g_layerChart.add( g_chart ); }
      $( "#_titleChart" ).css( "color", color_ );

      // Draw layer.
      g_layerChart.draw();
    }//g_stageChart g_layerChart valid

    // Hide load tooltip.
    parent.hideLoadTooltip();
  }//createBasicContents

  // ============================================================================
  // TABLE LIST.
  // ============================================================================

  // REFRESH PAGE.
  // Send services to get same contents as currently loaded in table and query lists.
  // Re-select any currently selected table/query.
  // Leave chart and query edit dialogs as they are.
  function refreshPage() {
    handleTableRequest( g_sortOrderTable, true, s_svcVals.directionNew_, true );
  }//refreshPage

  // HANDLE TABLE REQUEST.
  function handleTableRequest( sortOrder_, startOver_, pageDirection_, isRefreshing_ ) {
    if ( stc_isDefined( sortOrder_ ) && stc_isDefined( pageDirection_ ) ) {
	    // Set refreshing flag.
	    g_isRefreshing_ = isRefreshing_;

	    // Perform setup actions.
	    setupTableRequest( sortOrder_, startOver_, pageDirection_ );

	    // Depending on user selection, send request for service result or page to prev/next rows.
	    switch( pageDirection_ ) {

	        case s_svcVals.directionNew_:
	          getTableList( sortOrder_ );
	        break;

	        case s_svcVals.directionPrev_:
	          pageTableList( s_svcVals.directionPrev_ );
	        break;

	        case s_svcVals.directionNext_:
	          // Find out if user is paging thru rows that have already been retrieved, or if
	          // he has reached end of stored rows (in master array) and is asking for next page from service.
	          // Page index marks where we are in master array.
	          // When service returns set of rows, they are added to master array and table index is set to first returned row in master array.
	          // When user pages back and forth thru rows, table index is set to first row pushed to screen.
	          // Difference between table index and number of rows in master array is number of rows currently showing on screen.
	          // If difference is less than or equal to number of available rows on screen, we must get new set of rows.
	          // If difference is greater than number of available rows on screen, we can still page forward.
	          if ( g_arrayMaster && stc_isNumber( g_indexTable ) ) {
	            var nbrRemainingrRows_ = ( g_arrayMaster.length - g_indexTable );
	            if ( stc_isNumber( nbrRemainingrRows_ ) ) {
	             if ( nbrRemainingrRows_ <= g_svcVals.nbrRowsReq_ ) {
	               // Send request for new set of rows.
	               getTableList( sortOrder_ );
	             } else {
	               // Show next set of stored rows.
	               pageTableList( s_svcVals.directionNext_ );
	             }//nbrRemainingrRows_ gt g_svcVals.nbrRowsReq_
	            }//nbrRemainingrRows_ valid
	          }//g_arrayMaster g_indexTable valid
	        break;

	        default: break;

	    }//switch pageDirection_
    }//parameters valid
  }//handleTableRequest

  // SETUP TABLE REQUEST.
  function setupTableRequest( sortOrder_, startOver_, pageDirection_ ) {
    if ( stc_isDefined( sortOrder_ ) && stc_isDefined( pageDirection_ ) ) {
	    // TIMER/CHART
	    // Init chart. Includes timer tracking stop.
	    if ( !g_isRefreshing_ ) {
	      initChart();
	    }//g_isRefreshing_ false

	    // HEAT INDICATOR.
	    // Zero out heat indicator in parent page.
	    parent.zeroOutHeatIndicator();

	    // PAGING.
	    // Set page directions.
	    g_pageDirectionTable = pageDirection_;
	    g_pageDirectionQuery = s_svcVals.directionNew_;

	    // Init page indexes.
	    if ( startOver_ ) {
	      g_indexTable = 0;
	    }//startOver_ true
	    g_indexQuery = 0;

	    // TABLE
	    // Clear out master array, init high slots.
	    if ( startOver_ ) {
	      g_arrayMaster   = new Array();
	      g_highVal1Table = 0;
	      g_highVal2Table = 0;
	    }//startOver_ true

	    // Null vars for currently-selected table.
	    if ( !g_isRefreshing_ ) {
	      g_tableIDSelected  = "";
	      g_tableRowSelected = "";
	    }//g_isRefreshing_ false

	    // Unhighlight buttons.
	    $( ".btnTable" ).css( "color", s_white );
	    $( ".btnTable" ).css( "font-weight", "normal" );

	    // QUERY
	    // Clear out query array, init high slots.
	    g_arrayQuery    = new Array();
	    g_highVal1Query = 0;
	    g_highVal2Query = 0;

	    // Null vars for currently-selected query.
	    if ( !g_isRefreshing_ ) {
	      g_queryIDSelected  = "";
	      g_queryRowSelected = "";
	    }//g_isRefreshing_ false

	    // Hide query buttons.
	    toggleShowQueryButtons( false );
	    hideQueryPageButtons();

	    // Delete all query list rows.
	    $( "#_listQuery" ).empty();

	    // Clear and close query edit dialog.
	    if ( !g_isRefreshing_ ) {
	      stc_clearQueryEdit();
	      stc_closeQueryEdit();
	    }//g_isRefreshing_ false

	    // SORT ORDER
      // Store sort order.
      g_sortOrderTable = sortOrder_;

      // Highlight button to match sort.
      switch( g_sortOrderTable ) {

          case s_svcVals.sortByTotalTime_:
            $( "#_btnSortTableTime" ).css( "color", s_black );
            $( "#_btnSortTableTime" ).css( "font-weight", "bold" );
          break;

          case s_svcVals.sortByFrequency_:
            $( "#_btnSortTableFreq" ).css( "color", s_black );
            $( "#_btnSortTableFreq" ).css( "font-weight", "bold" );
          break;

          default: break;

      }//switch g_sortOrderTable
    }//parameters valid
  }//setupTableRequest

  // GET TABLE LIST.
  function getTableList( sortOrder_ ) {
    if ( stc_isDefined( sortOrder_ ) && g_arrayMaster ) {
	    // TEST Set test result.
	    if ( parent.i_isTestMode ) {
		    var testResult_    = new Object();
	      testResult_        = testTableResult_;
	      testResult_.sortBy = sortOrder_;
	    }//is parent.i_isTestMode

	    // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.statsTable_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName', value: s_action.statsTableSummary_ } );
	    arrayParams_.push( { param: 'sortBy',    value: sortOrder_ } );
	    arrayParams_.push( { param: 'rowOffset', value: g_arrayMaster.length } );
	    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.statsTable_, arrayParams_, returnTableList, testResult_, $( "#_tooltip" ), returnTableError );
    }//sortOrder_ g_arrayMaster valid
  }//getTableList

  // RETURN TABLE ERROR.
  function returnTableError() {
    // Set flag to false.
    g_isRefreshing_ = false;

    // Init chart. Includes timer tracking stop.
    initChart();

    // Null vars for currently-selected table.
    g_tableIDSelected  = "";
    g_tableRowSelected = "";

    // Null vars for currently-selected query.
    g_queryIDSelected  = "";
    g_queryRowSelected = "";

    // Clear and close query edit dialog.
    stc_clearQueryEdit();
    stc_closeQueryEdit();
  }//returnTableError

  // RETURN TABLE LIST.
  function returnTableList( data_, status_, message_ ) {
    // Set error flag.
    var error_ = true;

    // Handle result.
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
        // Set error to false.
        error_ = false;

		    // Set up result vals.
		    var queryName_   = "";
		    var sortBy_      = "";
		    var tableList_   = null;
		    var summaryInfo_ = null;
		    var heatTotal_   = 0;

		    // Get result vals.
		    if ( stc_isDefined( data_.queryName ) )   { queryName_   = data_.queryName; }
		    if ( stc_isDefined( data_.sortBy ) )      { sortBy_      = data_.sortBy; }
		    if ( stc_isDefined( data_.tableList ) )   { tableList_   = data_.tableList; }
		    if ( stc_isDefined( data_.summaryInfo ) ) { summaryInfo_ = data_.summaryInfo; }

		    // Handle result.
	      if ( stc_isDefined( tableList_ ) ) {
	        // Get heat info.
	        if ( stc_isDefined( summaryInfo_ ) ) {
	          if ( stc_isDefined( summaryInfo_.heat ) ) {
	            heatTotal_ = parseInt( summaryInfo_.heat );
	          }//heat valid
	        }//summaryInfo valid

	        // Create list.
	        if ( queryName_ == s_action.statsTableSummary_ && sortBy_ == g_sortOrderTable ) {
		        // Set error to false.
		        error_ = false;

	          // Create master array.
	          createMasterArray( tableList_, heatTotal_ );

	          // Create table list.
	          createTableList();
	        }//queryName_ sortBy_ valid
	      }//tableList_ valid

	    }//status is success
    }//data_ status_ valid

    // If data in error, handle error.
    if ( error_ ) {
      var errorMessage_ = s_message.erInfo_;
      if ( message_ != "" ) {
        errorMessage_ = message_;
      }//message_ not empty
      parent.populateLog( errorMessage_ );
    }//error_ true
  }//returnTableList

  // PAGE TABLE LIST.
  function pageTableList( pageDirection_ ) {
    if ( g_arrayMaster && stc_isDefined( pageDirection_ ) ) {
      // Set index from which to start making list rows.
      var newIndex_ = 0;
      switch( pageDirection_ ) {
          case s_svcVals.directionNew_ : break;
          case s_svcVals.directionPrev_: newIndex_ = ( g_indexTable - g_svcVals.nbrRowsReq_ ); break;
          case s_svcVals.directionNext_: newIndex_ = ( g_indexTable + g_svcVals.nbrRowsReq_ ); break;
          default: break;
      }//switch pageDirection_
      if ( newIndex_ < 0 ) { newIndex_ = 0; }

     // Create list.
      if ( stc_isNumber( newIndex_ ) ) {
        if ( newIndex_ >= 0 ) {
	        if ( g_arrayMaster[newIndex_] ) {
	          // Set new index.
	          g_indexTable = newIndex_;

	          // Create table list.
	          createTableList();

	          // Hide load tooltip.
	          stc_hideTooltip( $( "#_tooltip" ) );
	        }//entry valid
        }//newIndex_ not lt 0
      }//newIndex_ valid
    }//g_arrayMaster pageDirection_ valid
  }//pageTableList

  // CREATE MASTER ARRAY.
  function createMasterArray( arrayTables_, heatTotal_ ) {
    if ( g_arrayMaster && arrayTables_ && stc_isNumber( heatTotal_ ) ) {
      // Set page index. Stores start position for table list.
      // If user retrieved replacement rows, index is 0 (and master array is empty at this point).
      // If user retrieved more rows, index is current length of master array.
      g_indexTable = g_arrayMaster.length;

      // Create master array.
      if ( arrayTables_.length > 0 ) {
        // Set high slots. Used to calculate width of bars in list.
        // Highest value in returned data is 100 percent and all other values will be percent of that.
        // Rows are sent from back end in sort order, either by total time or frequency.
        // Therefore, first row of new set always has highest value of property used in sort order (total time or frequency).
        // If we have new set - that is, set that starts at row 0 in back end, we can get highest values from first row.
        if ( g_indexTable == 0 ) {
          if ( stc_isDefined( arrayTables_[0].totalTime ) && stc_isDefined( arrayTables_[0].frequency ) ) {
            g_highVal1Table = parseInt( arrayTables_[0].totalTime );
            g_highVal2Table = parseInt( arrayTables_[0].frequency );
          }//properties valid
        }//g_indexTable is 0

        // Create master array.
        var length_ = arrayTables_.length;
        for ( var i = 0; i < length_; i++ ) {
          // Create object.
          var obj_              = new Object();
          obj_.id               = null;
          obj_.tableType        = "";
          obj_.tableName        = "";
          obj_.avgTime          = 0;
          obj_.totalTimePercent = 0;
          obj_.totalTime        = 0;
          obj_.frequency        = 0;
          obj_.heat             = 0;
          obj_.heatTotal        = heatTotal_;

          // Set object properties.
          if ( stc_isDefined( arrayTables_[i].tableName ) &&
               stc_isDefined( arrayTables_[i].tableType ) &&
               stc_isDefined( arrayTables_[i].avgTime ) &&
               stc_isDefined( arrayTables_[i].totalTimePercent ) &&
               stc_isDefined( arrayTables_[i].totalTime ) &&
               stc_isDefined( arrayTables_[i].frequency ) &&
               stc_isDefined( arrayTables_[i].heat ) ) {

            obj_.id               = arrayTables_[i].tableName;
            obj_.tableType        = arrayTables_[i].tableType;
            obj_.tableName        = arrayTables_[i].tableName;
            obj_.avgTime          = parseInt( arrayTables_[i].avgTime );
            obj_.totalTimePercent = parseInt( arrayTables_[i].totalTimePercent );
            obj_.totalTime        = parseInt( arrayTables_[i].totalTime );
            obj_.frequency        = parseInt( arrayTables_[i].frequency );
            obj_.heat             = parseInt( arrayTables_[i].heat );
          }//properties valid

          // Add object to master array.
          g_arrayMaster.push( obj_ );
        }//for each entry
      }//arrayTables_ not empty
    }//g_arrayMaster arrayTables_ heatTotal_ valid
  }//createMasterArray

  // INIT TABLE LIST.
  function initTableList() {
    // Delete all table list rows.
    $( "#_listTable" ).empty();

    // Zero out heat indicator in parent page.
    parent.zeroOutHeatIndicator();

    // Hide table buttons.
    toggleShowTableButtons( false );
    hideTablePageButtons();
  }//initTableList

  // CREATE TABLE LIST.
  function createTableList() {
    // Set error flag.
    var error_ = true;

    // Init vars for use in creating and handling rows.
    var noSpaceID_ = "";
    var rowID_     = "";

    // Create list.
    if ( g_arrayMaster && $( "#_listTable" ) &&
         stc_isDefined( g_sortOrderTable ) &&
         stc_isNumber( g_indexTable ) &&
         stc_isNumber( g_highVal1Table ) &&
         stc_isNumber( g_highVal2Table ) ) {

      if ( g_arrayMaster.length > 0 ) {
        // Init table list.
        initTableList();

        // Create rows.
        var heatTotal_  = 0;
        var length_     = g_arrayMaster.length;
        var iterations_ = 1;
        for ( var i = g_indexTable; i < length_; i++ ) {
          if ( stc_isDefined( g_arrayMaster[i].id ) &&
               stc_isDefined( g_arrayMaster[i].tableType ) &&
               stc_isDefined( g_arrayMaster[i].tableName ) &&
               stc_isDefined( g_arrayMaster[i].avgTime ) &&
               stc_isDefined( g_arrayMaster[i].totalTimePercent ) &&
               stc_isDefined( g_arrayMaster[i].totalTime ) &&
               stc_isDefined( g_arrayMaster[i].frequency ) &&
               stc_isDefined( g_arrayMaster[i].heat ) &&
               stc_isDefined( g_arrayMaster[i].heatTotal ) ) {

            // If we have exceeded number of requested rows, break.
            if ( iterations_ > ( g_svcVals.nbrRowsReq_ ) ) {
              break;
            } else {
              // Store total heat.
              heatTotal_ = g_arrayMaster[i].heatTotal;

              // Set ID.
              var id_ = g_arrayMaster[i].id;

              // Get display values.
              var avgTime_          = g_arrayMaster[i].avgTime;
              var totalTimePercent_ = g_arrayMaster[i].totalTimePercent;
              var totalTime_        = g_arrayMaster[i].totalTime;
              var frequency_        = g_arrayMaster[i].frequency;

              // Get bar width.
              var barWidth_ = 0;
              switch( g_sortOrderTable ) {

                  case s_svcVals.sortByTotalTime_:
                    if ( stc_isNumber( totalTime_ ) ) {
                      if ( totalTime_ > 0 && g_highVal1Table > 0 ) {
	                      barWidth_ = ( totalTime_ / g_highVal1Table ) * 100;
	                      barWidth_ = Math.round( barWidth_ );
                      }//totalTime_ g_highVal1Table gt 0
                    }//totalTime_ valid
                  break;

                  case s_svcVals.sortByFrequency_:
                    if ( stc_isNumber( frequency_ ) ) {
                      if ( frequency_ > 0 && g_highVal2Table > 0 ) {
	                      barWidth_ = ( frequency_ / g_highVal2Table ) * 100;
	                      barWidth_ = Math.round( barWidth_ );
                      }//frequency_ g_highVal2Table gt 0
                    }//frequency_ valid
                  break;

                  default: break;

              }//switch g_sortOrderTable
              if ( barWidth_ < 1 ) { barWidth_ = 1; }

              // Get bar class.
              var classBar_ = stc_getHeatBarClass( barWidth_ );
              if ( !stc_isDefined( classBar_ ) ) { classBar_ = "lpHeat0"; }

              // Set name.
              var name_ = g_arrayMaster[i].tableName;

              // Set main title.
              var title_ = name_ + "\n" +
                           "\nAverage query time:\t" + stc_addCommas( avgTime_ ) + " ms" +
                           "\n% of total:\t\t\t" + totalTimePercent_ +
                           "\nFrequency:\t\t\t" + stc_addCommas( frequency_ ) + "/sec" + "\n" +
                           "\nTo show queries, select the bar." +
                           "\nFor live update, select the bar and click the chart icon at top.";

              // Set row ID. Since we use table name for ID, we must replace any white spaces first.
              noSpaceID_ = id_.replace( /\s/g, "_" );
              rowID_     = stc_getIdentifier( noSpaceID_, s_strRow ) + i;

              // Create row and add to table.
              // To store unchanged table ID in row, assign it to name attribute, which does not have to be unique.
              var row_ = "<tr id='" + rowID_ + "' name='" + id_ + "' class='lpRow rowTable' + title='" + title_ + "'>" +
                         "<td width='125px' style='max-width: 125px;'>" + name_ + "</td>" +
                         "<td>" +
                         "<div class='" + classBar_ + "' style='width: " + barWidth_ + "%'>&nbsp;</div>" +
                         "</td>" + "<tr>";
              $( "#_listTable" ).append( row_ );

			        // Set error to false.
			        error_ = false;

              // Increment iterations.
              iterations_++;
            }//iterations_ not gt g_svcVals.nbrRowsReq_
          }//parameters valid
        }//for each entry

        // Assign event handlers to elements in list.
        $( ".rowTable" ).on ( "click", function( event ) {
          // Get ID.
          var id_ = $( this ).attr( "name" );

          // Handle this row.
          if ( stc_isDefined( id_ ) ) {
            // Store selected ID.
            g_tableIDSelected = id_;

            // Reset all rows to unselected state.
            $( ".rowTable" ).css( "background-color", s_grayE );
            $( ".rowQuery" ).css( "background-color", s_grayE );

            // Get and store row ID.
            var selectedRowID_ = $( this ).attr( "id" );
            g_tableRowSelected = selectedRowID_;

            // Set this row to selected state.
            $( "#" + selectedRowID_ ).css( "background-color", s_grayD );

            // Show chart icon.
            $( "#_iconChartTable" ).css( "visibility", "visible" );

            // Get and show query list.
            initQueryList();
            handleQueryRequest( id_, g_sortOrderQuery, true, s_svcVals.directionNew_ );
          }//id_ valid
        });

        $( ".rowTable" ).on ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
        $( ".rowTable" ).on ( "mouseout", function( event ) { $( this ).css( "opacity", "1" ); });

        // Update global thermometer in parent page.
        if ( stc_isNumber( heatTotal_ ) ) {
          parent.updateThermometerDB( heatTotal_ );
        }//heatTotal_ valid

        // Show buttons.
        toggleShowTableButtons( true );

        // Show previous button if there are previous rows.
        if ( g_indexTable > 0 ) {
          $( "#_iconPrevTable" ).css( "visibility", "visible" );
        }//g_indexTable gt 0

        // Show next button.
        $( "#_iconNextTable" ).css( "visibility", "visible" );

        // If list is refreshing, select any currently-selected row again.
        if ( g_isRefreshing_ && g_tableIDSelected != "" ) {
          // Set row to selected state.
          $( "#" + g_tableRowSelected ).css( "background-color", s_grayD );

          // Show chart icon.
          $( "#_iconChartTable" ).css( "visibility", "visible" );
        }//g_isRefreshing_ true and g_tableIDSelected valid
      }//g_arrayMaster not empty
    }//parameters valid

    // If no data, add no-data row.
    if ( error_ ) {
      $( "#_listTable" ).append( "<tr class='lpRow' >" + "<td>" + s_message.noMoreRows_ + "</td>" + "<tr>" );
    }//error_ true

    // Send next service.
    if ( g_isRefreshing_ ) {
      // Get and show query list.
      if ( g_tableIDSelected != "" ) {
	      initQueryList();
	      handleQueryRequest( g_tableIDSelected, g_sortOrderQuery, true, s_svcVals.directionNew_ );
      } else {
		    // Send service to get stats for all tables in database.
		    parent.getStatDBList();
      }//g_tableIDSelected not valid
    } else {
	    // Send service to get stats for all tables in database.
	    parent.getStatDBList();
    }//g_isRefreshing_ false
  }//createTableList

  // TOGGLE SHOW TABLE BUTTONS.
  function toggleShowTableButtons( show_ ) {
    if ( show_ ) {
      $( "#_btnSortTableTime" ).css( "visibility", "visible" );
      $( "#_btnSortTableFreq" ).css( "visibility", "visible" );
    } else {
      $( "#_btnSortTableTime" ).css( "visibility", "hidden" );
      $( "#_btnSortTableFreq" ).css( "visibility", "hidden" );
      $( "#_iconChartTable" ).css( "visibility", "hidden" );
    }//hide
  }//toggleShowTableButtons

  // HIDE TABLE PAGE BUTTONS.
  function hideTablePageButtons() {
    $( "#_iconPrevTable" ).css( "visibility", "hidden" );
    $( "#_iconNextTable" ).css( "visibility", "hidden" );
  }//hideTablePageButtons

  // GET MASTER PROPERTY.
  function getMasterProperty( id_, propertyName_ ) {
    // Set up processing vars.
    var currentID_ = "";
    var property_  = null;
    var entry_     = new Object();

    // Loop through array. If ID matches passed ID, set property and break.
    if ( stc_isDefined( g_arrayMaster ) && stc_isDefined( id_ ) && stc_isDefined( propertyName_ ) ) {
      var length_ = g_arrayMaster.length;
      for ( var i = 0; i < length_; i++ ) {
        // Get entry.
        entry_ = new Object();
        entry_ = g_arrayMaster[i];

        // Get main ID.
        currentID_ = "";
        if ( stc_isDefined( entry_ ) ) { currentID_ = entry_.id; }

        // If match, set property.
        if ( currentID_ == id_ ) {

		      switch( propertyName_ ) {

		        case "tableType_": if ( stc_isDefined( entry_.tableType ) ) { property_ = entry_.tableType; } break;
		        case "tableName_": if ( stc_isDefined( entry_.tableName ) ) { property_ = entry_.tableName; } break;

		        default: break;

		      }//switch propertyName_

		      // Break.
		      break;
        }//currentID_ matches id_
      }//for each table in array
    }//params valid

    // Return property.
    return property_;
  }//getMasterProperty

  // ============================================================================
  // QUERY LIST.
  // ============================================================================

  // HANDLE QUERY REQUEST.
  function handleQueryRequest( tableID_, sortOrder_, startOver_, pageDirection_ ) {
    if ( stc_isDefined( tableID_ ) && stc_isDefined( sortOrder_ ) && stc_isDefined( pageDirection_ ) ) {
	    // Perform setup actions.
	    setupQueryRequest( sortOrder_, startOver_, pageDirection_ );

	    // Depending on user selection, send request for service result or page to prev/next rows.
	    switch( pageDirection_ ) {

	        case s_svcVals.directionNew_:
	          getQueryList( tableID_, sortOrder_ );
	        break;

	        case s_svcVals.directionPrev_:
	          pageQueryList( s_svcVals.directionPrev_ );
	        break;

	        case s_svcVals.directionNext_:
	          // Find out if user is paging thru rows that have already been retrieved, or if
	          // he has reached end of stored rows (in query array) and is asking for next page from service.
	          // Page index marks where we are in query array.
	          // When service returns set of rows, they are added to query array and query index is set to first returned row in query array.
	          // When user pages back and forth thru rows, query index is set to first row pushed to screen.
	          // Difference between query index and number of rows in query array is number of rows currently showing on screen.
	          // If difference is less than or equal to number of available rows on screen, we must get new set of rows.
	          // If difference is greater than number of available rows on screen, we can still page forward.
	          if ( g_arrayQuery && stc_isNumber( g_indexQuery ) ) {
	            var nbrRows_ = ( g_arrayQuery.length - g_indexQuery );
	            if ( stc_isNumber( nbrRows_ ) ) {
	             if ( nbrRows_ <= g_svcVals.nbrRowsReq_ ) {
	               // Send request for new set of rows.
	               getQueryList( tableID_, sortOrder_ );
	             } else {
	               // Show next set of stored rows.
	               pageQueryList( s_svcVals.directionNext_ );
	             }//nbrRows_ gt g_svcVals.nbrRowsReq_
	            }//nbrRows_ valid
	          }//g_arrayQuery g_indexQuery valid
	        break;

	        default: break;

	    }//switch pageDirection_
    }//parameters valid
  }//handleQueryRequest

  // SETUP QUERY REQUEST.
  function setupQueryRequest( sortOrder_, startOver_, pageDirection_ ) {
    if ( stc_isDefined( sortOrder_ ) && stc_isDefined( pageDirection_ ) ) {
	    // TIMER/CHART
	    // Init chart. Includes timer tracking stop.
	    if ( !g_isRefreshing_ ) {
	      initChart();
	    }//g_isRefreshing_ false

	    // PAGING.
	    // Set page direction.
	    g_pageDirectionQuery = pageDirection_;

	    // Init page index.
	    if ( startOver_ ) {
	      g_indexQuery = 0;
	    }//startOver_ true

	    // QUERY
	    // Clear out query array, init high slots.
	    if ( startOver_ ) {
	      g_arrayQuery    = new Array();
	      g_highVal1Query = 0;
	      g_highVal2Query = 0;
	    }//startOver_ true

	    // Null vars for currently-selected query.
	    if ( !g_isRefreshing_ ) {
		    g_queryIDSelected  = "";
		    g_queryRowSelected = "";
	    }//g_isRefreshing_ false

	    // Unhighlight buttons.
	    $( ".btnQuery" ).css( "color", s_white );
	    $( ".btnQuery" ).css( "font-weight", "normal" );

	    // Clear but retain query edit dialog.
	    if ( !g_isRefreshing_ ) {
	      stc_clearQueryEdit();
	    }//g_isRefreshing_ false

	    // SORT ORDER
      // Store sort order.
      g_sortOrderQuery = sortOrder_;

      // Highlight button to match sort.
      switch( g_sortOrderQuery ) {

          case s_svcVals.sortByTotalTime_:
            $( "#_btnSortQueryTime" ).css( "color", s_black );
            $( "#_btnSortQueryTime" ).css( "font-weight", "bold" );
          break;

          case s_svcVals.sortByFrequency_:
            $( "#_btnSortQueryFreq" ).css( "color", s_black );
            $( "#_btnSortQueryFreq" ).css( "font-weight", "bold" );
          break;

          default: break;

      }//switch g_sortOrderQuery
    }//parameters valid
  }//setupQueryRequest

  // GET QUERY LIST.
  function getQueryList( id_, sortOrder_ ) {
    if ( stc_isDefined( id_ ) && stc_isDefined( sortOrder_ ) && g_arrayQuery ) {
	    // TEST Set test result.
	    if ( parent.i_isTestMode ) {
		    var testResult_    = new Object();
	      testResult_        = testQueryResult_;
	      testResult_.sortBy = sortOrder_;
	    }//is parent.i_isTestMode

      // Get filter value.
      var filterType_ = s_queryType.all_;
      if ( $( "#_dropdownQueryType" ) ) {
        filterType_ = $( "#_dropdownQueryType" ).val();
      }//_dropdownQueryType valid

	    // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.statsQuery_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName', value: s_action.statsQuerySummary_ } );
	    arrayParams_.push( { param: 'sortBy',    value: sortOrder_ } );
	    arrayParams_.push( { param: 'queryType', value: filterType_ } );
	    arrayParams_.push( { param: 'tableName', value: id_ } );
	    arrayParams_.push( { param: 'rowOffset', value: g_arrayQuery.length } );
	    arrayParams_.push( { param: 'rowLimit',  value: g_svcVals.nbrRowsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.statsQuery_, arrayParams_, returnQueryList, testResult_, $( "#_tooltip" ), returnQueryError );
    }//id_ sortOrder_ g_arrayQuery valid
  }//getQueryList

  // RETURN QUERY ERROR.
  function returnQueryError() {
    // Set flag to false.
    g_isRefreshing_ = false;

    // Init chart. Includes timer tracking stop.
    initChart();

    // Null vars for currently-selected query.
    g_queryIDSelected  = "";
    g_queryRowSelected = "";

    // Clear but retain query edit dialog.
    stc_clearQueryEdit();
  }//returnQueryError

  // RETURN QUERY LIST.
  function returnQueryList( data_, status_, message_ ) {
    // Set error flag.
    var error_ = true;

    // Handle result.
    if ( stc_isDefined( data_ ) && stc_isDefined( status_ ) ) {
	    if ( status_ == s_svcVals.success_ ) {
        // Set error to false.
        error_ = false;

		    // Set up result vals.
		    var queryName_   = "";
		    var sortBy_      = "";
		    var queryList_   = null;

		    // Get result vals.
		    if ( stc_isDefined( data_.queryName ) ) { queryName_ = data_.queryName; }
		    if ( stc_isDefined( data_.sortBy ) )    { sortBy_    = data_.sortBy; }
		    if ( stc_isDefined( data_.queryList ) ) { queryList_ = data_.queryList; }

		    // Handle result.
	      if ( stc_isDefined( queryList_ ) ) {
	        if ( queryName_ == s_action.statsQuerySummary_ && sortBy_ == g_sortOrderQuery ) {
		        // Set error to false.
		        error_ = false;

	          // Create query array.
	          createQueryArray( queryList_ );

	          // Create query list.
	          createQueryList();
	        }//queryName_ sortBy_ valid
	      }//queryList_ valid

	    }//status is success
    }//data_ status_ valid

    // If data in error, handle error.
    if ( error_ ) {
      var errorMessage_ = s_message.erInfo_;
      if ( message_ != "" ) {
        errorMessage_ = message_;
      }//message_ not empty
      parent.populateLog( errorMessage_ );
    }//error_ true
  }//returnQueryList

  // PAGE QUERY LIST.
  function pageQueryList( pageDirection_ ) {
    if ( g_arrayQuery && stc_isDefined( pageDirection_ ) ) {
      // Set index from which to start making list rows.
      var newIndex_ = 0;
      switch( pageDirection_ ) {
          case s_svcVals.directionNew_ : break;
          case s_svcVals.directionPrev_: newIndex_ = ( g_indexQuery - g_svcVals.nbrRowsReq_ ); break;
          case s_svcVals.directionNext_: newIndex_ = ( g_indexQuery + g_svcVals.nbrRowsReq_ ); break;
          default: break;
      }//switch pageDirection_
      if ( newIndex_ < 0 ) { newIndex_ = 0; }

     // Create list.
      if ( stc_isNumber( newIndex_ ) ) {
        if ( newIndex_ >= 0 ) {
	        if ( g_arrayQuery[newIndex_] ) {
	          // Set new index.
	          g_indexQuery = newIndex_;

	          // Create query list.
	          createQueryList( );

	          // Hide load tooltip.
	          stc_hideTooltip( $( "#_tooltip" ) );
	        }//entry valid
        }//newIndex_ not lt 0
      }//newIndex_ valid
    }//g_arrayQuery pageDirection_ valid
  }//pageQueryList

  // CREATE QUERY ARRAY.
  function createQueryArray( arrayQueries_ ) {
    if ( g_arrayQuery && arrayQueries_ ) {
      // Set page index. Stores start position for query list.
      // If user retrieved replacement rows, index is 0.
      // If user retrieved more rows, index is current length of query array.
      g_indexQuery = g_arrayQuery.length;

      // Create query array.
      if ( arrayQueries_.length > 0 ) {
        // Set high slots. Used to calculate width of bars in list.
        // Highest value in returned data is 100 percent and all other values will be percent of that.
        // Rows are sent from back end in sort order, either by total time or frequency.
        // Therefore, first row of new set always has highest value of property used in sort order (total time or frequency).
        // If we have new set - that is, set that starts at row 0 in back end, we can get highest values from first row.
        if ( g_indexQuery == 0 ) {
          if ( stc_isDefined( arrayQueries_[0].totalTime ) && stc_isDefined( arrayQueries_[0].frequency ) ) {
            g_highVal1Query = parseInt( arrayQueries_[0].totalTime );
            g_highVal2Query = parseInt( arrayQueries_[0].frequency );
          }//properties valid
        }//g_indexQuery is 0

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

  // INIT QUERY LIST.
  function initQueryList() {
    // Delete all query rows.
    $( "#_listQuery" ).empty();

    // Hide query buttons.
    toggleShowQueryButtons( false );
    hideQueryPageButtons();
  }//initQueryList

  // CREATE QUERY LIST.
  function createQueryList() {
    // Set error flag.
    var error_ = true;

    // Create list.
    if ( g_arrayQuery && $( "#_listQuery" ) &&
        stc_isDefined( g_sortOrderQuery ) &&
        stc_isNumber( g_indexQuery ) &&
        stc_isNumber( g_highVal1Query ) &&
        stc_isNumber( g_highVal2Query ) ) {

      if ( g_arrayQuery.length > 0 ) {
        // Init query list.
        initQueryList();

        // Create rows.
        var length_     = g_arrayQuery.length;
        var iterations_ = 1;
        for ( var i = g_indexQuery; i < length_; i++ ) {
          if ( stc_isDefined( g_arrayQuery[i].queryId ) &&
               stc_isDefined( g_arrayQuery[i].queryText ) &&
               stc_isDefined( g_arrayQuery[i].avgTime ) &&
               stc_isDefined( g_arrayQuery[i].totalTimePercent ) &&
               stc_isDefined( g_arrayQuery[i].totalTime ) &&
               stc_isDefined( g_arrayQuery[i].frequency ) &&
               stc_isDefined( g_arrayQuery[i].heat ) ) {

            // If we have exceeded number of requested rows, break.
            if ( iterations_ > ( g_svcVals.nbrRowsReq_ ) ) {
              break;
            } else {
                // Set query ID.
                var queryID_ = g_arrayQuery[i].queryId;

	              // Get display values.
	              var avgTime_          = g_arrayQuery[i].avgTime;
	              var totalTimePercent_ = g_arrayQuery[i].totalTimePercent;
	              var totalTime_        = g_arrayQuery[i].totalTime;
	              var frequency_        = g_arrayQuery[i].frequency;

                // Get bar width.
                var barWidth_ = 0;
                switch( g_sortOrderQuery ) {

                    case s_svcVals.sortByTotalTime_:
                      if ( stc_isNumber( totalTime_ ) ) {
                        if ( totalTime_ > 0 && g_highVal1Query > 0 ) {
	                        barWidth_ = ( totalTime_ / g_highVal1Query ) * 100;
	                        barWidth_ = Math.round( barWidth_ );
                        }//totalTime_ g_highVal1Query gt 0
                      }//totalTime_ valid
                    break;

                    case s_svcVals.sortByFrequency_:
                      if ( stc_isNumber( frequency_ ) ) {
                        if ( frequency_ > 0 && g_highVal2Query > 0 ) {
	                        barWidth_ = ( frequency_ / g_highVal2Query ) * 100;
	                        barWidth_ = Math.round( barWidth_ );
                        }//frequency_ g_highVal2Query gt 0
                      }//frequency_ valid
                    break;

                    default: break;

                }//switch g_sortOrderQuery
                if ( barWidth_ < 1 ) { barWidth_ = 1; }

                // Get bar class.
                var classBar_ = stc_getHeatBarClass( barWidth_ );
                if ( !stc_isDefined( classBar_ ) ) { classBar_ = "lpHeat0"; }

                // Set query text.
                var queryText_ = g_arrayQuery[i].queryText;

	              // Set main title.
	              var title_ = "Average query time:\t" + stc_addCommas( avgTime_ ) + " ms" +
	                           "\n% of total:\t\t\t" + totalTimePercent_ +
	                           "\nFrequency:\t\t\t" + stc_addCommas( frequency_ ) + "/sec" + "\n" +
	                           "\nFor live update, select the bar and click the chart icon at top.";

                // Set row ID.
                var rowID_ = stc_getIdentifier( queryID_, s_strRow ) + i;

                // Create row and add to table.
                // To store unchanged query ID in row, assign it to name attribute, which does not have to be unique.
                var row_ = "<tr id='" + rowID_ + "' name='" + queryID_ + "' class='lpRow rowQuery' + title='" + title_ + "'>" +
                           "<td width='280px' style='max-width: 280px;'>" + queryText_ + "</td>" +
                           "<td>" +
                           "<div class='" + classBar_ + "' style='width: " + barWidth_ + "%'>&nbsp;</div>" +
                           "</td>" + "<tr>";
                $( "#_listQuery" ).append( row_ );

				        // Set error to false.
				        error_ = false;

                // Increment iterations.
                iterations_++;
            }//iterations_ not gt g_svcVals.nbrRowsReq_
          }//parameters valid
        }//for each entry

        // Assign event handlers to elements in lists.
        $( ".rowQuery" ).on ( "click", function( event ) {
          // Get ID.
          var id_ = $( this ).attr( "name" );

          // Handle this row.
          if ( stc_isDefined( id_ ) ) {
            // Store selected query ID.
            g_queryIDSelected = id_;

            // Init chart. Includes timer tracking stop.
            initChart();

            // Reset all rows to unselected state.
            $( ".rowQuery" ).css( "background-color", s_grayE );

            // Get and store row ID.
            var selectedRowID_ = $( this ).attr( "id" );
            g_queryRowSelected = selectedRowID_;

            // Set this row to selected state.
            $( "#" + selectedRowID_ ).css( "background-color", s_grayD );

            // Show chart icon.
            $( "#_iconChartQuery" ).css( "visibility", "visible" );

            // Open query edit dialog.
            openQueryEdit( id_ );
          }//id_ valid
        });

        $( ".rowQuery" ).on ( "mouseover", function( event ) { $( this ).css( "opacity", "0.5" ); });
        $( ".rowQuery" ).on ( "mouseout", function( event )  { $( this ).css( "opacity", "1" ); });

        // Show query buttons.
        toggleShowQueryButtons( true );

        // Show previous button if there are previous rows.
        if ( g_indexQuery > 0 ) {
          $( "#_iconPrevQuery" ).css( "visibility", "visible" );
        }//g_indexQuery gt 0

        // Show next button.
        $( "#_iconNextQuery" ).css( "visibility", "visible" );

        // If list is refreshing, select any currently-selected row again.
        if ( g_isRefreshing_ && g_queryIDSelected != "" ) {
          // Set row to selected state.
          $( "#" + g_queryRowSelected ).css( "background-color", s_grayD );

          // Show chart icon.
          $( "#_iconChartQuery" ).css( "visibility", "visible" );
        }//g_isRefreshing_ true and g_queryIDSelected valid
      }//g_arrayQuery not empty
    }//parameters valid

    // If no data, add no-data row.
    if ( error_ ) {
      // Add row.
      $( "#_listQuery" ).append( "<tr class='lpRow' >" + "<td>" + s_message.noMoreRows_ +"</td>" + "<tr>" );

      // Reset query type drop-down to default query type.
      $( "#_dropdownQueryType" )[0].selectedIndex = 0;
    }//error_ true

    // Send next service.
    if ( g_isRefreshing_ ) {
	    // Set flag to false.
	    g_isRefreshing_ = false;

	    // Send service to get stats for all tables in database.
	    parent.getStatDBList();
    }//g_isRefreshing_ true
  }//createQueryList

  // TOGGLE SHOW QUERY BUTTONS.
  function toggleShowQueryButtons( show_ ) {
    if ( show_ ) {
      $( "#_btnSortQueryTime" ).css( "visibility", "visible" );
      $( "#_btnSortQueryFreq" ).css( "visibility", "visible" );
      $( "#_spanQueryType" ).css( "visibility", "visible" );
      $( "#_dropdownQueryType" ).css( "visibility", "visible" );
    } else {
      $( "#_btnSortQueryTime" ).css( "visibility", "hidden" );
      $( "#_btnSortQueryFreq" ).css( "visibility", "hidden" );
      $( "#_iconChartQuery" ).css( "visibility", "hidden" );
      $( "#_spanQueryType" ).css( "visibility", "hidden" );
      $( "#_dropdownQueryType" ).css( "visibility", "hidden" );
    }//hide
  }//toggleShowQueryButtons

  // HIDE QUERY PAGE BUTTONS.
  function hideQueryPageButtons() {
    $( "#_iconPrevQuery" ).css( "visibility", "hidden" );
    $( "#_iconNextQuery" ).css( "visibility", "hidden" );
  }//hideQueryPageButtons

  // ============================================================================
  // STAT LIST.
  // ============================================================================

  // START STAT LIST.
  function startStatList( id_, type_ ) {
    if ( stc_isDefined( id_ ) && stc_isDefined( type_ ) ) {
	    // TIMER/CHART
	    // Init chart. Includes timer tracking stop.
	    initChart();

	    // PARAMETERS
	    // Store ID and type.
	    g_statsID         = id_;
	    g_statRequestType = type_;

	    // START
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

	    // Send service.
	    var loadMessage_ = s_message.loading_ + " " + s_action.statsStats_;
	    var arrayParams_ = new Array();
	    arrayParams_.push( { param: 'queryName',   value: s_action.statsStats_ } );
	    arrayParams_.push( { param: 'statType',    value: g_statRequestType } );
	    arrayParams_.push( { param: 'statsTypeId', value: g_statsID } );
	    arrayParams_.push( { param: 'rowLimit',    value: g_svcVals.nbrStatsReq_ } );
	    stc_sendService( parent, loadMessage_, s_action.statsStats_, arrayParams_, returnStatList, testStatsResult_, $( "#_tooltip" ), returnStatListError );
    }//g_statsID g_statRequestType valid
  }//getStatList

  // RETURN STAT LIST ERROR.
  function returnStatListError() {
    // Init chart. Includes timer tracking stop.
    initChart();
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
    var chartLineID_    = stc_getIdentifier( "", s_strChartLine );
    var arrayChartLine_ = new Array();
    arrayChartLine_     = [ chartLineID_ ];
    var vLabelsID_      = stc_getIdentifier( "", s_strChartVLabels );
    chrt_clearChart( g_stageChart, g_layerChart, arrayChartLine_, "", vLabelsID_, "", $( "#_titleChart" ) );
  }//initChart

  // CLOSE CHART.
  function closeChart() {
    initChart();
    chrt_hideChart( $( "#_chartContainerMain" ), $( "#_chartContainer" ), $( "#_titleChart" ), $( "#_iconsChart" ) );
  }//closeChart

  // MAKE CHART.
  function makeChart() {
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
                            showPoints_, radiusPoint_, mouseoverChart, mouseOutTooltipLocal, true, g_layerChart );

      // Draw layer.
      g_layerChart.draw();

      // Get title and fill.
      var tableName_      = "";
      var queryText_      = "";
      var textNormalized_ = "";
      var title_          = s_message.notFound_;
      var fill_           = s_color.tan_;
      switch( g_statRequestType ) {

        case s_statType.table_:
          // Get title.
          tableName_ = getMasterProperty( g_statsID, "tableName_" );
          if ( stc_isDefined( tableName_ ) ) {
            textNormalized_ = stc_normalizeText( tableName_, g_charLimit.chart_ );
            title_          = stc_addEllipsis( tableName_, textNormalized_, g_charLimit.chart_ );
          }//tableName_ valid

          // Get fill.
          var tableType_ = getMasterProperty( g_statsID, "tableType_" );
          if ( stc_isDefined( tableType_ ) ) {
            if ( stc_isDefined( stc_getTypeFill( tableType_ ) ) ) {
              fill_ = stc_getTypeFill( tableType_ );
              if ( fill_ == s_white ) { fill_ = s_color.blueDark_; }
            }//tableType_ fill_ valid
          }//tableType_ valid
        break;

        case s_statType.query_:
          if ( g_arrayQuery ) {
            var queryIndex_ = stc_getQueryIndex( g_arrayQuery, g_statsID );
            if ( stc_isDefined( queryIndex_ ) ) {
              if ( stc_isDefined( g_arrayQuery[queryIndex_].queryText ) ) {
                queryText_      = g_arrayQuery[queryIndex_].queryText;
                textNormalized_ = stc_normalizeText( queryText_, g_charLimit.chart_ );
                title_          = stc_addEllipsis( queryText_, textNormalized_, g_charLimit.chart_ );
                fill_           = s_color.brown_;
              }//queryText_ valid
            }//queryIndex_ valid
          }//g_arrayQuery valid
        break;

        default: break;

      }//switch g_statRequestType

      // Set title.
      if ( empty_ ) {
        title_ = title_ + " " + s_message.notAvailable_;
      } else {
        title_ = title_ + " " + g_uiStr.tipFrequency_;
      }//empty_ false
      $( "#_titleChart" ).html( title_ );

      // Set chart fill.
      chrt_setChartFill( $( "#_chartContainerMain" ), fill_ );

      // Show chart.
      chrt_showChart( $( "#_chartContainerMain" ), $( "#_chartContainer" ), $( "#_titleChart" ), $( "#_iconsChart" ) );
    }//g_arrayStat g_chart h_ w_ valid
  }//makeChart

  // MOUSEOVER CHART.
  function mouseoverChart( event ) {
    if ( event.targetNode ) {
      var shape_ = event.targetNode;
      if ( shape_ && $( "#_chartContainerMain" ) && stc_isDefined( g_stageChart.getMousePosition() ) ) {
        var mousePos_ = g_stageChart.getMousePosition();
        var x_ = $( "#_chartContainerMain" ).position().left + mousePos_.x + 20;
        var y_ = $( "#_chartContainerMain" ).position().top + mousePos_.y + 20;
        stc_moveTooltip( $( "#_tooltip" ), x_, y_ );
        stc_showTooltip( $( "#_tooltip" ), shape_.getName(), 20, 40, true );
      }//parameters valid
    }//targetNode valid
  }//mouseoverChart

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
  // QUERY EDIT.
  // ============================================================================

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
        var queryText_ = g_uiStr.erNoQueryText_;
        if ( stc_isDefined( g_arrayQuery[queryIndex_].queryText ) ) {
          queryText_ = g_arrayQuery[queryIndex_].queryText;
        }//queryText_ valid

        // Set position and move query edit dialog.
        var x_ = Math.floor( window.innerWidth/2 );
        var y_ = Math.floor( window.innerHeight/2 );
        stc_moveQueryEdit( x_, y_ );

        // Show query edit dialog.
        stc_showQueryEdit( queryText_ );
      }//queryIndex_ valid
    }//parameters valid
  }//openQueryEdit

  // ============================================================================
  // UTILITY.
  // ============================================================================

  // MOUSE OUT TOOLTIP LOCAL.
  function mouseOutTooltipLocal( event ) {
    stc_mouseOutTooltip( $( "#_tooltip" ), event );
  }//mouseOutTooltipLocal
