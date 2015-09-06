/**************************************************************
******Main Script - Developed by: Daniele Genta - Summer 2015********
***************************************************************/
var nowPlaying = "white";
var playerName1, playerName2;
var selectedTimerMode;
var isRotable;
var buffer;

var isHighlighting = false;
var Interval;
var chrono;

var kingPossiblePositions[];

$(document).ready(function()
{
	//Initialize the project
	init();
	$("#tabs").tabs();
	$("#tabs-info").tabs();

	//Events 
	$("#btnStart").click(function(){

		//save the names of the players
		playerName1 = $("#txtNamePlayer1").val();
		if (playerName1 == "")
			playerName1 = "Player 1";
		playerName2 = $("#txtNamePlayer2").val();
		if (playerName2 == "")
			playerName2 = "Player 2";
		alert("Benvenuti: "+playerName1+" e "+playerName2);

		//Fill the stats table
		$("#playerOne-Name").html(playerName1);
		$("#playerTwo-Name").html(playerName2);

		showIntroPageOptions();
	});
	$("#btnStartGame").click(function(){
		gameStart();
	});

	//Enter key on name page
	$( 'form' ).bind('keypress', function(e){
   		if ( e.keyCode == 13 ) {
     		$( this ).find( 'input[type=submit]:first' ).click();
     		alert("Clicca sul bottone per settare le impostazioni della partita")
   		}
 	});

    // Switch Click
	$('.Switch').click(function() {
		
		// Check If Enabled (Has 'On' Class)
		if ($(this).hasClass('On'))
		{
			// Try To Find Checkbox Within Parent Div, And Check It
			$(this).parent().find('input:checkbox').attr('checked', true);
			// Change Button Style - Remove On Class, Add Off Class
			$(this).removeClass('On').addClass('Off');
		}
		else
		{ 
			// If Button Is Disabled (Has 'Off' Class)
			// Try To Find Checkbox Within Parent Div, And Uncheck It
			$(this).parent().find('input:checkbox').attr('checked', false);
			// Change Button Style - Remove Off Class, Add On Class
			$(this).removeClass('Off').addClass('On');	
		}	
	});
		
	// Loops Through Each Toggle Switch On Page
	$('.Switch').each(function() {
		// Search of a checkbox within the parent
		if ($(this).parent().find('input:checkbox').length){
			// If checkbox doesnt have the show class then hide it
			if (!$(this).parent().find('input:checkbox').hasClass("show")){ $(this).parent().find('input:checkbox').hide(); }
			// Comment / Delete out the above line when using this on a real site
			
			// Look at the checkbox's checkked state
			if ($(this).parent().find('input:checkbox').is(':checked')){
				// Checkbox is not checked, Remove the 'On' Class and Add the 'Off' Class
				$(this).removeClass('On').addClass('Off');	
			} 
			else 
			{ 
				// Checkbox Is Checked Remove 'Off' Class, and Add the 'On' Class
				$(this).removeClass('Off').addClass('On');	
			}	
		}
	});

	$("ul li").click(function(e) {
		  if ($(this).hasClass('slider')) {
		    return;
		  }
		  var whatTab = $(this).index();
		  var howFar = 160 * whatTab;
		  $(".slider").css({
		    left: howFar + "px"
		  });
		  $(".ripple").remove();
		  var posX = $(this).offset().left,
		      posY = $(this).offset().top,
		      buttonWidth = $(this).width(),
		      buttonHeight = $(this).height();
		  $(this).prepend("<span class='ripple'></span>");
		  if (buttonWidth >= buttonHeight) {
		    buttonHeight = buttonWidth;
		  } else {
		    buttonWidth = buttonHeight;
		  }
		  var x = e.pageX - posX - buttonWidth / 2;
		  var y = e.pageY - posY - buttonHeight / 2;
		  $(".ripple").css({
		    width: buttonWidth,
		    height: buttonHeight,
		    top: y + 'px',
		    left: x + 'px'
		  }).addClass("rippleEffect");
	});

	//Resizable property
    $("#main-board").resizable({
    	//top handler
      	 handles: {
        'sw': '#swgrip',
    },
    //Aspect ratio keep the board squared
    aspectRatio: 1 / 1,
      maxHeight: 1000,
      maxWidth: 1000,
      minHeight: 500,
      minWidth: 500
    });
});




//Initialize the page 
function init()
{
	$("#game-page").hide();
	$("#intro-page-options").hide();

	//Slider activation
	$(function($) {
  		var slider = $("#slider").slideReveal({
  		trigger: $("#trigger"),
  		position: "right"
  		});
	});
}

//Dynamic creation of the chess board 
function createBoard()
{
	var i, j, mainBoardCell, mainBoardDragCell, mainBoardDragCellClass, mainBoardCellClass, colorBlack;

	//Alternate the colors on the board
	colorBlack = false;

	mainBoardDragCellClass = "main-board-drag-cell";
	//Chess board: 8x8
	for (i = 0; i < 8; i++) 
	{	
		for (j = 0; j < 8; j++) 
		{
			if (colorBlack)
    			mainBoardCellClass = "main-board-cell-black";
    		else
    			mainBoardCellClass = "main-board-cell-white";
    		//First coloured layer
    		createCell("#main-board", mainBoardCellClass, i+""+j);
    		//Second transparent layer
    		createCell("#"+i+""+j, mainBoardDragCellClass, "d"+i+""+j);
        	asignCellImageO(i,j);
        	colorBlack = !colorBlack;
		}
		colorBlack = !colorBlack;
    }    
}

