import express from "express";
import axios from "axios";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

const app = express();

app.use(express.json());

/*
  OFFICIAL MCP SERVER
*/

const server = new Server(
  {
    name: "youtube-client-finder",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

/*
  TOOLS LIST
*/

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => {

    return {
      tools: [
        {
          name: "youtube_search",

          description:
            "Find YouTube creators and potential clients",

          inputSchema: {
            type: "object",

            properties: {
              query: {
                type: "string",
                description:
                  "Search query for YouTube creators"
              }
            },

            required: ["query"]
          }
        }
      ]
    };

  }
);

/*
  TOOL CALL
*/

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {

    if (
      request.params.name ===
      "youtube_search"
    ) {

      const query =
        request.params.arguments.query;

      try {

        /*
          YOUR EXISTING API
        */

        const response =
          await axios.get(
            `https://yt-client-mcp.onrender.com/search?q=${encodeURIComponent(query)}`
          );

        return {
          content: [
            {
              type: "text",

              text: JSON.stringify(
                response.data,
                null,
                2
              )
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text:
                "API Error: " +
                error.message
            }
          ]
        };

      }

    }

    return {
      content: [
        {
          type: "text",
          text: "Unknown tool"
        }
      ]
    };

  }
);

/*
  SSE ENDPOINT
*/

app.get(
  "/sse",

  async (req, res) => {

    const transport =
      new SSEServerTransport(
        "/messages",
        res
      );

    await server.connect(
      transport
    );

  }
);

/*
  MESSAGE ENDPOINT
*/

app.post(
  "/messages",

  async (req, res) => {

    res.sendStatus(200);

  }
);

/*
  ROOT
*/

app.get("/", (req, res) => {

  res.json({
    status:
      "Official MCP Running"
  });

});

/*
  START SERVER
*/

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Official MCP Running On Port " +
    PORT
  );

});
