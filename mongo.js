const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const mongoURI = `mongodb+srv://henkka:${password}@cluster0.jggjf.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(mongoURI);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
});

const Person = mongoose.model("Person", personSchema);

const savePerson = async (person) => {
  try {
    await person.save();
    console.log(`added ${person.name} number ${person.number} to phonebook`);
  } catch (err) {
    console.log("saving failed", err);
  }
};

const printPersons = async () => {
  try {
    const result = await Person.find({});

    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
  } catch (err) {
    "failed to fetch items from database", err;
  }
};

const main = async () => {
  if (process.argv.length > 3) {
    const newPerson = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    await savePerson(newPerson);
  }
  await printPersons();
  mongoose.connection.close();
};

main();
