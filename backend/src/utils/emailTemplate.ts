export const welcomeTemplate = (name: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to GuptKey</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:8px;margin:40px 0;padding:40px;color:#e5e7eb;">
          
          <tr>
            <td align="center" style="font-size:24px;font-weight:bold;color:#22d3ee;">
              GuptKey
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;font-size:18px;">
              Welcome, ${name}.
            </td>
          </tr>

          <tr>
            <td style="padding-top:15px;font-size:15px;line-height:1.6;color:#9ca3af;">
              Your vault is now secured with military-grade encryption.
              GuptKey ensures your passwords remain private, encrypted, and accessible only to you.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:30px;">
              <a href="https://guptkey.vercel.app/dashboard"
                 style="background:#22d3ee;color:#0f172a;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">
                 Go To Dashboard
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top:40px;font-size:12px;color:#6b7280;text-align:center;">
              If you did not create this account, please contact support immediately.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`};

export const otpTemplate = (rawOtp: string, expiryMinutes: number = 10) => {
  const otp = rawOtp.trim();
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:8px;margin:40px 0;padding:40px;color:#e5e7eb;">

          <tr>
            <td align="center" style="font-size:22px;font-weight:bold;color:#22d3ee;">
              GuptKey Security Code
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;font-size:15px;color:#9ca3af;">
              Use the following One-Time Password to continue:
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:30px 0;">
              <div style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#22d3ee;">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td style="font-size:14px;color:#9ca3af;">
              This code will expire in 5 minutes.
              Do not share this code with anyone.
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;font-size:12px;color:#6b7280;text-align:center;">
              If you did not request this code, secure your account immediately.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
};

export const passwordChangedTemplate = (name: string, time: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Changed - GuptKey</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6;">

    <!-- Preheader -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Your GuptKey master password was changed. If this wasn’t you, act immediately.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; font-family:Arial, sans-serif; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:40px 20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:26px;">
                  GuptKey Security Alert
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px; color:#374151; font-size:15px; line-height:1.6;">

                <p style="font-size:18px; margin-top:0;">
                  Hi <strong>${name}</strong>,
                </p>

                <p>
                  Your master password was successfully changed.
                </p>

                <!-- Info Box -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; margin:20px 0;">
                  <tr>
                    <td style="padding:20px; font-size:14px; color:#111827;">
                      <strong>Time:</strong> ${time}<br/>
                    </td>
                  </tr>
                </table>

                <p>
                  If you made this change, no further action is required.
                </p>

                <p style="color:#b91c1c; font-weight:bold;">
                  If this wasn’t you, secure your account immediately.
                </p>

                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:25px 0;">
                  <tr>
                    <td align="center">
                      <a href="https://guptkey.vercel.app/login"
                         style="background:#1e3a8a; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                        Secure My Account
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top:30px;">
                  Stay secure,<br/>
                  <strong>The GuptKey Team</strong>
                </p>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td>
                <hr style="border:none; border-top:1px solid #e5e7eb;" />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:20px; font-size:12px; color:#9ca3af;">
                © 2026 GuptKey. All rights reserved.<br/>
                Built for security-first users.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
