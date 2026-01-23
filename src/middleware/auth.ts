import { NextFunction, Request, Response } from "express"
import { Role } from "../types/type";
import { auth as betterAuth } from '../lib/auth';
import { fromNodeHeaders } from "better-auth/node";

export const auth = (...role: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {


            const session = await betterAuth.api.getSession(
                {
                    headers: fromNodeHeaders(req.headers)
                }
            )
console.log(session);
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized",
                })
            }

            if (!session.user.emailVerified) {
                return res.status(401).json({
                    success: false,
                    message: "Email verification needed"
                })
            }


            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                emailVerified: session.user.emailVerified,
                role: session.user.role as string

            }

            if (role.length && !role.includes(req.user.role as Role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden Access"
                })
            }
            next()

        } catch (error) {
            next(error)
        }
    }

}