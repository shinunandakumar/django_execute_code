from setuptools import setup, find_packages

classifiers = [
  'Development Status :: 5 - Production/Stable',
  'License :: OSI Approved :: MIT License',
  "Environment :: Web Environment",
  "Framework :: Django",
  "Framework :: Django :: 2.0",
  "Framework :: Django :: 2.1",
  "Framework :: Django :: 2.1",
  "Intended Audience :: Developers",
  "Operating System :: OS Independent",
  "Programming Language :: Python",
  "Programming Language :: Python",
  "Programming Language :: Python :: 3",
  "Programming Language :: Python :: 3 :: Only",
  "Programming Language :: Python :: 3.6",
  "Programming Language :: Python :: 3.7",
  "Programming Language :: Python :: 3.8",
  "Topic :: Software Development :: Libraries :: Python Modules",
]
 
setup(
  name='django-execute-code',
  version='0.3',
  description='django execute code for Django 2.*',
  long_description=open('README.rst').read(),
  long_description_content_type='text/markdown',
  url='https://github.com/shinunandakumar/django_execute_code',  
  author='Shinu',
  author_email='shinunandakumar@gmail.com',
  license='MIT', 
  classifiers=classifiers,
  include_package_data=True,
  keywords='django execute code', 
  packages=find_packages(),
  python_requires=">=3.6",
  install_requires=[''] 
)