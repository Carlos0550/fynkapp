const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("SERVER ON")
})

app.listen(5000, () => {
    console.log("Server is running on port 5000")
})