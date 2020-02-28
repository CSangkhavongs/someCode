    $('#select').change(function(){
        var cell = $('#select').val();
        $('.game-container').css('width', 125*cell);
        $('.game-container').css('height', 125*cell);
        createGrid(cell);
    });

    $('.new-game').click(function() {
        var cell = $('#select').val();
        $('#end').remove();
        $('#result').remove();
        $('#score').append('<p id="result">0</p>');
        createGrid(cell);
    });

    function createGrid(cell = 4){
        $('#bestresult').remove();
        $('#result').remove();
        $('#score').append('<p id="result">0</p>');
        $('.grid-cell').remove();
        $('.grid-row').remove();
        for(var i = 0; i < cell; i++) {
            $('.grid-container').append('<div id="grid-row-' + i + '" class="grid-row"></div>');
        }

        for(var i = 0; i < cell; i++) {
            for(var j = 0; j < cell; j++) {
                $('#grid-row-' + i).append('<div id="' + i + "-" + j + '" class="grid-cell"></div>');                
            }
        }
        random();
        random();

        if(!readCookie()){
            createCookie();
        } 
        var bestscore = readCookie();
        if(bestscore != false){
            $('#best_score').append('<p id="bestresult">' + bestscore + '</p>');
        }
        else{
            $('#best_score').append('<p id="bestresult">0</p>');
        }
    }

    function createCookie(value = 0){
        var name = "bestscore";
        var days = 5;
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = name + " = " + value + expires + "; path=/";
    }

    function readCookie(){
        var name = "bestscore";
        var name2 = name + "=";
        var arrayCookie = document.cookie.split(';');
        for(var i = 0; i < arrayCookie.length; i++) {
            var cookie = arrayCookie[i];
            while (cookie.charAt(0) === ' '){
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(name2) == 0){
                return cookie.substring(name2.length, cookie.length);
            }
        }
        return false;
    }

    function checkCell(){
    	var cell_empty = new Array();
    	all_cell = $('.grid-cell');
    	all_cell.each(function(index, item){
    		if(item.innerText == ""){
    			cell_empty.push(item.getAttribute('id'));
    		}
    	});
    	return cell_empty;
    }

    function random(){
    	var first_num = ['2', '4'];
    	var cell_empty = checkCell();
    	var index = Math.floor(Math.random() * cell_empty.length);
    	var first = Math.floor(Math.random() * first_num.length);
    	var cell = cell_empty[index];
    	first = first_num[first];
    	$('#'+ cell).append('<div id="box-' + cell + '" class="grid-cell box num-' + first + '">' + first + '</div>');
    }

    function newGrid(grid, old_grid, score){
    	$('.box').remove();              
    	$('#result').replaceWith('<p id="result">' + score + '</p>');
        var cell;
    	var value;
    	for(i = 0; i < grid.length; i++){
    		for(j = 0; j < grid.length; j++){
    			if(grid[i][j] != ""){
    				cell = i + "-" + j;
    				value = grid[i][j];
    				$('#'+ cell).append('<div id="box-' + cell + '" class="grid-cell box num-' + value + '">' + value + '</div>');
    			}
    		}
    	}
        if(getArrayDiff(old_grid, grid)){
            random();
        }
        if(checkWin(grid)) {
            setTimeout(function() {
                var end = "Gagné";
                setEnd(score, end);
                }, 200);
        }

        var cell_empty = checkCell();
        if(cell_empty.length === 0){
            if(checkLose()){
                setTimeout(function() {
                    var end = "Perdu";
                    setEnd(score, end);
                }, 200);
            }
        }
    }

    function setEnd(score, end){
        if(score > readCookie()){
            createCookie(score);
        }
        $('#end').remove(); 
        $(".game-container").append('<div id="end"><h2 id="titre_end">' + end + ' !</h2><p id="score_end">Votre score et de : ' + score + '</p><p id="new">Appuyer sur Nouvelle partie</p></div>');
    }

    function getArrayDiff(arr1, arr2){
    	for(i = 0; i < arr1.length; i++){
    		for(j = 0; j < arr1.length; j++){
    			if(arr1[i][j] != arr2[i][j]){
    				return true;
    			}
    		}
    	}  
    	return false;
    }

    function checkLose(cell = 4){       
        var cell = $('#select').val();
        grid = new Array();
        for(var i = 0; i < cell; i++) {
            grid[i] = new Array();
            for(var j = 0; j < cell; j++) {
                grid[i][j] = $("#" + i + "-" + j)[0].innerText;
            }
        }
        for(var i = 0; i < grid.length; i++){
            for(var j = 1; j < grid.length; j++){
                if(grid[i][j - 1] === grid[i][j]){
                    return false;
                }                
            }  
        }
        for(var i = 1; i < grid.length; i++){
            for(var j = 0; j < grid.length; j++){
                if(grid[i - 1][j] == grid[i][j]){
                    return false;
                }
            }  
        }
        for(var i = 0; i < grid.length; i++){
            for(var j = grid.length - 1; j >= 0; j--){
                if(grid[i][j + 1] == grid[i][j]){
                    return false;
                }
            }
        }
        for(var i = grid.length - 2; i >= 0; i--){
            for(var j = 0; j < grid.length; j++){
                if(grid[i + 1][j] == grid[i][j]){
                    return false;
                }
            }
        }
        return true;        
    }

    function checkWin(grid) {
        for(var i = 0; i < grid.length; i++) {
            for(var j = 0; j < grid.length; j++) {
                if(grid[i][j] == 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    $(document).keydown(function(event) {    	
        var cell = $('#select').val();
       	var	grid = new Array();
       	var old_grid = new Array();
    	for(var i = 0; i < cell; i++) {
       		grid[i] = new Array();
       		old_grid[i] = new Array();
            for(var j = 0; j < cell; j++) {
                grid[i][j] = $("#" + i + "-" + j)[0].innerText;
                old_grid[i][j] = $("#" + i + "-" + j)[0].innerText;
            }
        }
    	var key = event.which;
    	switch (key){
    		case 37:
    			keyLeft(grid, old_grid);
    		break;
    		case 38:
    			keyUp(grid, old_grid);
    		break;
    		case 39:
    			keyRight(grid, old_grid);
    		break;
    		case 40:
    			keyDown(grid, old_grid);
    		break;
    	}
	});

    $('#haut').click(function(){
        var cell = $('#select').val();
        var grid = new Array();
        var old_grid = new Array();
        for(var i = 0; i < cell; i++) {
            grid[i] = new Array();
            old_grid[i] = new Array();
            for(var j = 0; j < cell; j++) {
                grid[i][j] = $("#" + i + "-" + j)[0].innerText;
                old_grid[i][j] = $("#" + i + "-" + j)[0].innerText;
            }
        }
        keyUp(grid, old_grid);
    });

    $('#bas').click(function(){
        var cell = $('#select').val();
        var grid = new Array();
        var old_grid = new Array();
        for(var i = 0; i < cell; i++) {
            grid[i] = new Array();
            old_grid[i] = new Array();
            for(var j = 0; j < cell; j++) {
                grid[i][j] = $("#" + i + "-" + j)[0].innerText;
                old_grid[i][j] = $("#" + i + "-" + j)[0].innerText;
            }
        }
        keyDown(grid, old_grid);
    });

    $('#gauche').click(function(){
        var cell = $('#select').val();
        var grid = new Array();
        var old_grid = new Array();
        for(var i = 0; i < cell; i++) {
            grid[i] = new Array();
            old_grid[i] = new Array();
            for(var j = 0; j < cell; j++) {
                grid[i][j] = $("#" + i + "-" + j)[0].innerText;
                old_grid[i][j] = $("#" + i + "-" + j)[0].innerText;
            }
        }
        keyLeft(grid, old_grid);
    });

    $('#droite').click(function(){
        var cell = $('#select').val();
        var grid = new Array();
        var old_grid = new Array();
        for(var i = 0; i < cell; i++) {
            grid[i] = new Array();
            old_grid[i] = new Array();
            for(var j = 0; j < cell; j++) {
                grid[i][j] = $("#" + i + "-" + j)[0].innerText;
                old_grid[i][j] = $("#" + i + "-" + j)[0].innerText;
            }
        }
        keyRight(grid, old_grid);
    });

    function keyLeft(grid, old_grid) {
        var score = parseInt($('#result').html());
        for(var i = 0; i < grid.length; i++){
            for(var j = 1; j < grid.length; j++){
                if(grid[i][j] == 2048){
                    return;
                }
                else if(grid[i][j] > 2048){
                    var end = "Tricheur";
                    setEnd(score, end);
                    return;
                }
                if(grid[i][j] != ""){ 
                    var col = j;
                    while (col - 1 >= 0){
                        if(grid[i][col - 1] == ""){
                            grid[i][col - 1] = grid[i][col];
                            grid[i][col] = "";
                            col--;
                        }
                        else if(grid[i][col - 1] == grid[i][col]) {
                            var result = grid[i][col - 1] *= 2;
                            score += result;
                            grid[i][col] = "";
                            break;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        newGrid(grid, old_grid, score);
    }

	function keyUp(grid, old_grid){
        var score = parseInt($('#result').html());
        for(var i = 1; i < grid.length; i++){
            for(var j = 0; j < grid.length; j++){
                if(grid[i][j] == 2048){
                    return;
                }
                else if(grid[i][j] > 2048){
                    var end = "Tricheur";
                    setEnd(score, end); 
                    return;
                }
                if(grid[i][j] != ""){
                    var row = i;
                    while (row > 0){
                        if(grid[row - 1][j] == ""){
                            grid[row - 1][j] = grid[row][j];
                            grid[row][j] = "";
                            row--;
                        }
                        else if(grid[row - 1][j] == grid[row][j]) {
                            var result = grid[row - 1][j] *= 2;
                            score += result;
                            grid[row][j] = "";
                            break;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        newGrid(grid, old_grid, score);
    }

    function keyRight(grid, old_grid){
        var score = parseInt($('#result').html());
    	for(var i = 0; i < grid.length; i++){
            for(var j = grid.length - 1; j >= 0; j--){
                if(grid[i][j] == 2048){
                    return;
                }
                else if(grid[i][j] > 2048){
                    var end = "Tricheur";
                    setEnd(score, end);
                    return;
                }
                if(grid[i][j] != ""){ 
                    var col = j;
                    while (col + 1 < grid.length){
                        if(grid[i][col + 1] === ""){
                            grid[i][col + 1] = grid[i][col];
                            grid[i][col] = "";
                            col++;
                        }
                        else if(grid[i][col + 1] == grid[i][col]) {
                            var result = grid[i][col + 1] *= 2;
                            score += result;
                            grid[i][col] = "";
                            break;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        newGrid(grid, old_grid, score);
    }

    function keyDown(grid, old_grid){
        var score = parseInt($('#result').html());
    	 for(var i = grid.length - 1; i >= 0; i--){
            for(var j = 0; j < grid.length; j++){
                if(grid[i][j] == 2048){
                    return;
                }
                else if(grid[i][j] > 2048){
                    var end = "Tricheur";
                    setEnd(score, end);
                    return;
                }
                if(grid[i][j] != ""){
                    var row = i;
                    while (row + 1 < grid.length){
                        if(grid[row + 1][j] === ""){
                            grid[row + 1][j] = grid[row][j];
                            grid[row][j] = "";
                            row++;
                        }
                        else if(grid[row + 1][j] == grid[row][j]) { 
                            var result = grid[row + 1][j] *= 2;
                            score += result;
                            grid[row][j] = "";
                            break;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        newGrid(grid, old_grid, score);
    }

$(document).ready(function(){
    createGrid();
});