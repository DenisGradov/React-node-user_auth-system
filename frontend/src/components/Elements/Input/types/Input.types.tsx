import { ChangeEventHandler, MouseEventHandler } from "react";
type InputType = "email" | "number" | "password" | "tel" | "text";

export interface InputProps {
  placeholder?: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  name?: string;
  type: InputType;
}