//Create a cell of the board dinamically
function createCell(cellAppendTo, cellClass, id)
{
	var cell, timer, allowHighlight;

	cell = $('<div />');
    cell.attr("id",id);
    cell.addClass(cellClass);
    $(cellAppendTo).append(cell);

    //setting the hover only on the first coloured layer
    var pID = id.substring(1,3);
    if (id.substring(0,1) == "d")
    {
	    $("#"+pID).hover(function ()
	    {
	    	if ($("#"+pID).children().find("img").attr("class") != undefined)
	    	{
	    		//wait 1 second to highlight the possible moves
	    		timer = setInterval(function(){ 
	    			//can the cell be highlighted?
	    			allowHighlight = checkPiece(allowHighlight, id, "", true); 
	    			if (allowHighlight)
	    			{
	    				clearInterval(timer);
	    			}
	    			else
	    				clearInterval(timer);
	    				
	    			}, 1000);
	    	}	
		}, 
		function ()
		{
	    	clearInterval(timer);
		});
	}
}

//First function used to switch the position of the piece i am going to show
function asignCellImageO(i, j)
{
	//Using the class to recognize the images - no difference between black and white queens and kings (same moves)
	//black pawns
	if (i==1)
		supportAsignCellImage(i, j, "black", "pawn");
	//white pawns
	if (i==6)
		supportAsignCellImage(i, j, "white", "pawn");
	//black towers
	if (i == 0 && (j==0 || j==7))
		supportAsignCellImage(i, j, "black", "tower");
	//white towers
	if (i == 7 && (j == 0 || j == 7))
		supportAsignCellImage(i, j, "white", "tower");
	//white horses
	if (i == 7 && (j == 1 || j == 6))
		supportAsignCellImage(i, j, "white", "horse");
	//black horses
	if (i == 0 && (j == 1 || j == 6))
		supportAsignCellImage(i, j, "black", "horse");
	//black bishops
	if (i == 0 && (j == 2 || j == 5))
		supportAsignCellImage(i, j, "black", "bishop");
	//white bishops
	if (i == 7 && (j == 2 || j == 5))
		supportAsignCellImage(i, j, "white", "bishop");
	//kings
	if ((i == 0 || i == 7) && j== 4)
	{
		if (i == 0)
			supportAsignCellImage(i, j, "black", "king");
		else
			supportAsignCellImage(i, j, "white", "king");
	}
	//queens
	if ((i == 0 || i == 7) && j== 3)
	{
		if (i == 0)
			supportAsignCellImage(i, j, "black", "queen");	
		else
			supportAsignCellImage(i, j, "white", "queen");
	}
}

//Support function which actually asign image, class and value to the pieces dinamically
function supportAsignCellImage(i, j, color, piece)
{
		$("#d"+i+""+j).html('<img src="images/set/' + color + '-' + piece +'.png">');
		if (piece == "pawn")
			$("#d"+i+""+j).find("img").attr("class", color + "-" + piece);
		else
			$("#d"+i+""+j).find("img").attr("class", piece);
		$("#d"+i+""+j).find("img").attr("value",color);
}

//Second step to start the game: set the parameters of the match
function showIntroPageOptions()
{
	$("#intro-page").hide();
	$("#intro-page-options").show();
}



//Initialize the game
function gameStart()
{
	gameConfig();

	$("#intro-page-options").hide();
	$("#game-page").show();
	$("#header-title").removeClass("header-title");
	$("#header-title").addClass("header-title-min");
	$("#whoisplaying-table-name").html(playerName1);



	//Creation of the chess boards 
	createBoard();
	//Set the function drag on the chess set
	setDrag();
	setDrop();
	//Init the timer
	manageTimer();
	//Manage chronometer
	manageChrono();
	//Play simbol in the title
	document.title = "\u25B6 Project Chess";
}

//Function which save the option selected in the intro-page-option section
function gameConfig()
{
	selectedTimerMode = $("select").val();
	if ($('#switchRotation').is(":checked"))
  	// it is checked
  		isRotable = false;
	else
		isRotable = true;

}

//Function which enable (or not) tbe timer
function manageTimer()
{
	var runTime;
	if (selectedTimerMode == "Timer 1")
 	 	runTime = 60;
	else if (selectedTimerMode == "Timer 2")
 	 	runTime = 120;
	if (selectedTimerMode != "Senza timer")
	{
 	 	$("#countdown").countdown360({
		  radius      : 60.5,
		  seconds     : runTime,
		  strokeWidth : 15,
		  fillStyle   : '#616161',
		  strokeStyle : '#424242',
		  fontSize    : 50,
		  fontColor   : '#000000',
		  autostart: false,
	  	  onComplete  : function () { manageTurn(); }
		}).start()
 	 }
}

/********************************************************************************
*************************************** Events drag, drop *************************
*********************************************************************************/

