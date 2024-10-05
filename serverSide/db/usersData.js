import { ObjectId } from "mongodb";

const users = [
  {
    _id: new ObjectId("651a1e9f8f1b2c001d3b0a1a"),
    userName: "Dani",
    email: "daniel.szabo@travel.com",
    hashedPassword: "hash1",
    isLoggedIn: false,
    createdOn: new Date(),
  },
  {
    _id: new ObjectId("651a1e9f8f1b2c001d3b0a1b"),
    userName: "John.S",
    email: "john.smith@example.com",
    hashedPassword: "hash2",
    isLoggedIn: false,
    createdOn: new Date(),
  },
  {
    _id: new ObjectId("651a1e9f8f1b2c001d3b0a1c"),
    userName: "Emily.D",
    email: "emily.davis@example.com",
    hashedPassword: "hash3",
    isLoggedIn: false,
    createdOn: new Date(),
  },
  {
    _id: new ObjectId("651a1e9f8f1b2c001d3b0a1d"),
    userName: "Michael.B",
    email: "michael.brown@example.com",
    hashedPassword: "hash4",
    isLoggedIn: false,
    createdOn: new Date(),
  },
  {
    _id: new ObjectId("651a1e9f8f1b2c001d3b0a1e"),
    userName: "Sophia.W",
    email: "sophia.wilson@example.com",
    hashedPassword: "hash5",
    isLoggedIn: false,
    createdOn: new Date(),
  },
];

export default users;
