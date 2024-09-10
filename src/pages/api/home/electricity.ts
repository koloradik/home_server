import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: (result: Error | void) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: Error | void) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  runMiddleware(req, res, cors);

  const home = await prisma.home.findFirst();
  return res.status(200).json({ home });
}