//Set the attribute draggable using jQuery
function setDrag()
{
	var i, j
	for (i = 0; i < 8; i++)
	{
		for (j=0; j<8; j++)
		{
			$("#d"+i+""+j).draggable({revert:true});
			$("#d"+i+""+j).draggable({snap:"#"+i+""+j});
			//In order not to make moves behind the cells
			$("#d"+i+""+j).draggable({stack:"#d"+i+""+j});
    		$("#d"+i+""+j).draggable( 'disable' );
		}
	}
	setDragTurn();
}

//Function that enable the drag prop only on the pieces which have the turn color
function setDragTurn()
{
	var myValue;
	for (i = 0; i < 8; i++)
	{
		for (j=0; j<8; j++)
		{
			myValue = $("#d"+i+""+j).find("img").attr("value");
			if (myValue == nowPlaying)
				$("#d"+i+""+j).draggable("enable");
			else if (myValue != undefined)
				$("#d"+i+""+j).draggable("disable");
		}
	}
}

//Function which manage the turn color and the other functions liked
function manageTurn()
{
	if (nowPlaying == "white")
	{
		$("#whoisplaying-table-name").html(playerName2);
		$("#whoisplaying-table-color-support").css("background-color", "black");
		nowPlaying = "black";
	}
	else
	{
		$("#whoisplaying-table-name").html(playerName1);
		$("#whoisplaying-table-color-support").css("background-color", "white");
		nowPlaying = "white";
	}

	setDragTurn();
	manageTimer();
	
	//manageRotation();
}

//Set all the empty cells droppable
function setDrop()
{
	var count, supportCell, pIdDrag, allowDrop;
	for (i = 0; i < 8; i++)
	{
		for (j=0; j<8; j++)
		{
			$( "#d"+i+""+j).droppable({
		    	drop: function( event, ui ) {
		    		//Saving the useful ID (Drop, Drag and parent drag)
		    		idDrop=$(this).parent().attr("id");	
		    		idDrag=ui.draggable.attr("id");
		    		pIdDrag = ui.draggable.parent().attr("id");;
		    		allowDrop = checkPiece(allowDrop, idDrag, idDrop, false);
		    		if (allowDrop == true)
		    		{
			    		//Removing the drop middle layer and adding the new layer with the image
			    		$( "#"+idDrop ).children().remove();
			    		$( "#"+idDrag).css("top","");
						$( "#"+idDrag).css("left","");
						$( "#"+idDrag).css("margin-top","");
						$( "#"+idDrag).css("margin-left","");	
			    		$("#"+idDrop).append($("#"+idDrag));
						//Updating the id    	
						var oldIdDrag = idDrag;			
						$( "#"+idDrag ).attr("id","d"+idDrop);
						$(oldIdDrag).parent().attr("id", oldIdDrag);
						//TO EDIT
						//Restore old drag father middle layer
						supportCellClass = "main-board-drag-cell";
						supportCell = $('<div />');
	    				supportCell.attr("id","d"+pIdDrag);
	    				supportCell.attr("class","middle-layer");
	    				supportCell.addClass(supportCellClass);
						$("#"+pIdDrag).append(supportCell);

						



						//Updating the history moves
						publishMove();
						//Updating the dropabble property
						setDrop();
						//Updating the turn config


						//check if the piece moved can attack the king
						rDrop = idDrop.substring(0,1);
						cDrop = idDrop.substring(1,2);
						checkKingUnderAttack(rDrop, cDrop);


						manageTurn();
					}
				}
			});
		}
	}
}

/************************************************************************
************************* Manage the pieces *******************************
*************************************************************************/

function checkPiece(allowDrop, idDrag, idDrop, justHighlight)
{
	var rowDrag = idDrag.substring(1,2);
	var columnDrag =  idDrag.substring(2,3);
	//It's about highlighting (mouse over)
	if (justHighlight == true)
	{
		var allowHighlight = false;
		var rowSource = parseInt(rowDrag);
		var columnSource = parseInt(columnDrag);
		//CHECK HIGHLIGHT
		checkHighlight(rowSource, columnSource, idDrag);

		return allowHighlight;
	}
	//It's about dropping (drag the piece)
	else
	{
		var rowDrop =  idDrop.substring(0,1);
		var columnDrop =  idDrop.substring(1,2);

		allowDrop = false;

		//Check pawns
		if ($("#"+idDrag).find("img").attr("class") == "white-pawn")
			allowDrop = checkWhitePawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
		if ($("#"+idDrag).find("img").attr("class") == "black-pawn")
			allowDrop = checkBlackPawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
		//Check kings
		if ($("#"+idDrag).find("img").attr("class") == "king")
			allowDrop = checkKingsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
		//Check queens
		if ($("#"+idDrag).find("img").attr("class") == "queen")
			allowDrop = checkQueensMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
		if ($("#"+idDrag).find("img").attr("class") == "bishop")
			allowDrop = checkBishopMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
		if ($("#"+idDrag).find("img").attr("class") == "tower")
			allowDrop = checkTowersMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
		if ($("#"+idDrag).find("img").attr("class") == "horse")
			allowDrop = checkHorsesMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, false, false);
	
		return allowDrop;
	}
}	


//Support function for highlight
function checkHighlight(rowSource, columnSource, idDrag)
{
	possibleMovesSwitcher(rowSource, columnSource, idDrag, true, false);
}

