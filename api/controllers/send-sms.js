module.exports = {


  friendlyName: 'Send sms',


  description: '',


  inputs: {
    toMobileNumber: {
      description: "Mobile Number to which we need to send test sms.",
      type: "string",
      required: true
    },
    msgBody: {
      type: "string",
      required: true
    }
  },


  exits: {
    success: {
      description: 'All done.',
    },
  },


  fn: async function (inputs,exits) {
    console.log('gone => ', sails.config.twilioSid, sails.config.twilioauthToken);
    var smsResponse = await sails.helpers.sendSms(inputs.toMobileNumber, inputs.msgBody);
    if (smsResponse) {
      console.log("action send-sms success smsResponse", smsResponse);
      return exits.success({
        Hi: smsResponse
      });
    }
  }
};
