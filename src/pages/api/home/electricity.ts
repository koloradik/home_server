import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { clearTimeout } from "timers";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const home = await prisma.home.findFirst();
  return res.status(200).json({ home });
}
