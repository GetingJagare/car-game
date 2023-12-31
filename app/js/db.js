var db;

const getUsers = () => {
	const users = localStorage.getItem( 'users' );
	return users ? JSON.parse( users ) : {};
}

const saveUsers = ( users = {} ) => {
	localStorage.setItem( 'users', JSON.stringify( users ) );
}

function getScores() {
	const users = getUsers();

	let res = "";
	res += "<table frame=\"void\" rules=\"all\" cellspacing=\"0\" border=\"1\" width=\"220\" " +
		"bordercolor=\"#fff\"><tr><th>Login</th><th>Score</th><th>Level</th></tr>";
	Object.keys( users ).forEach( ( login ) => {
		res += "<tr><td>" + login + "</td><td>" + users[login].score + "</td><td>" + users[login].level + "</td></tr>";
	} );
	res += "</table><br><input type=\"button\" id=\"close_scores\" value=\"close\">";
	$( "#menu_list > #scores" ).html( res );
	$( "#menu_list > #scores > #close_scores" ).click( function () {
		$( this ).parent().removeClass( 'help_content' ).addClass( 'not_visible' )
			.children( "*" ).remove();
	} );
}

function checkMustBeSaved() {
	const users = getUsers(),
		user = users[userLogin];
	if ( !user ) {
		$( "#menu_list > #gamer" ).removeClass( 'not_visible' ).addClass( 'help_content' );
		$( "#menu_list > #gamer > #login" ).val( userLogin );
		return;
	}
	else {
		if ( user.score < score ) {
			$( "#menu_list > #gamer" ).removeClass( 'not_visible' ).addClass( 'help_content' );
			$( "#menu_list > #gamer > #login" ).val( userLogin );
		}
	}
}

function check() {
	const users = getUsers(),
		user = users[userLogin];
	if ( user ) {
		var html = "<div id = \"sup\">Load your result from database?<br>" +
			"<input type = \"button\" value = \"Yes\" id = \"load\">&nbsp;" +
			"<input type = \"button\" value = \"No\" id = \"not_load\">" +
			"<div id = \"res\"></div></div>";
		$( 'body' ).append( html );
		$( "#load" ).click( load );
		$( "#not_load" ).click( init );
	}
	else {
		setTimeout( "init()", 1000 );
	}
}

function load() {
	const users = getUsers(),
		user = users[userLogin];
	score = user.score;
	level = user.level;		
	$( "#sup > #res" ).text( "Loaded: score = " + user.score + "; level = " + user.level );
	setTimeout( "init()", 2000 );
}

function save() {
	const login = $( "#gamer > #login" ).val().trim(),
		score = parseInt( jc( "#score" ).string() ),
		level = parseInt( jc( "#level" ).string() );
	//if login input is empty
	if ( !login )
		$( "#gamer > #result" ).text( "No input!" );
	else {
		const users = getUsers();
		users[login] = { score, level };
		saveUsers( users );
	}
}

