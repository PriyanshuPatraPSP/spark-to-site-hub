import { pipeline, env, RawImage } from "@huggingface/transformers";

// Configure transformers.js to fetch models from HF CDN (no local models)
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_DIMENSION = 1024;

let segmenterPromise: Promise<any> | null = null;

function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = pipeline("background-removal", "briaai/RMBG-1.4", {
      // Try WebGPU, fall back to wasm automatically
      device: (navigator as any).gpu ? "webgpu" : "wasm",
    } as any).catch(() => pipeline("background-removal", "briaai/RMBG-1.4"));
  }
  return segmenterPromise;
}

function resizeIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let { naturalWidth: w, naturalHeight: h } = image;
  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(image, 0, 0, w, h);
  return { w, h };
}

export async function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  } finally {
    // Revoke later — keep URL alive for a tick so img can be reused if needed
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export async function removeBackground(
  image: HTMLImageElement,
  onProgress?: (msg: string) => void,
): Promise<Blob> {
  onProgress?.("Loading AI model…");
  const segmenter = await getSegmenter();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const { w, h } = resizeIfNeeded(canvas, ctx, image);

  onProgress?.("Analyzing image…");
  const dataUrl = canvas.toDataURL("image/png");
  const result: any = await segmenter(dataUrl);

  // Result can be a single RawImage (mask) or array — RMBG returns mask
  const mask: RawImage = Array.isArray(result) ? result[0].mask ?? result[0] : result.mask ?? result;

  onProgress?.("Cutting out…");
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Mask is single-channel grayscale at same dimensions (resized internally by pipeline)
  // Ensure mask matches our canvas size
  let maskData: Uint8Array;
  if (mask.width !== w || mask.height !== h) {
    const mCanvas = document.createElement("canvas");
    mCanvas.width = mask.width;
    mCanvas.height = mask.height;
    const mCtx = mCanvas.getContext("2d")!;
    const tmp = mCtx.createImageData(mask.width, mask.height);
    for (let i = 0; i < mask.data.length; i++) {
      const v = mask.data[i];
      tmp.data[i * 4] = v;
      tmp.data[i * 4 + 1] = v;
      tmp.data[i * 4 + 2] = v;
      tmp.data[i * 4 + 3] = 255;
    }
    mCtx.putImageData(tmp, 0, 0);
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const oCtx = out.getContext("2d")!;
    oCtx.drawImage(mCanvas, 0, 0, w, h);
    const resized = oCtx.getImageData(0, 0, w, h).data;
    maskData = new Uint8Array(w * h);
    for (let i = 0; i < maskData.length; i++) maskData[i] = resized[i * 4];
  } else {
    maskData = mask.data as unknown as Uint8Array;
  }

  for (let i = 0; i < maskData.length; i++) {
    data[i * 4 + 3] = maskData[i];
  }
  ctx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png");
  });
}
