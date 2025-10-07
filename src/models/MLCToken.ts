import mongoose from 'mongoose';

const MLCTokenSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: 'mlc'
  },
  access_token: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  token_type: {
    type: String,
    default: 'Bearer'
  },
  scope: String,
  user_id: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt
MLCTokenSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar si el token expiró
MLCTokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expires_at;
};

// Método para verificar si necesita refresh (expira en menos de 1 hora)
MLCTokenSchema.methods.needsRefresh = function() {
  const oneHour = 60 * 60 * 1000; // 1 hora en ms
  return (this.expires_at - Date.now()) < oneHour;
};

const TokenModel = mongoose.models.MLCToken || mongoose.model('MLCToken', MLCTokenSchema);

export default TokenModel;