//support function for king under attack
function checkKingUnderAttack(rowPiece, columnPiece)
{
	//Step 1: Coordinate del pezzo appena spostato: ok

	//Step 2: Richiamo procedura che ricerca le possibili posizioni del pezzo dato
	var idPiece;
	idPiece = "d" + rowPiece + "" + columnPiece;
	possibleMovesSwitcher(rowPiece, columnPiece, idPiece, false, true);

}

function switcher(highlight, rowSource, columnSource, deltaRows, deltaColumns)
{
	
	if (highlight)
		supportCheckHighlight(rowSource, columnSource, deltaRows, deltaColumns);
	//else if (kingUnderAttack)
		//do sth
	//{}
}


//*********************************************************************TO OPTIMIZE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//Double function: highlight + king under attack
//Function which switch the piece and try to verify if there is an obstacle in any direction the piece could go

function possibleMovesSwitcher(rowSource, columnSource, idDrag, highlight, justKingChecking)
{
	var rowDrag = idDrag.substring(1,2);
	var columnDrag =  idDrag.substring(2,3);
	var i;

	rowSource = parseInt(rowDrag);
	columnSource = parseInt(columnDrag);

	var allow = false;

	//pawns
	if ($("#"+idDrag).find("img").attr("class") == "white-pawn")
	{
		if (checkWhitePawnsMoves(rowDrag, (rowSource - 1), columnDrag, (columnSource), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -1, 0);	
		if (checkWhitePawnsMoves(rowDrag, (rowSource - 2), columnDrag, (columnSource), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -2, 0);	
		//capturing moves
		if (checkWhitePawnsMoves(rowDrag, (rowSource - 1), columnDrag, (columnSource - 1), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -1, -1);	
		if (checkWhitePawnsMoves(rowDrag, (rowSource - 1), columnDrag, (columnSource +1), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -1, 1);

	}
	if ($("#"+idDrag).find("img").attr("class") == "black-pawn")
	{
		if (checkBlackPawnsMoves(rowDrag, (rowSource + 1), columnDrag, (columnSource),allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 1, 0);
		if (checkBlackPawnsMoves(rowDrag, (rowSource + 2), columnDrag, (columnSource), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 2, 0);

		//capturing
		if (checkWhitePawnsMoves(rowDrag, (rowSource + 1), columnDrag, (columnSource - 1), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 1, -1);
		if (checkWhitePawnsMoves(rowDrag, (rowSource + 1), columnDrag, (columnSource +1), allow, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 1, 1);
	}
	//towers
	if ($("#"+idDrag).find("img").attr("class") == "tower")
	{
		//vertical
		for (i = -8; i <= 8; i++)
		{
			if (checkTowersMoves(rowDrag, (rowSource + i), columnDrag, (columnSource), allow,highlight. justKingChecking))
				switcher(highlight, rowSource, columnSource, i, 0);
		}
		//horizontal
		for (i = -8; i <= 8; i++)
		{
			if (checkTowersMoves(rowDrag, (rowSource), columnDrag, (columnSource + i), allow,highlight, justKingChecking))
				switcher(highlight, rowSource, columnSource, 0, i);
		}
	}
	//queen
	if ($("#"+idDrag).find("img").attr("class") == "queen")
	{
		//vertical
		for (i = -8; i <= 8; i++)
		{
			if (checkQueensMoves(rowDrag, (rowSource + i), columnDrag, (columnSource), allow,highlight, justKingChecking))
				switcher(highlight, rowSource, columnSource, i, 0);
		}
		//horizontal
		for (i = -8; i <= 8; i++)
		{
			if (checkQueensMoves(rowDrag, (rowSource), columnDrag, (columnSource + i), allow,highlight, justKingChecking))
				switcher(highlight, rowSource, columnSource, 0, i);
		}
		//add oblique...
		for (i = -8; i <= 8; i++)
		{
			for (j = -8; j < 8; j++)
			{
				if (checkQueensMoves(rowDrag, (rowSource+i), columnDrag, (columnSource + j), allow,highlight, justKingChecking))
					switcher(highlight, rowSource, columnSource, i, j);
			}
		}
		for (i = 8; i >= 0; i--)
		{
			for (j = -8; j < 8; j++)
			{
				if (checkQueensMoves(rowDrag, (rowSource+i), columnDrag, (columnSource + j), allow, highlight, justKingChecking))
					switcher(highlight, rowSource, columnSource, i, j);
			}
		}
	}
	//king
	if ($("#"+idDrag).find("img").attr("class") == "king")
	{
		//vertical
		for (i = -1; i <= 1; i++)
		{
			if (checkKingsMoves(rowDrag, (rowSource + i), columnDrag, (columnSource), allow, highlight, justKingChecking))
				switcher(highlight, rowSource, columnSource, i, 0);
		}
		//horizontal
		for (i = -1; i <= 1; i++)
		{
			if (checkKingsMoves(rowDrag, (rowSource), columnDrag, (columnSource + i),allow, highlight, justKingChecking))
				switcher(highlight, rowSource, columnSource, 0, i);
		}
		//add oblique...
		for (i = -1; i <= 1; i++)
		{
			for (j = -1; j < 1; j++)
			{
				if (checkKingsMoves(rowDrag, (rowSource+i), columnDrag, (columnSource + j),allow, highlight, justKingChecking))
					switcher(highlight, rowSource, columnSource, i, j);
			}
		}
		for (i = 1; i >= 0; i--)
		{
			for (j = -1; j < 1; j++)
			{
				if (checkKingsMoves(rowDrag, (rowSource+i), columnDrag, (columnSource + j),allow, highlight, justKingChecking))
					switcher(highlight, rowSource, columnSource, i, j);
			}
		}
	}
	//bishop
	if ($("#"+idDrag).find("img").attr("class") == "bishop")
	{
		//add oblique...
		for (i = -8; i <= 8; i++)
		{
			for (j = -8; j < 8; j++)
			{
				if (checkBishopMoves(rowDrag, (rowSource+i), columnDrag, (columnSource + j),allow, highlight, justKingChecking))
					switcher(highlight, rowSource, columnSource, i, j);
			}
		}
		for (i = 8; i >= 0; i--)
		{
			for (j = -8; j < 8; j++)
			{
				if (checkBishopMoves(rowDrag, (rowSource+i), columnDrag, (columnSource + j),allow, highlight, justKingChecking))
					switcher(highlight, rowSource, columnSource, i, j);
			}
		}
	}
	//horse (special moces)
	if ($("#"+idDrag).find("img").attr("class") == "horse")
	{
		if (checkHorseOblique(rowDrag, (rowSource - 2), columnDrag, (columnSource - 1), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -2, -1);
		if (checkHorseOblique(rowDrag, (rowSource - 2), columnDrag, (columnSource +1), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -2, 1);
		if (checkHorseOblique(rowDrag, (rowSource + 2), columnDrag, (columnSource + 1), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 2, 1);
		if (checkHorseOblique(rowDrag, (rowSource + 2), columnDrag, (columnSource -1), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 2, -1);

		if (checkHorseOblique(rowDrag, (rowSource + 1), columnDrag, (columnSource +2), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 1, 2);
		if (checkHorseOblique(rowDrag, (rowSource + 1), columnDrag, (columnSource - 2), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, 1, -2);
		if (checkHorseOblique(rowDrag, (rowSource - 1), columnDrag, (columnSource +2), 4, highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -1, 2);
		if (checkHorseOblique(rowDrag, (rowSource-1), columnDrag, (columnSource-2), 4,highlight, justKingChecking))
			switcher(highlight, rowSource, columnSource, -1, -2);
	}
}

//Function which actually highlight the selected cell
function supportCheckHighlight(rowSource, columnSource, deltaRows, deltaColumns)
{
	var rowH = parseInt(rowSource);
	var colH = parseInt(columnSource);
	var dRowH = parseInt(deltaRows);
	var dColH = parseInt(deltaColumns);

	rowH += dRowH;
	colH += dColH;

	//finding my color
	myColor = $("#d"+rowSource+columnSource).find("img").attr("value");
	//just highlight the player who is playing now
	if (myColor == nowPlaying)
	{
		if  (rowH >= 0 && rowH <= 7 && colH >= 0 && colH <= 7 )
		{
			var idHighlight = "#d" + rowH + "" + colH;
			$(idHighlight).effect("highlight");
			allowHighlight = true;
		}
	}
}


//Allow the drop of a white pawn
//to optimize
function checkWhitePawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking) //TO EDIT
{

	allowDrop = false;
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	//If is the 1st move (can move 2 cells)
	if (rowDrag == "6")
	{
		nMoves = 2;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false, justHighlight, justKingChecking))
			allowDrop = true;
		else if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
			allowDrop = true;
	}
	//if it isn't the 1st move
	else
	{
		nMoves = 1;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false, justHighlight, justKingChecking))
			allowDrop = true;
		else if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
			allowDrop = true;
	}

	return allowDrop;
}

//Allow the drop of a white pawn
//to edit
function checkBlackPawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking) //TO EDIT
{
	allowDrop = false;
	var nMoves;

	//If is the 1st move (can move 2 cells)
	if (rowDrag == "1")
	{
		nMoves = 2;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, false, true, false, false, justHighlight, justKingChecking))
			allowDrop = true;
		else if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
			allowDrop = true;
	}
	//if it isn't the 1st move
	else
	{
		nMoves = 1;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, false, true, false, false, justHighlight, justKingChecking))
			allowDrop = true;
		else if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
			allowDrop = true;
	}
	
	return allowDrop;
}

//Allow the drop of the kings
function checkKingsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking) //TO EDIT
{
	allowDrop = false;

	nMoves = 1;
	if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, true, true, true, justHighlight, justKingChecking))
		allowDrop = true;
	if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
		allowDrop = true;
	
	return allowDrop;
}

function checkBishopMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking)
{
	allowDrop = false;
	nMoves = 8;
	if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
		allowDrop = true;

	return allowDrop;

}

function checkTowersMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking)
{
	allowDrop = false;
	nMoves = 8;
	if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, true, true, true, justHighlight, justKingChecking))
		allowDrop = true;

	return allowDrop;
}

function checkQueensMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking)
{
	allowDrop = false;
	nMoves = 8;
	if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, true, true, true, justHighlight, justKingChecking))
		allowDrop = true;
	else if (checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
		allowDrop = true;

	return allowDrop;
}

function checkHorsesMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop, justHighlight, justKingChecking)
{
	allowDrop = false;
	nMoves = 4;
	if (checkHorseOblique(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, justHighlight, justKingChecking))
		allowDrop = true;

	return allowDrop;
}

/************************************************************************************
********* Functions which help with the generic moves (each piece use these functions)
*************************************************************************************/

//Function that unify UP, DOWN, LEFT and RIGHT checking moves
function checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves, canGoUp, canGoDown, canGoLeft, canGoRight, justHighlight, justKingChecking)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	//find my color
	var myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
	var myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));
	i = 1;
	safetyReturn = true;
	while (i <= howManyMoves)
	{
		//all the pieces calling this functions can go up
		if (canGoUp && (columnSource == columnDest) && rowSource > rowDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "up", i, myClass, justHighlight, justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "up", i, justKingChecking))
					return true;
			}			
		}
		if (canGoDown && (columnSource == columnDest) && rowSource < rowDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "down", i, myClass, justHighlight,justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "down", i, justKingChecking))
					return true;
			}
		}
		if (canGoLeft && (rowSource == rowDest) && columnSource > columnDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "left", i, myClass, justHighlight, justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "left", i, justKingChecking))
					return true;
			}
		}
		if (canGoRight && (rowSource == rowDest) && columnSource < columnDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "right", i, myClass, justHighlight,justKingChecking))
				safetyReturn = false;
			else
			{

				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "right", i, justKingChecking))
					return true;
			}
		}
		if (safetyReturn == false)
			return false;
		i++;
	}
	//Safety
	return false;
}

