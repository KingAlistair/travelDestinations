import { ObjectId } from "mongodb";

const destinations = [
  {
    _id: new ObjectId("652a1f9f8f1b2c001d3b0b1a"),
    title: "Eiffel Tower",
    description: "An iconic symbol of Paris and France.",
    image: "eiffel_tower.jpg",
    link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
    userId: new ObjectId("651a1e9f8f1b2c001d3b0a1a"), // Daniel Szabo
    countryCode: "fr",
  },
  {
    _id: new ObjectId("652a1f9f8f1b2c001d3b0b1b"),
    title: "Grand Canyon",
    description: "A massive canyon carved by the Colorado River.",
    image: "grand_canyon.jpg",
    link: "https://en.wikipedia.org/wiki/Grand_Canyon",
    userId: new ObjectId("651a1e9f8f1b2c001d3b0a1b"), // John Smith
    countryCode: "us",
  },
  {
    _id: new ObjectId("652a1f9f8f1b2c001d3b0b1c"),
    title: "Great Wall of China",
    description: "An ancient series of walls and fortifications.",
    image: "great_wall.jpg",
    link: "https://en.wikipedia.org/wiki/Great_Wall_of_China",
    userId: new ObjectId("651a1e9f8f1b2c001d3b0a1c"), // Emily Davis
    countryCode: "cn",
  },
  {
    _id: new ObjectId("652a1f9f8f1b2c001d3b0b1d"),
    title: "Colosseum",
    description: "A massive ancient amphitheater in Rome.",
    image: "colosseum.jpg",
    link: "https://en.wikipedia.org/wiki/Colosseum",
    userId: new ObjectId("651a1e9f8f1b2c001d3b0a1d"), // Michael Brown
    countryCode: "it",
  },
  {
    _id: new ObjectId("652a1f9f8f1b2c001d3b0b1e"),
    title: "Mount Fuji",
    description: "Japan's tallest mountain and an active volcano.",
    image: "mount_fuji.jpg",
    link: "https://en.wikipedia.org/wiki/Mount_Fuji",
    userId: new ObjectId("651a1e9f8f1b2c001d3b0a1e"), // Sophia Wilson
    countryCode: "jp",
  },
  {
    _id: new ObjectId("652a1f9f8f1b2c001d3b0b1f"),
    title: "Sydney Opera House",
    description: "A famous multi-venue performing arts center in Australia.",
    image: "sydney_opera_house.jpg",
    link: "https://en.wikipedia.org/wiki/Sydney_Opera_House",
    userId: new ObjectId("651a1e9f8f1b2c001d3b0a1a"), // Daniel Szabo
    countryCode: "au",
  },
];

export default destinations;
