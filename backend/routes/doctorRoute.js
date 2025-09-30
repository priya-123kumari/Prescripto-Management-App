import express from "express";
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  changeAvailablity,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

// Public
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);

// Protected (doctor auth required)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.patch("/appointments/:id/complete", authDoctor, appointmentComplete);
doctorRouter.patch("/appointments/:id/cancel", authDoctor, appointmentCancel);

doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.patch("/profile", authDoctor, updateDoctorProfile);

// Availability API
doctorRouter.patch("/availability", authDoctor, changeAvailablity);

export default doctorRouter;
