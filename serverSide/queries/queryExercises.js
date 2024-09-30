import { MongoClient, ServerApiVersion } from "mongodb";


const uri = "mongodb://127.0.0.1:27017/";
const dbName = "travelDestinations";

let client;

async function connect() {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        try {
            await client.connect();
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB", error);
            throw error;
        }
        return client.db(dbName);
    };
};

async function closeConnection() {
    if (client) {
        await client.close();
        client = null;
        console.log("Disconnected from MongoDB");
    };
};

async function runQueries() {
    const db = await connect();
    const usersCollection = db.collection("users");

    try {
        // 1. Get all users that have at least one destination with both image and description
        const usersWithImageAndDescription = await usersCollection
            .find({
                destinations: {
                    $elemMatch: {
                        image: { $exists: true },
                        description: { $exists: true },
                    },
                },
            })
            .toArray();
        console.log(
            "1. Users with destinations that have both image and description:",
            JSON.stringify(usersWithImageAndDescription, null, 1) // Get the destinations as string not as [object]
        );

        // 2. Get users who are logged in or have more than 1 destination
        const loggedInOrManyDestinations = await usersCollection
            .find({
                $or: [{ isLoggedIn: true },
                { "destinations.1": { $exists: true } }],
            })
            .toArray();
        console.log(
            "2. Users who are logged in or have more than 1 destination:",
            loggedInOrManyDestinations
        );

        // 3. Get all users who have no destinations
        const usersWithNoDestinations = await usersCollection
            .find({
                $or: [
                    { destinations: { $exists: false } },
                    { destinations: { $eq: [] } },
                ],
            })
            .toArray();
        console.log("3. Users with no destinations:",
            usersWithNoDestinations
        );

        // 4. Get users who have destinations tagged with a specific tag (can be sorted by country name)
        const tag = "Spain";
        const usersWithSpecificTag = await usersCollection
            .find({
                "destinations.tag": tag,
            })
            .toArray();
        console.log(
            `4. Users with destinations tagged with "${tag}":`,
            JSON.stringify(usersWithSpecificTag, null, 1) // Get the destinations as string not as [object]
        );

        // 5. Get destinations missing either image or description
        const destinationsMissingFields = await usersCollection
            .find({
                destinations: {
                    $elemMatch: {
                        $or: [
                            { image: { $exists: false } },
                            { description: { $exists: false } }
                        ]
                    }
                }
            })
            .toArray();
        console.log(
            "5. Destinations missing image or description:",
            JSON.stringify(destinationsMissingFields, null, 1) // Get the destinations as string not as [object]
        );



        // 6. Find users created before a certain date - Problem: createdOn is created as string

        const cutoffDate = new Date("2024-03-05").toString();
        const usersCreatedBeforeDate = {
            createdOn: { $lt: cutoffDate } // Find users with createdOn date less than cutoffDate
        };
        const usersBeforeDate = await usersCollection.find(usersCreatedBeforeDate).toArray();
        console.log('6. Users Created Before March 5, 2024:', usersBeforeDate);

    } finally {
        await closeConnection();
    }
}

runQueries();
