'use strict';


const express = require('express'),
    bodyParser = require('body-parser'),
    ex = express(),
    data = require('./data.json'),
    i18n = require('./i18n.json'),
    tools = require('./tools.js');

const dialogflowFirebaseFulfillment = (request, response) => {
  const req = request,
    params = request.body.queryResult.parameters,
    res = response,
    action = request.body.queryResult.action,
    dt = new Date();

  let say = 'Sorry, I don\'t know how to answer that yet';

  switch(action) {
      case('what.experience'):
          let skill = data.skill[params.skill],
            year = dt.getFullYear(),
            time = (year - parseInt(skill.date)) + 1,
            phrase = i18n[action].say[Math.floor(Math.random() * i18n[action].say.length)],
            replace = {
                time: time,
                plural: time > 1 ? 's' : '',
                skill: params.skill
            };
          say = tools.stringReplace({input:phrase,repl:replace});
          break;
  }


  //direct intents to proper functions
  res.json(tools.botSay({input:say}));
};
ex.use(bodyParser.json());
ex.post('/', dialogflowFirebaseFulfillment);
let port = process.env.PORT || 3000;
ex.listen(port, () => {
  if (!process.env.SILENT) console.log('Open on port ' + port);
});

exports.dialogflowFirebaseFulfillment = dialogflowFirebaseFulfillment;
