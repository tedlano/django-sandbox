from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Fieldset, ButtonHolder, Submit, Button, HTML
from crispy_forms.bootstrap import FormActions, StrictButton, InlineField

import re

class LoginForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ["username", "password"]
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not username or not re.search(r'^\w+$', username):
            raise forms.ValidationError(
                'Please enter a valid username')
        else:
            return username

    def clean_password(self):
        password = self.cleaned_data['password']
        if not password:
            raise forms.ValidationError(
                'Please enter a valid password')
        else:
            return password
    
class RegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    password2 = forms.CharField(widget=forms.PasswordInput(), label='Verify Password')

    helper = FormHelper()
    helper.form_tag = True
    
    helper.layout = Layout(
        # InlineField('username', placeholder='Enter username (eg: Teddy_Boo_Boo)'),
        # InlineField('email', placeholder='Enter email (eg: MessySpaghetti@gmail.com)'),
        # InlineField('first_name', placeholder='First Name'),
        # InlineField('last_name', placeholder='Last Name'),
        # InlineField('password', placeholder='Create password'),
        # InlineField('password2', placeholder='Verify password'),
        'username',
        'password', 
        'password2',
        HTML("""
            <br/><p>The rest of the fields are optional, and currently are not used for anything in particular.</p>
        """),
        'email',
        'first_name',
        'last_name',
        ButtonHolder(
            Submit('submit', 'Submit')
        )
    )

    class Meta:
        model = User
        fields = [ "username",  "password", "password2", "email", "first_name", "last_name"]
    
    
    def clean_username(self):
        cleaned_data = super(RegistrationForm, self).clean()
        username = cleaned_data.get('username')
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError(
                  'Username can contain only alphanumeric characters')
        try:
            User.objects.get(username=username)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('Username is already taken')
    
    
    def clean(self):
        cleaned_data = super(RegistrationForm, self).clean()
        print(cleaned_data)
        password_clean = cleaned_data.get('password')
        password2_clean = cleaned_data.get('password2')
        
        if not password_clean or not password2_clean:
            self.add_error('password', "Please enter a password!")
        
        elif password_clean != password2_clean:
            self.add_error('password2', "Passwords do not match!")
        
        return self.cleaned_data
        
    
