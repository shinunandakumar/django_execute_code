from django.utils.translation import gettext_lazy as _
from django import forms
class ExecuteForm(forms.Form):

    def __init__(self, *args, **kwargs):

        super().__init__( *args, **kwargs)

        self.fields['code'] = forms.CharField(
            widget=forms.Textarea(attrs={
                'rows': '10',
                'cols': '100',
                'class': 'form-control bg-dark text-white',
                'maxlength': '10000',
            }),
            label=_('Enter Your Python Code Here'),required=True
        )
        self.buttons =[
            {
                'type':"submit",'label':_("Run"),'name': 'save','class':"btn"
            }
        ]

    class Media:
        js = ('django_execute_code/js/script.min.js',)
        css = {
            'all':('django_execute_code/css/style.min.css',)
        }

    def clean(self,*args,**kwargs):

        cleaned_data = super().clean(*args,**kwargs)
        if cleaned_data.get('code') and ('rm -rf' in cleaned_data['code'] or 'import os' in cleaned_data['code']):
            raise forms.ValidationError("OS operations are not permitted")