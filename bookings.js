const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Events");
const { authenticateUser, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:eventId", authenticateUser, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
const booking = new Booking({
      user: req.user.id,
      event: req.params.eventId
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
});


router.get("/", authenticateUser, checkAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email").populate("event", "title date");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});


router.get("/my", authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event", "title date");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your bookings" });
  }
});


router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

module.exports = router;
