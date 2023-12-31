var W, H;
var level = 0, score = 0;
var gameStarted = false, carMoving = false, gameOver = false, levelUp = false, prevScore = 0;
var blocks = [], flamePoints = [], timeoutID, crashX = -1;
var lifes = 3, lifesArr;

function initGame() {
	W = parseInt( $( '#canvas' ).attr( 'width' ) );
	H = parseInt( $( '#canvas' ).attr( 'height' ) );
	lifesArr = new Array( lifes );
	drawEnv();
	$( "#canvas" ).mousemove( function ( e ) {
		if ( levelUp )
			return;
		if ( !gameStarted )
			return;
		var y = e.pageY - parseInt( $( this ).css( 'top' ) );
		if ( y < 350 )
			return;
		var ax = e.pageX - parseInt( $( this ).css( "left" ) );
		if ( ax < 18 )
			ax = 18;
		else if ( ax > 232 )
			ax = 232;
		$.each( jc( ".car" ).elements, function () {
			var time = 80 * ( ax - this.attr( 'width' ) / 2 ) / 82;
			this.stop();
			this.animate( { x: ax - this.attr( 'width' ) / 2, y: this.position().y } );
		} );
	} );
	$( "#canvas" ).mouseout( function () {
		$.each( jc( ".car" ).elements, function () {
			this.stop();
		} );
	} );
}

function drawEnv() { //draw score and level fields, start-stop button, 
	jc.start( 'canvas', true );
	jc.rect( { x: 0, y: 0, width: W, height: 50, color: '#002', fill: 1 } ).level( 1 );
	jc.line( { points: [[0, 50], [W, 50]], color: '#f00', fill: 0 } ).lineStyle( { lineWidth: 2 } ).level( 2 );
	jc.text( { string: "Start", x: 24, y: 32, color: '#f00', fill: 1 } ).font( "22px Times New Roman" )
		.id( "label" ).name( "start_stop" ).level( 2 );
	//bind event handlers to start-stop button:  
	jc.rect( { x: 10, y: 10, width: 70, height: 30, color: '#f00' } ).lineStyle( { lineWidth: 2 } ).level( 3 ).name( "start_stop" )
		.click( function () {
			if ( gameOver ) {
				restart();
				startGame();
				return;
			}
			if ( !gameStarted ) {
				//gameStarted = true;
				startGame();
				//jc("#label").string("Stop");
			}
			else {
				//gameStarted = false;
				stopGame();
				//jc("#label").string("Start");
			}
		} )
		.mouseover( function () { jc( ".start_stop" ).color( '#0f0' ); } )
		.mouseout( function () { jc( ".start_stop" ).color( '#f00' ); } )
		.mousedown( function () { jc( ".start_stop" ).color( '#ca0' ); } )
		.mouseup( function () { jc( ".start_stop" ).color( '#0f0' ); } );
	jc.text( { string: "Score: ", x: 86, y: 20, color: '#f00', fill: 1 } ).font( "18px Times New Roman" ).level( 2 );
	jc.text( { string: "Level: ", x: 86, y: 40, color: '#f00', fill: 1 } ).font( "18px Times New Roman" ).level( 2 );
	jc.text( { string: score, x: 136, y: 20, color: '#0f0', fill: 1 } ).id( "score" ).font( "18px Times New Roman" ).level( 2 );
	jc.text( { string: level, x: 136, y: 40, color: '#0f0', fill: 1 } ).id( "level" ).font( "18px Times New Roman" ).level( 2 );
	for ( var i = 0; i < lifes; i++ ) {
		lifesArr[i] = jc.rect( { x: 235, y: ( i + 1 ) * 3 + 13 * i, width: 10, height: 10, color: '#f00', fill: 1 } )
			.level( 2 ).name( "lifes" );
	}
	drawCar();
}

function drawCar() { //draw car details
	jc.rect( { x: ( W - 12 ) / 2, y: H - 50, width: 12, height: 50, color: '#f00', fill: 1 } ).level( 0 ).name( "car" );
	jc.rect( { x: ( W - 28 ) / 2, y: H - 42, width: 28, height: 10, color: '#000', fill: 1 } ).level( -1 ).name( "car" );
	jc.rect( { x: ( W - 36 ) / 2, y: H - 12, width: 36, height: 12, color: '#000', fill: 1 } ).level( -1 ).name( "car" );
}

function startGame() {
	if ( gameStarted )
		return;
	gameStarted = true;
	timeoutID = setTimeout( "randomizeBlocks()", 50 );
	jc( "#label" ).string( "Stop" );
	$.each( jc( ".blocks" ).elements, function () {
		animateBlock.call( this );
	} );
}

function stopGame() {
	if ( !gameStarted )
		return;
	gameStarted = false;
	clearTimeout( timeoutID );
	$.each( jc( ".blocks" ).elements, function () {
		this.stop();
	} );
	$.each( jc( ".car" ).elements, function () {
		this.stop();
	} );
	jc( "#label" ).string( "Start" );
}

function animateLeft() { //moving car to the left
	//for each 100 pixels - 150 millisecs
	var time = jc( ".car" ).elements[0].position().x * 1.5;
	this.animate( { x: 18 - this.attr( 'width' ) / 2, y: this.position().y }, time );
}

