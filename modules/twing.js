/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
  , FB = require('fb');
var ScoreM, ActionsM;
var users = {};
var duels = {};
var rooms = {
  lobby:{
    name:'lobby',
    players:[],
    available:true
  }
};
var io;
var debug = [];
FB.setAccessToken('527804323931798|vEinKlwRdO8Jxm6TcpcNLSW-OkI');
// Connect to MongoDB
mongoose.connect('mongodb://twing:twing12345@dharma.mongohq.com:10049/twing');
//mongoose.connect('mongodb://nodejitsu:961ec2c420954980e319c721f31b0f21@linus.mongohq.com:10018/nodejitsudb3601504410');
//mongoose.connect('mongodb://localhost');

var db = mongoose.connection;
db.on('error', function(){
  console.log("DB connection error!");
  console.log("Reconnecting in 5s");
  setTimeout(function(){
    mongoose.connect('mongodb://twing:twing12345@dharma.mongohq.com:10049/twing');
  },5000);
});
db.once('open', function () {
  var scoreSchema = mongoose.Schema({
    fbID: {type: Number, unique:true},
    name: {type: String},
    score: {type: Number, 'default':0},
    money: {type: Number, 'default':0}
  });
  var actionsSchema = mongoose.Schema({
    senderID: {type: Number},
    targetID: {type: Number},
    type: {type: String},
    name: {type: String},
    amount: {type: Number}
  });
  actionsSchema.index({ senderID: 1, targetID: 1}, { type: true },{ name: true });
  ScoreM = mongoose.model('Score', scoreSchema);
  ActionsM = mongoose.model('Actions', actionsSchema);
   console.log("Mongo connected");
});
exports.socketOnConnectionCallback = function (ioin, socket) {
  io = ioin;
  socket.join('lobby');
  
    users[socket.id] = {
     id:socket.id,
     room:'lobby',
     name:'unnamed',
     score: 0,
     fbMe: {
       id:0,
       name: 'unnamed',
       gender: 'male'
     }
   }; 
 


  //  Gameplay Events   =============================================
  
  socket.on('register me', function (fbMe) {
//    console.log(fbMe);
    var room = 'lobby';
    fbMe.first_name = fbMe.first_name.replace("'",'-');
    for(var userID in users){
      if(fbMe.first_name == users[userID].name){
        fbMe.first_name = fbMe.first_name + Math.ceil(Math.random()*100);
      }
    }
    console.log(fbMe.first_name + " Connected!");
    users[socket.id].name = fbMe.first_name;
    users[socket.id].currScore = 0;
    users[socket.id].score = 0;
    users[socket.id].room = room;
    users[socket.id].fbMe = fbMe;
    users[socket.id].sid = socket.id;
    var me = users[socket.id];
    me.room = room;
    rooms[room].players.pushUnique(me.name);
    io.sockets.emit('refresh rooms',rooms);
    
    if(ScoreM != undefined){
      ScoreM.findOne({fbID:fbMe.id}).exec(function(err, myStats){
        if(!err){
          console.log(users[socket.id].name+" findOne Success!");
          if(!myStats){
            console.log(users[socket.id].name+" findOne no stats!");
            ScoreM.create({fbID:fbMe.id,name:fbMe.name,score:0,money:200},function(err,result){
              if(!err){
                console.log(users[socket.id].name+" Create Success!");
                socket.emit('my stats',result);
                socket.broadcast.to(me.room).emit('add me',users[socket.id]);
              }else{
                console.log(users[socket.id].name+" Error Create!");
                console.log(err);
              }
            });
          }else{
            console.log(users[socket.id].name+" findOne Got stats!");
            users[socket.id].score = myStats.score;
            users[socket.id].money = myStats.money;
            socket.emit('my stats',myStats);
            socket.broadcast.to(me.room).emit('add me',users[socket.id]);
          }
          
        }else{
          console.log(users[socket.id].name+" findOne fails!");
          console.log(err);
          socket.broadcast.to(me.room).emit('add me',users[socket.id]);
        }
      });
    }else{
      console.log(users[socket.id].name+" ScoreM Undefined!");
      socket.broadcast.to(me.room).emit('add me',users[socket.id]);
    }
    socket.emit('userlist',{'me': users[socket.id],'roomName': 'lobby','users':usersInRoom(me.room,me.id)}); //2nd param to exclude me
    socket.emit('hosts',rooms);
   
      
  });
  socket.on('create room', createRoom);
  
  function createRoom(data) {
    if(users[socket.id].name == 'unnamed'){
      socket.emit('error',"You are not registered to the game yet!");
      return;
    }
    users[socket.id].currScore = 0;
    var me = users[socket.id];
    leaveRoom(me.room);
    socket.broadcast.to(me.room).emit('leave',me.name);
    var room  = data.roomID ? data.roomID : me.name+"-host";
    console.log("rooms:");
    console.log(rooms);
    for(var roomID in rooms){
      if(room == roomID){
        room = room + Math.ceil(Math.random()*100);
      }
    }
    rooms[room] = {
      name: data.roomID ? "Dual-"+duels[data.roomID].challenger.name+" Vs. "+duels[data.roomID].target.name + " $"+data.bet : room, 
      host: me.name, 
      players: [me.name], 
      available: data.roomID ? false : true,
      type: data.roomID ? "duel" : "public",
      bet: data.bet?data.bet:0
    }
    socket.leave(users[socket.id].room);
    users[socket.id].room = room;
    socket.broadcast.emit('refresh rooms',rooms);
    socket.join(room);
    socket.broadcast.to(me.room).emit('add me',users[socket.id]);
    socket.emit('userlist',{'me': me,'roomName': rooms[room].name,'users':usersInRoom(me.room,me.id)}); //2nd param to exclude me
  }
  
  socket.on('join room', joinRoom);
  
  function joinRoom(room) {
    if(rooms.hasOwnProperty(room)){
      users[socket.id].currScore = 0;
      var me = users[socket.id];
//      console.log(me);
//      console.log(rooms[room]);
      
      socket.broadcast.to(me.room).emit('leave',me.name);
      socket.leave('lobby');
      socket.join(room);
      users[socket.id].room = room;

      me = users[socket.id];
      rooms[room].players.pushUnique(me.name);
      io.sockets.emit('refresh rooms',rooms);
      socket.broadcast.to(me.room).emit('add me',users[socket.id]);
      socket.emit('userlist',{'me': me,'roomName': rooms[room].name,'users':usersInRoom(me.room,me.id)}); //2nd param to exclude me
    }else{
      socket.emit('error', "Host not found. Other players may have left the host.");
    }
    
    
  }
  socket.on('leave room', leaveRoom);
  function leaveRoom(room) {
    var room = users[socket.id].room;
    socket.leave(room);
    updateLeaversRoom(socket);
    socket.join('lobby');
    users[socket.id].ready = false;
    users[socket.id].room = 'lobby';
    var me = users[socket.id];
    io.sockets.emit('refresh rooms',rooms);
    socket.emit('room left');
    socket.broadcast.to('lobby').emit('add me',users[socket.id]);
    socket.emit('userlist',{'me': me,'roomName': 'lobby','users':usersInRoom(me.room,me.id)}); //2nd param to exclude me
    socket.emit('hosts',rooms);
  }
  socket.on('ready', function () {
    users[socket.id].ready = true;
    var me = users[socket.id];
    var error = false;
    var roomMates = usersInRoom(me.room);
    if(Object.keys(roomMates).length==1){
      error = true;
    }else{
      for(var id in roomMates){
        if(!roomMates[id].ready){
          error = true;
        }
      }
    }
    if(!error){
      rooms[me.room].available = false;
      rooms[me.room].gameOver = false;
      for(var id in roomMates){
        roomMates[id].ready = false;
      }
      console.log("Game started @ a room");
      console.log(rooms[me.room]);
      io.sockets.emit('refresh rooms',rooms);
      var data = rebuildDraggable(rooms[me.room].players.length);
      data.mode = Math.ceil(Math.random()*7);
      data.host = rooms[me.room];
      var symbolGroups = [
//        {start:2308,name:"Devnagari",achievement:"Ka.. Kha.. Ga.. Guru"},
//        {start:8591,name:"Arrows",achievement:"Arjun's apprentice"},
//        {start:9632,name:"BoxDrawing",achievement:"Shapes Juggler"},
        {start:9791,name:"Leasure",achievement:"Classy Twingger"},
//        {start:10010,name:"Stars",achievement:"Stars counter"},
//        {start:12361,name:"Hiragana",achievement:"Wakkarimasita Hiragana"},
//        {start:12448,name:"Katakana",achievement:"Wakkarimasita Katakana"},
//        {start:12938,name:"Ideograph",achievement:"Ideograph Expert"},
//        {start:13184,name:"Units",achievement:"Albert Einstein"}
        ]
//      var selectedSymbolset = Math.floor(Math.random()*symbolGroups.length);
      var selectedSymbolset = 0;
      data.theme =  symbolGroups[selectedSymbolset];  
      data.theme.start = Math.round(Math.random()*290);
//      data.theme.start = 290;
      rooms[me.room].theme = data.theme;
      io.sockets.in(me.room).emit('stage ready',data);
    }else{
      socket.emit('waiting for players');
    }
  }
  );
    
//  Challenge duel
  socket.on('challenge', function (data) {
    console.log(data);
    var target = users[data.target.sid];
    var me = users[socket.id];
    duels[socket.id+"-"+target.id] = {
      id: socket.id+"-"+target.id,
      challenger: me,
      target: target,
      status: 'new',
      winner: false,
      bet: data.bet
    };
    
    io.sockets.socket(target.id).emit('challenge',me,duels[socket.id+"-"+target.id]);
  });
  
// Accept duel challenge
socket.on('accept duel', function (duelID) {
    var duel = duels[duelID];
    var challenger = duel.challenger;
    duels[duelID].status = "progress";

    io.sockets.socket(challenger.id).emit('duel accepted',duels[duelID]);
    createRoom({roomID:duelID,type:'duel',bet:duel.bet});
  });
  
// Reject duel challenge
socket.on('reject duel', function (duelID) {
    var duel = duels[duelID];
    var challenger = duel.challenger;
    duels[duelID].status = "rejected";

    io.sockets.socket(challenger.id).emit('duel rejected',duels[duelID]);
  });
  
// Join duel challenge
socket.on('join duel', function (duelID) {
    var duel = duels[duelID];
    joinRoom(duelID);
  });
  
   
  socket.on('message', function (msg) {
    var me = users[socket.id];
    socket.broadcast.to(users[socket.id].room).emit('message',{
      'name':me.name,
      'message':msg
    });
  });
  
  socket.on('matched', function (block) {
    var me = users[socket.id];
    var newScore = me.currScore+100;
    if(block%11 == 0 || block>39) 
      newScore += 150;
    users[socket.id].currScore = newScore;
    socket.broadcast.to(me.room).emit('matched',{
      'name':me.name, 
      'block': block
    });
  });
  
  socket.on('cursor move', function (position) {
    socket.broadcast.to(users[socket.id].room).emit('cursor move',{
      name:users[socket.id].name,
      'position':position
    });
      
  });
  socket.on('drag', function (data) {
    socket.broadcast.to(users[socket.id].room).emit('drag',data);
  });
  socket.on('game over', function () {
    var me = users[socket.id];
     if(!rooms[me.room].gameOver){
       
       var roomMates = usersInRoom(me.room);
       
       if(me.currScore>=3000 && roomMates.length==5){
          FB.api(me.fbMe.id+'/achievements', 'post', {achievement: "http://review.com.np/og/achievement.php?achievement=" + rooms[me.room].theme.name + ""}, function (res) {
          if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
          }
          console.log('Post Id: ' + res.id);
        });
       }
        console.log("Game Over!");
//        console.log(roomMates);
        if(rooms[me.room].bet){
          console.log("There is a bet in this game!");
          var scoresArray = [];
          for(userID in roomMates){
            scoresArray.push(users[userID]);
          }
          scoresArray.sort(function(a,b){return b.currScore - a.currScore});
          var winner = scoresArray[0];
          scoresArray.forEach(function(score,i){
            var calcMoney = rooms[me.room].bet*(scoresArray.length - i*2 - 1);
            console.log('calcMoney');
            console.log(calcMoney);
            users[scoresArray[i].id].betMoney = (calcMoney < -rooms[me.room].bet) ? rooms[me.room].bet : calcMoney;
            users[scoresArray[i].id].money += users[scoresArray[i].id].betMoney;
          });
        }
        roomMates = usersInRoom(me.room);
//        console.log(roomMates);
        io.sockets.in(users[socket.id].room).emit('game over',roomMates);
        for(userID in roomMates){
          var betMoney = users[userID].betMoney ? users[userID].betMoney : 10;
          ScoreM.findOneAndUpdate(
            {fbID: users[userID].fbMe.id}, 
            {$inc:{score: users[userID].currScore, money: betMoney} , $set:{name: users[userID].fbMe.first_name+ " " +users[userID].fbMe.last_name}}, 
            {upsert:true}, 
            function(){
//                 console.log("Updated score for ");
              });
          users[userID].ready = false;
          users[userID].score += users[userID].currScore;
          users[userID].currScore = 0;
          users[userID].betMoney = 0;
        }
        console.log(roomMates);
        rooms[me.room].gameOver = true;
     }
    
  });
 


