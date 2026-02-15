import { PrismaClient } from '@prisma/client';
import { parse } from 'date-fns';
import { computeStatus } from '../lib/status';

const prisma = new PrismaClient();
const d = (value?: string) => (value ? parse(value, 'dd.MM.yyyy', new Date()) : null);

const seeds = [
  { vehicleTitle: 'Dodge Challenger 3.6', vin: '2C3CDYAG8DH511375', year: 2013, arrivalDate: d('05.12.2025'), auctionNo: '1', minPrice: 7950, soldDate: d('12.12.2025'), soldPrice: 7950 },
  { vehicleTitle: 'Jeep Gladiator', vin: '1C6HJTAG5ML576384', year: 2021, arrivalDate: d('05.11.2025'), auctionNo: '2', minPrice: 28600, soldDate: d('14.12.2025'), soldPrice: 28600 },
  { vehicleTitle: 'Dodge Charger RT', vin: '2C3CDXJG8EH308451', year: 2014, arrivalDate: d('16.12.2025'), auctionNo: '2', minPrice: 7700 },
  { vehicleTitle: 'Dodge Durango RT', vin: '1C4SDJCT9NC204570', year: 2022, auctionNo: '1', minPrice: 24300 },
  { vehicleTitle: 'Dodge Challenger 3.6', vin: '2C3CDZAG2KH718945', year: 2019, minPrice: 11200 },
  { vehicleTitle: 'Dodge Challenger RT', vin: '2C3CDYBT3EH205309', year: 2014, minPrice: 13400 }
];

async function main() {
  const count = await prisma.vehicle.count();
  if (count > 0) return;
  for (const item of seeds) {
    await prisma.vehicle.create({ data: { ...item, status: computeStatus(item) } });
  }
}

main().finally(() => prisma.$disconnect());
