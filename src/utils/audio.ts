
/**
 * Converts an AudioBuffer to a WAV Blob.
 * 
 * This utility allows us to convert recorded audio (often webm) into
 * standard WAV format which is widely supported by backends.
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const bufferLength = buffer.length * numChannels * bytesPerSample;
  const totalLength = 44 + bufferLength;
  
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);
  
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // RIFF identifier
  writeString(0, 'RIFF');
  // file length
  view.setUint32(4, totalLength - 8, true);
  // RIFF type
  writeString(8, 'WAVE');
  
  // format chunk identifier
  writeString(12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, format, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * blockAlign, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, bitDepth, true);
  
  // data chunk identifier
  writeString(36, 'data');
  // data chunk length
  view.setUint32(40, bufferLength, true);
  
  // write the PCM samples
  const offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      // Convert float [-1, 1] to signed 16-bit integer
      view.setInt16(offset + (i * numChannels + channel) * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Downsamples an AudioBuffer to mono and a target sample rate.
 */
export async function downsampleAudioBuffer(
  buffer: AudioBuffer,
  targetSampleRate: number = 16000
): Promise<AudioBuffer> {
  const numberOfChannels = 1; // Mono
  const duration = buffer.duration;
  
  if (typeof window === "undefined") {
    return buffer;
  }
  
  const OfflineAudioCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineAudioCtx) {
    return buffer;
  }
  
  const offlineCtx = new OfflineAudioCtx(
    numberOfChannels,
    Math.round(duration * targetSampleRate),
    targetSampleRate
  );

  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.connect(offlineCtx.destination);
  bufferSource.start();

  return await offlineCtx.startRendering();
}

/**
 * Converts an AudioBuffer to a compressed MP3 Blob using lamejs.
 */
export function audioBufferToMp3(buffer: AudioBuffer, bitrate: number = 32): Blob {
  // Setup global variables required by lamejs's auto-translated code
  if (typeof window !== "undefined") {
    const g = window as any;
    if (!g.MPEGMode) {
      const common = require("lamejs/src/js/common.js");
      g.common = common;
      g.System = common.System;
      g.VbrMode = common.VbrMode;
      g.Float = common.Float;
      g.ShortBlock = common.ShortBlock;
      g.Util = common.Util;
      g.Arrays = common.Arrays;
      g.new_array_n = common.new_array_n;
      g.new_byte = common.new_byte;
      g.new_double = common.new_double;
      g.new_float = common.new_float;
      g.new_float_n = common.new_float_n;
      g.new_int = common.new_int;
      g.new_int_n = common.new_int_n;
      g.assert = common.assert;
      g.MPEGMode = require("lamejs/src/js/MPEGMode.js");
      g.Lame = require("lamejs/src/js/Lame.js");
      g.BitStream = require("lamejs/src/js/BitStream.js");
    }
  }

  // Require lamejs dynamically to avoid build-time SSR issues
  const lamejs = require("lamejs");

  const sampleRate = buffer.sampleRate;
  const numChannels = 1; // Mono channel encoding
  
  // Create the encoder: new lamejs.Mp3Encoder(channels, samplerate, bitrate)
  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, bitrate);
  const mp3Data: any[] = [];
  
  // We use the first channel (mono representation)
  const channelData = buffer.getChannelData(0);
  
  // Convert float samples [-1, 1] to signed 16-bit PCM (Int16Array)
  const samples = new Int16Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    samples[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
  }
  
  // Process the samples in blocks
  const sampleBlockSize = 1152;
  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const sampleChunk = samples.subarray(i, i + sampleBlockSize);
    const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }
  }
  
  // Flush encoder internal buffers
  const mp3bufEnd = mp3encoder.flush();
  if (mp3bufEnd.length > 0) {
    mp3Data.push(new Uint8Array(mp3bufEnd));
  }
  
  return new Blob(mp3Data, { type: "audio/mp3" });
}

/**
 * Helper to get audio duration using standard HTML5 Audio or AudioContext fallback.
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(0);
      return;
    }
    const audio = new Audio();
    audio.muted = true;
    const objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;

    audio.load();

    const cleanUp = () => {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch (e) {
        console.error("Failed to revoke object URL", e);
      }
    };

    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      cleanUp();
    };

    audio.onerror = () => {
      cleanUp();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve(0);
        return;
      }
      const ctx = new AudioCtx();
      file.arrayBuffer()
        .then((buffer) => ctx.decodeAudioData(buffer))
        .then((decoded) => {
          resolve(decoded.duration);
          ctx.close().catch(() => {});
        })
        .catch(() => {
          resolve(0);
          ctx.close().catch(() => {});
        });
    };
  });
}


