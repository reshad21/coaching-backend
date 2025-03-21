export type StudentData = {
  firstName:string;
  lastName:string;
  fatherName:string;
  motherName:string;
  regNumber:string;
  dateOfBirth:Date;
  idNumber:string;
  religion:string;
  batch:string;
  batchConfigurationId:string;
  phone:string;
  email:string;
  address:string;
  image?:string;
  certificate?: {
    certificateName: string;
    file: string;
  }[];
};
