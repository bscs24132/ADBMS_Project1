from django.db import connection
import requests
from django.conf import settings

def get_user_info(user_id):
    """Fetch user info from Person A's user API or direct DB query"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, username, profile_picture, role
            FROM users
            WHERE id = %s
        """, [user_id])
        row = cursor.fetchone()
        
        if row:
            return {
                'id': row[0],
                'username': row[1],
                'profile_picture': row[2],
                'role': row[3]
            }
    return None

def get_users_info(user_ids):
    """Fetch multiple users info"""
    if not user_ids:
        return {}
    
    placeholders = ','.join(['%s'] * len(user_ids))
    with connection.cursor() as cursor:
        cursor.execute(f"""
            SELECT id, username, profile_picture, role
            FROM users
            WHERE id IN ({placeholders})
        """, user_ids)
        
        result = {}
        for row in cursor.fetchall():
            result[row[0]] = {
                'id': row[0],
                'username': row[1],
                'profile_picture': row[2],
                'role': row[3]
            }
        return result