type ProductStats = {
  remainingCount: number;
  remainingAmount: number;
};

type SaleHistoryPerDay = {
  [date: string]: {
    count: number;
    amount: number;
  };
};

type SaleState = {
  count: number;
  amount: number;
  history?: {
    perDays: SaleHistoryPerDay;
  };
};

type SalesStats = {
  finished: SaleState;
  pending: Omit<SaleState, 'history'>;
  rejected: Omit<SaleState, 'history'>;
};

export type BusinessGlobalStats = {
  balance: number;
  flux: number;
  withdraw: number;
  product: ProductStats;
  sales: SalesStats;
};