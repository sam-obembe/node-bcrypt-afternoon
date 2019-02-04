const bcrypt = require('bcryptjs')
module.exports = {
  register: async(req,res) =>{
    const {username, password, isAdmin}  = req.body
    const db = req.app.get('db')
    const userToCheck = await db.get_user(username);
    const existingUser = userToCheck[0]
    if (existingUser){
      res.status(409).send("username already taken")
    } 
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const registeredUser = await db.register_user(isAdmin,username,hash)
    const user = registeredUser[0]
    req.session.user = {
      isAdmin: is_admin,
      id: user.id,
      username: user.username
    }
    res.status(201).send(req.session.user)
    
  },

  login: async(req,res)=>{
    const {username, password} = req.body
    const db = req.app.get('db')
    const foundUser = await db.get_user([username])
    const user = foundUser[0]
    if(!foundUser){
      res.status(401).send("User not found, please register before logging in")
    }

    const isAuthenticatd = bcrypt.compareSync(password, user.hash)
    if (!isAuthenticatd){
      res.status(403).send("incorrect password")
    } 
    
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    }
    return res.status(200).send(req.session.user)
    
  },

  logout: async(req,res)=>{
    req.session.destroy()
    res.status(200).send(`logged out`)
  }
}