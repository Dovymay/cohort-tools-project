const express = require("express");
const UserModel = require("../models/UserModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const router = express.Router()
const verifyExpressJWT = require("../middleware/isAuthExpressJWT.js")

router.post("/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body

        //1. Make sure all info is sent from client
        if (!email || !password ||!name) {
            return res.status(400).json({message: "Please, provide all info."})
        }

        //2. Registering a user, if found with provided info, user already exists
        const foundUser = await UserModel.findOne({ email })
        if (foundUser){
            return res
            .status(400)
            .json({ message: "Email already used!"})
        }

        //3. Use regex to validate the password format
        if (
      !password.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
      )
    ) {
      return res.status(400).json({
        message:
          "Password has to be 8 characters long, with 1 uppercase, 1 lowercase and 1 special character",
      })
    }

        //4. If the email is unique, proceed to hash the password
        const salts = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salts)
        
        //5. Create a new user in the database
        // We return a pending promise, which allows us to chain another `then` 
        const createdUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    })

    return res
      .status(201)
      .json({ message: "User created succesfully", createdUser})

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})








router.post("/login", async (req, res) => {
    const { email, password, name} = req.body;
     try{
        
        //1. VALIDATE INPUT
       if(!email || !password) {
        return res.status(400).json({message: "Please provide all info"})
       }

       // 2. FIND USER
       const user = await UserModel.findOne({ $or: [{email} , {name}] });
       if(!user) {
        return res.status(401).json({message: "User not found"})
       }

       // 3. VERIFY PASSWORD
       const passwordCorrect = await bcrypt.compare(password, user.password);
       
       if(passwordCorrect){
        // 4. CREATE THE PAYLOAD
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
        
        // 5. SIGN THE TOKEN USEING JWT
        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
        );

        // 6. SEND THE TOKEN BACK TO THE CLIENT 
        res.status(200).json({ authToken: authToken})
       }else{
        res.status(401).json({ message: "Unable to authenticate the user "});
       }  
    }catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.get("/verify", verifyExpressJWT, async (req, res) => {
  console.log(req.auth)

  return res.status(200).json("verified")
})


router.get("/api/users/:id", verifyExpressJWT, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).select("-password")
        res.status(200).json(user)
    } catch (error) {
         console.log(error)
        return res.status(500).json(error) 
    }
})

module.exports = router;