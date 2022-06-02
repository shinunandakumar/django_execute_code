from django.contrib.auth.decorators import user_passes_test
from django.utils.translation import gettext_lazy as _
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django_execute_code.forms import ExecuteForm
from django.views.generic import View
from django.contrib import messages
import sys,io


@method_decorator(user_passes_test( lambda u: u.is_superuser), name='dispatch')
class ExecutePythonCode(View):

	template = 'django_execute_code/run_code.tpl.html'
	context = {
		'label' : _("Execute Python Code"),
		'inner_label' : _("Execute Python Code"),

	}
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
				messages.success(request,_("Executed Code Successfully."))
			except Exception as _e:
				messages.error(request,_("Some Error Occured"))
				__error = _e
		else:
			messages.error(request,"Oops invalid inputs")


		_form_data.exec_val = __output
		_form_data.exec_error = __error
		self.context.update({
			'form' : _form_data,
		})
		return TemplateResponse(
			request,self.template,self.context
		)


