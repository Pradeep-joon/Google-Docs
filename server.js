import { Server, Socket } from 'socket.io';
import express from 'express';
import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/documentController.js';
import { createServer } from 'http';


  const URL = process.env.MONGODB_URI || `mongodb+srv://pradeepjoon0001:fSg3Fttw5phUNa9J@google-docs.ys0mn6k.mongodb.net/?retryWrites=true&w=majority`;
Connection(URL);

const app = express();

if(process.env.NODE_ENV ==='production'){
    app.use(express.static('docs/build'));
}

const httpServer = createServer(app);
httpServer.listen(PORT);



const PORT = process.env.PORT || 9000;

const io = new Server(httpServer); 


io.on('connection', Socket => {

    Socket.on('get-document', async documentId => {

        const document = await getDocument(documentId);
        Socket.join(documentId);
        Socket.emit('load-document', document.data);
        Socket.on('send-changes', delta => {
            Socket.broadcast.to(documentId).emit('recieve-changes', delta);
        })
        Socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })



});