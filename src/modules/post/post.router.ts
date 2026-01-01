import express, { Request, response, Router } from 'express';
import { postController } from './post.controller';
import { Role } from '../../types/type';
import { auth } from '../../middleware/auth';

const router = express.Router()

router.post("/posts", auth(Role.ADMIN, Role.USER), postController.createPost)
router.get("/posts", postController.getAllPosts)

export const postRouter: Router = router


