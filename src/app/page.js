import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product'; // Ajusta la ruta si tu modelo está en otra carpeta

export default async function Home() {
  // 1. Conectarnos a MongoDB directamente desde el servidor
  await dbConnect();

  // 2. Pedir todos los productos y convertirlos a objetos puros de JavaScript (.lean())
  const products = await Product.find({}).lean();

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado del Catálogo */}
        <header className="mb-12 text-center mt-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Catálogo <span className="text-blue-600">CataLink</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg">Explora nuestra colección premium</p>
        </header>

        {/* Cuadrícula (Grid) de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product._id.toString()} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col"
              >
                {/* Cuadro simulando la imagen por ahora */}
                <div className="aspect-square bg-gradient-to-tr from-gray-100 to-gray-200 rounded-xl mb-5 flex items-center justify-center text-gray-400 font-medium">
                  [ Imagen del Producto ]
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {product.name || 'Producto Exclusivo'}
                </h2>
                
                <p className="text-gray-500 mt-2 text-sm line-clamp-2 flex-grow">
                  {product.description || 'Un producto increíble gestionado a través de la plataforma CataLink.'}
                </p>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900">
                    ${product.price || '0.00'}
                  </span>
                  <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                    Comprar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Aún no hay productos en el catálogo. ¡Añade el primero!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}