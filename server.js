const path =require('path')

const express = require ("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
dotenv.config({path: "config.env"})



const apiError = require(`./utils/apiError`)
const dbconnection = require("./config/database")

const mountRoutes=require('./routes')

const globaleError = require(`./middlewares/errorMidlleware`)




//Express app
const app = express();

//Dtaebase Call
dbconnection()


//Midlleware
app.use(express.json())
app.use(express.static(path.join(__dirname,'uploads')))


if(process.env.Node_ENV=="development"){
    app.use(morgan("dev"))
    console.log(`mode:${process.env.Node_ENV} `)
    
}else{
    app.use(morgan("prod"))
    console.log(`mode:${process.env.Node_ENV} `)
}









// Mount Routse
mountRoutes(app)




//Create Handle Unhandled Routes and Send Error to Error Handling Middleware
app.all('*',(req,res,next)=>{    
next(new apiError(`can not find this route: ${req.originalUrl}`,400))
})

//Globale Error Handling Middleware
app.use(globaleError)

//Unhandled Rejections Errors
process.on('unhandledRejection',(err)=>{
    console.log(`UnhandledRejection Errors: ${err}`)
    server.close(()=>{
        console.error(`APP shut down...`)
        process.exit(1)

    })
    


})

// listen server to port
const PORT = process.env.port || 5000
const server =app.listen (PORT, () => {
    console.log(`server is running on port: ${PORT}`)

})
