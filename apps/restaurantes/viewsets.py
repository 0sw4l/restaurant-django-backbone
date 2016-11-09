from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import viewsets
from .models import Restaurant, Category, City, Tip, Payment, Establishment
from .serializers import RestaurantSerializer, CategorySerializer, CitySerializer, TipSerializer, PaymentSerializer


class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @detail_route(methods=['get'])
    def restaurants(self, request, pk=None):
        restaurants = Restaurant.objects.filter(category_id=pk)
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

    @detail_route(methods=['get'])
    def restaurants(self, request, pk=None):
        establishments = Establishment.objects.filter(city_id=pk).distinct('restaurant__name')
        restaurants = [establishment.restaurant for establishment in establishments]
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)


class TipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tip.objects.all()
    serializer_class = TipSerializer


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    @detail_route(methods=['get'])
    def restaurants(self, request, pk=None):
        restaurants = Restaurant.objects.filter(payment_id=pk)
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

