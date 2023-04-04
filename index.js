const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const app = express();
const port = 3000;
const pages_dir = path.join(__dirname, "src/pages");
const backend_dir = path.join(__dirname, "backend");
const forums_dir = path.join(backend_dir, "forums");
const limbo_dir = path.join(backend_dir, "limbo");
const bot_dir = path.join(__dirname, "bot");
const { MessageListener, CommandHandlers } = require("./bot/stardust/index.js");
const { clientId } = require("./config.json");

const baseURL = "https://odd-blue-mackerel-coat.cyclic.app";
const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
} = require("discord.js");

require("dotenv").config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const listener = new MessageListener(client);
const commandHandlers = new CommandHandlers(client);

//Setting up Commands using Stardust API
const commandFiles = commandHandlers.handle(bot_dir);
commandHandlers.load(path.join(bot_dir, "commands"), commandFiles);
commandHandlers.deploy(bot_dir, clientId);
commandHandlers.execute();

app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/index.html"));
});

for (const file of fs.readdirSync(pages_dir)) {
  const fileName = file.slice(0, -5);
  app.get(`/${fileName}`, async (req, res) => {
    res.sendFile(path.join(pages_dir, file));
  });
}

app.get("/assets/:id", (req, res) => {
  const id = req.params.id;
  try {
    res.sendFile(path.join(__dirname, `src/assets/${id}`));
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

app.get("/scripts/:id", (req, res) => {
  const id = req.params.id;
  try {
    res.sendFile(path.join(__dirname, `src/js/${id}`));
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

app.get("/modules/:id", (req, res) => {
  const id = req.params.id;
  try {
    res.sendFile(path.join(__dirname, `src/js/modules/${id}`));
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

// Initialize token bucket algorithm parameters
const maxTokens = 2;
let currentTokens = maxTokens;
const refillRate = 1; // tokens per second
let lastRefillTime = Date.now();

// Middleware function to rate limit requests using token bucket algorithm
function rateLimiter(req, res, next) {
  // Refill the token bucket based on refill rate
  const currentTime = Date.now();
  const timeSinceLastRefill = currentTime - lastRefillTime;
  const tokensToAdd = Math.floor((timeSinceLastRefill * refillRate) / 1000);
  currentTokens = Math.min(currentTokens + tokensToAdd, maxTokens);
  lastRefillTime = currentTime;

  // Check if there are enough tokens to allow the request
  if (currentTokens > 0) {
    currentTokens--;
    next();
  } else {
    res.status(429).send("Too many requests");
  }
}

// Apply rate limiter middleware to the createForum endpoint
app.post("/createForum", rateLimiter, async (req, res) => {
  const text = req.headers["text"];
  const title = req.headers["title"];

  let forum_ids = [];

  const response = await fetch(`${baseURL}/listForums`);
  const data = await response.text();
  forum_ids = JSON.parse(data);

  let cooldownTime = 5000; // 5 seconds

  function generateId() {
    const newId = Math.floor(Math.random() * 999999);
    if (forum_ids.includes(newId.toString())) {
      console.log("Id has already been generated...");
      setTimeout(() => generateId(), cooldownTime);
      return;
    } else {
      return newId;
    }
  }

  const forumObj = {
    text: text,
    title: title,
    id: generateId(),
  };

  if (forumObj.id) {
    const forumEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`FORUM INCOMING!`)
      .addFields(
        { name: "Requested Text:", value: forumObj.text },
        { name: "Requested Title:", value: forumObj.title },
        { name: "ID:", value: forumObj.id.toString() }
      );
    client.channels.cache
      .get("1092582079167991899")
      .send({ embeds: [forumEmbed] });
    fs.writeFileSync(
      path.join(limbo_dir, `${forumObj.id}.json`),
      JSON.stringify(forumObj)
    );
  } else {
    res.status(500).send("Unable to generate valid ID");
  }
});

app.get("/listForums", async (req, res) => {
  const forums = [];
  for (const file of fs.readdirSync(forums_dir)) {
    var id = file.slice(0, -5);
    forums.push(id);
  }
  res.send(forums);
});

app.get("/getForum/:id", async (req, res) => {
  const id = req.params.id;
  try {
    var data = JSON.parse(
      fs.readFileSync(path.join(forums_dir, `${id}.json`), "utf8")
    );
    res.send(data);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

app.post("/acceptForum", async (req, res) => {
  const id = req.headers["id"];
  const token = req.headers["token"];
  const secretToken = process.env.RELAY_TOKEN;

  if (token !== secretToken) {
    res.status(403).send("Access Denied");
  } else {
    if (fs.existsSync(path.join(limbo_dir, `${id}.json`))) {
      const limboForum = fs.readFileSync(
        path.join(limbo_dir, `${id}.json`),
        "utf-8"
      );
      const acceptedForum = fs.writeFileSync(
        path.join(forums_dir, `${id}.json`),
        JSON.stringify(JSON.parse(limboForum))
      );
      fs.rmSync(path.join(limbo_dir, `${id}.json`));
      res.status(200).send("Accepted");
    } else {
      res.status(500).send("Forum no longer exists");
    }
  }
});

app.post("/removeForum", async (req, res) => {
  const id = req.headers["id"];
  const token = req.headers["token"];
  const secretToken = process.env.RELAY_TOKEN;
  if (token !== secretToken) {
    res.status(403).send("Access Denied");
  } else {
    if (fs.existsSync(path.join(limbo_dir, `${id}.json`))) {
      fs.rmSync(path.join(limbo_dir, `${id}.json`));
      res.status(200).send("Accepted");
    } else {
      res.status(500).send("Forum no longer exists");
    }
  }
});

app.listen(port, () => {
  console.clear();
  console.log(`App is running on port ${port}`);
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);
