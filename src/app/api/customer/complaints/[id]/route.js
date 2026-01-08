import { db } from "@/lib/db";

export async function DELETE(req, context) {
    const { id } = await context.params;

    try {
        const [result] = await db.query(
            "DELETE FROM complaints WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return Response.json(
                { error: "Complaint not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Complaint deleted permanently",
        });
    } catch (error) {
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const [rows] = await db.query(
            "SELECT * FROM complaints WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return Response.json(
                { error: "Complaint not found" },
                { status: 404 }
            );
        }
        return Response.json(rows[0]);

    }

    catch (error) {
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}

export async function PUT(req, context) {
    const { id } = await context.params;;
    const { user_id, complaint_text } = await req.json();

    try {

        const [result] = await db.query(
            "UPDATE complaints SET user_id=?, complaint_text=? WHERE id=?",
            [user_id, complaint_text, id]
        );

        if (result.affectedRows === 0) {
            return Response.json({ error: "Complaint not found" }, { status: 404 });
        }

        return Response.json({ message: "Complaint updated successfully" });

    }

    catch (error) {
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
