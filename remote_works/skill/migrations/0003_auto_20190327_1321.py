# Generated by Django 2.1.5 on 2019-03-27 11:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('skill', '0002_auto_20190327_1217'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='skill',
            name='weight',
        ),
        migrations.AddField(
            model_name='skill',
            name='experience_years',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
        
    ]
