import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { clearTimeout } from "timers";

let timeout: NodeJS.Timeout;

function startTimeout() {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const NewElectricityStatus = await prisma.home.update({
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

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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
  }

  if (req.method === "GET") {
    const home = await prisma.home.findFirst();
    return res.status(200).json({ home });
  }

  return res.status(405).json({ msg: "Method not allowed" });
}
