import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "HEAD"],
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

let timeout: NodeJS.Timeout;

function startTimeout() {
  timeout = setTimeout(async () => {
    await prisma.home.update({
      where: {
        id: "819c8269-f307-4d18-9ea9-4f2a9b2f1d03",
      },
      data: {
        electricity: false,
      },
    });
    console.log("Таймер сработал: статус электричества изменён на false");
  }, 120000);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runMiddleware(req, res, cors);

    startTimeout();

    const body = req.body as {
      id: string;
      electricity: boolean;
    };

    if (!body.id || typeof body.electricity !== "boolean") {
      console.log("Ошибка: некорректные данные", body);
      return res.status(400).json({ msg: "Bad request" });
    }

    const home = await prisma.home.findUnique({
      where: { id: body.id },
    });

    if (!home) {
      return res.status(404).json({ msg: "not found" });
    }

    const NewElectricityStatus = await prisma.home.update({
      where: {
        id: body.id,
      },
      data: {
        electricity: body.electricity,
      },
    });

    return res.status(200).json({ NewElectricityStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
