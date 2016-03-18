
  // ============================================================================
  // JSON STATS.
  // ============================================================================

	var testStatsResult_ =
  {
   "queryName" : "statsQuery",
   "statType"  : "",
   "statValues":
    [
      {"statInterval": "15-SECOND", "countSuccess": [100, 200, 300, 1500, 300, 1700, 200, 400, 200, 400]}
    ]
  }

  // ============================================================================
  // JSON TABLES.
  // ============================================================================

	var testTableResult_ =
  {
   "queryName": "tableSummaryList",
   "sortBy"   : "totalTime",
   "tableList":
	  [
	    {"tableName":"User",               "tableType":"CHILD",  "avgTime":"500", "totalTimePercent":"50", "totalTime":"500", "frequency":"1500", "heat":"24", "parents": [],                               "children": ["User Blog", "User Blog Post", "User Transaction", "User Blog Instance", "User Auth"] },
	    {"tableName":"User Blog",          "tableType":"CHILD",  "avgTime":"490", "totalTimePercent":"49", "totalTime":"490", "frequency":"1450", "heat":"23", "parents": ["User", "Blog"],                 "children": ["User Blog Visitor", "User Blog Instance"] },
	    {"tableName":"User Blog Post",     "tableType":"CHILD",  "avgTime":"250", "totalTimePercent":"25", "totalTime":"250", "frequency":"1390", "heat":"22", "parents": ["User", "Blog Post"],            "children": [] },
	    {"tableName":"User Lookup",        "tableType":"CHILD",  "avgTime":"200", "totalTimePercent":"20", "totalTime":"200", "frequency":"1280", "heat":"21", "parents": [],                               "children": [] },
	    {"tableName":"User Auth",          "tableType":"CHILD",  "avgTime":"100", "totalTimePercent":"10", "totalTime":"100", "frequency":"1170", "heat":"20", "parents": ["User"],                         "children": [] },
	    {"tableName":"User Transaction",   "tableType":"CHILD",  "avgTime":"80",  "totalTimePercent":"80", "totalTime":"80",  "frequency":"1060", "heat":"19", "parents": ["User"],                         "children": [] },
	    {"tableName":"User Connection",    "tableType":"CHILD",  "avgTime":"70",  "totalTimePercent":"70", "totalTime":"70",  "frequency":"950",  "heat":"17", "parents": [],                               "children": ["User Blog Visitor"] },
	    {"tableName":"User Blog Visitor",  "tableType":"CHILD",  "avgTime":"60",  "totalTimePercent":"60", "totalTime":"60",  "frequency":"840",  "heat":"15", "parents": ["User Blog", "User Connection"], "children": [] },
	    {"tableName":"User Blog Stat",     "tableType":"CHILD",  "avgTime":"50",  "totalTimePercent":"50", "totalTime":"50",  "frequency":"735",  "heat":"10", "parents": [],                               "children": [] },
	    {"tableName":"User Blog Instance", "tableType":"CHILD",  "avgTime":"20",  "totalTimePercent":"20", "totalTime":"20",  "frequency":"630",  "heat":"8",  "parents": ["User", "User Blog"],            "children": [] },
	    {"tableName":"Blog",               "tableType":"GLOBAL", "avgTime":"5",   "totalTimePercent":"5",  "totalTime":"5",   "frequency":"520",  "heat":"5",  "parents": [],                               "children": ["Blog Post", "Blog Rating", "User Blog"] },
	    {"tableName":"Blog Post",          "tableType":"GLOBAL", "avgTime":"2",   "totalTimePercent":"2",  "totalTime":"2",   "frequency":"410",  "heat":"3",  "parents": ["Blog"],                         "children": ["User Blog Post"] },
	    {"tableName":"Blog Rating",        "tableType":"GLOBAL", "avgTime":"1",   "totalTimePercent":"1",  "totalTime":"1",   "frequency":"1",    "heat":"0",  "parents": ["Blog"],                         "children": [] }
		],
		"summaryInfo": {"heat":"14"}
	}

  // ============================================================================
  // JSON QUERIES.
  // ============================================================================

	var testQueryResult_ =
  {
   "queryName": "querySummaryList",
   "sortBy"   : "totalTime",
   "queryList":
	  [
	    {"queryId":"000", "queryType":"SELECT", "avgTime":"500000", "totalTimePercent":"50", "totalTime":"2000", "frequency":"1000000", "heat":"0",  "queryText":"SELECT [query text]"},
	    {"queryId":"001", "queryType":"INSERT", "avgTime":"490", "totalTimePercent":"49", "totalTime":"1000", "frequency":"500",  "heat":"11", "queryText":"INSERT [query text]"},
	    {"queryId":"002", "queryType":"UPDATE", "avgTime":"250", "totalTimePercent":"25", "totalTime":"500",  "frequency":"250",  "heat":"21", "queryText":"UPDATE [query text]"},
	    {"queryId":"003", "queryType":"DELETE", "avgTime":"200", "totalTimePercent":"20", "totalTime":"250",  "frequency":"100",  "heat":"22", "queryText":"DELETE [query text]"},
	    {"queryId":"004", "queryType":"OTHER",  "avgTime":"100", "totalTimePercent":"10", "totalTime":"3",    "frequency":"50",   "heat":"24", "queryText":"OTHER [query text]"}
		]
	}

	var testQueryResultSelect_ =
  {
   "queryName": "querySummaryList",
   "sortBy"   : "totalTime",
   "queryList":
	  [
	    {"queryId":"000", "queryType":"SELECT", "avgTime":"500", "totalTimePercent":"50", "totalTime":"2000", "frequency":"1000", "heat":"0",  "queryText":"SELECT [query text]"},
	    {"queryId":"001", "queryType":"SELECT", "avgTime":"490", "totalTimePercent":"49", "totalTime":"1000", "frequency":"500",  "heat":"11", "queryText":"SELECT [query text]"},
	    {"queryId":"002", "queryType":"SELECT", "avgTime":"250", "totalTimePercent":"25", "totalTime":"500",  "frequency":"250",  "heat":"21", "queryText":"SELECT [query text]"},
	    {"queryId":"003", "queryType":"SELECT", "avgTime":"200", "totalTimePercent":"20", "totalTime":"250",  "frequency":"100",  "heat":"22", "queryText":"SELECT [query text]"},
	    {"queryId":"004", "queryType":"SELECT", "avgTime":"100", "totalTimePercent":"10", "totalTime":"3",    "frequency":"50",   "heat":"24", "queryText":"SELECT [query text]"}
		]
	}

	var testQueryResultInsert_ =
  {
   "queryName": "querySummaryList",
   "sortBy"   : "totalTime",
   "queryList":
	  [
	    {"queryId":"000", "queryType":"INSERT", "avgTime":"500", "totalTimePercent":"50", "totalTime":"2000", "frequency":"1000", "heat":"0",  "queryText":"INSERT [query text]"},
	    {"queryId":"001", "queryType":"INSERT", "avgTime":"490", "totalTimePercent":"49", "totalTime":"1000", "frequency":"500",  "heat":"11", "queryText":"INSERT [query text]"},
	    {"queryId":"002", "queryType":"INSERT", "avgTime":"250", "totalTimePercent":"25", "totalTime":"500",  "frequency":"250",  "heat":"21", "queryText":"INSERT [query text]"},
	    {"queryId":"003", "queryType":"INSERT", "avgTime":"200", "totalTimePercent":"20", "totalTime":"250",  "frequency":"100",  "heat":"22", "queryText":"INSERT [query text]"},
	    {"queryId":"004", "queryType":"INSERT", "avgTime":"100", "totalTimePercent":"10", "totalTime":"3",    "frequency":"50",   "heat":"24", "queryText":"INSERT [query text]"}
		]
	}

	var testQueryResultUpdate_ =
  {
   "queryName": "querySummaryList",
   "sortBy"   : "totalTime",
   "queryList":
	  [
	    {"queryId":"000", "queryType":"UPDATE", "avgTime":"500", "totalTimePercent":"50", "totalTime":"2000", "frequency":"1000", "heat":"0",  "queryText":"UPDATE [query text]"},
	    {"queryId":"001", "queryType":"UPDATE", "avgTime":"490", "totalTimePercent":"49", "totalTime":"1000", "frequency":"500",  "heat":"11", "queryText":"UPDATE [query text]"},
	    {"queryId":"002", "queryType":"UPDATE", "avgTime":"250", "totalTimePercent":"25", "totalTime":"500",  "frequency":"250",  "heat":"21", "queryText":"UPDATE [query text]"},
	    {"queryId":"003", "queryType":"UPDATE", "avgTime":"200", "totalTimePercent":"20", "totalTime":"250",  "frequency":"100",  "heat":"22", "queryText":"UPDATE [query text]"},
	    {"queryId":"004", "queryType":"UPDATE", "avgTime":"100", "totalTimePercent":"10", "totalTime":"3",    "frequency":"50",   "heat":"24", "queryText":"UPDATE [query text]"}
		]
	}

	var testQueryResultDelete_ =
  {
   "queryName": "querySummaryList",
   "sortBy"   : "totalTime",
   "queryList":
	  [
	    {"queryId":"000", "queryType":"DELETE", "avgTime":"500", "totalTimePercent":"50", "totalTime":"2000", "frequency":"1000", "heat":"0",  "queryText":"DELETE [query text]"},
	    {"queryId":"001", "queryType":"DELETE", "avgTime":"490", "totalTimePercent":"49", "totalTime":"1000", "frequency":"500",  "heat":"11", "queryText":"DELETE [query text]"},
	    {"queryId":"002", "queryType":"DELETE", "avgTime":"250", "totalTimePercent":"25", "totalTime":"500",  "frequency":"250",  "heat":"21", "queryText":"DELETE [query text]"},
	    {"queryId":"003", "queryType":"DELETE", "avgTime":"200", "totalTimePercent":"20", "totalTime":"250",  "frequency":"100",  "heat":"22", "queryText":"DELETE [query text]"},
	    {"queryId":"004", "queryType":"DELETE", "avgTime":"100", "totalTimePercent":"10", "totalTime":"3",    "frequency":"50",   "heat":"24", "queryText":"DELETE [query text]"}
		]
	}

	var testQueryResultOther_ =
  {
   "queryName": "querySummaryList",
   "sortBy"   : "totalTime",
   "queryList":
	  [
	    {"queryId":"000", "queryType":"OTHER", "avgTime":"500", "totalTimePercent":"50", "totalTime":"2000", "frequency":"1000", "heat":"0",  "queryText":"OTHER [query text]"},
	    {"queryId":"001", "queryType":"OTHER", "avgTime":"490", "totalTimePercent":"49", "totalTime":"1000", "frequency":"500",  "heat":"11", "queryText":"OTHER [query text]"},
	    {"queryId":"002", "queryType":"OTHER", "avgTime":"250", "totalTimePercent":"25", "totalTime":"500",  "frequency":"250",  "heat":"21", "queryText":"OTHER [query text]"},
	    {"queryId":"003", "queryType":"OTHER", "avgTime":"200", "totalTimePercent":"20", "totalTime":"250",  "frequency":"100",  "heat":"22", "queryText":"OTHER [query text]"},
	    {"queryId":"004", "queryType":"OTHER", "avgTime":"100", "totalTimePercent":"10", "totalTime":"3",    "frequency":"50",   "heat":"24", "queryText":"OTHER [query text]"}
		]
	}