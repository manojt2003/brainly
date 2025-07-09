import Express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

import { JWT_PASSWORD } from "./jwt";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import {random} from "./utile"

let app = Express();
app.use(Express.json());

app.post("/api/vi/signup", async (req, res) => {
     const { username, password } = req.body;

     await UserModel.create({ username:username, password:password })

     res.json({
          message: "User created successfully"})
})

app.post("/api/vi/signin", async (req, res) => {
     const { username, password } = req.body;
     const user = await UserModel.findOne({
          username,
          password
          })

     if (user){
          let token = jwt.sign({
               id: user._id,
          },JWT_PASSWORD)

          res.json({
               token
          })
     }
     else {
               res.status(401).json({
               message: "Invalid username or password"
          })
     }
})

// app.post("/api/v1/signin", async (req, res) => {
//           const username = req.body.username;
//           const password = req.body.password;
//           const User = await UserModel.findOne({
//                username,
//                password
//           })
//      if (User) {
//           const token = jwt.sign({
//                id: User._id
//           }, JWT_PASSWORD)

//           res.json({
//                token
//           })
//      } else {
//           res.status(403).json({
//           message: "Incorrrect credentials"
//      })
//      }
// })

app.post("/api/vi/content",userMiddleware, async (req, res) => {

     let {link,title } = req.body;
     await ContentModel.create({
          link,
          title,
          //@ts-ignore
          userId: req.userId,
          tags:[]

     })
     res.json({
          message: "Content created successfully"
     })
})


app.get("/api/vi/content", async (req, res) => {
     // @ts-ignore
     let userId= req.userId;
     await ContentModel.find({
          userId: userId
     })
     res.json({
          message:"content fetched"
     })
})


app.delete("/api/vi/content", async (req, res) => {

})

app.post("/api/vi/brain/share",userMiddleware, async (req, res) => {
     let share=req.body.share

     if(share){
          let exitLink=await LinkModel.findOne({
               //@ts-ignore
               userId:req.userId
          })
          if(exitLink){
               res.json({
                    hash: exitLink.hash
               })
               return;
          }
          let hash=random(20)
          await LinkModel.create({
                // @ts-ignore
               userId: req.userId,
               hash:hash
               
          })

          res.json({
               hash
          })
     }
     else{
          await LinkModel.deleteOne({
               //@ts-ignore
               userId:req.userId
          })
     res.json({
          message:"removed link "
     })
     }
})

app.get("/api/vi/brain/:shareLink", async (req, res) => {
     let hash=req.params.shareLink

     let link= await LinkModel.findOne({
          hash
     })

     if(!link){
          res.status(404).json({
               message:'sorry incorrect input'
               
          })
          return
     }

     let content= await ContentModel.find({
          userId: link.userId
     })

     let user =await UserModel.findOne({
          _id:link.userId
     })

     if(!user){
          res.status(411).json({
               message:"user not found"
          })

     }    
     
     res.json({
          username:user?.username,
          content:content
     })

})


app.listen(3000)
