import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "mecha6373",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//select the Items from the database
async function getItems() {
  let result = await db.query("Select * from todo");
   items = result.rows;
  console.log(result.rows)
}
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  let result = await db.query("insert into todo (title) values ($1)", [item]);
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let id = req.body.updatedItemId;
  let title = req.body.updatedItemTitle;
  let result = db.query("update todo set title=$1 where id = $2", [title, id]);
  console.log(result.rows);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  let id = req.body.deleteItemId;
  try {
    await db.query("delete from todo where id = $1", [id]);
    res.redirect("/");
  } catch {
    console.error("shit something's broken");
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
