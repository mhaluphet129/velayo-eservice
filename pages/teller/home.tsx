import React, { useEffect, useState } from "react";
import { Button, Col, Row, Tag, Typography, message, notification } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { MdOutlineSendToMobile } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import { AiOutlineFileDone } from "react-icons/ai";

import { UserBadge, DashboardBtn } from "@/app/components";
import {
  WalletForm,
  TransactionHistory,
  TransactionDetails,
  BillsPayment,
} from "@/app/components/teller";

import { BranchData, Eload as EloadProp, TransactionOptProps } from "@/types";
import { useItemStore, useUserStore } from "@/provider/context";
import { Pusher } from "@/provider/utils/pusher";
import Eload from "@/app/components/teller/forms/eload_form";
import ShoppeForm from "@/app/components/teller/shoppe_form";

import BillService from "@/provider/bill.service";
import BranchService from "@/provider/branch.service";
import PosHome from "@/app/components/pos/pos";
import dayjs from "dayjs";
import ItemService from "@/provider/item.service";

const Teller = () => {
  const [openedMenu, setOpenedMenu] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [brans, setBrans] = useState<BranchData | null>(null);
  const [transactionDetailsOpt, setTransactionOpt] =
    useState<TransactionOptProps>({
      open: false,
      transaction: null,
    });

  const { currentUser, currentBranch, setPrinter, printerIsAlive } =
    useUserStore();
  const { setItems, lastDateUpdated, setLastDateUpdated, items } =
    useItemStore();

  const bill = new BillService();
  const branch = new BranchService();
  const itemService = new ItemService();

  const menu = [
    {
      title: "Bills \nPayment",
      icon: (
        <FaMoneyBills
          className="db-btn"
          style={{ fontSize: 80, color: "#000" }}
        />
      ),
      onPress: () => setOpenedMenu("bills"),
    },
    {
      title: "Wallet Cash \nIn/out",
      icon: (
        <WalletOutlined
          className="db-btn"
          style={{ fontSize: 80, color: "#000" }}
        />
      ),
      onPress: () => setOpenedMenu("gcash"),
    },
    {
      title: "E-Load",
      icon: (
        <MdOutlineSendToMobile
          className="db-btn"
          style={{ fontSize: 80, color: "#000" }}
        />
      ),
      onPress: () => setOpenedMenu("eload"),
    },
    {
      title: "Shopee Self \nCollect",
      onPress: () => setOpenedMenu("shoppe"),
    },
    {
      title: "Transaction History",
      icon: (
        <AiOutlineFileDone
          className="db-btn"
          style={{ fontSize: 80, color: "#000" }}
        />
      ),
      onPress: () => setOpenedMenu("th"),
    },
    {
      title: "Miscellaneous",
      onPress: () => setOpenedMenu("pos"),
    },
  ];

  const initPusherProvider = () => {
    let channel = new Pusher().subscribe(
      `teller-${currentUser?._id.slice(-5)}`
    );
    channel.bind("notify", handleNotify);
    return () => {
      channel.unbind();
      channel.unsubscribe();
    };
  };

  const close = () => setOpenedMenu("");

  const handleNotify = (data: any) => {
    let { queue, id } = data;

    api.info({
      message: `Transaction ID #${queue} has been updated`,
      duration: 0,
      btn: (
        <Button
          type="primary"
          style={{ border: "none" }}
          ghost
          onClick={() => openTransaction(id)}
        >
          Open
        </Button>
      ),
    });
  };

  const openTransaction = (id: string) => {
    api.destroy();
    new Promise<void>((resolve, reject) => {
      setOpenedMenu("th");
      resolve();
    }).then(async () => {
      await (TransactionHistory as any).openTransaction(id);
    });
  };

  async function checkServer() {
    try {
      const response = await fetch("http://localhost:3001/");
      if (!response.ok) {
        throw new Error("Server is not available");
      }
    } catch (error) {
      return false;
    }
    return true;
  }

  const handleEloadRequest = (eload: EloadProp) => {
    return (async (_) => {
      let res = await bill.requestEload(
        {
          ...eload,
          tellerId: currentUser?._id ?? "",
        },
        currentBranch
      );
      return res.success ?? false;
    })(bill);
  };

  useEffect(() => {
    return initPusherProvider();
  }, []);

  useEffect(() => {
    setPrinter(false);
    (async () => {
      if (!(await checkServer())) {
        setPrinter(false);
        return;
      } else {
        setPrinter(true);
        return;
      }
    })();
  }, []);

  useEffect(() => {
    const minutes = 5; // change this to update the items per (x) minutes
    (async (_) => {
      let res = await _.getBranchSpecific(currentBranch);

      if (res?.success ?? false) setBrans(res?.data ?? null);
    })(branch);

    if (
      Math.abs(dayjs(lastDateUpdated).diff(dayjs(), "minutes")) >= minutes ||
      lastDateUpdated == null ||
      items.length == 0
    ) {
      (async (_) => {
        let res = await _.getItems({ _id: currentBranch });

        if (res?.success ?? false) {
          let items = (res.data as BranchData[])?.at(0)?.items;
          let updatedData: any[] = [];

          (items ?? []).map((e) => {
            updatedData.push({
              ...e.itemId,
              quantity: e.stock_count,
            });
          });

          setItems(updatedData);
          setLastDateUpdated(dayjs());
          console.log("Items are refreshed");
        }
      })(itemService);
    }
  }, []);

  return (
    <>
      <div className="teller main-content">
        <div
          className="body-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div>
            <UserBadge
              name={currentUser?.name ?? ""}
              title={
                currentUser
                  ? `${currentUser.role[0].toLocaleUpperCase()}${currentUser.role.slice(
                      1
                    )}`
                  : null
              }
              style={{
                marginTop: 25,
                marginLeft: 25,
                marginRight: 25,
              }}
              role={currentUser?.role}
              setOpenedMenu={setOpenedMenu}
            />
          </div>
          <div>
            <Row gutter={[32, 32]} style={{ padding: 20 }}>
              {menu.map((e, i) => (
                <Col span={8} key={`btn-${i}`}>
                  <DashboardBtn key={`btn-child-${i}`} {...e} />
                </Col>
              ))}
            </Row>
            <div
              style={{
                display: "flex",
                marginBottom: 15,
                marginLeft: 20,
                alignItems: "center",
              }}
            >
              <div style={{ fontFamily: "abel", fontSize: "1em" }}>
                Selected Branch:{" "}
                <Tag
                  color="success"
                  style={{
                    fontSize: "1em",
                    padding: 5,
                  }}
                >
                  {brans?.name}
                </Tag>
              </div>
              <div className="printer-container">
                {printerIsAlive ? (
                  <Typography.Text
                    style={{
                      paddingRight: 8,
                      paddingLeft: 8,
                      paddingTop: 5,
                      paddingBottom: 5,
                      border: "1px solid #a1a1a1",
                      borderRadius: 5,
                      cursor: "default",
                      background: "#28a745",
                      color: "#fff",
                    }}
                  >
                    CONNECTED TO PRINTER
                  </Typography.Text>
                ) : (
                  <Typography.Text
                    style={{
                      paddingRight: 8,
                      paddingLeft: 8,
                      paddingTop: 5,
                      paddingBottom: 5,
                      border: "1px solid grey",
                      borderRadius: 5,
                      cursor: "default",
                    }}
                  >
                    Printer is not connected
                  </Typography.Text>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* context */}
      {contextHolder}
      <WalletForm open={openedMenu == "gcash"} close={close} />
      <BillsPayment open={openedMenu == "bills"} close={close} />
      <TransactionHistory
        open={openedMenu == "th"}
        close={close}
        onCellClick={(e) => {
          setTransactionOpt({ open: true, transaction: e });
        }}
      />
      <TransactionDetails
        {...transactionDetailsOpt}
        close={() => setTransactionOpt({ open: false, transaction: null })}
      />
      <Eload
        open={openedMenu == "eload"}
        close={close}
        onSubmit={handleEloadRequest}
      />
      <ShoppeForm
        open={openedMenu == "shoppe"}
        close={() => setOpenedMenu("")}
      />
      <PosHome open={openedMenu == "pos"} close={close} />
    </>
  );
};

export default Teller;
