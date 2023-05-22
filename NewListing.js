const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const NewListing = require("../models/newlisting.model");

router.post("/add", async (req, res) => {
  const {
    street_number,
    street_name,
    city,
    state,
    zip_code,
    rent,
    tags,
    bio,
    contact_info,
    bed,
    bath,
    apartment_number
  } = req.body;

  try {
    const newListing = new NewListing({
      street_number,
      street_name,
      apartment_number,
      city,
      state,
      zip_code,
      rent,
      tags,
      bio,
      contact_info,
      bed,
      bath,
    });

    await newListing.save();

    return res.status(200).json({ message: "Listing Added Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Listing Failed",error });
  }
});

router.post("/delete", async (req, res) => {
  const { listing_id } = req.body;

  try {
    const deletedListing = await NewListing.findByIdAndDelete(listing_id);

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json({ message: "Listing Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unauthorized" });
  }
});

router.get("/listings", async (req, res) => {
  try {
    const listings = await NewListing.find();

    return res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
