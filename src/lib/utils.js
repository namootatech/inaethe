import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date, format = 'MMM dd, yyyy') {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const options = {};

  if (format.includes('MMM')) {
    options.month = 'short';
  } else if (format.includes('MM')) {
    options.month = '2-digit';
  } else if (format.includes('M')) {
    options.month = 'numeric';
  }

  if (format.includes('dd')) {
    options.day = '2-digit';
  } else if (format.includes('d')) {
    options.day = 'numeric';
  }

  if (format.includes('yyyy')) {
    options.year = 'numeric';
  } else if (format.includes('yy')) {
    options.year = '2-digit';
  }

  return new Intl.DateTimeFormat('en-ZA', options).format(date);
}
