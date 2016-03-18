
  // JSON object.
  var testTree_ =
  {
   "summaryInfo": {"heat":"14"},
   "tables":
   [
     {
       "shardParentName":"rt_user", "ancestorName": "testTree_", "parentName": "testTree_",
       "name"  :"rt_user",
       "type"  :"RELATIONAL_SHARD_TREE",
       "level":"",
       "nbrShard":"",
       "keyShard":"SHARD_KEY",
       "tables":
       [
         {
           "shardParentName":"rt_user", "ancestorName": "testTree_", "parentName": "rt_user", "name":"user", "type":"SHARD_CHILD", "avgTime":"500", "totalTimePercent":"50", "totalTime":"500", "frequency":"100", "heat":"24", "level":"",
           "columns":[ "user01", "user02", "user03", "user04"],
           "foreignKeys":[],
           "tables":
           [
             {
              "shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_auth", "type":"SHARD_CHILD", "avgTime":"100000", "totalTimePercent":"10", "totalTime":"100000", "frequency":"70000", "heat":"20", "level":"",
              "columns":[ "user_auth01", "user_auth02", "user_auth03", "user_auth04"],
              "foreignKeys":[{ "table":"user_auth", "reference":"user", "key":"user01", "fk":"user_auth01" }]},
             {
               "shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_connection", "type":"SHARD_CHILD", "avgTime":"70", "totalTimePercent":"70", "totalTime":"70", "frequency":"50", "heat":"17", "level":"",
               "columns":[ "user_connection01", "user_connection02", "user_connection03"],
               "foreignKeys":[{ "table":"user_connection", "reference":"user", "key":"user02", "fk":"user_connection03" }],
               "tables":
               [
                 {"shardParentName":"rt_user", "ancestorName": "user", "parentName": "user_connection", "name":"user_blog_visitor", "type":"SHARD_CHILD", "avgTime":"60", "totalTimePercent":"60", "totalTime":"60", "frequency":"40", "heat":"15", "level":"",
                  "columns":[ "user_blog_visitor01", "user_blog_visitor02", "user_blog_visitor03"],
                  "foreignKeys":[{ "table":"user_blog_visitor", "reference":"user_connection", "key":"user_connection01", "fk":"user_blog_visitor02" }],
                  "tables":
		               [
		                 {"shardParentName":"rt_user", "ancestorName": "user_connection", "parentName": "user_blog_visitor", "name":"user_test", "type":"SHARD_CHILD", "avgTime":"60", "totalTimePercent":"60", "totalTime":"60", "frequency":"40", "heat":"15", "level":"",
		                  "columns":[ "user_test01", "user_test02", "user_test03"],
		                  "foreignKeys":[{ "table":"user_test", "reference":"user_blog_visitor", "key":"user_blog_visitor01", "fk":"user_test01" }]}
		               ]
                  }
               ]
             },
             {
               "shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_blog", "type":"SHARD_CHILD", "avgTime":"490", "totalTimePercent":"49", "totalTime":"490", "frequency":"95", "heat":"23", "level":"",
               "columns":[ "user_blog01", "user_blog02", "user_blog03"],
               "foreignKeys":[{ "table":"user_blog", "reference":"user", "key":"user01", "fk":"user_blog02" }],
               "tables":
               [
                 {"shardParentName":"rt_user", "ancestorName": "user", "parentName": "user_blog", "name":"user_blog_visitor","type":"SHARD_CHILD", "avgTime":"60", "totalTimePercent":"60", "totalTime":"60", "frequency":"40", "heat":"15", "level":"",
                  "columns":[ "user_blog_visitor01", "user_blog_visitor02", "user_blog_visitor03"],
                  "foreignKeys":[{ "table":"user_blog_visitor", "reference":"user_blog", "key":"user_blog01", "fk":"user_blog_visitor01" }]},

                 {"shardParentName":"rt_user", "ancestorName": "user", "parentName": "user_blog", "name":"user_blog_post", "type":"SHARD_CHILD", "avgTime":"20", "totalTimePercent":"20", "totalTime":"20", "frequency":"30", "heat":"8", "level":"",
                  "columns":[ "user_blog_post01", "user_blog_post02", "user_blog_post03"],
                  "foreignKeys":[{ "table":"user_blog_post", "reference":"user_blog", "key":"user_blog01", "fk":"user_blog_post03" }]}
               ]
             },
             {"shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_blog_comment", "type":"SHARD_CHILD", "avgTime":"250", "totalTimePercent":"25", "totalTime":"250", "frequency":"90", "heat":"22", "level":"",
              "columns":[ "user_blog_comment01", "user_blog_comment02", "user_blog_comment03"],
              "foreignKeys":[{ "table":"user_blog_comment", "reference":"user", "key":"user01", "fk":"user_blog_comment02" }]},

             {"shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_blog_post", "type":"SHARD_CHILD", "avgTime":"20", "totalTimePercent":"20", "totalTime":"20", "frequency":"30", "heat":"8", "level":"",
              "columns":[ "user_blog_post01", "user_blog_post02", "user_blog_post03"],
              "foreignKeys":[{ "table":"user_blog_post", "reference":"user", "key":"user01", "fk":"user_blog_post02" }]},

             {"shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_stat", "type":"SHARD_CHILD", "avgTime":"50", "totalTimePercent":"50", "totalTime":"50", "frequency":"35", "heat":"10", "level":"",
              "columns":[ "user_stat01", "user_stat02", "user_stat03"],
              "foreignKeys":[{ "table":"user_stat", "reference":"user", "key":"user01", "fk":"user_stat03" }]},

             {"shardParentName":"rt_user", "ancestorName": "rt_user", "parentName": "user", "name":"user_transaction", "type":"SHARD_CHILD", "avgTime":"80", "totalTimePercent":"80", "totalTime":"80", "frequency":"60", "heat":"19", "level":"",
              "columns":[ "user_transaction01", "user_transaction02", "user_transaction03"],
              "foreignKeys":[{ "table":"user_transaction", "reference":"user", "key":"user01", "fk":"user_transaction01" }]}
           ]
         }
       ]
     },
     {
       "shardParentName":"global", "ancestorName": "testTree_", "parentName": "testTree_",
       "name"  :"global",
       "type"  :"GLOBAL_SHARD_TREE",
       "level":"",
       "nbrShard":"",
       "keyShard":"",
       "tables":
       [
         {"shardParentName":"global", "ancestorName": "testTree_", "parentName": "global", "name":"blog", "type":"GLOBAL", "avgTime":"5", "totalTimePercent":"5", "totalTime":"5", "frequency":"20", "heat":"5", "level":"",
          "columns":[ "blog01", "blog02", "blog03"],
          "foreignKeys":[]},

         {"shardParentName":"global", "ancestorName": "testTree_", "parentName": "global", "name":"blog_post", "type":"GLOBAL", "avgTime":"2", "totalTimePercent":"2", "totalTime":"2", "frequency":"10", "heat":"3", "level":"",
          "columns":[ "blog_post01", "blog_post02", "blog_post03"],
          "foreignKeys":[]},

         {"shardParentName":"global", "ancestorName": "testTree_", "parentName": "global", "name":"blog_rating", "type":"GLOBAL", "avgTime":"1", "totalTimePercent":"1", "totalTime":"1", "frequency":"1", "heat":"0", "level":"",
          "columns":[ "blog_rating01", "blog_rating02", "blog_rating03"],
          "foreignKeys":[]},

         {"shardParentName":"global", "ancestorName": "testTree_", "parentName": "global", "name":"transaction_code", "type":"GLOBAL", "avgTime":"1", "totalTimePercent":"1", "totalTime":"1", "frequency":"1", "heat":"0", "level":"",
          "columns":[ "transaction_code01", "transaction_code02", "transaction_code03"],
          "foreignKeys":[]},

         {"shardParentName":"global", "ancestorName": "testTree_", "parentName": "global", "name":"stat_code", "type":"GLOBAL", "avgTime":"1", "totalTimePercent":"1", "totalTime":"1", "frequency":"1", "heat":"0", "level":"",
          "columns":[ "stat_code01", "stat_code02", "stat_code03"],
          "foreignKeys":[]}
       ]
     }
   ]

  }