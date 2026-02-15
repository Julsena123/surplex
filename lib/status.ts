import { VehicleStatus } from '@prisma/client';

type VehicleLike = {
  soldDate?: Date | string | null;
  soldPrice?: number | null;
  auctionEndDate?: Date | string | null;
};

export const computeStatus = (vehicle: VehicleLike): VehicleStatus => {
  if (vehicle.soldDate || vehicle.soldPrice != null) return VehicleStatus.SOLD;
  if (vehicle.auctionEndDate) {
    const date = new Date(vehicle.auctionEndDate);
    if (date < new Date()) return VehicleStatus.NOT_SOLD;
  }
  return VehicleStatus.PENDING;
};
