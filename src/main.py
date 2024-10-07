from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import cv2
import uvicorn
from image_classifier import process_frame  # Your existing image classifier logic
from image_generator import generate_image  # Newly created image generator logic

last_raw_frame = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def generate_frames():
    global last_raw_frame
    cap = cv2.VideoCapture(0)

    while True:
        success, frame = cap.read()
        if not success:
            break

        last_raw_frame = frame.copy()  
        processed_frame = process_frame(frame)

        ret, buffer = cv2.imencode('.jpg', processed_frame) 
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.get('/video')
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')

@app.get('/take_photo')
async def get_photo():
    global last_raw_frame
    if last_raw_frame is None:
        return Response(content="No frame available", status_code=404)

    ret, buffer = cv2.imencode('.jpg', last_raw_frame)
    frame = buffer.tobytes()

    return Response(content=frame, media_type="image/jpeg")

@app.post("/generate_image")
async def get_generated_image(image: UploadFile = File(...), tags: str = Form(...)):
    try:
        image_data = await image.read()

        img_bytes = generate_image(image_data, prompt=tags)

        return StreamingResponse(img_bytes, media_type="image/png")

    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)
