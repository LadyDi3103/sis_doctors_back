const { verifyToken } = require("../utils/verifyToken");

const authToken = (req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token:', token);  console.log(token,"TOKEN");
    try{
        const decode =verifyToken(token);
        console.log(decode);
        next()
        // req.user = decode
    }catch(err){
        res.send({message:'Token invalid'}).status(401)
        console.error(err)
    }
}

module.exports = {authToken}