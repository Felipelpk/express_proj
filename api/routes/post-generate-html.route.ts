import express from "express";
import path from "path";
import fs from "fs";
import nunjucks from "nunjucks";
import { tempDir } from "../index";
import { generateFooterTemplate, generateHeaderTemplate } from "../helpers/index";

interface RequestBody {
  components: string[];
  background?: string;
};

export const postGenerateHTML = (req: express.Request<{}, {}, RequestBody>, res: express.Response) => {
  const { components, background } = req.body;
    const bgColor = background ?? "#F6F6F6";

    const pathTemplate = path.join(tempDir, "views", "template.njk");
    const header = generateHeaderTemplate(bgColor);
    const footer = generateFooterTemplate();

    try {
        //Creating initial template using Header
        fs.writeFileSync(pathTemplate, header);

        // Adding Components if necessary
        if (components) {
            components.forEach(component => {
                const componentHTML = `\n{% include "./${component}.njk" %}`;
                fs.appendFileSync(pathTemplate, componentHTML);
            });
        };

        // Adding Footer
        fs.appendFileSync(pathTemplate, footer);

        // Render template
        const generateHTML = nunjucks.render("template.njk");
        const pathOutputHTML = path.join(tempDir, "output.html");

        // Creating output HTML
        fs.writeFileSync(pathOutputHTML, generateHTML);

        // Send to download
        res.download(pathOutputHTML, "template.html", (error) => {
            if (error) console.log("Error =>", error);

            // Delete output HTML
            fs.unlinkSync(pathOutputHTML);
        });
    } catch (error) {
        console.log("Error =>", error);
        res.status(500).send("Internal Server Error");
    };
};