import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.json({
            suuccess: false,
            message: "Error",
        })
        
    }
}

// create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Register User 
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({email});
        if (exists) {
            // check if user already exist
            return res.json({
                success: false,
                message: "User already exist"
            })
        }

        // validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            })
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "please enter a strong password"
            })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        })

        // saved user in db
        const user = await newUser.save()
        // GET USER ID AND GENERATE TOKEN
        const token = createToken(user._id)
        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "error"
        })
        
    }
}

export { loginUser, registerUser }