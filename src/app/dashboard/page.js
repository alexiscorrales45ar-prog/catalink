import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';

export default async function Dashboard() {
  // Conectamos a BD y traemos los productos para el BALANCE
  await dbConnect();
  const products = await Product.find({}).lean();

  // Función mágica que se ejecuta en el servidor
  async function addProduct(formData) {
    'use server';
    await dbConnect();

    // Validamos el precio en el servidor por seguridad (Punto 2)
    const price = Number(formData.get('price'));
    if (price < 0) throw new Error("El precio no puede ser negativo");

    // Punto 1: Atrapamos la foto subida desde la PC
    const file = formData.get('imageFile');
    let imageUrl = '';
    
    if (file && file.size > 0) {
      // Truco SaaS: Convertimos la foto a código de texto (Base64) para guardarla en MongoDB
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      imageUrl = `data:${file.type};base64,${base64}`;
    }

    const newProduct = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: price,
      stock: Number(formData.get('stock')),
      imageUrl: imageUrl || 'https://via.placeholder.com/400',
    };

    await Product.create(newProduct);
    revalidatePath('/dashboard'); // Recarga los datos al instante
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Agregar Nuevo Producto</h1>
          <form action={addProduct} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
              <input type="text" name="name" required className="w-full border p-3 rounded-xl outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Precio ($)</label>
                {/* min="0" previene números negativos en la interfaz */}
                <input type="number" name="price" required min="0" step="0.01" className="w-full border p-3 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Stock (Cantidad)</label>
                <input type="number" name="stock" required min="0" defaultValue="10" className="w-full border p-3 rounded-xl outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
              <textarea name="description" required className="w-full border p-3 rounded-xl outline-none" rows="2"></textarea>
            </div>

            {/* INPUT DE TIPO ARCHIVO (FOTO) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subir Foto Real</label>
              <input type="file" name="imageFile" accept="image/*" required className="w-full border p-3 rounded-xl outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            
            <button type="submit" className="w-full bg-black text-white p-3.5 rounded-xl font-bold hover:bg-gray-800 mt-2">
              Subir al Catálogo
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: BALANCE E INVENTARIO (Punto 3) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Balance de Inventario</h1>
          <div className="flex flex-col gap-4">
            {products.length === 0 ? (
              <p className="text-gray-500">No hay productos aún.</p>
            ) : (
              products.map((product) => (
                <div key={product._id.toString()} className="flex justify-between items-center p-4 border rounded-xl">
                  <div className="flex items-center gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    <div>
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  {/* ALERTA DE STOCK BAJO */}
                  <div className={`px-4 py-2 rounded-lg font-bold text-sm flex flex-col items-end ${product.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    <span>Stock: {product.stock}</span>
                    {product.stock <= 5 && <span className="text-xs">¡Por acabarse!</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}