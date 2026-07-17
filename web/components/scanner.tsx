"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowClockwiseIcon,
  ImageSquareIcon,
  MagnifyingGlassIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { findDisease } from "@/lib/diseases";
import { predict, preloadModel } from "@/lib/inference";
import { cn } from "@/lib/utils";

type Phase = "idle" | "ready" | "loading" | "done" | "error";

interface Prediction {
  className: string;
  confidence: number;
}

const ACCEPTED = ["image/jpeg", "image/png"];

const SAMPLES = [
  { src: "/samples/late-blight.jpg", alt: "Sample leaf with late blight damage" },
  { src: "/samples/septoria.jpg", alt: "Sample leaf with small dark spots" },
  { src: "/samples/healthy.jpg", alt: "Sample healthy leaf" },
];

export function Scanner() {
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setImage = useCallback(
    (f: File) => {
      if (!ACCEPTED.includes(f.type)) {
        setErrorText("Only JPG and PNG files are supported.");
        setPhase("error");
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setResult(null);
      setErrorText("");
      setPhase("ready");
      preloadModel();
    },
    [previewUrl]
  );

  async function analyse() {
    if (!file) return;
    setPhase("loading");
    setErrorText("");
    try {
      const prediction = await predict(file);
      setResult(prediction);
      setPhase("done");
    } catch (err) {
      setErrorText(
        err instanceof Error && err.message.length < 200
          ? err.message
          : "Could not run the model in this browser. Try reloading the page, or use a recent Chrome, Edge, or Firefox."
      );
      setPhase("error");
    }
  }

  function clearImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorText("");
    setPhase("idle");
  }

  async function loadSample(src: string) {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const name = src.split("/").pop() ?? "sample.jpg";
      setImage(new File([blob], name, { type: blob.type || "image/jpeg" }));
    } catch {
      setErrorText("Could not load the sample image.");
      setPhase("error");
    }
  }

  const entry = result ? findDisease(result.className) : undefined;
  const isHealthy = result?.className.toLowerCase() === "healthy";
  const confPct = result ? Math.round(result.confidence * 100) : 0;

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm shadow-black/5">
      {/* Drop zone / preview */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a tomato leaf image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) setImage(f);
        }}
        className={cn(
          "group relative m-4 cursor-pointer rounded-lg border border-dashed transition-colors",
          previewUrl
            ? "p-4"
            : "flex min-h-[220px] flex-col items-center justify-center sm:min-h-[260px]",
          dragging ? "border-primary bg-primary/5" : "hover:border-primary/60"
        )}
      >
        {previewUrl && file ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected leaf"
              className="h-24 w-24 shrink-0 rounded-md border object-cover sm:h-28 sm:w-28"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
              </p>
              <p className="mt-2 text-xs text-muted-foreground underline-offset-4 group-hover:underline">
                Click to choose a different image
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove image"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <XIcon size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-foreground">
              <UploadSimpleIcon size={20} />
            </span>
            <p className="text-sm font-medium">Drop a leaf photo here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG or PNG, one leaf per image
            </p>
            <Button variant="outline" size="sm" className="mt-4 pointer-events-none">
              Browse files
            </Button>
            <div className="mt-7 flex flex-col items-center gap-2.5">
              <span className="text-xs text-muted-foreground">
                No leaf handy? Try one of these:
              </span>
              <div className="flex gap-2.5">
                {SAMPLES.map((s) => (
                  <button
                    key={s.src}
                    type="button"
                    aria-label={`Analyse ${s.alt.toLowerCase()}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      loadSample(s.src);
                    }}
                    className="overflow-hidden rounded-md border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt={s.alt}
                      className="h-12 w-12 object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setImage(f);
          }}
        />
      </div>

      <div className="px-4 pb-4">
        <Button
          className="w-full"
          disabled={!file || phase === "loading"}
          onClick={analyse}
        >
          {phase === "loading" ? (
            <>
              <ArrowClockwiseIcon size={16} className="animate-spin" />
              Analysing
            </>
          ) : (
            <>
              <MagnifyingGlassIcon size={16} />
              {phase === "done" ? "Analyse again" : "Analyse leaf"}
            </>
          )}
        </Button>
      </div>

      {/* Result area */}
      <div className="border-t px-4 py-4 sm:px-5" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "loading" ? (
            <motion.div key="loading" {...fade} className="space-y-3">
              <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
              <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
            </motion.div>
          ) : phase === "error" ? (
            <motion.div
              key="error"
              {...fade}
              className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive"
            >
              <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
              <span>{errorText}</span>
            </motion.div>
          ) : phase === "done" && result ? (
            <motion.div key="result" {...fade}>
              <Badge variant={isHealthy ? "success" : "destructive"}>
                {isHealthy ? "Healthy" : "Disease detected"}
              </Badge>
              <div className="mt-2.5 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-display text-2xl font-semibold tracking-tight">
                    {entry?.name ?? result.className}
                  </p>
                  {entry && entry.group !== "None" && (
                    <p className="mt-0.5 text-xs text-muted-foreground italic">
                      {entry.agent}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-3xl leading-none tracking-tight">
                    {confPct}%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>
              <div
                className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={confPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    confPct >= 60 ? "bg-primary" : "bg-destructive"
                  )}
                  initial={reduce ? { width: `${confPct}%` } : { width: 0 }}
                  animate={{ width: `${confPct}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              {entry && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              {...fade}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <ImageSquareIcon size={18} className="shrink-0" />
              {phase === "ready"
                ? "Image ready. Run the analysis to get a diagnosis."
                : "The diagnosis will appear here after you upload an image."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
