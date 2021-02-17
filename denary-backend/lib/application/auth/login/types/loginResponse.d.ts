export interface ILoginResponse  {
    resStatus: number;
    tokenDurationInSeconds: number;
    token: string;
    firstTimeLogin: boolean;
    attemptNumber: number
    lasstSuccessloginAt: string;
    userId: string;
    userFirstname: string;
    userSurname: string;
    userEmail: string;
    phoneNumber: string;
    userPermissions: IUserPermission[]
}

export interface IUserPermission  {
    permissionId: string;
    permissionName: string;
    permissionValue: string;
}    
    
