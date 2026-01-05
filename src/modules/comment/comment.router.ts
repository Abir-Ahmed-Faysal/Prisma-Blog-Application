import { auth } from "../../middleware/auth";
import { Role } from "../../types/type";
import { commentController } from "./comment.controller";

const express = require('express');
const router = express.Router()


router.use("/", auth(Role.USER, Role.ADMIN) ,commentController.postComment)

export const commentRouter = router