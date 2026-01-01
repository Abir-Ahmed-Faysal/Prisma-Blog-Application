import { NextFunction, Request, Response } from "express";

const hitApi = (req:Request, res:Response, next:NextFunction) => {
    console.log("hit api successfully","request method :",req.method,`/n`,"request body :",req.body);
    next();
};

export default hitApi;
