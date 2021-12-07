// a class that will handle the actual chess logic

// some functions for converting from representation to names
const whites = "KQBNPR";
const blacks = "kqbnpr";
function ColorOf(pieceshort){
  if(whites.includes(pieceshort)){
    return("white");
  } else if(blacks.includes(pieceshort)){
    return("black");
  } else {
    return(0);
  }
}

function OppositeColor(color){
  if(color=="white"){
    return("black");
  }
  else if(color=="black"){
    return("white");
  }
  else{
    return("none");
  }
}

function ClassOf(pieceshort){
  switch(pieceshort){
    case 'k':
    case 'K':
      return("king");
    case 'q':
    case 'Q':
      return("queen");
    case 'r':
    case 'R':
      return("rook");
    case 'b':
    case 'B':
      return("bishop");
    case 'n':
    case 'N':
      return("knight");
    case 'p':
    case 'P':
      return("pawn");
    default:
      return(0);
  }
}
const promotablenames = ["Queen","Knight", "Rook", "Bishop"];
function PromotableClassNumber(input){
  for(let i=0;i<promotablenames.length;i++){
    let name=promotablenames[i].toLowerCase()
    input=input.toLowerCase().trim();
    if(name==input||input.includes(name)){
      return(i);
    }
  }
  return(-1);
}

function FullName(pieceshort){
  return(ColorOf(pieceshort)+ClassOf(pieceshort));
}

function CheckMovesArray(row,col,movesarray){
  for(let i=0; i<movesarray.length; i++){
    let marow = movesarray[i][0];
    let macol = movesarray[i][1];
    if((marow==row)&&(macol==col)){
      return(true);
    }
  }
  return(false);
}

function CheckMovesArray2(move,movesarray){
  morow = move[0];
  mocol = move[1];
  return(CheckMovesArray(morow,mocol,movesarray));
}

function PrintArray(inarray){
  let sval = ""
  for(let i=0; i<inarray.length; i++){
    sval += inarray[i]+", ";
  }
  console.log(sval);
}

class Board{
  constructor(){
    // like this to see my logic
    let row7 = [0,0,0,0,0,0,0,0];
    let row6 = [0,0,0,0,0,0,0,0];
    let row5 = [0,0,0,0,0,0,0,0];
    let row4 = [0,0,0,0,0,0,0,0];
    let row3 = [0,0,0,0,0,0,0,0];
    let row2 = [0,0,0,0,0,0,0,0];
    let row1 = [0,0,0,0,0,0,0,0];
    let row0 = [0,0,0,0,0,0,0,0];
    this.board=[row0,row1,row2,row3,row4,row5,row6,row7];
    this.selectedpos=-1;
    this.whiteturn=true;
    this.lastmovestack=[];
    this.whitedanger=[];
    this.blackdanger=[];
    this.selectedmoves=[];
    this.blackking=-1;
    this.whiteking=-1;
    this.blackpossiblemoves=0;
    this.whitepossiblemoves=0;
    this.checkstatus="";
    this.mate=false;
  }

  reset(){
    this.board[7] = ["r","n","b","q","k","b","n","r"];
    this.board[6] = ["p","p","p","p","p","p","p","p"];
    this.board[5] = [0,0,0,0,0,0,0,0];
    this.board[4] = [0,0,0,0,0,0,0,0];
    this.board[3] = [0,0,0,0,0,0,0,0];
    this.board[2] = [0,0,0,0,0,0,0,0];
    this.board[1] = ["P","P","P","P","P","P","P","P"];
    this.board[0] = ["R","N","B","Q","K","B","N","R"];
    this.whiteturn=true;
    this.lastmovestack=[];
    this.KingDanger();
    this.deselect();
    this.checkstatus="";
    this.mate=false;
  }

  at(row,col){
    var shortpiece = this.board[row][col];
    return(FullName(shortpiece));
  }

  move(fromrow,fromcol,torow,tocol){
    // check if the pice in question can move to the desired location
    if(this.checkmove(fromrow,fromcol,torow,tocol)){
      let captured = this.board[torow][tocol];
      // move that piece to that location
      this.board[torow][tocol] = this.board[fromrow][fromcol];
      // leave an epty spot at the previous location
      this.board[fromrow][fromcol] = 0;
      this.lastmovestack.push([fromrow,fromcol,torow,tocol,captured,-1]);
      // calclulate checkmate status
      this.checkMate(torow,tocol);
      return(true);
    }
    else{
      return(false);
    }
  }

