require("dotenv").config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const bodyParser = require('body-parser')
const ac = require('./controllers/authController')
const tc = require('./controllers/treasureController')
const authMid = require('./middlelware/authMiddleware')
const app = express()
app.use(bodyParser.json())

const {port, CONNECTION_STRING, SESSION_SECRET} = process.env

app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
}))

massive(CONNECTION_STRING).then(dbInstance =>{
  app.set('db',dbInstance)
  console.log(`db connected`)
}).catch(err => console.log(err))

app.post("/auth/register",ac.register)
app.post("/auth/login", ac.login)
app.get("/auth/logout", ac.logout)

app.get("/api/treasure/dragon", tc.dragonTreasure)
app.get("/api/treasure/user", authMid.usersOnly, tc.getUserTreasure)
app.post("/api/treasure/user",authMid.usersOnly, tc.addUserTreasure)
app.get("/api/treasure/all",authMid.usersOnly,authMid.adminsOnly, tc.getAllTreasure)
app.listen(port, ()=> console.log(`listening on localhost:${port}`))
