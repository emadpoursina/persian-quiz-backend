import express from "express";
import http from "http";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import router from "./routes/web/index.js";
import bodyParser from "body-parser";
import errorHandler from "./http/middleware/errorHandler.js";
import { CronJob } from "cron";
import Setting from "./models/setting.js";
import settingController from "./http/controllers/settingController.js";
import { getCronPattern, sendEmailWithResend } from "./helpers/utilHelper.js";
import User from "./models/user.js";
import Task from "./models/task.js";
import fs from "fs";
import path from "path";

const app = express();

export default class Application {
  constructor() {
    this.setupExpress();
    this.setMongoConnection();
    this.setConfig();
    this.setRouters();
    this.setupBackupScheduler();
    this.setupEmailNotificationScheduler();
    this.setupManualBackupCleanupScheduler();
  }

  setupExpress() {
    const server = http.createServer(app);
    const serverPort = process.env.APPLICATION_PORT;
    server.listen(serverPort, () =>
      console.log(`Listening on port ${serverPort}`)
    );
  }

  setMongoConnection() {
    mongoose.Promise = global.Promise;
    const user = process.env.DATABASE_USER;
    const pass = process.env.DATABASE_PASS;
    const url = process.env.DATABASE_URL;
    const mongoUri = `mongodb://${user}:${pass}@${url}`;
    mongoose
      .connect(mongoUri)
      .then(() => console.log(`Connected ...`))
      .catch((err) => console.log(err.message));
  }

  /**
   * Express Config
   */
  setConfig() {
    app.enable("trust proxy");
    app.use(helmet());
    app.use(cors());
    // Set Cross-Origin-Resource-Policy header to cross-origin
    app.use((req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // Block direct access to backup files
    app.use("/upload/backup", (req, res, next) => {
      res.status(403).json({ error: "Forbidden" });
    });
    // Serve other static files
    app.use(express.static(process.env.STORAGE_URL + process.env.STORAGE_PATH));
  }

  setRouters() {
    app.use("/api", router);
    // Error handling middleware (404 and general)
    app.use(errorHandler.error404);
    app.use(errorHandler.handler);
  }
}
