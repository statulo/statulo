import { z } from "zod";

export const checkReportDataSchema = () => z.object({}); // TODO add payload for reporting checks

export type CheckResultReport = {
  checkId: string;
  reportedAt: Date;
  type: "success" | "failure";
  data: z.infer<ReturnType<typeof checkReportDataSchema>>;
};

export type VerificationResultReport = {
  verificationId: string;
  reportedAt: Date;
  type: "success" | "failure";
  data: z.infer<ReturnType<typeof checkReportDataSchema>>;
};

export type ReportingInput = {
  reports: CheckResultReport[];
  verifications: VerificationResultReport[];
};

export async function reportCheckResults(input: ReportingInput): Promise<void> {
  // TODO actually report
  console.log(input);
}
