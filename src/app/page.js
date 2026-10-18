'use client' // this directive tells Next.js this is a client component (allows interactivity like clicks)

'use client'; // This directive tells Next.js this is a Client Component (allows interactivity like clicks)

export default function Home() {
  
  // This function executes when the button is clicked
  const createTestProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Catálogo Digital Pro',
          description: 'Licencia anual para plataforma de ventas.',
          price: 299,
          imageUrl: 'https://ejemplo.com/imagen.jpg',
          storeId: 'negocio_123', // Testing our SaaS multi-tenant architecture
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Producto guardado en MongoDB con éxito! Revisa tu consola.');
        console.log('Database response:', data);
      } else {
        alert('Error al guardar: ' + data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        CataLink is running! 
      </h1>
      
      <button 
        onClick={createTestProduct}
        className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
      >
        Send Test Product to MongoDB
      </button>
    </main>
  );
}