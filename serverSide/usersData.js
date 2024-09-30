import { ObjectId } from 'mongodb';

const users = [
  {

    userName: "Daniel Szabo",
    email: "daniel.szabo@travel.com",
    hashedPassword: "hash1",
    isLoggedIn: false,
    createdOn: "2024-12-10",
    destinations: [
      {
        _id: new ObjectId(), // Unique ID for the destination (MongoDb by defualt only creates it for the users)
        title: "Summer in Nepal",
        description: "It was fun there",
        image: "path/to/image",
        link: "https://en.wikipedia.org/wiki/Nepal",
        tag: "Nepal"
      }
    ]
  },
  {
    userName: "John Smith",
    email: "john.smith@example.com",
    hashedPassword: "hash2",
    isLoggedIn: true,
    createdOn: "2024-01-15",
    destinations: [
      {
        _id: new ObjectId(),
        title: "Trip to Japan",
        description: "Visited Tokyo and Kyoto. Amazing culture and food.",
        image: "path/to/japan-image",
        link: "https://en.wikipedia.org/wiki/Japan",
        tag: "Japan"
      },
      {
        _id: new ObjectId(),
        title: "Exploring the Swiss Alps",
        description: "Hiking through the mountains was a breathtaking experience.",
        image: "path/to/swiss-alps-image",
        link: "https://en.wikipedia.org/wiki/Swiss_Alps",
        tag: "Switzerland"
      }
    ]
  },
  {
    userName: "Emily Davis",
    email: "emily.davis@example.com",
    hashedPassword: "hash3",
    isLoggedIn: false,
    createdOn: "2024-02-20",
    destinations: [
      {
        _id: new ObjectId(),
        title: "Adventure in Australia",
        description: "Explored the Great Barrier Reef and Sydney.",
        image: "path/to/australia-image",
        link: "https://en.wikipedia.org/wiki/Australia",
        tag: "Australia"
      }
    ]
  },
  {
    userName: "Michael Brown",
    email: "michael.brown@example.com",
    hashedPassword: "hash4",
    isLoggedIn: true,
    createdOn: "2024-03-05",
    destinations: [
      {
        _id: new ObjectId(),
        title: "Safari in Kenya",
        description: "Saw the Big Five animals and enjoyed the savannah landscapes.",
        image: "path/to/kenya-image",
        link: "https://en.wikipedia.org/wiki/Kenya",
        tag: "Kenya"
      }
    ]
  },
  {
    userName: "Sophia Wilson",
    email: "sophia.wilson@example.com",
    hashedPassword: "hash5",
    isLoggedIn: false,
    createdOn: "2024-04-10",
    destinations: [
      {
        _id: new ObjectId(),
        title: "Journey through Italy",
        description: "Visited Rome, Florence, and Venice. Loved the art and architecture.",
        image: "path/to/italy-image",
        link: "https://en.wikipedia.org/wiki/Italy",
        tag: "Italy"
      },
      {
        _id: new ObjectId(),
        title: "Discovering Greece",
        description: "Explored Athens and the beautiful Greek islands.",
        image: "path/to/greece-image",
        link: "https://en.wikipedia.org/wiki/Greece",
        tag: "Greece"
      }
    ]
  }
];


export default users;