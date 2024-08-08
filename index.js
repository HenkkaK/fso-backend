require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", function (req) {
  const body = req.body;
  if (!body) return "";
  return JSON.stringify(body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
  response.send("<h1>Phonebook</h1>");
});

app.get("/api/persons", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const person = await Person.findById(id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

app.get("/info", async (request, response, next) => {
  const time = new Date(Date.now());
  try {
    const persons = await Person.find({});
    response.send(
      `<p>Phonebook has info for ${
        persons.length
      } people</p><p>${time.toString()}</p>`
    );
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const result = await Person.findByIdAndDelete(id);
    if (result) response.json(result);
    else response.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const { name, number } = request.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({
    name,
    number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
