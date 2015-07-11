/**************************************************************
******Script - Developed by: Daniele Genta - Summer 2015********
***************************************************************/
var nowPlaying = "white";
var playerName1, playerName2;

$(document).ready(function()
{
	//Initialize the project
	init();

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

		showIntroPageOptions();
	});
	$("#btnStartGame").click(function(){
		gameStart();
	});

	//Enter key on name page
	$( 'form' ).bind('keypress', function(e){
   		if ( e.keyCode == 13 ) {
     		$( this ).find( 'input[type=submit]:first' ).click();
     		alert("Clicca sul bottone per iniziare la partita")
   		}
 	});

	    // Switch Click
		$('.Switch').click(function() {
			
			// Check If Enabled (Has 'On' Class)
			if ($(this).hasClass('On')){
				
				// Try To Find Checkbox Within Parent Div, And Check It
				$(this).parent().find('input:checkbox').attr('checked', true);
				
				// Change Button Style - Remove On Class, Add Off Class
				$(this).removeClass('On').addClass('Off');
				
			} else { // If Button Is Disabled (Has 'Off' Class)
			
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
			
			// This just hides all Toggle Switch Checkboxs
			// Uncomment line below to hide all checkbox's after Toggle Switch is Found
			 //$(this).parent().find('input:checkbox').hide();
			
			// For Demo, Allow showing of checkbox's with the 'show' class
			// If checkbox doesnt have the show class then hide it
			if (!$(this).parent().find('input:checkbox').hasClass("show")){ $(this).parent().find('input:checkbox').hide(); }
			// Comment / Delete out the above line when using this on a real site
			
			// Look at the checkbox's checkked state
			if ($(this).parent().find('input:checkbox').is(':checked')){

				// Checkbox is not checked, Remove the 'On' Class and Add the 'Off' Class
				$(this).removeClass('On').addClass('Off');
				
			} else { 
							
				// Checkbox Is Checked Remove 'Off' Class, and Add the 'On' Class
				$(this).removeClass('Off').addClass('On');
				
			}
			
		}
		
	});



});

