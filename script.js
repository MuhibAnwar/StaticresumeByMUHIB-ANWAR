var _a, _b, _c, _d;
// Get form and output elements
var resumeForm = document.getElementById('resume-form');
var resumeOutput = document.getElementById('resume-output');
var downloadButton = document.getElementById('downloadButton');
var resumeLink = document.getElementById('resume-link');
var shareableLinkContainer = document.getElementById('shareableLink');
var toggleEditButton = document.getElementById('toggle-edit');
// Profile Picture Preview and Storage
var profilePictureUrl = '';
// Add new skills, experiences, and education dynamically
var skillsContainer = document.getElementById('skills-container');
var experienceContainer = document.getElementById('experience-container');
var educationContainer = document.getElementById('education-container');
// Helper function to check null and safely append child elements
function appendChildSafely(parent, child) {
    if (parent) {
        parent.appendChild(child);
    }
    else {
        console.error("Parent element is not available for appending:", parent);
    }
}
// Add skill event listener
(_a = document.getElementById('add-skill')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    if (skillsContainer) {
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Skill';
        input.required = true;
        appendChildSafely(skillsContainer, input);
    }
});
// Add experience event listener
(_b = document.getElementById('add-experience')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    if (experienceContainer) {
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Experience';
        input.required = true;
        appendChildSafely(experienceContainer, input);
    }
});
// Add education event listener
(_c = document.getElementById('add-education')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    if (educationContainer) {
        var inputDegree = document.createElement('input');
        inputDegree.type = 'text';
        inputDegree.placeholder = 'Degree';
        inputDegree.required = true;
        var inputSchool = document.createElement('input');
        inputSchool.type = 'text';
        inputSchool.placeholder = 'School/University';
        inputSchool.required = true;
        appendChildSafely(educationContainer, inputDegree);
        appendChildSafely(educationContainer, inputSchool);
    }
});
// Handle Profile Picture upload
(_d = document.getElementById('profile-picture')) === null || _d === void 0 ? void 0 : _d.addEventListener('change', function (event) {
    var input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            profilePictureUrl = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) || '';
        };
        reader.readAsDataURL(input.files[0]);
    }
});
// Generate a unique resume ID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// Generate Resume
function generateResume(event) {
    var _a, _b, _c;
    event.preventDefault();
    if (!resumeOutput) {
        console.error("Resume output element not found.");
        return;
    }
    // Collect basic details
    var name = ((_a = document.getElementById('name')) === null || _a === void 0 ? void 0 : _a.value) || '';
    var email = ((_b = document.getElementById('email')) === null || _b === void 0 ? void 0 : _b.value) || '';
    var phone = ((_c = document.getElementById('phone')) === null || _c === void 0 ? void 0 : _c.value) || '';
    // Collect skills
    var skills = skillsContainer ? Array.from(skillsContainer.getElementsByTagName('input')).map(function (input) { return input.value; }) : [];
    // Collect experiences
    var experiences = experienceContainer ? Array.from(experienceContainer.getElementsByTagName('input')).map(function (input) { return input.value; }) : [];
    // Collect education
    var education = educationContainer ? Array.from(educationContainer.getElementsByTagName('input')).map(function (input) { return input.value; }) : [];
    // Generate resume HTML content
    resumeOutput.innerHTML = "\n        <h2>RESUME</h2>\n        <img src=\"".concat(profilePictureUrl, "\" alt=\"Profile Picture\" style=\"max-width: 100px;\"><br>\n        <p><strong>Name:</strong> ").concat(name, "</p>\n        <p><strong>Email:</strong> ").concat(email, "</p>\n        <p><strong>Phone:</strong> ").concat(phone, "</p>\n        \n        <h3>Education</h3>\n        <ul>").concat(education.map(function (edu, index) { return (index % 2 === 0 ? "<li><strong>Degree:</strong> ".concat(edu, "</li>") : "<li><strong>School:</strong> ".concat(edu, "</li>")); }).join(''), "</ul>\n        \n        <h3>Skills</h3>\n        <ul>").concat(skills.map(function (skill) { return "<li>".concat(skill, "</li>"); }).join(''), "</ul>\n        \n        <h3>Experience</h3>\n        <ul>").concat(experiences.map(function (experience) { return "<li>".concat(experience, "</li>"); }).join(''), "</ul>\n    ");
    // Show download and share buttons
    if (downloadButton && shareableLinkContainer) {
        downloadButton.style.display = 'block';
        shareableLinkContainer.style.display = 'block';
        // Generate a unique shareable link with resume data
        var resumeId = generateUUID();
        var resumeUrl = "".concat(window.location.origin).concat(window.location.pathname, "?resumeId=").concat(resumeId, "&name=").concat(encodeURIComponent(name), "&email=").concat(encodeURIComponent(email), "&phone=").concat(encodeURIComponent(phone));
        if (resumeLink)
            resumeLink.href = resumeUrl;
        // Display the shareable link
        shareableLinkContainer.innerHTML = "<a href=\"".concat(resumeUrl, "\" target=\"_blank\">Shareable Resume Link</a>");
    }
}
// Toggle between "edit" and "view" mode
function toggleEditMode() {
    if (!toggleEditButton)
        return;
    var inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(function (input) {
        var elem = input;
        elem.disabled = !elem.disabled; // Enable/disable form fields
    });
    toggleEditButton.textContent = toggleEditButton.textContent === 'Edit' ? 'Save' : 'Edit'; // Toggle button text
}
// Attach the event listener for generating the resume
resumeForm === null || resumeForm === void 0 ? void 0 : resumeForm.addEventListener('submit', generateResume);
// Attach the event listener for toggling edit mode
toggleEditButton === null || toggleEditButton === void 0 ? void 0 : toggleEditButton.addEventListener('click', toggleEditMode);
// Download as PDF feature using html2pdf
downloadButton === null || downloadButton === void 0 ? void 0 : downloadButton.addEventListener('click', function () {
    if (!resumeOutput) {
        console.error("Resume output element not found.");
        return;
    }
    var element = resumeOutput;
    window.html2pdf().from(element).set({
        margin: 1,
        filename: 'resume.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
});
