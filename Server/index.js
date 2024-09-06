const express=require('express');
const bodyparser=require('body-parser');
const socket=require('socket.io');

const io=new socket.Server({
    cors:true
});
const app=express();
app.use(bodyparser.json());
io.on('connection',(socket)=>{
    console.log('connected');
    socket.on('join-room',(data)=>{
        const {roomId,emailId}=data;
        console.log("Room ID",roomId);
        console.log("Email Id",emailId);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("User joined",{emailId});
    })

})

app.listen(8000,()=>{
    console.log('Server is running on port 8000');
})
io.listen(8001,()=>{
    console.log("Sever is running on port 8001");
});