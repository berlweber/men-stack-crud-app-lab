import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mustKeepRefregerated: Boolean,
    mustkeepFrozen: Boolean
});

const Food = mongoose.model('Food', foodSchema);

export default Food;