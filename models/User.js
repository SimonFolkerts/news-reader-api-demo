const mongoose = require("mongoose");

// the schema is a blueprint for a document in a mongodb database. It defines what the data will look like, i.e. what properties it will have. We can clearly describe the structure of our document. We can use many different options to further specify what is required

// create a new Schema class using mongoose. Takes two parameters, the properties and methods object, and the options object. Can also set options using the set method, refer to docs

const UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    username: { type: String, required: true },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "email address is required"],
      match: [/\S+@\S+\.\S+/, "not a valid email address"],
      index: true,
    },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  },

  { timestamps: true }
);
// models are fancy constructors compiled from Schema definitions. an instance of a model is called a document. models are responsible for creating and reading documents from the underlying MongoDB database.
// the name of the model corresponds the name of the collection in the database, pluralised and lowercased. 'Article' would cause the model to look for 'articles' in the database

// create a model based on the schema
module.exports = mongoose.model("User", UserSchema);
// this model will be imported in the router that handles it