//First function used to switch which obstacle i am headed to
function isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, destination, delta, myClass, justHighlight, justKingChecking)
{
	var obstacleValue, obstacleClass;

	switch (destination)
	{
		case "up":
			if (supportObstacle((rowSource - delta), columnSource, rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight,justKingChecking))
				return true;
			break;
		case "down":
			if (supportObstacle((rowSource + delta), columnSource, rowDest, columnDest, myValue, myClass,rowSource, columnSource, justHighlight, justKingChecking))
				return true;
			break;
		case "left":
			if (supportObstacle(rowSource, (columnSource - delta), rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking))
				return true;
			break;
		case "right":
			if (supportObstacle(rowSource, (columnSource + delta), rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking))
				return true;
			break;
	}
	return false;
}

//Function which actually analyze the obstacle and manage the moves
function supportObstacle(rowObstacle, columnObstacle, rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking)
{
	obstacleValue = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("value"));
	obstacleClass = ($("#d"+(rowObstacle)+""+columnObstacle).find("img").attr("class"));
	obstacleID = "#d"+rowObstacle+""+columnObstacle;
	if (obstacleValue == myValue)			
		return true;
	if ((myClass == "white-pawn" || myClass == "black-pawn") && obstacleValue != myValue && obstacleValue != undefined)
		return true;
	if (obstacleValue != undefined)
	{
			if (justHighlight == false && justKingChecking == false)
			{
				capturePiece(obstacleID);
				appendToGraveyard(obstacleID);
				//Register complex move - capturing piece
				registerSimpleMove(rowDest, columnDest,rowSource, columnSource, true);
				return false;
			}
	}
	if (justHighlight == false && justKingChecking == false)
	{
		//if there are no obstacle, i register a simple move
		registerSimpleMove(rowDest, columnDest,rowSource, columnSource, false);
		return false;
	}
	else
		return false;
}

//First function used to switch which direction i am headed to
function checkDestination(rowSource, rowDest, columnSource, columnDest, destination, delta, justKingChecking)
{
	rowSourceI = parseInt(rowSource);
	rowDestI = parseInt(rowDest);
	columnSourceI = parseInt(columnSource);
	columnDestI = parseInt(columnDest);

	switch (destination)
	{
		case "up":
			if (supportDestination(rowSourceI - delta, columnSourceI, rowDestI, columnDestI, justKingChecking))
				return true;
			break;
		case "down":
			if (supportDestination(rowSourceI + delta, columnSourceI, rowDestI, columnDestI, justKingChecking))
				return true;
			break;
		case "left":
			if (supportDestination(rowSourceI, columnSourceI - delta, rowDestI, columnDestI, justKingChecking))
				return true;
			break;
		case "right":
			if (supportDestination(rowSourceI, columnSourceI + delta, rowDestI, columnDestI, justKingChecking))
				return true;
			break;
	}
	return false;
}

//Is it the right spot? ok make the move
function supportDestination(rowNow, columnNow, rowDest, columnDest, justKingChecking)
{
	if (!justKingChecking)
	{
		if (rowNow == rowDest && columnNow == columnDest)									
			return true;
		return false;
	}
	else 
	{
		if (rowNow <= 8 && rowNow >= 0 && columnNow <= 8 && columnNow >= 0)
		{
			idDest = "#d" + rowNow + "" + columnNow;
			if ($(idDest).find("img").attr("class") == "king")
			{
				$(idDest).effect("highlight", {color: '#F44336'}, 3000)
					return true;
			}
			return false;
		}
	}
}

