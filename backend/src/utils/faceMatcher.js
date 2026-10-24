function calculateEuclideanDistance(descriptor1, descriptor2) {
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

function isValidFaceDescriptor(descriptor) {
  if (!Array.isArray(descriptor)) {
    return false;
  }
  if (descriptor.length !== 128) {
    return false;
  }
  return descriptor.every((val) => typeof val === "number" && !isNaN(val));
}

function findMatchingUser(incomingDescriptor, users, threshold = 0.5) {
  let minDistance = Infinity;
  let matchedUser = null;

  for (const user of users) {
    const storedDescriptor = user.faceDescriptor;
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

module.exports = {
  calculateEuclideanDistance,
  isValidFaceDescriptor,
  findMatchingUser,
};
