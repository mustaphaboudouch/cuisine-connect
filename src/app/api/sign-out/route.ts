import { NextResponse } from "next/server";

import { deleteJWT } from "@/lib/auth";

export function POST() {
  deleteJWT();
  return NextResponse.json(null, { status: 200 });
}
