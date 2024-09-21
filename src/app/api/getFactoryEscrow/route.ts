// app/api/getFactoryEscrow/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `http://34.84.200.57:8000/api/escrow/getFactoryEscrow/${address}`
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching factory escrow:', error);
    return NextResponse.json({ error: 'Error fetching factory escrow' }, { status: 500 });
  }
}