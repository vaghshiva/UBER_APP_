const socketIo=require('socket.io');

let io;

function initializeSocket(server){
    io=socketIo(server,{
        cors:{
            origin:'*',
            metho:['GET','POST']
        }
    });

    io.on('connection',(socket)=>{
        console.log(`Client connected: ${socket.id}`);

        socket.on('join',async(data)=>{
            const{userId,userType}=data;
            if(userType==='user'){
                await userModel.findByIdAndUpdate(userId,{socketId:socket.id});
            }else if(userType==='captain'){
                await captainModel.findByIdAndUpdate(userId,{socketId:socket.id});
            }
        });

        socket.on('update-location-captain',async(data)=>{
            const{userId,userType}=data;
            if(!location || !location.ltd || !location.lng){
                await socket.emit('error',{message:'Invalid location data'});
            }await captainModel.findByIdAndUpdate(userId,{
                location:{
                    ltd:location.ltd,
                    lng:location.lng
                }
            });
        });
        socket.on('disconnect',()=>{
            console.log(`Client disconnected: ${socket.id}`);
        })
    })
}

const sendMessageToSocketId=(socketId,messageObject)=>{

    console.log(messageObject);

    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data);
    }else{
        console.log('Socket.io not initialized.');
    }
}

module.exports={initializeSocket,sendMessageToSocketId};