  checkmove(fromrow,fromcol,torow,tocol){
    // get the piece name
    let piece = this.board[fromrow][fromcol];
    let destpiece = this.board[torow][tocol];
    // is this actually a piece?
    // and is the destination not the same place
    let rval = (0!=piece);//&&!((fromrow==torow)&&(fromcol==tocol));
    // chacking if the destination is viable
    // i.e. we dont want to override pieces of our own team
    // rval = rval&&(ColorOf(piece)!=ColorOf(destpiece))
    // checking movement logic
    // can get rid of team removal restiction, as that is already accounted for in the checkmove
    // can also get rid of check same place check, as that is also accounted for in check movement
    if(this.selectedpos==-1){
      let tocheck = this.checkMovement(fromrow,fromcol);
      rval = rval&&(CheckMovesArray(torow,tocol,tocheck));
    }
    else{
      rval = rval&&(CheckMovesArray(torow,tocol,this.selectedmoves));
    }
    return(rval);
  }

  select(row,col){
    let piece = this.board[row][col];
    if(0!=piece&&(this.whiteturn==(ColorOf(piece)=="white")&&!this.mate)){
      // only select a piece if it is their turn to move
      // and there is not checkmate
      let oldpos = this.selectedpos;
      this.selectedpos=[row,col];
      if(oldpos!=-1){
        let oldrow=oldpos[0];
        let oldcol=oldpos[1];
        if((oldrow==row)&&(oldcol==col)){
          this.deselect();
        }
      }
    }
    else{
      this.deselect();
    }
    if(this.selectedpos!=-1){
      this.selectedmoves=this.checkMovement(row,col);
      //console.log(this.selectedmoves.length);
      //PrintArray(this.selectedmoves);
    }
  }

  deselect(){
    this.selectedpos=-1;
    this.selectedmoves=[];
  }

  selected(){
    var piece=0;
    if(this.selectedpos!=-1){
      let row = this.selectedpos[0];
      let col = this.selectedpos[1];
      piece = this.at(row,col);
    }
    return(piece);
  }

  moveSelected(row,col){
    if(this.selected()!=0){
      let srow = this.selectedpos[0];
      let scol = this.selectedpos[1];
      if(this.move(srow,scol,row,col)){
        // if we moved the piece, deselect
        this.deselect();
        this.whiteturn = !this.whiteturn;
      } else{
        // otherwise, try to select the other spot
        this.select(row,col);
      }
    }
  }

  currentTurn(){
    if(this.mate){
      if(this.whiteturn){
        return("Black wins!");
      }
      else{
        return("White wins!");
      }
    }
    if(this.whiteturn){
      return("White's turn");
    }
    else{
      return("Black's turn");
    }
  }

  currentStatus(){
    return(this.checkstatus);
  }

  getLastMove(){
    let movestacksize = this.lastmovestack.length;
    if(movestacksize<=0){
      return("None");
    }
    else{
      let lastmove = this.lastmovestack[movestacksize-1];
      var movestr = lastmove[1]+","+lastmove[0]+" moved to "+lastmove[3]+","+lastmove[2];
      let capture = lastmove[4];
      let newform = lastmove[5];
      if(capture!=0){
        movestr+= " and captured: "+FullName(capture);
      }
      if(newform!=-1){
        movestr+= "<br>Promoted to "+FullName(newform);
      }
      return(movestr);
    }
  }

  undoLastMove(){
    if(this.lastmovestack.length>0){
      let lastmove = this.lastmovestack.pop();
      // undo the provious move
      let prow = lastmove[0];
      let pcol = lastmove[1];
      let crow = lastmove[2];
      let ccol = lastmove[3];
      let capt = lastmove[4];
      let newform = lastmove[5];
      this.board[prow][pcol] = this.board[crow][ccol];
      this.board[crow][ccol] = capt;
      this.selectedpos=-1;
      this.whiteturn = !this.whiteturn;
      if(newform!=-1){
        // if the piece was promoted last turn
        let color=ColorOf(newform);
        if(color=="white"){
          this.board[prow][pcol] = 'P';
        }
        else{
          this.board[prow][pcol] = 'p'
        }
      }
      if(this.lastmovestack.length>0){
        let prepremove=this.lastmovestack[this.lastmovestack.length-1];
        let predestrow = prepremove[2];
        let predestcol = prepremove[3];
        this.checkMate(predestrow,predestcol);
      }
      else{
        this.KingDanger();
      }
    }
  }

