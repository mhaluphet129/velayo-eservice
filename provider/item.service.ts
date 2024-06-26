import Loader from "./utils/loader";
import Api from "./api.service";
import {
  InputProps,
  Item,
  ItemCode,
  ItemData,
  TransactionPOS,
  OnlinePayment,
  Transaction,
  Response,
  BranchData,
} from "@/types";

class ItemService extends Loader {
  private readonly instance = new Api();

  public async getItems(query?: any) {
    return await this.instance.get<BranchData[] | ItemData[]>({
      endpoint: "/item/all",
      query,
    });
  }

  public async newItem(str: any, parentId?: string) {
    return await this.instance.post<Response>({
      endpoint: "/item/new",
      payload: {
        ...str,
        parentId,
      },
    });
  }

  public async getLastItemcode() {
    this.loaderPush("fetch-last-code");
    const response = await this.instance.get<ItemCode>({
      endpoint: "/item/get-last-itemcode",
    });
    this.loaderPop("fetch-last-code");
    return response;
  }

  public async getItemSpecific(id: string) {
    this.loaderPush("get-item");
    const response = await this.instance.get<ItemData>({
      endpoint: "/item/specific",
      query: {
        id,
      },
    });
    this.loaderPop("get-item");
    return response;
  }

  public async deleteItem(id: string) {
    this.loaderPush("delete-item");
    const response = await this.instance.get<Item>({
      endpoint: "/item/delete",
      query: {
        id,
      },
    });
    this.loaderPop("delete-item");
    return response;
  }

  public async updateItem(id: string, item: InputProps) {
    this.loaderPush("update-item");
    const response = await this.instance.post<ItemData>({
      endpoint: "/item/update",
      payload: {
        ...item,
        id,
      },
    });
    this.loaderPop("update-item");
    return response;
  }

  public async searchItem(search: string) {
    this.loaderPush("search-item");
    const response = await this.instance.get<ItemData[]>({
      endpoint: "/item/search",
      query: {
        search,
      },
    });
    this.loaderPop("search-item");
    return response;
  }

  public async purgeItem(id: string) {
    const response = await this.instance.get<ItemData[]>({
      endpoint: "/item/purge-item",
      query: {
        id,
      },
    });
    return response;
  }

  public async requestTransaction(
    transactionDetails: string,
    cash: number,
    amount: number,
    fee: number,
    tellerId: string,
    branchId: string,
    reference: string,
    online?: OnlinePayment
  ) {
    let transaction: TransactionPOS = {
      type: "miscellaneous",
      transactionDetails, // crucial
      reference,
      cash,
      amount,
      tellerId,
      branchId,
      fee,
      ...(online?.isOnlinePayment ?? false ? online : {}),
      history:
        online?.isOnlinePayment ?? false
          ? [
              {
                description: "First  Transaction requested",
                status: "pending",
                createdAt: new Date(),
              },
            ]
          : [
              {
                description: "Transaction Completed",
                status: "completed",
                createdAt: new Date(),
              },
            ],
    };

    this.loaderPush("request-bill");
    const response = await this.instance.post<Transaction | Response>({
      endpoint: "/bill/request-transaction",
      payload: { ...transaction, branchId },
    });
    this.loaderPop("request-bill");
    return response;
  }
}

export default ItemService;
