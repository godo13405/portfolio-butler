'use strict';


const express = require('express'),
    bodyParser = require('body-parser'),
    data = require('./package.json').data,
    i18n = require('./package.json').i18n,
    ex = express();

const dialogflowFirebaseFulfillment = (request, response) => {
  const req = request,
    params = request.body.queryResult.parameters,
    res = response,
    action = request.body.queryResult.action;

  let say = 'Sorry, I don\'t know how to answer that yet';

  switch(action) {
      case('what.experience'):
          let skill = data.skill[params.skill],
            year = Date.getYear(),
            time = year - skill.date + 1,
            phrase = i18n[action].say[Math.floor(Math.random() * Math.floor(i18n[action].say))],
            replace = {
                time: time,
                plural: time > 1 ? 's' : null,
                skill: params.skill
            };
          say = stringReplace({input:phrase,repl:replace});
          break;
  }


  //direct intents to proper functions
  res.json(botSay(say));
};
ex.use(bodyParser.json());
ex.post('/', dialogflowFirebaseFulfillment);
let port = process.env.PORT || 3000;
ex.listen(port, () => {
  if (!process.env.SILENT) console.log('Open on port ' + port);
});

function botSay({say} = {}) {
    let output = {
  "fulfillmentText": say,
  "fulfillmentMessages": [],
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": say
            }
          }
        ]
      }
    }
  }};
return output;
}

function stringReplace({input, repl}={}) {
  let rex;
  for (let k in repl) {
    rex = new RegExp(`<${k}>`, "g");
    input = input.replace(rex, repl[k]);
  }
  return input;
}

exports.dialogflowFirebaseFulfillment = dialogflowFirebaseFulfillment;
