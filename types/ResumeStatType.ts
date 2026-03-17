export interface ResumeStatType {
  amount: number;
  count: number;
}

export interface ReportOrderStatsType {
  all: ResumeStatType;
  pending: ResumeStatType;
  completed: ResumeStatType;
  cancelled: ResumeStatType;
}
