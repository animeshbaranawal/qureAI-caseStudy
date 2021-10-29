from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .forms import UploadFileForm

import time
from .infer import infer

def handle_uploaded_file(f, name):
	fPath = settings.MEDIA_ROOT+"/"+name
	with open(fPath, 'wb+') as destination:
		for chunk in f.chunks():
			destination.write(chunk)
	return fPath

# Create your views here.
@csrf_exempt
def upload_file(request):
	start = time.time()
	if request.method == 'POST':
		form = UploadFileForm(request.POST, request.FILES)
		if form.is_valid():
			requestID = form.cleaned_data['requestID']
			imageFile = request.FILES['file']
			imagePath = handle_uploaded_file(imageFile, requestID)
			start = time.time() - start
			print(start)
			return JsonResponse({'status':'success'})
	
	# form / request error
	return JsonResponse({'status':'failure'})


def get_inference(request, requestID):
	# start = time.time()
	if request.method == "GET":
		# print(requestID)
		imagePath = settings.MEDIA_ROOT+"/"+str(requestID)
		# perform backend inference using deep learning
		inference = {'inference':infer(imagePath)}
		# start = time.time() - start
		# print(start)
		return JsonResponse(inference)
	else:
		# request error
		return JsonResponse({"status":"error"});
