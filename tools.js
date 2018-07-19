'use strict';

const tools = {
  botSay: ({
    input,
    suggestions = []
  } = {}) => {
    let output = {
      "fulfillmentText": input,
      "fulfillmentMessages": [],
      "payload": {
        "google": {
          "expectUserResponse": true,
          "richResponse": {
            "items": [{
              "simpleResponse": {
                "textToSpeech": input,
                "displayText": input
              }
            }],
            "suggestions": tools.getSugg(suggestions)
          }
        }
      }
    };
    return output;
  },

  stringReplace: ({
    input,
    repl
  } = {}) => {
    let rex;
    if (Array.isArray(input)) input = input[0];
    for (let k in repl) {
      rex = new RegExp(`<${k}>`, "g");
      input = input.replace(rex, repl[k]);
    }
    return input;
  },
    getSugg: input => {
      let output = [];
      input.forEach(x => {
        output.push({title:x});
      });
      return output;
    },

  getRand: (input, limit = 1) => {
    let output =  tools.shuffleArr(input);
    output = output.slice(0, limit);
    return output;
  },

  shuffleArr: a => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  toSlug: input => {
    let output  = input.replace(/\s/gi, '-');
    output  = output.replace(/\./gi, '-');
    output  = output.toLowerCase();
    return output;
  }
}
exports = module.exports = tools;
