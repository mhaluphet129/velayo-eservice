import axios from "axios";
import Cookies from "js-cookie";

import { verify } from "@/assets/ts";
import { useAuthStore } from "./context";
import { ExtendedResponse, ApiGetProps, ApiPostProps } from "@/types";

abstract class API {
  public static async get<T>({
    endpoint,
    query,
  }: ApiGetProps): Promise<ExtendedResponse<T>> {
    const { accessToken: token } = useAuthStore.getState();

    const request = await axios.get(`/api/${endpoint}`, {
      params: query,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (request.data.success)
      return {
        success: true,
        code: request.status,
        message: request.data.message,
        data: request.data.data,
        meta: request.data.meta,
      };
    else
      return {
        success: false,
        code: 500,
        message: "There is an error in the Server.",
      };
  }

  public static async post<T>({
    endpoint,
    payload,
  }: ApiPostProps): Promise<ExtendedResponse<T>> {
    const { accessToken: token } = useAuthStore.getState();

    const request = await axios.post(`/api/${endpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (request.data.success)
      return {
        success: true,
        code: request.status,
        message: request.data.message,
        data: request.data.data,
      };
    else
      return {
        ...request.data,
        success: false,
      };
  }

  private async checkToken() {
    const { accessToken: token } = useAuthStore.getState();
    return new Promise<void>(async (resolve, reject) => {
      try {
        const flag = await verify(token!, process.env.JWT_PRIVATE_KEY!);
        if (!token || !flag) reject("No Bearer token");
        else resolve();
      } catch {
        Cookies.remove("token");
        reject("Incorrect/No Bearer token");
      }
    });
  }
}

export default API;
