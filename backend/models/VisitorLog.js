import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
  ip_address: String,
  user_agent: String,
  browser: String,
  os: String,
  device_type: String,
  screen_resolution: String,
  city: String,
  country: String,
  referrer: String,
  page_url: String,
  visit_time: { type: Date, default: Date.now }
});

const VisitorLog = mongoose.model('VisitorLog', visitorLogSchema);
export default VisitorLog;
