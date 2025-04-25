import { init } from '@instantdb/react';
import { Schema } from '@/lib/types';

export const APP_ID = '535d6621-f517-408a-b722-1c3b9d387726';

export const db = init<Schema>({ appId: APP_ID });
