# New App - CV Generator

## Description

This application allows users to generate a professional CV by filling out a form with their personal information. The CV is generated using artificial intelligence and is designed to be accessible for blind users utilizing screen readers.

## User Journey

1. **Sign In**

   - The user opens the application.
   - They are presented with a sign-in page titled "Sign in with ZAPT".
   - Users can sign in using their preferred method (Google, Facebook, Apple, or email via magic link).
   - After successful authentication, the user is redirected to the home page.

2. **Fill in Personal Information**

   - On the home page, the user sees a form titled "Fill in your information".
   - The form includes fields for:
     - Name
     - Email
     - Phone
     - Address
     - Education
     - Experience
     - Skills
     - Summary
   - Each field is clearly labeled and accessible for screen readers.
   - The user fills out all the required fields with their information.

3. **Generate CV**

   - After completing the form, the user clicks the "Generate CV" button.
   - The application displays a loading state indicating that the CV is being generated.
   - The application sends the user's information to the backend AI service.
   - The AI generates a professional CV in Arabic in markdown format.

4. **View Generated CV**

   - Once the CV is generated, it is displayed on the page under the "Your Generated CV" section.
   - The CV is formatted and can be read easily.
   - The content is designed to be accessible and compatible with screen readers.

5. **Download CV**

   - The user has the option to download the generated CV as a Word document.
   - By clicking the "Download as Word Document" button, the CV is downloaded to their device in .docx format.

6. **Sign Out**

   - The user can sign out of the application by clicking the "Sign Out" button at the top right corner of the page.
   - After signing out, the user is redirected back to the sign-in page.

## External APIs and Libraries

- **ZAPT AI Platform**: Used for user authentication and handling events to generate the CV using AI.
- **OpenAI's GPT**: The backend uses GPT to generate the professional CV based on user input.
- **docx**: Used to generate the Word document version of the CV.
- **file-saver**: Used to prompt the user to download the generated Word document.

## Accessibility Features

- The application uses semantic HTML elements and proper labeling to ensure compatibility with screen readers.
- All form inputs have associated labels.
- The layout and navigation are designed to be simple and straightforward.
- The generated CV content is accessible and can be read by screen readers.
