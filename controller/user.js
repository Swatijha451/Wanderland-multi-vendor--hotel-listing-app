const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs")
}


module.exports.signupUser=( async(req,res)=>{
    try{
    const{fullname, username,email,password}=req.body;
    const newUser=new User({fullname, username, email});
    const registeredUser= await User.register(newUser,password);

    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLand");
        res.redirect("/listings");

    })
    console.log(registeredUser);
    
    }
    catch(e){
        req.flash("error" ,e.message);
        res.redirect("/signup");
    }    
});

module.exports.renderLoginForm=(req,res) =>{
    res.render("./users/login.ejs");
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcome back to WanderLand");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user Logged Out Succssfully");
        res.redirect("/listings");
    })
    
};