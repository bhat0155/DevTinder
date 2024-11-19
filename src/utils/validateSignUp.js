const validator=require("validator")

const validateSignUp=(req)=>{
    const{firstName, lastName, email, password}=req.body;
    if(!firstName || !lastName || !email || !password){
        throw new Error("first name, last name, email and password are mandatory requirements")
    }

    if (firstName.length<4 || firstName.length>50){
        throw new Error("first name should be atleast 4 characters and atleast 50")

    }
    if (!validator.isEmail(email)){
        throw new Error("Please enter a valid email id")

    }
    if (!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")

    }

}

module.exports={validateSignUp}