//Initialize the page 
function init()
{
	$("#game-page").hide();
	$("#intro-page-options").hide();
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
	var cell;

	cell = $('<div />');
    cell.attr("id",id);
    cell.addClass(cellClass);
    $(cellAppendTo).append(cell);

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

function showIntroPageOptions()
{
	$("#intro-page").hide();
	$("#intro-page-options").show();
}

//Initialize the game
function gameStart()
{
	$("#intro-page-options").hide();
	$("#game-page").show();
	$("#header-title").css({'font': '50px Helvetica, Sans-Serif'});
	$("#whoisplaying-table-name").html(playerName1);

	//Creation of the chess boards 
	createBoard();

	//Set the function drag on the chess set
	setDrag();
	setDrop();
}

/********************************************************************************
***************************************Events drag, drop*************************
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
		    		allowDrop = checkPiece(allowDrop, idDrag, idDrop);
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
					//Updating the dropabble property
					setDrop();
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

function checkPiece(allowDrop, idDrag, idDrop)
{
	var rowDrag = idDrag.substring(1,2);
	var columnDrag =  idDrag.substring(2,3);
	var rowDrop =  idDrop.substring(0,1);
	var columnDrop =  idDrop.substring(1,2);

	allowDrop = false;

	//Check pawns
	if ($("#"+idDrag).find("img").attr("class") == "white-pawn")
		allowDrop = checkWhitePawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	if ($("#"+idDrag).find("img").attr("class") == "black-pawn")
		allowDrop = checkBlackPawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	//Check kings
	if ($("#"+idDrag).find("img").attr("class") == "king")
		allowDrop = checkKingsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	//Check queens
	if ($("#"+idDrag).find("img").attr("class") == "queen")
		allowDrop = checkQueensMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	if ($("#"+idDrag).find("img").attr("class") == "bishop")
		allowDrop = checkBishopMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	if ($("#"+idDrag).find("img").attr("class") == "tower")
		allowDrop = checkTowersMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	if ($("#"+idDrag).find("img").attr("class") == "horse")
		allowDrop = checkHorsesMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop);
	
	return allowDrop;
}	

//Allow the drop of a white pawn
//to optimize
function checkWhitePawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop) //TO EDIT
{
	allowDrop = false;
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	//If is the 1st move (can move 2 cells)
	if (rowDrag == "6")
	{
		nMoves = 2;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false))
			allowDrop = true;
		else if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
			allowDrop = true;
	}
	//if it isn't the 1st move
	else
	{
		nMoves = 1;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false))
			allowDrop = true;
		else if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
			allowDrop = true;
	}
return allowDrop;
}

//Allow the drop of a white pawn
//to edit
function checkBlackPawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop) //TO EDIT
{
	allowDrop = false;

	var nMoves;

	//If is the 1st move (can move 2 cells)
	if (rowDrag == "1")
	{
		nMoves = 2;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, false, true, false, false))
			allowDrop = true;
		else if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
			allowDrop = true;
	}
	//if it isn't the 1st move
	else
	{
		nMoves = 1;
		if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, false, true, false, false))
			allowDrop = true;
		else if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
			allowDrop = true;
	}
return allowDrop;
}

//Allow the drop of the kings
function checkKingsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop) //TO EDIT
{
	allowDrop = false;

	nMoves = 1;
	if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, true, true, true))
		allowDrop = true;
	else if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;

	return allowDrop;
}

function checkBishopMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop)
{
	allowDrop = false;
	nMoves = 8;
	if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;

	return allowDrop;

}

function checkTowersMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop)
{
	allowDrop = false;

	nMoves = 8;
	if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, true, true, true))
		allowDrop = true;

	return allowDrop;
}

function checkQueensMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop)
{
	allowDrop = false;
	nMoves = 8;
	if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, true, true, true))
		allowDrop = true;
	else if (checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;

	return allowDrop;
}

function checkHorsesMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop)
{
	allowDrop = false;
	nMoves = 4;

	if (checkHorseO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;

	return allowDrop;
}

/************************************************************************************
********* Functions which help with the generic moves (each piece use these functions)
*************************************************************************************/

//Function that unify UP, DOWN, LEFT and RIGHT checking moves
function checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves, canGoUp, canGoDown, canGoLeft, canGoRight)
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

	//alert("ok");

	while (i <= howManyMoves)
	{
	//all the pieces calling this functions can go up
		
		if (canGoUp && (columnSource == columnDest) && rowSource > rowDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "up", i, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "up", i))
					return true;
			}			
		}

		if (canGoDown && (columnSource == columnDest) && rowSource < rowDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "down", i, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "down", i))
					return true;
			}
		}

		if (canGoLeft && (rowSource == rowDest) && columnSource > columnDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "left", i, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "left", i))
					return true;
			}
		}

		if (canGoRight && (rowSource == rowDest) && columnSource < columnDest)
		{
			if (isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, "right", i, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestination(rowSource, rowDest, columnSource, columnDest, "right", i))
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
function isObstacolated(myValue, rowSource, rowDest, columnSource, columnDest, destination, delta, myClass)
{
	var obstacleValue, obstacleClass;

	switch (destination)
	{
		case "up":
			if (supportObstacle((rowSource - delta), columnSource, rowDest, columnDest, myValue, myClass))
				return true;
			break;
		case "down":
			if (supportObstacle((rowSource + delta), columnSource, rowDest, columnDest, myValue, myClass))
				return true;
			break;
		case "left":
			if (supportObstacle(rowSource, (columnSource - delta), rowDest, columnDest, myValue, myClass))
				return true;
			break;
		case "right":
			if (supportObstacle(rowSource, (columnSource + delta), rowDest, columnDest, myValue, myClass))
				return true;
			break;
	}
	return false;
}

//Function which actually analyze the obstacle and manage the moves
function supportObstacle(rowObstacle, columnObstacle, rowDest, columnDest, myValue, myClass)
{
	obstacleValue = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("value"));
	obstacleClass = ($("#d"+(rowObstacle)+""+columnObstacle).find("img").attr("class"));

	if (obstacleValue == myValue)
	{
		alert("there is an obstacle!");				
		return true;
	}
	if ((myClass == "white-pawn" || myClass == "black-pawn") && obstacleValue != myValue && obstacleValue != undefined)
		return true;

	return false;
}

