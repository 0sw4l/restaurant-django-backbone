from django.contrib import admin
from .models import Category, City, Payment, Restaurant,  Establishment, Tip
# Register your models here.

admin.site.register(Category)
admin.site.register(City)
admin.site.register(Payment)
admin.site.register(Restaurant)
admin.site.register(Establishment)
admin.site.register(Tip)