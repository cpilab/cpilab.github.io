////////////////////////////////////////////////////////////////////////
//                  JS-CODE FOR Bandits Experiment                    //
//                       AUTHOR: ERIC SCHULZ                          //
//                       TUEBINGEN, May 2022                          //
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//INTIALIZE 
////////////////////////////////////////////////////////////////////////

//data storage ref
var ntrials = 10,//number of trials
    nblocks=2,//number of blocks
    trial=0,//trial counter
    block=0,//block counter
    out=0,//outcome
    totalscore=0,//total score
    index=0,//index
    age=0,//age of participant
    gender=0,//gender of particpant
    instcounter=0,//instruction counter
    overallscore=0,//overall score
    xcollect=[],//collecting the selected position
    ycollect=[],//collecting the returned output
    timecollect=[],//collection the timestamps
    x=[],//underlying position
    y=[],//underlying outcome
    timeInMs=0,//reaction time
    letter='<input type="image" src="letters/',//the letter
    pspecs='.png"  width="120" height="120"'//size of box
    
//borders for selections
var borders=['border="1">','border="1">'];

//leter boxes and their borders
var b1=letter+'F'+pspecs+borders[0],
    b2=letter+'J'+pspecs+borders[1];

//randomly select the first block (either 0 or 1)
const firstBlock = Math.floor(Math.random() * 2);  //will be 0 or 1
const secondBlock = firstBlock === 0 ? 1 : 0;  //will be the opposite of firstBlock
const blockOrder = [firstBlock, secondBlock];  //will be an array of 0 and 1

var currentBlock = blockOrder[block];

//generating lists to collect the outcomes
for(var i=0; i<nblocks; i++) 
{
    //outcomes of arm positions
    xcollect[i] = Array.apply(null, Array(0)).map(Number.prototype.valueOf,-99);
    //outcome of y position
    ycollect[i] = Array.apply(null, Array(0)).map(Number.prototype.valueOf,-99);
    //timestamp collection
    timecollect[i] = Array.apply(null, Array(0)).map(Number.prototype.valueOf,-99);
}


////////////////////////////////////////////////////////////////////////
//CREATE HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////

//function to hide one html div and show another
function clickStart(hide, show)
{
    document.getElementById(hide).style.display ='none' ;
    document.getElementById(show).style.display ='block';
    window.scrollTo(0,0);        
}

//changes inner HTML of div with ID=x to y
function change(x,y)
{
    document.getElementById(x).innerHTML=y;
}

//Hides div with id=x
function hide(x)
{
    document.getElementById(x).style.display='none';
}

//shows div with id=x
function show(x)
{
    document.getElementById(x).style.display='block';
    window.scrollTo(0,0);
}

//Display a float to a fixed percision
function toFixed(value, precision) 
{
    var precision = precision || 0,
        power = Math.pow(10, precision),
        absValue = Math.abs(Math.round(value * power)),
        result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

    if (precision > 0) {
        var fraction = String(absValue % power),
            padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
        result += '.' + padding + fraction;
    }
    return result;
}

////////////////////////////////////////////////////////////////////////
//Instruction Check
////////////////////////////////////////////////////////////////////////
var turkid=0;
function gettingstarted()
{
  turkid=document.getElementById("mturk").value;
  if (turkid=="WorkerID")
  	{
  		alert("Please provide your Mechanical Turk Worker ID. We will need your ID for paying the bonus.");
  	}else
  	{
  		clickStart("page3", "page4");
  	}
}

function instructioncheck()
{
    //check if correct answers are provided
    if (document.getElementById('icheck1').checked) {var ch1=1}
    if (document.getElementById('icheck2').checked) {var  ch2 = 1}
    if (document.getElementById('icheck3').checked) {var  ch3 = 1}
    //are all of the correct
    var checksum=ch1+ch2+ch3;
    if (checksum===3){
      //if correct, continue
      begintrial();
      clickStart('page7', 'page8');
      //alert
      alert('Great, you have answered all of the questions correctly. The study will now start.');
    } else{
    	instcounter++;
        //if one or more answers are wrong, raise alert box
        alert('You have answered some of the questions wrong. Please try again.');
        //go back to instructions
        clickStart('page7', 'page4');
    }
}

////////////////////////////////////////////////////////////////////////
//Experiment
////////////////////////////////////////////////////////////////////////
var blockStatusDiv = document.getElementById("currentGameRules");
var blockStatusHist = document.getElementById("currentGameHistory");

