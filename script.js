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
                var text ='<div class="row">';
                
                text +='<div class="column">';
                
                if(play_time!=null){
                    game_start = true;
                    if(!play_time.includes("full-time")){
                        text +='<div><button style="vertical-align:middle" type="radio" class="flash-button"/></div>';
                    }else{
                        text +='<div>&nbsp;&nbsp;&nbsp;</div>';
                    }
                }

                text +='<div class="match_status" style= "">';
    
                if(game_start == true){   
                    if(play_time == 'full-time'){
                      play_time= "FT";
                    }
                    text +='<span style="padding: 0 5px">'+play_time+'</span>';  
                }else{
                    ptime = data[i].datetime.split("T")[1].split("Z")[0].slice(0,5);
                    start_time = convert_time(ptime)
                    text +='<span style="padding: 0 5px">'+start_time+'</span>';
                }
                
                var country_code = JSON.parse(country_keys)  
                
                text +='</div>';
                text +='</div>';
                text +='<div class="score_column">';
                text +='<div class="team_home">';
                text +='<div class="team"><span id="home_team">'+ data[i].home_team_country +'</span>';
                // text +='<br><span>'+data[i].home_team_events[0].player+'</span>'
                
                if(!game_start){
                    var team1 = data[i].home_team_country;
                    sub = country_code[team1];
                    text +='<span class="flag-icon flag-icon-'+sub+'" style="float:right;margin-left:0.6em; font-size:1.5em"></span>';
                }else{  
                    text +='<div style="float:right;margin-left:1em;"><span class="goals" style="font-size: 1em; background-color: #FFF; \
                            border: none;height: 1.8em;min-width: 1.8em; color: black;  text-align: center; text-decoration: none; \
                            display: inline-block; margin-top:-1%">'+data[i].home_team.goals+'</span></div>';
                     
                     // if (data[i].home_team_events.length>0){
                     //      for(j=0;j<data[i].home_team_events.length;j++){
                     //         if(data[i].home_team_events[j].type_of_event =="goal"){
                     //         // document.getElementsByClassName("row").setAttribute("style","height = 4em;");  
                     //         text +='<br><span style="font-size:0.6em;">'+ data[i].home_team_events[j].player +'</span>';
                     //    }}}
                }
                
                text +='</div></div><span style="margin-left:2%;width:1%">-</span>';
                text +='<div class="team_away" style="float:right; width: 45%">';
                text +='<div style="width:100%; float:right; text-align:left">';
                
                if(!game_start){
                    var team2 = data[i].away_team_country;
                    sub = country_code[team2]; 
                    text +='<span class="flag-icon flag-icon-'+sub+'" style="float:left;margin-right:0.6em;font-size:1.5em"></span>';
                }else{  
                    text +='<div style="float:left;margin-right:1em;"><span class="goals" style="font-size: 1em; background-color: #FFF; \
                            border: none;height: 1.8em;width: 1.8em; color: black;  text-align: center; text-decoration: none; \
                            display: inline-block; margin-top:-1%">'+data[i].away_team.goals+'</span></div>';
                } 
                
                text +='<span id="away_team">'+ data[i].away_team_country +'</span>';
                text +='</div>';
                text +='</div>';  
                text +='</div></div>';
                text +='<hr style="color:#fff;padding:0; margin:0">'
                
                var data_id="match"
                
                if(i>0 & i<data.length){
                    data_id+=i;
                } 
                
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
