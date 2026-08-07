import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { db } from './config/db.js';
import employeeMasterRoutes from './routes/employeeMasterRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import AssetMaseterRoutes from "./routes/assetMasterRoutes.js";
import assetCategoryRoutes from "./routes/assetCategoryRoutes.js";
import assetIssueRoutes from "./routes/assetIssueRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "jade");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/employeemaster', employeeMasterRoutes);
app.use('/api/assetsMaster', AssetMaseterRoutes);
app.use('/api/assetsCategory', assetCategoryRoutes);
app.use('/api/assetIssues', assetIssueRoutes);
app.use('/', pageRoutes);

app.use((req, res) => {
  res.redirect('/');
});

db.authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch(err => {
    console.log('Error: ' + err);
  });

await db.sync({ alter: true });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});