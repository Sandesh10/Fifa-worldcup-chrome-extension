// list of countries with their abbrevation used to display the country flag when match has not started 
var country_keys = '{"Argentina":"ar","France":"fr","Uruguay":"uy","Portugal":"pt",'+
                    '"Spain":"es","Russia":"ru","Croatia":"hr","Denmark":"dk",'+
                    '"Brazil":"br","Mexico":"mx","Belgium":"be","Japan":"jp",'+
                    '"Switzerland":"ch","Sweden":"se","Colombia":"co","England":"gb"}';


var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
      };
    xhr.send();
};



getJSON('https://worldcup.sfg.io/matches/today',
function(err, data) {
    if (err !== null) {
        alert('Something went wrong: ' + err);
    } else {
        
        if(!data.length){
            var text ='<div class="no_match_today">No Matches Today</div>'
            document.getElementById("match").innerHTML=text;
        
        }else{
            
            for(i = 0; i<data.length; i++){
                var play_time = data[i].time;
                var game_start= false;
                var text ='<div class="container"><div class="row">';
                	
                	//--------------------------time_column_starts------------------------------
                	text +='<div class="time_column">';
		                if(play_time!=null){
		                    game_start = true;
		                    if(!play_time.includes("full-time")){
		                        text +='<div><button type="radio" class="flash-button"/></div>';
		                    }else{
		                        text +='<div>&nbsp;&nbsp;&nbsp;</div>';
		                    }
		                }
                		text +='<div class="match_status">';   //match_status_starts
    
			                if(game_start == true){   
			                    if(play_time == 'full-time'){
			                      play_time= "FT";
			                    }
			                    text +='<span class="play_time">'+play_time+'</span>';  
			                }else{
			                    ptime = data[i].datetime.split("T")[1].split("Z")[0].slice(0,5);
			                    start_time = convert_time(ptime)
			                    text +='<span class="play_time">'+start_time+'</span>';
			                }
                
                			var country_code = JSON.parse(country_keys)  
                
                		text +='</div>';   //match_status_ends
                	text +='</div>'; 	//
               		//--------------------------time_column_ends------------------------------

               	//--------------------------score column starts------------------------------	
               	text +='<div class="score_column">';
               		//--------------------------team home starts------------------------------
                	text +='<div class="team_home">';
                		text +='<div class="team"><span id="home_team">'+ data[i].home_team_country +'</span>';
                
                		show_penalty = check_penalty(data[i].home_team,data[i].away_team)

		                if(!game_start){
		                    var team1 = data[i].home_team_country;
		                    sub = country_code[team1];
		                    text +='<span class="flag-icon flag-icon-'+sub+' home_flag"></span>';
		                }else{
		                	if(show_penalty){
		                    	text +='<span class="home_penalties">'+data[i].home_team.penalties+'<sub>p</sub></span>';
		                    }  
		                    text +='<div style="float:right;margin-left:1em;"><span class="goals">'+data[i].home_team.goals+'</span></div>';

		                }
                
                		text +='</div>' //team_ends   
                	text +='</div>'
                	//--------------------------team home ends------------------------------

                	text +='<span style="margin-left:2%;width:1%">-</span>';
                	
                	//--------------------------team away starts------------------------------
                	text +='<div class="team_away">';
                		text +='<div style="width:100%; float:right; text-align:left;">';
                
		                if(!game_start){
		                    var team2 = data[i].away_team_country;
		                    sub = country_code[team2]; 
		                    text +='<span class="flag-icon flag-icon-'+sub+' away_flag"></span>';
		                }else{ 
		                	if(show_penalty){
		                    	text +='<span class="away_penalties">'+data[i].away_team.penalties+'<sub>p</sub></span>';
		                    } 
		                    text +='<div style="float:left;margin-right:1em;"><span class="goals">'+data[i].away_team.goals+'</span></div>';
		                } 
                
                		text +='<span id="away_team">'+ data[i].away_team_country +'</span>';
                	text +='</div></div>';
                	//--------------------------team away ends------------------------------
                text +='</div>';
                //--------------------------score column ends------------------------------


                // text +='<hr style="border-color:#e4e4e4;padding:0;margin-bottom:-1px;">'


                //=======================================DETAILS SECTION==========================================
                event_count = count_max_events(data[i].home_team_events.length, data[i].away_team_events.length)

                for(var c=0;c<event_count;c++){
                	var image;
                	
                	try{
                		home_event_type = data[i].home_team_events[c].type_of_event;	
                	}catch(err){
                		home_event_type = "na";  //if no event detail is present
                	}
                	         
                	try{
                		away_event_type = data[i].away_team_events[c].type_of_event;	
                	}catch(err){
                		away_event_type =  "na";
                	}
                	
                	//If home event type is substitution, then remove players name 
	                home_event_player = (c<data[i].home_team_events.length? data[i].home_team_events[c].player : '' );
	                if(home_event_type.includes("substitution")){
	                	home_event_player = "";
	                }
	                
	                //If away event type is substitution, then remove players name
	                away_event_player = (c<data[i].away_team_events.length? data[i].away_team_events[c].player : '' );
	                if(away_event_type.includes("substitution")){
	                	away_event_player = "";
	                }
	                
	                //If both players are substituted then skip the loop
	                if((home_event_player === "")&&(away_event_player === "")){
	                	continue;
	                }else{ 
	                	text +='<div class="description">';
	                	text +='<div class="team_home"><div class="team">';
	                	text +='<span id="home_team">'+home_event_player+'</span>';
	                	text +='<div style="float:right;margin-left:1em;"><span style="font-size: 1em;padding-right:0.55em">';
	                	
	                	if(home_event_type=="yellow-card"){
	                		text += '<img src="yellow.png">';
	                	}else if(home_event_type=="red-card"){
	                		text += '<img src="red.png">';
	                	}else if(home_event_type.includes("goal")){
	                		text += '<img style="margin-left:-3px;" width="15px" height="auto" src="epn.png">';	
	                	}       
	                	//inner if-else ends 

	                	text +='</span></div></div></div>'; //team ends , team home ends

	                	text +='<div class="team_away"><div style="width:100%; float:right; text-align:left"> \
	                			<span id="away_team">'+away_event_player+'</span>';
	                	text +='<div style="float:left;margin-right:1em;"><span style="font-size: 1em;padding-left:0.55em">';
	                	
	                	if(away_event_type=="yellow-card"){
	                		text += '<img src="images/yellow.png">';
	                	}else if(away_event_type=="red-card"){
	                		text += '<img src="images/red.png">';
	                	}else if(away_event_type.includes("goal")){
	                		text += '<img style="margin-left:-3px;" width="15px" height="auto" src="images/goal.png">';	
	                	}
	                	//inner if-else ends

	                	text +='</span></div>'
	                	text +='</div></div></div>';	
                	}
                	//else section ends
                } //event_count for loop ends here
                
                text +='</div></div>';
                // --------------------- row class ends here ------------------------------------------
                //---------------------- container class ends here ------------------------------------  
                text +='<hr style="border-color:#fff;padding:0; margin:0">'
                
                var data_id="match"
                if(i>0 & i<data.length){
                    data_id+=i;
                }  // creates the name of div
                document.getElementById(data_id).innerHTML=text;
            }
        } //inner else ends here 
    } //outer else ends here
}); //end of function



function convert_time(time){
    hr = time.split(":")[0]
    mm = time.split(":")[1]
    num_hr = parseInt(hr)+5
    num_mm = parseInt(mm)+45
    if(num_mm>=60){
        num_hr +=1
        num_mm = num_mm%60
    }
    val = num_hr+":"+num_mm
    return val
}

function check_penalty(home_team, away_team){
	if((home_team.goals === away_team.goals)&&(home_team.penalties!==0 || away_team.penalties!==0)){
		return true
	}
	return false
}

function count_max_events(home_events_count, away_events_count){
	return (home_events_count >= away_events_count ?home_events_count : away_events_count)
}