//this function initializes a trial
function begintrial()
{
  //only allowing for one press
  var returnpressed = 0;
  //initialize time count
  timeInMs = Date.now()
  if (currentBlock === 0) {
    blockStatusDiv.innerHTML = "<br><h3>You are now playing <b>Game 1</b></h3><br>\
                                The rules of the game are as follows:<br>\
                                If you choose <b>J</b> and the other player chooses <b>J</b>, then you win <b>8</b> points and the other player wins <b>8</b> points.<br>\
                                If you choose <b>J</b> and the other player chooses <b>F</b>, then you win <b>0</b> points and the other player wins <b>10</b> points.<br>\
                                If you choose <b>F</b> and the other player chooses <b>J</b>, then you win <b>10</b> points and the other player wins <b>0</b> points.<br>\
                                If you choose <b>F</b> and the other player chooses <b>F</b>, then you win <b>5</b> points and the other player wins <b>5</b> points.<br><br>";
  } else if (currentBlock === 1) {
    blockStatusDiv.innerHTML =  "<br><h3>You are now playing <b>Game 2</b></h3><br>\
                                The rules of this game are as follows:<br>\
                                If you choose <b>J</b> and the other player chooses <b>J</b>, then you win <b>7</b> points and the other player wins <b>10</b> points.<br>\
                                If you choose <b>J</b> and the other player chooses <b>F</b>, then you win <b>0</b> points and the other player wins <b>0</b> points.<br>\
                                If you choose <b>F</b> and the other player chooses <b>J</b>, then you win <b>0</b> points and the other player wins <b>0</b> points.<br>\
                                If you choose <b>F</b> and the other player chooses <b>F</b>, then you win <b>10</b> points and the other player wins <b>7</b> points.<br><br>"
  }
  //get the pressed key
  $(document).keypress(function(e) 
    {
          //if key equals F       
          if(e.which == 102 & returnpressed == 0)  
                  { 
                    //indicate that something has been pressed          
                    returnpressed=1;
                    //get the time that has passed
                    timeInMs=Date.now()-timeInMs;
                    //call the function for that position
                    myfunc(0);
                  }
          //same spiel if key equals J
          if(e.which == 106 & returnpressed == 0)  
                  {
                    returnpressed=1;
                    timeInMs=Date.now()-timeInMs;
                    myfunc(1);
                  }
            }
      );
}

//function to draw the letter boxes into the HTML
function drawletters()
{
  change('arm1', b1);
  change('arm2', b2);
}

//do this once at start
drawletters();

let opponentLookup_bos = {};

fetch('pd_10rounds_dict.json')
  .then(response => response.json())
  .then(data => opponentLookup_bos = data);

let opponentLookup_pd = {};

fetch('bos_10rounds_dict.json')
  .then(response => response.json())
  .then(data => opponentLookup_pd = data);

function calculate_points_bos(playerChoice, opponentChoice) {
  let playerPoints = 0;
  let opponentPoints = 0;
  // Logic to calculate points
  if (playerChoice === 1 && opponentChoice === "J") {
    playerPoints = 7;
    opponentPoints = 10;
  }
  if (playerChoice === 0 && opponentChoice === "F") {
    playerPoints = 10;
    opponentPoints = 7;
  }
  if (playerChoice === 1 && opponentChoice === "F") {
    playerPoints = 0;
    opponentPoints = 0;
  }
  if (playerChoice === 0 && opponentChoice === "J") {
    playerPoints = 0;
    opponentPoints = 0;
  }
  return { playerPoints, opponentPoints };
}

function calculate_points_pd(playerChoice, opponentChoice) {
  let playerPoints = 0;
  let opponentPoints = 0;
  // Logic to calculate points
  if (playerChoice === 1 && opponentChoice === "J") {
    playerPoints = 8;
    opponentPoints = 8;
  }
  if (playerChoice === 0 && opponentChoice === "F") {
    playerPoints = 5;
    opponentPoints = 5;
  }
  if (playerChoice === 1 && opponentChoice === "F") {
    playerPoints = 0;
    opponentPoints = 10;
  }
  if (playerChoice === 0 && opponentChoice === "J") {
    playerPoints = 10;
    opponentPoints = 0;
  }
  return { playerPoints, opponentPoints };
}

let playerChoices = "";  // Initialize an empty string to store player choices
let historyMessage = "";  // Initialize an empty string to store the history of the game

