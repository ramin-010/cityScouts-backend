const fs = require("fs");

// Load the raw JSON data
const rawData = fs.readFileSync("./data/cleanedAttractions.json", "utf-8");
const attractions = JSON.parse(rawData);

// Clean the data
const cleanedAttractions = attractions.map(attraction => {
  // Destructure to exclude top-level unwanted fields
  const {
    _id,
    __v,
    created_on,
    updated_on,
    ...rest
  } = attraction;

  // Remove _id field from each image if present
  if (Array.isArray(rest.images)) {
    rest.images = rest.images.map(({ _id, ...imageRest }) => imageRest);
  }

  return rest;
});

// Save the cleaned data to a new file
fs.writeFileSync("./data/attractions.json", JSON.stringify(cleanedAttractions, null, 2));

console.log("✅ Data cleaned and saved to cleanedAttractionsReady.json");
