import fs from 'fs';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nunjucks from "nunjucks";
import path from "path";
import routes from './routes/index';

import os from "os";
export const tempDir = os.tmpdir();

const app = express();
export const temporaryTemplatesDir = path.join(tempDir, "views");
const templatesDir = path.join(__dirname, 'views');

function copyFilesToTempDir(sourceDir: any, tempDir: any) {
    // Certifique-se de que o diretório temporário existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  
    // Ler arquivos do diretório de origem
    const files = fs.readdirSync(sourceDir);
  
    // Copiar cada arquivo para o diretório temporário
    files.forEach(file => {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(tempDir, file);
      fs.copyFileSync(sourceFile, destFile);
    });
};

copyFilesToTempDir(templatesDir, temporaryTemplatesDir);

app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure(temporaryTemplatesDir, {
    autoescape: true,
    express: app,
    watch: true,
});

app.use('/', routes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;