/*
* Function that unify the oblique controls      ************************************************************unify check obstacle, check destination!
*/
function checkMoveOblique(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves, justHighlight, justKingChecking)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);
	var myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
	var myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));
	var safetyReturn = true;

	i = 1;
	while (i <= howManyMoves)
	{
	//all the pieces calling this functions can go up
		
	//up left
		if (columnSource > columnDest && rowSource > rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "ul", i, myValue, myClass, justHighlight, justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "ul", i,justKingChecking))
					return true;
			}		
		}
		//up right
		if (columnSource < columnDest && rowSource > rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "ur", i, myValue, myClass, justHighlight, justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "ur", i,justKingChecking))
					return true;
			}			
		}
		//down left
		if (columnSource > columnDest && rowSource < rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "dl", i, myValue, myClass, justHighlight, justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "dl",i, justKingChecking, justKingChecking))
					return true;
			}			
		}
		//down right
		if (columnSource < columnDest && rowSource < rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "dr", i, myValue, myClass, justHighlight, justKingChecking))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "dr", i, justKingChecking))
					return true;
			}			
		}

		if (safetyReturn == false)
			return false;	
		i++;
	}
	return false;
}

//First function used to detect the obstacle switching the destination
function isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, destination, delta, myValue, myClass, justHighlight, justKingChecking)
{
	switch (destination)
	{
		case "ul":
			 if (supportObstacleOblique((rowSource - i), (columnSource - i), rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking))
			 	return true;
		break;

		case "ur":
			if (supportObstacleOblique((rowSource - i), (columnSource + i), rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking))
				return true;
		break;

		case "dl":
			if (supportObstacleOblique((rowSource + i), (columnSource - i), rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking))
				return true;
		break;

		case "dr":
			if (supportObstacleOblique((rowSource + i), (columnSource +i), rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight,justKingChecking))
				return true;
		break;
	}
	return false;
}

//Support function which actually detect the obstacle
function supportObstacleOblique(rowObstacle, columnObstacle, rowDest, columnDest, myValue, myClass, rowSource, columnSource, justHighlight, justKingChecking)
{
	var obstacleValue = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("value"));
	var obstacleClass = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("class"));
	var obstacleID = "#d"+(rowObstacle)+""+columnObstacle;
	var myID = "#d"+rowSource+""+columnSource;

	if (obstacleValue == myValue)		
		return true;
	if (obstacleClass == undefined && (myClass == "white-pawn" || myClass == "black-pawn") && justHighlight == true)
	{
		return true;
	}
		
	if (obstacleValue == undefined && (myClass == "white-pawn" || myClass == "black-pawn"))
		return true;	

	if (justHighlight == false && justKingChecking == false)
	{	
		if (obstacleValue != undefined)
		{
			capturePiece(obstacleID);
			appendToGraveyard(obstacleID);
			
			registerSimpleMove(rowDest, columnDest, rowSource, columnSource, true);
			return false;
			
		}
		registerSimpleMove(rowDest, columnDest, rowSource, columnSource, false);
		return false;
	}	

	return false;
}

//First function which detect the destination
function checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, destination, delta, justKingChecking)
{
	switch (destination)
	{
		case "ul":
			 if (supportDestination((rowSource - i), (columnSource - i), rowDest, columnDest, justKingChecking))
			 	return true;
		break;
		case "ur":
			if (supportDestination((rowSource - i), (columnSource + i), rowDest, columnDest, justKingChecking))
				return true;
		break;
		case "dl":
			if (supportDestination((rowSource + i), (columnSource - i), rowDest, columnDest, justKingChecking))
				return true;
		break;
		case "dr":
			if (supportDestination((rowSource + i), (columnSource +i), rowDest, columnDest, justKingChecking))
				return true;
		break;
	}
	return false;
}
/************************************END TO OPTIMIZE*************************************************/
/*
*	The horse have a particular system of moving, have to use a different function
*/
function checkHorseOblique(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves, justHighlight, justKingChecking)
{	
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);
	var r, c;
	//Each combination of the horse moves have a deltaR and a deltaC between -2 and 2
	for (r = -2; r <= 2; r++)
	{
		for (c = -2; c <= 2; c++)
		{
			if (r != 0 && c != 0)
			{
				if (minimizeHorse(r, c, rowSource, rowDest, columnSource, columnDest, justHighlight, justKingChecking))
					return true;
			}
		}
	}
	return false;
}

/*
* Help to move the horse in a optimized way
*/
function minimizeHorse(deltaRows, deltaColumns, rowSource, rowDest, columnSource, columnDest, justHighlight, justKingChecking)
{
	var myID = "#d"+rowSource+""+columnSource;
	var obstacleID = ($("#d"+(rowSource - deltaRows)+""+(columnSource - deltaColumns)).find("img").attr("id"));
	var obstacleValue = ($("#d"+(rowSource - deltaRows)+""+(columnSource - deltaColumns)).find("img").attr("value"));
	var myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
	var allowKingUnderAttack;

	if (obstacleValue == myValue)
		return false;
	else if ((rowSource == rowDest+deltaRows) && (columnSource == columnDest + deltaColumns))
	{
		if (obstacleValue != undefined)
		{
			if (justHighlight == false && justKingChecking == false)
			{
				capturePiece(obstacleID);
				appendToGraveyard(obstacleID);
				registerSimpleMove(rowDest, columnDest, rowSource, columnSource, true);
				return true;
			}
			else if (justKingChecking == true)
			{
				supportDestination((rowSource - deltaRows), (columnSource - deltaColumns), rowDest, columnDest, true);
				return true;
			}
			return true;
				
		}	
		else if (obstacleValue == undefined)
		{
			if (justHighlight == false && justKingChecking == false)
			{
				registerSimpleMove(rowDest, columnDest, rowSource, columnSource, false);
				return true;
			}
			return true;
		}
	}	
	return false;
}

