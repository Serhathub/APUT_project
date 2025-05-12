import express from "express";
import ejs from "ejs";
import path from "path";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://serhatkaya:j5j7JmHajuG4su9l@aputprojectdb.08sfsel.mongodb.net/?retryWrites=true&w=majority&appName=APUTprojectDB";
const client = new MongoClient(uri);
const api_token="8d646a2f-c1c9-1e82-c991-1307bfbc7bb0";
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

app.get("/",(req,res)=>{
    res.render("landing"); //initial landingpagina
})

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
          'Authorization': `Bearer ${api_token}` 
        }
      });
      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${await response.text()}`);
      if (!response.ok) {
        throw new Error('Netwerk response was niet ok');
      }
  
      const clubs = await response.json();  
      res.json(clubs);
    } catch (error) {
      res.status(500).json({error:` Er is een fout opgetreden bij het ophalen van de clubs: `});
    }
  });
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });