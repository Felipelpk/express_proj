import express from "express";

export const getHomePage = (req: express.Request, res: express.Response) => {
  res.send("Server is Running!");
};