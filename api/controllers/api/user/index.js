module.exports = {


  friendlyName: 'Index',


  description: 'Index user.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    var allUsers = await User.find({});
    return allUsers;
  }
};
