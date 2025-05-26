import express from "express";
import ejs from "ejs";
import path from "path";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { error } from "console";
import session from 'express-session';
import 'express-session';
import { User, Club, FavoriteClub, BlacklistedClub, Player, Coach, Area, League } from "./types";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://serhatkaya:j5j7JmHajuG4su9l@aputprojectdb.08sfsel.mongodb.net/?retryWrites=true&w=majority&appName=APUTprojectDB";
const client = new MongoClient(uri);
const api_token = "760b74ad2ee74c15ade7495760546921";
let database: Db;

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static(path.join(__dirname, "public")));

async function importClubsFromAPI() {
  const competitionCodes = ["BSA", "ELC", "PL", "EC", "FL1", "BL1", "SA", "DED", "PPL", "PD", "WC"];
  const clubsCol = database.collection<Club>("teams");

  await clubsCol.deleteMany({});

  for (const code of competitionCodes) {
    const res = await fetch(`https://api.football-data.org/v4/competitions/${code}/teams`, {
      headers: { "X-Auth-Token": api_token }
    });

    if (!res.ok) {
      console.error(`Fout bij competitie ${code}:`, res.status, await res.text());
      continue;
    }

    const data = await res.json();
    const teams: Club[] = data.teams;

    const enrichedTeams = teams.map(team => ({
      ...team,
      league: code
    }));

    await clubsCol.insertMany(enrichedTeams);
  }

  console.log("Meerdere clubs succesvol geïmporteerd.");
}


async function importLeaguesFromAPI() {
  const competitionCodes = ["BSA", "ELC", "PL", "EC", "FL1", "BL1", "SA", "DED", "PPL", "PD", "WC"];
  const leaguesCol = database.collection("leagues");

  await leaguesCol.deleteMany({});

  const res = await fetch("https://api.football-data.org/v4/competitions", {
    headers: { "X-Auth-Token": api_token }
  });

  if (!res.ok) {
    console.error("Fout bij ophalen van leagues:", res.status, await res.text());
    return;
  }

  const data = await res.json();
  const allLeagues = data.competitions;

  const filteredLeagues = allLeagues.filter((league: any) =>
    competitionCodes.includes(league.code)
  );

  await leaguesCol.insertMany(filteredLeagues);

  console.log("Meerdere leagues succesvol geïmporteerd.");
}



async function main() {
  try {
    await client.connect();
    console.log('MongoDB verbonden');
    database = client.db('APUTproject-database');
  } catch (e) {
    console.error('Verbinding met MongoDB mislukt', e);
  }
}

