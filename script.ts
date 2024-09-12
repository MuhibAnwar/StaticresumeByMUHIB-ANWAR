// Get form and output elements
const resumeForm = document.getElementById('resume-form') as HTMLFormElement | null;
const resumeOutput = document.getElementById('resume-output') as HTMLElement | null;
const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement | null;
const resumeLink = document.getElementById('resume-link') as HTMLAnchorElement | null;
const shareableLinkContainer = document.getElementById('shareableLink') as HTMLElement | null;
const toggleEditButton = document.getElementById('toggle-edit') as HTMLButtonElement | null;

// Profile Picture Preview and Storage
let profilePictureUrl: string | ArrayBuffer | null = '';

// Add new skills, experiences, and education dynamically
const skillsContainer = document.getElementById('skills-container') as HTMLElement | null;
const experienceContainer = document.getElementById('experience-container') as HTMLElement | null;
const educationContainer = document.getElementById('education-container') as HTMLElement | null;

// Helper function to check null and safely append child elements
function appendChildSafely(parent: HTMLElement | null, child: HTMLElement): void {
    if (parent) {
        parent.appendChild(child);
    } else {
        console.error("Parent element is not available for appending:", parent);
    }
}

// Add skill event listener
document.getElementById('add-skill')?.addEventListener('click', () => {
    if (skillsContainer) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Skill';
        input.required = true;
        appendChildSafely(skillsContainer, input);
    }
});

// Add experience event listener
document.getElementById('add-experience')?.addEventListener('click', () => {
    if (experienceContainer) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Experience';
        input.required = true;
        appendChildSafely(experienceContainer, input);
    }
});

// Add education event listener
document.getElementById('add-education')?.addEventListener('click', () => {
    if (educationContainer) {
        const inputDegree = document.createElement('input');
        inputDegree.type = 'text';
        inputDegree.placeholder = 'Degree';
        inputDegree.required = true;

        const inputSchool = document.createElement('input');
        inputSchool.type = 'text';
        inputSchool.placeholder = 'School/University';
        inputSchool.required = true;

        appendChildSafely(educationContainer, inputDegree);
        appendChildSafely(educationContainer, inputSchool);
    }
});

// Handle Profile Picture upload
document.getElementById('profile-picture')?.addEventListener('change', function (event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePictureUrl = e.target?.result || '';
        };
        reader.readAsDataURL(input.files[0]);
    }
});

// Generate a unique resume ID
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Generate Resume
function generateResume(event: Event): void {
    event.preventDefault();

    if (!resumeOutput) {
        console.error("Resume output element not found.");
        return;
    }

    // Collect basic details
    const name = (document.getElementById('name') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value || '';

    // Collect skills
    const skills = skillsContainer ? Array.from(skillsContainer.getElementsByTagName('input')).map(input => input.value) : [];

    // Collect experiences
    const experiences = experienceContainer ? Array.from(experienceContainer.getElementsByTagName('input')).map(input => input.value) : [];

    // Collect education
    const education = educationContainer ? Array.from(educationContainer.getElementsByTagName('input')).map(input => input.value) : [];

    // Generate resume HTML content
    resumeOutput.innerHTML = `
        <h2>RESUME</h2>
        <img src="${profilePictureUrl}" alt="Profile Picture" style="max-width: 100px;"><br>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        <h3>Education</h3>
        <ul>${education.map((edu, index) => (index % 2 === 0 ? `<li><strong>Degree:</strong> ${edu}</li>` : `<li><strong>School:</strong> ${edu}</li>`)).join('')}</ul>
        
        <h3>Skills</h3>
        <ul>${skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
        
        <h3>Experience</h3>
        <ul>${experiences.map(experience => `<li>${experience}</li>`).join('')}</ul>
    `;

    // Show download and share buttons
    if (downloadButton && shareableLinkContainer) {
        downloadButton.style.display = 'block';
        shareableLinkContainer.style.display = 'block';

        // Generate a unique shareable link with resume data
        const resumeId = generateUUID();
        const resumeUrl = `${window.location.origin}${window.location.pathname}?resumeId=${resumeId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
        if (resumeLink) resumeLink.href = resumeUrl;

        // Display the shareable link
        shareableLinkContainer.innerHTML = `<a href="${resumeUrl}" target="_blank">Shareable Resume Link</a>`;
    }
}

// Toggle between "edit" and "view" mode
function toggleEditMode(): void {
    if (!toggleEditButton) return;

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const elem = input as HTMLInputElement | HTMLTextAreaElement;
        elem.disabled = !elem.disabled;  // Enable/disable form fields
    });
    toggleEditButton.textContent = toggleEditButton.textContent === 'Edit' ? 'Save' : 'Edit';  // Toggle button text
}

// Attach the event listener for generating the resume
resumeForm?.addEventListener('submit', generateResume);

// Attach the event listener for toggling edit mode
toggleEditButton?.addEventListener('click', toggleEditMode);

// Download as PDF feature using html2pdf
downloadButton?.addEventListener('click', () => {
    if (!resumeOutput) {
        console.error("Resume output element not found.");
        return;
    }

    const element = resumeOutput;
    (window as any).html2pdf().from(element).set({
        margin: 1,
        filename: 'resume.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
});
