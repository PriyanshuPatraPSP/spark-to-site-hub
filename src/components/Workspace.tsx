import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, Loader2, RotateCcw, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { loadImage, removeBackground } from "@/lib/removeBackground";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const checkerboard = {
  backgroundImage:
    "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
};

export const Workspace = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setStatus("");
  };

  const handleFile = useCallback(async (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Unsupported format. Use JPG, PNG, or WEBP.");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("Image is larger than 10 MB.");
      return;
    }
    setFile(f);
    setResultUrl(null);
    const url = URL.createObjectURL(f);
    setOriginalUrl(url);

    setIsProcessing(true);
    try {
      const img = await loadImage(f);
      const blob = await removeBackground(img, setStatus);
      const out = URL.createObjectURL(blob);
      setResultUrl(out);
      setStatus("");
      toast.success("Background removed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to process image. Please try another one.");
      setStatus("");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `snapcut-${(file?.name ?? "image").replace(/\.[^.]+$/, "")}.png`;
    a.click();
  };

  return (
    <section id="workspace" className="py-24 md:py-32 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-sm font-medium text-secondary mb-3">Try it now</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Drop an image, get a <span className="gradient-text">transparent PNG</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Free to try — no signup. Your image is processed locally in your browser.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {!file ? (
            <label
              htmlFor="file-input"
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`glass-card rounded-3xl border-2 border-dashed transition-all cursor-pointer block ${
                dragActive
                  ? "border-primary shadow-glow-primary scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:shadow-glow-primary"
              }`}
            >
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow-primary mb-6 animate-float">
                  <Upload className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">
                  Drop your image here
                </h3>
                <p className="text-muted-foreground mb-6">
                  or <span className="text-foreground font-medium">click to browse</span> · JPG, PNG, WEBP · max 10 MB
                </p>
                <Button variant="hero" size="lg" type="button" onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}>
                  <ImageIcon className="h-5 w-5" />
                  Choose image
                </Button>
              </div>
              <input
                id="file-input"
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="sr-only"
                onChange={onPick}
              />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImagePane label="Original" url={originalUrl} />
                <ImagePane
                  label="Result"
                  url={resultUrl}
                  transparent
                  loading={isProcessing}
                  status={status}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" size="lg" onClick={reset} disabled={isProcessing}>
                  <RotateCcw className="h-4 w-4" />
                  Try another
                </Button>
                <Button variant="hero" size="lg" onClick={download} disabled={!resultUrl || isProcessing}>
                  <Download className="h-5 w-5" />
                  Download PNG
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

interface ImagePaneProps {
  label: string;
  url: string | null;
  transparent?: boolean;
  loading?: boolean;
  status?: string;
}

const ImagePane = ({ label, url, transparent, loading, status }: ImagePaneProps) => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-secondary" />}
    </div>
    <div
      className="aspect-square relative grid place-items-center"
      style={transparent ? checkerboard : undefined}
    >
      {url && !loading && (
        <img src={url} alt={label} className="max-h-full max-w-full object-contain" />
      )}
      {loading && (
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-brand opacity-20 blur-xl absolute inset-0" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
          <div className="text-sm text-muted-foreground">{status || "Processing…"}</div>
          <div className="text-xs text-muted-foreground/70">First run downloads the AI model (~40 MB)</div>
        </div>
      )}
      {!url && !loading && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <X className="h-4 w-4" /> No image
        </div>
      )}
    </div>
  </div>
);
