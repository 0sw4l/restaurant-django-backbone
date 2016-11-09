from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib.auth import logout
from .models import Category, City, Payment, Restaurant,  Establishment, Tip

# Create your views here.

class IndexView(TemplateView):
	template_name = 'index.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context['categories'] = Category.objects.all()
		context['payments'] = Payment.objects.all()
		context['cities'] = City.objects.all()
		restaurants = Restaurant.objects.all()[:5]
		tips = [restaunt.tip_set.all().count() for restaunt in restaurants]
		context['restaurants'] = zip(restaurants, tips)
		return context

def log_out(request):
	logout(request)
	return redirect('index')