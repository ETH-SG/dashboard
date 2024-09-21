import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { name, userWalletAddress } = await request.json();
  const apiKey = 'b093adce-69ab-4ab9-9502-149a1a9fa86b';
  const url = 'https://namestone.xyz/api/public_v1/claim-name';

  const data = {
    domain: 'reversifi.eth',
    name: name,
    address: userWalletAddress,
    text_records: {
      'com.twitter': 'namestonehq',
      'com.github': 'aslobodnik',
      'com.discord': 'superslobo',
      'url': 'https://www.namestone.xyz',
      'location': '📍 nyc',
      'description': 'APIs are cool',
      'avatar': 'https://raw.githubusercontent.com/aslobodnik/profile/main/pic.jpeg'
    }
  };

  const config = {
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post(url, data, config);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error claiming name:', error);
    return NextResponse.json({ error: 'Failed to claim name' }, { status: 500 });
  }
}