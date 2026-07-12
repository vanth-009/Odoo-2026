const { Sequelize } = require("sequelize");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const host = process.env.DB_HOST || "127.0.0.1";
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "company_umbrella";

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    console.log(`[DB] Database "${database}" verified/created`);
  } catch (error) {
    console.warn(`[DB] Warning: Could not auto-create database "${database}":`, error.message);
  }
}

async function connectDatabases() {
  await ensureDatabaseExists();
  try {
    await sequelize.authenticate();
    console.log("[DB] MySQL connected successfully");
    
    // Load models before syncing
    require("../models");
    
    // Automatically sync models
    await sequelize.sync();
    console.log("[DB] MySQL tables synchronized");
    
    // Auto-seed mock data
    const { seedMysql } = require("../scripts/seedMysql");
    await seedMysql();
  } catch (error) {
    console.error("[DB] MySQL connection failed:", error.message);
    console.error("[DB] Please ensure MySQL is running locally and credentials in .env are correct.");
  }
}

module.exports = {
  sequelize,
  connectDatabases
};
