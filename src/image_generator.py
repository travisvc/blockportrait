import torch
from diffusers import AutoPipelineForImage2Image
from diffusers.utils import make_image_grid, load_image

pipeline = AutoPipelineForImage2Image.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5", torch_dtype=torch.float16, variant="fp16", use_safetensors=True
)
# pipeline = AutoPipelineForImage2Image.from_pretrained(
#     "kandinsky-community/kandinsky-2-2-decoder", torch_dtype=torch.float16, use_safetensors=True
# )
pipeline.enable_model_cpu_offload()

# prepare image
url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/img2img-init.png"
init_image = load_image(url)

prompt = "cold color palette, muted colors"
image = pipeline(prompt, image=init_image).images[0]
grid = make_image_grid([init_image, image], rows=1, cols=2)
grid.save("image_grid.png")
grid.show()