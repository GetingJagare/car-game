 var db;
		 function initDB() {
			 if (!window.openDatabase) {
			   $("body").append("DB is not supported!");
			   return false;
			   }
			 if (db == undefined) {
			  db = openDatabase("stat","1.0","Test DB",2*1024*1024);
		     } 
             return true; 
		 }
		 
		 function createTable() {
		   db.transaction( function(t) {  
		       var cr_query = "CREATE TABLE IF NOT EXISTS user( id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, login CHAR(255) NOT NULL, score INTEGER NOT"+               " NULL, level INTEGER NOT NULL)";
		       //create table if it doesn't exist 
				 t.executeSql(cr_query, [] );
				 }, errorHandler, nullHandler);
		 }
		 
         function getScores() {
              
           db.transaction( function(t) {
              var query = "SELECT login, score, level FROM user";
              t.executeSql(query, [], function(t, result) {
				 var res = "", len = result.rows.length; 
                 res += "<table frame = 'void' rules = 'all' cellspacing = '0' border = '1' width = '220' "+
                 "bordercolor = '#fff'><tr><th>Login</th><th>Score</th><th>Level</th></tr>";
                 for (var i=0; i < len; i++) {
                    res += "<tr><td>"+result.rows.item(i).login+"</td><td>"+
                           result.rows.item(i).score+"</td><td>"+
                           result.rows.item(i).level+"</td></tr>";
                 }
                 res += "</table><br><input type = 'button' id = 'close_scores' value = 'close'>";
                 $("#menu_list > #scores").html(res);
                  $("#menu_list > #scores > #close_scores").click( function () {
				    $(this).parent().removeClass('help_content').addClass('not_visible')
					                .children("*").remove();
				 });
              });         
           }, 
           errorHandler, 
           nullHandler); 
         }
         
		 function checkMustBeSaved() {
		   db.transaction( function (t) {
		       var query = "SELECT score FROM user WHERE login = ?";
               t.executeSql(query, [userLogin], function(t, res) {
                  if (res.rows.length == 0) {
                    $("#menu_list > #gamer").removeClass('not_visible').addClass('help_content');
                    $("#menu_list > #gamer > #login").val(userLogin);
                    return;
                  }
                  else {
                    var sc = res.rows.item(0).score;
                    if (sc < score) {
                        $("#menu_list > #gamer").removeClass('not_visible').addClass('help_content');
                        $("#menu_list > #gamer > #login").val(userLogin);
                    }
                  }
               });            
		   }, errorHandler, nullHandler); 
		 }
		 
		 function check() {
		      createTable();
			  db.transaction ( function (t) {
				  
				  var ch_query = "SELECT COUNT(*) AS CNT FROM user WHERE login = ?";
				 // alert(userLogin);
				  t.executeSql(ch_query, [userLogin], function(t, res) {
					   var count = res.rows.item(0).CNT;
					   if (count > 0) {
						    var html = "<div id = \"sup\">Load your result from database?<br>"+
						                "<input type = \"button\" value = \"Yes\" id = \"load\">&nbsp;"+
						                "<input type = \"button\" value = \"No\" id = \"not_load\">"+
						                "<div id = \"res\"></div></div>";
                            $('body').append(html);						                
                            $("#load").click(load);
                            $("#not_load").click(init);			
					    }   
					    else 
							 setTimeout("init()",1000);
					  });
				  
				  }, errorHandler, nullHandler);
		 }
		 
		 function load() {
		  db.transaction ( function(t) {	 
			var load_query = "SELECT score, level FROM user WHERE login = ?";
			// alert(userLogin);
			t.executeSql(load_query, [userLogin], function(t,res) {
			score = parseInt(res.rows.item(0).score);
			level = parseInt(res.rows.item(0).level);	
			$("#sup > #res").text("Loaded: score = "+score+"; level = "+level);
			setTimeout("init()",2000);
			});		
		}, errorHandler, nullHandler);
		 }
		 
		 function save() { 
		    //transaction for creating table
		    
			
			  //transaction for adding rows  
			  db.transaction( function (t) {	  	 
				var login = $("#gamer > #login").val(), score = parseInt(jc("#score").string()),
				    level = parseInt(jc("#level").string());  	 
				 //if something not input
				if (login == "")
				 $("#gamer > #result").text("No input!");
				else { 
				 var s_query = "SELECT COUNT(*) AS CNT FROM user WHERE login = ?";
				 //Check if input login exists. If it exists score will be updated 
				 t.executeSql(s_query, [login], function(t, res) {
				                 var r_count  = res.rows.item(0).CNT;
				                 if (r_count > 0) {
				                  //alert("The same user exists!");
				                  var up_query = "UPDATE user SET score = ?, level = ? WHERE login = ?";
				                  t.executeSql( up_query, [score,level,login ],function() {
									   $("#gamer > #result").text("Updated");
									  } );    
							     }
				                 else {               
				                  //Otherwise row will be added
                              var ins_query = "INSERT INTO user(login, score, level) VALUES(?,?,?)";
                              t.executeSql(ins_query, [login, score, level], function() {
                              $("#gamer > #result").text("Saved"); 
                             });
                            } 
				               });			               
				
            }
         }, errorHandler, nullHandler );
		 }
		 
		 function errorHandler( error) {
			 alert("Error: "+error.message+"; code = "+error.code);
		 }
		 
		 function nullHandler(t, res) {
		 }
		 
