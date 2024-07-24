import jwt  from 'jsonwebtoken'
import userModel from '../../db/user.model.js'




export const auth = (roles=[])=>{
    return async (req,res,next)=>{
        const {token } = req.headers
        if (!token) {
            return res.status(400).json({msg:'token is not exist'})
        }
        if (!token.startsWith("arso__")) {
            return res.status(400).json({msg:"token not valid"})
        }
        const newToken = token.split("arso__")[1]
        if (!newToken) {
            return res.status(400).json({msg:"token not found"})
            
        }
        //console.log(newToken);
        const decoded = jwt.verify(newToken , 'arsany')
        if (!decoded.email) {
            return res.status(400).json({msg:"invalid payload"})
            
        }
        const user = await userModel.findOne({email:decoded.email})
        if (!user) {
            return res.status (409).json({msg:'invalid user'})
        }
        //=======Authorization===============/
        if (!roles.includes(user.role)) {
            return res.status(401).json({msg:'you dont have permission'})
        }
        req.userInfo = user
        next()
    

    }

}