# Generated by Django 2.1.5 on 2019-06-08 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0002_auto_20190608_1053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deliverymethod',
            name='type',
            field=models.CharField(choices=[('price', 'Price based delivery')], max_length=30),
        ),
    ]
