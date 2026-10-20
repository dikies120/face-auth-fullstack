export function calculateEuclideanDistance(
  descriptor1: number[],
  descriptor2: number[]
): number {
  if (descriptor1.length !== descriptor2.length) {
    throw new Error(
      `Dimensi embedding tidak sama! descriptor1: ${descriptor1.length}, descriptor2: ${descriptor2.length}`
    );
  }

  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

export function isValidFaceDescriptor(descriptor: unknown): descriptor is number[] {
  if (!Array.isArray(descriptor)) {
    return false;
  }
  if (descriptor.length !== 128) {
    return false;
  }
  return descriptor.every((val) => typeof val === "number" && !isNaN(val));
}

export interface MatchableUser {
  id: string;
  name: string;
  email?: string | null;
  memberCode?: string | null;
  department?: string | null;
  faceImageUrl?: string | null;
  faceDescriptor: unknown;
  [key: string]: any;
}

export function findMatchingUser<T extends MatchableUser>(
  incomingDescriptor: number[],
  users: T[],
  threshold: number = 0.5
): { matchedUser: T | null; minDistance: number } {
  let minDistance = Infinity;
  let matchedUser: T | null = null;

  for (const user of users) {
    const storedDescriptor = user.faceDescriptor as number[];
    if (isValidFaceDescriptor(storedDescriptor)) {
      const distance = calculateEuclideanDistance(incomingDescriptor, storedDescriptor);
      if (distance < minDistance) {
        minDistance = distance;
        if (distance < threshold) {
          matchedUser = user;
        }
      }
    }
  }

  return { matchedUser, minDistance };
}
