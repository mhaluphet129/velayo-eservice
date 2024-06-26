import { FloatLabel, checkProvider } from "@/assets/ts";
import type { Eload, EloadProps, EloadSettings } from "@/types";
import {
  Button,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import jason from "@/assets/json/constant.json";
import EtcService from "@/provider/etc.service";

// lodash
const _ = (__: any) => [null, undefined, ""].includes(__);

const Eload = ({ open, close, onSubmit }: EloadProps) => {
  const [disabledEload, setDisabledEload] = useState<EloadSettings | null>(
    null
  );
  const etc = new EtcService();

  const [eload, setEload] = useState<Eload>({
    provider: null,
    phone: null,
    amount: null,
    type: "regular",
    promo: null,
  });

  const update = (name: string, value: any) => {
    setEload({
      ...eload,
      [name]: value,
    });
  };

  const handleRequest = () => {
    // validate
    if (eload.provider == null) {
      message.warning("Provider is Blank. Please provide.");
      return;
    }

    if (!eload.phone || eload.phone == "") {
      message.warning("Phone Number is empty. Please Provide.");
      return;
    }

    if (eload.phone.length < 10) {
      message.warning("Phone Number should have a minimum length of 10.");
      return;
    }

    if (!/^9/.test(eload.phone)) {
      message.warning("Phone Number is invalid.");
      return;
    }

    if (!eload.amount) {
      message.warning("Amount is empty. Please Provide.");
      return;
    }

    if (eload.type == "promo" && !eload.promo) {
      message.warning("Promo is empty. Please Provide.");
      return;
    }

    if (checkProvider(eload.phone) == "Invalid Number") {
      message.warning("Invalid Number");
      return;
    }

    (async () => {
      let a = await onSubmit({
        provider: eload.provider,
        type: eload.type,
        ...(eload.type == "promo" ? { promo: eload.promo } : {}),
        phone: eload?.phone,
        amount: eload.amount,
        fee: getFee(),
      });

      if (a) {
        message.success("Successfully Requested");
        setEload({
          provider: null,
          phone: null,
          amount: null,
          type: "regular",
          promo: null,
        });
        close();
      }
    })();
  };

  const getFee = () => {
    if (disabledEload?.additionalFee) {
      const { threshold, additionalFee, fee } = disabledEload;

      if ((eload.amount ?? 0) / (threshold ?? 1) > 0) {
        let multiplier = Math.floor((eload.amount ?? 0) / (threshold ?? 1));
        return (fee ?? 0) + additionalFee * multiplier;
      } else return fee;
    }
    return 0;
  };

  useEffect(() => {
    (async (_) => {
      let res2 = await _.getEloadSettings();
      if (res2?.success ?? false) setDisabledEload(res2?.data ?? null);
    })(etc);
  }, []);

  return (
    <Modal
      open={open}
      onCancel={() => {
        close();
        setEload({
          provider: null,
          phone: null,
          amount: null,
          type: "regular",
          promo: null,
        });
      }}
      title={<Typography.Title level={2}>Load</Typography.Title>}
      closable={false}
      footer={null}
      destroyOnClose
    >
      <Select
        className="customSelect"
        placeholder="Provider"
        size="large"
        style={{
          display: "block",
          height: 70,
          marginBottom: 10,
          fontSize: "2em",
        }}
        options={jason.provider.map((e) => ({
          label: `${e} ${
            disabledEload?.disabled_eload.includes(e) ? "(disabled)" : ""
          }`,
          value: e,
          disabled: disabledEload?.disabled_eload.includes(e),
        }))}
        onChange={(e) => update("provider", e)}
      />

      <Input
        size="large"
        onChange={(e) => update("phone", e.target.value)}
        maxLength={10}
        minLength={10}
        prefix="+63"
        placeholder="10 Digit Number (9******)"
        className="customInput size-70"
        style={{
          height: 70,
          fontSize: "2em",
          letterSpacing: 1,
          marginBottom: 10,
        }}
      />

      {/* <span
        style={{
          marginBottom: 10,
          float: "right",
          fontSize: "1.35em",
        }}
      >
        {checkProvider(eload.phone ?? "")}
      </span> */}

      <FloatLabel
        value={eload.amount?.toString()}
        label="Amount"
        style={{
          marginTop: 10,
        }}
        extra={
          <span
            style={{
              float: "right",
              marginBottom: 10,
              fontSize: "1.8em",
            }}
          >
            +₱{getFee()} (fee)
          </span>
        }
      >
        <InputNumber
          size="large"
          className="customInput size-70"
          style={{
            width: "100%",
            height: 70,
            alignItems: "center",
            fontSize: "2em",
          }}
          prefix="₱"
          min={1}
          onChange={(e) => update("amount", e)}
          controls={false}
          formatter={(value: any) =>
            value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </FloatLabel>
      <Radio.Group
        onChange={(e) => update("type", e.target.value)}
        className="custom-radio"
        defaultValue={eload.type}
        style={{
          marginBottom: 10,
        }}
      >
        <Radio value="regular">Regular</Radio>
        <Radio value="promo">Promo</Radio>
      </Radio.Group>
      {eload.type == "promo" && (
        <FloatLabel bool={!_(eload.promo)} label="Promo">
          <Input.TextArea
            className="customInput size-70"
            size="large"
            value={eload.promo ?? ""}
            onChange={(e) => update("promo", e.target.value)}
            styles={{
              textarea: {
                fontSize: "1.5em",
              },
            }}
            autoSize={{
              minRows: 2,
            }}
          />
        </FloatLabel>
      )}
      <Button
        block
        size="large"
        type="primary"
        onClick={handleRequest}
        style={{
          height: 70,
          fontSize: "2em",
          marginTop: 25,
        }}
      >
        CONFIRM
      </Button>
    </Modal>
  );
};

export default Eload;
