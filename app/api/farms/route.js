import { getCurrentUser } from "@/lib/getCurrentUser";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

function formatFarmCode(number) {
  return `FARM-${number.toString().padStart(3, "0")}`;
}


export async function POST(req) {
  try {
    const user = await getCurrentUser(req);
    
    if(!user ){
        return NextResponse.json(
            {error:"Unauthorized"},
            { status: 401 }
        )
    }
    const { name, gps, location } = await req.json();

    if (!name || !gps || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    
    const count = await db.farm.count();
    const code = formatFarmCode(count + 1);

    
    const farm = await db.farm.create({
      data: {
        name,
        gps,
        location,
        code,
        users: {
          create: {
            user_id: user.user_id,
            role: "admin",
          },
        },
      },
      include: { users: { include: { user: true } } },
    });

    return NextResponse.json(farm, { status: 201 });
  } catch (error) {
    console.error("Failed to register the farm", error);
    return NextResponse.json(
      { error: "Failed to register farm" },
      { status: 500 }
    );
  }
};

export async function GET(req) {
  try {
    const user = await getCurrentUser(req);

  if(!user){
    return NextResponse.json(
      {error:'unauthorized'},
      {status:401}
    )
  }
   const farms = await db.farm.findMany({
      where: {
        users: {
          some: {
            user_id: user.user_id,
          },
        },
      },
      include: {
        users: {
          where: { user_id: user.user_id },
          select: { role: true },
        },
      },
    });

    
    const formatted = farms.map(farm => ({
      id: farm.id,
      code: farm.code,
      name: farm.name,
      location: farm.location,
      gps: farm.gps,
      createdAt: farm.createdAt,
      role: farm.users[0]?.role || "unknown",
    }));

    return NextResponse.json(formatted, { status: 200 });

    
  } catch (error) {
    console.error("Failed to fetch farms", error);
    return NextResponse.json(
      { error: "Failed to fetch farms" },
      { status: 500 }
    );
    
  }
  
}

