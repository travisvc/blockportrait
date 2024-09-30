import torch
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import StreamingResponse, Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from diffusers import AutoPipelineForImage2Image
from diffusers.utils import load_image, make_image_grid
from PIL import Image
import uvicorn
import cv2
import io
from image_classifier import process_frame  

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

@app.get('/last_frame')
async def get_last_frame():
    global last_raw_frame
    if last_raw_frame is None:
        return Response(content="No frame available", status_code=404)

    ret, buffer = cv2.imencode('.jpg', last_raw_frame)
    frame = buffer.tobytes()

    return Response(content=frame, media_type="image/jpeg")

pipeline = AutoPipelineForImage2Image.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5", torch_dtype=torch.float16, use_safetensors=True
)
pipeline.enable_model_cpu_offload()

@app.post("/submit_image")
async def submit_image(image: UploadFile = File(...), tags: str = Form(...)):
    try:
        image_data = await image.read()
        init_image = Image.open(io.BytesIO(image_data)).convert("RGB")

        prompt = tags 
        strength = 0.5  # Range: 0-1, default around 0.8
        guidance_scale = 13  # Range: 1-15, default around 7.5 
        generated_image = pipeline(prompt, image=init_image, strength=strength, guidance_scale=guidance_scale).images[0]

        img_bytes = io.BytesIO()
        generated_image.save(img_bytes, format="PNG")
        img_bytes.seek(0)

        return StreamingResponse(img_bytes, media_type="image/png")

    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)
