/**************************************************************
******Script - Developed by: Daniele Genta - Summer 2015********
***************************************************************/

$(document).ready(function()
{
	//Initialize the project
	init();

	//Events 
	$("#btnStart").click(function(){
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
        	asignCellImage(i,j);
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

//Asign the right image to the cells (note: there is a layer between the coloured div and the image)
function asignCellImage(i, j)
{
	//Using the class to recognize the images - no difference between black and white queens and kings (same moves)
	//black pawns
	if (i==1)
	{
		$("#d"+i+""+j).html('<img src="images/set/black-pawn.png">');
		$("#d"+i+""+j).find("img").attr("class","black-pawn");
		$("#d"+i+""+j).find("img").attr("value","black");
	}
	//white pawns
	if (i==6)
	{
		$("#d"+i+""+j).html('<img src="images/set/white-pawn.png">');
		$("#d"+i+""+j).find("img").attr("class","white-pawn");
		$("#d"+i+""+j).find("img").attr("value","white");
	}
	//black towers
	if (i == 0 && (j==0 || j==7))
	{
		$("#d"+i+""+j).html('<img src="images/set/black-tower.png">');
		$("#d"+i+""+j).find("img").attr("class","tower");
		$("#d"+i+""+j).find("img").attr("value","black");
	}
	//white towers
	if (i == 7 && (j == 0 || j == 7))
	{	
		$("#d"+i+""+j).html('<img src="images/set/white-tower.png">');
		$("#d"+i+""+j).find("img").attr("class","tower");
		$("#d"+i+""+j).find("img").attr("value","white");
	}
	//white horses
	if (i == 7 && (j == 1 || j == 6))
	{
		$("#d"+i+""+j).html('<img src="images/set/white-horse.png">');
		$("#d"+i+""+j).find("img").attr("class","horse");
		$("#d"+i+""+j).find("img").attr("value","white");
	}
	//black horses
	if (i == 0 && (j == 1 || j == 6))
	{
		$("#d"+i+""+j).html('<img src="images/set/black-horse.png">');
		$("#d"+i+""+j).find("img").attr("class","horse");
		$("#d"+i+""+j).find("img").attr("value","black");
	}
	//black bishops
	if (i == 0 && (j == 2 || j == 5))
	{
		$("#d"+i+""+j).html('<img src="images/set/black-bishop.png">');
		$("#d"+i+""+j).find("img").attr("class","bishop");
		$("#d"+i+""+j).find("img").attr("value","black");
	}
	//white bishops
	if (i == 7 && (j == 2 || j == 5))
	{
		$("#d"+i+""+j).html('<img src="images/set/white-bishop.png">');
		$("#d"+i+""+j).find("img").attr("class","bishop");
		$("#d"+i+""+j).find("img").attr("value","white");
	}
	//kings
	if ((i == 0 || i == 7) && j== 4)
	{
		if (i == 0)
		{
			$("#d"+i+""+j).html('<img src="images/set/black-king.png">');
			$("#d"+i+""+j).find("img").attr("value","black");
		}
		else
		{
			$("#d"+i+""+j).html('<img src="images/set/white-king.png">');
			$("#d"+i+""+j).find("img").attr("value","black");
		}
		$("#d"+i+""+j).find("img").attr("class","king");

	}
	//queens
	if ((i == 0 || i == 7) && j== 3)
	{
		if (i == 0)
		{
			$("#d"+i+""+j).html('<img src="images/set/black-queen.png">');
			$("#d"+i+""+j).find("img").attr("value","black");
		}
		else
		{
			$("#d"+i+""+j).html('<img src="images/set/white-queen.png">');
			$("#d"+i+""+j).find("img").attr("value","white");
		}
		$("#d"+i+""+j).find("img").attr("class","queen");
	}
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
        	$("#d"+i+""+j).draggable( 'enable' );

		};  
	}
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
				//if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
				if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false))
					allowDrop = true;
				else if (checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
				else if (checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
			}
			//if it isn't the 1st move
			else
			{
				nMoves = 1;
				//if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))

				if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false))
					allowDrop = true;
				//Check for the capturing
				else if (checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
				else if (checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
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
				//if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
				//	allowDrop = true;
				if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false))
					allowDrop = true;
				if (checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
				if (checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
			}
			//if it isn't the 1st move
			else
			{
				nMoves = 1;
				if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
				if (checkMoveO(rowDrag, rowDrop, columnDrag, columnDrop, nMoves, true, false, false, false))
					allowDrop = true;
				if (checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
				if (checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
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

	if (checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	if (checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;

	return allowDrop;
}

function checkBishopMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop)
{
	allowDrop = false;

	nMoves = 8;

	if (checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	if (checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
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
	if (checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	if (checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
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

//************************Make a common function for the code repeated!!!!!!!!!!!!!
//Unify up & down, left & right


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

function supportObstacle(rowObstacle, columnObstacle, rowDest, columnDest, myValue, myClass)
{
	obstacleValue = ($("#d"+(rowObstacle)+""+ columnObstacle).find("img").attr("value"));
	obstacleClass = ($("#d"+(rowObstacle)+""+columnObstacle).find("img").attr("class"));

		if (obstacleValue == myValue)
		{
			console.log(obstacleClass);
			alert("there is an obstacle!");				
			return true;
		}
		if ((myClass == "white-pawn" || myClass == "black-pawn") && obstacleValue != myValue && obstacleValue != undefined)
			return true;


		return false;
}

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

function supportDestination(rowNow, columnNow, rowDest, columnDest)
{
	if (rowNow == rowDest && columnNow == columnDest)
	{
		return true;
	}
		
}

/*
*	TO OPTIMIZE!
*/

function checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i, obstacleValue, myValue;

	i = 1;

	while (i <= howManyMoves)
	{
		obstacleValue = ($("#d"+(rowSource - i)+""+(columnSource - i)).find("img").attr("value"));
		obstacleClass = ($("#d"+(rowSource - i)+""+(columnSource - i)).find("img").attr("class"));
		myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
		myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));

		if (obstacleValue == myValue || obstacleValue == undefined)
		{
				if (columnSource == columnDest + i && rowSource == rowDest + i && obstacleValue == undefined && myClass != "white-pawn")
					return true;
				else if (obstacleValue != undefined)
					return false;
				i++;
		}
		else if (obstacleValue != undefined)
		{
			if (columnSource == columnDest + i && rowSource == rowDest + i)
			{
				capturePiece();
				return true;
			}
			else
				return false;
		}
	}
	return false;
}

function checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i, obstacleValue, myValue;

	i = 1;

	while (i <= howManyMoves)
	{
		obstacleValue = ($("#d"+(rowSource - i)+""+(columnSource + i)).find("img").attr("value"));
		myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
		myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));
		if (obstacleValue == myValue || obstacleValue == undefined)
		{
				if (columnSource == columnDest - i && rowSource == rowDest + i && obstacleValue == undefined && myClass != "black-pawn")
					return true;
				else if (obstacleValue != undefined)
					return false;
				i++;
		}
		else if (obstacleValue != undefined)
		{
			alert(myClass);
			if (columnSource == columnDest - i && rowSource == rowDest + i)
			{
				capturePiece();
				return true;
			}
			else
				return false;
		}
	}
	return false;
}

function checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i, obstacleValue, myValue;

	i = 1;

	while (i <= howManyMoves)
	{
		obstacleValue = ($("#d"+(rowSource + i)+""+(columnSource - i)).find("img").attr("value"));
		myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));
		myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
		if (obstacleValue == myValue || obstacleValue == undefined)
		{
				if (columnSource == columnDest + i && rowSource == rowDest - i && obstacleValue == undefined)
					return true;
				else if (obstacleValue != undefined)
					return false;
					i++;
		}
		else if (obstacleValue != undefined)
		{
			if (columnSource == columnDest + i && rowSource == rowDest - i)
			{
				capturePiece();
				return true;
			}
			else
				return false;
		}
	}
	return false;
}

function checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);
	var i=1, obstacleValue, myValue;
	while (i <= howManyMoves)
	{
		obstacleValue = ($("#d"+(rowSource + i)+""+(columnSource + i)).find("img").attr("value"));
		myValue = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("value"));
		myClass = ($("#d"+(rowSource)+""+(columnSource)).find("img").attr("class"));
		if (obstacleValue == myValue  || obstacleValue == undefined)
		{
				if (columnSource == columnDest - i && rowSource == rowDest - i && obstacleValue == undefined)
					return true;
				else if (obstacleValue != undefined)
					return false;
				i++;
		}
		else if (obstacleValue != undefined)
		{
			if (columnSource == columnDest - i && rowSource == rowDest - i)
			{
				capturePiece();
				return true;
			}
			else
				return false;
		}
	}
	return false;
}

/**********************************END TO EDIT*************************************/
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
*/
function capturePiece()
{
	alert("capturing piece!");
}




