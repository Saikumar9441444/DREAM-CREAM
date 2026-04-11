import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  lastVisited: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 }
});

export default mongoose.model('Visitor', visitorSchema);
