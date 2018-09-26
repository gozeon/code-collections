from django.db import models


class Language(models.Model):
    name = models.CharField(max_length=50)
    paradigm = models.CharField(max_length=50)
    is_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def delete(self, using=None, keep_parents=False):
        self.is_delete = True
        self.save()


class People(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='语言')
