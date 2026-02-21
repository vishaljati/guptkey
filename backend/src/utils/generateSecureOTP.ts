export const generateSecureOTP = (length: number = 6): string => {
    const digits = '0123456789';
    let otp = '';
    const randomValues = new Uint32Array(length);

    // Fills the array with cryptographically strong random values
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        otp += digits[randomValues[i] % 10];
    }

    return otp;
};
