'use strict';


const express = require('express'),
  bodyParser = require('body-parser'),
  ex = express(),
  data = require('./data.json'),
  i18n = require('./i18n.json'),
  suggestions = require('./suggestions.json'),
  tools = require('./tools.js');

const dialogflowFirebaseFulfillment = (request, response) => {
  const req = request,
    params = request.body.queryResult.parameters,
    res = response,
    action = request.body.queryResult.action,
    dt = new Date();

  let say = 'Sorry, I don\'t know how to answer that yet',
    sugg = [];

  if (action === 'what.experience' || action === 'check.experience') {
    let skill = data.skill[params.skill] || false,
      hasSkill = Boolean(skill).toString(),
      year = dt.getFullYear(),
      time = (year - parseInt(skill.date)) + 1,
      phrase = tools.getRand(i18n[action][hasSkill]),
      replace = {
        time: time,
        plural: time > 1 ? 's' : '',
        skill: params.skill
      };
    say = tools.stringReplace({
      input: phrase,
      repl: replace
    });
    sugg = [
      'Tell me more'
    ];
  } else if (action === 'what.project') {
    let phrase = tools.getRand(i18n[action].true),
      replace = {
        project: params.project,
        link: tools.toSlug(`/portfolio/${params.project}`)
      };
    say = tools.stringReplace({
      input: phrase,
      repl: replace
    });
    sugg = [
      'Tell me more'
    ];
  } else {
    say = tools.getRand(i18n[action].true);
    if (suggestions[action]) {
      sugg = tools.getRand(suggestions[action], 3);
    }
  }


  //direct intents to proper functions
  res.json(tools.botSay({
    input: say,
    suggestions: sugg
  }));
};
ex.use(bodyParser.json());
ex.post('/', dialogflowFirebaseFulfillment);
let port = process.env.PORT || 3000;
ex.listen(port, () => {
  if (!process.env.SILENT) console.log('Open on port ' + port);
});

exports.dialogflowFirebaseFulfillment = dialogflowFirebaseFulfillment;
