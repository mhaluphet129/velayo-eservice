export interface SelectItem {
  name: string;
  value: string;
}

export type BillingOptionsType =
  | "input"
  | "number"
  | "textarea"
  | "checkbox"
  | "select";

export interface InputOptions {
  minLength?: number | null;
  maxLength?: number | null;
}

export interface NumberOptions {
  mainAmount?: Boolean;
  isMoney?: boolean;
  min?: number | null;
  max?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
}

export interface TextAreaOptions {
  minRow?: number | null;
  maxRow?: number | null;
}

export interface SelectOptions {
  items?: SelectItem[] | null;
}

export interface BillingsFormField {
  key?: string;
  type: BillingOptionsType;
  name: string;
  slug_name?: string;
  inputOption?: InputOptions;
  inputNumberOption?: NumberOptions;
  textareaOption?: TextAreaOptions;
  selectOption?: SelectOptions;
}

export interface ExceptionItemProps {
  name: string;
  type: BillingOptionsType;
}
export interface BillingSettingsType {
  _id?: string;
  name: string;
  fee: number;
  threshold: number;
  additionalFee: number;
  formField?: BillingsFormField[];
  exceptFormField?: ExceptionItemProps[];
  isDisabled?: boolean;
}

export interface OptionTypeWithFlag {
  open: boolean;
  options?: BillingsFormField | undefined | null;
  id: string | null;
  index: number;
}
