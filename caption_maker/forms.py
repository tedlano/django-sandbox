from django import forms
from django.contrib.auth.models import User

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Fieldset, ButtonHolder, Submit, Button
from crispy_forms.bootstrap import TabHolder, Tab, FormActions, StrictButton, InlineField

import re

class LoginForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    
    class Meta:
        model = User
        fields = ["username", "password"]
    
    helper = FormHelper()
    helper.form_class = 'navbar-form navbar-left'
    helper.form_method = 'POST'
    helper.layout = Layout(
        InlineField('email', placeholder='Username'),
        InlineField('password', placeholder='Password'),
        StrictButton('Login', css_class='btn btn-primary navbar-sm'),
    )


# http://stackoverflow.com/questions/32416538/submit-button-not-working-in-the-modal-registration-form-in-djangof
class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput(), label="Verify Password")

    helper = FormHelper()
    helper.form_tag = False
    
    # helper.layout = Layout(
    #     TabHolder(
    #         Tab(
    #             'Login',
    #             'username',
    #             'password'
    #         ),
    #         Tab(
    #             'Create Account',
    #             'username',
    #             'email',
    #             'first_name',
    #             'last_name',
    #             'password',
    #             'password2'
    #         )
    #     ),
    #     ButtonHolder(
    #         Submit('close', 'Close'),
    #         Button('submit', 'Submit')
    #     )
    # )
    # username = forms.RegexField(label="Username", max_length=30,
    #      regex=r'^[\w.@+-]+$', 
    #      error_messages = {'invalid':
    #       "This value may contain only letters, numbers and @/./+/-/_ characters."
    #      }
    # )
    # password = forms.CharField(label="Password",
    #                           widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username",  "email", "password"]
    
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError(
                  'Username can contain only alphanumeric characters')
        try:
            User.objects.get(username=username)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('Username is already taken')
    
    
    def clean(self):
        if self.cleaned_data['password'] != self.cleaned_data['password2']:
            raise forms.ValidationError("The passwords did not match.  Please try again.")
        return self.cleaned_data
