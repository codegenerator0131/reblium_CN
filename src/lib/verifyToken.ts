import { NextRequest } from "next/server";

const TMO_BASE_URL = process.env.NEXT_PUBLIC_TMO_API_URL || 'https://reblium.alpha.tmogroup.asia';

export interface TMOCustomerInfo {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

// Verify TMO token by calling the TMO API
async function verifyTMOToken(token: string): Promise<TMOCustomerInfo | null> {
  try {
    const response = await fetch(`${TMO_BASE_URL}/rest/V1/customers/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const customer = await response.json();
    return {
      id: customer.id,
      email: customer.email,
      firstname: customer.firstname,
      lastname: customer.lastname,
    };
  } catch (error) {
    console.error('TMO token verification error:', error);
    return null;
  }
}

// Main token verification function
// Returns TMO customer ID if valid
export async function verifyToken(req: NextRequest): Promise<number | null> {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  const tmoCustomer = await verifyTMOToken(token);
  return tmoCustomer ? tmoCustomer.id : null;
}

// Get full TMO customer info (for routes that need more than just ID)
export async function verifyTokenAndGetCustomer(req: NextRequest): Promise<TMOCustomerInfo | null> {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  return await verifyTMOToken(token);
}
