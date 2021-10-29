from torchvision import models
from torchvision import transforms
from PIL import Image
from django.conf import settings

import torch
import sys
import time

MODEL_PATH = settings.PROJECT_PATH+"/resnet18-f37072fd.pth"
CLASSDEF_PATH = settings.PROJECT_PATH+"/imagenet_classes.txt"

def infer(file):
	# end = time.time()
	model = models.resnet18(pretrained=False)
	model.load_state_dict(torch.load(MODEL_PATH))
	model.eval()

	preTransform = transforms.Compose([
		transforms.Resize(256),
		transforms.CenterCrop(224),
		transforms.ToTensor(),
		transforms.Normalize(
			mean=[0.485, 0.456, 0.406],
			std=[0.229, 0.224, 0.225]
		)
	])
	# print("Loaded model...")

	# start = time.time()
	img = Image.open(file).convert('RGB')
	# start = time.time() - start
	# print(start)

	img_t = preTransform(img)
	batch_t = torch.unsqueeze(img_t, 0)

	out = model(batch_t)
	_, indices = torch.sort(out, descending=True)
	percentage = torch.nn.functional.softmax(out, dim=1)[0] * 100
	
	with open(CLASSDEF_PATH) as f:
		labels = [line.strip() for line in f.readlines()]
	# print("Completed Inference...")

	responseDict = []
	for idx in indices[0][:5]:
		responseDict.append([labels[idx],percentage[idx].item()])
	# end = time.time() - end
	# print(end)
	return responseDict