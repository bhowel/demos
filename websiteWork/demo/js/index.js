
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
		    name: "Products",
		    top: 120, left: 20, width: 20,
		    color: "#bbbbbb",
		    source: "", target: ""
		  },
		  { 
		    name: "Services",
		    top: 120, left: 410, width: 380,
		    color: "#9DB3C7",
		    source: "", target: "2"
		  },
		  { 
		    name: "Service details",
		    top: 360, left: 410, width: 380,
		    color: "#B5CFE6",
		    source: "1", target: ""
		  }	
	  ];

	  // Array for initial services.
	  var initialServices     = [ 0, 1 ];
	  var initialServiceIndex = 0;
	  
	  // Flag to indicate when we're done with initial services.
	  var initialServicesDone = false;
	  	  
		// ============================================================================
		// DEMO DATA.
		// Data sources are assumed to have pkey and fkey properties.		
		// ============================================================================

		var products =
			[
				{ "pkey":1, "fkey":"", "name":"Outdoor pot", "size":"11 in" },
				{ "pkey":2, "fkey":"", "name":"Outdoor pot", "size":"6 in" },
				{ "pkey":3, "fkey":"", "name":"Indoor pot", "size":"9 in" },
				{ "pkey":4, "fkey":"", "name":"Indoor pot", "size":"5 in" }
			]

		var services =
			[
				{ "pkey":1, "fkey":"", "name":"Garden prep" },
				{ "pkey":2, "fkey":"", "name":"Complete garden installation" },
				{ "pkey":3, "fkey":"", "name":"Consultation" }
			]

		var serviceDetailsPrep =
			[
				{ "pkey":1, "fkey":"1", "fname": "Garden prep", "name":"Design", "price":"50/hour" },
				{ "pkey":2, "fkey":"1", "fname": "Garden prep", "name":"Prep",   "price":"60/hour" }
			]

		var serviceDetailsComplete =
			[
				{ "pkey":1, "fkey":"2", "fname": "Complete garden installation", "name":"Design",   "price":"50/hour" },
				{ "pkey":2, "fkey":"2", "fname": "Complete garden installation", "name":"Prep",     "price":"60/hour" },
				{ "pkey":3, "fkey":"2", "fname": "Complete garden installation", "name":"Planting", "price":"70/hour" }
			]

		var serviceDetailsConsult =
			[
				{ "pkey":1, "fkey":"3", "fname": "Consultation", "name":"Survey",          "price":"40/hour" },
				{ "pkey":2, "fkey":"3", "fname": "Consultation", "name":"Recommendations", "price":"30/hour" }
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
		  // Reset initial services.
		  initialServiceIndex = 0;
		  initialServicesDone = false;
		  
		  // Get first list.
		  getData( null, 0 );
	  }//getFirstList

	  // GET DATA.
	  // Retrieve the data for a specified list. 
	  function getData( selectedPkey, containerIndex ) {	    
	    // Set the index for the current container.
	    n_tuffDataList.setContainerIndex( containerIndex );

	    // Request the web service.
	    // Send returnData as the callback.
	    callWebService( containerIndex, selectedPkey, returnData  );
	  }//getData

	  // CALL WEB SERVICE.
	  // Mock web service.
	  function callWebService( containerIndex, selectedPkey, returnData ) {
	    // Mock demo data.
	    var index    = containerIndex.toString();
	    var response = null;
	    switch( index ) {
	    
	      case "0": response = products; break;

	      case "1": response = services; break;
	      	      	      
	      case "2": 	      
					switch( selectedPkey ) {
						case "1": response = serviceDetailsPrep;     break;
						case "2": response = serviceDetailsComplete; break;
						case "3": response = serviceDetailsConsult;  break;						
						default : break;
					}//switch( selectedPkey )
	      break;	
	            
	      default : break;
	    }//switch( index )
	    	  
			// Return the data.
			returnData( response );
	  }//callWebService
	  	  
	  // RETURN DATA.
	  // Return from the web service with the response.
	  // When getData requests the web service, it sends returnData as the callback. 
	  // You can get the index from the current container by calling n_tuffDataList.getContainerIndex.
	  function returnData( response ) {
			// Set the callbacks. 		
			var containerIndex     = n_tuffDataList.getContainerIndex().toString();
			var getDataFunction    = null;
			var handleRowSelection = null;
	    switch( containerIndex ) {
	    
	      case "0": 
	        getDataFunction    = null;
	        handleRowSelection = null; 
	      break;

	      case "1": 
	        getDataFunction    = getData;
	        handleRowSelection = null; 
	      break;
	      
	      case "2": 
	        getDataFunction    = null;
	        handleRowSelection = handleSelectedDetail; 
	      break;
	      
	      default : break;
	    }//switch( containerIndex )					
			
			// Build a list from the returned data.
			n_tuffDataList.buildList( response, getData, handleRowSelection );

			// Increment the index for initial services.
			// If we're still running initial services, send the next one.
			if ( !initialServicesDone ) {
				initialServiceIndex++;
				if ( initialServiceIndex < initialServices.length ) {
					getData( null, initialServiceIndex );
				} else {
					// Set the flag to indicate we're now done with the initial services.
					// To refresh the associated lists, reset initialServicesDone to false,
					// set initialServiceIndex to 0, then call getFirstList() again.
					initialServicesDone = true;
				}//initialServiceIndex not lt initialServices.length			
			}//initialServicesDone not true				
	  }//returnData

	  // HANDLE SELECTED DETAIL.
	  // Optional function that triggers custom actions for selected rows.	   
	  function handleSelectedDetail( containerIndex, rowValues ) { 
			alert( "You selected " + JSON.stringify( rowValues ) + " from " + listContainers[containerIndex].name + "." );
	  }//handleSelectedDetail
	     
	  // ============================================================================
	  // RETURN.
	  // ============================================================================

	  return {

			// Links to external functions.
			startPage           :startPage,
			getFirstList        :getFirstList,
			getData             :getData,
			returnData          :returnData,
			handleSelectedDetail:handleSelectedDetail

	  }

	}();

