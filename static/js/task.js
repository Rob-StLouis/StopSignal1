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
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
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


var numbversions=12;
var version =0;

var rl = Math.random()>.5;

var rlstims = [];

var errorstart =0;


//tell which side the colors show up on.
if (rl){
	for(i=0;i<numbversions/2; i++){
		rlstims.push(0);
		rlstims.push(1)
	}
}else{
	for(i=0;i<numbversions/2; i++){
		rlstims.push(1);
		rlstims.push(0)
}}

var StroopExperiment = function() {

	var wordon, // time word is presented
	    listening = false,
		listeningstart = false,
		errorlistening = false;



	var stimNumber = 9;
	var colorNumber = 3;

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




	var target_shapes = _.sample(stims,3);
	var target_colors = _.shuffle(colstims,3);


	//set order




	if(rlstims[version]===0){
		var offset1 = 350;
		var offset2 = 0;
		var colorcorrect = ["s","d","f"];
		var shapecorrect = ["j","k","l"];

	}else{
		var offset1 = 0;
		var offset2 = 350;
		var colorcorrect = ["j","k","l"];
		var shapecorrect = ["s","d","f"];
	}




	var stimuli = [];


	for (var i = 1; i <= trialNumber/4; i++) {
		var colorindex = _.sample([0,1,2],1);
		var shapeindex = _.sample([0,1,2],1);
		stimuli.push([target_shapes[shapeindex], target_colors[colorindex],colorindex,shapeindex]);
	}

	var distract_shapes = _.without(stims,target_shapes[0],target_shapes[1],target_shapes[2]);


	for (var i = 1; i <= trialNumber*(3/4); i++) {
		var colorindex = _.sample([0,1,2],1);
		var shapeindex = _.sample([0,1,2,3,4,5],1);

		stimuli.push([distract_shapes[shapeindex], target_colors[colorindex],colorindex,"none"]);

	}

	//alert(stimuli.length);

	//alert([target_shapes,distract_shapes]);







	stimuli = _.shuffle(stimuli);




	var timingnum = [];


	for (i=0; i < trialNumber-1;i++){
		timingnum.push(1250 +(Math.random()*1000))
	};

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

			finish();
		}
		//else if (firsttrial===true){
        //
		//	d3.select("#query")
		//		.append("canvas")
		//		.attr("width", 600)
		//		.attr("height", 200)
		//		.attr("id", "InstructionStim");
        //
		//	var canvasIn = document.getElementById('InstructionStim');
		//	var ctxIn = canvasIn.getContext('2d');
        //
		//	ctxIn.font = "20px Arial";
        //
        //
        //
        //
        //
        //
		//	ctxIn.fillText("Press",10,20);
		//	ctxIn.fillText("S",25,45);
        //
		//	ctxIn.fillText("Press",100,20);
		//	ctxIn.fillText("D",115,45);
        //
		//	ctxIn.fillText("Press",190,20);
		//	ctxIn.fillText("F",205,45);
        //
        //
		//	ctxIn.fillText("Press",360,20);
		//	ctxIn.fillText("J",375,45);
        //
		//	ctxIn.fillText("Press",450,20);
		//	ctxIn.fillText("K",465,45);
        //
		//	ctxIn.fillText("Press",540,20);
		//	ctxIn.fillText("L",555,45);
        //
		//	ctxIn.fillStyle = "black";
        //
		//	drawshapes(ctxIn,offset1+30,75,20,10,target_shapes[0]);
        //
		//	drawshapes(ctxIn,offset1+120,75,20,10,target_shapes[1]);
        //
		//	drawshapes(ctxIn,offset1+210,75,20,10,target_shapes[2]);
        //
		//	drawcolor(ctxIn,target_colors[0]);
        //
		//	drawshapes(ctxIn,offset2+30,75,20,10,9);
        //
		//	drawcolor(ctxIn,target_colors[1]);
        //
		//	drawshapes(ctxIn,offset2+120,75,20,10,9);
        //
		//	drawcolor(ctxIn,target_colors[2]);
        //
		//	drawshapes(ctxIn,offset2+210,75,20,10,9);
        //
		//	listeningstart = true;
		//	firsttrial = false;
        //
		//}
		else {
			adj_trialscore = 0;
			hits = 0;
			misses = 0;
			rt_bonus = 0;

			thistrial = thistrial+1;
			stim = stimuli.shift();


			wordon = new Date().getTime();
			timenum = timingnum.shift();
			stim_end = wordon + timenum;
			listening = true;
			listeningstart= false;
			errorlistening = false;
			d3.select("#query")
				.append("canvas")
				.attr("width", 600)
				.attr("height", 200)
				.attr("id", "InstructionStim");

			var canvasIn = document.getElementById('InstructionStim');
			var ctxIn = canvasIn.getContext('2d');

			ctxIn.font = "20px Arial";





			if (Math.random()<.1){
				if (offset1===350){
					//switch shapes to left
					offset1=0;
					offset2=350;
					switch(stim[3]) {
						case "0":
							stim[3] = "s";
							break;
						case "1":
							stim[3] = "d";
							break;
						case "2":
							stim[3] = "f";
							break;
					}

					switch(stim[2]) {
						case "0":
							stim[2] = "j";
							break;
						case "1":
							stim[2] = "k";
							break;
						case "2":
							stim[2] = "l";
							break;
					}




				}else{
					//switch shapes to right
					offset1=350;
					offset2=0;

					switch(stim[3]) {
						case "0":
							stim[3] = "j";
							break;
						case "1":
							stim[3] = "k";
							break;
						case "2":
							stim[3] = "l";
							break;
					}

					switch(stim[2]) {
						case "0":
							stim[2] = "s";
							break;
						case "1":
							stim[2] = "d";
							break;
						case "2":
							stim[2] = "f";
							break;
					}
				}


			}

			if (offset1===350){
				//switch shapes to left

				//alert([typeof stim[2],stim[2], typeof ["2"]])

				switch(stim[3][0]) {
					case 0:
						stim[3] = "j";
						break;
					case 1:
						stim[3] = "k";
						break;
					case 2:
						stim[3] = "l";
						break;
				}

				switch(stim[2][0]) {
					case 0:
						stim[2] = "s";
						break;
					case 1:
						stim[2] = "d";
						break;
					case 2:
						stim[2] = "f";
						break;
				}




			}else{
				//switch shapes to right

					switch(stim[3][0]) {
						case 0:
							stim[3] = "s";
							break;
						case 1:
							stim[3] = "d";
							break;
						case 2:
							stim[3] = "f";
							break;
					}

					switch(stim[2][0]) {
						case 0:
							stim[2] = "j";
							break;
						case 1:
							stim[2] = "k";
							break;
						case 2:
							stim[2] = "l";
							break;
					}


			}
			//alert(typeof stim[2][0]);


			show_word( stim[0],stim[1]);





			ctxIn.fillText("Press",10,20);
			ctxIn.fillText("S",25,45);

			ctxIn.fillText("Press",100,20);
			ctxIn.fillText("D",115,45);

			ctxIn.fillText("Press",190,20);
			ctxIn.fillText("F",205,45);


			ctxIn.fillText("Press",360,20);
			ctxIn.fillText("J",375,45);

			ctxIn.fillText("Press",450,20);
			ctxIn.fillText("K",465,45);

			ctxIn.fillText("Press",540,20);
			ctxIn.fillText("L",555,45);


			//shapes

			ctxIn.fillStyle = "black";

			drawshapes(ctxIn,offset1+30,75,20,10,target_shapes[0]);

			drawshapes(ctxIn,offset1+120,75,20,10,target_shapes[1]);

			drawshapes(ctxIn,offset1+210,75,20,10,target_shapes[2]);

			//colors

			drawcolor(ctxIn,target_colors[0]);

			drawshapes(ctxIn,offset2+30,75,20,10,9);

			drawcolor(ctxIn,target_colors[1]);

			drawshapes(ctxIn,offset2+120,75,20,10,9);

			drawcolor(ctxIn,target_colors[2]);

			drawshapes(ctxIn,offset2+210,75,20,10,9);



			//alert([stim[0],stim[0][0],stim[1],stim[1][0]]);

			numresponse =0;

			setTimeout(function(){
				end_trial()}, timenum);
			//	setTimeout(function(){
			//		next();
			//	},750);
            //
			//},timenum)

		}
	};

	var response_handler_start = function(e) {



		};


	
	var response_handler = function(e) {

		if (!listeningstart && !listening) return;

		if (!listening) {


			var keyCode = e.keyCode,
				response;

			if (keyCode === 13) {
				next()

			}
		}

		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {
			case 83:
				// "S"
				response = "s";
				break;
			case 68:
				// "D"
				response = "d";
				break;
			case 70:
				// "F"
				response = "f";
				break;

			case 74:
				// "J"
				response = "j";
				break;
			case 75:
				// "K"
				response = "k";
				break;
			case 76:
				// "L"
				response = "l";
				break;
            //
            //
			//default:
			//	response = "";
			//	break;
		}

			if (stim[3] === "none" && response === stim[2]) {
				var hit = 1;
			}else if (response === stim[3]) {
			var hit = 1;
			} else {
			var hit = -1;
			}
		var rt = new Date().getTime() - wordon;
		//alert([stim,response]);

		participant_score(hit,rt);



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
			'score': ""
				//'scorec': "",
				//'scoref': ""
			});

		numresponse++;





	};

	var score_listener = function(e) {

		if (!errorlistening) return;



		var keyCode = e.keyCode,
			response;


		var rt = new Date().getTime() - errorstart;

		switch (keyCode) {
			case 83:
				// "S"
				response = "s";
				break;
			case 68:
				// "D"
				response = "d";
				break;
			case 70:
				// "F"
				response = "f";
				break;

			case 74:
				// "J"
				response = "j";
				break;
			case 75:
				// "K"
				response = "k";
				break;
			case 76:
				// "L"
				response = "l";
				break;
			//
			//
			//default:
			//	response = "";
			//	break;
		}

		participant_score(-1,rt);



		psiTurk.recordTrialData({
			'phase': "TEST",
			'block': version,
			'color': stim[0],
			'shape': stim[1],
			'time': "aftertrial",
			'response': response,
			'hit': -1,
			'rt': rt,
			'trial_duration': timenum,
			'score':""
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




	};





	var participant_score = function(hit,rt){


		trialscore[thistrial-1] = trialscore[thistrial-1]+hit;
		totalscore = totalscore + hit;



		if (rt_bonus ===0 && hit===1 ){
			rt_bonus = 700.1 - rt;

		}
		if(hit === 1){
			hits =hits +1
		}else {
			misses = misses+1
		}


	};



	//var score_checker = function(x_rest){
    //
    //
	//	var current_score = [];
	//	var current_accuracy = [];
	//	var move_ave=0;
    //
	//	if (thistrial<4){
	//		var n = thistrial;
	//	}else {
	//		var n = 4;
	//	}
	//	for (i=0; i <n; i++){
	//		var j = hitsvec < timenumevec[thistrial-i] - 750 /250)
	//		var k = missesvec[thistrial-i];
	//		current_score.append(j);
	//		current_accuracy.append(k);
	//		move_ave = if(j){move_ave+1}
	//		current_accuracy +
    //
    //
	//	}
    //
    //
	//};





	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
		d3.select("#InstructionStim").remove();
		//alert(trialscore);

		currentview = new Questionnaire();
	};




	
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
		ctx.fillStyle = "black";
		if(thistrial >= 2){
			//this is the score.
			ctx.fillText("+", 295, 305);
		}


		//d3.select("#canvasStim")
		//	.style("text-align","center")
		//	.style("font-size","50px")
		//	.style("font-weight","40")
		//	.text(trialscore[thistrial-1]);




	};

	var end_trial = function(){
		d3.select("#canvasStim").remove();
		d3.select("#InstructionStim").remove();


		listening=false;
		errorlistening=true;
		errorstart = new Date().getTime();

		d3.select("#score")
			.append("div")
			.attr("id","word")
			.style("color","black")
			.style("text-align","center")
			.style("font-size","350px")
			.style("font-weight","900")
			.style("margin","190px")
			.text("X");

		setTimeout(remove_word,1000);


	};

	var remove_word = function() {
		errorlistening=false;

		d3.select("#word").remove();



		//if (rt_bonus <0){
        //
		//	var score1 = ((hits * 10) - ( misses * 5)) * .9;
        //
        //
		//} else{
        //
		//	var score1 = (hits * 10) - ( misses * 5) + rt_bonus
		//}

		var unad_count =  hits- misses;
		//var ad_count = unad_count/((timenum-500) / 1000);

		if(hits>misses){
			//var score1 = ((unad_count)*(unad_count))/3 ;
			var score1 = Math.sqrt(Math.sqrt(Math.sqrt(unad_count)))*20

		} else{

			var score1 = 0;
		}



		//alert([trialscore,score1]);


		 //adj_trialscore = Math.round(5 + score1 + (( Math.random() -.5)*3));

		var adj_trialscore = Math.round(score1);

		if (adj_trialscore<0){
			adj_trialscore = 0;
		}

		if (score1<0){
			adj_trialscore = 0;
		}

		//var displayc = "";
		//var displayf = "";
        //
		//if (misses>1){
		//	var displayc = "careful";
		//}
		//if (hits < ((timenum - 750) / 250) ){
		//	var displayf = "faster"
		//}


		d3.select("#score")
			.append("div")
			.attr("id","word")
			.style("color","black")
			.style("text-align","center")
			.style("font-size","150px")
			.style("font-weight","400")
			.style("margin","190px")
			.text(adj_trialscore);
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
			'score': score1
		});



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

	alert(version);

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
