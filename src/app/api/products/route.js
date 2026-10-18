import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    // 1. ESTO ES LO QUE FALTABA: Asegurar la conexión antes de cualquier acción
    await dbConnect();

    // 2. Leer los datos que vienen del botón
    const body = await request.json();

    // 3. Crear y guardar el nuevo documento en MongoDB
    const newProduct = await Product.create(body);

    // 4. Retornar la respuesta de éxito
    return NextResponse.json(newProduct, { status: 201 });
    
  } catch (error) {
    console.error('Error en el servidor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}