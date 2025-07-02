import Express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "./jwt";

import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";

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


// app.get("/api/vi/content", async (req, res) => {
//      // @ts-ignore
//      let userId= req.userId;
//      let content = await ContentModel.find({
//           userId: userId
//      }).populate("userId","username")
//      res.json({
//           message:"content fetched"
//      })
// })

app.get("/api/v1/content", async (req, res) => {
     
        // Assuming userId is set by authentication middleware
            // @ts-ignore
          const userId = req.userId;
          await ContentModel.find({ userId })
               .populate("userId", "username");

          res.status(200).json({
               message: "Content fetched successfully"
          });
})

app.delete("/api/vi/content", async (req, res) => {

})

app.post("/api/vi/brain/share", async (req, res) => {

})

app.get("/api/vi/brain/:shareLink", async (req, res) => {

})

app.listen(3000)
