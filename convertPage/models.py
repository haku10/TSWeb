from django.db import models

# Create your models here.
class User(models.Model):
  id = models.AutoField(primary_key=True)
  full_name = models.TextField(max_length=100)
  email = models.TextField(max_length=100)

  def __str__(self):
    return self.full_name
