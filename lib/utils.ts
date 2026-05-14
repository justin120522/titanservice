import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    matched: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    en_route: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    on_site: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
    paid: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    refunded: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    draft: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    sent: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    succeeded: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    failed: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
}

export function getServiceIcon(service: string): string {
  const icons: Record<string, string> = {
    repair: '🔧',
    maintenance: '⚙️',
    installation: '📦',
    cleaning: '✨',
    inspection: '🔍',
  };
  return icons[service] || '🔧';
}

export function getApplianceIcon(appliance: string): string {
  const lower = appliance.toLowerCase();
  if (lower.includes('wash')) return '🧺';
  if (lower.includes('fridge') || lower.includes('refrigerator')) return '🧊';
  if (lower.includes('oven') || lower.includes('stove')) return '🍳';
  if (lower.includes('dish')) return '🍽️';
  if (lower.includes('dryer')) return '🌀';
  if (lower.includes('ac') || lower.includes('air')) return '❄️';
  if (lower.includes('heat') || lower.includes('furnace')) return '🔥';
  if (lower.includes('micro')) return '📡';
  return '🏠';
}

export function generateInvoiceNumber(): string {
  const prefix = 'INV';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}-${rand}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateTax(amount: number, rate: number = 0.08): number {
  return Math.round(amount * rate * 100) / 100;
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}
