import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const subscribersFile = path.resolve(process.cwd(), "subscribers.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const subscribers = JSON.parse(fs.readFileSync(subscribersFile, "utf-8"));
    if (subscribers.includes(email)) {
      return res.status(400).json({ error: "Already subscribed" });
    }

    subscribers.push(email);
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    return res.status(200).json({ message: "Subscribed successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}