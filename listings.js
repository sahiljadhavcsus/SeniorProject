const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const NewListing = require("../models/newlisting.model");

// Token validation middleware
const validateToken = (req, res, next) => {
  const token = req.cookies.token || req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

router.post("/add", validateToken, async (req, res) => {
  const {
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
    return res.status(400).json({ message: "Listing Failed" });
  }
});

router.delete("/listings/:id", validateToken, async (req, res) => {
  const listingId = req.params.id;

  try {
    const deletedListing = await NewListing.findByIdAndDelete(listingId);

    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json({ message: "Listing Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/getListing", validateToken, async (req, res) => {
  try {
    const listings = await NewListing.find();

    return res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
