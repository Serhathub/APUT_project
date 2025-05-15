import express from "express";
import ejs from "ejs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { error } from "console";
import session from './session';
import 'express-session';
import { secureMiddleware } from "./secureMiddleware";
import { userInfo } from "os";
import { User } from "./types";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const app = express();
const PORT = 3000;
export const uri = "mongodb+srv://serhatkaya:j5j7JmHajuG4su9l@aputprojectdb.08sfsel.mongodb.net/?retryWrites=true&w=majority&appName=APUTprojectDB";
const client = new MongoClient(uri);
const api_token="3f6a9e47-cf22-e54f-dc92-8c03a2e09938";
export let database:any;

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static(path.join(__dirname, "public")));
async function fetchClubsFromAPI() {
  try {
    const apiToken = process.env.API_TOKEN || api_token; 
    
    const response = await fetch('https://api.futdatabase.com/api/clubs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': apiToken 
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching clubs from API:', error);
    return [];
  }
}
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

app.use(session);

function requireLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

app.get("/", secureMiddleware, (req, res) => {
  res.render("landing");
});

app.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Login' });
});

app.get('/registratie', (req, res) => {
  res.render('registratie', { pageTitle: 'Registratie' });
});

app.get('/Quiz-Page', (req, res) => {
  res.render('Quiz-Page', { pageTitle: 'FIFA Quiz_Page' });
});

app.get('/favorieten', secureMiddleware, async (req, res) => {
  try {
    const allClubs = await fetchClubsFromAPI();
    const userCol = database.collection("users");
    const user = await userCol.findOne({ _id: new ObjectId(req.session.userId) });
    
    if (!res.locals.user.favorites) {
      await database.collection("users").updateOne(
        { _id: new Object(req.session.userId) },
        { $set: { favorites: [] } }
      );
      
      res.locals.user.favorites = [];
    }
    
    res.render('favorieten', {
      pageTitle: 'Favorieten',
      allClubs: allClubs,
    });
  } catch (error) {
    console.error('Error loading favorites page:', error);
    res.status(500).render('error', { 
      pageTitle: 'Error', 
      error: 'Er is een fout opgetreden bij het laden van de favorieten pagina.' 
    });
  }
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

    const usernameTaken = await userCol.findOne({ username })
    if (usernameTaken) {
      return res.status(409).render('registratie', {
        pageTitle: 'Registratie',
        error: 'Deze gebruikersnaam is al in gebruik.',
        username: '',
        email
      });
    }

    const emailTaken = await userCol.findOne({ email });
     if (emailTaken) {
      return res.status(409).render('registratie', {
        pageTitle: 'Registratie',
        error: 'Deze email is al in gebruik.',
        username,
        email: ''
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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Server-side validatie
  if (!username || !password) {
    return res.status(400).render('login', {
      pageTitle: 'Login',
      error: 'Vul zowel gebruikersnaam als wachtwoord in.'
    });
  }

  const usersCol = database.collection('users');
  const user = await usersCol.findOne({ username });

  if (!user) {
    return res.status(401).render('login', {
      pageTitle: 'Login',
      error: 'Onbekende gebruikersnaam.'
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).render('login', {
      pageTitle: 'Login',
      error: 'Wachtwoord klopt niet.',
      username
    });
  }

  req.session.userId = user._id;
  return res.redirect('/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout fout:', err);
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});
app.post('/favorieten/add', secureMiddleware, async (req, res) => {
  try {
    const { clubId, name, league } = req.body;
    
    const clubData = {
      clubId: parseInt(clubId),
      name: name,
      league: parseInt(league)
    };
    
    await database.collection("users").updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $addToSet: { favorites: clubData } }
    );
    
    res.redirect('/favorieten');
  } catch (error) {
    console.error('Error adding club to favorites:', error);
    res.status(500).json({ error: 'Er is een fout opgetreden' });
  }
});
