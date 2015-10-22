var models = require('./models');

module.exports = function (io) {
    var clients = [];
    var rooms = [];
    var db = [];
    var chat = [];
    var saved_rooms = [];
    io.on('connection', function (socket) {
      socket.on('enter-class', function(data) {
        socket.join(data.classUrl);
        for (var i=0; i<clients.length; ++i) {
          if (clients[i].classUrl === data.classUrl) {
            io.to(data.classUrl).emit('gotLesson', {
              lessonUrl: clients[i].room
            });
          }
        }
      });
      socket.on('save-lesson', function(data) {
          models.Lesson.update({
            image: data.image
          }, {
            where: {
              lessonUrl: data.lessonUrl
            }
          }).then(function(err) {
            saved_rooms[data.lessonUrl] = true;
          });
        });
       socket.on('create-room', function (data) {
            clients.push({
                socket: socket,
                room: data.url,
                type: 'teacher',
                classUrl: data.classUrl
            });
            chat.push({
                room: data.url,
                state: false
            });
            socket.join(data.url);
            io.to(data.classUrl).emit('gotLesson', {
              lessonUrl: data.url
            });
       });
       socket.on('join-room', function (data) {
            clients.push({
                socket: socket,
                room: data.url,
                type: 'student'
            });
            socket.join(data.url);
            if (rooms[data.url]) ++rooms[data.url];
            else rooms[data.url] = 1;
            io.to(data.url).emit('change-user', {
               studentno: rooms[data.url]
            });
       });
       socket.on('disconnect', function () {
            for (var i=0; i<clients.length; ++i) {
                if (clients[i].socket !== socket) continue;
                if (clients[i].type === 'student') {
                  --rooms[clients[i].room];
                  io.to(clients[i].room).emit('change-user', {
                     studentno: rooms[clients[i].room]
                  });
                }
                else {
                  io.to(clients[i].classUrl).emit('noLesson');
                  /*if (saved_rooms[clients[i].room] !== true) {
                    models.Lesson.destroy({
                      where: {
                        lessonUrl: clients[i].room
                      }
                    }).then(function() {

                    });
                  }*/
                }
                clients.splice(i, 1);
            }
       });
       socket.on('draw', function (data) {
           io.to(data.url).emit('draw-update', data);
       });
       socket.on('togglechat', function (data) {
           for (var i=0; i<chat.length; ++i) {
               console.log(chat[i]);
               if (chat[i].room !== data.url) continue;
               chat[i].state = !chat[i].state;
               if (chat[i].state) io.to(data.url).emit('openchat');
               else io.to(data.url).emit('closechat');
           }
       });
        
       socket.on('create-poll', function (data) {
           console.log(data.num);
           db[data.url] = [];
           for (var i = 0; i < data.num; i++) db[data.url][i] = 0;
           io.to(data.url).emit('show-poll', data);
       });
       socket.on('submit-poll', function (data) {
           db[data.url][data.optionNo]++;
       });
       socket.on('close-poll', function (data) {
           console.log(db[data.url]);
           io.to(data.url).emit('return-results', {results: db[data.url]});
           db[data.url] = null;
       });
       socket.on('student-message', function (data) {
           io.to(data.url).emit('student-message', data);
       });
       socket.on('teacher-message', function (data) {
           io.to(data.url).emit('teacher-message', data);
       });
    });
};