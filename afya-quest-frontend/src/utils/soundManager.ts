// Sound effects manager for the application

class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundCache: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Initialize AudioContext only when needed to avoid autoplay restrictions
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      // Use a user interaction to initialize audio context if needed
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      this.enabled = false;
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  // Create a simple ding sound using Web Audio API
  private createDingSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    try {
      const sampleRate = this.audioContext.sampleRate;
      const duration = 0.5; // 0.5 seconds
      const length = sampleRate * duration;
      const buffer = this.audioContext.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate a pleasant ding sound (combination of sine waves)
      for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        // Main frequency (800Hz) with harmonics
        const freq1 = Math.sin(2 * Math.PI * 800 * time);
        const freq2 = Math.sin(2 * Math.PI * 1200 * time) * 0.5;
        const freq3 = Math.sin(2 * Math.PI * 1600 * time) * 0.25;
        
        // Apply envelope (fade out)
        const envelope = Math.exp(-time * 3);
        
        data[i] = (freq1 + freq2 + freq3) * envelope * 0.3;
      }

      return buffer;
    } catch (error) {
      console.warn('Failed to create ding sound:', error);
      return null;
    }
  }

  // Play a sound using Web Audio API
  private playAudioBuffer(buffer: AudioBuffer) {
    if (!this.audioContext || !buffer) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set volume
      gainNode.gain.value = 0.3;
      
      source.start();
    } catch (error) {
      console.warn('Failed to play audio buffer:', error);
    }
  }

  // Play a ding sound for correct answers
  public async playDing(): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.resumeAudioContext();
      
      // Check if we have cached the ding sound
      let dingBuffer = this.soundCache.get('ding');
      
      if (!dingBuffer) {
        // Create and cache the ding sound
        const newBuffer = this.createDingSound();
        if (newBuffer) {
          dingBuffer = newBuffer;
          this.soundCache.set('ding', newBuffer);
        }
      }

      if (dingBuffer) {
        this.playAudioBuffer(dingBuffer);
      }
    } catch (error) {
      console.warn('Failed to play ding sound:', error);
    }
  }

  // Play an error sound (lower frequency, shorter)
  public async playError(): Promise<void> {
    if (!this.enabled || !this.audioContext) return;

    try {
      await this.resumeAudioContext();
      
      const sampleRate = this.audioContext.sampleRate;
      const duration = 0.3;
      const length = sampleRate * duration;
      const buffer = this.audioContext.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate error sound (lower frequency)
      for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const freq = Math.sin(2 * Math.PI * 300 * time); // Lower frequency
        const envelope = Math.exp(-time * 2);
        data[i] = freq * envelope * 0.2;
      }

      this.playAudioBuffer(buffer);
    } catch (error) {
      console.warn('Failed to play error sound:', error);
    }
  }

  // Enable or disable sounds
  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Initialize audio context on user interaction
  public async initOnUserInteraction(): Promise<void> {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    await this.resumeAudioContext();
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playCorrectAnswerSound = () => soundManager.playDing();
export const playIncorrectAnswerSound = () => soundManager.playError();
export const initSounds = () => soundManager.initOnUserInteraction();