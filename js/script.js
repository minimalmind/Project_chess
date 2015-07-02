/**************************************************************
******Script: developed by: Daniele Genta - Summer 2015********
***************************************************************/

$(document).ready(function()
{
	init();

	//Events 
	$("#btnStart").click(function(){
		gameStart();
	});

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
}

//Dynamic creation of the chess board 
function createBoard()
{
	var i, j, mainBoardCell, mainBoardCellClass, colorBlack = false;
	var mainBoardDragCell, mainBoardDragCellClass;

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


    		//TO EDIT
    		//First coloured layer
       		mainBoardCell = $('<div />');
        	mainBoardCell.attr("id",i+""+j);
        	mainBoardCell.addClass(mainBoardCellClass);
        	$("#main-board").append(mainBoardCell);

        	//Second transparent layer
        	mainBoardDragCell = $('<div />');
        	mainBoardDragCell.attr("id","d"+i+""+j);
        	mainBoardDragCell.attr("class","middle-layer");
        	mainBoardDragCell.addClass(mainBoardDragCellClass);
        	$("#"+i+""+j).append(mainBoardDragCell);

        	asignCellImage(i,j);
        	colorBlack = !colorBlack;
		}
		colorBlack = !colorBlack;
    }
}

//Asingn the right images to the cells (note: there is a layer between the coloured div and the image)
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
		$("#d"+i+""+j).html('<img src="images/set/white-horse.png">');
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

//Initialize the game
function gameStart()
{
	$("#intro-page").hide();
	$("#game-page").show();
	$("#header-title").css({'font': '50px Helvetica, Sans-Serif'});

	//Creation of the chess boards 
	createBoard();

	//Set the function drag on the chess set
	setDrag();

	setDrop();

	var timer = setInterval(
    function () {
    	
        $('#main-board').animate({rotate: '+=10deg'}, 0);
        if (parseInt(($('#main-board').css("rotate")) == 180))
        {
        	alert($('#main-board').css("rotate"));
        	$('#main-board').stop();
        	stop();
        	clear(timer);
        }

    },
    100
	);
	setInterval(
    function () {
        $('#d00').animate({rotate: '+=10deg'}, 0);
    },
    200
);



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
			//Check if the cell is empty (doesn't contain an img)
			count = $('#'+i+""+j).find('img').length;
			if (count == 0)
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
function checkWhitePawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop) //TO EDIT
{
	allowDrop = false;
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);

	//The pieces only move vertically
	if (columnDrop == columnDrag)
		{
			//If is the 1st move (can move 2 cells)
			if (rowDrag == "6")
			{
				
				nMoves = 2;
				if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
			}
			//if it isn't the 1st move
			else
			{
				nMoves = 1;
				if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
			}
		}
		return allowDrop;
}

//Allow the drop of a white pawn
function checkBlackPawnsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop) //TO EDIT
{
	allowDrop = false;

	var nMoves;

			//If is the 1st move (can move 2 cells)
			if (rowDrag == "1")
			{
				nMoves = 2;
				if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
			}
			//if it isn't the 1st move
			else
			{
				nMoves = 1;
				if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
					allowDrop = true;
			}
		return allowDrop;
}