  checkMovement(row,col,calculatingdanger=false){
    // returns an array of row-column pairs
    let piece= this.board[row][col];
    let ptype = ClassOf(piece);
    let pcolor = ColorOf(piece);
    var ocolor = OppositeColor(pcolor);
    var moveset = [];
    if(ptype=="pawn"){
      // return the pawn's movement set
      // can only move one space away from home
      // special cases:
      //  - first move of pawn: pawn can move 2 spaces
      //  - pawn cannot move forward if blocked
      //  - pawn can move diagonally to capture
      //  - en passant: very niche, will ignore for now

      // getting the next row
      var nextrow = row;
      if(pcolor=="white"){
        nextrow += 1;
        // might as well check the first move special while here
        if(row==1){
          // if this is the first move of the white pawn
          // cannot hop over anything
          if((this.at(nextrow,col)==0)&&(this.at(3,col)==0)&&!calculatingdanger){
            moveset.push([3,col]);
          }
        }
      }
      else{
        nextrow -= 1;
        // might as well check the first move special while here
        if(row==6){
          // if this is the first move of the black pawn
          // cannot enter if there is a piece there
          // or if a piece is in the way
          if((this.at(nextrow,col)==0)&&(this.at(4,col)==0)&&!calculatingdanger){
            moveset.push([4,col]);
          }
        }
      }
      // checking directly in front of the pawn (not dangerous to enter for enemy)
      if((this.at(nextrow,col)==0)&&!calculatingdanger){
        moveset.push([nextrow,col]);
      }
      // checking next to that slot for captures (dangerous for enemy to enter)
      // checking to the left
      let leftcol = (8+(col-1))%8;
      if((ColorOf(this.board[nextrow][leftcol])==ocolor)||calculatingdanger){
        moveset.push([nextrow,leftcol]);
      }
      // checking to the right
      let rightcol = (col+1)%8;
      if((ColorOf(this.board[nextrow][rightcol])==ocolor)||calculatingdanger){
        moveset.push([nextrow,rightcol]);
      }
      // en-passant would go here
      // but it is much to complex
    } 
    else if(ptype=="king"){
      // the king can move to any adjacent space (including corners)
      // but only if that space is safe
      // they also have castling, but that is complex
      for(let rowadj=-1;rowadj<=1;rowadj++){
        for(let coladj=-1;coladj<=1;coladj++){
          var checkrow;
          var checkcol;
          if((rowadj==0)&&(coladj==0)){
            // dont want to count current space
            // so skip this loop
            continue;
          }
          else{
            checkrow = row+rowadj;
            checkcol = col+coladj;
            // check if the checked rows/pieces are out of range of the board
            if(!((0<=checkrow)&&(checkrow<8))){
              continue;
            }
            if(!((0<=checkcol)&&(checkcol<8))){
              continue;
            }
            let destination = [checkrow,checkcol];
            // if we are not considering all posiblities
            // i.e. we dont want to calculate a not-dangerous move where it might be
            // handling edge cases with kings
            if(!calculatingdanger){
              // if the spot is dangerous for this color
              if(this.checkDanger(checkrow,checkcol,pcolor)){
                // skip the spot
                continue;
              }
            }
            // with that out of the way
            // add the movement option if it is available (or we are calculating danger)
            if((ColorOf((this.board[checkrow][checkcol]))!=pcolor)&&!calculatingdanger){
              moveset.push(destination);
            }
          }
        }
      }
    }
    else if(ptype=="knight"){
      // knights can only move to one of 8 spaces
      // viable spaces denoted with X
      // *X***X*
      // X*****X
      // ***K***
      // X*****X
      // *X***X*
      for(let rowmod=-2;rowmod <=2; rowmod++){
        if(rowmod==0){
          // skipping the row that the knight is on
          continue;
        }
        for(let colmod=-2;colmod <= 2; colmod++){
          if((colmod==0) || (rowmod==colmod) || ((rowmod+colmod)==0)){
            // skipping the column that the knight is on
            // as well as the diagonals
            continue;
          }
          // whats left is the spaces mean for knight movement
          let checkrow = row+rowmod;
          if ((checkrow>=8)||(checkrow<0)){
            // skip slots off the top or bottom of the board
            continue;
          }
          // the (8+n)%8 is to acount for looping
          let checkcol = (8+col+colmod)%8;
          // if there is an open spot/enemey
          if(ColorOf(this.board[checkrow][checkcol])!=pcolor||calculatingdanger){
            moveset.push([checkrow,checkcol]);
          }
        }
      }
    }
    else{// the raycatsers:
      //  - rook (horizontal)
      //  - bishop (diagonal)
      //  - queen (both)
      var deltarow;
      var deltacol;
      if(ptype=="bishop" || ptype=="queen"){
        // the diagonal casters
        // for the for directions
        for(let i = 0; i < 4; i++){
          //generate these outputs:
          // 0 -> 0,0
          // 1 -> 0,1
          // 2 -> 1,0
          // 3 -> 1,1
          deltarow = Math.floor(i/2);
          deltacol = i%2;
          // make these in terms of -1,1
          // 0 -> -1
          // 1 -> 1
          deltarow = (deltarow*2)-1;
          deltacol = (deltacol*2)-1;
          // get the ray
          let ray = this.raycast(pcolor,row,col,deltarow,deltacol,calculatingdanger);
          // add the ray to our output
          moveset = moveset.concat(ray);
        }
      }
      if(ptype=="rook" || ptype=="queen"){
        // the horizonatl casters
        // for the four directions
        for(let i = 0; i < 4; i++){
          // generate these outputs:
          // 0 -> 0,1
          // 1 -> 1,0
          // 2 -> 0,1
          // 3 -> 1,0
          deltarow=i%2;
          deltacol=(i+1)%2;
          // this produces these outputs
          // 0,1 -> -1
          // 2,3 -> 1
          let deltamult = (Math.floor(i/2)*2)-1;
          // use it to convert deltas to these
          // 0 ->  0,-1
          // 1 -> -1, 0
          // 2 ->  0, 1
          // 3 ->  1, 0
          deltarow*=deltamult;
          deltacol*=deltamult;
          // get the ray
          let ray = this.raycast(pcolor,row,col,deltarow,deltacol,calculatingdanger);
          // add the ray to our output
          moveset = moveset.concat(ray);
        }
      }
    }
    return(moveset);
  }