function animateRight() { //moving car to the right
	//for each 100 pixels - 150 millisecs
	var time = ( 250 - jc( ".car" ).elements[0].position().x ) * 1.5;
	this.animate( { x: 250 - this.attr( 'width' ) / 2 - 18, y: this.position().y }, time );
}

function randomizeBlocks() {
	var w = Math.round( Math.random() * 15 + 20 );
	var h = w;
	var x = Math.round( Math.random() * ( W - w ) );
	var y = -h;
	if ( jc( ".blocks" ).elements.length == 0 )
		drawBlock( x, y, w, h, '#f0f' );
	else {
		for ( var i = 0; i < jc( ".blocks" ).elements.length; i++ ) {
			if ( jc( ".blocks" ).elements[i].position().y - y - h < 200 )
				break;
			else if ( i == jc( ".blocks" ).elements.length - 1 )
				drawBlock( x, y, w, h, '#f0f' );
		}
	}
	//console.log('s');		    
	var res = isCrash( jc( ".blocks" ).elements, jc( ".car" ).elements );
	if ( res.crash ) {
		jc( ".blocks" ).elements[res.blockI].del();
		// console.log(lifes);
		decLifes();
		if ( lifes > 0 )
			setTimeout( "blinkCar(jc(\".car\").elements ,1)", 50 );
		else {
			jc( ".car" ).del();
			jc( ".blocks" ).del();
			stopGame();
			blinkText.call( jc.text( { string: "GAME OVER", x: 40, y: 200, color: '#f00' } )
				.font( '30px Times New Roman' ).level( 5 ).id( "game_over" )
			);
			jc( "#label" ).string( "Start" );
			jc.text( { string: "You can save your result and restart", x: 20, y: 230, color: '#00f' } )
				.font( '16px TimesNew Roman' )
				.id( "help" )
				.level( 5 );
			gameOver = true;
			crashX = res.x;
			if ( score > 0 ) {
				/* $("#gamer").removeClass("not_visible").addClass("help_content");
				 $("#gamer > #login").val(userLogin);*/
				checkMustBeSaved();
			}
			explode( res.x, res.y );
		}
		//return;
	}
	if ( lifes > 0 )
		timeoutID = setTimeout( "randomizeBlocks()", 50 );
}

function drawBlock( x, y, w, h, clr ) {
	animateBlock.call(
		jc.rect( { x: x, y: y, width: w, height: h, color: clr, fill: 1 } )
			.name( "blocks" )
			.level( 0 )
	);
}

function isCrash( b, c ) { //check if car crashes to some block
	var m = { crash: false, x: -1, y: -1, blockI: -1 };
	var res;
	var m1 = [], m2 = [];
	for ( var i = 0; i < 4; i++ ) {
		m1[i] = [];
		m2[i] = [];
	}
	for ( var i = 0; i < b.length; i++ ) {
		m1[0][0] = m1[3][0] = b[i].attr( 'x' ); m1[0][1] = m1[1][1] = b[i].attr( 'y' );
		m1[1][0] = m1[2][0] = m1[0][0] + b[i].attr( 'width' ); m1[2][1] = m1[3][1] = m1[0][1] + b[i].attr( 'height' );
		for ( var j = 0; j < c.length; j++ ) {
			m2[0][0] = m2[3][0] = c[j].attr( 'x' ); m2[0][1] = m2[1][1] = c[j].attr( 'y' );
			m2[1][0] = m2[2][0] = m2[0][0] + c[j].attr( 'width' ); m2[2][1] = m2[3][1] = m2[0][1] + c[j].attr( 'height' );
			res = isCrosses( m1, m2 );
			if ( res.crash ) {
				m.crash = true;
				m.x = res.x;
				m.y = res.y;
				m.blockI = i;
				return m;
			}
		}
	}
	return m;
}

function isCrosses( b, d ) {
	var res;
	var m1, m2, d1, d2;
	for ( var i = 0; i < b.length; i++ ) {
		m1 = b[i];
		if ( i < b.length - 1 )
			m2 = b[i + 1];
		else
			m2 = b[0];
		for ( var j = 0; j < d.length; j++ ) {
			d1 = d[j];
			if ( j < d.length - 1 )
				d2 = d[j + 1];
			else
				d2 = d[0];
			res = isLinesCrossing( [m1, m2], [d1, d2] );
			if ( res.cross )
				return { crash: true, x: res.x, y: res.y };
		}
	}
	return { crash: false, x: -1, y: -1 };
}

