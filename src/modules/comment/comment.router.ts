import { auth } from "../../middleware/auth";
import { Role } from "../../types/type";
import { commentController } from "./comment.controller";

const express = require('express');
const router = express.Router()



router.get("/author/:authorId", commentController.getCommentById)

router.get("/:commentId", commentController.getCommentById)

router.post("/", auth(Role.USER, Role.ADMIN), commentController.postComment),

    router.patch("/:commentId", auth(Role.ADMIN, Role.USER), commentController.updateComment)
    
    


router.patch("/:commentId/moderator", auth(Role.ADMIN),
    commentController.moderateComment
)


router.delete("/:commentId", auth(Role.ADMIN, Role.USER), commentController.deleteComment)




export const commentRouter = router