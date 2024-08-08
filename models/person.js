const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const mongoURI = process.env.MONGODB_URI;

console.log("connecting to", mongoURI);

try {
  mongoose.connect(mongoURI);
  console.log("connected to MongoDB");
} catch (err) {
  console.log("error connecting to MongoDB", err);
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
