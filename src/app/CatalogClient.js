'use client'; // Le dice a Next.js que este componente es interactivo para el usuario

import { useState } from 'react';

export default function CatalogClient({ products }) {
  // Estado para la memoria del carrito
  const [cart, setCart] = useState([]);

  // Función para agregar al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        // Si ya está en el carrito, le sumamos 1 a la cantidad
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Función para quitar del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Calcular el total a pagar
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* SECCIÓN IZQUIERDA: LISTA DE PRODUCTOS */}
      <div className={`flex-1 grid grid-cols-1 sm:grid-cols-2 ${cart.length > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8 transition-all duration-300`}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col">
              <div className="aspect-square rounded-xl mb-5 overflow-hidden bg-gray-100">
                <img 
                  src={product.imageUrl || "https://via.placeholder.com/400"} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 capitalize">{product.name}</h2>
              <p className="text-gray-500 mt-2 text-sm line-clamp-2 flex-grow">{product.description}</p>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-gray-900">${product.price}</span>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm ${
                    product.stock > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Comprar' : 'Agotado'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Aún no hay productos en el catálogo.</p>
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: EL CARRITO DE COMPRAS (Solo aparece si hay productos) */}
      {cart.length > 0 && (
        <div className="w-full lg:w-96 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit sticky top-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            🛒 Tu Carrito
          </h2>
          
          <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex gap-3 items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-gray-500 text-xs">${item.price} x {item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                  title="Eliminar"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-semibold">Total a pagar:</span>
              <span className="text-3xl font-black text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-green-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
              Proceder al Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}