import os
import shutil

os.makedirs(r"C:\Users\LAPTOPS HUB\Desktop\Gen Ai\CareerPilot-AI\frontend\public\assets", exist_ok=True)
shutil.copy(r"C:\Users\LAPTOPS HUB\Desktop\Gen Ai\CareerPilot-AI\assest\career image auth.jpg", 
            r"C:\Users\LAPTOPS HUB\Desktop\Gen Ai\CareerPilot-AI\frontend\public\assets\auth-image.jpg")
print("Successfully copied image!")
