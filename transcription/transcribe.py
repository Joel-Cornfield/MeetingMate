import sys

from faster_whisper import WhisperModel

def transcribe(audio_path: str):
    model = WhisperModel(
        "base", # base model is suitable for light weight production use
        device="cpu",
        compute_type="int8",
    )
    
    segments, info = model.transcribe(
        audio_path,
        beam_size=5,
    )
    
    transcript = " ".join(
        segment.text.strip()
        for segment in segments
    )
    
    return transcript

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe.py <audio-file>")
        sys.exit(1)
        
    audio_path = sys.argv[1]
    
    transcript = transcribe(audio_path)
    
    print(transcript)