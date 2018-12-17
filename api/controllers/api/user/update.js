module.exports = {


  friendlyName: 'Update',


  description: 'Update user.',


  inputs: {
    userId: {
      type: 'string',
      required: true,
    },
    id: {
      type: 'number',
    },
    firstName: {
      type: 'string',
      required: true,
    },
    lastName: {
      type: 'string',
      required: true,
    },
    email: {
      required: true,
      unique: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },
    password: {
      //   required: true,
      type: 'string',
      maxLength: 15,
      minLength: 6,
      description: 'The unencrypted password to use for the new account.'
    },
  },


  exits: {
    redirect: {
      responseType: 'redirect'
    }
  },


  fn: async function (inputs, exits) {
    console.log('gone in update');

    let objUser = {
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      email: inputs.email
    }

    if (inputs.password) {
      objUser.password = inputs.password;
    }

    var updatedUser = await User.update({
      id: inputs.userId
    }).set(objUser);

    console.log("user update id :- ", inputs.userId, updatedUser);
    return exits.success({
      message: 'User has been updated successfully.',
      data: updatedUser
    });
  }
};
