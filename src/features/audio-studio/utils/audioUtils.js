// 1. EXTRACT AUDIO FROM VIDEO (Browser Native)
export const extractAudioFromVideo = async (videoFile) => {
  const arrayBuffer = await videoFile.arrayBuffer();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Decode video audio track into an AudioBuffer
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Convert AudioBuffer back to WAV Blob for WaveSurfer
  return bufferToWav(audioBuffer);
};

// 2. TRIM BUFFER (Optimized)
export const trimAudioBuffer = (audioBuffer, start, end, fadeIn = false, fadeOut = false) => {
  const sampleRate = audioBuffer.sampleRate;
  const startOffset = Math.floor(start * sampleRate);
  const endOffset = Math.floor(end * sampleRate);
  const frameCount = endOffset - startOffset;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const newBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    frameCount,
    sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    const newChannelData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < frameCount; i++) {
      let sample = channelData[i + startOffset];

      // APPLY FADE IN (First 2 seconds)
      if (fadeIn && i < sampleRate * 2) {
         sample *= (i / (sampleRate * 2));
      }

      // APPLY FADE OUT (Last 2 seconds)
      if (fadeOut && i > frameCount - (sampleRate * 2)) {
         sample *= ((frameCount - i) / (sampleRate * 2));
      }

      newChannelData[i] = sample;
    }
  }

  return newBuffer;
};

// 3. BUFFER TO WAV (Standard Header)
export const bufferToWav = (buffer) => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArr = new ArrayBuffer(length);
  const view = new DataView(bufferArr);
  const channels = [];
  let i, sample, offset = 0, pos = 0;

  // Write WAV Header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));

  while (pos < buffer.length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos])); 
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; 
      view.setInt16(44 + offset, sample, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([view], { type: "audio/wav" });

  function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
  function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
};