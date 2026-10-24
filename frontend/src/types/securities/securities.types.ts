export type RoleType=
    |'STANDARD'
     |'MANAGER'
    |'ADMIN'
    |'SUPER_ADMIN' 

    export type RoleStatus= 'ACTIVE'|'INACTIVE'

    export interface Role{
        id:number;
        name:string;
        description:string;
        roleType:RoleType;
        userCount:number;
        permissionCount:number;
        status:RoleStatus;
        createdAt:string;
        updatedAt:string;
    }


    /*User Logs Types*/

    export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    export type AuditLog = {
    id: number;
  level: Severity;
  action: string;
  module: string;
  userId: number;
  userName: string | null;
  description: string | null;
  createdAt: string;
  ipAddress: string | null;
 diff?: { before: unknown; after: unknown }
}