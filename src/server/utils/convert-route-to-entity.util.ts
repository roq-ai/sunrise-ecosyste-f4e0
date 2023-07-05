const mapping: Record<string, string> = {
  companies: 'company',
  plans: 'plan',
  trainers: 'trainer',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
