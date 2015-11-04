/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/


var numbversions=24;
var version =0;

var rl = Math.random()>.5;

var rlstims = [];

var errorstart =0;

var total_score= 0;

var multiplyer  = 1;

var trial_type =[];

var timingnum = 300;

var RT= [];
var responseTime=1000;




//tell which side the colors show up on.
//sometimes they alternated, now they are straightforward.
if (rl){
	for(i=0;i<numbversions; i++){
		rlstims.push(0);
	}
}else{
	for(i=0;i<numbversions; i++){
		rlstims.push(1);
}}

var StroopExperiment = function() {

	var wordon, // time word is presented
	    listening = false,
		errorlistening = false;



	var stimNumber = 1;
	var colorNumber = 2;

	var trialNumber = 32;

	var thistrial = 0;

	var stims = [];

	for (var i = 0; i <= stimNumber-1; i++) {
		stims.push(i);
	}

	var colstims = [];
	for (var i = 0; i <= colorNumber-1; i++) {
		colstims.push(i);
	}




	//var target_shapes = _.sample(stims,3);
	var target_colors = _.shuffle(colstims,3);

	total_score = 0;


	//set order

	multiplyer=1;

	var bonus_message= "";

	//switch(version ){
	//	case(10):
	//		multiplyer = 2;
	//		var bonus_message = "This is a high-effort round, please try hard!";
	//		break;
	//	case(15):
	//		multiplyer = 2;
	//		var bonus_message = "This is a high-effort round, please try hard!";
	//		break;
	//	case(20):
	//		multiplyer = 2;
	//		var bonus_message = "This is a high-effort round, please try hard!";
    //
	//		break;
	//	case(25):
	//		multiplyer = 2;
	//		var bonus_message = "This is a high-effort round, please try hard!";
    //
	//		break;
	//	case(30):
	//		multiplyer = 2;
	//		var bonus_message = "This is a high-effort round, please try hard!";
    //
	//		break;
	//	case(35):
	//		multiplyer = 2;
	//		var bonus_message = "This is a high-effort round, please try hard!";
	//		break;
    //
    //
	//}




	if(rlstims[version]===0){
		var offset1 = 380;
		var offset2 = 210;
		var color1 = "j";
		var color2 = "f";

	}else{
		var offset1 = 210;
		var offset2 = 380;
		var color1 = "f";
		var color2 = "j";
	}




	var stimuli = [];

	for (var i = 1; i <= trialNumber/2; i++) {
		stimuli.push([2, 1, color1])
	}

	for (var i = 1; i <= trialNumber/2; i++) {
		stimuli.push([7, 1, color2])
	}

	var stoptrial = [];



	if(version !== 0) {


		for (var i = 1; i <= trialNumber / 4; i++) {
			stoptrial.push("stop")
		}

		for (var i = 1; i <= trialNumber * (3 / 4); i++) {
			stoptrial.push("go")
		}

	}else{

		for (var i = 1; i <= trialNumber; i++) {
			stoptrial.push("go")
		}

	}


	function median(values) {

		values.sort( function(a,b) {return a - b;} );

		var half = Math.floor(values.length/2);

		if(values.length % 2)
			return values[half];
		else
			return (values[half-1] + values[half]) / 2.0;
	}


	if(version ===1){
		responseTime = median(RT);
	}








	stimuli = _.shuffle(stimuli);
	stoptrial = _.shuffle(stoptrial);







	//for (i=0; i < trialNumber;i++){
	//	timingnum.push(1250 +(Math.random()*1000))
	//};
	//stop signal task.


	var trialscore = Array.apply(null, Array(trialNumber)).map(Number.prototype.valueOf,0);
	var totalscore = 0;

	var adj_totalscore = 0;
	var adj_trialscore = 0;

	var hits = 0;
	var misses = 0;
	var rt_bonus = 0;


// need actual offset function







	//returns arbitrary polygons
	function polygon(ctx, x, y, radius, sides, startAngle, anticlockwise) {
		if (sides < 3) return;
		var a = (Math.PI * 2)/sides;
		a = anticlockwise?-a:a;
		ctx.save();
		ctx.translate(x,y);
		ctx.rotate(startAngle);
		ctx.moveTo(radius,0);
		for (var i = 1; i < sides; i++) {
			ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
		}
		ctx.closePath();
		ctx.restore();
	}


	//returns arbitrary stars

	function drawStar(ctx,cx,cy,spikes,outerRadius,innerRadius){
		var rot=Math.PI/2*3;
		var x=cx;
		var y=cy;
		var step=Math.PI/spikes;

		ctx.strokeSyle="#000";
		ctx.moveTo(cx,cy-outerRadius);
		for(i=0;i<spikes;i++){
			x=cx+Math.cos(rot)*outerRadius;
			y=cy+Math.sin(rot)*outerRadius;
			ctx.lineTo(x,y);
			rot+=step;

			x=cx+Math.cos(rot)*innerRadius;
			y=cy+Math.sin(rot)*innerRadius;
			ctx.lineTo(x,y);
			rot+=step
		}
		ctx.lineTo(cx,cy-outerRadius);

	}



	var drawcolor = function(ctx,stim_color) {

		switch (stim_color) {
			case 0:
				var colorstim = "red";
				break;
			case 1:
				var colorstim = "blue";
				break;
			case 2:
				var colorstim = "green";

		}


		ctx.fillStyle = colorstim;
	};

	var drawshapes = function(ctx,centerx,centery,radius,radius_inner,stim_type) {

		ctx.beginPath();

		switch (stim_type) {
			case 0:
			case 1:
			case 2:
			case 3:
				polygon(ctx, centerx, centery, radius, stim_type + 3, Math.PI * 1.5, false);
				ctx.stroke();
				break;
			case 4:
			case 5:
				drawStar(ctx, centerx, centery, stim_type, radius, radius_inner);
				ctx.stroke();
				ctx.closePath();
				break;
			case 6:
				drawStar(ctx, centerx, centery, stim_type + 2, radius, radius_inner);
				ctx.stroke();
				ctx.closePath();
				break;

			case 7:
				drawStar(ctx, centerx, centery, 20, radius, radius_inner);
				ctx.stroke();
				ctx.closePath();
				break;

			case 8:
				ctx.arc(centerx, centery, radius, 0, Math.PI * 2, true);
				ctx.fill();
				break;
			case 9:
				polygon(ctx, centerx, centery, radius, 4,Math.PI *.25, false);
				ctx.stroke();

		}



		ctx.fill();

	};

	var firsttrial=true;





	var next = function() {
		if (stimuli.length===0) {
			listening = false;
			errorlistening = false;
			finish();
		}
		else if (firsttrial===true){
        //
			d3.select("#query")
				.append("canvas")
				.attr("width", 600)
				.attr("height", 200)
				.attr("id", "InstructionStim");
        //
			var canvasIn = document.getElementById('InstructionStim');
			var ctxIn = canvasIn.getContext('2d');

			ctxIn.font = "20px Arial";

			ctxIn.fillText("Get ready to start!",115,20);
			ctxIn.fillText(bonus_message,115,45);

			setTimeout(function(){
				next()}, 1500);
			firsttrial=false;



        //
		}
		else {
			adj_trialscore = 0;
			hits = 0;
			misses = 0;
			rt_bonus = "Good";

			d3.select("#InstructionStim").remove();

			thistrial = thistrial+1;
			stim = stimuli.shift();


			wordon = new Date().getTime();
			timenum = timingnum;
			stim_end = wordon + timenum;
			trial_type = stoptrial.shift();



			d3.select("#query")
				.append("canvas")
				.attr("width", 600)
				.attr("height", 200)
				.attr("id", "InstructionStim");

			var canvasIn = document.getElementById('InstructionStim');
			var ctxIn = canvasIn.getContext('2d');

			ctxIn.font = "20px Arial";

			if(trial_type==="go"){
				listening=true;
				errorlistening=false;
			}else{
				listening=false;
				errorlistening=true;
			}





			//if (Math.random()<.1){
			//	if (offset1===350){
			//		//switch shapes to left
			//		offset1=0;
			//		offset2=350;
			//		switch(stim[3]) {
			//			case "0":
			//				stim[3] = "s";
			//				break;
			//			case "1":
			//				stim[3] = "d";
			//				break;
			//			case "2":
			//				stim[3] = "f";
			//				break;
			//		}
            //
			//		switch(stim[2]) {
			//			case "0":
			//				stim[2] = "j";
			//				break;
			//			case "1":
			//				stim[2] = "k";
			//				break;
			//			case "2":
			//				stim[2] = "l";
			//				break;
			//		}
            //
            //
            //
            //
			//	}else{
			//		//switch shapes to right
			//		offset1=350;
			//		offset2=0;
            //
			//		switch(stim[3]) {
			//			case "0":
			//				stim[3] = "j";
			//				break;
			//			case "1":
			//				stim[3] = "k";
			//				break;
			//			case "2":
			//				stim[3] = "l";
			//				break;
			//		}
            //
			//		switch(stim[2]) {
			//			case "0":
			//				stim[2] = "s";
			//				break;
			//			case "1":
			//				stim[2] = "d";
			//				break;
			//			case "2":
			//				stim[2] = "f";
			//				break;
			//		}
			//	}
            //
            //
			//}
            //
			//if (offset1===350){
			//	//switch shapes to left
            //
			//	//alert([typeof stim[2],stim[2], typeof ["2"]])
            //
			//	switch(stim[3][0]) {
			//		case 0:
			//			stim[3] = "j";
			//			break;
			//		case 1:
			//			stim[3] = "k";
			//			break;
			//		case 2:
			//			stim[3] = "l";
			//			break;
			//	}
            //
			//	switch(stim[2][0]) {
			//		case 0:
			//			stim[2] = "s";
			//			break;
			//		case 1:
			//			stim[2] = "d";
			//			break;
			//		case 2:
			//			stim[2] = "f";
			//			break;
			//	}
            //
            //
            //
            //
			//}else{
			//	//switch shapes to right
            //
			//		switch(stim[3][0]) {
			//			case 0:
			//				stim[3] = "s";
			//				break;
			//			case 1:
			//				stim[3] = "d";
			//				break;
			//			case 2:
			//				stim[3] = "f";
			//				break;
			//		}
            //
			//		switch(stim[2][0]) {
			//			case 0:
			//				stim[2] = "j";
			//				break;
			//			case 1:
			//				stim[2] = "k";
			//				break;
			//			case 2:
			//				stim[2] = "l";
			//				break;
			//		}
            //
            //
			//}
			//alert(typeof stim[2][0]);


			show_word( stim[0],stim[1],trial_type);







			ctxIn.fillText("Press",190,20);
			ctxIn.fillText("F",205,45);


			ctxIn.fillText("Press",360,20);
			ctxIn.fillText("J",375,45);



			//shapes

			ctxIn.fillStyle = "black";

			drawcolor(ctxIn,1);

			drawshapes(ctxIn,offset1,75,20,10,2);

			//colors

			drawcolor(ctxIn,1);

			drawshapes(ctxIn,offset2,75,20,10,7);

			//drawcolor(ctxIn,target_colors[1]);
            //
			//drawshapes(ctxIn,offset2+120,75,20,10,9);
            //
			//drawcolor(ctxIn,target_colors[2]);
            //
			//drawshapes(ctxIn,offset2+210,75,20,10,9);



			//alert([stim[0],stim[0][0],stim[1],stim[1][0]]);

			numresponse =0;

			if(trial_type=="stop"){
				setTimeout(function(){
					stop_signal_show()}, timenum);
				//	setTimeout(function(){
				//		next();
				//	},750);
				//
				//},timenum)

			}



		}
	};

	
	var response_handler = function(e) {


		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {
			//case 83:
			//	// "S"
			//	response = "s";
			//	break;
			//case 68:
			//	// "D"
			//	response = "d";
			//	break;
			case 70:
				// "F"
				response = "f";
				break;

			case 74:
				// "J"
				response = "j";
				break;
			//case 75:
			//	// "K"
			//	response = "k";
			//	break;
			//case 76:
			//	// "L"
			//	response = "l";
			//	break;
            //
            //
			//default:
			//	response = "";
			//	break;
		}

			//if (stim[3] === "none" && response === stim[2]) {
			//	var hit = 1;
			//}else if (response === stim[3]) {
			//var hit = 1;
			//} else {
			//var hit = -1;
			//}

		var rt = new Date().getTime() - wordon;

		if (stim[2] === response){
			if (rt < responseTime) {
				var hit = "correct";
			}else{
				var hit = "slow";

			}
			//alert([ typeof stim[2],typeof response,hit]);
		}else{
			var hit = "mistake";
			//alert([typeof stim[2], typeof response,hit]);
		}

		//alert([stim,response]);

		participant_score(hit,rt);

		RT.push(rt);



		psiTurk.recordTrialData({
				'phase': "TEST",
				'block': version,
				'color': stim[0],
				'shape': stim[1],
				'response': response,
				'hit': hit,
				'rt': rt,
				'trial_duration': timenum,
				'time': "duringtrial",
			'score': "",
			"thistrial":thistrial
				//'scorec': "",
				//'scoref': ""
			});

		numresponse++;

		if(trial_type==="go"){
			end_trial();
		}
		//add the next trial here.

		listening = false;





	};

	var score_listener = function(e) {

		if (!errorlistening) return;



		var keyCode = e.keyCode,
			response;


		var rt = new Date().getTime() - errorstart;

		switch (keyCode) {
			//case 83:
			//	// "S"
			//	response = "s";
			//	break;
			//case 68:
			//	// "D"
			//	response = "d";
			//	break;
			case 70:
				// "F"
				response = "f";
				break;

			case 74:
				// "J"
				response = "j";
				break;
			//case 75:
			//	// "K"
			//	response = "k";
			//	break;
			//case 76:
			//	// "L"
			//	response = "l";
			//	break;
			//
			//
			//default:
			//	response = "";
			//	break;
		}

		participant_score("after",rt);



		psiTurk.recordTrialData({
			'phase': "TEST",
			'block': version,
			'color': stim[0],
			'shape': stim[1],
			'time': "aftertrial",
			'response': response,
			'hit': "after",
			'rt': rt,
			'trial_duration': timenum,
			'score':"",
			"thistrial":thistrial
			//'scorec': "",
			//'scoref': ""

		});

		//d3.select("#word").remove();
        //
		//d3.select("#score")
		//	.append("div")
		//	.attr("id","word")
		//	.style("color","black")
		//	.style("text-align","center")
		//	.style("font-size","150px")
		//	.style("font-weight","400")
		//	.style("margin","190px")
		//	.text(adj_trialscore);

		errorlistening = false;




	};





	var participant_score = function(hit,rt){

		//just calculate the bonus



		switch(hit){
			case "correct":
				rt_bonus = "Good";
				break;
			case "mistake":
				rt_bonus = "Error";
				break;
			case "slow":
				rt_bonus = "Too Slow";
				break;
			case "after":
				rt_bonus = "Don't Press"

		}




		//trialscore[thistrial-1] = trialscore[thistrial-1]+hit;
		//totalscore = totalscore + hit;



	};







	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
		d3.select("#InstructionStim").remove();


		currentview = new Questionnaire();
	};

	//var fing




	
	var show_word = function(stim_type,stim_color) {

		d3.select("#word").remove();


		d3.select("#stim")
			.append("canvas")
			.attr("width", 600)
			.attr("height", 450)
			.attr("id", "canvasStim");

		var canvas = document.getElementById('canvasStim');
		var ctx = canvas.getContext('2d');

		var centerx = 300;
		var centery = 300;
		var radius = 150;
		var radius_inner = 75;
		var stimcolor = "red";


		drawcolor(ctx, stim_color);


		drawshapes(ctx,centerx,centery,radius,radius_inner,stim_type);


		//if (thistrial>1){
		//	//ctx.fillText(trialscore[thistrial-1],375,45);
		//	//ctx.fillText(totalscore,375,80);
        //
		//	d3.select("#score")
		//		.append("div")
		//		.attr("id","word")
		//		.style("text-align","center")
		//		.style("font-size","50px")
		//		.style("font-weight","40")
		//		.style("margin","5px")
		//		.text(trialscore[thistrial-2]);
		//}

		//txtcntx = document.getElementById('#canvasStim').getContext('2d');
		//ctx.fillStyle = "black";
		//if(thistrial >= 2){
		//	//this is the score.
		//	ctx.fillText("+", 295, 305);
		//}



	};


	var end_trial =function(){

		d3.select("#canvasStim").remove();
		d3.select("#InstructionStim").remove();
		d3.select("#word").remove();

		listening = false;
		errorlistening= false;




		remove_word();

	};

	var stop_signal_show = function(){
		d3.select("#canvasStim").remove();
		d3.select("#InstructionStim").remove();


		//listening=false;
		//errorlistening=true;
		errorstart = new Date().getTime();



			d3.select("#score")
				.append("div")
				.attr("id", "word")
				.style("color", "black")
				.style("text-align", "center")
				.style("font-size", "350px")
				.style("font-weight", "900")
				.style("margin", "190px")
				.text("X");

		setTimeout(end_trial,750);


	};

	var remove_word = function() {
		errorlistening=false;

		if(rt_bonus=="Good"){
			var message_color="green";
			if(trial_type==="stop"){
				timingnum = timingnum +50;
			}

		}else{
			var message_color="red";
			if(trial_type==="stop"){
				timingnum = timingnum -50;
			}
		}







		d3.select("#score")
			.append("div")
			.attr("id","word")
			.style("color",message_color)
			.style("text-align","center")
			.style("font-size","150px")
			.style("font-weight","400")
			.style("margin","190px")
			.text(rt_bonus);
			//.text(displayf+" "+ displayc);


		setTimeout(next,750+Math.random()*1000);

		psiTurk.recordTrialData({
			'phase': "TEST",
			'block': version,
			'color': stim[0],
			'shape': stim[1],
			'time': "scoreT",
			'response': "",
			'hit': "",
			'rt': "",
			'trial_duration': timenum,
			'score': score1,
			"thistrial":thistrial
		});

		total_score = total_score + adj_trialscore;



		//alert(stim);


	};

	var listeners = function(e){
		score_listener(e);
		response_handler(e);

	};

	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(listeners);

	// Start the test
	next();
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire'+version, 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id+version, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id+version, this.value);
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};



	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){finish()}); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire'+version, 'status':'begin'});


	
	$("#next").click(function () {
	    record_responses();
		//alert( "You earned "+total_score+" points in the last game!" );
		version = version +1;
		if (version >= numbversions){
			psiTurk.saveData({
				success: function(){
					psiTurk.computeBonus('compute_bonus', function() {
						psiTurk.completeHIT(); // when finished saving compute bonus, the quit
					});
				},
				error: prompt_resubmit});
		}else{

			currentview = new StroopExperiment();
		}

	});




};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
