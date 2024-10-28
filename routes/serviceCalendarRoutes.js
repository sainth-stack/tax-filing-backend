// routes/serviceCalendarRoutes.js
import express from "express";
import {
  createServiceCalendar,
  deleteAllServiceCalendarEntries,
  getServiceCalendars,
  updateServiceCalendar,
} from "../controllers/ServiceCalController.js";

const router = express.Router();

// GET all service calendars
router.get("/service-calendar", getServiceCalendars);

// POST a new service calendar entry
router.post("/service-calendar", createServiceCalendar);

// PUT to update a service calendar entry by ID
router.put("/service-calendar/:id", updateServiceCalendar);
router.delete("/service-calendar/vishnu", deleteAllServiceCalendarEntries);

export default router;
