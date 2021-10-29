from django.urls import path

from . import views

urlpatterns = [
	path('upload/', views.upload_file, name='upload file'),
	path('infer/<int:requestID>', views.get_inference, name='get image inference'),
]