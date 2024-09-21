// app/api/addEscrowFactory/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const body = await request.json();
  const { organization_address, escrow_factory } = body;

  if (!organization_address || !escrow_factory) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      "http://34.84.200.57:8000/api/escrow/addEscrowFactory",
      {
        organization_address,
        escrow_factory,
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error adding escrow factory:', error);
    return NextResponse.json({ error: 'Error adding escrow factory' }, { status: 500 });
  }
}