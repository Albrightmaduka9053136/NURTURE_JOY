from database.db import get_db_connection


def calculate_platform_usage():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total_users FROM users")
    users = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as total_conversations FROM conversations")
    conversations = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) as total_journals FROM journals")
    journals = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "users": users["total_users"],
        "conversations": conversations["total_conversations"],
        "journals": journals["total_journals"]
    }