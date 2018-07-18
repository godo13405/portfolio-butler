'use strict';

const tools = {
  botSay: ({
    input
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
                "textToSpeech": input
              }
            }]
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
    for (let k in repl) {
      rex = new RegExp(`<${k}>`, "g");
      input = input.replace(rex, repl[k]);
    }
    return input;
  }
}
exports = module.exports = tools;
