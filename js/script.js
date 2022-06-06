"use-strict"

$(function(){
    //Global declaration
    var turn = true;
    var count = 0;
    var total= 3*3;
    var rows = 3;
    var cols = 3;
    var depth = 3;
    var win = false;
    const hasTable = [];
    $('button#submit').click(function(e){
        e.preventDefault();
        rows = $("input#rows").val();
        cols = $("input#cols").val();
        depth = Number($("input#depth").val());
        total = rows*cols;
        $('#config').slideUp();
        let html = "";
        for(let i=0;i<rows;i++){
            html += '<div class="rows">';
            for(let j=0;j<cols;j++){
                html += '<div class="cell" id="_'+i+j+'" row="'+i+'" col="'+j+'"></div>';
                hasTable['_'+i+j] ='x-o';
            }
            html += "</div>";
        }
        $('#board').html(html);
    });

    $('body').on('click', 'div.cell', function(e) {
        e.preventDefault();
        let check = $(this).attr("id");
        if(hasTable[String(check)] === 'x-o' && count<total){
            if(turn){
                $(this).addClass("p1");
                $(this).attr("player","o");
                turn = false;
                hasTable[$(this).attr('id')] = 'o';
            }else{
                $(this).addClass("p2");
                $(this).attr("player","x");
                turn = true;
                hasTable[$(this).attr('id')] = 'x';
            }
            winCheck($(this));
            count++;
            if(count == total && !win){
                message_over();
            }
            
            return;
        }else if(count<total){
            var toast = '<div class="toast">Already taken. Try another cell!</div>';
            $('body').append(toast);
            setTimeout(function(){
                $('.toast').fadeOut(1000);
            },2000);
        }

        if(count == total){
            message_over();
        }
        
    });
    function winCheck(dis){
        let current_cell = [Number(dis.attr('row')),Number(dis.attr('col'))];
        let player = dis.attr('player');
        console.log(current_cell[0]+','+current_cell[1]+ ' - '+ player);
        if(    horizontal(current_cell,player) >= depth
            || vertical(current_cell,player) >= depth
            || bottom_to_top_digonal(current_cell,player) >= depth
            || top_to_bottom_diagonal(current_cell,player) >= depth){

                win = true;
                message("Player - "+player+", Won!");
        }
        
    }
    // Check by horizontally backward and forward
    function horizontal(current_cell,player){
        let res = 1;
        let row = current_cell[0];
        let col = current_cell[1];
        for(let i = col+1;i<cols;i++){
            if(hasTable['_'+row+i] === player){
                res++; 
            }else{
                break;
            }
        }
        for(let j = col-1;j>=0;j--){
            if(hasTable['_'+row+j] === player){
                res++;
            }else{
                break;
            }
        }
        return res;
    }

    // Check Vertically backward and forward 
    function vertical(current_cell,player){
        let res = 1;
        let row = current_cell[0];
        let col = current_cell[1];
        for(let i = row+1;i<rows;i++){
            if(hasTable['_'+i+col] === player){
                res++;
            }else{
                break;
            }
        }

        for(let i = row-1;i>=0;i--){
            if(hasTable['_'+i+col] === player){
                res++;
            }else{
                break;
            }
        }
        
        return res;
    }

    // Check diagonally bottom to top, backward and forward

    function bottom_to_top_digonal(current_cell,player){
        let res = 1;
        let row = current_cell[0];
        let col = current_cell[1];
        let x,y;
        x = row-1;
        y = col+1;
        while(hasTable['_'+x+y] === player
              && x>=0 && y<cols){
            res++;
            y++;
            x--;
        }
        x = row+1;
        y = col-1;
        while(hasTable['_'+x+y] === player
              && y>=0 && x<rows){
            res++;
            y--;
            x++;
        }
        return res;
    }

    // Check diagonally top to bottom, backward and forward

    function top_to_bottom_diagonal(current_cell,player){
        let res = 1;
        let row = current_cell[0];
        let col = current_cell[1];
        let x,y;
        x = row+1;
        y = col+1;
        while(hasTable['_'+x+y] === player
              && x<rows && y<cols){
            res++;
            y++;
            x++;
        }
        x = row-1;
        y = col-1;
        while(hasTable['_'+x+y] === player
              && y>=0 && x>=0){
            res++;
            y--;
            x--;
        }
        return res;
    }
    function message(msg=''){
        var game_win = '<div id="block-click"></div><div class="game_win">'+msg;
        game_win += '<button id="reload" onclick="window.location.reload();">Play Again</button></div>';
        $('body').append(game_win);
    }
    function message_over(){
        var game_over = '<div id="block-click"></div><div class="game_over">Game Over!';
        game_over += '<button id="reload" onclick="window.location.reload();">Play Again</button></div>';
        $('body').append(game_over);
    }
});