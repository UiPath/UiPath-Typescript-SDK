import { z } from 'zod';

export const ConfigSchema = z.object({
  baseUrl: z.string().url().default('https://cloud.uipath.com'),
  orgName: z.string().min(1),
  tenantName: z.string().min(1),
  secret: z.string().optional(),
  clientId: z.string().optional(),
  redirectUri: z.string().url().optional(),
  accountId: z.string().uuid().optional(),
  tenantId: z.string().uuid().optional(),
  folderKey: z.string().uuid().optional()
});

export type Config = z.infer<typeof ConfigSchema>;
