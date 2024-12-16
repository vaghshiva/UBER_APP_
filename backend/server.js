const http=require('http');
const app=require('./app');
const { initilizeSocket }=require('./socket');
const port=process.env.PORT || 3000

const server=http.createServer(app);

initilizeSocket();

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});