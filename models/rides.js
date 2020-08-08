const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rideSchema = new Schema({
  origin: {
    type: String,
    required: true
  },

  destination: {
    type: String,
    required: true
  },

  pickupDate: {
    type: String,
    required: true
  },

  pickupTime: {
    type: String,
    required: true
  },

  duration: {
    type: String,
    required: true
  },

  distance: {
    type: String,
    required: true
  },

  vehicleType: {
    type: String,
    required: true
  },

  price: {
    type: String,
    required: true
  },

  serviceType: {
    type: String,
    required: false
  },

  hours: {
    type: String,
    required: false
  },

  flightNumber: {
    type: String,
    required: false
  },

  pickupSign: {
    type: String,
    required: false
  },

  phoneNumber: {
    type: String,
    required: false
  },

  notes: {
    type: String,
    required: false
  },

  billingEmail: {
    type: String,
    required: false
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Rides", rideSchema);
