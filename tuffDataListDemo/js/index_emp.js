
  // =============================================================================
	// DEMO.
  // ============================================================================

	// ON DOC READY
	$( document ).ready( function() {

	  n_main.startPage();

	})// ON DOC READY

  // ============================================================================
  // NAMESPACE FUNCTIONS.
  // ============================================================================

	var n_main = function(){

	  // ============================================================================
	  // GLOBAL VARS.
	  // ============================================================================

	  // Page container that contains the lists.
	  // To put the lists directly in the body, set this var to "body".
	  // To put the lists inside a specific tag, give the tag an ID and use the format "#tagID".
	  // For example, "#divLists".
	  var pageContainer = "#divLists";
	  
	  // Values for list containers.
	  var listContainers = [
		  { 
		    name: "Departments",
		    top: 120, left: 20, width: 20,
		    color: "#dddddd",
		    source: "", target: "1"
		  },
		  { 
		    name: "Employees for department",
		    top: 120, left: 410, width: 380,
		    color: "#bbbbbb",
		    source: "0", target: ""
		  }
	  ];
	  
		// ============================================================================
		// DEMO DATA.
		// Data sources are assumed to have pkey and fkey properties.		
		// ============================================================================

		var demolist0 =
			[
				{ "pkey":1, "fkey":"", "name":"Customer Service" },
				{ "pkey":2, "fkey":"", "name":"Human Relations" },
				{ "pkey":3, "fkey":"", "name":"Engineering" },
				{ "pkey":4, "fkey":"", "name":"Sales" }
			]

		var demolist1 =
			[
				{ "pkey":1, "fkey":"1", "fname":"Customer Service", "name":"Last, First", "role":"Customer Service Rep", "dateStarted":"1/1/2015", "salary":"60,000" },
				{ "pkey":2, "fkey":"1", "fname":"Customer Service", "name":"Last, First", "role":"Customer Service Rep", "dateStarted":"1/1/2015", "salary":"60,000" }
			]

		var demolist2 =
			[
				{ "pkey":1, "fkey":"2", "fname":"Human Relations", "name":"Last, First", "role":"HR Manager", "dateStarted":"1/1/2015", "salary":"80,000" }
			]

		var demolist3 =
			[
				{ "pkey":1, "fkey":"3", "fname":"Engineering", "name":"Last, First", "role":"VP Engineering", "dateStarted":"1/1/2015", "salary":"100,000" },
				{ "pkey":2, "fkey":"3", "fname":"Engineering", "name":"Last, First", "role":"Developer",      "dateStarted":"1/1/2015", "salary":"80,000" },
				{ "pkey":3, "fkey":"3", "fname":"Engineering", "name":"Last, First", "role":"Developer",      "dateStarted":"1/1/2015", "salary":"80,000" },
				{ "pkey":4, "fkey":"3", "fname":"Engineering", "name":"Last, First", "role":"UI Developer",   "dateStarted":"1/1/2015", "salary":"60,000" },
				{ "pkey":5, "fkey":"3", "fname":"Engineering", "name":"Last, First", "role":"Guides Editor",  "dateStarted":"1/1/2015", "salary":"60,000" }
			]

		var demolist4 =
			[
				{ "pkey":1, "fkey":"4", "fname":"Sales", "name":"Last, First", "role":"Sales Manager", "dateStarted":"1/1/2015", "salary":"100,000" },
				{ "pkey":2, "fkey":"4", "fname":"Sales", "name":"Last, First", "role":"Sales Rep",     "dateStarted":"1/1/2015", "salary":"100,000" }
			]
												
	  // ============================================================================
    // EXTERNAL FUNCTIONS.
	  // ============================================================================

	  // START PAGE.
	  function startPage() {
	    // Set up the lists.
	    n_tuffDataList.setupLists( pageContainer, listContainers, getFirstList );
	  }//startPage

	  // GET FIRST LIST.
	  // Retrieve the data for the first list in a page.	  
	  function getFirstList() {
		  getData( null, 0 );
	  }//getFirstList

	  // GET DATA.
	  // Retrieve the data for a specified list.
	  // When using live data, this function should call
	  // a web service with the return function as a callback.
	  // Currently, this function uses demo data.	  
	  function getData( selectedPkey, containerIndex ) {
	    // Mocked demo data.
	    // Don't use this code for live data.
	    var index    = containerIndex.toString();
	    var response = null;
	    switch( index ) {
	      case "0": response = demolist0; break;
	      
	      case "1": 	      
					switch( selectedPkey ) {
						case "1": response = demolist1; break;
						case "2": response = demolist2; break;
						case "3": response = demolist3; break;
						case "4": response = demolist4; break;						
						default : break;
					}//switch( selectedPkey )	       
	      break;
	      
	      default : break;
	    }//switch( index )
	    
	    // Set the index for the current container.
	    n_tuffDataList.setContainerIndex( containerIndex );

	    // Request the web service.
	    // Use this for live data.
	    // Send returnData as the callback.
	    //callWebService( containerIndex, selectedPkey, returnData  );
      	  
			// Return the data.
			// Use this for demo data.
			returnData( response );
	  }//getData
	  
	  // RETURN DATA.
	  // Return from the web service with the response.
	  // When getData requests the web service, it sends returnData as the callback. 
	  // You can get the index from the current container by calling n_tuffDataList.getContainerIndex.
	  function returnData( response ) {
			// The handleRowSelection callback is an optional function that 
			// triggers custom actions for selected rows.
			// Use the container index to determine whether to use handleRowSelection. 		
			var containerIndex             = n_tuffDataList.getContainerIndex().toString();
			var handleRowSelectionFunction = handleRowSelection;
	    switch( containerIndex ) {
	      case "0": handleRowSelectionFunction = null; break;
	      default : break;
	    }//switch( containerIndex )			
			
			// Build a list from the returned data.
			n_tuffDataList.buildList( response, getData, handleRowSelectionFunction );
	  }//returnData

	  // HANDLE ROW SELECTION.
	  // Optional function that triggers custom actions for selected rows.	   
	  function handleRowSelection( containerIndex, rowValues ) { 
			alert( "You selected " + JSON.stringify( rowValues ) + " from " + listContainers[containerIndex].name + "." );
	  }//handleRowSelection
	     
	  // ============================================================================
	  // RETURN.
	  // ============================================================================

	  return {

			// Links to external functions.
			startPage         :startPage,
			getFirstList      :getFirstList,
			getData           :getData,
			returnData        :returnData,
			handleRowSelection:handleRowSelection

	  }

	}();