//  Social Events  =======================================================

  socket.on('get appFriends',function(appFriends){
    ScoreM.find({fbID: {$in: appFriends}}).sort('-score').limit(150).exec(function(err, scores){
      socket.emit('appFriends',scores);
    });
  });
  
  socket.on('highscores',function(){
    ScoreM.find().sort('-score').limit(30).exec(function(err, scores){
      socket.emit('highscores',scores);
    });
  });
  socket.on('notifications',function(){
    if(ActionsM){
      ActionsM.find({targetID:users[socket.id].fbMe.id}).exec(function(err, notifications){
      if(err){
        console.log(err);
      }else
        socket.emit('notifications',notifications);
    });
    }
    
  });
  socket.on('accept gift',function(id){
    ActionsM.findById(id,{},function(err, result){
      if(!err){
        if(result){
          if(result.amount < 10)
            result.amount = 10;
          ScoreM.findOneAndUpdate(
        {fbID: result.targetID},{$inc:{money:result.amount}},
        {upsert:false}, 
            function(err, result){
              if(!err){
                ActionsM.remove({_id: id}, function(err, result) {});
              }else{
                console.log(err);
              }
            });
        }else{
          console.error("DB Error, Error accepting gift!");
        }
        
     }else{
       console.log("Already accepted gift.");
     }
    });
  });
  socket.on('accept help',function(id){
    ActionsM.remove({_id: id}, function(err, result) {
      console.log("Help sent.");
    });
  });
 socket.on('gift', function (data) {
    ActionsM.findOneAndUpdate({
      senderID: users[socket.id].fbMe.id,
      targetID: data.target.uid,
      type: 'gift',
      name: 'coins10' 
      }, 
      {
        $set:{
          senderID: users[socket.id].fbMe.id,
          targetID: data.target.uid,
          type: 'gift',
          amount: 10,
          name: 'coins10'
        }
      }, 
      {
        upsert:true
      }, 
      function(err,result){
        console.log("Gift sent!");
    });
    if(users.hasOwnProperty(data.target.sid)){
      var target = users[data.target.sid];
      console.log(target);
      var me = users[socket.id];
      io.sockets.socket(target.id).emit('gift',{sender:me,gift:'coins10'});
   }
  });
  socket.on('mass request', function (data) {
    data.targets.forEach(function(target){
      ActionsM.findOneAndUpdate({
      senderID: users[socket.id].fbMe.id,
      targetID: target,
      type: data.type,
      name: data.name 
      }, 
      {
        $set:{
          senderID: users[socket.id].fbMe.id,
          targetID: target,
          type: data.type,
          name: data.name,
          amount: data.hasOwnProperty('amount')?data.amount:0
        }
      }, 
      {
        upsert:true
      }, 
      function(e){
        console.log(" sent!");
        console.log(e);
    });
    
    });
  });


  socket.on('disconnect', function () {
    updateLeaversRoom(socket);
    console.log(users[socket.id].name + " disconnected!");
    delete users[socket.id];  
  });
}


