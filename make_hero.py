import numpy as np
from PIL import Image
W,H=1920,1100; rib=80
rng=np.random.default_rng(3)
choc=np.array([27,18,13.]);coffee=np.array([90,58,42.]);purple=np.array([155,122,255.]);lav=np.array([197,179,255.]);taupe=np.array([167,134,111.]);cream=np.array([248,246,241.])
yy,xx=np.mgrid[0:H,0:W].astype(float)
g=lambda cx,cy,sx,sy: np.exp(-(((xx-cx)/sx)**2+((yy-cy)/sy)**2)/2)
scene=np.tile(choc,(H,W,1))
def add(col,m,k=1.0):
    global scene
    m=np.clip(m*k,0,1)[...,None]; scene=scene*(1-m)+col*m
# purple/lavender light from the left, coffee warmth from the right; centre stays dark for text
add(purple,g(W*0.04,H*0.55,W*0.16,H*0.85),0.85)
add(lav,g(0,H*0.75,W*0.06,H*0.45),0.6)
add(coffee,g(W*0.88,H*0.70,W*0.28,H*0.75),1.0)
add(taupe,g(W*0.97,H*0.90,W*0.13,H*0.40),0.40)
add(purple,g(W*0.97,H*0.0,W*0.10,H*0.30),0.30)
xs=np.arange(W); i=xs//rib; u=(xs%rib)/rib
src=np.clip(i*rib+(u*1.9-0.45)*rib,0,W-1).astype(int)
out=scene[:,src,:]
shade=1-0.22*np.clip((u-0.8)/0.2,0,1)**1.5
hl=0.14*np.exp(-(u/0.02)**2)
out=out*shade[None,:,None]+cream*hl[None,:,None]*0.6
out*=0.9
out+=rng.normal(0,3.5,(H,W,1))
Image.fromarray(np.clip(out,0,255).astype('uint8')).save('assets/images/fluted-hero.jpg',quality=80,optimize=True,progressive=True)
