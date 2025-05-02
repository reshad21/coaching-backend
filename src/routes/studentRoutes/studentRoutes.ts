
import { createStudentController, deleteStudentController, getAllStudentController, getStudentControllerById, updateStudentController } from "@/controllers/studentController/studentController";
import upload from "@/utils/multerConfig";
import { Router } from "express";

const studentRouts = Router();


studentRouts.post("/", upload.fields([
    { name: "image", maxCount: 1 },
]), createStudentController);

studentRouts.get("/", getAllStudentController);
studentRouts.get("/:id", getStudentControllerById);
studentRouts.patch("/:id", updateStudentController);
studentRouts.delete("/:id", deleteStudentController);

export default studentRouts;


// {
//     // "studentId": "COACH-202503-0001", //unique
//     "firstName": "John mark",
//     "lastName": "Doe",
//     "fatherName": "Robert Doe",
//     "motherName": "Jane Doe",
//     "dateOfBirth": "2005-06-15T00:00:00.000Z",
//     "religion": "Christianity",
//     "schoolName": "Barisal Zila school",
//     "phone": "+8801234567890",
//     "email": "john.doe@example.com",
//     "address": "123 Main Street, Dhaka, Bangladesh",
//     "image": "https://example.com/profile.jpg",
//     "gender": "Male",
//     "class": "10",
//     "Payment": "march",
//     "batchId": "fa51aae9-1a29-4de2-8117-72016286e862" //foreign key
// }