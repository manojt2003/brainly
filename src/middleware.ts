import { NextFunction,Request,Response} from "express";
import { JWT_PASSWORD } from "./jwt";
import jwt from "jsonwebtoken"

export let userMiddleware = (req:Request , res:Response, next:NextFunction) => {
     let header=req.headers["authorization"];
     let decode = jwt.verify(header as string, JWT_PASSWORD);
     if (decode){
          //@ts-ignore
          req.userId= decode.id;
          next();
     }else{
          res.status(401).json({
               message: "Unauthorized"
          })
     }

}
