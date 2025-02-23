import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app} from './app.js'

dotenv.config({
    path: './env'
})

app.get('/', async (req, res) => {
    return res.status(200).json(
        {message: "Hello from Backend",}
    )
})

connectDB()
    .then(
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server running at port: ${process.env.PORT}`)
        })
    )
    .catch((err) => {
        console.log("MongoDB connection Failed!", err)
    })