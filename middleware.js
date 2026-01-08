import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ROLE_ROUTES = {
    ADMIN: ["/dashboard/admin"],
    MANAGER: ["/dashboard/manager"],
    ADMIN_STAFF: ["/dashboard/admin-staff"],
    CASHIER: ["/dashboard/cashier"],
    METER_READER: ["/dashboard/meter-reader"],
};

export function middleware(request) {
    const url = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = decoded.role;

        if (role === "ADMIN") {
            return NextResponse.next();
        }

        for (const [roleKey, routes] of Object.entries(ROLE_ROUTES)) {
            if (role === roleKey && routes.some((route) => url.startsWith(route))) {
                return NextResponse.next();
            }
        }

        return NextResponse.redirect(new URL("/login", request.url));
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        "/dashboard/admin/:path*",
        "/dashboard/manager/:path*",
        "/dashboard/admin-staff/:path*",
        "/dashboard/cashier/:path*",
        "/dashboard/meter-reader/:path*",
    ],
};

