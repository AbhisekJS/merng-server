const validateRegisterInput = (username,email,password,confirmPassword) =>{
    const errors = {}
    if(username.trim()===''){
        errors.username = 'Username Cant Be empty'
    }
    if(email.trim()===''){
        errors.email = 'Email Cant Be empty'
    }else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
        }
    }
    if (password === ''){
        errors.password = 'Password must not be Empty'
    } else if( password !== confirmPassword){
        error.confirmPassword = 'Passwords must Match'
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    };
}

const validateLoginInput = (username,password) =>{
    const errors = {};
    if(username.trim()===''){
        errors.username ='Username must not be Empty'
    }
    if(password.trim()===''){
        errors.password ='Password must not be Empty'
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports={
    validateRegisterInput,
    validateLoginInput 
}