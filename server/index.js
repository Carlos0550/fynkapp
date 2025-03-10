const express = require("express")
const cors = require("cors")
const { verifyDbConnection } = require("./database.js")
const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("SERVER ON")
})

verifyDbConnection()

app.use("/users", require("./routes/users.routes.js"))
app.use("/clients", require("./routes/clients.routes.js"))
app.use("/fast-actions", require("./routes/fastactions.routes.js"))

app.listen(5000, () => {
    console.log("Server is running on port 5000")
}) 