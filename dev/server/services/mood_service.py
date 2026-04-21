from datetime import datetime
from database.db import get_db_connection


def log_mood(user_id, mood, intensity):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO moods (user_id, mood, intensity, date)
        VALUES (%s, %s, %s, %s)
    """, (user_id, mood, intensity, datetime.utcnow()))

    conn.commit()
    cursor.close()
    conn.close()


def get_mood_summary(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT mood, COUNT(*) as frequency
        FROM moods
        WHERE user_id = %s
        GROUP BY mood
    """, (user_id,))

    summary = cursor.fetchall()
    cursor.close()
    conn.close()

    return summary


def get_mood_trends(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT date, mood, intensity
        FROM moods
        WHERE user_id = %s
        ORDER BY date ASC
    """, (user_id,))

    trends = cursor.fetchall()
    cursor.close()
    conn.close()

    return trends