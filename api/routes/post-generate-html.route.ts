import express from "express";
import path from "path";
import fs from "fs";
import { footer } from "../footer";
import nunjucks from "nunjucks";
import { tempDir } from "../index";
import { generateHeaderHTML } from "../header";

interface RequestBody {
  components: string[];
  background?: string;
};

export const postGenerateHTML = (req: express.Request<{}, {}, RequestBody>, res: express.Response) => {
  const { components, background } = req.body;
    const bgColor = background ?? "#F6F6F6";

    const pathTemplate = path.join(tempDir, "views", "template.njk");
    const header = generateHeaderHTML(bgColor);

    try {
        //Creating initial HTML
        fs.writeFileSync(pathTemplate, header);

        // Adding Components
        if (components) {
            components.forEach(component => {
                const componentHTML = `\n{% include "./${component}.njk" %}`;
                fs.appendFileSync(pathTemplate, componentHTML);
            });
        };

        // Adding Footer;
        fs.appendFileSync(pathTemplate, footer);

        const generateHTML = nunjucks.render("template.njk");
        const pathOutputHTML = path.join(tempDir, "output.html");

        fs.writeFileSync(pathOutputHTML, generateHTML);

        res.download(pathOutputHTML, "template.html", (error) => {
            if (error) console.log("Error =>", error);

            fs.unlinkSync(pathOutputHTML);
        });
    } catch (error) {
        console.log("Error =>", error);
        res.status(500).send("Internal Server Error");
    };
};