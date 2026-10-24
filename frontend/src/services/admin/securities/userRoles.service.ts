import apiClient from '@/services/apiClient'
import { AuditLog } from '@/types/securities/securities.types'


type UserLogsResponse = {
data: AuditLog[];
message: string;
pagination: {
page: number;
limit: number;
total: number;
totalPages: number;
};
};

export const getuserLogs = async (): Promise<UserLogsResponse> => {
const response = await apiClient.get<UserLogsResponse>(
'/api/admin/user-logs'
);

return response.data;
};