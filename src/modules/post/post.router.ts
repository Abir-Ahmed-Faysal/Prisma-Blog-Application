import express, { Router } from 'express';
import { postController } from './post.controller';
import { Role } from '../../types/type';
import { auth } from '../../middleware/auth';

const router = express.Router()


router.get("/posts", postController.getAllPosts)
router.get("/posts/stats", postController.getStats)

router.get("/posts/my-posts", auth(Role.ADMIN, Role.USER), postController.getMyPost)

router.get("/posts/:postId", postController.getPostById)

router.post("/posts", auth(Role.ADMIN, Role.USER), postController.createPost)

router.patch("/posts/:postId", auth(Role.ADMIN, Role.USER), postController.postUpdate)

router.patch("/posts/:postId", auth(Role.ADMIN, Role.USER), postController.postDelete)






export const postRouter: Router = router