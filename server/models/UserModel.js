const {Schema, model} = require("mongoose")


const userSchema = new Schema ({
    email : {
        type: String,
        unique: true,
    },
    password: {
    type: String,
    },
    name: {
        type: String,
    }
})

const UserModel = model("user", userSchema)

//Export the model to use in other files
module.exports = UserModel