  // a raycasting function
  raycast(color,startrow,startcol,deltarow,deltacol, calculatingdanger){
    let moveset=[];
    // reset checkrow and checkcol
    let checkrow = startrow;
    let checkcol = startcol;
    do{
      // update our checked row/column
      checkrow += deltarow;
      // if the row is out of bounds
      if ((checkrow>=8)||(checkrow<0)){
        // end the raycast
        break;
      }
      // get the looped column
      checkcol = (8+checkcol+deltacol)%8;
      // prepare the move tuple
      let move = [checkrow,checkcol];
      // raycast checking
      if(this.board[checkrow][checkcol]==0){
        // empty spot: add and continue
        moveset.push(move);
      }
      else{
        // something in the spot
        if((ColorOf((this.board[checkrow][checkcol]))!=color)||calculatingdanger){
          // add it to our moveset
          moveset.push(move);
        }
        // end the raycast
        break;
      }
    }while(true);
    //
    return(moveset);
  }

  KingDanger(){
    // computes the dangerous squares for the players to travel to
    // never shown to players
    // except for the implicit showing through king movement restrictions
    // reset both danger arrays
    this.whitedanger=[];
    this.blackdanger=[];
    for(let row=0;row<8;row++){
      for(let col=0;col<8;col++){
        // get the color of that piece
        let piececolor = ColorOf(this.board[row][col]);
        // get the piece type
        let piecetype = ClassOf(this.board[row][col]);
        // get the movement of that piece
        let piecemoves = this.checkMovement(row,col,true);
        // iterate throught the moves
        for(let index=0;index<piecemoves.length;index++){
          let move = piecemoves[index];
          if(piececolor=="white"){
            // if the move is a danger to black and is not in the array
            if(!CheckMovesArray2(move,this.blackdanger)){
              // add it to the array
              this.blackdanger.push(move);
            }
            // keeping track of the king
            if(piecetype=="king"){
              this.whiteking=[row,col]
            }
          } 
          
          else if(piececolor=="black"){
            // when it is a danger to white and not in the array
            if(!CheckMovesArray2(move,this.whitedanger)){
              // add it
              this.whitedanger.push(move);
            }
            // keeping track of the king
            if(piecetype=="king"){
              this.blackking=[row,col]
            }
          } else{
            continue;
          }
        }
      }
    }
  }

  getTileType(row,col){
    // start with base tile type
    let type="base";
    // check if this is a movement tile
    if(CheckMovesArray(row,col,this.selectedmoves)){
      type="move";
      // if the movement is a capture
      if(this.at(row,col)!=0){
        type="cap";
      }
    }
    else if(this.selectedpos!=-1){
      let selrow = this.selectedpos[0];
      let selcol = this.selectedpos[1];
      if((selrow==row)&&(selcol==col)){
        type="select";
      }
    }
    return(type);
  }

