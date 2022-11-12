from django.urls import path
from django.conf import settings
from django_execute_code.views import ExecutePythonCode
'''
    Works only in debug mode 
'''
if settings.DEBUG:
    urlpatterns = [
        path('execute-python/', ExecutePythonCode.as_view(), name='execute_python'),
    ]
