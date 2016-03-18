
  // ============================================================================
  // JSON AGENT.
  // ============================================================================

	var resultRepPrim_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"replication",
   "cat"       :"primary",
   "resultList":
	  [
	    {"agent":"1",  "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"55555", "role":"Primary Replication", "logTPS":"4", "loggedTXLast": "100000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "5 hour(s)", "memoryPercent": "8",  "mb": "507", "threads": "36", "stats": "0 - 15 ms (avg 47 ms); 12/sec; 0 - 14 concur", "updateLast": "2 second(s)", "status": "OK" },
	    {"agent":"2",  "shards":"2", "version":"1.0", "host":"00.00.00.00", "PID":"44444", "role":"Primary Replication", "logTPS":"6", "loggedTXLast": "200000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "8 hour(s)", "memoryPercent": "6",  "mb": "507", "threads": "37", "stats": "0 - 16 ms (avg 48 ms); 13/sec; 0 - 15 concur", "updateLast": "3 second(s)", "status": "OK" },
	    {"agent":"3",  "shards":"3", "version":"1.0", "host":"00.00.00.00", "PID":"33333", "role":"Primary Replication", "logTPS":"8", "loggedTXLast": "800000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "7 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "38", "stats": "0 - 17 ms (avg 49 ms); 14/sec; 0 - 16 concur", "updateLast": "4 second(s)", "status": "OK" },
	    {"agent":"4",  "shards":"4", "version":"1.0", "host":"00.00.00.00", "PID":"22222", "role":"Primary Replication", "logTPS":"2", "loggedTXLast": "400000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "4 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "39", "stats": "0 - 18 ms (avg 50 ms); 15/sec; 0 - 17 concur", "updateLast": "5 second(s)", "status": "FAILED" },
	    {"agent":"5",  "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"11111", "role":"Primary Replication", "logTPS":"9", "loggedTXLast": "200000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "3 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "40", "stats": "0 - 19 ms (avg 51 ms); 16/sec; 0 - 18 concur", "updateLast": "6 second(s)", "status": "OK" },
	    {"agent":"6",  "shards":"2", "version":"1.0", "host":"00.00.00.00", "PID":"99999", "role":"Primary Replication", "logTPS":"3", "loggedTXLast": "800000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "2 hour(s)", "memoryPercent": "60", "mb": "507", "threads": "41", "stats": "0 - 20 ms (avg 52 ms); 17/sec; 0 - 14 concur", "updateLast": "7 second(s)", "status": "OK" },
	    {"agent":"7",  "shards":"3", "version":"1.0", "host":"00.00.00.00", "PID":"88888", "role":"Primary Replication", "logTPS":"8", "loggedTXLast": "700000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "8 hour(s)", "memoryPercent": "0",  "mb": "507", "threads": "42", "stats": "0 - 21 ms (avg 53 ms); 18/sec; 0 - 19 concur", "updateLast": "8 second(s)", "status": "FAILED" },
	    {"agent":"8",  "shards":"4", "version":"1.0", "host":"00.00.00.00", "PID":"77777", "role":"Primary Replication", "logTPS":"5", "loggedTXLast": "300000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "6 hour(s)", "memoryPercent": "8",  "mb": "507", "threads": "43", "stats": "0 - 22 ms (avg 54 ms); 19/sec; 0 - 20 concur", "updateLast": "9 second(s)", "status": "OK" },
	    {"agent":"9",  "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"66666", "role":"Primary Replication", "logTPS":"9", "loggedTXLast": "700000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "4 hour(s)", "memoryPercent": "50", "mb": "507", "threads": "44", "stats": "0 - 23 ms (avg 55 ms); 20/sec; 0 - 21 concur", "updateLast": "5 second(s)", "status": "OK" },
	    {"agent":"10", "shards":"2", "version":"1.0", "host":"00.00.00.00", "PID":"21211", "role":"Primary Replication", "logTPS":"8", "loggedTXLast": "400000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "8 hour(s)", "memoryPercent": "9",  "mb": "507", "threads": "45", "stats": "0 - 24 ms (avg 56 ms); 21/sec; 0 - 22 concur", "updateLast": "4 second(s)", "status": "FAILED" },
	    {"agent":"11", "shards":"3", "version":"1.0", "host":"00.00.00.00", "PID":"32322", "role":"Primary Replication", "logTPS":"5", "loggedTXLast": "600000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "3 hour(s)", "memoryPercent": "3",  "mb": "507", "threads": "46", "stats": "0 - 25 ms (avg 57 ms); 22/sec; 0 - 23 concur", "updateLast": "7 second(s)", "status": "OK" },
	    {"agent":"12", "shards":"4", "version":"1.0", "host":"00.00.00.00", "PID":"43433", "role":"Primary Replication", "logTPS":"3", "loggedTXLast": "200000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "7 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "47", "stats": "0 - 26 ms (avg 58 ms); 23/sec; 0 - 25 concur", "updateLast": "5 second(s)", "status": "OK" },
	    {"agent":"13", "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"54544", "role":"Primary Replication", "logTPS":"0", "loggedTXLast": "300000", "remoteReplicator": "N/A", "remoteReplTXLast": "N/A", "uptime": "5 hour(s)", "memoryPercent": "4",  "mb": "507", "threads": "48", "stats": "0 - 27 ms (avg 59 ms); 24/sec; 0 - 28 concur", "updateLast": "2 second(s)", "status": "OK" }
		]
	}

	var resultRepSec_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"replication",
   "cat"       :"secondary0",
   "resultList":
	  [
	    {"agent":"10",  "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"55555", "role":"Primary Replication", "logTPS":"4", "loggedTXLast": "100000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "5 hour(s)", "memoryPercent": "8",  "mb": "507", "threads": "36", "stats": "0 - 15 ms (avg 47 ms); 12/sec; 0 - 14 concur", "suspectTX": "N/A", "updateLast": "2 second(s)", "status": "OK" },
	    {"agent":"20",  "shards":"2", "version":"1.0", "host":"00.00.00.00", "PID":"44444", "role":"Primary Replication", "logTPS":"6", "loggedTXLast": "200000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "8 hour(s)", "memoryPercent": "6",  "mb": "507", "threads": "37", "stats": "0 - 16 ms (avg 48 ms); 13/sec; 0 - 15 concur", "suspectTX": "N/A", "updateLast": "3 second(s)", "status": "OK" },
	    {"agent":"30",  "shards":"3", "version":"1.0", "host":"00.00.00.00", "PID":"33333", "role":"Primary Replication", "logTPS":"8", "loggedTXLast": "800000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "7 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "38", "stats": "0 - 17 ms (avg 49 ms); 14/sec; 0 - 16 concur", "suspectTX": "N/A", "updateLast": "4 second(s)", "status": "OK" },
	    {"agent":"40",  "shards":"4", "version":"1.0", "host":"00.00.00.00", "PID":"22222", "role":"Primary Replication", "logTPS":"2", "loggedTXLast": "400000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "4 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "39", "stats": "0 - 18 ms (avg 50 ms); 15/sec; 0 - 17 concur", "suspectTX": "N/A", "updateLast": "5 second(s)", "status": "FAILED" },
	    {"agent":"50",  "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"11111", "role":"Primary Replication", "logTPS":"9", "loggedTXLast": "200000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "3 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "40", "stats": "0 - 19 ms (avg 51 ms); 16/sec; 0 - 18 concur", "suspectTX": "N/A", "updateLast": "6 second(s)", "status": "OK" },
	    {"agent":"60",  "shards":"2", "version":"1.0", "host":"00.00.00.00", "PID":"99999", "role":"Primary Replication", "logTPS":"3", "loggedTXLast": "800000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "2 hour(s)", "memoryPercent": "60", "mb": "507", "threads": "41", "stats": "0 - 20 ms (avg 52 ms); 17/sec; 0 - 14 concur", "suspectTX": "N/A", "updateLast": "7 second(s)", "status": "OK" },
	    {"agent":"70",  "shards":"3", "version":"1.0", "host":"00.00.00.00", "PID":"77777", "role":"Primary Replication", "logTPS":"8", "loggedTXLast": "700000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "8 hour(s)", "memoryPercent": "0",  "mb": "507", "threads": "42", "stats": "0 - 21 ms (avg 53 ms); 18/sec; 0 - 19 concur", "suspectTX": "N/A", "updateLast": "8 second(s)", "status": "FAILED" },
	    {"agent":"80",  "shards":"4", "version":"1.0", "host":"00.00.00.00", "PID":"88888", "role":"Primary Replication", "logTPS":"5", "loggedTXLast": "300000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "6 hour(s)", "memoryPercent": "8",  "mb": "507", "threads": "43", "stats": "0 - 22 ms (avg 54 ms); 19/sec; 0 - 20 concur", "suspectTX": "N/A", "updateLast": "9 second(s)", "status": "OK" },
	    {"agent":"90",  "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"66666", "role":"Primary Replication", "logTPS":"9", "loggedTXLast": "700000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "4 hour(s)", "memoryPercent": "50", "mb": "507", "threads": "44", "stats": "0 - 23 ms (avg 55 ms); 20/sec; 0 - 21 concur", "suspectTX": "N/A", "updateLast": "5 second(s)", "status": "OK" },
	    {"agent":"100", "shards":"2", "version":"1.0", "host":"00.00.00.00", "PID":"34343", "role":"Primary Replication", "logTPS":"8", "loggedTXLast": "400000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "8 hour(s)", "memoryPercent": "9",  "mb": "507", "threads": "45", "stats": "0 - 24 ms (avg 56 ms); 21/sec; 0 - 22 concur", "suspectTX": "N/A", "updateLast": "4 second(s)", "status": "FAILED" },
	    {"agent":"110", "shards":"3", "version":"1.0", "host":"00.00.00.00", "PID":"64565", "role":"Primary Replication", "logTPS":"5", "loggedTXLast": "600000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "3 hour(s)", "memoryPercent": "3",  "mb": "507", "threads": "46", "stats": "0 - 25 ms (avg 57 ms); 22/sec; 0 - 23 concur", "suspectTX": "N/A", "updateLast": "7 second(s)", "status": "OK" },
	    {"agent":"120", "shards":"4", "version":"1.0", "host":"00.00.00.00", "PID":"87877", "role":"Primary Replication", "logTPS":"3", "loggedTXLast": "200000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "7 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "47", "stats": "0 - 26 ms (avg 58 ms); 23/sec; 0 - 25 concur", "suspectTX": "N/A", "updateLast": "5 second(s)", "status": "OK" },
	    {"agent":"130", "shards":"1", "version":"1.0", "host":"00.00.00.00", "PID":"21211", "role":"Primary Replication", "logTPS":"0", "loggedTXLast": "300000", "localApplier": "N/A", "localApplTXLast": "N/A", "uptime": "5 hour(s)", "memoryPercent": "4",  "mb": "507", "threads": "48", "stats": "0 - 27 ms (avg 59 ms); 24/sec; 0 - 28 concur", "suspectTX": "N/A", "updateLast": "2 second(s)", "status": "OK" }
		]
	}

	var resultChRepSender_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"chained-replication",
   "cat"       :"primary",
   "resultList":
	  [
	    {"agent":"1", "version":"1.0", "host":"00.00.00.00", "PID":"55555", "role":"Chained Replication Sender", "remoteReplicator": "N/A", "remoteReplLast": "N/A", "uptime": "11 hour(s)", "memoryPercent": "8",  "mb": "507", "threads": "94", "stats": "0 - 40 ms (avg 60 ms); 20/sec; 0 - 19 concur", "updateLast": "30 second(s)", "status": "OK" },
	    {"agent":"2", "version":"1.0", "host":"00.00.00.00", "PID":"44444", "role":"Chained Replication Sender", "remoteReplicator": "N/A", "remoteReplLast": "N/A", "uptime": "13 hour(s)", "memoryPercent": "6",  "mb": "507", "threads": "95", "stats": "0 - 41 ms (avg 61 ms); 21/sec; 0 - 21 concur", "updateLast": "31 second(s)", "status": "OK" },
	    {"agent":"3", "version":"1.0", "host":"00.00.00.00", "PID":"33333", "role":"Chained Replication Sender", "remoteReplicator": "N/A", "remoteReplLast": "N/A", "uptime": "15 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "96", "stats": "0 - 42 ms (avg 62 ms); 22/sec; 0 - 23 concur", "updateLast": "32 second(s)", "status": "FAILED" },
	    {"agent":"4", "version":"1.0", "host":"00.00.00.00", "PID":"22222", "role":"Chained Replication Sender", "remoteReplicator": "N/A", "remoteReplLast": "N/A", "uptime": "17 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "97", "stats": "0 - 43 ms (avg 63 ms); 23/sec; 0 - 25 concur", "updateLast": "33 second(s)", "status": "OK" },
	    {"agent":"5", "version":"1.0", "host":"00.00.00.00", "PID":"11111", "role":"Chained Replication Sender", "remoteReplicator": "N/A", "remoteReplLast": "N/A", "uptime": "19 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "98", "stats": "0 - 44 ms (avg 64 ms); 24/sec; 0 - 27 concur", "updateLast": "34 second(s)", "status": "OK" }
		]
	}

	var resultChRepPrimRecvr_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"chained-replication",
   "cat"       :"secondary0",
   "resultList":
	  [
	    {"agent":"11",  "version":"1.0", "host":"00.00.00.00",  "PID":"66666", "role":"Chained Replication Primary Receiver", "throughput": "10", "uptime": "11 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "94", "stats": "0 - 40 ms (avg 60 ms); 20/sec; 0 - 19 concur", "updateLast": "30 second(s)", "status": "OK" },
	    {"agent":"12",  "version":"1.0", "host":"00.00.00.00",  "PID":"55555", "role":"Chained Replication Primary Receiver", "throughput": "11", "uptime": "13 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "95", "stats": "0 - 41 ms (avg 61 ms); 21/sec; 0 - 21 concur", "updateLast": "31 second(s)", "status": "OK" },
	    {"agent":"13",  "version":"1.0", "host":"00.00.00.00",  "PID":"44444", "role":"Chained Replication Primary Receiver", "throughput": "12", "uptime": "15 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "96", "stats": "0 - 42 ms (avg 62 ms); 22/sec; 0 - 23 concur", "updateLast": "32 second(s)", "status": "FAILED" },
	    {"agent":"14",  "version":"1.0", "host":"00.00.00.00",  "PID":"33333", "role":"Chained Replication Primary Receiver", "throughput": "13", "uptime": "17 hour(s)", "memoryPercent": "60", "mb": "507", "threads": "97", "stats": "0 - 43 ms (avg 63 ms); 23/sec; 0 - 25 concur", "updateLast": "33 second(s)", "status": "OK" },
	    {"agent":"15",  "version":"1.0", "host":"00.00.00.00",  "PID":"22222", "role":"Chained Replication Primary Receiver", "throughput": "14", "uptime": "19 hour(s)", "memoryPercent": "0",  "mb": "507", "threads": "98", "stats": "0 - 44 ms (avg 64 ms); 24/sec; 0 - 27 concur", "updateLast": "34 second(s)", "status": "OK" }
		]
	}

	var resultChRepSecRecvr_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"chained-replication",
   "cat"       :"secondary1",
   "resultList":
	  [
	    {"agent":"26",  "version":"1.0", "host":"00.00.00.00",  "PID":"99999", "role":"Chained Replication Secondary Receiver", "throughput": "100", "uptime": "10 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "34", "stats": "0 - 70 ms (avg 50 ms); 80/sec; 0 - 39 concur", "updateLast": "40 second(s)", "status": "OK" },
	    {"agent":"22",  "version":"1.0", "host":"00.00.00.00",  "PID":"88888", "role":"Chained Replication Secondary Receiver", "throughput": "110", "uptime": "23 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "35", "stats": "0 - 71 ms (avg 51 ms); 81/sec; 0 - 31 concur", "updateLast": "41 second(s)", "status": "FAILED" },
	    {"agent":"23",  "version":"1.0", "host":"00.00.00.00",  "PID":"77777", "role":"Chained Replication Secondary Receiver", "throughput": "120", "uptime": "25 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "36", "stats": "0 - 72 ms (avg 52 ms); 82/sec; 0 - 33 concur", "updateLast": "42 second(s)", "status": "FAILED" },
	    {"agent":"24",  "version":"1.0", "host":"00.00.00.00",  "PID":"66666", "role":"Chained Replication Secondary Receiver", "throughput": "130", "uptime": "27 hour(s)", "memoryPercent": "60", "mb": "507", "threads": "37", "stats": "0 - 73 ms (avg 53 ms); 83/sec; 0 - 35 concur", "updateLast": "43 second(s)", "status": "OK" },
	    {"agent":"25",  "version":"1.0", "host":"00.00.00.00",  "PID":"55555", "role":"Chained Replication Secondary Receiver", "throughput": "140", "uptime": "29 hour(s)", "memoryPercent": "0",  "mb": "507", "threads": "38", "stats": "0 - 74 ms (avg 54 ms); 84/sec; 0 - 37 concur", "updateLast": "44 second(s)", "status": "FAILED" }
		]
	}


	var resultQuery_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"query",
   "cat"       :"primary",
   "resultList":
	  [
	    {"agent":"40", "version":"1.0", "host":"00.00.00.00", "PID":"88888", "uptime": "61 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "94", "stats": "6 ms; 6/sec; 6 concur", "querySuccess":"1", "queryFailure":"0", "rollupCount":"1", "updateLast": "10 second(s)", "status": "FAILED" },
	    {"agent":"41", "version":"1.0", "host":"00.00.00.00", "PID":"66666", "uptime": "63 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "95", "stats": "7 ms; 7/sec; 7 concur", "querySuccess":"2", "queryFailure":"5", "rollupCount":"4", "updateLast": "11 second(s)", "status": "OK" },
	    {"agent":"42", "version":"1.0", "host":"00.00.00.00", "PID":"33333", "uptime": "65 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "96", "stats": "8 ms; 8/sec; 8 concur", "querySuccess":"3", "queryFailure":"9", "rollupCount":"8", "updateLast": "12 second(s)", "status": "OK" }
		]
	}

	var resultProcedure_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"procedure",
   "cat"       :"primary",
   "resultList":
	  [
	    {"agent":"50", "version":"1.0", "host":"00.00.00.00", "PID":"16000", "uptime": "11 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "24", "stats": "2 ms; 2/sec; 2 concur", "querySuccess":"4", "queryFailure":"9", "updateLast": "30 second(s)", "status": "OK" },
	    {"agent":"51", "version":"1.0", "host":"00.00.00.00", "PID":"16001", "uptime": "13 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "25", "stats": "3 ms; 3/sec; 3 concur", "querySuccess":"5", "queryFailure":"8", "updateLast": "31 second(s)", "status": "OK" },
	    {"agent":"52", "version":"1.0", "host":"00.00.00.00", "PID":"16002", "uptime": "15 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "26", "stats": "4 ms; 4/sec; 4 concur", "querySuccess":"6", "queryFailure":"7", "updateLast": "32 second(s)", "status": "FAILED" }
		]
	}

	var resultStream_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"stream",
   "cat"       :"primary",
   "resultList":
	  [
	    {"agent":"60", "version":"1.0", "host":"00.00.00.00", "PID":"17000", "replicationState":"Ready", "uptime": "14 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "94", "replicatonTPS": "3", "replTXLast": "N/A", "updateLast": "70 second(s)", "status": "FAILED" },
	    {"agent":"61", "version":"1.0", "host":"00.00.00.00", "PID":"17001", "replicationState":"Ready", "uptime": "15 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "95", "replicatonTPS": "4", "replTXLast": "N/A", "updateLast": "71 second(s)", "status": "OK" },
	    {"agent":"62", "version":"1.0", "host":"00.00.00.00", "PID":"17002", "replicationState":"Ready", "uptime": "16 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "96", "replicatonTPS": "5", "replTXLast": "N/A", "updateLast": "72 second(s)", "status": "FAILED" }
		]
	}

	var resultDrillDownAgent_ =
  {
   "queryName"   :"drillDown",
   "listName"    :"",
   "cat"         :"",
   "ID"          :"",
   "messageStats":
	  [
	    {"channel":"1", "messageCount":"10", "messagePerSecond":"20", "byteCount":"300",  "throughputMB":"400", "workerThreads":"5", "requestTimings":"6", "connections": "7", "concurrentRequests": "8" },
	    {"channel":"2", "messageCount":"10", "messagePerSecond":"20", "byteCount":"400",  "throughputMB":"500", "workerThreads":"6", "requestTimings":"7", "connections": "8", "concurrentRequests": "9" },
	    {"channel":"3", "messageCount":"20", "messagePerSecond":"30", "byteCount":"500",  "throughputMB":"600", "workerThreads":"7", "requestTimings":"8", "connections": "9", "concurrentRequests": "10" }
		],
   "lastLogWarnMessage" :"This is a warning message.",
   "lastLogErrorMessage":"This is an error message.",
   "alerts":
	  [
	    {"alertNbr":"1", "hostName":"DV 1", "processName":"4", "severity":"10", "message":"Fix this now.",  "acknowledged":"Yes", "time":"09:10:30" },
	    {"alertNbr":"2", "hostName":"DV 2", "processName":"5", "severity":"6",  "message":"Fix this soon.", "acknowledged":"No",  "time":"N/A" },
	    {"alertNbr":"3", "hostName":"DV 3", "processName":"6", "severity":"0",  "message":"No problems.",   "acknowledged":"Yes", "time":"09:10:31" }
		]
	}

  // ============================================================================
  // JSON AGENT - STATS.
  // ============================================================================

	var testStatsAgentResult_ =
  {
   "queryName"  : "statsQuery",
   "statType"   : "agent",
   "statsTypeId": "",
   "rowLimit"   : "20",
   "statValues" :
    [
      {"statInterval": "15-SECOND", "startTime":"", "statName":"agentMinLatency",       "countSuccess": [0,1,2,3,4,5,6,7,8,9]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"agentMaxLatency",       "countSuccess": [100,200,300,400,500,600,700,750,775,800]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"agentAvgLatency",       "countSuccess": [180,320,190,230,420,110,220,310,430,110]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"agentThroughput",       "countSuccess": [454,526,438,562,489,523,597,482,359,242]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"replicationMinLatency", "countSuccess": [5,30,50,20,40,30,90,70,60,30]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"replicationMaxLatency", "countSuccess": [85,750,55,85,1650,95,75,850,65,1050]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"replicationAvgLatency", "countSuccess": [130,520,290,430,320,210,120,410,530,210]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"replicationThroughput", "countSuccess": [254,326,538,462,589,423,697,382,259,442]}
    ]
  }

  // ============================================================================
  // JSON CLIENT.
  // ============================================================================

	var resultClient_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"client",
   "cat"       :"primary",
   "resultList":
	  [
	    {"host":"00.00.00.00", "PID":"44444", "driverUUID":"3hduryfh-weroiu-weroiu-sfjh-fjh4837hjd", "driverVersion":"4.7.7777-GB", "memoryPercent": "2",  "mb": "507", "threads": "94", "totalDBConnections":"11111", "currentShardReads":"22222", "currentShardWrites":"33333", "currentParallel":"44444", "currentProcesses":"55555", "historicalShardReads":"66666", "historicalShardWrites":"77777", "historicalParallel":"88888", "historicalProcesses":"99999", "logWarning":"5", "logError":"6", "updateLast": "2 second(s)", "status": "OK" },
	    {"host":"00.00.00.00", "PID":"55555", "driverUUID":"3hduryfh-weroiu-weroiu-sfjh-sdgbbfsgdf", "driverVersion":"4.7.7777-GB", "memoryPercent": "70", "mb": "507", "threads": "95", "totalDBConnections":"22222", "currentShardReads":"33333", "currentShardWrites":"44444", "currentParallel":"55555", "currentProcesses":"66666", "historicalShardReads":"77777", "historicalShardWrites":"88888", "historicalParallel":"33333", "historicalProcesses":"11111", "logWarning":"6", "logError":"7", "updateLast": "3 second(s)", "status": "FAILED" },
	    {"host":"00.00.00.00", "PID":"66666", "driverUUID":"3hduryfh-weroiu-weroiu-sfjh-wewe543fer", "driverVersion":"4.7.7777-GB", "memoryPercent": "40", "mb": "507", "threads": "96", "totalDBConnections":"33333", "currentShardReads":"44444", "currentShardWrites":"55555", "currentParallel":"66666", "currentProcesses":"77777", "historicalShardReads":"88888", "historicalShardWrites":"99999", "historicalParallel":"44444", "historicalProcesses":"22222", "logWarning":"7", "logError":"8", "updateLast": "4 second(s)", "status": "OK" }
		],
	}

	var resultDrillDownClient_ =
  {
   "queryName"  :"drillDown",
   "listName"   :"",
   "cat"        :"primary",
   "ID"         :"",
   "connections":
	  [
	    {"shard":"shard-1.primary.poolSize", "pooledConnections":"10"  },
	    {"shard":"shard-2.primary.poolSize", "pooledConnections":"11"  },
	    {"shard":"shard-3.primary.poolSize", "pooledConnections":"12"  },
	    {"shard":"shard-4.primary.poolSize", "pooledConnections":"13"  }
		]
	}

  // ============================================================================
  // JSON CLIENT - STATS.
  // ============================================================================

	var testStatsClientResult_ =
  {
   "queryName"  : "statsQuery",
   "statType"   : "client",
   "statsTypeId": "random",
   "rowLimit"   : "20",
   "statValues" :
    [
      {"statInterval": "15-SECOND", "startTime":"", "statName":"total",       "countSuccess": [700,600,1640,630,650,760,680,1690,680,640]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"globalRead",  "countSuccess": [90,400,70,90,300,80,60,300,90,200]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"globalWrite", "countSuccess": [180,320,190,230,420,110,220,310,430,110]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"shardRead",   "countSuccess": [454,426,438,462,489,423,497,482,359,242]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"shardWrite",  "countSuccess": [5,30,50,20,40,30,90,70,60,30]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"parallel",    "countSuccess": [5,7,5,85,250,495,475,350,465,450]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"process",     "countSuccess": [130,520,290,430,320,210,120,410,530,210]},
      {"statInterval": "15-SECOND", "startTime":"", "statName":"failedQuery", "countSuccess": [254,326,438,462,489,423,497,382,259,442]}
    ]
  }

  // ============================================================================
  // JSON HOST.
  // ============================================================================

	var resultHost_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"host",
   "cat"       :"primary",
   "resultList":
	  [
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "FAILED" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "FAILED" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "status": "OK" }
		]
	}

	var resultHostIP_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"hostIP",
   "cat"       :"primary",
   "resultList":
	  [
	    {"host":"test.1-primary", "hostAddress":"00.00.00.00" },
	    {"host":"test.2-primary", "hostAddress":"00.00.00.00" }
		]
	}

	var resultDrillDownHost_ =
  {
   "queryName":"drillDown",
   "listName" :"host",
   "cat"      :"primary",
   "ID"       :"",
   "process":
	  [
	    {"hostAddress":"00.00.00.00", "PID":"55555", "processName":"process1", "version":"2", "uptime": "61 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "94", "logWarning":"55555", "logError":"66666", "updateLast": "2 second(s)", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "PID":"44444", "processName":"process1", "version":"2", "uptime": "51 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "95", "logWarning":"66666", "logError":"77777", "updateLast": "3 second(s)", "status": "FAILED" },
	    {"hostAddress":"00.00.00.00", "PID":"33333", "processName":"process1", "version":"2", "uptime": "41 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "96", "logWarning":"77777", "logError":"88888", "updateLast": "4 second(s)", "status": "OK" }
		],
   "usage":
	  [
	    {"path":"/./mnt/data", "total":"1200300", "available":"500", "usedPercent":"70" },
	    {"path":"/mnt/log",    "total":"2400600", "available":"400", "usedPercent":"30" },
	    {"path":"/",           "total":"3700100", "available":"443", "usedPercent":"40" }
		]
	}

  // ============================================================================
  // JSON PROCESS.
  // ============================================================================

	var resultProcess_ =
  {
   "queryName" :"mgmtList",
   "listName"  :"process",
   "cat"       :"primary",
   "resultList":
	  [
	    {"hostAddress":"00.00.00.00", "PID":"55555", "processName":"process1", "version":"5", "uptime": "61 hour(s)", "memoryPercent": "2",  "mb": "507", "threads": "94", "logWarning":"55555", "logError":"66666", "updateLast": "2 second(s)", "status": "OK" },
	    {"hostAddress":"00.00.00.00", "PID":"44444", "processName":"process1", "version":"5", "uptime": "51 hour(s)", "memoryPercent": "70", "mb": "507", "threads": "95", "logWarning":"66666", "logError":"77777", "updateLast": "3 second(s)", "status": "FAILED" },
	    {"hostAddress":"00.00.00.00", "PID":"33333", "processName":"process1", "version":"5", "uptime": "41 hour(s)", "memoryPercent": "40", "mb": "507", "threads": "96", "logWarning":"77777", "logError":"88888", "updateLast": "4 second(s)", "status": "OK" }
		]
	}

  // ============================================================================
  // JSON MESSAGE.
  // ============================================================================

  var resultMessage_ =
  {
   "message": "successful operation"
  }
























