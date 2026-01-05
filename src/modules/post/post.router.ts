import express, {  Router } from 'express';
import { postController } from './post.controller';
import { Role } from '../../types/type';
import { auth } from '../../middleware/auth';


const router = express.Router()
router.get("/posts", postController.getAllPosts)
router.get("/posts/:postId", postController.getPostById )
router.post("/posts", auth(Role.ADMIN, Role.USER), postController.createPost)


export const postRouter: Router = router


