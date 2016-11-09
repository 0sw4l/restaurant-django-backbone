from django.conf.urls import url, include
from .views import IndexView, log_out
from rest_framework import routers
from .viewsets import RestaurantViewSet, CategoryViewSet, PaymentViewSet, CityViewSet


router = routers.DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'categorias', CategoryViewSet)
router.register(r'pagos', PaymentViewSet)
router.register(r'ciudades', CityViewSet)

urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^salir/', log_out, name='salir'),

    url(r'^api/', include(router.urls)),
]
