Django execute code
===============
This is a project that is used to execute python codes in the web page.
You can install and use it in django projects,
You can do any operations that can be performed in python shell with this package.
  

Installation
============

#. Install django-execute-code using ``pip``:

    pip install django-execute-code

Configuration
=============


#. settings.py:

    INSTALLED_APPS = [
            ...
            'django_execute_code',
        ]
    

#. <settings_folder>/urls.py:

    urlpatterns += [
        url('debug/', include('django_execute_code.urls')),
    ]
      

Usage
==============================================
go to your django site after installing and configuring this package,
then login as super user and go to this url `http://<your_site_url>/debug/execute-python/`

Contributing
=====
If you think you've found a bug or are interested in contributing to this project check out `django-exec-code on Github. <https://github.com/shinunandakumar/django_execute_code>`_.
Author `Linkdin. <https://www.linkedin.com/in/shinu-n-508849168/>`_