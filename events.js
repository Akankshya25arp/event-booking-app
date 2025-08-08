const express = require("express"); 
const Event = require("../models/Events"); 
const { authenticateUser, checkAdmin } = require("../middleware/authMiddleware"); 
const router = express.Router(); 

router.get("/", async (req, res) => {
  console.log("GET /api/events hit");
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }});


 router.post("/", authenticateUser, checkAdmin, async (req, res) => {  
 try {     
 const newEvent = await Event.create(req.body);    
 res.status(201).json(newEvent);  
 } catch (err) {  
 console.error("Error creating event:", err.message); 
 res.status(500).json({       message: "Error creating event",       error: err.message     }); 
 } }); 
 
 
 router.put("/:id", authenticateUser, checkAdmin, async (req, res) => {  
 try { 
 const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
  res.json(updatedEvent);  
 } catch (err) {  res.status(500).json({ message: "Error updating event" });
 } });   


 router.delete("/:id", authenticateUser, checkAdmin, async (req, res) => {  
 try {   
 await Event.findByIdAndDelete(req.params.id);    
 res.json({ message: "Event deleted" });  
 } catch (err) { 
    res.status(500).json({ message: "Error deleting event" });   
    } }); 
  
 module.exports = router;

