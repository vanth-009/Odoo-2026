const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const { connectDatabases } = require("./config/db");
const { startReminderJob } = require("./cron/reminderJob");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend + MySQL running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/export", exportRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect database and start server
async function startServer() {
  await connectDatabases();
  startReminderJob();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
