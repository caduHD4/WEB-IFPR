// EXPRESS
const express = require('express');
const app = express();
app.use(express.json())
app.listen(3333);

//CORS
const cors = require('cors');
app.use(cors());
app.options('*', cors());

// OPEN-AI
const {Configuration, OpenAIApi} = require("openai");
const config = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(config);


// POST
app.post('/api/call', async (req, res) => {
  const runPrompt = async () => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.prompt,
      max_tokens: 200,
      temperature: 0,
    });
    return response.data;
  };

  const responseFromAPI = await runPrompt();

  console.log(responseFromAPI.choices[0].text);
  res.send(responseFromAPI.choices[0].text);
});

