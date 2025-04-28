import express from "express";
import ejs from "ejs";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://serhatkaya:j5j7JmHajuG4su9l@aputprojectdb.08sfsel.mongodb.net/?retryWrites=true&w=majority&appName=APUTprojectDB";
const client = new MongoClient(uri);
let database:any;

app.set("view engine", "ejs");
app.set("port", 3000);

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
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });