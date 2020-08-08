const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Ride {
        _id: ID!
        origin: String!
        destination: String!
        pickupDate: String!
        pickupTime: String!
        duration: String!
        distance: String!
        vehicleType: String!
        price: String!
        serviceType: String
        hours: String
        flightNumber: String
        pickupSign: String
        phoneNumber: String
        billingEmail: String
        notes: String
        creator: User
    }
    
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        rides: [Ride!]!
    }
    
    type RideData {
        rides: [Ride!]!
    }

    type AuthData {
        token: String!
        userId: String!
        email: String!
        firstName: String!
        lastName: String!
    }
    
    input UserInputData {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input RideInputData {
        origin: String!
        destination: String!
        pickupDate: String!
        pickupTime: String!
        vehicleType: String!
        duration: String!
        distance: String!
        price: String!
        serviceType: String
        hours: String
        flightNumber: String
        pickupSign: String
        phoneNumber: String
        billingEmail: String
        notes: String
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData
        getRides: RideData
        getRide(id: ID!): Ride!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createRide(userInput: RideInputData): Ride!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
