import { ObjectId } from "mongodb";

const users = [
  {
    userName: "Daniel Szabo",
    email: "daniel.szabo@travel.com",
    hashedPassword: "hash1",
    isLoggedIn: false,
    createdOn: new Date(),
  },
  {
    userName: "John Smith",
    email: "john.smith@example.com",
    hashedPassword: "hash2",
    isLoggedIn: true,
    createdOn: new Date(),
  },
  {
    userName: "Emily Davis",
    email: "emily.davis@example.com",
    hashedPassword: "hash3",
    isLoggedIn: false,
    createdOn: new Date(),
  },
  {
    userName: "Michael Brown",
    email: "michael.brown@example.com",
    hashedPassword: "hash4",
    isLoggedIn: true,
    createdOn: new Date(),
  },
  {
    userName: "Sophia Wilson",
    email: "sophia.wilson@example.com",
    hashedPassword: "hash5",
    isLoggedIn: false,
    createdOn: new Date(),
  },
];

export default users;
