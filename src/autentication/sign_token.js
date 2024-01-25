const jwt = require('jsonwebtoken');

 const signToken=({data})=>{
    console.log(data,"DATA");
    const token = jwt.sign(data,'secretya')
    return token
}

module.exports={signToken}