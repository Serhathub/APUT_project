import express from "express";
import ejs from "ejs";
import path from "path";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { error } from "console";

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://serhatkaya:j5j7JmHajuG4su9l@aputprojectdb.08sfsel.mongodb.net/?retryWrites=true&w=majority&appName=APUTprojectDB";
const client = new MongoClient(uri);
const api_token="3f6a9e47-cf22-e54f-dc92-8c03a2e09938";
let database:any;

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static(path.join(__dirname, "public")));

async function main() {
    try {
        await client.connect();
        console.log('MongoDB verbonden');
        database=client.db('APUTproject-database');
    } catch (e) {     
        console.error('Verbinding met MongoDB mislukt', e);
    }
}

main();

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.get("/",(req,res)=>{
    res.render("landing"); //initial landingpagina
})

app.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Login' });
});

app.get('/registratie', (req, res) => {
  res.render('registratie', { pageTitle: 'Registratie' });
});

app.get('/Quiz-Page', (req, res) => {
  res.render('Quiz-Page', { pageTitle: 'FIFA Quiz_Page' });
});

app.get('/favorieten', (req, res) => {
  res.render('favorieten', { pageTitle: 'Favorieten' });
});

app.get('/favorieteleagues', (req, res) => {
  res.render('favorieteleagues', { pageTitle: 'FavorieteLeague' });
});

app.get('/blacklistedPage', (req, res) => {
  res.render('blacklistedPage', { pageTitle: 'Blacklisted' });
});

// test data
app.get('/get-data', async (req, res) => {
    try {
      const collection = database.collection('teams'); 
      const data = await collection.find().toArray();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send('Fout bij ophalen van gegevens');
    }
  });

// test data met api
app.get('/clubs', async (req, res) => {
  try {
    const response = await fetch('https://api.futdatabase.com/api/clubs', {
      method: 'GET',
      headers: {
        'X-AUTH-TOKEN': api_token
      }
    });

    const textBody = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', textBody);

    let data;
    try {
      data = JSON.parse(textBody);
    } catch(parseErr) {
      console.error('Kon JSON niet parsen:', parseErr);
      throw new Error('Invalid JSON response');
    }

    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de clubs.' });
  }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

const SALT_ROUNDS = 10;

app.post('/registratie', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
      return res.status(400).render('registratie', {
        pageTitle: 'Registratie',
        error: 'Vul alle verplichte velden in.'
      });
    }

    const userCol = database.collection('users');
    const exists = await userCol.findOne({ email });

    if(exists) {
      return res.status(409).render('registratie', {
        pageTitle: 'Registratie',
        error: 'Deze email is al in gebruik.'
      });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    await userCol.insertOne({
      username,
      email,
      password: hash,
      createdAt: new Date()
    });

    return res.redirect('/login?registered=success')
  } catch (err) {
    console.error('Registratie fout:', err);
    return res.status(500).render('registratie', {
      pageTitle: 'Registratie',
      error: 'Er is iets misgegaan, probeer opnieuw.'
    });
  }
});