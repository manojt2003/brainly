
import mongoose, {Schema, model} from "mongoose";

mongoose.connect("mongodb+srv://vasu775575:3QWflQviNlilOWjz@cluster0.qytzogp.mongodb.net/")

let UserSchema = new Schema({
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true}
})

export let UserModel= model("User", UserSchema);

let ContentSchema = new Schema({
     link: String,
     title:String,
     tags:[{ type:mongoose.Types.ObjectId, ref: "Tag" }],
     userID:[{ type: mongoose.Types.ObjectId, ref: "User", requires:true }]

})

export let ContentModel = model("Content", ContentSchema);