//First function used to switch which direction i am headed to
function checkDestination(rowSource, rowDest, columnSource, columnDest, destination, delta)
{
	switch (destination)
	{
		case "up":
			if (supportDestination(rowSource - delta, columnSource, rowDest, columnDest))
				return true;
			break;
		case "down":
			if (supportDestination(rowSource + delta, columnSource, rowDest, columnDest))
				return true;
			break;
		case "left":
			if (supportDestination(rowSource, columnSource - delta, rowDest, columnDest))
				return true;
			break;
		case "right":
			if (supportDestination(rowSource, columnSource + delta, rowDest, columnDest))
				return true;
			break;
	}
	return false;
}

//Is it the right spot? ok make the move
function supportDestination(rowNow, columnNow, rowDest, columnDest)
{
	if (rowNow == rowDest && columnNow == columnDest)
		return true;
	return false;
}

/*
* Function that unify the oblique controls      ************************************************************unify check obstacle, check destination!
*/
function checkMoveObliqueO(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
	var myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));
	var safetyReturn = true;

	i = 1;


//--
	while (i <= howManyMoves)
	{
	//all the pieces calling this functions can go up
		
	//up left
		if (columnSource > columnDest && rowSource > rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "ul", i, myValue, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "ul", i))
					return true;
			}		
		}
		//up right
		if (columnSource < columnDest && rowSource > rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "ur", i, myValue, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "ur", i))
					return true;
			}			
		}
		//down left
		if (columnSource > columnDest && rowSource < rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "dl", i, myValue, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "dl", i))
					return true;
			}			
		}
		//down right
		if (columnSource < columnDest && rowSource < rowDest)
		{
			if (isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, "dr", i, myValue, myClass))
				safetyReturn = false;
			else
			{
				if (checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, "dr", i))
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
function isObstacolatedOblique(rowSource, rowDest, columnSource, columnDest, destination, delta, myValue, myClass)
{
	switch (destination)
	{
		case "ul":
		{
			 if (supportObstacleOblique((rowSource - i), (columnSource - i), rowDest, columnDest, myValue, myClass))
			 	return true;
		}
		break;

		case "ur":
			if (supportObstacleOblique((rowSource - i), (columnSource + i), rowDest, columnDest, myValue, myClass))
				return true;
		break;

		case "dl":
			if (supportObstacleOblique((rowSource + i), (columnSource - i), rowDest, columnDest, myValue, myClass))
				return true;
		break;

		case "dr":
			if (supportObstacleOblique((rowSource + i), (columnSource +i), rowDest, columnDest, myValue, myClass))
				return true;
		break;
	}
	return false;
}

//Support function which actually detect the obstacle
function supportObstacleOblique(rowObstacle, columnObstacle, rowDest, columnDest, myValue, myClass)
{
	obstacleValue = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("value"));
	obstacleClass = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("class"));


	if (obstacleValue == myValue)				
		return true;
	if (obstacleValue == undefined && (myClass == "white-pawn" || myClass == "black-pawn"))
	{

		return true;
	}
		

	return false;
}

//First function which detect the destination
function checkDestinationOblique(rowSource, rowDest, columnSource, columnDest, destination, delta)
{
	switch (destination)
	{
		case "ul":
			 if (supportDestination((rowSource - i), (columnSource - i), rowDest, columnDest))
			 	return true;
		break;
		case "ur":
			if (supportDestination((rowSource - i), (columnSource + i), rowDest, columnDest))
				return true;
		break;
		case "dl":
			if (supportDestination((rowSource + i), (columnSource - i), rowDest, columnDest))
				return true;
		break;
		case "dr":
			if (supportDestination((rowSource + i), (columnSource +i), rowDest, columnDest))
				return true;
		break;
	}
	return false;
}
/************************************END TO OPTIMIZE*************************************************/
/*
*	The horse have a particular system of moving, have to use a different function
*/
function checkHorseO(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
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
				if (minimizeHorse(r, c, rowSource, rowDest, columnSource, columnDest))
					return true;
			}
		}
	}
	return false;
}

/*
* Help to move the horse in a optimized way
*/
function minimizeHorse(deltaRows, deltaColumns, rowSource, rowDest, columnSource, columnDest)
{
	var obstacleValue = ($("#d"+(rowSource - deltaRows)+""+(columnSource - deltaColumns)).find("img").attr("value"));
	var myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));

	if (obstacleValue == myValue)
		return false;
	else if ((rowSource == rowDest+deltaRows) && (columnSource == columnDest + deltaColumns))
		return true;
	return false;
}

/*
* Function that manage the capturing of a piece
*/
function capturePiece()
{
	alert("Capturing piece!");
	//  .....
}




