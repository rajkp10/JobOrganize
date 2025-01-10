# JobOrganize

A desktop application to streamline the process of organizing and managing job applications. Built with Electron.js, Vanilla JavaScript, and Sass for styling, this app helps users maintain a systematic folder structure for resumes, job applications, and recruiter information—all stored locally on their system.

---

## 🚀 Features

### Directory Management

- **Resume Storage:** Select directories where resume files will be stored.
- **Job Applications:** Define the directory for storing job application details.

### Job Application Workflow

- **Job Details Form:** Fill out a form with details such as:
  - Job Description
  - Recruiter Details
  - Additional Notes
- **Automatic Folder Creation:** When the form is submitted, the app automatically:
  - Creates a folder for the company name.
  - Creates a subfolder for the job role.
- **File Management:**
  - Copies the selected resume file to the newly created job directory.
  - Generates a `jobDetails.txt` file containing all the information provided in the form.
  - Updates or creates a `recruiterDetails.csv` file with recruiter details.

### Application Management

- **View Job Details:** Navigate through the directory structure using the app's UI.
- **Edit Job Applications:** Modify the job application details directly from the app.
- **Delete Applications:** Remove directories and associated files using the app's interface.

### Systematic Local Storage

- Organizes all data in a well-structured folder hierarchy on your local system.

---

## 🛠️ Technologies Used

- **[Electron.js](https://www.electronjs.org/):** For building the desktop application.
- **Vanilla JavaScript:** Core application logic.
- **Sass:** For styling the user interface.

---

## 📦 Installation

1. Clone this repository:

```bash
git clone https://github.com/rajkp10/JobOrganize.git
```

2. Navigate to the project directory:

```bash
cd JobOrganize
```

3. Install dependencies:

```bash
npm install
```

4. Start the application:

```bash
npm start
```
