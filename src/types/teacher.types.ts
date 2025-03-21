// export type TeacherData = {
//     firstName: string;
//     lastName: string;
//     dateOfBirth: Date; 
//     idNumber: string;
//     regNumber: string;
//     fatherName: string;
//     motherName: string;
//     religion: string;
//     email: string;
//     department: string;
//     phone: string;
//     address: string;
//     image: string;
//     designation: string;
//     certificate?: string;
// };


export type TeacherData = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    idNumber: string;
    department: string;
    regNumber: string;
    fatherName: string;
    motherName: string;
    religion: string;
    email: string;
    departmentConfigurationId: string;
    phone: string;
    address: string;
    image?: string;
    designation: string;
    certificate?: {
      certificateName: string;
      file: string; 
    }[]; 
  };
  
