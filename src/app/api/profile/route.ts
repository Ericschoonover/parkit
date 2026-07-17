import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, role } = body;

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(role && { role }),
      },
    });

    return Response.json({ user });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
