import { auth } from "../../middleware/auth";
import { Role } from "../../types/type";
import { commentController } from "./comment.controller";

const express = require('express');
const router = express.Router()


router.post("/", auth(Role.USER, Role.ADMIN), commentController.postComment),

    router.get("/author/:authorId", commentController.getCommentById)

router.get("/:commentId", commentController.getCommentById)

router.patch("/:commentId",auth(Role.ADMIN,Role.USER), commentController.updateComment)


router.delete("/:commentId", auth(Role.ADMIN, Role.USER), commentController.deleteComment)




export const commentRouter = router