import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.render("index.ejs", { jobs: null, query: null, error: null });
});

app.get("/jobs", async (req, res) => {
  const userQuery = req.query.query;
  const page = req.query.page || "1";

  if (!userQuery) {
    return res.render("index.ejs", { jobs: null, query: null, error: "Please enter a search term." });
  }

  try {
    const response = await axios("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: userQuery,
        page: page,
        num_pages: "1",
        date_posted: "week",
      },
      headers: {
        'x-rapidapi-key': '814a352929msh6e1300b292084a8p18a4c2jsn16a7ecbec2f6',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    });

    res.render("index.ejs", {
      jobs: response.data.data,
      query: userQuery,
      error: null,
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.log("Error fetching jobs:", error);
    res.render("index.ejs", { jobs: null, query: userQuery, error: "Could not retrieve jobs" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
