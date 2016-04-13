# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-11 17:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('caption_maker', '0007_captionlabel_favoritemedia'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='captionlabel',
            options={'ordering': ['label', 'order']},
        ),
        migrations.AddField(
            model_name='caption',
            name='caption_label',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='caption_maker.CaptionLabel'),
        ),
    ]
