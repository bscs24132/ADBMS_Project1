from django.urls import path
from .views import NotebookListView, NotebookDetailView, WriterNotebooksView, NotebookPostView

urlpatterns = [
    path('', NotebookListView.as_view(), name='notebook-list'),
    path('<int:notebook_id>/', NotebookDetailView.as_view(), name='notebook-detail'),
    path('writer/<int:user_id>/', WriterNotebooksView.as_view(), name='writer-notebooks'),
    path('<int:notebook_id>/posts/', NotebookPostView.as_view(), name='notebook-post-create'),
]