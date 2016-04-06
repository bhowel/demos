
  // =============================================================================
	// tuffDataList.js External functions are marked with "External".
  // ============================================================================

	var n_tuffDataList = function(){

		// ============================================================================
		// GLOBAL VARS.
		// ============================================================================

		// Values for list containers.
		var listContainers = null;
	
		// Current container index.
		// Tells the calling page which list to retrieve.
		var containerIndexCurrent = 0;
	  
	  // ============================================================================
	  // SETUP LISTS.
	  // ============================================================================

	  // SETUP LISTS. External.
	  // Create the basic HTML for each list in the calling page.
	  // Setup creates the parent HTML components -
	  // the actual lists are created later.
	  // Each list can be a source and/or a target list.
	  // When the user selects a row in a source list, we get the pkey of the selected row
	  // and use it to load the related data into a target list.
	  function setupLists( parentComponent, passedlistContainers, doAfterLoadFunction ) {
	    listContainers      = passedlistContainers;
	    var numberLists     = listContainers.length;
	    var container       = "";
	    var iframeID        = "";
	    var divID           = "";
	    var handleID        = "";
	    var tabID           = "";
	    var scrollCoverID   = "";
	    var maskID          = "";
	    var sourceFieldID   = "";
	    var targetFieldID   = "";
	    var trimmedText     = "";
	    var sourceField     = "";
	    var index           = "";
	    var innerIframe     = null;
	    var innerBody       = null;
	    var innerHeader     = null;
	    var listColor       = null;
	    
	    // Initialize the index for the current container.
	    containerIndexCurrent = 0;
    	    
	    // Set up each list found in passedlistContainers.
	    for ( var i = 0; i < numberLists; i++ ) {
		    // Create IDs for the HTML components.
		    iframeID      = "tuffDL_iframe_"      + i.toString();
		    divID         = "tuffDL_div_"         + i.toString();
		    handleID      = "tuffDL_handle_"      + i.toString();
		    tabID         = "tuffDL_tab_"         + i.toString();
		    scrollCoverID = "tuffDL_scrollCover_" + i.toString();
		    maskID        = "tuffDL_mask_"        + i.toString();
		    sourceFieldID = "";
		    targetFieldID = "";
			
		    // Set iframeID and add it to the current listContainers entry.
		    listContainers[i].iframeID = iframeID;

		    // Set sourceFieldID and add it to the current listContainers entry.
		    // The source field is used in a target list.
		    // We populate the field with the fkey from the list.
		    // The fkey shows which row the user selected in the source list.
		    if ( listContainers[i].source !== "" ) {
		      sourceFieldID = "tuffDL_source_" + i.toString();
		    }//has source list
		    listContainers[i].sourceFieldID = sourceFieldID;

		    // Set targetFieldID and add it to the current listContainers entry.
		    // The target field is used by the source list.
		    // We initialize the target field when the source list is initialized.
		    if ( listContainers[i].target !== "" ) {
		      targetFieldID = "tuffDL_source_" + listContainers[i].target;
		    }//has target list
		    listContainers[i].targetFieldID = targetFieldID;

		    // Create the HTML for the screen name.		    		    
		    trimmedText = trimText( listContainers[i].name, 31 );		    
		    sourceName  = "<span class='tuffDLHeader' title='" + listContainers[i].name +"'>" + trimmedText + "</span>&nbsp;&nbsp;";
		    
		    // If the list is a target list, create the HTML for the source field.
		    sourceField = "";
		    if ( listContainers[i].source !== "" ) {
		      sourceField = "<input id='" + sourceFieldID + "' class='tuffDLInput' type='text' disabled readonly />";
		    }//has source list

		    // Create the HTML for the components that contain and manage the list.
		    // The parent container is a div that contains several other HTML components
		    // we use for handling and presenting the list, including an iframe
		    // that contains the actual list.
		    // The actual list is a separate HTML page inside the iframe.
		    container = "<div id='" + divID + "' class='tuffDLDiv' style='position: absolute; top: " + listContainers[i].top + "px; left: " + listContainers[i].left + "px; width: " + listContainers[i].width + "px; z-index: 1;'>" +
		    "<div id='" + tabID + "' class='tuffDLTab' style='background: " + listContainers[i].color + ";'>" +
		    "<table class='tuffDLTabContents' title='" + listContainers[i].name + " list.'>" +
		    "<tr id='" + handleID + "' class='cursorMove'>" +
		    "<td>" +
		    sourceName + sourceField +
		    "</td>" +
		    "</tr>" +
		    "</table>" +
		    "</div>" +
		    "<iframe id='" + iframeID + "' src='tuffDataList/tuffDataList.html' class='tuffDLIframe' frameBorder='0' scrolling='no'></iframe>" +
		    "<div id='" + scrollCoverID + "' class='tuffDLScrollCover' style='background: " + listContainers[i].color + ";'>&nbsp;</div>" +
		    "<div id='" + maskID + "' class='tuffDLMask'></div>" +
		    "</div>";
		  		    		     
		    // Append the HTML container to its parent HTML component.
		    $( parentComponent ).append( container );	   
		  		    
		    // Store the iframe's index in the iframe component.
		    $( "#" + iframeID ).attr( "data-index", i );

				// Event handlers.
				// Lists appear in iframes.
				// Use iframe masks for each list during the drag and resize events.
				// The masks stop events from continuing to fire on iframe contents during mouse up.
				// In addition, use iframeFix for the drag event.
				// Safari bugs prevent the default resize handler from working,
				// so use jquery ui for the resize event.
	  
		    // List mousedown handler.
		    $( "#" + divID ).on( "mousedown", function( event ) {
	        // Push all lists down to the bottom layer and put this list on the top layer.
	        setAllZIndex( numberLists, $( this ) );
		    });

		    // List resizable.
		    $( "#" + divID ).resizable({
		      containment: "document",
		      start: function( event, ui ) {
		        // Show the mask.
		        toggleAllMasks( numberLists, "block" );

		        // Push all lists down to the bottom layer and put this list on the top layer.
		        setAllZIndex( numberLists, $( this ) );
		      },
		      stop: function( event, ui )  {
		        // Hide the mask.
		        toggleAllMasks( numberLists, "none" );

		        // Set col resizing.
		        getIframe( iframeID ).n_tuffDataList.setColResizing();
		      }
		    });

		    // List draggable.
		    $( "#" + divID ).draggable({
		      handle     : "#" + handleID,
		      iframeFix  : true,
		      containment: "document",
		      start: function( event, ui ) {
		        // Show the mask.
		        toggleAllMasks( numberLists, "block" );

		        // Push all lists down to the bottom layer and put this list on the top layer.
		        setAllZIndex( numberLists, $( this ) );
		      },
		      stop: function( event, ui )  {
		        // Hide the mask.
		        toggleAllMasks( numberLists, "none" );
		      }
		    });
		    
		    // List load handler.
		    // Initialize the header and set the colors for the main elements
		    // inside the iframe.
		    // Call the doAfterLoadFunction.
		    // Always put this handler at the end of the current function, so
		    // we can use it to call other functions that must wait for the lists
		    // to finish loading.
		    $( "#" + iframeID ).load( function() {
		      // Get the iframe.
		      innerIframe = getIframe( $( this ).attr( "id" ) );
		      
		      // Initialize the header.
		      innerIframe.n_tuffDataList.initHeader();

		      // Get the color for elements inside the iframe.
		      index     = $( this ).attr( "data-index" );
		      listColor = listContainers[index].color;
		      
		      // Get the elements inside the iframe.
		      innerBody   = innerIframe.$( "body" );
		      innerHeader = innerIframe.$( "#tuffDL_head" );

		      // Set the color of elements inside the iframe.
		      innerBody.css( "background", listColor );
		      innerHeader.css( "background", listColor );		      

					// Call the after load function.
					if ( isDefined( doAfterLoadFunction ) ) {
						doAfterLoadFunction();
					}//doAfterLoadFunction valid		      
		    });
	    }//for all lists
	  }//setupLists
	  
	  // INIT HEADER. External.
	  function initHeader() {
		  // Enable column resizing in the header.
		  enableColResizing( $( "#tuffDL_headTable" ), setListColWidth );
	  }//initHeader

	  // ============================================================================
	  // CREATE LISTS.
	  // ============================================================================

	  // SET CONTAINER INDEX. External.
	  function setContainerIndex( containerIndex ) {
			containerIndexCurrent = containerIndex;
	  }//setContainerIndex

	  // GET CONTAINER INDEX. External.
	  function getContainerIndex() {
			return containerIndexCurrent;
	  }//getContainerIndex
	  	  
	  // BUILD LIST. External.
	  function buildList( response, getDataFunction, handleRowSelectionFunction ) {
			// If the response is valid, create the list.
			// If not, create the list with one empty row.
	    if ( isDefined( response ) ) { 
	      createList( response, getDataFunction, handleRowSelectionFunction );
	    } else {
	      createList( null, null, null );
	    }//response not valid
	  }//buildList
	  
	  // CREATE LIST. External.
	  function createList( response, getDataFunction, handleRowSelectionFunction ) {
	    var containerIndex = containerIndexCurrent;
	    var targetIndex  = -1;
	    var listName     = listContainers[containerIndex].iframeID;
	    var errorFlag    = false;
	    var row          = null;
	    var length       = null;
	    var entry        = null;
	    var pkey         = "";
	    var fkey         = null;
	    var fname        = null;
	    var selectedPkey = "";
	    var rowValues    = null;
	    	    
	    // Initialize the error flag.
	    errorFlag = true;

	    // Initialize the list.
	    getIframe( listName ).n_tuffDataList.initList();
	    
	    // Get the target index.
	    targetIndex = -1;
	    if ( listContainers[containerIndex].target !== "" ) {
	      targetIndex = parseInt( listContainers[containerIndex].target );
	    }//target not empty
	    
	    // Initialize the target list.
	    if ( targetIndex > -1 ) {
	      getIframe( listContainers[targetIndex].iframeID ).n_tuffDataList.initList();
	      populateField( $( "#" + listContainers[containerIndex].targetFieldID ), "", true );
	    }//targetIndex valid

	    // Create the list.
	    if ( isDefined( response ) ) {
		    if ( response.length > 0 ) {
		      row    = null;
		      length = response.length;
		      entry  = null;
		      pkey   = "";

		      // Create the header row.
		      row = getIframe( listName ).n_tuffDataList.createHeaderRow( response );
		      if ( isDefined( row ) ) {
		        getIframe( listName ).n_tuffDataList.appendHeaderRow( row );
		      }//row valid

		      // Create the data rows.
		      for ( var i = 0; i < length; i++ ) {
			      row = null;

			      // Get the entry.
			      entry = response[i];

				    // Get the pkey, fkey, and fname.
				    pkey  = entry.pkey;
				    fkey  = entry.fkey;
				    fname = fkey;
				    if ( entry.fname ) {
				      fname = entry.fname;
				    }//entry.fname valid

			      // Create the row and add it to the list.
			      if ( isDefined( entry ) ) {
					    row = getIframe( listName ).n_tuffDataList.createDataRow( entry, pkey );
							if ( isDefined( row ) ) {
								getIframe( listName ).n_tuffDataList.appendDataRow( row );
							}//row valid					    
			      }//entry valid
		      }//for each entry

		      // Row event handler.
					getIframeElement( listName, ".tuffDLRow" ).on( "click", function( event ) {
						// Select the row.
						getIframe( listName ).n_tuffDataList.selectRow( $( this ), "tuffDL_listTable" );
						  						
						// Call the optional function for handling the row selection.
						// You can use this function to trigger custom actions for selected rows.
						if ( isDefined( handleRowSelectionFunction ) ) {
						  // Get the row values.
						  rowValues = JSON.parse( $( this ).attr( "data-rowValues" ) );
						  
						  // Fire the function.
						  handleRowSelectionFunction( containerIndex, rowValues );
						}//handleRowSelectionFunction valid	
						
						// If the list has a target list, retrieve the target list.    
						if ( targetIndex > -1 ) {
						  if ( isDefined( getDataFunction ) ) {
						    // Get the pkey for the row.
						    selectedPkey = $( this ).attr( "data-pkey" );
						    
						    // Fire the function.						  
						    getDataFunction( selectedPkey, targetIndex );
						  }//getDataFunction valid
						}//targetIndex valid			     
					});

		      // Set the error flag to false.
		      errorFlag = false;
		    }//response not empty
	    }//response valid

	    // Enable column resizing.
	    getIframe( listName ).n_tuffDataList.setColResizing();

	    // Insert the fname value into the field at the head of the target list.
	    if ( listContainers[containerIndex].sourceFieldID !== "" ) {
	      populateField( $( "#" + listContainers[containerIndex].sourceFieldID ), fname, true );
	    }//sourceFieldID not empty

	    // If we have no data, add the no-data row.
	    if ( errorFlag ) {
	      getIframe( listName ).n_tuffDataList.initList();
	      getIframe( listName ).n_tuffDataList.appendDataRow( "<tr class='tuffDLRow'><td>No more rows</td><tr>" );
	    }//errorFlag true
	  }//createList

	  // INIT LIST. External.
	  function initList() {
	    var headTable = "";
	    var listTable = "";

			// HEADER.

			// Disable column resizing.
			disableColResizing( $( "#tuffDL_headTable" ) );

	    // Destroy the header.
	    $( "#tuffDL_head" ).empty();

	    // Create an empty header.
	    headTable = "<table id='tuffDL_headTable'></table>";
	    $( "#tuffDL_head" ).append( headTable );

			// LIST.

			// Disable column resizing.
			disableColResizing( $( "#tuffDL_listTable" ) );

	    // Destroy the list.
	    $( "#tuffDL_list" ).empty();

	    // Create an empty list.
	    listTable = "<table id='tuffDL_listTable'></table>";
	    $( "#tuffDL_list" ).append( listTable );

	  }//initList

	  // CREATE HEADER ROW. External.
	  function createHeaderRow( entry ) {
	    var cells = "";
	    var cell  = "";	    
			for ( var key in entry[0]) {
			  // Don't use the pkey or the fkey.
			  if ( ( key != "pkey" ) && ( key != "fkey" ) && ( key != "fname" ) ) {
					key   = capitalizeString( key );
					cell  = "<th title='" + key + "' nowrap>" + "<div class='tuffDLCell'>" + key + "</div>" + "</th>";
					cells += cell;			  
			  }//key not pkey and not fkey
			}//for each key
			return "<tr>" + cells + "</tr>";
	  }//createHeaderRow

	  // APPEND HEADER ROW. External.
	  function appendHeaderRow( headerRow ) {
		  $( "#tuffDL_headTable" ).append( headerRow );
	  }//appendHeaderRow
	  
	  // CREATE DATA ROW. External.
	  function createDataRow( entry, pkey ) {
	    var cells = createDataCells( entry );
			return "<tr class='tuffDLRow' data-rowValues='" + JSON.stringify( entry ) + "' data-pkey='" + pkey + "' data-selected='false'>" + cells + "</tr>";
	  }//createDataRow

	  // APPEND DATA ROW. External.
	  function appendDataRow( dataRow ) {
		  $( "#tuffDL_listTable" ).append( dataRow );
	  }//appendDataRow
	  	  
	  // CREATE DATA CELLS.
	  // By default, the text in cells doesn't wrap.
	  // To wrap the text in cells, remove the nowrap attribute.	  
	  function createDataCells( entry ) {
	    var cells = "";
	    var cell  = "";
			$.each( entry, function( key, value ) {
			  // Don't use the pkey or the fkey.
			  if ( ( key != "pkey" ) && ( key != "fkey" ) && ( key != "fname" ) ) {
			    cell = "<td title='" + value + "' nowrap>" + "<div class='tuffDLCell'>" + value + "</div>" + "</td>";
			    cells += cell;			  
			  }//key not pkey and not fkey
			});
			return cells;
	  }//createDataCells
	  	  
	  // ============================================================================
	  // EVENTS.
	  // ============================================================================
	  		    
	  // TOGGLE ALL MASKS.
	  // Show/hide iframe masks.
	  // Lists appear in iframes.
	  // We use iframe masks for each list during the drag and resize events.
	  // The masks stop events from continuing to fire on iframe contents during mouse up.
	  function toggleAllMasks( numberLists, displayStyle ) {
	    var divID  = "";
	    var maskID = "";
	    for ( var i = 0; i < numberLists; i++ ) {
		    divID  = "#tuffDL_div_" + i.toString();
		    maskID = "#tuffDL_mask_" + i.toString();
		    $( maskID ).css( "display", displayStyle );
	    }//for all lists
	  }//toggleAllMasks

	  // SET ALL Z INDEX.
	  function setAllZIndex( numberLists, currentList ) {
	    // Push all lists down to the bottom layer.
	    var divID = "";
	    for ( var i = 0; i < numberLists; i++ ) {
		    divID = "#tuffDL_div_" + i.toString();
		    $( divID ).css( "z-index", 1 );
	    }//for all lists

	    // Put the current list component on the top layer.
	    currentList.css( "z-index", 100 );
	  }//setAllZIndex

	  // SET COL RESIZING. External.
	  // Set the header and list col widths to each other.
	  // Setting both ensures that all col widths snap to matching widths.
	  function setColResizing() {
			// Enable column resizing.
			enableColResizing( $( "#tuffDL_listTable" ), setHeaderColWidth );

			// Set the header col widths to match the list col widths.
			setHeaderColWidth( null );

			// Set the list col widths to match the header col widths.
			setListColWidth( null );
	  }//setColResizing
	  
	  // ENABLE COL RESIZING.
	  function enableColResizing( list, eventHandler ) {
			list.colResizable({
				liveDrag     :true,
				gripInnerHtml:"<div class='grip'></div>",
				draggingClass:"dragging",
				onResize     : eventHandler
			});
	  }//enableColResizing

	  // DISABLE COL RESIZING.
	  function disableColResizing( list ) {
			list.colResizable({
				disable:true
			});
	  }//disableColResizing

	  // SET HEADER COL WIDTH.
	  // Set header col widths to match the list col widths.
	  function setHeaderColWidth( event ) {
			setColWidth( $( "#tuffDL_listTable" ), $( "#tuffDL_headTable" ), "td", "th", setListColWidth );
	  }//setHeaderColWidth

	  // SET LIST COL WIDTH.
	  // Set list col widths to match the header col widths.
	  function setListColWidth( event ) {
			setColWidth( $( "#tuffDL_headTable" ), $( "#tuffDL_listTable" ), "th", "td", setHeaderColWidth );
	  }//etListColWidth
	  
	  // SET COL WIDTH.
	  // Set the col widths in the target list to match the widths in the source list.
	  // The source/target parameters are the header and body of one list, 
	  // not two separate lists (although they are two separate HTML tags).
	  // This function is used to synch widths for both the header and the body,
	  // so both the header and the body can be either the source or the target.
	  function setColWidth( listSource, listTarget, cellSource, cellTarget, eventHandlerTarget ) {
			// Disable column resizing in the target.
			disableColResizing( listTarget );

			// Set widths.
			var columnsSource = listSource.find( cellSource );
			var columnsTarget = listTarget.find( cellTarget );
			var length        = columnsSource.length;
	    for ( var i = 0; i < length; i++ ) {
	      if ( isDefined( columnsSource[i] ) && isDefined( columnsTarget[i] ) ) {
	        $( columnsTarget[i] ).width( $( columnsSource[i] ).width() );
	      }//entries valid
	    }//for each entry

			// Enable column resizing in the target.
			enableColResizing( listTarget, eventHandlerTarget );
	  }//setColWidth

	  // ============================================================================
	  // SELECTION.
	  // ============================================================================
  
	  // SELECT ROW. External.
	  function selectRow( selectedRow, listID ) {
	    // Unhighlight all rows.
	    unselectRows( listID );

	    // Highlight the selected row.
	    selectOneRow( selectedRow );
	  }//selectRow
	  	  
	  // SELECT ONE ROW.
	  function selectOneRow( selectedRow ) {
	    selectedRow.removeClass( "tuffDLRow" ).addClass( "tuffDLRowSelected" );
	    selectedRow.attr( "data-selected", "true" );
	  }//selectOneRow

	  // UNSELECT ROWS.
	  function unselectRows( listID ) {
	    $( "#" + listID + " tr" ).each( function() {
	      $( this ).removeClass( "tuffDLRowSelected" ).addClass( "tuffDLRow" );
	      $( this ).attr( "data-selected", "false" );
	    });
	  }//unselectRows
	  
		// ============================================================================
		// UTILITY.
		// ============================================================================

		// IS DEFINED
		function isDefined( value ) {
			var valueIsDefined = false;
			if ( value !== null && value !== undefined ) { valueIsDefined = true; }
			return valueIsDefined;
		}//isDefined

		// TRIM TEXT.
		// Truncate a text string so it has a limited number of characters.
		function trimText( textStr, charLimit ) {		
			var trimmedText = textStr.substring( 0, charLimit );
			if ( textStr.length > charLimit ) {
				trimmedText = trimmedText + " ...";
			}//textStr longer than limit
			return trimmedText;   
		}//trimText
  
		// CAPITALIZE STRING
		function capitalizeString( str ) {
		  return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
		}//capitalizeString

		// GET IFRAME.
		function getIframe( iframeID ) {
			return $( "#" + iframeID )[0].contentWindow;
		}//getIframe

		// GET IFRAME ELEMENT.
		// Send only the ID string for iframeID.
		// For the element, send the full jquery selector, such as "#id".
		function getIframeElement( iframeID, element ) {
			return $( "#" + iframeID ).contents().find( element );
		}//getIframeElement

	  // POPULATE FIELD.
	  function populateField( inputField, value, useValueForTitle ) {
	    inputField.val( value );
	    if ( useValueForTitle ) {
	      inputField.attr( "title", value );
	    }//useValueForTitle is true
	  }//populateField
	  		
	  // ============================================================================
	  // RETURN.
	  // ============================================================================

	  return {

			// Links to external functions.
			setupLists       :setupLists,
			initHeader       :initHeader,
			setColResizing   :setColResizing,
			setContainerIndex:setContainerIndex,
			getContainerIndex:getContainerIndex,
			buildList        :buildList,
			createList       :createList,
			initList         :initList,			
			createHeaderRow  :createHeaderRow,
			createDataRow    :createDataRow,
			appendHeaderRow  :appendHeaderRow,
			appendDataRow    :appendDataRow,
			selectRow        :selectRow

	  }

	}();