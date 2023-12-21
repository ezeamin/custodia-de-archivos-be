import mongoose from 'mongoose';

const { MONGO_URI } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('🧮 DB conectada 🟢\n');
  })
  .catch((err) => {
    console.log(`🟥 ERROR: ${err}`);
  });
