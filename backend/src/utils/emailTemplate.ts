
export const welcomeTemplate = (name: string) => {

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to GuptKey</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6;">

    <!-- Preheader -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Welcome to GuptKey. Your secure password vault is ready.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6; padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; overflow:hidden; font-family:Arial, sans-serif;">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#1e3a8a; padding:40px 20px;">
                <h1 style="color:#ffffff; margin:0; font-size:28px;">
                  Welcome to GuptKey
                </h1>
                <p style="color:#c7d2fe; margin-top:10px; font-size:14px;">
                  Your encrypted password vault is ready.
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px; color:#374151; line-height:1.6; font-size:15px;">

                <p style="font-size:18px; margin-top:0;">
                  Hi <strong>${name}</strong>,
                </p>

                <p>
                  You’ve successfully created your GuptKey account. 
                  From now on, your passwords are protected with strong encryption 
                  and secure architecture designed for privacy-first users.
                </p>

                <p>
                  Here’s what you can do next:
                </p>

                <ul style="padding-left:20px;">
                  <li>Store and organize your passwords securely</li>
                  <li>Generate strong, unique credentials</li>
                  <li>Access your vault from anywhere</li>
                </ul>

                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
                  <tr>
                    <td align="center">
                      <a href="https://yourdomain.com/dashboard"
                         style="background:#1e3a8a; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                        Open Your Vault
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top:30px;">
                  If this account wasn’t created by you, please contact our support immediately.
                </p>

                <p>
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
                Built for security-conscious users.
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

export const otpTemplate = (
  rawOtp: string,
  expiryMinutes: number = 10
) => {
  const otp = rawOtp.trim();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>GuptKey Verification Code</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6;">
    
    <!-- Preheader Text -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Your GuptKey verification code is ${otp}. Valid for ${expiryMinutes} minutes.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6; padding:40px 0;">
      <tr>
        <td align="center">

          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; padding:40px 30px; font-family:Arial, sans-serif;">

            <!-- Logo -->
            <tr>
              <td align="center" style="font-size:24px; font-weight:bold; color:#1e3a8a; padding-bottom:20px;">
                GuptKey
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td align="center" style="font-size:20px; font-weight:600; color:#111827; padding-bottom:10px;">
                Verify Your Email
              </td>
            </tr>

            <!-- Description -->
            <tr>
              <td align="center" style="font-size:15px; color:#4b5563; padding-bottom:30px; line-height:1.5;">
                Use the verification code below to complete your sign-in. 
                This code will expire in <strong>${expiryMinutes} minutes</strong>.
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background:#f9fafb; border:1px solid #e5e7eb; padding:15px 25px; font-size:32px; font-weight:700; letter-spacing:4px; color:#111827; border-radius:8px;">
                      ${otp}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer Text -->
            <tr>
              <td align="center" style="font-size:13px; color:#9ca3af; padding-top:30px; line-height:1.5;">
                If you didn’t request this code, you can safely ignore this email.<br/>
                Your account security is our priority.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding-top:30px;">
                <hr style="border:none; border-top:1px solid #e5e7eb;" />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="font-size:12px; color:#9ca3af; padding-top:15px;">
                © 2026 GuptKey. All rights reserved.
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