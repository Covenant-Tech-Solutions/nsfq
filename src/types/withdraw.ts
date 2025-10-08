export interface WithdrawMethodTypes {
  id: number;
  name: string;
  slug: string;
  min: number;
  max: number;
  currency: string;
  instructions: string;
  description: string;
  fields: WithdrawMethodFieldTypes[];
}

export interface WithdrawMethodFieldTypes {
  label: string;
  field_type: string;
  required: boolean;
  order: number;
}
