const mongoose = require('mongoose');
const localDb = require('./localDb');

let dbMode = 'local'; // 'mongodb' or 'local'

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      dbMode = 'mongodb';
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection failed. Falling back to local JSON database.', err.message);
      dbMode = 'local';
    }
  } else {
    console.log('No MONGO_URI specified. Using local JSON database.');
    dbMode = 'local';
  }
};

const getModel = (name, mongooseModel) => {
  return {
    find: async (query = {}) => {
      if (dbMode === 'mongodb') return await mongooseModel.find(query);
      return localDb(name).find(query);
    },
    findOne: async (query = {}) => {
      if (dbMode === 'mongodb') return await mongooseModel.findOne(query);
      return localDb(name).findOne(query);
    },
    findById: async (id) => {
      if (dbMode === 'mongodb') return await mongooseModel.findById(id);
      return localDb(name).findById(id);
    },
    create: async (data) => {
      if (dbMode === 'mongodb') return await mongooseModel.create(data);
      return localDb(name).create(data);
    },
    findByIdAndUpdate: async (id, data) => {
      if (dbMode === 'mongodb') return await mongooseModel.findByIdAndUpdate(id, data, { new: true });
      return localDb(name).findByIdAndUpdate(id, data);
    },
    findByIdAndDelete: async (id) => {
      if (dbMode === 'mongodb') return await mongooseModel.findByIdAndDelete(id);
      return localDb(name).findByIdAndDelete(id);
    },
    countDocuments: async (query = {}) => {
      if (dbMode === 'mongodb') return await mongooseModel.countDocuments(query);
      return localDb(name).countDocuments(query);
    },
    findWithRegex: async (field, pattern, query = {}) => {
      if (dbMode === 'mongodb') {
        const regexQuery = { ...query };
        regexQuery[field] = { $regex: pattern, $options: 'i' };
        return await mongooseModel.find(regexQuery);
      }
      const items = localDb(name).find(query);
      const re = new RegExp(pattern, 'i');
      return items.filter(item => re.test(item[field] || ''));
    }
  };
};

module.exports = { connectDB, getModel, getDbMode: () => dbMode };
