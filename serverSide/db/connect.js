import mongoose from 'mongoose';

const uri = 'mongodb://127.0.0.1:27017/travelDestinations';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + uri);
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});

export default mongoose;
