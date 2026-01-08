// Role-Based Access Control (RBAC)

export const ROLES = {
    ADMIN: "ADMIN",
    ADMIN_STAFF: "ADMIN_STAFF",
    METER_READER: "METER_READER",
    CASHIER: "CASHIER",
    MANAGER: "MANAGER",
    CUSTOMER: "CUSTOMER",
};

// Define permissions for each role
export const PERMISSIONS = {
    // Admin - Full system access
    [ROLES.ADMIN]: {
        users: ["create", "read", "update", "delete"],
        all: true, // Full access to everything
    },

    // Administrative Staff - Customer management, tariffs, complaints
    [ROLES.ADMIN_STAFF]: {
        customers: ["create", "read", "update", "delete"],
        meters: ["create", "read", "update", "assign"],
        tariffs: ["create", "read", "update"],
        meterReaders: ["read", "assign"],
        complaints: ["read", "update"],
    },

    // Meter Readers - Enter readings only
    [ROLES.METER_READER]: {
        readings: ["create", "read"],
        meters: ["read"], // Only assigned meters
    },

    // Cashiers / Billing Clerks - Bills and payments
    [ROLES.CASHIER]: {
        bills: ["create", "read", "update"],
        payments: ["create", "read"],
        customers: ["read"], // View customer info for billing
    },

    // Managers - Reports and analytics (read-only)
    [ROLES.MANAGER]: {
        reports: ["read"],
        customers: ["read"],
        meters: ["read"],
        bills: ["read"],
        payments: ["read"],
        analytics: ["read"],
    },

    // Customers - View own data, pay bills, submit complaints
    [ROLES.CUSTOMER]: {
        bills: ["read"],
        payments: ["create", "read"],
        complaints: ["create", "read"],
        meters: ["read"], // Own meters only
        profile: ["read", "update"],
    },
};

// Check if a role has a specific permission
export function hasPermission(role, resource, action) {
    if (!role || !resource || !action) return false;

    const rolePermissions = PERMISSIONS[role];
    if (!rolePermissions) return false;

    // Admin has full access
    if (rolePermissions.all) return true;

    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(action);
}

// Check if user can access a route
export function canAccessRoute(role, path) {
    if (!role || !path) return false;

    // Admin can access everything
    if (role === ROLES.ADMIN) return true;

    // Map routes to roles
    if (path.startsWith("/dashboard/admin-staff") && role === ROLES.ADMIN_STAFF) return true;
    if (path.startsWith("/dashboard/meter-reader") && role === ROLES.METER_READER) return true;
    if (path.startsWith("/dashboard/billing") && role === ROLES.CASHIER) return true;
    if (path.startsWith("/dashboard/manager") && role === ROLES.MANAGER) return true;
    if (path.startsWith("/dashboard/customer") && role === ROLES.CUSTOMER) return true;
    if (path.startsWith("/dashboard/admin") && role === ROLES.ADMIN) return true;

    return false;
}

// Middleware helper to require specific role(s)
export function requireRole(allowedRoles) {
    return (user) => {
        if (!user || !user.role) return false;
        return allowedRoles.includes(user.role);
    };
}
