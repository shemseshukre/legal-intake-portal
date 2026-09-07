# Legal Intake Portal

A responsive legal request intake portal built with **React, TypeScript, and Vite** as part of a React Developer technical assessment.

The application provides a structured interface for submitting and managing legal requests, with a dedicated Contract Review workflow, reusable form components, client-side validation, file upload handling, confirmation before submission, responsive navigation, accessibility considerations, and automated tests.

## Features

### Legal Request Navigation

* Contract Review
* Legal Research
* Compliance
* Other
* Interactive request-type navigation
* Keyboard-accessible navigation
* Responsive mobile sidebar

### Contract Review Request Form

The Contract Review workflow includes:

* Request title
* Contract type
* Requester name
* Requester email
* Required-by date
* Priority
* Request description
* Character counter
* Supporting document upload
* Save Draft
* Submit Request

### Form Validation

The form provides client-side validation for:

* Required fields
* Email format
* Required-by date
* Past dates
* Minimum description length
* Supported file types
* Maximum file size

Supported document types:

* PDF
* DOC
* DOCX

Maximum file size:

* 10 MB

### Submission Experience

The submission workflow includes:

1. Form validation
2. Confirmation dialog
3. Review or cancel option
4. Loading state
5. Submit action
6. Success feedback

### Draft Saving

Users can save incomplete requests as drafts.

For this technical assessment, draft and submitted request data are stored locally using browser `localStorage` to simulate persistence without requiring a backend API.

### Responsive Design

The interface is designed for:

* Desktop
* Tablet
* Mobile

The request navigation changes into a mobile drawer on smaller screens.

### Accessibility

The application includes basic accessibility practices such as:

* Semantic HTML
* Associated form labels
* Keyboard navigation
* ARIA attributes
* Accessible button names
* Focus management
* Accessible validation messages
* Dialog semantics
* Escape-key dialog handling
* Loading-state accessibility

## Technology Stack

* React
* TypeScript
* Vite
* CSS
* Vitest
* React Testing Library
* Testing Library User Event
* Jest DOM

## Project Structure

```text
src/
├── components/
│   ├── ConfirmationDialog.tsx
│   ├── FeedbackMessage.tsx
│   │
│   ├── Header/
│   │   └── Header.tsx
│   │
│   ├── RequestTypeSidebar/
│   │   ├── RequestTypeCard.tsx
│   │   └── RequestTypeSidebar.tsx
│   │
│   └── forms/
│       ├── ContractReviewForm.test.tsx
│       ├── ContractReviewForm.tsx
│       ├── FileUpload.tsx
│       ├── FormActions.tsx
│       ├── FormInput.tsx
│       ├── FormSelect.tsx
│       ├── RadioGroup.tsx
│       └── TextArea.tsx
│
├── pages/
│   ├── LegalIntakePage.test.tsx
│   └── LegalIntakePage.tsx
│
├── services/
│   └── legalRequestService.ts
│
├── test/
│   └── setup.ts
│
├── types/
│   └── legalRequest.ts
│
├── App.tsx
├── App.css
└── main.tsx

vitest.config.ts
package.json
README.md
```

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

### Installation

Clone the repository and navigate into the project:

```bash
git clone <your-repository-url>
cd legal-intake-portal
```

Install dependencies:

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will provide a local development URL, normally similar to:

```text
http://localhost:5173
```

Open the URL in a browser to use the application.

## Running Tests

The project uses **Vitest** and **React Testing Library**.

Run the test suite:

```bash
npm test -- --run
```

The current test suite contains **12 automated tests** covering the main form and request navigation workflows.

The tests cover:

* Empty-form validation
* Successful submission
* Draft saving
* Valid file upload
* Invalid file type
* Oversized file
* File removal
* Confirmation dialog
* Confirmation cancellation
* Character counter
* Submission loading state
* Request-type navigation

For interactive watch mode:

```bash
npm test
```

## TypeScript Validation

Run TypeScript checking without generating JavaScript files:

```bash
npx tsc --noEmit
```

## Production Build

Create a production build with:

```bash
npm run build
```

The build output is generated in the `dist/` directory.

## Application Workflow

The main Contract Review workflow is:

```text
Select Contract Review
        ↓
Complete Request Form
        ↓
Client-side Validation
        ↓
Submit Request
        ↓
Confirmation Dialog
        ↓
Confirm Submission
        ↓
Loading State
        ↓
Request Submitted
        ↓
Success Feedback
```

Users can also select **Save Draft** at any point to save the current form data.

## Data Persistence

Because this is a frontend technical assessment and no backend API was provided, the application uses browser `localStorage` as a lightweight persistence layer.

Two storage keys are used:

```text
legal-intake-drafts
legal-intake-requests
```

This allows the application to demonstrate the request workflow without requiring a backend service.

## Design and Component Approach

The application uses reusable React components rather than placing the entire interface inside a single component.

Examples include:

* `Header`
* `RequestTypeSidebar`
* `RequestTypeCard`
* `FormInput`
* `FormSelect`
* `RadioGroup`
* `TextArea`
* `FileUpload`
* `FormActions`
* `FeedbackMessage`
* `ConfirmationDialog`

This structure makes the application easier to maintain and provides reusable building blocks for additional legal request types.

## Future Improvements

If the application were extended beyond the assessment, the next improvements could include:

* Backend API integration
* Authentication and authorization
* Real request management
* Draft editing and deletion
* Submitted-request history
* Real notification system
* User profile management
* Server-side validation
* Secure document storage
* Request status tracking
* Additional request-specific forms
* End-to-end browser testing

## Assessment Notes

This project was developed as a practical React and TypeScript implementation exercise with emphasis on:

* Functional UI
* Component reusability
* Type safety
* Form handling
* Validation
* Accessibility
* Responsive design
* User interaction
* Automated testing
* Maintainable project structure

## Author

Developed as part of a React Developer technical assessment.
