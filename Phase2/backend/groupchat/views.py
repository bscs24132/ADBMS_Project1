from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db import connection
from django.db import transaction


class GroupChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        writer_id = request.GET.get('writer_id')

        with connection.cursor() as cursor:
            if writer_id:
                cursor.execute("""
                    SELECT g.id, g.name, g.created_by, g.writer_id, g.created_at,
                           (SELECT COUNT(*) FROM members WHERE group_id = g.id) as member_count
                    FROM groupchats g
                    WHERE g.writer_id = %s
                    ORDER BY g.created_at DESC
                """, [writer_id])
            else:
                cursor.execute("""
                    SELECT g.id, g.name, g.created_by, g.writer_id, g.created_at,
                           (SELECT COUNT(*) FROM members WHERE group_id = g.id) as member_count
                    FROM groupchats g
                    ORDER BY g.created_at DESC
                """)

            columns = [col[0] for col in cursor.description]
            groups = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(groups)


class CreateGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get('name')
        writer_id = request.data.get('writer_id')

        if not name:
            return Response(
                {'error': 'Group name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO groupchats (name, created_by, writer_id, created_at)
                        VALUES (%s, %s, %s, NOW())
                    """, [name, request.user.id, writer_id])

                    cursor.execute("SELECT LAST_INSERT_ID()")
                    group_id = cursor.fetchone()[0]

                    cursor.execute("""
                        INSERT INTO members (group_id, user_id, role, joined_at)
                        VALUES (%s, %s, 'admin', NOW())
                    """, [group_id, request.user.id])

                    cursor.execute("""
                        SELECT id, name, created_by, writer_id, created_at
                        FROM groupchats WHERE id = %s
                    """, [group_id])
                    group = cursor.fetchone()

                    return Response({
                        'id': group[0],
                        'name': group[1],
                        'created_by': group[2],
                        'writer_id': group[3],
                        'created_at': group[4],
                        'member_count': 1,
                        'user_role': 'admin',
                        'message': 'Group created successfully'
                    }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating group: {e}")
            return Response(
                {'error': f'Failed to create group: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WriterGroupsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, writer_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT g.id, g.name, g.created_by, u.username as created_by_username,
                       g.writer_id, g.created_at,
                       (SELECT COUNT(*) FROM members WHERE group_id = g.id) as member_count
                FROM groupchats g
                JOIN users u ON g.created_by = u.id
                WHERE g.writer_id = %s
                ORDER BY g.created_at DESC
            """, [writer_id])
            columns = [col[0] for col in cursor.description]
            groups = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(groups)


class AllGroupsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT g.id, g.name, g.created_by, u.username as created_by_username,
                       g.writer_id, g.created_at,
                       (SELECT COUNT(*) FROM members WHERE group_id = g.id) as member_count
                FROM groupchats g
                JOIN users u ON g.created_by = u.id
                ORDER BY g.created_at DESC
            """)
            columns = [col[0] for col in cursor.description]
            groups = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(groups)


class GroupDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, group_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT g.id, g.name, g.created_by, u.username as created_by_username,
                       g.writer_id, g.created_at,
                       (SELECT COUNT(*) FROM members WHERE group_id = g.id) as member_count
                FROM groupchats g
                JOIN users u ON g.created_by = u.id
                WHERE g.id = %s
            """, [group_id])
            row = cursor.fetchone()
            columns = [col[0] for col in cursor.description]

        if not row:
            return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(dict(zip(columns, row)))

    def delete(self, request, group_id):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, created_by FROM groupchats WHERE id = %s",
                [group_id]
            )
            group = cursor.fetchone()

            if not group:
                return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

            if group[1] != request.user.id:
                return Response(
                    {'error': 'Only the group creator can delete this group'},
                    status=status.HTTP_403_FORBIDDEN
                )

            cursor.execute("DELETE FROM groupchats WHERE id = %s", [group_id])

        return Response({'message': 'Group deleted successfully'}, status=status.HTTP_200_OK)


class MyGroupsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            # ── FIX: added member_count subquery so cards show correct count ──
            cursor.execute("""
                SELECT g.id, g.name, g.created_by, u.username as created_by_username,
                       g.writer_id, g.created_at, m.role,
                       (SELECT COUNT(*) FROM members WHERE group_id = g.id) as member_count
                FROM groupchats g
                JOIN members m ON g.id = m.group_id
                JOIN users u ON g.created_by = u.id
                WHERE m.user_id = %s
                ORDER BY g.created_at DESC
            """, [request.user.id])
            columns = [col[0] for col in cursor.description]
            groups = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(groups)


class JoinGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM groupchats WHERE id = %s", [group_id])
            if not cursor.fetchone():
                return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

            cursor.execute("""
                SELECT COUNT(*) FROM members
                WHERE user_id = %s AND group_id = %s
            """, [request.user.id, group_id])
            if cursor.fetchone()[0] > 0:
                return Response(
                    {'error': 'You are already a member of this group'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cursor.execute("""
                INSERT INTO members (group_id, user_id, role, joined_at)
                VALUES (%s, %s, 'member', NOW())
            """, [group_id, request.user.id])

        return Response({'message': 'Joined group successfully'}, status=status.HTTP_201_CREATED)


class RemoveMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, group_id, user_id):
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, created_by FROM groupchats WHERE id = %s",
                [group_id]
            )
            group = cursor.fetchone()

            if not group:
                return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

            group_creator_id = group[1]
            target_user_id = int(user_id)

            is_creator = request.user.id == group_creator_id
            is_self = request.user.id == target_user_id

            if not is_creator and not is_self:
                return Response(
                    {'error': 'You can only remove yourself or members if you are the group admin'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Group admin cannot leave — must delete the group instead
            if is_creator and target_user_id == group_creator_id:
                return Response(
                    {'error': 'Group admin cannot leave. Delete the group instead.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cursor.execute("""
                SELECT COUNT(*) FROM members
                WHERE user_id = %s AND group_id = %s
            """, [target_user_id, group_id])
            if cursor.fetchone()[0] == 0:
                return Response(
                    {'error': 'User is not a member of this group'},
                    status=status.HTTP_404_NOT_FOUND
                )

            cursor.execute("""
                DELETE FROM members WHERE user_id = %s AND group_id = %s
            """, [target_user_id, group_id])

        if is_self:
            return Response({'message': 'You have left the group'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Member removed successfully'}, status=status.HTTP_200_OK)


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        content = request.data.get('content')

        if not content or not content.strip():
            return Response(
                {'error': 'Message content is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM groupchats WHERE id = %s", [group_id])
            if not cursor.fetchone():
                return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

            cursor.execute("""
                SELECT COUNT(*) FROM members
                WHERE user_id = %s AND group_id = %s
            """, [request.user.id, group_id])
            if cursor.fetchone()[0] == 0:
                return Response(
                    {'error': 'You must be a member to send messages'},
                    status=status.HTTP_403_FORBIDDEN
                )

            cursor.execute("""
                INSERT INTO messages (group_id, sender_id, content, sent_at)
                VALUES (%s, %s, %s, NOW())
            """, [group_id, request.user.id, content])

            message_id = cursor.lastrowid

            cursor.execute("""
                SELECT m.id, m.group_id, m.sender_id, u.username as sender_username,
                       m.content, m.sent_at
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.id = %s
            """, [message_id])
            columns = [col[0] for col in cursor.description]
            message = dict(zip(columns, cursor.fetchone()))

        return Response(message, status=status.HTTP_201_CREATED)


class GroupMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        with connection.cursor() as cursor:
            # Verify membership before returning messages
            cursor.execute("""
                SELECT COUNT(*) FROM members
                WHERE user_id = %s AND group_id = %s
            """, [request.user.id, group_id])
            if cursor.fetchone()[0] == 0:
                return Response(
                    {'error': 'You must be a member to view messages'},
                    status=status.HTTP_403_FORBIDDEN
                )

            cursor.execute("""
                SELECT m.id, m.sender_id, u.username as sender_username,
                       u.profile_picture, m.content, m.sent_at
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.group_id = %s
                ORDER BY m.sent_at ASC
            """, [group_id])

            columns = [col[0] for col in cursor.description]
            messages = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(messages)


class DeleteMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, sender_id FROM messages WHERE id = %s",
                [message_id]
            )
            row = cursor.fetchone()

            if not row:
                return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

            if row[1] != request.user.id:
                return Response(
                    {'error': 'You can only delete your own messages'},
                    status=status.HTTP_403_FORBIDDEN
                )

            cursor.execute("DELETE FROM messages WHERE id = %s", [message_id])

        return Response({'message': 'Message deleted'}, status=status.HTTP_204_NO_CONTENT)


class GroupMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT m.user_id, u.username, u.profile_picture, m.role, m.joined_at
                FROM members m
                JOIN users u ON m.user_id = u.id
                WHERE m.group_id = %s
                ORDER BY m.role DESC, m.joined_at ASC
            """, [group_id])

            columns = [col[0] for col in cursor.description]
            members = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(members)


class LeaveGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT role FROM members
                WHERE group_id = %s AND user_id = %s
            """, [group_id, request.user.id])
            member = cursor.fetchone()

            if not member:
                return Response(
                    {'error': 'You are not a member of this group'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user_role = member[0]

            if user_role == 'admin':
                return Response(
                    {'error': 'Group admin cannot leave. Delete the group instead.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Regular member leaving
            cursor.execute("""
                DELETE FROM members
                WHERE group_id = %s AND user_id = %s
            """, [group_id, request.user.id])

        return Response({'message': 'Successfully left the group'})