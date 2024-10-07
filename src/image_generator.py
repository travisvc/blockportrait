import torch
from diffusers import AutoPipelineForImage2Image
from PIL import Image
import io

pipeline = AutoPipelineForImage2Image.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5", torch_dtype=torch.float16, use_safetensors=True
)
pipeline.enable_model_cpu_offload()

def generate_image(image_data, prompt: str, strength: float = 0.5, guidance_scale: float = 13):
    """
    Generate an image based on the given prompt, initial image, strength, and guidance scale.
    
    Args:
        image_data (bytes): The raw image data.
        prompt (str): The text prompt for generating the image.
        strength (float): The strength of the initial image's impact on the output. Range is 0-1, default around 0.8.
        guidance_scale (float): Controls how much the model follows the prompt. Range is 1-15, default around 7.5.
        
    Returns:
        BytesIO: Generated image in PNG format.
    """
    try:
        init_image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Generate the image 
        generated_image = pipeline(prompt, image=init_image, strength=strength, guidance_scale=guidance_scale).images[0]

        img_bytes = io.BytesIO()
        generated_image.save(img_bytes, format="PNG")
        img_bytes.seek(0)

        return img_bytes

    except Exception as e:
        raise RuntimeError(f"Image generation failed: {str(e)}")

