const mongoose = require("mongoose");

const NewlistingSchema = new mongoose.Schema({
    street_number: {
    type: String,
    required: true,
  },
  street_name: {
    type: String,
    required: true,
  },
  apartment_number  : {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
  rent: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: true,
  },
  bed: {
    type: String,
    required: true
  },
  bath: {
    type: String,
    required: true
  },
  contact_info: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});



const NewListing = mongoose.model("NewListing", NewlistingSchema);

module.exports = NewListing;
