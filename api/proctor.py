'''
This is the code for proctoring. 
There are three parts to this code, the first one imports all the required 
libraries and loads the models, the second one defines the functions 
required for face verification and eye tracking while the third part 
is the driver code that processes the video and runs the models on the frames.

Code developed by:
Piyush Maheshwari   Suyash Choudhary    Ishita Menon

'''

'''
First Part

Importing the libraries and defining the directories where necessary files are stored.

'''
import subprocess
import sys

# Function to install libraries not already installed
def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
  import mtcnn
except:
  install("mtcnn")
  import mtcnn

try:
    import numpy as np
except:
    install("numpy")
    import numpy

try:
    import cv2
except:
    install("cv2")
    import cv2

try:
    from matplotlib import pyplot as plt
except:
    install("matplotlib")
    from matplotlib import pyplot as plt

try:
    from keras.models import load_model
except:
    install("keras")
    from keras.models import load_model

try:
    from PIL import Image
except:
    install("pillow")
    from PIL import Image

try:
    import dlib
except:
    install("dlib")
    import dlib

from mtcnn.mtcnn import MTCNN
import os
import datetime


# For the webcam video that is stored on the server
VIDEO_PATH = "/content/drive/My Drive/facereco/eye_tracking/eye tracking.mov"

# For the suspicious images to be stored for further review
SUSPICIOUS_DIR = "/content/drive/My Drive/facereco/eye_tracking/suspicious"

# For loading shape_68.dat file
DLIB_PREDICTOR_PATH = "/content/drive/My Drive/facereco/eye_tracking/shape_68.dat"

# For loading pre-trained FaceNet model
FACENET_PATH = "/content/drive/My Drive/facereco/facenet_keras.h5"

# For fetching the image from records to run face verification
IMAGE_PATH = "/content/drive/My Drive/facereco/eye_tracking/youtuber.png"



'''
Second part

This part defines the various utility functions required for proctoring purposes.
All the functions are properly documented, making them self explanatory.

'''

# Verify a set of embeddings by comparing with a set of pre-computed embeddings
def verify(captured_encoding, stored_encoding, THRESHOLD=1.05):

  # Normalising the encodings to have the norm as 1
  captured_encoding = captured_encoding/np.linalg.norm(captured_encoding)
  stored_encoding = stored_encoding/np.linalg.norm(stored_encoding)

  dist = np.linalg.norm(captured_encoding-stored_encoding)
  if dist<THRESHOLD:
    verified = True
  else:
    verified = False

  return dist, verified


# Extract the face from any image
def extract_face(file, required_size=(160,160)):
	try:
		image = Image.open(file)
	except:
		return None

	image = image.convert('RGB')
	pixels = np.asarray(image)
	faces = detector.detect_faces(pixels)

	if len(faces)!=1:
		# The image is not appropriate since multiple or no faces are detected
		return None

	# Extracting the face according to the bounding boxes
	x1,y1,width,height = faces[0]['box']
	x1 = abs(x1)
	y1 = abs(y1)
	x2 = x1 + width
	y2 = y1 + height
	face = pixels[y1:y2,x1:x2]
	image = Image.fromarray(face)
	image = image.resize(required_size)
	face_array = np.asarray(image)
	return face_array


# Extract face from frame
def extract_face_frame(pixels, required_size = (160,160)):
  faces = detector.detect_faces(pixels)

  if len(faces)==0:
    # No faces detected in the frame
    save_frame(SUSPICIOUS_DIR, frame)
    return None, 0

  x1,y1,width,height = faces[0]['box']
  confidence = faces[0]['confidence']
  if len(faces)>1:
    # Multiple faces detected in the frame
    save_frame(SUSPICIOUS_DIR, frame)
    return None, 0
    
	# Extracting the face according to the bounding boxes
  x1 = abs(x1)
  y1 = abs(y1)
  x2 = x1 + width
  y2 = y1 + height
  face = pixels[y1:y2,x1:x2]
  image = Image.fromarray(face)
  image = image.resize(required_size)
  face_array = np.asarray(image)
  return face_array, confidence


# Function to verify a face with existing embeddings
def face_verification(face_array, embedding_record):
  # Normalising the extracted face
  mean = face_array.mean()
  std = face_array.std()
  face_array = (face_array-mean)/std
  face_array = np.expand_dims(face_array,axis=0)

  # Calculating the embeddings
  embedding_real = face_net.predict(face_array)

  # Verifying the face
  dist, verified = verify(embedding_real, embedding_record)
  if verified == False:
    save_frame(SUSPICIOUS_DIR, frame)
  return verified


# Function to determine the activity according to gaze value
def activity_type(shape,clx,cly,crx,cry):
  corner1_diff = np.linalg.norm(shape[36] - (clx,cly))
  corner2_diff = np.linalg.norm(shape[39] - (clx,cly))
  if(corner1_diff > corner2_diff):
    ratio1 = corner2_diff/corner1_diff
  else:
    ratio1 = corner1_diff/corner2_diff

  corner1_diff = np.linalg.norm(shape[42] - (crx,cry))
  corner2_diff = np.linalg.norm(shape[45] - (crx,cry))
  if(corner1_diff > corner2_diff):
    ratio2 = corner2_diff/corner1_diff
  else:
    ratio2 = corner1_diff/corner2_diff

  ratio = (ratio1+ratio2)/2
  if(ratio < 0.65):
    # Suspicious Activity
    save_frame(SUSPICIOUS_DIR, frame)