main();
/*
main().then(() => {
  importClubsFromAPI();
  importLeaguesFromAPI();
});
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "eenSuperGeheimeCodeVoorNu",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
    sameSite: 'lax',
  }
}));

function requireLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

app.get("/", async (req, res) => {
  let user = null;
  let maskedPassword = "";

  if (req.session.userId) {
    const usersCol = database.collection("users");
    const _id = typeof req.session.userId === "string"
      ? new ObjectId(req.session.userId)
      : req.session.userId;

    user = await usersCol.findOne({ _id });
    if (user && user.password) {
      const maxStars = 15;
      const starCount = Math.min(user.password.length, maxStars);
      maskedPassword = "*".repeat(starCount);
    }
  }

  res.render("landing", {
    user,
    isLoggedIn: !!req.session.userId,
    maskedPassword
  });
});

app.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Login' });
});

app.get('/registratie', (req, res) => {
  res.render('registratie', { pageTitle: 'Registratie' });
});

// Haal alle clubs (zonder blacklisted) voor de quiz
app.get("/api/quiz/clubs", requireLogin, async (req, res) => {
  const clubsCol = database.collection<Club>("teams");
  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId!);
  const user = await usersCol.findOne({ _id });
  const blacklistedIds = user?.blacklistedClubs?.map(b => b.clubId) || [];

  const clubs = await clubsCol
    .find({ id: { $nin: blacklistedIds } },
          { projection: { id: 1, name: 1, crest: 1 } })
    .toArray();
  res.json(clubs);
});

// Haal alle leagues voor de quiz
app.get("/api/quiz/leagues", requireLogin, async (req, res) => {
  const leaguesCol = database.collection<League>("leagues");
  const leagues = await leaguesCol
    .find({}, { projection: { id: 1, name: 1, emblem: 1 } })
    .toArray();
  res.json(leagues);
});

app.get("/Quiz-Page", requireLogin, async (req, res) => {
  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId!);
  const user = await usersCol.findOne({ _id });

  if (!user) {
    // Als er toch geen user is, sturen we terug naar login
    return res.redirect("/login");
  }

  // Zorg dat er altijd een highscore-property is (default 0)
  user.highscore = user.highscore || 0;

  // Masked password
  let maskedPassword = "";
  const maxStars = 15;
  const starCount = Math.min(user.password.length, maxStars);
  maskedPassword = "*".repeat(starCount);

  // Render met een échte User
  res.render("Quiz-Page", {
    user,
    maskedPassword
  });
});


app.get('/favorieten', requireLogin, async (req, res) => {
  const usersCol = database.collection<User>("users");
  const clubsCol = database.collection<Club>("teams");

  const _id = new ObjectId(req.session.userId);
  const user = await usersCol.findOne({ _id });

  if (!user || !user.favorites || user.favorites.length === 0) {
    return res.render('favorieten', { pageTitle: 'Favorieten', clubs: [], search: req.query.search || '' });
  }

  const blacklistedIds = (user.blacklistedClubs || []).map(b => b.clubId);
  const filteredFavorites = user.favorites.filter(fav => !blacklistedIds.includes(fav.clubId));

  const clubIds = filteredFavorites.map(f => f.clubId);
  const allFavClubsMap = new Map();
  const fetchedClubs = await clubsCol.find({ id: { $in: clubIds } }).toArray();
  fetchedClubs.forEach(club => allFavClubsMap.set(club.id, club));

  const enriched = user.favorites.map(fav => {
    const club = allFavClubsMap.get(fav.clubId);
    if (!club) return null;
    return {
      ...club,
      seen: fav.seen || 0
    };
  }).filter(Boolean);

  let filteredClubs = enriched;
  const search = req.query.search?.toString().trim().toLowerCase();
  if (search) {
    filteredClubs = enriched.filter(club =>
      club.name.toLowerCase().includes(search)
    );
  }

  res.render('favorieten', {
    pageTitle: 'Favorieten',
    clubs: filteredClubs,
    search: req.query.search || ''
  });
});
app.get("/favorieten/club/:id", requireLogin, async (req, res) => {
  const clubsCol = database.collection<Club>("teams");
  const leaguesCol = database.collection<League>("leagues");
  const usersCol = database.collection<User>("users");

  const userId = new ObjectId(req.session.userId);
  const user = await usersCol.findOne({ _id: userId });
  const clubId = Number(req.params.id);

  const club = await clubsCol.findOne({ id: clubId });
  if (!club) {
    res.status(404).send("Club niet gevonden");
    return;
  }

  const seen = user?.favorites?.find((f: FavoriteClub) => f.clubId === clubId)?.seen || 0;
  const league = await leaguesCol.findOne({ code: club.league }); 
  const squad = club.squad || [];
  const lineup = [...squad].slice(0, 11);

  res.render("clubDetail", {
    club,
    seen,
    lineup,
    leagueName: league?.name || "-"
  });
});



app.get("/favorieteleagues", requireLogin, async (req, res) => {
  const usersCol = database.collection<User>("users");
  const leaguesCol = database.collection<League>("leagues");
  const clubsCol = database.collection<Club>("teams");
  const _id = new ObjectId(req.session.userId);
  
  const user = await usersCol.findOne({ _id });

if (!user?.favoriteLeague) {
    const leagues = await leaguesCol.find().toArray();
    return res.render('favorieteleagues', {
      pageTitle: 'Favoriete League',
      league: null,
      clubs: [],
      leagues 
    });
  }

  const league = await leaguesCol.findOne({ id: user.favoriteLeague });
  const blacklistedIds = user.blacklistedClubs?.map(b => b.clubId) || [];
  const clubs = await clubsCol.find({ league: league?.code, id: { $nin: blacklistedIds } }).toArray();
  const selectedClubId = Number(req.query.clubId);
  let selectedClub = null;

  if (req.query.selectedClubId) {
  const selectedId = Number(req.query.selectedClubId);
  if (!isNaN(selectedId)) {
    selectedClub = await clubsCol.findOne({ id: selectedId });
  }
}
  if (!isNaN(selectedClubId)) {
    selectedClub = await clubsCol.findOne({ id: selectedClubId });
  }
  const blacklistedClubsInSpecificLeague = await clubsCol.find({
    id: { $in: blacklistedIds },
    league: league?.code
  }).toArray();
  res.render("favorieteleagues", {
    pageTitle: "Favoriete League",
    league,
    clubs,
    leagues: [],
    blacklistedClubsInSpecificLeague,
    selectedClub
  });
});
app.get("/blacklistedPage", requireLogin, async (req, res) => {
  const usersCol = database.collection<User>("users");
  const clubsCol = database.collection<Club>("teams");
  const _id = new ObjectId(req.session.userId);

  const user = await usersCol.findOne({ _id });
  if (!user || !user.blacklistedClubs || user.blacklistedClubs.length === 0) {
    return res.render("blacklistedPage", {
      pageTitle: "Blacklisted Clubs",
      clubs: []
    });
  }

  const clubIds = user.blacklistedClubs.map(b => b.clubId);
  const clubs = await clubsCol.find({ id: { $in: clubIds } }).toArray();

  const enriched = clubs.map(club => {
    const match = user.blacklistedClubs.find(b => b.clubId === club.id);
    return {
      ...club,
      reason: match?.reason || ""
    };
  });

  res.render("blacklistedPage", {
    pageTitle: "Blacklisted Clubs",
    clubs: enriched
  });
});

app.get("/api/clubs/all", requireLogin, async (req, res) => {
  const clubsCol = database.collection<Club>("teams");
  const allClubs = await clubsCol.find({}, { projection: { id: 1, name: 1, crest: 1 } }).toArray();
  res.json(allClubs);
});

app.get("/api/favorites", requireLogin, async (req, res) => {
  try {
    const usersCol = database.collection("users");
    const clubsCol = database.collection("teams");
    const leaguesCol = database.collection("leagues");

    const _id = new ObjectId(req.session.userId);
    const user = await usersCol.findOne({ _id });

    if (!user || !user.favorites || user.favorites.length === 0) {
      res.json([]);
      return;
    }

    const clubIds = user.favorites.map((fav: any) => fav.clubId);
    const clubs = await clubsCol.find({ id: { $in: clubIds } }).toArray();

    const leagues = await leaguesCol.find().toArray();

    const merged = clubs.map(club => {
      const match = user.favorites.find((fav: any) => fav.clubId === club.id);
      const leagueMatch = leagues.find(league => Number(league.id) === Number(club.league));

      return {
        ...club,
        seen: match?.seen || 0,
        leagueName: leagueMatch?.name || null
      };
    });

    res.json(merged);
  } catch (err) {
    console.error("Fout bij ophalen van favoriete clubs:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});


app.get("/api/clubs/search", async (req, res) => {
  const name = req.query.name?.toString().toLowerCase();
  const excludeBlacklist = req.query.excludeBlacklist === 'true';
  const _id = new ObjectId(req.session.userId);
  if (!name) {
    res.status(400).json({ error: "Naam is verplicht." });
    return;
  }

  try {    
    const clubsCol = database.collection("teams");
    const usersCol = database.collection<User>("users");
    const filter: any = { name: { $regex: new RegExp(name, "i") } };
      if (excludeBlacklist) {
          const user = await usersCol.findOne({ _id });
          const blacklistedIds = user?.blacklistedClubs?.map(b => b.clubId) || [];
          filter.id = { $nin: blacklistedIds };
    }
    const results = await clubsCol.find(filter).toArray();
    res.json(results);
  } catch (err) {
    console.error("Club search DB error:", err);
    res.status(500).json({ error: "Fout bij zoeken van clubs." });
  }
});
app.get("/api/leagues/:id", async (req, res) => {
  const leagueId = Number(req.params.id);
  try {
    const leaguesCol = database.collection("leagues");
    const league = await leaguesCol.findOne({ id: leagueId });
    if (!league) { res.status(404).json({ error: "League niet gevonden" }); return; }

    res.json({ name: league.name });
  } catch (err) {
    console.error("Fout bij ophalen league:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
});


const SALT_ROUNDS = 10;

app.post('/registratie', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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

  req.session.userId = user._id.toString();
  return res.redirect('/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout fout:', err);
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});
app.post("/api/favorites", requireLogin, async (req, res) => {
  const { clubId } = req.body;
  const parsedClubId = Number(clubId);

  if (isNaN(parsedClubId)) {
    res.status(400).json({ error: "Ongeldige clubId" });
    return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);
  const user = await usersCol.findOne({ _id });

  if (!user) {
    res.status(404).json({ error: "Gebruiker niet gevonden" });
    return;
  }

  const alreadyExists = user.favorites?.some((f: any) => Number(f.clubId) === parsedClubId);

  if (alreadyExists) {
    res.status(409).json({ error: "Deze club staat al in je favorieten." });
    return;
  }

  await usersCol.updateOne(
    { _id },
    { $push: { favorites: { clubId: parsedClubId, seen: 0 } } }
  );

  res.status(200).json({ message: "Club toegevoegd aan favorieten." });
});
app.post("/api/favorites/seen", requireLogin, async (req, res) => {
  const clubId = Number(req.body.clubId);
  if (isNaN(clubId)) {
    res.status(400).json({ error: "Ongeldige clubId" });
    return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);

  const updateResult = await usersCol.updateOne(
    { _id, "favorites.clubId": clubId },
    { $inc: { "favorites.$.seen": 1 } }
  );

  if (updateResult.modifiedCount === 0) {
    res.status(404).json({ error: "Club niet gevonden in favorieten" });
    return;
  }

  res.status(200).json({ message: "Seen count verhoogd" });
});

app.post("/api/blacklist", requireLogin, async (req, res) => {
  const { clubId, reason } = req.body;
  const parsedClubId = Number(clubId);

  if (isNaN(parsedClubId) || !reason) {
    res.status(400).json({ error: "Ongeldige data." });
    return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);
  const user = await usersCol.findOne({ _id });

  if (!user) { res.status(404).json({ error: "Gebruiker niet gevonden." }); return; }

  const alreadyBlacklisted = user.blacklistedClubs?.some(
    (b: any) => Number(b.clubId) === parsedClubId
  );

  if (alreadyBlacklisted) {
    res.status(409).json({ error: "Club staat al op de blacklist." });
    return;
  }
  await usersCol.updateOne(
    { _id },
    { $push: { blacklistedClubs: { clubId: parsedClubId, reason } }, 
      $pull: { favorites: { clubId: parsedClubId } }
    }
  );

  res.status(200).json({ message: "Club toegevoegd aan blacklist." });
});
app.post("/api/blacklist/update/:clubId", requireLogin, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const { reason } = req.body;

  if (!reason || isNaN(clubId)) {
     res.status(400).send("Ongeldige invoer");
     return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);

  const updateResult = await usersCol.updateOne(
    { _id, "blacklistedClubs.clubId": clubId },
    { $set: { "blacklistedClubs.$.reason": reason } }
  );

  if (updateResult.modifiedCount === 0) {
     res.status(404).send("Club niet gevonden of reden niet aangepast.");
     return;
  }

  res.redirect("/blacklistedPage");
});

app.post("/profile", requireLogin, async (req, res) => {
  const { username, email } = req.body;
  const usersCol = database.collection<User>("users");
  // altijd een ObjectId van de sessie-string maken
  const _id = new ObjectId(req.session.userId as string);

  // check op conflict
  const conflict = await usersCol.findOne({
    _id: { $ne: _id },
    $or: [{ username }, { email }]
  });
  if (conflict) {
    // hier kun je nog error-handling doen
    return res.status(409).render("Quiz-Page", {
      user: { _id, username, email },
      maskedPassword: "",
      error: conflict.username === username
        ? "Gebruikersnaam al in gebruik"
        : "Email al in gebruik"
    });
  }

  // update username + email
  await usersCol.updateOne({ _id }, { $set: { username, email } });

  // redirect terug naar de pagina waar het formulier vandaan kwam
  const back = req.get("Referer") || "/Quiz-Page";
  res.redirect(back);
});


app.post("/api/blacklist/delete/:clubId", requireLogin, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);

  await usersCol.updateOne(
    { _id },
    { $pull: { blacklistedClubs: { clubId } } }
  );

  res.redirect("/blacklistedPage");
});
app.post("/api/favorieteleagues/delete", requireLogin, async (req, res) => {
  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);

  await usersCol.updateOne(
    { _id },
    { $unset: { favoriteLeague: "" } }
  );

  res.redirect("/favorieteleagues");
});

app.post("/api/favorites/delete/:clubId", requireLogin, async (req, res) => {
  const clubId = Number(req.params.clubId);

  if (isNaN(clubId)) {
    res.status(400).json({ error: "Ongeldige clubId" });
    return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);

  await usersCol.updateOne(
    { _id },
    { $pull: { favorites: { clubId } } }
  );

  res.redirect("/favorieten");
});
app.post("/favorieteleagues", requireLogin, async (req, res) => {
  const leagueId = Number(req.body.leagueId);

  if (isNaN(leagueId)) {
     res.status(400).send("Ongeldige leagueId");
     return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId);

  await usersCol.updateOne(
    { _id },
    { $set: { favoriteLeague: leagueId } }
  );

  res.redirect("/favorieteleagues");
});


app.post("/api/highscore", requireLogin, async (req, res) => {
  const { score } = req.body;
  const parsed = Number(score);

  if (isNaN(parsed)) {
    res.status(400).json({ error: "Ongeldige score" });
    return;
  }

  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId!);

  await usersCol.updateOne(
    { _id },
    { $max: { highscore: parsed } }
  );

  res.status(200).json({ message: "Highscore geüpdatet" });
  return;
});

app.get("/api/highscore", requireLogin, async (req, res) => {
  const usersCol = database.collection<User>("users");
  const _id = new ObjectId(req.session.userId!);
  const user = await usersCol.findOne({ _id });
  const hs = user?.highscore ?? 0;
  res.json({ highscore: hs });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});