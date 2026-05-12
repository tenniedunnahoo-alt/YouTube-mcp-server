import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());

/*
 ROOT
*/

app.get("/", (req, res) => {

  res.json({
    status: "MCP Wrapper Running"
  });

});

/*
 SSE
*/

app.get("/sse", (req, res) => {

  res.setHeader(
    "Content-Type",
    "text/event-stream"
  );

  res.setHeader(
    "Cache-Control",
    "no-cache"
  );

  res.setHeader(
    "Connection",
    "keep-alive"
  );

  res.write(
    `data: connected\n\n`
  );

});

/*
 TOOLS LIST
*/

app.get("/tools", (req, res) => {

  res.json({

    tools: [
      {
        name: "youtube_search",

        description:
          "Find YouTube creators and clients"
      }
    ]

  });

});

/*
 SEARCH TOOL
*/

app.get(
  "/youtube_search",

  async (req, res) => {

    const query =
      req.query.q;

    if (!query) {

      return res.json({
        error:
          "Missing query"
      });

    }

    try {

      /*
       YOUR API CONNECT
      */

      const response =
        await axios.get(
          `https://yt-client-mcp.onrender.com/search?q=${encodeURIComponent(query)}`
        );

      res.json(
        response.data
      );

    } catch (error) {

      res.json({
        error:
          error.message
      });

    }

  }
);

/*
 START
*/

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "MCP Wrapper Running On Port " +
    PORT
  );

});
