import dbConnect from "@/database/dbConnect";
import Wallet from "@/database/models/wallet.schema";
import { ExtendedResponse, Wallet as WalletProp } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtendedResponse<WalletProp>>
) {
  await dbConnect();

  const { method } = req;

  if (method != "POST")
    res.json({
      code: 405,
      success: false,
      message: "Incorrect Request Method",
    });

  let { id, walletOption } = req.body;

  return await Wallet.findOneAndUpdate({ _id: id }, walletOption, { new: true })
    .then((e) => {
      return res.json({
        code: 200,
        success: true,
        message: "Successfully updated",
        data: e,
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

export default handler;
