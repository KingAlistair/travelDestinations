import { ObjectId } from "mongodb";

const users = [
  {
    userName: "Daniel Szabo",
    email: "daniel.szabo@travel.com",
    hashedPassword: "hash1",
    isLoggedIn: false,
    createdOn: new Date(),
    countryCode: "us",
  },
  {
    userName: "John Smith",
    email: "john.smith@example.com",
    hashedPassword: "hash2",
    isLoggedIn: true,
    createdOn: new Date(),
    countryCode: "us",
  },
  {
    userName: "Emily Davis",
    email: "emily.davis@example.com",
    hashedPassword: "hash3",
    isLoggedIn: false,
    createdOn: new Date(),
    countryCode: "us",
  },
  {
    userName: "Michael Brown",
    email: "michael.brown@example.com",
    hashedPassword: "hash4",
    isLoggedIn: true,
    createdOn: new Date(),
    countryCode: "us",
  },
  {
    userName: "Sophia Wilson",
    email: "sophia.wilson@example.com",
    hashedPassword: "hash5",
    isLoggedIn: false,
    createdOn: new Date(),
    countryCode: "us",
  },
];

export default users;
