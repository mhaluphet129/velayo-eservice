import dbConnect from "@/database/dbConnect";
import Transaction from "@/database/models/transaction.schema";
import { ExtendedResponse, Response } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

import { Pusher2 } from "@/provider/utils/pusher";
import authMiddleware from "@/assets/ts/apiMiddleware";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtendedResponse<Response>>
) {
  await dbConnect();

  const { method } = req;

  if (method != "POST")
    res.json({
      code: 405,
      success: false,
      message: "Incorrect Request Method",
    });

  return await Transaction.findOneAndUpdate({ _id: req.body._id }, req.body, {
    returnOriginal: false,
  })
    .then(async (e) => {
      await new Pusher2().emit(
        `teller-${e.tellerId.toString().slice(-5)}`,
        "notify",
        {
          queue: e.queue,
          id: e._id.toString(),
        }
      );
      return res.json({
        code: 200,
        success: true,
        message: "Successfully updated",
      });
    })
    .catch((e) => {
      console.log(e);
      return res.json({
        code: 500,
        success: false,
        message: "There is an error in the Server.",
      });
    });
}

export default authMiddleware(handler);
