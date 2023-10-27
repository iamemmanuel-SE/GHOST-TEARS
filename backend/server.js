require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const GhostTearsRoutes = require('./routes/GhostTearsRoutes')
const userRoutes = require('./routes/user')
const socket = require('socket.io')
const http = require('http');

const cors = require('cors');

//Data structure for every pair chatLetter room
const chatLetterRoom = {};
// Users logged in
const activeUsers = [];

// Occupied Users
let occupiedUsers = [];

// Map Users with their particular rooms
let userSocketMap = new Map();

// Ghost Letters
let ghostLetters = [];

//user sockets joining the room
const socketUsers = [];

const countries = [
  'AFGHANISTAN','ALBANIA','ALGERIA',
  'ANDORA','ANGOLA','ARGENTINA',
  'ARMENIA','AUSTRALIA','AUSTRIA'
];

//


// express app
const app = express()

app.use(cors())

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/ghosttears', GhostTearsRoutes)
app.use('/api/user', userRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
.then(() => {

//listening for requests
const server = app.listen(process.env.PORT, () => {
    console.log('connedcted to db and listening on port', process.env.PORT)
    })

    // socket algorithm
    const io = socket(server)
    io.on('connection', (socket) => {
            console.log('made socket connection', socket.id)

           // Listen For NewUser occupied and update emit to
           // update the front end
           socket.on('occupiedUsersSignal', (data) => {
            if(data){
              
            }
           }
          );

            // Listen Active User Socket=========================================
            socket.on('activeUsers', (data) => {
              if (!activeUsers.includes(data)) {
                activeUsers.push(data);
              }
                io.sockets.emit('activeUsers', activeUsers);
              });

              // Listen for deny request 
              socket.on('denyRequest', (data) => {
                console.log('deny request received', data)
                const denied = activeUsers.find((user) => user.email === data.deniedUser);
                if (denied) {
                  // console.log('the denied users socket',denied)
                  // Emit the connection request event to the recipient user only
                  io.to(denied.socketId).emit('deny', {
                    denier: data.message
                  });
                }
                  
                });

                // Listen for acceptance request 
              socket.on('acceptRequest', (data) =>   {
                // console.log('accept request received', data)
                const accepted = activeUsers.find((user) => user.email === data.acceptUser);// User who accepted request
                const userOne = activeUsers.find((user) => user.email === data.message);// User who sent request
                const userOneSocket = io.sockets.sockets.get(data.acceptorKeySock);

                if (accepted && userOne) {
                  // Adding the two users to a room name
                  const  roomName = `${userOne.id}-${accepted.id}`;// form a room ID from the the 2 user IDs
                  occupiedUsers.push(userOne.email, accepted.email)

                  //create letterChat space for joint users in data structure
                  chatLetterRoom[roomName] = [];
                  // Broadcast a ocuppied Users to all connected users
                  io.sockets.emit('occupiedUsers', { 
                    opu: occupiedUsers      // opu ==> occupied users
                  });

                  // Make Socket userOne Join and add
                  if(userOneSocket){
                    //add this user socket to map with userIdentifier(data.email)
                    userSocketMap.set(data.acceptUser, userOneSocket)

                    userOneSocket.join(roomName);
                    // socketUsers.push(data.acceptorKeySock)
                } else {
                  console.log(`UserOne keyPadSocket ${data.acceptorKeySock} not found.`);
                }

                  console.log('the accepter users socket', accepted)
                  // Emit the connection request event to the recipient user only
                  io.to(accepted.socketId).emit('requestAccepted', {
                    accepter: data.message,
                    roomName: roomName
                  });
                  console.log('this is roomName from the server', roomName)
                }
                  
                });

                // Listen for ok
                socket.on('ok', (data) => {
                    const toOkSender = activeUsers.find((user) => user.email === data.okSender);
                    // Make Socket acceptedUser Join
                      const acceptedSocket = io.sockets.sockets.get(data.keySocket);
                      console.log(`acceptedSocket is: ${acceptedSocket}`)
                      console.log(`toOkSender is: ${data.keySocket}`)
                      if (acceptedSocket) {

                    //add this user socket to map with userIdentifier(data.email)
                    userSocketMap.set(data.okSender, acceptedSocket)

                        acceptedSocket.join(data.roomName);
                        // socketUsers.push(data.keySocket)
                        console.log(`Accepted Socket ${data.keySocket} joined room: ${data.roomName}`);
                      } else {
                        console.log(`Accepted Socket ${data.keySocket} not found.`);
                      }
                                      
                    if(toOkSender){

                      io.to(toOkSender.socketId).emit('okReceived', {
                        roomName: data.roomName
                      });
                      console.log('ROOMname sent as', data.roomName)
                     }

                      

                  });
    

                 //Listen letter socket============================================= 
                  socket.on('letter', (data) => {

                    if(data.message == ''){
                      io.to(data.socketID).emit('GhostFail', {
                        message: 'ghostTears'
                      })
                      return;
                    }

                    chatLetterRoom[data.roomName].push(data.message)
                    // ghostLetters.push(data.message)

                    const prefix = chatLetterRoom[data.roomName].join('')//Join the letters to form prefix
                    const matchingWords = countries.filter((countrys)=> countrys.startsWith(prefix))

                    if(matchingWords.length > 0){
                      // const sendTimerSock = socketUsers.find((userSock) => userSock !== data.socketID);

                     io.to(data.roomName).emit('letter', { 
                        message: chatLetterRoom[data.roomName],
                        keySockId: data.socketID,
                        letterStats: 'correct'
                       });
                    } else {
                      io.to(data.roomName).emit('letter', {
                        message: chatLetterRoom[data.roomName],
                        keySockId: data.socketID,
                        letterStats: 'wrong'
                       });  
                       chatLetterRoom[data.roomName] = []; 
                      io.to(data.socketID).emit('GhostFail', {
                        message: 'ghostTears'
                      })
                 
                  }
                    
                     
                })

                      //Listen for logout to disconnect user(when one user logs 
                      //out it disconnects both users)

      socket.on('UserRoomDisconnect', (data) => {
        const namespace = '/';
        const roomName = data.roomName
        const roomClients = io.of(namespace).in(data.roomName).allSockets();
        
        // const logOutUser = io.sockets.sockets.get(data.userDisconnectSockId);
      //const userLogout = userSocketMap.get(data.userDisconnectSockId)
        let counter = 0;
        //test
        for(const [key, value] of userSocketMap){
          //using key to check socket exist in Map
          const loggedOutUsers = userSocketMap.get(key)

          if(loggedOutUsers && loggedOutUsers.rooms.has(data.roomName)){
            //removing socket loggedout user from room
            loggedOutUsers.leave(data.roomName)
            console.log(`the room clients are: ${roomClients.size}`)
            //remove from occupied users=============================
            const indexToRemove = occupiedUsers.indexOf(key);
            occupiedUsers.splice(indexToRemove, 1);
            userSocketMap.delete(key) // delete UserSocket Map

            counter++;
          
            
          }
              // checking the number of sockets in room: if 0 delete room
              if(counter === 2){
                    //Delete the empty room
                    counter = 0;
                    delete chatLetterRoom[roomName];
                    
                io.of(namespace).adapter.del(data.roomName);
                console.log(`Deleted room ${roomName}`);
                
                io.sockets.emit('occupiedUsers', { 
                opu: occupiedUsers      // opu ==> occupied users
          })
              }
        
         
        }
       
        })

        // Listen Game connection request======================================
        socket.on('connectionRequest', (data) => {
          console.log('connection request gone,', data)
            // Find the recipient user based on receiverId
            const recipient = activeUsers.find((user) => user.id === data.receiverId);
            if (recipient) {
              // Emit the connection request event to the recipient user only
              io.to(recipient.socketId).emit('connectionRequest', {
                senderId: data.senderId,
                senderEmail: data.senderEmail,
                seleCat: data.selectedCat
              });
            }
          }); 

              // Listen  for Deny Request======================================
           
              
            //listen when a socket is closed to delete users
            socket.on('disconnect', () => {
                const index = activeUsers.findIndex((user) => user.socketId === socket.id);
                if (index !== -1) {
                  activeUsers.splice(index, 1);
                  io.sockets.emit('activeUsers', activeUsers);
                }
              }); 
        })
        
}).catch((error) => {
    console.log(error)
})
    
