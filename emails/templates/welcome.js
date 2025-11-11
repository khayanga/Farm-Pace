const welcomeEmailTemplate = (name, tempPassword, farmName, farmCode) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937; background-color: #f7fefc; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border: 1px solid #d1fae5;">
      <h2 style="color: #65a30d; font-size: 24px; font-weight: bold; margin-bottom: 16px;">
        Welcome to FarmPace, ${name}!
      </h2>

      <p style="font-size: 16px; margin-bottom: 12px;">Your account has been successfully created.</p>

      <p style="font-size: 16px; margin-bottom: 12px;">
        <strong>Temporary password:</strong> ${tempPassword}
      </p>

      <p style="font-size: 16px; margin-bottom: 12px;">
        <strong>Assigned Farm:</strong> ${farmName} (${farmCode})
      </p>

      <p style="font-size: 16px; margin-bottom: 24px;">
        Please 
        <a href="https://farm-pace-jplec623t-khayangas-projects.vercel.app/signin?callbackUrl=%2F" style="color: #4d7c0f; font-weight: bold; text-decoration: none;">
          login here
        </a> 
        and change your password immediately.
      </p>

      <hr style="border: 0; border-top: 1px solid #d1fae5; margin: 20px 0;" />

      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        FarmPace &copy; ${new Date().getFullYear()}
      </p>
    </div>
  </div>
`;

module.exports = { welcomeEmailTemplate };
