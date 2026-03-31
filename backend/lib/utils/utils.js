import jwt from "jsonwebtoken"

export const generateToken = (userId, res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET);
   

    res.cookie("jwt",token,{
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, //prvent XSS ATTACK
        sameSite : "strict", //prevent CSRF ATTACK
        secure : process.env.NODE_ENV!=="development"

    });
}