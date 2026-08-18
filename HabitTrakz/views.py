from django.shortcuts import render, redirect
from .models import Habit, HabitLog
from .forms import HabitForm
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from .serializers import HabitSerializer, HabitLogSerializer, UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
@login_required
def home(request):
    habits = Habit.objects.filter(owner=request.user)
    return render(request, 'HabitTrakz/habit_list.html', {'habits': habits})



def add_habit(request):
    if request.method == 'POST':
        form = HabitForm(request.POST)
        if form.is_valid():
            habit = form.save(commit=False)
            habit.owner = request.user
            form.save()
            return redirect('home')
    else:
        form = HabitForm()

    return render(request, 'HabitTrakz/habit_form.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            error_message = "Invalid username or password."
            return render(request, 'HabitTrakz/login.html', {'error_message': error_message})
    else:
        return render(request, 'HabitTrakz/login.html')



def logout_view(request):
    logout(request)
    return redirect('home')



class HabitListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class HabitLogListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        return HabitLog.objects.filter(habit__owner=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save()


class HabitLogDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HabitLog.objects.filter(habit__owner=self.request.user) 




class RegisterAPIView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = []

class HabitDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(owner=self.request.user)