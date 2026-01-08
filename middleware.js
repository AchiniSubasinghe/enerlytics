import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { canAccessRoute, ROLES } from "./src/lib/rbac";

export function middleware(request) {
    const url = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user can access the route
        if (canAccessRoute(user.role, url)) {
            return NextResponse.next();
        }

        // Redirect to appropriate dashboard based on role
        const dashboardMap = {
            [ROLES.ADMIN]: "/dashboard/admin",
            [ROLES.ADMIN_STAFF]: "/dashboard/admin-staff",
            [ROLES.METER_READER]: "/dashboard/meter-reader",
            [ROLES.CASHIER]: "/dashboard/billing",
            [ROLES.MANAGER]: "/dashboard/manager",
            [ROLES.CUSTOMER]: "/dashboard/customer",
        };

        const dashboard = dashboardMap[user.role];
        if (dashboard) {
            return NextResponse.redirect(new URL(dashboard, request.url));
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
        "/dashboard/billing/:path*",
        "/dashboard/meter-reader/:path*",
        "/dashboard/customer/:path*",
    ],
};

