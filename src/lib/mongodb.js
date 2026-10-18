import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI dentro de .env.local');
}

// Usamos una variable global para mantener la conexión activa en desarrollo
// y evitar que Next.js abra múltiples conexiones al recargar el código.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Provoca que falle rápido si hay error, en lugar de congelarse
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('¡Conexión exitosa a MongoDB!');
      return mongoose;
    }).catch((err) => {
      console.error('Error al conectar con MongoDB:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;