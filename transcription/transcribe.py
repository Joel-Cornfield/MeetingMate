import sys

from faster_whisper import WhisperModel


def transcribe(audio_path: str):
    print("Loading Whisper model...", file=sys.stderr)

    model = WhisperModel(
        "base",
        device="cpu",
        compute_type="int8",
    )

    print("Whisper model loaded.", file=sys.stderr)
    print("Starting transcription...", file=sys.stderr)

    segments, info = model.transcribe(
        audio_path,
        beam_size=5,
    )

    transcript = " ".join(
        segment.text.strip()
        for segment in segments
    )

    print("Transcription complete.", file=sys.stderr)

    return transcript


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "Usage: python transcribe.py <audio-file>",
            file=sys.stderr
        )
        sys.exit(1)

    audio_path = sys.argv[1]

    try:
        transcript = transcribe(audio_path)
        print(transcript)
    except Exception as error:
        print(
            f"Transcription failed: {error}",
            file=sys.stderr
        )
        sys.exit(1)