import { login } from '@/entitys/session';
import { NextRequest, NextResponse } from 'next/server';


export async function POST (req: NextRequest) {
    const { email, password } = await req.json();

    const res = await login({ email, password })

    return NextResponse.json(res, { status: 201 });
}