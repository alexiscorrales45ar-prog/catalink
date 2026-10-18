import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  // Esta es la "Server Action": una función que se ejecuta solo en el servidor de Vercel
  async function addProduct(formData) {
    'use server';
    await dbConnect();

    // Extraemos los datos que el usuario escribió en el formulario
    const newProduct = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
    };

    // Guardamos en MongoDB
    await Product.create(newProduct);
    
    // Redirigimos automáticamente al usuario de vuelta al catálogo
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Agregar Producto</h1>
        
        {/* El formulario ejecuta la función addProduct al presionar el botón */}
        <form action={addProduct} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del producto</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
              placeholder="Ej. Zapatos Nike Air" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
            <textarea 
              name="description" 
              required 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
              placeholder="Breve descripción del producto..." 
              rows="3"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Precio ($)</label>
            <input 
              type="number" 
              name="price" 
              required 
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
              placeholder="99.99" 
              step="0.01" 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white p-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg mt-2"
          >
            Guardar en el Inventario
          </button>
        </form>
      </div>
    </div>
  );
}