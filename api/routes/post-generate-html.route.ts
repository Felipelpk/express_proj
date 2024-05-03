import express from "express";
import path from "path";
import fs from "fs";
import { footer } from "../footer";
import nunjucks from "nunjucks";

interface RequestBody {
  components: string[];
  background?: string;
}

export const postGenerateHTML = (req: express.Request<{}, {}, RequestBody>, res: express.Response) => {
  const { components, background } = req.body;
    const bgColor = background ?? "#F6F6F6";

    const pathTemplate = path.join("./api", "views", "template.njk");
    const initialHTML = `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">\n<title>Document</title>\n<style>\nbody{margin:0; padding:0}\nimg{margin:0; padding:0; }\na[href^=tel]{ color:#666666; text-decoration:none;}\na[href^=date]{ color:#666666; text-decoration:none;}\nhr {margin:0 !important}\ndiv, p, a, li, td {-webkit-text-size-adjust:none;}\n.inlineblock>tbody,\n.inlineblock>tbody>tr,\n.inlineblock>tbody>tr>td {display: block; width: 100%}\n@media only screen and (max-width: 600px) {\nimgmobile{max-width: 70%}\n}\n</style>\n</head>\n<body>\n<div style="margin:0; padding:0;" bgcolor="#ffffff">\n<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="table-layout: fixed;" bgcolor="#F6F6F6"><tr><td align="center" valign="top">\n<!--[if mso]><table width="650" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" valign="top"><![endif]-->\n<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:650px" bgcolor="${bgColor}">`;

    try {
        //Creating initial HTML
        fs.writeFileSync(pathTemplate, initialHTML);

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
        const pathOutputHTML = path.join("./api", "output.html");

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