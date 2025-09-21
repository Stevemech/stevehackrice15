const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    sw: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    sw: { type: String, required: true }
  },
  category: {
    type: String,
    required: true,
    enum: ['hygiene', 'nutrition', 'emergency', 'prevention', 'maternal', 'general']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  content: {
    en: { type: String, required: true },
    sw: { type: String, required: true }
  },
  objectives: [{
    en: String,
    sw: String
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 50
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  resources: [{
    title: String,
    type: { type: String, enum: ['pdf', 'image', 'link'] },
    url: String
  }],
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  order: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps
lessonSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for completion status (requires population with user progress)
lessonSchema.virtual('completionStatus').get(function() {
  return this._completionStatus || 'not_started';
});

lessonSchema.set('toJSON', { virtuals: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;