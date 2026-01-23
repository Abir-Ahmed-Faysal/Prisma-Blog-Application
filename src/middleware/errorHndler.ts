import { Request, Response } from "express";

const errorHandler = async (err: Error, req: Request, res: Response) => {
    console.log(err);
}

export default errorHandler