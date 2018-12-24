twilio_client = require('twilio')(sails.config.twilioSid, sails.config.twilioauthToken);

module.exports = {
  friendlyName: 'Send sms',
  description: "Send SMS via twillio",
  inputs: {
    toMobileNumber: {
      type: "string",
      example: "+918401428558",
      description: "The mobile number to whom we need to send sms",
      required: true
    },
    msgBody: {
      type: "string",
      example: "Message here",
      description: "The mobile number to whom we need to send sms",
      required: true
    }
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },


  fn: async function (inputs, exits) {
    // console.log("helper: send-sms: ", inputs);
    twilio_client.messages.create({
      body: inputs.msgBody,
      to: inputs.toMobileNumber, // Text this number
      from: sails.config.twiliomobilenumber // From a valid Twilio number
    }, function (err, message) {
      if (message) {
        return exits.success({
          status: true,
          message: "sms send success",
          data: message
        });
      } else if (err) {
        var err = new Error({
          type: 'Twilio',
          status: false,
          message: err.message
        });
        return exits.error(err);
      } else {
        var err = new Error({
          type: 'Twilio',
          status: false,
          message: "Twillio Error"
        });
        return exits.error(err);
      }
    });
  }
};
