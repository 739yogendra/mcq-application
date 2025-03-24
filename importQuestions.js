const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const connectDB = require('../config/db');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Adjust the path based on your project structure
// Import your existing models
const Question = require("../models/question"); // Adjust the path based on your project structure
const Test = require("../models/test"); // Adjust the path based on your project structure

// Connect to MongoDB
connectDB();

async function importQuestions() {
  try {
    // Read and parse the JSON file
    const filePath = path.join(__dirname, "test1.json"); // Update the filename if needed
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Ensure jsonData is an array
    const questionsArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    // Insert all questions and store their ObjectIds
    const insertedQuestions = await Question.insertMany(questionsArray);
    const questionIds = insertedQuestions.map((q) => q._id);

    console.log(`Inserted ${questionIds.length} questions into MongoDB`);

    // Create a new test using the inserted question IDs
    const newTest = await Test.create({
      name: "Macroeconomy Test 1", // Customize the test name
      questionId: questionIds, // Store question IDs here
    });

    console.log("Test created successfully:", newTest);

  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
importQuestions();
