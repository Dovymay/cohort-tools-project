//Schema from mongoose Joshua way
const {Schema, model} = require("mongoose")

//Define the shape of Cohorts
const cohortSchema = new Schema({
    cohortSlug: {
        type: String,
        required: true,
    },
    cohortName: {
        type: String,
        required: true,
    },
    program: {
        type: String, 
        enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
    },
    format: {
        type: String,
        enum: ["Full Time", "Part Time"]
    },
    campus: {
        type: String,
        enum: ["Madrid", "Barcelona", "Miami", 
            "Paris", "Berlin", "Amsterdam", "Lisbon", 
            "Remote"]
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    inProgress: {
        type: Boolean,
        default: false,
    },
    programManager: {
        type: String,
        required: true,
    },
    leadTeacher: {
        type: String,
        required: true,
    },
    totalHours: {
       type: Number,
       default: 360, 
    },
})

//Create the model
const CohortModel = model("cohort", cohortSchema)

//Export the model to use in other files
module.exports = CohortModel