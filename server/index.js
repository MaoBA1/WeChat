const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const compression = require('compression');




// Routers
const userRouter = require('./routes/userRoutes');

app.use(compression());


app.use(express.static('public'));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.json());
app.use(
    cors({
        origin: '*'
    })
)

app.use('/api/user', userRouter);



// controllers
const { postEvents, recive_all_post } = require('./controllers/Posts');
const { accountEvents } = require('./controllers/Account');
const chatEvents = require('./controllers/Chats');

const mongoUrl = `mongodb+srv://maor:wm2qpAw2cZ0nwpkJ@postsandchats.orle5k9.mongodb.net/PostAndChats_db?retryWrites=true&w=majority`;

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: [ "GET", "POST" ]
    }
});


io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, "A6cXZ9Mj5hM4As2wiIugIz5DHNO3q1VF");
      socket.userId = payload.id;
      next();
    } catch (err) {
        console.log(err.message);
    }
});

io.on("connection", socket => {
    console.log(`User connected: ${socket.id}`);
    
    if(socket.userId) {
        recive_all_post(socket);
        postEvents(io, socket);
        accountEvents(io, socket);
        chatEvents(io, socket);
    }


    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id} because ${reason}`);
    });
})



mongoose.connect(mongoUrl)
.then((result) => {
    console.log(result);
    server.listen(process.env.PORT || 3002, () => {
        console.log("SERVER RUNNIG");
    })
})



// app.use(require('express-status-monitor')());


