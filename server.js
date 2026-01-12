// all file imports
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Food from './models/food.js';
import methodOverride from 'method-override'


// use express (using app)
const app = express();
app.use(express.urlencoded({extended: false }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
});

// routes
app.get('/', async (req, res) => {
    res.render('index.ejs');
});

// GET all foods
app.get('/foods', async (req, res) => {
    const allFoods = await Food.find();
    res.render('foods/index.ejs', { foods: allFoods });
});

// GET requst route for foods/new to give the user a form to Create a new food
app.get('/foods/new', async (req, res) => {
    res.render('foods/new.ejs');
});

// GET route for show page for indivitual food
app.get('/foods/:foodId', async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render('foods/show.ejs', { food: foundFood });
});


// DELETE route
app.delete('/foods/:foodId', async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId);
    res.redirect('/foods');
});

app.put('/foods/:foodId', async (req, res) => {
    if (req.body.mustKeepRefregerated === 'on') {
        req.body.mustKeepRefregerated = true;
    } else {
        req.body.mustKeepRefregerated = false;
    }
    if (req.body.mustkeepFrozen === 'on') {
        req.body.mustkeepFrozen = true;
    } else {
        req.body.mustkeepFrozen = false;
    }

    // Update the food in the data base
    await Food.findByIdAndUpdate(req.params.foodId, req.body);
    console.log(req.body);
    res.redirect(`/foods/${req.params.foodId}`);
});

// POST /fruits 
app.post('/foods', async (req, res) => {
    if (req.body.mustKeepRefregerated === 'on') {
        req.body.mustKeepRefregerated = true;
    } else {
        req.body.mustKeepRefregerated = false;
    }
    if (req.body.mustkeepFrozen === 'on') {
        req.body.mustkeepFrozen = true;
    } else {
        req.body.mustkeepFrozen = false;
    }
    console.log(req.body)
    await Food.create(req.body);
    res.redirect('/foods/');
});

app.get('/foods/:foodId/edit', async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    console.log(foundFood);
    res.render('foods/edit.ejs', {
        food: foundFood,
    });
});

// server should listen
app.listen(3000, () => {
    console.log('Listening on port 3000');
});