import { format, isValid, parse } from 'date-fns';

export const parseFlexibleDate = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  const dotFormat = parse(trimmed, 'dd.MM.yyyy', new Date());
  if (isValid(dotFormat)) return dotFormat;
  const iso = new Date(trimmed);
  if (isValid(iso)) return iso;
  return null;
};

export const formatDate = (value?: Date | string | null) => {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return isValid(date) ? format(date, 'dd.MM.yyyy') : '-';
};
