const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.error(err);
    } else {
      res.render("index", { files: files });
    }
  });
});

app.post("/create", (req, res) => {
  const { title, details } = req.body;
  const filepath = "./files/" + title.split(" ").join("_") + ".txt";
  fs.writeFile(filepath, details, (err) => {
    if (err) console.error(err);
    else res.redirect("/");
  });
});

app.get("/file/:name", (req, res) => {
  const { name } = req.params;
  fs.readFile(`./files/${name}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const filename = name
        .slice(0, name.length - 4)
        .split("_")
        .join(" ");
      res.render("show", { filename: filename, content: data });
    }
  });
});

app.get("/rename/:name", (req, res) => {
  const { name } = req.params;
  res.render("rename", { filename: name.slice(0, name.length - 4) });
});

app.post("/rename", (req, res) => {
  const { prev_name, new_name } = req.body;
  fs.rename(`./files/${prev_name}.txt`, `./files/${new_name}.txt`, (err) => {
    if (err) console.error(err);
    else res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
