import { CSSProperties, ReactNode } from "react";
import {
  UserBadgeTitle,
  NewUser,
  BillingsFormField,
  Wallet,
  BillingSettingsType,
  Transaction,
  RoleType,
  TransactionType,
  ItemUnit,
  LogType,
  TransactionPOS,
  BranchData,
  BranchItem,
  ExtendedResponse,
} from ".";
import { Dayjs } from "dayjs";

export interface DashboardBtnProps {
  icon?: any;
  title: string;
  onPress: () => void;
  style?: CSSProperties;
}

export interface DrawerBasicProps {
  open: boolean;
  close: () => void;
  title?: string;
  style?: CSSProperties;
  extra?: ReactNode;
  extraData?: any;
  onCellClick?: (str: any, extra?: any) => void;
  refresh?: number;
}

export interface TransactionReportProps {
  open: boolean;
  close: () => void;
}

export interface GcashCollapseItemButtonProps {
  wallet: Wallet;
  onClickTitle?: (str?: string) => void;
  onClickCashIn?: () => void;
  onClickCashOut?: () => void;
}

export interface UserBadgeProps {
  name: string;
  title: UserBadgeTitle | null | string;
  style?: CSSProperties;
  role?: RoleType;
  isMobile?: boolean;
  extra?: ReactNode;
  setOpenedMenu?: (str: string) => void;
}
export interface BillsPaymentProps {
  open: boolean;
  close: () => void;
  transaction: Transaction | null;
  refresh?: () => void;
  isMobile: boolean;
}

export interface FloatLabelProps {
  children: ReactNode;
  label: string;
  value?: string;
  style?: CSSProperties;
  bool?: boolean;
  labelClassName?: string;
  extra?: ReactNode;
  labelStyle?: CSSProperties;
}

export interface UserProps {
  name: string;
  key?: number | string;
  username: string;
  email: string;
  role: UserBadgeTitle | string;
  dateCreated?: Date;
}

export interface TransactionDetailsProps {
  open: boolean;
  close: () => void;
  transaction: Transaction | TransactionPOS | null;
  requestId?: string | null;
}

export interface NewUserProps {
  open: boolean;
  close: () => void;
  onAdd: (obj: NewUser) => void;
  onSave: (obj: NewUser) => void;
  user?: NewUser | null;
}

// !remove
export interface NewBillerProps {
  open: boolean;
  close: () => void;
  onSave: (str: string) => boolean | void;
}

export interface NewWalletProps {
  open: boolean;
  close: () => void;
  onSave: (obj: Wallet) => Promise<string>;
}

export interface UpdateBillerProps {
  open: boolean;
  close: () => void;
  onSave: (str: string) => boolean | void;
  name: string;
}

// !remove
export interface NewOptionProps {
  open: boolean;
  close: () => void;
  formfield?: BillingsFormField | null;
  onSave: (obj: BillingsFormField) => void;
  id: string | null;
  index: number;
  refresh?: () => void;
  markAsMain: (id: string, index: number) => Promise<boolean | void>;
  deleteOption: (id: string, index: number) => Promise<boolean | void>;
}

export interface BillButtonProps {
  bill: BillingSettingsType;
  isSelected: boolean;
  onSelected: (bill: BillingSettingsType) => void;
  disabled: boolean;
}

export interface EloadProps {
  open: boolean;
  close: () => void;
  onSubmit: (eload: Eload) => Promise<ExtendedResponse<Transaction>>;
}

export type ELoadType = "regular" | "promo";
export interface Eload {
  provider?: string | null;
  phone: string | null;
  amount: number | null;
  type: ELoadType | null;
  promo?: string | null;
  fee?: number;
  creditId?: string | null;
}

// backend stuffs

export interface ApiGetProps {
  endpoint: string;
  query?: Record<any, any>;
}

export interface ApiPostProps {
  endpoint: string;
  payload?: Record<any, any>;
}

// utils props

interface GraphExtra {
  value: number;
  positive: boolean;
}
export interface LineGraphProps {
  title: string;
  graphTitle: string;
  color: string;
  prevMonth: GraphExtra;
  prevYear: GraphExtra;
  labels: string[];
  data: number[];
}

export interface RecentTransaction {
  type: TransactionType;
  sub_type: string;
  amount: number;
  fee: number;
}

//* POS
export interface POSButtonProps {
  label: string;
  value: string;
  icon: any;
  onClick: (str: string) => void;
}

export interface NewItemProps {
  title: string;
  open: boolean;
  close: () => void;
  parentId?: string;
  onSave: (str: any) => Promise<boolean>;
}

export interface InputProps {
  name?: string;
  unit?: ItemUnit | undefined;
  price?: number;
  quantity?: number;
  cost?: number;
}

export interface COProps {
  open: boolean;
  close: () => void;
  setOpenedMenu: (str: string) => void;
}

export interface TrackerOptions {
  time: Dayjs | null;
  code: string | null;
}

export interface StockProps {
  open: boolean;
  close: () => void;
  type: "stock-in" | "stock-out" | null;
  branchId: string;
  branchItems: BranchItem[];
  onSubmit: (_: BranchData | null) => void;
}

export type StockType = "stock-in" | "stock-out" | "misc";
export interface StockHistory {
  _id?: string;
  date?: Date;
  type?: StockType;
  quantity?: number;
  name?: string;
}

// * LOG

export interface NewLog {
  userId: string;
  type: LogType;
  branchId?: string;
  [key: string]: any;
}

// * PORTAL

export interface NewPortalProps {
  name: string;
  assignTo: string[];
  _id?: string;
}

export interface BalanceUpdaterProps {
  open: boolean;
  close?: () => void;
  _id?: string | null;
  name?: string | null;
  type?: "add" | "subract" | null;
  refresh?: () => void;
}

export interface CreditProp {
  isCredit: boolean;
  userId: string;
  transactionId: string;
  amount: number;
}
