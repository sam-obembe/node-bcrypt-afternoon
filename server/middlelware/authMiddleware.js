module.exports = {
  usersOnly: (req,res,next)=>{
    if(!req.session.user){
      res.status(401).send("Please log in")
    }
    next() 
  },

  adminsOnly: (req,res,next)=>{
    const{user} = req.session
    if(!user.isAdmin){
      res.status(403).send("You shall not pass")
    }
    next()
  }
}