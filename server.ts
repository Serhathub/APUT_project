import express from "express";
import ejs from "ejs";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("port", 3000);

app.get("/",(req,res)=>{
    res.render("landing"); //initial landingpagina
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });