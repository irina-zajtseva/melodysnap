// src/hooks/useAudioRecorder.ts
"use client";

import { useState, useRef, useCallback } from "react";

export type RecordingStatus = "idle" | "recording" | "recorded";

export function useAudioRecorder(maxDuration: number = 120) {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopMediaRecorder = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    clearTimer();
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Detect supported audio format
      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/mpeg")) {
        mimeType = "audio/mpeg";
      } else {
        mimeType = "";
      }

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const actualMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        setStatus("recorded");

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setStatus("recording");

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setDuration(Math.floor(elapsed));

        if (elapsed >= maxDuration) {
          stopMediaRecorder();
        }
      }, 100);
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access to record your idea!");
    }
  }, [maxDuration]);

  const stopRecording = useCallback(() => {
    stopMediaRecorder();
  }, []);

  const resetRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    setDuration(0);
    setStatus("idle");
  }, [audioURL]);

  return {
    status,
    audioURL,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  };
}