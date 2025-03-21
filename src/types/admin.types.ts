export type AdminData = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    image?: string;
    email?: string;
    password: string;
    roleId?: string | number;
  };
  export type UpdateAdminData = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    image?: string;
  };