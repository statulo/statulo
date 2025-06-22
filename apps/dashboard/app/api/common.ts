export type PageControls = {
  limit: number;
  offset: number;
};

export type PageResponse<T> = {
  data: T[];
  total: number;
  offset: number;
  count: number;
};

export type IntervalResponse = {
  unit: "d" | "h" | "m" | "s";
  amount: number;
};

export type RangeResponse = {
  from: number;
  to: number;
};