function isLinesCrossing( l1, l2 ) {
	var k1 = ( l1[1][1] - l1[0][1] ) / ( l1[1][0] - l1[0][0] );
	var k2 = ( l2[1][1] - l2[0][1] ) / ( l2[1][0] - l2[0][0] );
	var b1 = ( l1[1][0] * l1[0][1] - l1[0][0] * l1[1][1] ) / ( l1[1][0] - l1[0][0] );
	var b2 = ( l2[1][0] * l2[0][1] - l2[0][0] * l2[1][1] ) / ( l2[1][0] - l2[0][0] );
	var x0, y0;
	if ( Math.abs( k1 - k2 ) < 0.005 ) //lines is parallel
		return { cross: false, x: -1, y: -1 };
	else if ( l1[0][0] == l1[1][0] ) { //firts line is perpendicular to Ox
		x0 = l1[0][0];
		y0 = k2 * x0 + b2;
		if ( y0 >= l1[0][1] && y0 <= l1[1][1] && isPointOnLine( [x0, y0], l2 ) )
			return { cross: true, x: x0, y: y0 }
	} else if ( l2[0][0] == l2[1][0] ) { //second line is perpendicular to Ox
		x0 = l2[0][0];
		y0 = k1 * x0 + b1;
		if ( y0 >= l2[0][1] && y0 <= l2[1][1] && isPointOnLine( [x0, y0], l1 ) )
			return { cross: true, x: x0, y: y0 }
	} else {
		x0 = ( b2 - b1 ) / ( k1 - k2 );
		y0 = k1 * x0 + b1;
		if ( isPointOnLine( [x0, y0], l1 ) && isPointOnLine( [x0, y0], l2 ) )
			return { cross: true, x: x0, y: y0 };
	}
	return { cross: false, x: -1, y: -1 };
}

function isPointOnLine( pt, l ) {
	var p = ( pt[0] - l[1][0] ) / ( l[0][0] - l[1][0] );
	if ( p >= 0 && p <= 1 ) {
		var s = p * l[0][1] + ( 1 - p ) * l[1][1];
		if ( Math.abs( s - pt[1] ) <= 3 )
			return true;
	}
	return false;
}

function animateBlock() {
	var time = ( H - this.position().y ) * 8000 / ( H * ( level + 1 ) );
	this.animate( { x: this.position().x, y: H }, time, function () {
		this.del();
		jc( "#score" ).string( parseInt( jc( "#score" ).string() ) + ( 2 * level + 10 ) );
		score += ( 2 * level + 10 );
		var k, m;
		m = Math.log( 300 / 130 );
		k = 300 / Math.exp( 2 * m );
		if ( score >= k * Math.exp( m * level ) + 30 * ( level + 1 ) ) {
			stopGame();
			jc.text( { string: "LEVEL UP!", x: 40, y: 200, color: '#f00' } )
				.font( '30px Times New Roman' )
				.id( "levelUpText" );
			levelUp = true;
			prevScore = score;
			setTimeout( "level_up()", 100 );
		}
	} );
}

function restart() {
	if ( gameOver ) {
		gameOver = false;
	}
	jc.clear();
	level = 0;
	score = 0;
	lifes = 3;
	if ( $( "#gamer" ).hasClass( 'help_content' ) ) {
		$( "#gamer" ).removeClass( 'help_content' ).addClass( 'not_visible' );
	}
	drawEnv();
}

function explode( x, y ) {
	for ( var i = 0; i < 3000; i++ ) {
		var R = Math.round( Math.random() * 40 + 10 );
		var alpha = Math.round( Math.random() * 360 ) * Math.PI / 180;
		var fx = x + R * Math.cos( alpha ), fy = y + R * Math.sin( alpha );
		var time = Math.random() * 2000 + 4000;
		jc.circle( { x: x, y: y, radius: 2, color: '#ff0', fill: 1 } )
			.animate( { x: fx, y: fy, color: '#f00' }, time, function () {
				var x = crashX + ( 0.5 - Math.random() * 40 );
				this.color( '#ff0' ).translateTo( x, H );
				blame.call( this );
			} );
	}
}

function blame() {
	var y = H - Math.random() * 100;
	var dx = ( 0.5 - Math.random() ) * 20;
	var time = Math.random() * 500 + 700;
	this.animate( { x: crashX + dx, y: y, color: '#f00', radius: 1.3 }, time, function () {
		blame.call( this.color( '#ff0' ).translateTo( this.position().x, H ) );
	} );
}

function level_up() {
	if ( score < prevScore + 30 * ( level + 1 ) ) {
		score += 2 * ( level + 1 );
		jc( "#score" ).string( score );
		setTimeout( "level_up()", 100 );
	}
	else {
		level++;
		if ( level == 10 ) {
			alert( "You win!" );
			$( "#gamer" ).show( "fast" );
			restart();
		}
		levelUp = false;
		jc( "#level" ).string( level );
		jc( "#levelUpText" ).del();
		startGame();
	}
}

function blinkText() {
	var r = this.color()[0];
	var g = this.color()[1];
	var b = this.color()[2];
	var a = 1 - this.color()[3];
	this.animate( { color: 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')' }, 1500, function () {
		blinkText.call( this );
	} );
}

function blinkCar( elems, t ) {
	if ( t > 20 )
		return;
	$.each( elems, function () {
		var r = this.color()[0];
		var g = this.color()[1];
		var b = this.color()[2];
		var a = 1 - this.color()[3];
		this.color( 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')' );
	} );
	setTimeout( function () { blinkCar( jc( ".car" ).elements, t + 1 ); }, 50 );
}


function decLifes() {
	lifes--;
	lifesArr[2 - lifes].del();
}
