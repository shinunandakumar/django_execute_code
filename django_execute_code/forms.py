from django.utils.translation import gettext_lazy as _
from django import forms
class ExecuteForm(forms.Form):

    def __init__(self, *args, **kwargs):

        super().__init__( *args, **kwargs)

        self.fields['code'] = forms.CharField(
            widget=forms.Textarea(attrs={
                'rows': '10',
                'cols': '100',
                'class': 'Playground-input js-playgroundCodeEl',
                'maxlength': '10000',
                'style':'width: 97%;',
                'id':'code',
                'autocorrect':'off',
                'autocomplete':'off',
                'autocapitalize':'off', 'spellcheck':'false',
                'aria-label':'Try Code'
            }),
            label=_('Enter Your Python Code Here'),required=True,
            initial='# You can execute your python code here \nprint("Hello world!")'
        )
        self.buttons =[
            {
                'type':"submit",'label':_("Run"),'name': 'save','class':"Button Button--primary js-playgroundRunEl Playground-runButton",
            },{
                'type':"button",'label':_("Copy"),'name': 'copy','class':"Button Button--link copy-code color-black"
            }
        ]

    class Media:
        _min = '' # for future
        js = (f'django_execute_code/js/jquery{_min}.js',f'django_execute_code/js/codestyle{_min}.js')
        css = {
            'all':(f'django_execute_code/css/styles{_min}.css',)
        }

    def clean(self,*args,**kwargs):

        cleaned_data = super().clean(*args,**kwargs)
        if cleaned_data.get('code') and ('rm -rf' in cleaned_data['code'] or 'import os' in cleaned_data['code']):
            raise forms.ValidationError("Oops invalid inputs")
