const jwt = require('jsonwebtoken')
const verifyToken = (token)=>{
    try{
        const decoded = jwt.verify(
            token, 
            'secretya'
            // process.env.JWT_SECRET
            )
        console.log(decoded)
        return decoded
    }catch(err){
        console.error(err)
        throw new Error(err)
    }
}

module.exports = {verifyToken}