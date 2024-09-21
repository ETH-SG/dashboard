import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const apiKey = 'b093adce-69ab-4ab9-9502-149a1a9fa86b';
  const url = `https://namestone.xyz/api/public_v1/get-names?address=${address}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': apiKey
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching names:', error);
    return NextResponse.json({ error: 'Failed to fetch names' }, { status: 500 });
  }
}