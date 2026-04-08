export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    demand_response: 'Demand Response',
    ev_charging: 'EV Charging',
    weatherization: 'Weatherization',
    heat_pump: 'Heat Pump',
    solar: 'Solar',
    storage: 'Storage',
    tax_credit: 'Tax Credit',
    bill_assistance: 'Bill Assistance',
    building_performance: 'Building Performance',
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    demand_response: 'bg-orange-100 text-orange-800',
    ev_charging: 'bg-blue-100 text-blue-800',
    weatherization: 'bg-green-100 text-green-800',
    heat_pump: 'bg-red-100 text-red-800',
    solar: 'bg-yellow-100 text-yellow-800',
    storage: 'bg-purple-100 text-purple-800',
    tax_credit: 'bg-emerald-100 text-emerald-800',
    bill_assistance: 'bg-pink-100 text-pink-800',
    building_performance: 'bg-indigo-100 text-indigo-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getProviderLabel(provider: string): string {
  const labels: Record<string, string> = {
    con_edison: 'Con Edison',
    national_grid: 'National Grid',
    pseg_li: 'PSEG Long Island',
    central_hudson: 'Central Hudson',
    nyseg: 'NYSEG',
    rge: 'RG&E',
    orange_rockland: 'Orange & Rockland',
    nyserda: 'NYSERDA',
    federal: 'Federal (IRA)',
    nyc: 'NYC',
  };
  return labels[provider] || provider;
}
