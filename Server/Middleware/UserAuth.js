import jwt from "jsonwebtoken";

const UserAuth = async(req,res,next)=>{
    const {token} = req.cookies;

    if (!token) {
        return res.json({success:false,message:'Not Autoraized.Login Again'});
    }

    try {
        const tokenDecod = jwt.verify(token,process.env.JWT_SECRET);

        if (tokenDecod.id) {
            req.userId = tokenDecod.id
        } else {
             return res.json({success:false,message:'Not Autoraized.Login Again'});
        }
        next();
    } catch (error) {
         return res.json({success:false,message:error.message});
    }
}
export default UserAuth;