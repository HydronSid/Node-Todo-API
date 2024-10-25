const mongoose = require("mongoose");
const slugify = require("slugify");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "a todo must have a name."],
    unique: false,
    trim: true,
    // maxlength: [10, 'A tour name must have 10 charas'],
    minlength: [5, "A todo name must have 5 charas"],
    // validate: [validator.isAlpha, 'Tour name must only contains character'],
  },
  // user_id: {
  //   type: Number,
  //   require: true,
  // },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created_by: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

// ! Document post Middleware: runs before .save() and .create()
todoSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Todo", todoSchema);
