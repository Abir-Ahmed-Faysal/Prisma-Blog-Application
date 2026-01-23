import express, { Application } from 'express';
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import { commentRouter } from './modules/comment/comment.router';
import errorHandler from './middleware/errorHndler';




const app: Application = express()

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())


app.all("/api/auth/*splat", toNodeHandler(auth));
app.use('/api/v1', postRouter),
    app.use('/api/v1/comments', commentRouter)


app.get('/', (req, res) => {
    res.send("prisma Blog application server running successfully")
})

app.use(errorHandler)


export default app