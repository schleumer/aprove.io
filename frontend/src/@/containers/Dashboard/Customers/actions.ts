import { REMOVE_PHONE, SET_VIEW, VIEW } from "./constants";

export interface ViewData {
  id: string;
}

export interface SetViewData {
  id: string;
}

export interface RemovePhoneData {
  customerId: string;
  customerPhoneId: string;
}

export function view({ id }: ViewData) {
  return {
    type: VIEW,
    data: { id },
  };
}

export function setView(data: SetViewData) {
  return {
    type: SET_VIEW,
    data,
  };
}

export function removePhone(data: RemovePhoneData) {
  return {
    type: REMOVE_PHONE,
    data,
  };
}
