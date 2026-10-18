import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: false }, // Here we will link Cloudinary images later
  storeId: { type: String, required: true }, // Crucial for SaaS: identifies which client owns this product
  stock: { type: Number, required_ true, min: 0, default: 10 }, // // Punto 3: Cantidad en inventario
}, {
  timestamps: true, // Automatically generates 'createdAt' and 'updatedAt'
});

// We check if the model already exists to prevent Next.js hot-reloads from crashing
export default mongoose.models.Product || mongoose.model('Product', ProductSchema)