import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import CatalogClient from './CatalogClient'; // Importamos tu nuevo componente interactivo

// Forzamos a Next.js a no usar caché vieja para que siempre muestre el catálogo actualizado
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Conectarnos a MongoDB
  await dbConnect();

  // 2. Traer los productos reales, convirtiendo el _id complejo de Mongo a un texto normal
  const rawProducts = await Product.find({}).lean();
  const products = rawProducts.map(p => ({
    ...p,
    _id: p._id.toString() 
  }));

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center mt-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Catálogo <span className="text-blue-600">CataLink</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">Selecciona tus productos favoritos</p>
        </header>

        {/* 3. Renderizamos el componente del cliente pasándole los productos */}
        <CatalogClient products={products} />
      </div>
    </main>
  );
}