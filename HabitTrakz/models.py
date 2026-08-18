from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Habit(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE,null=True)


    def __str__(self):
        return self.name;


class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE)
    date = models.DateField()
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.habit.name} - {self.date} - {'Done' if self.is_done else 'Not Done'}"