//Query functions

function updateLeaversRoom(socket){
  var leaver = users[socket.id];
  if(leaver.hasOwnProperty('room')){
    socket.broadcast.to(leaver.room).emit('leave',leaver.name);
    if(rooms.hasOwnProperty(leaver.room)){
      rooms[leaver.room].players.splice(rooms[leaver.room].players.indexOf(leaver.name),1);
      if(rooms[leaver.room].players.length==0 && leaver.room != 'lobby'){
        delete rooms[leaver.room];
      }
      io.sockets.emit('refresh rooms',rooms);
    }
  }
}
function usersInRoom(room){
  var usersInRoom = {};
  for(var userID in users){
    if(room == users[userID].room)
      usersInRoom[userID] = users[userID];
  }
  if(arguments[1]){
    delete usersInRoom[arguments[1]];
  }
  return usersInRoom;
}
//function  updateRoomAvailability(room){
//  if(rooms.hasOwnProperty(room)){
//    if(rooms[room].players.length>=maxPlayersInRoom){
//    rooms[room].available = false;
//    }else{
//      rooms[room].available = true;
//    }
//  }
//  
//}
     
     
     
//   ========================= Followed by Not so interesting functions ===========================
//Render Functions


//Utility functions
shuffle = function(array) {
  var i = array.length, j, tempi, tempj;
  if ( i == 0 ) return array;
  while ( --i ) {
    j       = Math.floor( Math.random() * ( i + 1 ) );
    tempi   = array[i];
    tempj   = array[j];
    array[i] = tempj;
    array[j] = tempi;
  }
  return array;
}
var numBlocks;
function rebuildDraggable(numRoomMates){
//  console.log('numRoomMates');
//  console.log(numRoomMates);
  var map = {};
  var arrayDrg = [7,24,15,21,48,36,13,37,23,14,22,27,12,42,39,29,11,45,16,9,17,44,38,20,28,19,35,40,32,46,1,41,25,10,5,33,34,4,8,47,18,26,6,31,3,30,43,2];
  switch(numRoomMates){
    case 5:
    numBlocks = 48;
    case 4:
    numBlocks = 40;
    break;  
    case 3:
    numBlocks = 32;
    break;  
    case 2:
    numBlocks = 24;
    break;  
  }
  
  map.draggables = shuffle(arrayDrg).filter(filterSlotsCallback);
  map.droppables = shuffle(arrayDrg).filter(filterSlotsCallback);

  return map;
}
function filterSlotsCallback(element, index, array) {
  return (element <= numBlocks);
}

Array.prototype.pushUnique = function (item){
    if(this.indexOf(item) == -1) {
    //if(jQuery.inArray(item, this) == -1) {
        this.push(item);
        return true;
    }
    return false;
}