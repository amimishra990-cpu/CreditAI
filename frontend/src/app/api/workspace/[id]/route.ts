import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/workspace/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to connect to backend" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/workspace/${params.id}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to connect to backend" },
            { status: 500 }
        );
    }
}