/*
* Function that manage the capturing of a piece
*/
function capturePiece(idCaptured)
{
	if ($(idCaptured).find("img").attr("class") == "king")
	{
		alert("Fine partita");	
		alert("Clicca OK per iniziare una nuova partita!");	
		location.reload();
	}
		
}

//Function which send the captured piece to the right graveyard
function appendToGraveyard(id)
{
	var value = ($(id).find("img").attr("value"));
	var piecesCaptured;

	if (value == "white")
	{
		$("#black-graveyard").append(($(id).find("img")));
		piecesCaptured = parseInt($("#playerTwo-TotalCapturedPiece").html());
		piecesCaptured += 1;
		piecesCaptured = $("#playerTwo-TotalCapturedPiece").html(piecesCaptured);
	}
		
	else if (value == "black")
	{
		$("#white-graveyard").append(($(id).find("img")));	
		piecesCaptured = parseInt($("#playerOne-TotalCapturedPiece").html());
		piecesCaptured += 1;
		piecesCaptured = $("#playerOne-TotalCapturedPiece").html(piecesCaptured);
	}
}

//**************************************************************************************WORK IN PROGRESS********************************************************

//Function that save the move
function registerSimpleMove(rowDrop, columnDrop, rowSource, columnSource, capturing)
{
	var rowDest = parseInt(rowDrop);
	var columnDest = parseInt(columnDrop);
	var myID = "#d"+rowSource+""+columnSource;
	var myValue = $(myID).find("img").attr("value");

	var register = "";

	//Using source coordinates beacause the piece hasn't been moved yet 
	if (myValue == "black")
		register = "...";
	register += identifyPiece(myID);
	if (capturing == true)
		register += "x";
	register += findCoordinates(rowDest, columnDest)

	buffer = register;
}


//Function that publish the move saved // moves history
function publishMove()
{
	$("#slider").append("<p>"+buffer+"<\p>");
}

//Function that helps me to find the x and y official alias for the coordinates // moves history
function findCoordinates(row, column)
{
	var cX, cY, coordinates = "";

	//Column conversion
	if (column == 0)
		cX = "a";
	else if (column == 1)
		cX = "b";
	else if (column == 2)
		cX = "c";
	else if (column == 3)
		cX = "d";
	else if (column == 4)
		cX = "e";
	else if (column == 5)
		cX = "f";
	else if (column == 6)
		cX = "g";
	else if (column == 7)
		cX = "h";
	//Row conversion (official notation is the opposite of my notation)
	cY = 8 - row;

	coordinates = cX + "" + cY;

	return coordinates;
}

//Function that helps me to find the official acronymous of the pieces
function identifyPiece(id)
{
	var retVal = "";
	var myClass = $(id).find("img").attr("class");
	
	if (myClass != "black-pawn" && myClass != "white-pawn")
	{
		if (myClass == "queen")
			retVal = "D";
		else if (myClass == "king")
			retVal = "R";
		else if (myClass == "horse")
			retVal = "C";
		else if (myClass == "tower")
			retVal = "T"
		else if (myClass == "bishop")
			retVal = "A"
	}
	return retVal;
}

function manageChrono()
{
	timeString = "00:00";
	chrono = setInterval(function() 
	{
	    startChrono();
	},1000);
}

//Misura il tempo e lo stampa
function startChrono()
{
    var minutesDonzens = parseInt(timeString.charAt(0));
    var minutesUnits = parseInt(timeString.charAt(1));
  	var  separatoreMinSec = ":";
    var secondsDonzens = parseInt(timeString.charAt(3));
    var secondsUnits = parseInt(timeString.charAt(4));
                if(secondsUnits >= 9) {
                    secondsUnits = 0;
                    if(secondsDonzens >= 5) {
                        secondsDonzens = 0;
                        if(minutesUnits >= 9) {
                            minutesUnits = 0;
                            if(minutesDonzens >= 9)
                                clearInterval(chrono);
                            else
                                minutesDonzens++;
                        }
                        else
                            minutesUnits++;
                    }
                    else
                        secondsDonzens++;
                }
                else
                    secondsUnits++;
        //Stampo il tempo
        timeString = String(minutesDonzens) + String(minutesUnits) + String(separatoreMinSec) + String(secondsDonzens) + String(secondsUnits);
        for ( i = 0; i < timeString.length; i++ ) {
            $("#s" + i).html(timeString.charAt(i))
        }
}


//*****************************DOESNT WORK**************************
/*function manageRotation()
{
	if (isRotable == true)
	{
		$("#main-board").addClass("rotate")
		for (i = 0; i < 8; i++)
		{
			for (j=0; j<8; j++)
			{
				myValue = $("#d"+i+""+j).find("img").attr("value");
				if (myValue != undefined)
				{
				$("#d"+i+""+j).find("img").addClass("rotate");
				}
			}
		}
		$("#main-board").removeClass("rotate")
	}
}*/


//! location.reload -> ricaricare pagina, utilizzare dopo la vittoria