  checkMate(row,col){
    // checks if the pice put the king into check mate
    // parts of checkmate:
    //  - king is in danger (check)
    //  - king has no safe movement options
    //  - the piece applying check cannopt be taken
    // check for promotion
    let toundo = this.checkPromotion(row,col);
    // toundo means we cancelled promotion
    if(toundo){
      // undo last move
      this.undoLastMove();
      return;
    }
    // refresh danger and number of moves
    this.countPossibleMoves();
    // refresh the status
    this.checkstatus="";
    // begin calculating checkmate
    let checkmate=true;
    // see if our move applied check
    checkmate = checkmate&&this.checkCheck(row,col);
    console.log("check",checkmate);
    // see if we are still in danger
    checkmate = checkmate&&(!this.checkDanger(row,col));
    console.log("check and indanger",checkmate);
    // check the king's movement options
    let pcolor = ColorOf(this.board[row][col]);
    if("white"==pcolor){
      checkmate=checkmate&&(this.blackpossiblemoves>0);
    }
    else if ("black"==pcolor){
      checkmate=checkmate&&(this.whitepossiblemoves>0);
    }
    console.log("finalcheckmate",checkmate);
    if(checkmate){
      let ocolor=OppositeColor(pcolor);
      this.checkstatus=ocolor+" in checkmate";
    }
    this.mate=checkmate;
  }

  checkCheck(row,col){
    // input a piece position to see if it applies check
    let tcolor = ColorOf(this.board[row][col]);
    var ocolor=OppositeColor(tcolor);
    let tmoves = this.checkMovement(row,col);
    for(let i=0;i<tmoves.length;i++){
      let crow = tmoves[i][0];
      let ccol = tmoves[i][1];
      let pname = this.at(crow,ccol);
      let kname = ocolor+"king";
      if(pname==kname){
        this.checkstatus=ocolor+" in check";
        return(true);
      }
    }
    return(false);
  }

  checkDanger(row,col,color="default"){
    // checks if the position is dangerous for a given color
    // if no color is given, it will look at the piece color
    if(color=="default"){
      color=ColorOf(this.board[row][col]);
      if(color==0){
        console.error("please input a color");
        return;
      }
    }
    // now that we have our color
    // let us check the danger for that color
    if(color=="white"){
      return(CheckMovesArray(row,col,this.whitedanger));
    }
    else if(color=="black"){
      return(CheckMovesArray(row,col,this.blackdanger));
    }
    else{
      console.error(color,"is not an accepted color");
    }
  }

  countPossibleMoves(){
    // counts the total number of possible moves for each player
    this.KingDanger();
    this.whitepossiblemoves=0;
    this.blackpossiblemoves=0;
    for(let row=0;row<8;row++){
      for(let col=0;col<8;col++){
        let color = ColorOf(this.board[row][col]);
        let moves = this.checkMovement(row,col);
        if("white"==color){
          this.whitepossiblemoves+=moves.length;
        }
        else if("black"==color){
          this.blackpossiblemoves+=moves.length;
        }
      }
    }
  }

  checkPromotion(row,col){
    // checks if the pawn has reached promotion
    var piecerep = this.board[row][col];
    let type = ClassOf(piecerep);
    let color = ColorOf(piecerep);
    if(type=="pawn"){
      // can only promote pawn
      if(((color=="white")&&(row==7))||((color=="black")&&(row==0))){
        // can only promote pawns that have reached the end
        var num=-1;
        do{
          let promptlabel="Please enter the piece you would like to promote to: \n"+
                          "It must be on of these: "+promotablenames;
          let name=prompt(promptlabel,"queen");
          if(name!=null){
            console.log(name);
            num=PromotableClassNumber(name);
            console.log(num);
          }
          else{
            // catching if the prompt was cancelled
            break;
          }
        }while(num==-1);
        switch(num){
          case 0:
            if(color=="white"){
              piecerep='Q';
            }
            else{
              piecerep='q';
            }
            break;
          case 1:
            if(color=="white"){
              piecerep='N';
            }
            else{
              piecerep='n';
            }
            break;
          case 2:
            if(color=="white"){
              piecerep='R';
            }
            else{
              piecerep='r';
            }
            break;
          case 3:
            if(color=="white"){
              piecerep='B';
            }
            else{
              piecerep='b';
            }
            break;
          default:
            return(true);
        }
        this.board[row][col] = piecerep;
        this.lastmovestack[this.lastmovestack.length-1][5]=piecerep;
      }
    }
  return(false);
  }
}