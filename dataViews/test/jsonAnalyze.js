
  // ============================================================================
  // JSON RECOMMENDATIONS.
  // ============================================================================

	var testRecommendationsResult_ =
  {
   "recommendationsList":
	  [
	    {"title": "Recommendation", "text0":"Recommendation text", "list":"", "text1":"Recommendation text" },
	    {"title": "Recommendation", "text0":"Recommendation text", "list":"", "text1":"Recommendation text" },
	    {"title": "Recommendation", "text0":"Recommendation text", "list":"", "text1":"Recommendation text" }
		]
	}

  // ============================================================================
  // JSON SHARD ANALYSIS  - DEFINE YOUR DOMAIN.
  // ============================================================================

	var testGetDomainsResult_ =
  {
   "domainList":
	  [
	    {"domainName":"Domain 1", "nbrPhysicalShards":"1",  "shardingStrategy":"modulus" },
	    {"domainName":"Domain 2", "nbrPhysicalShards":"2",  "shardingStrategy":"shardingStripes" },
	    {"domainName":"Domain 3", "nbrPhysicalShards":"3",  "shardingStrategy":"modulus"  },
	    {"domainName":"Domain 4", "nbrPhysicalShards":"4",  "shardingStrategy":"shardingStripes" },
	    {"domainName":"Domain 5", "nbrPhysicalShards":"5",  "shardingStrategy":"modulus" },
	    {"domainName":"Domain 6", "nbrPhysicalShards":"6",  "shardingStrategy":"shardingStripes" }
		]
	}

  var testSubmitDomainResult_ =
  {
   "message"   : "Domain information/selection was successfully saved",
   "domainList": []
  }

  // ============================================================================
  // JSON SHARD ANALYSIS  - SHARD REPORT.
  // ============================================================================

  	var testShardReportResultSelect_ =
  {
   "shardReportList":
	  [
	    {"rank":"1", "count":"2000",  "shardAction":"SHARD_READ", "message": "", "query":"Select 1" },
	    {"rank":"2", "count":"1900",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Select 2" },
	    {"rank":"3", "count":"1800",  "shardAction":"PARALLEL", "message": "", "query":"Select 3" },
	    {"rank":"4", "count":"1700",  "shardAction":"SHARD_READ", "message": "", "query":"Select 4" },
	    {"rank":"5", "count":"1600",  "shardAction":"NONE", "message": "No shard action identified. A shard-hint or other correction may be required.", "query":"Select 5" },
	    {"rank":"6", "count":"1500",  "shardAction":"MULTI_SHARD_UPDATE", "message": "", "query":"Select 6" },
	    {"rank":"7", "count":"1400",  "shardAction":"SHARD_WRITE", "message": "", "query":"Select 7" },
	    {"rank":"8", "count":"1300",  "shardAction":"SHARD_READ", "message": "", "query":"Select 8" },
	    {"rank":"9", "count":"1200",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Select 9" },
	    {"rank":"10", "count":"1100", "shardAction":"GLOBAL_READ", "message": "", "query":"Select 10" },
	    {"rank":"11", "count":"1000", "shardAction":"PARALLEL", "message": "", "query":"Select 11" },
	    {"rank":"12", "count":"900",  "shardAction":"SHARD_READ", "message": "", "query":"Select 12" },
	    {"rank":"13", "count":"800",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Select 13" },
	    {"rank":"14", "count":"700",  "shardAction":"ERROR", "message": "Shard-safe violation. A shard-hint or other correction may be required. ERROR: Update to global table, join with static/shard table(s).", "query":"Select 14" },
	    {"rank":"15", "count":"600",  "shardAction":"NONE", "message": "No shard action identified. A shard-hint or other correction may be required.", "query":"Select 15" },
	    {"rank":"16", "count":"500",  "shardAction":"MULTI_SHARD_UPDATE", "message": "", "query":"Select 16" },
	    {"rank":"17", "count":"400",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Select 17" },
	    {"rank":"18", "count":"300",  "shardAction":"SHARD_READ", "message": "", "query":"Select 18" },
	    {"rank":"19", "count":"200",  "shardAction":"GLOBAL_READ", "message": "", "query":"Select 19" },
	    {"rank":"20", "count":"100",  "shardAction":"ERROR", "message": "Shard-safe violation. A shard-hint or other correction may be required. ERROR: Update to global table, join with static/shard table(s).", "query":"Select 20" },
	    {"rank":"21", "count":"50",   "shardAction":"SHARD_READ", "message": "", "query":"Select 21" },
	    {"rank":"22", "count":"25",   "shardAction":"GLOBAL_WRITE", "message": "", "query":"Select 22" },
	    {"rank":"23", "count":"20",   "shardAction":"ERROR", "message": "Shard-safe violation. A shard-hint or other correction may be required. ERROR: Update to global table, join with static/shard table(s).", "query":"Select 23" },
	    {"rank":"24", "count":"19",   "shardAction":"NONE", "message": "No shard action identified. A shard-hint or other correction may be required.", "query":"Select 24" },
	    {"rank":"25", "count":"18",   "shardAction":"PARALLEL", "message": "", "query":"Select 25" },
	    {"rank":"26", "count":"17",   "shardAction":"MULTI_SHARD_UPDATE", "message": "", "query":"Select 26" },
	    {"rank":"27", "count":"16",   "shardAction":"SHARD_READ", "message": "", "query":"Select 27" },
	    {"rank":"28", "count":"15",   "shardAction":"SHARD_READ", "message": "", "query":"Select 28" },
	    {"rank":"29", "count":"14",   "shardAction":"GLOBAL_WRITE", "message": "", "query":"Select 29" },
	    {"rank":"30", "count":"13",   "shardAction":"SHARD_WRITE", "message": "", "query":"Select 30" },
	    {"rank":"31", "count":"12",   "shardAction":"SHARD_READ", "message": "", "query":"Select 31" },
	    {"rank":"32", "count":"11",   "shardAction":"GLOBAL_READ", "message": "", "query":"Select 32" },
	    {"rank":"33", "count":"10",   "shardAction":"PARALLEL", "message": "", "query":"Select 33" }
		]
	}

	var testShardReportResultInsert_ =
  {
   "shardReportList":
	  [
	    {"rank":"1", "count":"2000",  "shardAction":"SHARD_READ", "message": "", "query":"Insert 1" },
	    {"rank":"2", "count":"1900",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Insert 2" },
	    {"rank":"3", "count":"1800",  "shardAction":"PARALLEL", "message": "", "query":"Insert 3" },
	    {"rank":"4", "count":"1700",  "shardAction":"SHARD_READ", "message": "", "query":"Insert 4" }
		]
	}

	var testShardReportResultUpdate_ =
  {
   "shardReportList":
	  [
	    {"rank":"1", "count":"2000",  "shardAction":"SHARD_READ", "message": "", "query":"Update 1" },
	    {"rank":"2", "count":"1900",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Update 2" },
	    {"rank":"3", "count":"1800",  "shardAction":"PARALLEL", "message": "", "query":"Update 3" },
	    {"rank":"4", "count":"1700",  "shardAction":"SHARD_READ", "message": "", "query":"Update 4" }
		]
	}

	var testShardReportResultDelete_ =
  {
   "shardReportList":
	  [
	    {"rank":"1", "count":"2000",  "shardAction":"SHARD_READ", "message": "", "query":"Delete 1" },
	    {"rank":"2", "count":"1900",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Delete 2" },
	    {"rank":"3", "count":"1800",  "shardAction":"PARALLEL", "message": "", "query":"Delete 3" },
	    {"rank":"4", "count":"1700",  "shardAction":"SHARD_READ", "message": "", "query":"Delete 4" }
		]
	}

	var testShardReportResultOther_ =
  {
   "shardReportList":
	  [
	    {"rank":"1", "count":"2000",  "shardAction":"SHARD_READ", "message": "", "query":"Other 1" },
	    {"rank":"2", "count":"1900",  "shardAction":"GLOBAL_WRITE", "message": "", "query":"Other 2" },
	    {"rank":"3", "count":"1800",  "shardAction":"PARALLEL", "message": "", "query":"Other 3" },
	    {"rank":"4", "count":"1700",  "shardAction":"SHARD_READ", "message": "", "query":"Other 4" }
		]
	}

  // ============================================================================
  // JSON STREAM ANALYSIS.
  // ============================================================================

	var testStreamResultSelect_ =
  {
   "viewNameList": [ {"viewName":"v_0001" }, {"viewName":"v_0002" }, {"viewName":"v_0003" } ],
   "streamList":
	  [
	    {"id": "1",  "rank":"1",  "count":"2000", "streamInfo":"true",     "viewName":"",       "query":"Select 1",  "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "2",  "rank":"2",  "count":"1900", "streamInfo":"complete", "viewName":"v_0002", "query":"Select 2",  "avgQueryTimeBefore":"0.9", "avgQueryTimeAfter":"0.3" },
	    {"id": "3",  "rank":"3",  "count":"1800", "streamInfo":"false",    "viewName":"",       "query":"Select 3",  "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "4",  "rank":"4",  "count":"1700", "streamInfo":"true",     "viewName":"",       "query":"Select 4",  "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "5",  "rank":"5",  "count":"1600", "streamInfo":"complete", "viewName":"v_0001", "query":"Select 5",  "avgQueryTimeBefore":"0.8", "avgQueryTimeAfter":"0.1" },
	    {"id": "6",  "rank":"6",  "count":"1500", "streamInfo":"false",    "viewName":"",       "query":"Select 6",  "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "7",  "rank":"7",  "count":"1400", "streamInfo":"true",     "viewName":"",       "query":"Select 7",  "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "8",  "rank":"8",  "count":"1300", "streamInfo":"complete", "viewName":"v_0003", "query":"Select 8",  "avgQueryTimeBefore":"0.7", "avgQueryTimeAfter":"0.2" },
	    {"id": "9",  "rank":"9",  "count":"1200", "streamInfo":"false",    "viewName":"",       "query":"Select 9",  "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "10", "rank":"10", "count":"1100", "streamInfo":"false",    "viewName":"",       "query":"Select 10", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "11", "rank":"11", "count":"1000", "streamInfo":"true",     "viewName":"",       "query":"Select 11", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "12", "rank":"12", "count":"900",  "streamInfo":"true",     "viewName":"",       "query":"Select 12", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "13", "rank":"13", "count":"800",  "streamInfo":"true",     "viewName":"",       "query":"Select 13", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "14", "rank":"14", "count":"700",  "streamInfo":"false",    "viewName":"",       "query":"Select 14", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "15", "rank":"15", "count":"600",  "streamInfo":"true",     "viewName":"",       "query":"Select 15", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "16", "rank":"16", "count":"500",  "streamInfo":"false",    "viewName":"",       "query":"Select 16", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "17", "rank":"17", "count":"400",  "streamInfo":"false",    "viewName":"",       "query":"Select 17", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "18", "rank":"18", "count":"300",  "streamInfo":"true",     "viewName":"",       "query":"Select 18", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "19", "rank":"19", "count":"200",  "streamInfo":"false",    "viewName":"",       "query":"Select 19", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "20", "rank":"20", "count":"100",  "streamInfo":"false",    "viewName":"",       "query":"Select 20", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "21", "rank":"21", "count":"50",   "streamInfo":"false",    "viewName":"",       "query":"Select 21", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "22", "rank":"22", "count":"25",   "streamInfo":"true",     "viewName":"",       "query":"Select 22", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "23", "rank":"23", "count":"20",   "streamInfo":"true",     "viewName":"",       "query":"Select 23", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "24", "rank":"24", "count":"19",   "streamInfo":"true",     "viewName":"",       "query":"Select 24", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "25", "rank":"25", "count":"18",   "streamInfo":"false",    "viewName":"",       "query":"Select 25", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "26", "rank":"26", "count":"17",   "streamInfo":"true",     "viewName":"",       "query":"Select 26", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "27", "rank":"27", "count":"16",   "streamInfo":"false",    "viewName":"",       "query":"Select 27", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "28", "rank":"28", "count":"15",   "streamInfo":"false",    "viewName":"",       "query":"Select 28", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "29", "rank":"29", "count":"14",   "streamInfo":"true",     "viewName":"",       "query":"Select 29", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "30", "rank":"30", "count":"13",   "streamInfo":"false",    "viewName":"",       "query":"Select 30", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "31", "rank":"31", "count":"12",   "streamInfo":"false",    "viewName":"",       "query":"Select 31", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "32", "rank":"32", "count":"11",   "streamInfo":"false",    "viewName":"",       "query":"Select 32", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" },
	    {"id": "33", "rank":"33", "count":"10",   "streamInfo":"true",     "viewName":"",       "query":"Select 33", "avgQueryTimeBefore":"0.4", "avgQueryTimeAfter":"" }
		]
	}

  var resultStreamRequest_ =
  {
   "message": "successful operation"
  }