//Allow the drop of the kings
function checkKingsMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop) //TO EDIT
{
	allowDrop = false;

	nMoves = 1;


	if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
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

	if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
	{
		allowDrop = true;
	}
	else if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
	{
		allowDrop = true;
	}
	else if (checkMoveLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;

	return allowDrop;
}

function checkQueensMoves(rowDrag, rowDrop, columnDrag, columnDrop, allowDrop)
{
	allowDrop = false;

	nMoves = 8;


	if (checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveLeft(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
		allowDrop = true;
	else if (checkMoveRight(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
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
	if (checkVerticalHorse(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
	{
		allowDrop = true;
	}
	else if (checkHorizontalHorse(rowDrag, rowDrop, columnDrag, columnDrop, nMoves))
	{
		allowDrop = true;
	}
	return allowDrop;
}

/************************************************************************************
********* Functions which help with the generic moves (each piece use these functions)
*************************************************************************************/


//Editing obstacles, mine or other
function checkMoveUp(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);

	//console.log(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves);

	var i=1;

	var obstacle;
	if (columnDrop == columnDrag)
	{
		while (i <= howManyMoves)
		{
			obstacle = ($("#d"+(rowSource-i)+""+columnDrag).find("img").attr("class"));
			if (rowSource == rowDest+i && obstacle == undefined)
				return true;
			if (obstacle != undefined)
				return false;
			i++;
		}
	}
	return false;
}

function checkMoveDown(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);

	var i=1, obstacle;

	if (columnDrop == columnDrag)
	{
		while (i <= howManyMoves)
		{
			obstacle = ($("#d"+(rowSource+i)+""+columnDrag).find("img").attr("class"));
			if (rowSource == rowDest-i && obstacle == undefined)
				return true;
			if (obstacle != undefined)
				return false;
			i++;
		}
	}
	return false;
}

function checkMoveLeft(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	i = 1
	var obstacle;
		if (rowDrag == rowDrop)
		{
			while (i <= howManyMoves)
			{
				obstacle = ($("#d"+(rowDrag)+""+(columnSource+i)).find("img").attr("class"));
				if (columnSource == columnDest-i && obstacle == undefined)
					return true;
				else if (obstacle != undefined)
					return false;
				i++;
			}
		}
	return false;
}

function checkMoveRight(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	i = 1;
	var obstacle;
	if (rowDrag == rowDrop)
	{
		while (i <= howManyMoves)
		{
			obstacle = ($("#d"+(rowDrag)+""+(columnSource-i)).find("img").attr("class"));
			if (columnSource == columnDest+i && obstacle == undefined)
				return true;
			else if (obstacle != undefined)
				return false;
				
		
		i++;
	}
	}
	return false;
}


//DOES NOT WORK ):
function checkMoveObliqueUpLeft(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i=1, obstacle;

	//go up
	while (i <= howManyMoves)
	{
		obstacle = ($("#d"+(rowSource+i)+""+(columnSource-i)).find("img").attr("class"));
		if ((rowSource == rowDest + i) && (columnSource == columnDest-i) && (obstacle == undefined))
			return true;
		else if (obstacle != undefined)
			 return false;
		i++;
	}



	return false;
}

function checkMoveObliqueUpRight(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i=1;

	//go up
	while (i <= howManyMoves)
	{
		obstacle = ($("#d"+(rowSource+i)+""+(columnSource+i)).find("img").attr("class"));
		if ((rowSource == rowDest + i) && (columnSource == columnDest+i) && (obstacle == undefined))
			return true;
		else if (obstacle != undefined)
			return false;
		i++;
	}
}

function checkMoveObliqueDownLeft(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i=1, obstacle;

	i = 1;
	//go down
	while (i <= howManyMoves)
	{
		obstacle = ($("#d"+(rowSource-i)+""+(columnSource+i)).find("img").attr("class"));
		if ((rowSource == rowDest - i) && (columnSource == columnDest + i) && (obstacle == undefined))
			return true;
		else if (obstacle != undefined)
			return false;
		i++;
	}
}

function checkMoveObliqueDownRight(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	var i=1, obstacle;

	i = 1;
	//go down
	while (i <= howManyMoves)
	{
		obstacle = ($("#d"+(rowSource-i)+""+(columnSource-i)).find("img").attr("class"));
		//alert(obstacle);
		if ((rowSource == rowDest - i) && (columnSource == columnDest - i) && (obstacle == undefined))
			return true;
		else if (obstacle != undefined)
			return false;
		i++;
	}
	return false;
}

// END DOES NOT WORK :)

function checkVerticalHorse(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);

	//1 UP LEFT
	if ((rowSource == rowDest+2) && (columnSource == columnDest+1))
		return true;
	//2 UP RIGHT
	if ((rowSource == rowDest+2) && (columnSource == columnDest-1))
		return true;
	//1 DOWN LEFT
	if ((rowSource == rowDest-2) && (columnSource == columnDest+1))
		return true;
	//2 DOWN RIGHT
	if ((rowSource == rowDest-2) && (columnSource == columnDest-1))
		return true;


}

function checkHorizontalHorse(rowDrag, rowDrop, columnDrag, columnDrop, howManyMoves)
{
	var rowSource = parseInt(rowDrag);
	var rowDest = parseInt(rowDrop);
	var columnSource = parseInt(columnDrag);
	var columnDest = parseInt(columnDrop);
	//1 UP LEFT
	if ((rowSource == rowDest+1) && (columnSource == columnDest+2))
		return true;
	//2 UP RIGHT
	if ((rowSource == rowDest+1) && (columnSource == columnDest-2))
		return true;
	//1 DOWN LEFT
	if ((rowSource == rowDest-1) && (columnSource == columnDest+2))
		return true;
	//2 DOWN RIGHT
	if ((rowSource == rowDest-1) && (columnSource == columnDest-2))
		return true;
}





//Check if the cell has a piece or not
function isOccupied()
{

}



