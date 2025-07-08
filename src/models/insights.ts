import { z } from 'zod';

export const TimeSliceUnitEnum = z.enum(['DAY', 'HOUR', 'MINUTE']);
export type TimeSliceUnit = z.infer<typeof TimeSliceUnitEnum>;

export const CommonParamsSchema = z.object({
  startTime: z.number(),
  endTime: z.number()
});

export const ProcessInstanceStatusByDateRequestSchema = z.object({
  commonParams: CommonParamsSchema,
  timeSliceUnit: TimeSliceUnitEnum,
  timezoneOffset: z.number(),
  tenantId: z.string().uuid()
});

export const ProcessInstanceStatusByDateItemSchema = z.object({
  startTime: z.string(),
  status: z.string(),
  count: z.number()
});

export const ProcessInstanceStatusByDateResponseSchema = z.array(ProcessInstanceStatusByDateItemSchema);

export type CommonParams = z.infer<typeof CommonParamsSchema>;
export type ProcessInstanceStatusByDateRequest = z.infer<typeof ProcessInstanceStatusByDateRequestSchema>;
export type ProcessInstanceStatusByDateItem = z.infer<typeof ProcessInstanceStatusByDateItemSchema>;
export type ProcessInstanceStatusByDateResponse = z.infer<typeof ProcessInstanceStatusByDateResponseSchema>; 