# Function to convert the keypoints of face to a numpy array
def shape_to_np(shape,dtype="int"):
  coords = np.zeros((68,2),dtype = dtype)
  for i in range(0,68):
    coords[i] = (shape.part(i).x,shape.part(i).y)
  return coords


# Function to create the mask
def eye_mask(shape, mask, side):
  points = [shape[i] for i in side]
  points = np.array(points,np.int32)
  mask = cv2.fillConvexPoly(mask,points,255)
  return mask


# Function to locate pupils
def contouring(thresh, mid, img, right=False):
  cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
  try:
    cnt = max(cnts, key = cv2.contourArea)
    M = cv2.moments(cnt)
    cx = int(M['m10']/M['m00'])
    cy = int(M['m01']/M['m00'])
    if right:
      cx += mid
    cv2.circle(img, (cx, cy), 4, (0, 0, 255), 2)
    return cx,cy
  except:
    pass


# Function to take a frame and output the activity type according to position of eyes
def eye_track(face_array):
  gray = cv2.cvtColor(face_array, cv2.COLOR_RGB2GRAY)
  detector = dlib.get_frontal_face_detector()
  rects = detector(gray, 1)
  img = face_array

  try:
    shape = predictor(gray,rects[0])
  except:
    # Eyes could not be detected
    save_frame(SUSPICIOUS_DIR, frame)
    return

  shape = shape_to_np(shape)
  
  left = [36, 37, 38, 39, 40, 41] # Keypoint indices for left eye
  right = [42, 43, 44, 45, 46, 47] # Keypoint indices for right eye

  mask = np.zeros(img.shape[:2],dtype=np.uint8)
  mask = eye_mask(shape,mask,left)
  mask = eye_mask(shape,mask,right)
  
  kernel = np.ones((9,9),np.uint8)
  mask = cv2.dilate(mask,kernel,5) # Dilate the part of the eyes detected
  eyes = cv2.bitwise_and(img,img,mask=mask) # Applies the mask on the frame
  
  mask = (eyes==[0,0,0]).all(axis=2) # Extracts all points in mask with 0 pixel value
  eyes[mask] = [255,255,255] # Convert all above points to 255 pixel value so only black circle left in masked frame are pupils
  eyes_gray = cv2.cvtColor(eyes, cv2.COLOR_BGR2GRAY)
  
  # A threshold based on lighting condition, chosen as 80 for ideal lighting
  _,thresh = cv2.threshold(eyes_gray,80,255,cv2.THRESH_BINARY)
  thresh = cv2.erode(thresh, None, iterations=2)
  thresh = cv2.dilate(thresh, None, iterations=4)
  thresh = cv2.medianBlur(thresh, 3)
  thresh = cv2.bitwise_not(thresh)
  
  mid = (shape[39][0] + shape[42][0]) // 2
  try:
    clx,cly = contouring(thresh[:, 0:mid], mid, img)
    crx,cry = contouring(thresh[:, mid:], mid, img, True)
  except:
    # Pupils could not be detected
    save_frame(SUSPICIOUS_DIR, frame)
    return
  
  activity_type(shape,clx,cly,crx,cry)


# To save the suspicious frame
def save_frame(dirname, frame):
  image = Image.fromarray(frame)
  filename = str(datetime.datetime.now().timestamp()).replace('.','')
  filename = str(filename).replace(':','')
  filename = str(filename).replace(' ','')
  filename = str(filename).replace('-','')
  filename = str(filename) + ".jpeg"
  filepath = dirname +"/"+ filename
  if not os.path.exists(dirname):
    os.makedirs(dirname)
  try:
    image = image.save(filepath)
    return True
  except:
    return False


'''
Third Part

This is the driver code. 
It processes the video and runs both the systems on the frames extracted from the video.

'''

# Opening the video
video = cv2.VideoCapture(VIDEO_PATH)

# Loading the FaceNet model for face verification
face_net = load_model(FACENET_PATH)

# Loading the predictor for eye tracking
predictor = dlib.shape_predictor(DLIB_PREDICTOR_PATH)

# Instantiating the MTCNN detector for use in face verification
detector = MTCNN()

# Fetching the image from records to run face verification
pixels = extract_face(IMAGE_PATH)

if pixels is not None:
    plt.imshow(pixels)
    plt.show()
    print(pixels.shape)

    # Normalising the extracted face
    pixels.astype('float32')
    mean = pixels.mean()
    std = pixels.std()
    pixels = (pixels-mean)/std
    pixels = np.expand_dims(pixels,axis=0)
    embedding_record = face_net.predict(pixels)
else :
    exit


# Processing the video for eye tracking and face verification
ret, frame = video.read() # Reading the first frame

# Count of the frames processed
count = 0
# Threshold of confidence output by MTCNN to determine whether to use the frame or not
THRESHOLD = 0.9
  
if video.isOpened():
    while ret:
        count+=1
    
        # To process one frame every 30 frames
        if count%30:
            ret, frame = video.read()
            continue

        # To convert it to RGB and then extract the face
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = np.asarray(image)
        face_array, confidence = extract_face_frame(frame)

        # If the confidence of the extracted face is lesser than the set threshold, the frame is discarded
        if confidence < THRESHOLD:
            continue
        
        face_array.astype('float32')

        verified = face_verification(face_array,embedding_record)
    
        if verified:
            eye_track(frame)
        ret, frame = video.read()

video.release
cv2.destroyAllWindows()