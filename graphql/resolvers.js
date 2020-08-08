const User = require("../models/user");
const Ride = require("../models/rides");

const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  sendMailToClient,
  sendMailToAdmin,
  sendSmsMethod
} = require("../utils/mail");

module.exports = {
  createUser: async function({ userInput }, req) {
    const existingUser = await User.findOne({ email: userInput.email });
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-mail format entered is wrong" });
    }

    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid Input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    if (existingUser) {
      const error = new Error("User already exists!");
      error.code = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 12);

    const user = new User({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      email: userInput.email,
      password: hashedPassword
    });

    const createdUser = await user.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async function({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User does not exist!");
      error.code = 422;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Username or Password is incorrect");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      "secret",
      { expiresIn: "1h" }
    );
    return {
      token: token,
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
  },

  createRide: async function({ userInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not Authenticated");
    //   error.code = 401;
    //   throw error;
    // }

    const user = await User.findById(req.userId);
    // if (!user) {
    //   const error = new Error("User Not Found!");
    //   error.code = 422;
    //   throw error;
    // }

    const ride = new Ride({
      origin: userInput.origin,
      destination: userInput.destination,
      pickupDate: userInput.pickupDate,
      pickupTime: userInput.pickupTime,
      duration: userInput.duration,
      distance: userInput.distance,
      vehicleType: userInput.vehicleType,
      price: userInput.price,
      serviceType: userInput.serviceType,
      hours: userInput.hours,
      flightNumber: userInput.flightNumber,
      pickupSign: userInput.pickupSign,
      phoneNumber: userInput.phoneNumber,
      billingEmail: userInput.billingEmail,
      notes: userInput.notes,
      creator: user
    });

    const createdRide = await ride.save();
    if (user) {
      user.rides.push(createdRide);
      await user.save();
    }

    const emailRide = await Ride.findOne({ _id: { $eq: createdRide._id } });

    if (user) {
      sendMailToClient(emailRide, user);
    } else {
      sendMailToClient(emailRide);
    }
    sendMailToAdmin(emailRide);
    // sendSmsMethod(user, emailRide);

    return {
      ...createdRide._doc,
      _id: createdRide._id.toString()
    };
  },

  getRides: async function(_, req) {
    if (!req.isAuth) {
      const error = new Error("Not Authenticated");
      error.code = 401;
      throw error;
    }

    const user = req.userId;
    const rides = await Ride.find({ creator: { $eq: user } });

    return {
      rides: rides.map(ride => {
        return {
          ...ride._doc,
          _id: ride._id.toString()
        };
      })
    };
  },

  getRide: async function({ id }, req) {
    const ride = await Ride.findById(id);
    if (!ride) {
      const error = new Error("Ride Not Found!");
      error.code = 422;
      throw error;
    }

    return {
      ...ride._doc,
      id: ride._id.toString()
    };
  }
};
