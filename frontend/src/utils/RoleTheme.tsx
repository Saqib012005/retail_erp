const roleColors: Record<string, string> = {
  "Super Admin": "#EF4444",
  Administrator: "#3B82F6",
  "Finance Manager": "#2563EB",
  "Inventory Manager": "#10B981",
  "Sales Manager": "#F59E0B",
  "Store Manager": "#8B5CF6",
  "Standard User": "#64748B",
  Employee: "#6B7280",
};

export const getRoleColor = (roleName: string): string => {
  return roleColors[roleName] ?? "#043793";
};