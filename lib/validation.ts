import { ReminderChannel, ReminderType, VehicleStatus } from '@prisma/client';
import { z } from 'zod';
import { parseFlexibleDate } from './date';

const vinSchema = z
  .string()
  .min(17, 'VIN must be exactly 17 characters')
  .max(17, 'VIN must be exactly 17 characters')
  .refine((val) => !/[IOQ]/i.test(val), 'VIN cannot contain I, O, or Q');

const dateField = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === 'string' ? parseFlexibleDate(value) : null));

const numberField = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === '' || value == null) return null;
    const n = typeof value === 'string' ? Number(value.replace(',', '.')) : value;
    return Number.isFinite(n) ? n : null;
  });

export const VehicleCreateSchema = z.object({
  vehicleTitle: z.string().min(1),
  vin: vinSchema,
  year: numberField,
  arrivalDate: dateField,
  auctionNo: z.string().optional().nullable(),
  minPrice: numberField,
  soldDate: dateField,
  soldPrice: numberField,
  actionStartDate: dateField,
  actionEndDate: dateField,
  auctionStartDate: dateField,
  auctionEndDate: dateField,
  status: z.nativeEnum(VehicleStatus).optional(),
  notes: z.string().optional().nullable()
});

export const VehicleUpdateSchema = VehicleCreateSchema.partial();

export const ReminderSchema = z.object({
  type: z.nativeEnum(ReminderType),
  channel: z.nativeEnum(ReminderChannel),
  remindAt: z.string().transform((v) => parseFlexibleDate(v)),
  done: z.boolean().optional()
});
