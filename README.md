# Steps

### Install sails js globally
[npm install sails -g](https://sailsjs.com/get-started)

### Create your app
##### sails new sails-1-actions-2-examples
and select type of project (i've choose to empty project)
after that just fire 'sails lift' and browse localhost:1337
you can use [nodemon](https://nodemon.io/) for automatic restarting of application.

### lets create simple crud example with action2
we will use [sails generate](https://sailsjs.com/documentation/reference/command-line-interface/sails-generate) (sails cli) commands to generate actions,models etc.

##### we should add model default attribute
open: /config/models.js file and inside attributes object just add this fields
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: { type: 'number', autoIncrement: true, },
  },
 now this fields will add automatically in every model
 we will also uncomment this (developement use only)
 => migrate: 'alter', (this will alter our database if needed)
##### Create our first model with
sails generate model user
now we will add attributes to our model (/api/models/User.js)

module.exports = {
  attributes: {

    firstName: {
      type: 'string',
      required: true,
    },
    lastName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
      protect: true
    },
  }
}

##### now we will generate our first action for create user
=> sails generate action api/user/create
this will generate file inside user folder: api/controllers/api/user/create.js

##### we also need declare route inside router.js (config/routes.js)
=> 'POST /api/v1/user/create': { action: 'api/user/create' },

##### adding validation with action2
instead of using regular res and req in sails v1 we will use inputs and exits
inside inputs object just add following
(this validation will return error itself if invalid data received).

inputs: {
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
    },
    password: {
      required: true,
      type: 'string',
      maxLength: 15,
      minLength: 6,
    },
  },

you can also set custom exits (for ex. return invalid with status code 409)
 exits: {
    invalid: {
      statusCode: 409,
      description: 'firstname, lastname, email and password is required.'
    },
  },


 # Create
 we will use waterline's create with our model name
 we can get parameters value with inputs (for ex.inputs.firstName);

 fn: async function (inputs, exits) {
    var userRecord = await User.create({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        password: inputs.password,
      });

    if (!userRecord) {
      return exits.invalid({
        message: 'invalid'
      });
    }
    return exits.success({
      message: 'User has been created successfully.',
      data: userRecord
    });
  }
};

if userRecord created successfully we will return success message with user data.
##### tip: you can intercept response
if email id is not unique our model driver will return error with code 'E_UNIQUE'
you can intercept and send your own message like this

.intercept('E_UNIQUE', (err) => {
        return exits.invalid({
          message: 'invalid',
          err: err
        });
      })
      .fetch();
--------------
I have created a [POSTMAN](https://www.getpostman.com/collections/8ca6ae07e1ceaf68b4aa) for all api calls.
# Update
lets quickly create actions for update the user
=> sails generate action api/user/update
add it to our routes
=> 'PUT /api/v1/user/update/:userId': { action: 'api/user/update' },
to get userId from url we will declare it inside our inputs object

inputs: {
    userId: {
      type: 'string',
      required: true,
    },
}
so we can get easliy access of userId with 'inputs.userId'.

we can update user with waterlines update function along with our model name
var updatedUser = await User.update({
      id: inputs.userId
}).set({
     firstName: inputs.firstName,
      lastName: inputs.lastName,
      email: inputs.email,
      password:inputs.password
});

##### tip: Get data after updating record
just add 'fetchRecordsOnUpdate: true' inside your model ( /api/models/User.js ) with attributes
this will always fetch data for you when object is updated.

##### tip: Bydefault remove password in response
to remove password from response just add this function inside your model ( /api/models/User.js ) after attributes object
attributes:{
...
},
customToJSON: function () {
    return _.omit(this, ['password'])
},

# Index / View
create new action
=> sails generate action api/user/index
add new route
=> 'GET /api/v1/user': { action: 'api/user/index' },
=> inside function add this,it will returns all users
fn: async function (inputs) {
    var allUsers = await User.find({});
    return allUsers;
  }

# Delete
generate new action with
=>  sails generate action api/user/delete
and add it to our routes
=> 'DELETE /api/v1/api/user/delete/:userId': { action: 'api/user/delete' },

again to access userId we will add it to our inputs object and then just delete it with destroy function

var userRecord = await User.destroy({
    id: inputs.userId
});
