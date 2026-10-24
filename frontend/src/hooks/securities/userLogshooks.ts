import {useQuery} from '@tanstack/react-query'
import {getuserLogs} from '@/services/admin/securities/userRoles.service'

export const USER_LOGS_QUERY_KEY = [
  'user-logs',
]

export const useUserLogs =() =>{
    return useQuery({
        queryKey: USER_LOGS_QUERY_KEY,
        queryFn: getuserLogs,
    })
}   