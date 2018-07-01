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
      var text ='<div style="padding:5px;font-size:18px;text-align:center;">No Matches Today</div>'
      document.getElementById("demo").innerHTML=text;
    }else{
    for(i = 0; i<data.length; i++){
    var play_time = data[i].time;
    var game_start= false;
    var text ='<div class="row">';
  text +='<div class="column" style="float: left; display: inline;">';
  if(play_time!=null){
    game_start = true;
    if(!play_time.includes("full-time")){
      text +='<div><button style="vertical-align:middle" type="radio" class="flash-button"/></div>';
    }

  }
  text +='<div class="match_status" style= "margin-left:4%; background-color:#081f2c;height:1.9em;min-width: 2em;text-align: center;float: left;color: #fff;position: absolute;top: .5em;">';
    
    if(game_start == true){   
      if(play_time == 'full-time'){play_time= "FT";}
      text +='<span style="padding: 0 5px">'+play_time+'</span>';  
    }else{
      ptime = data[i].datetime.split("T")[1].split("Z")[0].slice(0,5);
      start_time = convert_time(ptime)
      text +='<span style="padding: 0 5px">'+start_time+'</span>';
    }
    
  text +='</div>';
  text +='</div>';
  text +='<div class="column" style="position:relative; margin-left:10%;float:left;width:80%;color:black">';
  text +='<div class="team_home" style="float:left;width: 48%">';
    text +='<div style="width:100%; float:right;text-align:right"><span class="team" id="home_team" \
    style="width:70% text-align: right;font-size: 1em;">'+ data[i].home_team_country +'</span>';
    // text +='<br><span>'+data[i].home_team_events[0].player+'</span>'
    if(!game_start){
      sub = data[i].home_team_country.slice(0,2).toLowerCase();
      if(data[i].home_team_country=="Uruguay"){
        sub= "uy";
      } 
      text +='<span class="flag-icon flag-icon-'+sub+'" style="float:right;width: 30%;font-size:1.5em"></span>';
    }else{  
    text +='<div style="float:right;width: 30%;"><span class="goals" style="font-size: 1em; background-color: #FFF; border: none;height: 1.8em;min-width: 1.8em; color: black;  text-align: center; text-decoration: none;display: inline-block;margin-top:-1%">'+data[i].home_team.goals+'</span></div>';
    }
    text +='</div></div><span style="margin-left:2%;width:1%">-</span>';
    text +='<div class="team_away" style="float:right; width: 45%">';
    text +='<div style="width:100%; float:right; text-align:left">';
      if(!game_start){
      sub = data[i].away_team_country.slice(0,2).toLowerCase();
      if(data[i].away_team_country=="Portugal"){sub="pt";}  
      text +='<span class="flag-icon flag-icon-'+sub+'" style="float:left;width: 30%;font-size:1.5em"></span>';
    }else{  
    text +='<div style="float:left;width: 30%;"><span class="goals" style="font-size: 1em; background-color: #FFF; border: none;height: 1.8em;width: 1.8em; color: black;  text-align: center; text-decoration: none;display: inline-block;margin-top:-1%">'+
    data[i].away_team.goals+'</span></div>';
    } 
    text +='<span class="team" id="away_team" style="text-align: left;font-size: 1em;">'+ data[i].away_team_country +'</span>';
    text +='</div>';
    text +='</div>';  
  text +='</div></div>';
  text +='<hr style="color:#fff;padding:0; margin:0">'
  var d="demo"
  if(i>0 & i<data.length){
    d+=i;
  } 
  document.getElementById(d).innerHTML=text;

  }
  }}
});

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
