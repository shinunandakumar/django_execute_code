from django.contrib.auth.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.template.loader import render_to_string
from django_execute_code.forms import ExecuteForm
from django.views.generic import View
from django.http import HttpResponse
import sys,io


class ExecutePythonCodeAbstract(View):

	def dispatch(self, request, *args, **kwargs):
		self.template = 'django_execute_code/run_code.tpl.html'
		self.pre_template = 'django_execute_code/pre_output.html'
		self.context = {
			'label' : _("Execute Python Code"),
			'inner_label' : _("Execute Python Code"),
			'show_warning' : True,
			'pre_template' : self.pre_template,
			'is_popup' : request.user.is_anonymous

		}
		return super().dispatch(request,*args,**kwargs)


	def get(self, request, *args, **kwargs):
    			
		_form = ExecuteForm(initial={})
		self.context.update({
			'form' : _form,
		})
		return TemplateResponse(
			request,self.template,self.context
		)

	def post(self, request, *args, **kwargs):

		_form_data = ExecuteForm(request.POST or None)
		__output, __error = None, None

		if _form_data.is_valid():
			code = _form_data.cleaned_data.get('code')
			try:
				new_stdout = io.StringIO()
				sys.stdout = new_stdout
				__code = f"""{code}"""
				exec(__code)
				__output = new_stdout.getvalue()
			except Exception as _e:
				__error = _e
		else:
			__error = "oops this operation is not allowed"

		_form_data.exec_val = __output
		_form_data.exec_error = __error
		self.context.update({
			'form' : _form_data,
		})
		if request.is_ajax():
			rendered = render_to_string( self.pre_template, self.context , request)
			return HttpResponse(
				rendered
			)
		else:
			return TemplateResponse(
				request,self.template,self.context
			)

@method_decorator(user_passes_test( lambda u: u.is_superuser), name='dispatch')
class ExecutePythonCode(ExecutePythonCodeAbstract):
	pass


