const express = require("express")
const cors = require("cors")
const cron = require("node-cron");

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
app.use("/debts", require("./routes/debts.routes.js"))

// Cron Jobs
const cron_jobs = require("./Cron_Jobs/cron_jobs.controller.js")
cron.schedule("0 */30 * * *", cron_jobs.updateDebtsStatus)

app.listen(5000, () => {
    console.log("Server is running on port 5000")
}) 