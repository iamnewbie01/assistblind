import crypto from 'crypto';

export const verifyBiometricSignature = (
  signature: string,
  payload: string,
  publicKey: string,
): boolean => {
  try {
    // Log debugging information
    console.log('Payload from verifyBiometricSignature:', payload);
    console.log(
      'Signature (first 20 chars) from verifyBiometricSignature:',
      signature.substring(0, 20),
    );
    console.log(
      'Public Key (first 20 chars) from verifyBiometricSignature:',
      publicKey.substring(0, 20),
    );

    // Convert base64 signature to buffer
    const signatureBuffer = Buffer.from(signature, 'base64');

    // Format the public key if it doesn't have the proper PEM format
    let formattedKey = publicKey;
    if (!publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
      formattedKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    }

    // Replace escaped newlines with actual newlines if present
    formattedKey = formattedKey.replace(/\\n/g, '\n');

    // Create verifier
    const verifier = crypto.createVerify('SHA256');
    verifier.update(payload);

    // Verify signature using the public key
    return verifier.verify(
      {
        key: formattedKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      signatureBuffer,
    );
  } catch (error) {
    console.error('Error verifying biometric signature:', error);
    return false;
  }
};