// Function that executes the bandit
function myfunc(inp) {
  // Initialize the opponent's choice
  let opponentChoice;

  if (currentBlock === 0) {
    // Lookup opponent's choice based on player's past choices
    opponentChoice = opponentLookup_bos[playerChoices];
  } else if (currentBlock === 1) {
    // Lookup opponent's choice based on player's past choices
    opponentChoice = opponentLookup_pd[playerChoices];
  }

  // Append the player's choice to the running record
  playerChoices += inp === 0 ? "F" : "J";

  // Calculate points for both the player and opponent
  // let { playerPoints, opponentPoints } = calculate_points_bos(inp, opponentChoice);
  // Choose which calculatePoints function to use based on the current block
  let playerPoints, opponentPoints;
  if (currentBlock === 0) {
    ({ playerPoints, opponentPoints } = calculate_points_pd(inp, opponentChoice));
  } else if (currentBlock === 1) {
    ({ playerPoints, opponentPoints } = calculate_points_bos(inp, opponentChoice));
  }

  out=playerPoints;
  
  // Collect the chosen location
  xcollect[block][trial] = inp; 
  // Collect returned value
  ycollect[block][trial] = out;
  // Collect reaction time
  timecollect[block][trial] = timeInMs;

  // Mark the selected option
  borders[inp] = 'border="4">';
  // Update letter boxes
  let b1 = letter + 'F' + pspecs + borders[0];
  let b2 = letter + 'J' + pspecs + borders[1];
  // Draw the options with their letters; now the chosen one has a thicker frame
  drawletters();

  // Display choices and points for both participant and opponent
  let outcomeMessage = `
    You chose ${inp === 0 ? "F" : "J"}, Opponent chose ${opponentChoice}<br>
    You won ${playerPoints} points, Opponent won ${opponentPoints} points
  `;

  historyMessage += `
    In round <b>${trial+1}</b>, you chose <b>${inp === 0 ? "F" : "J"}</b> and your opponent chose <b>${opponentChoice}</b>. Thus, you won <b>${playerPoints}</b> points and your opponent won <b>${opponentPoints}</b> points.<br>
  `;

  // Display on screen
  change('outcome', outcomeMessage);

  // Set a timeout; after 2 seconds, start the next trial
  setTimeout(function() {
    nexttrial();
  }, 2000);

}

function nexttrial()
{
  change('currentGameHistory', historyMessage);
  //check if trials are smaller than the maximum trial number
  if (trial+1<ntrials)
  {
    //set the borders back to normal
    borders=['border="1">','border="1">'];
    //change the letters again
    b1=letter+'F'+pspecs+borders[0];
    b2=letter+'J'+pspecs+borders[1];
    //draw options and their letters
    drawletters();
    //begin new trial
    begintrial();
    //track total score
    totalscore += out;
    overallscore += out;
    //to be inserted total score
    var inserts='Total Score: '+toFixed(totalscore,0);
    //show total score on screen
    change('score', inserts);
    //increment trial number
    trial++;
    //to be inserted number of trials left
    var insertt='Number of rounds left: '+(ntrials-trial);
    //show on screen
    change('remain', insertt);
    //change ooutcome back to please choose an option
    change('outcome', "Please choose an option!");  
  }
  //if trial numbers exceed the total number, check if more blocks are available
  else if (trial+1==ntrials & block+1<nblocks)
  {
    //tell them that this block is over
    alert("Game " +(block+1)+" out of 2 is over. Please press return to continue with the next game.")
    //start next block
    nextblock();
  }else
  {
    //Otherwise --if blocks exceed total block number, then the experiment is over
    alert("The experiment is over. You will now be directed to the next page.")
    clickStart('page8', 'page9');
  }
}

//function to initialize next block
function nextblock()
{
  playerChoices = "";
  historyMessage = "";
  change('currentGameHistory', historyMessage);
  //update overall score
  // overallscore=overallscore+totalscore;
  //borders back to normal
  borders=['border="1">','border="1">'];
  //new letters and boxes
  b1=letter+'F'+pspecs+borders[0];
  b2=letter+'J'+pspecs+borders[1];
  //draw options
  drawletters();
  //increment block number
  block++;
  //get random block
  currentBlock = blockOrder[block];
  //begin a new trial
  begintrial();
  //set trial number back to 0
  trial=0;
  //total score back to 0
  totalscore=0;
  //insert total score
  var inserts='Total Score: '+toFixed(totalscore,0);
  //put on screen
  change('score', inserts);
  //number of trials left
  var insertt='Number of trials left: '+(ntrials-trial);
  //on screen
  change('remain', insertt);
  //ask them to choose an outcome
  change('outcome', "Please choose an option!");
}

////////////////////////////////////////////////////////////////////////
//Demographics & Finish
////////////////////////////////////////////////////////////////////////
//sets the selected gender
function setgender(x)
{
  gender=x;
  return(gender)
}

//sets the selected age
function setage(x)
{
  age=x;
  return(age)
}

//data to save string to downloads
function saveText(text, filename){
  //creat document
  var a = document.createElement('a');
  //set ref
  a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
  //to download
  a.setAttribute('download', filename);
  //submit
  a.click()
}

function mysubmit()
{
  //change page
  clickStart('page9','page10');
  //claculate score
  var presenttotal='You have gained a total score of '+toFixed(overallscore,0)+'.';
  //calculate money earned
  var money =2+1.5*(overallscore/(50*nblocks*ntrials));
  money=toFixed(money, 2);
  var presentmoney='This equals a total reward of $'+money+'.';
  //show score and money
  change('result',presenttotal); 
  change('money',presentmoney);
  //all data to save
  saveDataArray = {
    'xcollect': xcollect,
    'ycollect': ycollect,
    'timecollect': timecollect,
    'money': money,
    'age': age,
    'instcounter': instcounter,
    'turkid': turkid,
    
  };
  //save data
  saveText(JSON.stringify(saveDataArray), 'banditData.'+turkid + '.JSON');
}
////////////////////////////////////////////////////////////////////////
//The END
////////////////////////////////////////////////////////////////////////