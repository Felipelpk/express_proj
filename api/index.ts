import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nunjucks from "nunjucks";
import path from "path";
import routes from './routes/index';

import os from "os";
const tempDir = os.tmpdir();

const app = express();
const templatesDir = path.join(tempDir, "views");

console.log("Templates Dir =>", templatesDir);

app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure(templatesDir, {
    autoescape: true,
    express: app,
    watch: true,
});

app.use('/', routes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;