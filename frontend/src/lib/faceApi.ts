let faceapiInstance: typeof import("@vladmandic/face-api") | null = null;
let modelsLoaded = false;

export async function getFaceApi() {
  if (typeof window === "undefined") return null;
  if (!faceapiInstance) {
    faceapiInstance = await import("@vladmandic/face-api");
  }
  return faceapiInstance;
}

export async function loadFaceApiModels(modelsPath = "/models") {
  if (typeof window === "undefined") return false;
  if (modelsLoaded) return true;

  try {
    const faceapi = await getFaceApi();
    if (!faceapi) return false;

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelsPath),
    ]);

    modelsLoaded = true;
    return true;
  } catch (error) {
    console.error("Failed loading face-api models:", error);
    return false;
  }
}

export async function detectSingleFaceDescriptor(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
) {
  const faceapi = await getFaceApi();
  if (!faceapi) return null;

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 416,
    scoreThreshold: 0.5,
  });

  const detection = await faceapi
    .detectSingleFace(input, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection;
}

export async function detectAllFaces(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
) {
  const faceapi = await getFaceApi();
  if (!faceapi) return [];

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 416,
    scoreThreshold: 0.4,
  });

  return await faceapi.detectAllFaces(input, options);
}
