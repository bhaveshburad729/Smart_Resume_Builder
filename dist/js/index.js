var usersname, switchno = 10, inputidcounter = 13, resultidcounter = 13;
var PersonalInfo = ['profile-job-title', 'firstname', 'lastname', 'countrycode', 'phone', 'country', 'state', 'user-description', 'address', 'postalcode', 'email'];
var ProffesionalInfo = ['compony', 'job-title', 'job-start-date', 'job-end-date', 'proffesional-description', 'current-job'];
var EducationalInfo = ['institute-name', 'institute-location', 'institute-start-date', 'institute-end-date', 'current-institute', 'institute-degree', 'institute-education', 'institute-description', 'institute-grade', 'institute-grade-in'];
var AdditionalSectionInfo = ['additional-description', 'additional-section-content', 'additional-section-title'];
var AccomplishmentInfo = ['award-name', 'awarded-by', 'award-date', 'award-description'];
var CertificationInfo = ['certification-link', 'certification-date', 'certification-by', 'certification-name', 'certification-description'];
var ProjectInfo = ['project-name', 'project-link', 'project-start', 'project-end', 'project-description', 'current-project']
var SocialInfo = ['social-link', 'social-link-for'];
var PublicationInfo = ['publication-link', 'publication-date', 'publication-details', 'publication-name', 'publication-description'];
var ResearchInfo = ['research-start-date', 'research-end-date', 'research-details', 'research-name', 'research-description', 'current-research'];
var Sections = ["Personal Information", "Proffesional Experince", "Education", "Key Skills", "Technical Skills", "Languages", "Certifications", "Accomplishments", "Projects", "Hobbies", "Publications", "Research", "Custom Section", "Declaration"]
const jsonData = {
    // professionalData: [],
    // educationalData: [],
    // socialData: [],
    // keySkillData: [],
    // technicalSkillData: [],
    // additionalData: [],
    // accomplishmentData: [],
    // certificationData: [],
    // projectData: [],
    // hobbiesData: [],
    // publicationData: [],
    // researchData: []
};
let isDarkMode = false;

// Move this function outside of DOMContentLoaded
function moveButtonsToMenu() {
    const menuList = document.querySelector('.menu-list');
    const bottomButtons = document.querySelector('.bottom-floating .columns');
    
    if (!bottomButtons || !menuList) return;

    // Create a container for the buttons in the menu
    const buttonContainer = document.createElement('li');
    buttonContainer.className = 'menu-buttons';

    // Define button mappings with their icons
    const buttonMappings = [
        {
            selector: '#theme-btn',
            icon: 'fa-solid fa-palette',
            text: 'Theme',
            handler: createThemeModal
        },
        {
            selector: '#font-btn',
            icon: 'fa-solid fa-font',
            text: 'Font',
            handler: createFontModal
        },
        {
            selector: '#analyze-btn',
            icon: 'fa-solid fa-chart-line',
            text: 'Analyze',
            handler: showResumeAnalysis  // Add direct handler
        },
        {
            selector: '#preview-button',
            icon: 'fa-solid fa-eye',
            text: 'Toggle Preview',
            handler: TogglePreview
        },
        {
            selector: '#download-btn',
            icon: 'fa-solid fa-download',
            text: 'Download',
            handler: showDownloadOptions
        },
        {
            selector: '#templates',
            icon: 'fa-solid fa-file',
            text: 'Templates',
            handler: showTemplates
        }
    ];

    // Move each button to the menu
    buttonMappings.forEach(mapping => {
        const originalButton = bottomButtons.querySelector(mapping.selector);
        if (!originalButton) return;

        const menuItem = document.createElement('li');
        menuItem.innerHTML = `
            <a class="menu-button-item">
                <i class="${mapping.icon} mr-2"></i>
                <span>${mapping.text}</span>
            </a>
        `;

        // Add click handler directly
        const menuButton = menuItem.querySelector('a');
        menuButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (mapping.handler) {
                mapping.handler();
            }
        });

        buttonContainer.appendChild(menuItem);
        originalButton.style.display = 'none';
    });

    // Handle color picker
    const colorPicker = bottomButtons.querySelector('#colorpicker');
    if (colorPicker) {
        const colorPickerItem = document.createElement('li');
        const newColorPicker = colorPicker.cloneNode(true);
        newColorPicker.id = 'menu-colorpicker';
        newColorPicker.className = 'menu-color-picker';
        
        colorPickerItem.innerHTML = `
            <div class="menu-button-item">
                <i class="fa-solid fa-palette mr-2"></i>
                <span>Theme Color</span>
            </div>
        `;
        colorPickerItem.querySelector('.menu-button-item').appendChild(newColorPicker);
        buttonContainer.appendChild(colorPickerItem);
        
        // Copy color picker functionality
        newColorPicker.value = colorPicker.value;
        newColorPicker.addEventListener('change', function(e) {
            colorPicker.value = e.target.value;
            colorPicker.dispatchEvent(new Event('change'));
        });
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .menu-buttons {
            margin-top: 1rem;
            border-top: 1px solid #dbdbdb;
            padding-top: 1rem;
        }
        
        .menu-button-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem;
            color: #4a4a4a;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        }
        
        .menu-button-item:hover {
            background-color: var(--primary-color);
            color: white;
            transform: translateX(5px);
        }
        
        .menu-color-picker {
            position: absolute;
            right: 1rem;
            width: 30px;
            height: 30px;
            padding: 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Add to menu
    menuList.appendChild(buttonContainer);
}

// Initialize after a delay to ensure all other scripts are loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(moveButtonsToMenu, 1000);
});

// Helper function to get icon classes
function getButtonIcon(buttonText) {
    const iconMap = {
        'Theme': 'fa-solid fa-palette',
        'Font': 'fa-solid fa-font',
        'Analyze': 'fa-solid fa-chart-line',
        'Hide Preview': 'fa-solid fa-eye',
        'Show Preview': 'fa-solid fa-eye',
        'Download': 'fa-solid fa-download',
        'Templates': 'fa-solid fa-file',
    };
    return iconMap[buttonText] || 'fa-solid fa-circle';
}

document.addEventListener('DOMContentLoaded', () => {
    var deletebutton = Array.from(document.querySelectorAll('.delete-button'));
    deletebutton.forEach(button => {
        button.addEventListener('click', () => {
            var id = (button.id).replaceAll('delete', '');
            var result = confirm("Do you really want to remove this Section ?");
            if (result) {
                document.getElementById(`div-input-${id}`).classList.add('is-hidden');
                document.getElementById(`div-result-${id}`).classList.add('is-hidden');
                document.getElementById(id).classList.add('is-hidden');
                document.getElementById(`additional-${id}`).parentElement.classList.remove('is-hidden');
            }
        })
    });

    document.getElementById('close-section').addEventListener('click', () => {
        document.getElementById('custom-title-input').classList.add('is-hidden');
    });
    document.getElementById('create-section').addEventListener('click', () => {
        CreateAdditionalSection();
    });
    document.getElementById('additional-12').addEventListener('click', () => {
        document.getElementById('custom-title-input').classList.remove('is-hidden');
    })
    var size = Array.from(document.querySelectorAll('.showcontent'));
    for (let i = 1; i <= size.length; i++) {
        document.getElementById(`switch${i}`).addEventListener('change', () => {
            RemoveContent(i);
        });
    }
    QuillEditor('proffesional', '0');
    QuillEditor('project', '0');
    QuillEditor('user', '');
    QuillEditor('certification', '0');
    QuillEditor('award', '0');
    QuillEditor('institute', '0');
    QuillEditor('research', '0');
    QuillEditor('publication', '0');
    QuillEditor('declaration', '');
    document.getElementById('imageswitch').addEventListener('change', () => {
        document.getElementById('imagecontainer').classList.toggle('is-hidden');
    });

    // Update the menu toggle functionality
    document.getElementById('edit').addEventListener('click', () => {
        const menuButtons = document.getElementById('menubuttons');
        const editButton = document.getElementById('edit');
        
        editButton.classList.toggle('has-background-link-light');
        menuButtons.classList.toggle('menu-open');
    });

    // Get the color picker element
    const colorPicker = document.getElementById('colorpicker');

    // Set an initial color value
    colorPicker.value = '#2f8d46';

    // Add an event listener to detect changes in the color picker
    colorPicker.addEventListener('change', function () {
        // Get the selected color
        const selectedColor = colorPicker.value;

        // Add or update the styles based on the selected color
        const elementsToChange = document.querySelectorAll('.customborderColor, .customcolor, .custombackgroundColor');
        elementsToChange.forEach(function (element) {
            if (element.classList.contains('customborderColor')) {
                element.style.borderTopColor = selectedColor;
            }
            if (element.classList.contains('customcolor')) {
                element.style.color = selectedColor;
            }
            if (element.classList.contains('custombackgroundColor')) {
                element.style.backgroundColor = selectedColor;
            }
        });
    });

    document.getElementById('userimage').addEventListener('change', function (event) {
        var input = event.target;
        var reader = new FileReader();

        reader.onload = function () {
            var previewImage = document.getElementById('userimage-result');
            previewImage.src = reader.result;
        };

        reader.readAsDataURL(input.files[0]);
    });


    const toggleButtons = document.querySelectorAll('.collapse');

    toggleButtons.forEach(button => {
        CollapseDiv(button);
    });
    AddEventListener();

    // Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle button is-ghost';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    // Load saved theme preference
    isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Add download button handler
    document.getElementById('download-btn').addEventListener('click', enhancedDownload);

    // Add theme selection functionality
    document.getElementById('theme-btn').addEventListener('click', createThemeModal);
    document.getElementById('font-btn').addEventListener('click', createFontModal);

    // Load saved preferences
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedFont = localStorage.getItem('selectedFont');

    if (savedTheme) applyTheme(savedTheme);
    if (savedFont) applyFont(savedFont);

    // Add this to your DOMContentLoaded event listener
    document.getElementById('analyze-btn').addEventListener('click', showResumeAnalysis);

    // Add to your DOMContentLoaded event listener
    document.getElementById('compress-btn').addEventListener('click', showCompressionDialog);

    // Move buttons to menu after a short delay
    setTimeout(() => {
        moveButtonsToMenu();
    }, 500);

    // Observe for any changes that might affect the buttons
    const observer = new MutationObserver((mutations) => {
        const bottomButtons = document.querySelector('.bottom-floating');
        if (bottomButtons && bottomButtons.style.display !== 'none') {
            moveButtonsToMenu();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

function AddAdditionalSection(id) {
    document.getElementById(`div-result-${id}`).classList.remove('is-hidden');
    document.getElementById(`div-input-${id}`).classList.remove('is-hidden');
    document.getElementById(id).classList.remove('is-hidden');
    document.getElementById(`additional-${id}`).parentNode.classList.add('is-hidden');
}
// Collapse the DIV
function CollapseDiv(button) {
    button.addEventListener('click', function () {
        const contentDiv = this.parentElement.parentElement.nextElementSibling;
        // Toggle the visibility of the content div
        contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';

        // Toggle the button text and animation
        if (contentDiv.style.display === 'none') {
            this.innerHTML = '<i class="fa-solid fa-angle-up"></i>';
        } else {
            this.innerHTML = '<i class="fa-solid fa-angle-down"></i>';
        }
    });
}
// Redirect to particular section
function RedirectDiv(div) {
    div = document.getElementById(div);
    var elem = document.getElementById(div);
    div.style.display = 'block';
    var scrollableDiv = document.getElementById("userdetails");
    if (elem && scrollableDiv) {
        scrollableDiv.scrollTo({
            top: elem.offsetTop,
            behavior: "smooth"
        });
    }
}
// Print PDF
function printDiv() {
    const divToPrint = document.getElementById('preview').innerHTML;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(`
      <html>
      <head>
        <title>Print Preview</title>
        <link rel="stylesheet" href="./dist/css/bulma.min.css">
        <link rel="stylesheet" href="./dist/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
          
          @media print {
            body * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              margin :0 important!;
            }
          }
        </style>
      </head>
      <body>
        ${divToPrint}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.onafterprint = function() {
                  setTimeout(function() {
                    window.location.reload();
                  }, 0);
                };
                window.close();
              }, 500);
            }, 0);
          };
        </script>
      </body>
      </html>
    `);
    iframe.contentDocument.close();

    iframe.onload = function () {
        setTimeout(function () {
            document.body.removeChild(iframe);
        }, 100);
    };
}
// Show preview
function showPreview() {
    const divToPreview = document.getElementById('preview').innerHTML;

    // Create the preview window
    const previewWindow = document.createElement('div');
    previewWindow.className = 'preview-window';
    previewWindow.innerHTML = divToPreview;

    // Create the close button
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.textContent = 'X';

    // Add event listener to close the preview window
    closeButton.addEventListener('click', function () {
        const overlay = document.querySelector('.overlay');
        overlay.classList.remove('show-overlay');
        document.body.removeChild(overlay);
        document.body.removeChild(previewWindow);
    });

    // Append the close button to the preview window
    previewWindow.appendChild(closeButton);

    // Create the overlay background
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    // Append the overlay and preview window to the body
    document.body.appendChild(overlay);
    document.body.appendChild(previewWindow);

    // Show the overlay
    overlay.classList.add('show-overlay');
}
// Function to create new Sub Section
const counters = {
    proffesional: 1,
    educational: 1,
    social: 1,
    keyskill: 1,
    technicalskill: 1,
    languages: 1,
    additional: 1,
    accomplishment: 1,
    certification: 1,
    project: 1,
    hobbies: 1,
    publication: 1,
    research: 1,
};
function Newsubsection(id, value) {
    // Update the counter for the given subsection
    const number = counters[value];
    const resultdiv = document.createElement('div');
    const resultdata = document.getElementById(`${value}-result0`).innerHTML.toString().replaceAll('0', number);
    resultdiv.innerHTML = resultdata;
    resultdiv.id = `${value}-result${number}`;
    document.getElementById(`${value}-result`).appendChild(resultdiv);
    const data = document.getElementById(id).innerHTML.toString().replaceAll('0', number).replaceAll('is-hidden', '');
    let datadiv;
    if (value === 'social') {
        const datatable = document.createElement('tbody');
        datatable.innerHTML = data;
        datatable.id = value + number;
        datadiv = datatable;
    } else {
        datadiv = document.createElement('div');
        datadiv.innerHTML = data;
        datadiv.id = value + number;
    }
    document.getElementById(value).appendChild(datadiv);
    counters[value]++;
    AddEventListener();
}
function QuillEditor(fieldname, number) {
    var quill = new Quill(`#${fieldname}-description${number}`, {
        theme: 'snow'
    });
}
// Function to removesubsection
function RemoveSubSection(elementId, value) {
    counters[value]--;
    const number = counters[value];
    const element = document.getElementById(elementId);
    const resultelement = document.getElementById(`${value}-result${number}`)
    if (resultelement) {
        resultelement.parentNode.removeChild(resultelement);
    }
    if (element) {
        element.parentNode.removeChild(element);
    }
}
// Functions to show the data on document
function ShowPersonalInfo() {
    var jobTitleInput = document.getElementById('profile-job-title');
    var jobTitleResult = document.getElementById('profile-job-title-result');
    jobTitleResult.innerHTML = '';
    if (jobTitleInput.value) {
        jobTitleResult.innerHTML = jobTitleInput.value;
        jsonData['jobTitle'] = jobTitleInput.value; // Add jobTitle to jsonData
    }

    var firstNameInput = document.getElementById('firstname');
    var lastNameInput = document.getElementById('lastname');
    var nameResult = document.getElementById('name-result');
    nameResult.innerHTML = '';
    if (firstNameInput.value || lastNameInput.value) {
        nameResult.innerHTML = capitalizeFirstLetter(firstNameInput.value) + ' ' + capitalizeFirstLetter(lastNameInput.value);
        usersname = firstNameInput.value + ' ' + lastNameInput.value;
        document.querySelector('#declaration-description .ql-editor').innerHTML = `I ${usersname} declare that all the above information is correct and I will be responsible if found any mistake in the information.`;
        jsonData['fullName'] = nameResult.innerHTML; // Add fullName to jsonData
    }

    var emailInput = document.getElementById('email');
    var emailResult = document.getElementById('email-result');
    emailResult.innerHTML = '';
    if (emailInput.value) {
        emailResult.innerHTML = `<i class="fa-solid fa-envelope"></i> <span>` + emailInput.value + '</span>';
        jsonData['email'] = emailInput.value; // Add email to jsonData
    }

    var countryCodeInput = document.getElementById('countrycode');
    var phoneInput = document.getElementById('phone');
    var phoneResult = document.getElementById('phone-result');
    phoneResult.innerHTML = '';
    if (countryCodeInput.value && phoneInput.value) {
        phoneResult.innerHTML = '<i class="fa-solid fa-phone mr-2"></i>' + '+' + countryCodeInput.value + ' ' + phoneInput.value;
        jsonData['phone'] = phoneResult.innerHTML; // Add phone to jsonData
    }

    var addressInput = document.getElementById('address');
    var cityInput = document.getElementById('city');
    var stateInput = document.getElementById('state');
    var countryInput = document.getElementById('country');
    var postalCodeInput = document.getElementById('postalcode');
    var addressResult = document.getElementById('address-result');
    addressResult.innerHTML = '';
    var addressData = [];
    if (addressInput.value) {
        addressData.push(`<i class="fa-solid fa-house mr-2"></i>${addressInput.value}`);
    }
    if (cityInput.value) {
        addressData.push(cityInput.value);
    }
    if (stateInput.value) {
        addressData.push(stateInput.value);
    }
    if (countryInput.value) {
        addressData.push(countryInput.value);
    }
    if (postalCodeInput.value) {
        addressData.push(postalCodeInput.value);
    }

    if (addressData.length > 0) {
        addressResult.innerHTML = addressData.join(', ');
        // Create a separate object to store address details
        jsonData['address'] = {
            street: addressInput.value,
            city: cityInput.value,
            state: stateInput.value,
            country: countryInput.value,
            postalCode: postalCodeInput.value
        };
    }

    var userDescriptionInput = document.getElementById('user-description');
    var userDescriptionResult = document.getElementById('user-description-result');
    userDescriptionResult.innerHTML = '';
    if (userDescriptionInput.textContent) {
        userDescriptionResult.innerHTML = getQuillContent('user-description');
        jsonData['userDescription'] = userDescriptionResult.innerHTML; // Add userDescription to jsonData
    }

    // Add resume strength analysis
    analyzeResumeStrength();
}
function ShowProffesionalInfo() {
    const professionalInfoData = {
        professionalData: [],
    };
    professionalInfoData.professionalData = []; // Clear previous data

    for (let i = 0; i < counters.proffesional; i++) {
        var companyInput = document.getElementById(`compony${i}`);
        var companyResult = document.getElementById(`compony-result${i}`);
        var jobTitleInput = document.getElementById(`job-title${i}`);
        var jobTitleResult = document.getElementById(`job-title-result${i}`);
        var jobStartDateInput = document.getElementById(`job-start-date${i}`);
        var jobStartDateResult = document.getElementById(`job-start-date-result${i}`);
        var currentJobCheckbox = document.getElementById(`current-job${i}`);
        var jobEndDateResult = document.getElementById(`job-end-date-result${i}`);
        var jobDescriptionResult = document.getElementById(`job-description-result${i}`);
        var quillContent = getQuillContent(`proffesional-description${i}`);

        // Create an object to store the data for this iteration
        const professionalDataItem = {
            company: companyInput.value,
            jobTitle: jobTitleInput.value,
            jobStartDate: jobStartDateInput.value,
            isCurrentJob: currentJobCheckbox.checked,
            jobEndDate: '',
            jobDescription: quillContent,
        };

        if (!professionalDataItem.isCurrentJob) {
            var jobEndDateInput = document.getElementById(`job-end-date${i}`);
            professionalDataItem.jobEndDate = jobEndDateInput.value;
        }

        // Calculate experience if both start and end dates are available
        if (professionalDataItem.jobStartDate && professionalDataItem.jobEndDate) {
            professionalDataItem.experience = calculateExperience(professionalDataItem.jobStartDate, professionalDataItem.jobEndDate);
        }

        // Append the data object to the JSON array
        professionalInfoData.professionalData.push(professionalDataItem);

        // Update the DOM elements
        companyResult.innerHTML = professionalDataItem.company;
        jobTitleResult.innerHTML = professionalDataItem.jobTitle;
        jobStartDateResult.innerHTML = professionalDataItem.jobStartDate ? ` | ${professionalDataItem.jobStartDate}` : '';
        jobEndDateResult.innerHTML = professionalDataItem.isCurrentJob ? '<strong>- </strong>Present' : professionalDataItem.jobEndDate ? `<strong> - </strong>${professionalDataItem.jobEndDate}${professionalDataItem.experience ? `<span style="width:50px;">( ${professionalDataItem.experience} )</span>` : ''}` : '';
        jobDescriptionResult.innerHTML = professionalDataItem.jobDescription;
    }

    // Convert the JSON object to a string to save it or send it elsewhere
    jsonData.professionalData = professionalInfoData;
}
function ShowEducationalInfo() {
    const educationalInfoData = {
        educationalData: []
    };
    educationalInfoData.educationalData = []; // Clear previous data

    for (let i = 0; i < counters.educational; i++) {
        // Get the data for each entry in the Educational section
        document.getElementById(`institute-location-result${i}`).innerHTML = ' at ' + document.getElementById(`institute-location${i}`).value;
        document.getElementById(`institute-name-result${i}`).innerHTML = ' from ' + document.getElementById(`institute-name${i}`).value;
        document.getElementById(`current-institute${i}`).checked ? document.getElementById(`institute-end-date-result${i}`).innerHTML = "- Present" : document.getElementById(`institute-end-date-result${i}`).innerHTML = ' - ' + document.getElementById(`institute-end-date${i}`).value;
        document.getElementById(`institute-start-date-result${i}`).innerHTML = ' | ' + document.getElementById(`institute-start-date${i}`).value;
        document.getElementById(`institute-description-result${i}`).innerHTML = document.getElementById(`institute-description${i}`).textContent;
        document.getElementById(`institute-education-result${i}`).innerHTML = document.getElementById(`institute-degree${i}`).value + ' in ' + document.getElementById(`institute-education${i}`).value;
        document.getElementById(`institute-grade-result${i}`).innerHTML = ' With grade ' + '<span class="has-text-weight-semibold has-text-grey">' + document.getElementById(`institute-grade${i}`).value + ' ' + document.getElementById(`institute-grade-in${i}`).value + '</span>';
        // Append the data object to the JSON array
    }

    // Convert the JSON object to a string to save it or send it elsewhere
    jsonData.educationalData = educationalInfoData;
}
function ShowKeySkills() {
    // Create an array to store key skills
    const keySkillsArray = [];

    for (let i = 0; i < counters.keyskill; i++) {
        // Get the value of each key skill
        const keySkill = document.getElementById(`key-skill${i}`).value;

        // Add the key skill to the array
        if (keySkill) {
            keySkillsArray.push(keySkill);
        }

        // Update the DOM elements (similar to the previous function)
        var result = document.getElementById(`keyskill-result${i}`);
        result.innerHTML = '';
        result.innerHTML = '<li>' + keySkill + '</li>';
    }

    // Store the key skills array in the JSON object
    jsonData.keySkills = keySkillsArray;
}
function TechnicalSkills() {
    // Create an array to store technical skills
    const technicalSkillsArray = [];

    for (let i = 0; i < counters.technicalskill; i++) {
        // Get the value of each technical skill
        const technicalSkill = document.getElementById(`technical-skill${i}`).value;

        // Add the technical skill to the array
        if (technicalSkill) {
            technicalSkillsArray.push(technicalSkill);
        }

        // Update the DOM element
        document.getElementById(`technicalskill-result${i}`).innerHTML = technicalSkill;
    }

    // Store the technical skills array in the JSON object
    jsonData.technicalSkillData = technicalSkillsArray;
}
function ShowLanguage() {
    // Create an array to store known languages
    const knownLanguagesArray = [];

    for (let i = 0; i < counters.languages; i++) {
        // Get the value of each known language
        const knownLanguage = document.getElementById(`known-language${i}`).value;

        // Add the known language to the array
        if (knownLanguage) {
            knownLanguagesArray.push(knownLanguage);
        }

        // Update the DOM element
        document.getElementById(`languages-result${i}`).innerHTML = knownLanguage;
    }

    // Store the known languages array in the JSON object
    jsonData.knownLanguages = knownLanguagesArray;
}
function ShowAccomplishment() {
    // Create an array to store accomplishments
    const accomplishmentsArray = [];

    for (let i = counters.accomplishment; i > 0; i--) {
        // Get the award name and awarded by values
        const awardName = document.getElementById(`award-name${i - 1}`).value;
        const awardedBy = document.getElementById(`awarded-by${i - 1}`).value;

        // Get the award date value
        const awardDate = document.getElementById(`award-date${i - 1}`).value;

        // Get the award description value using the getQuillContent() function
        const awardDescription = getQuillContent(`award-description${i - 1}`);

        // Create an object for each accomplishment
        const accomplishment = {
            awardName: awardName || '',
            awardedBy: awardedBy || '',
            awardDate: awardDate || '',
            awardDescription: awardDescription || ''
        };

        // Add the accomplishment object to the array
        accomplishmentsArray.push(accomplishment);

        // Update the DOM elements
        var awarnnameresult = document.getElementById(`award-result${i - 1}`);
        awarnnameresult.innerHTML = awardName ? (awardName + ' by ' + awardedBy) : '';
        var dateresult = document.getElementById(`award-date-result${i - 1}`);
        dateresult.innerHTML = awardDate;
        var descriptionresult = document.getElementById(`award-description-result${i - 1}`);
        descriptionresult.innerHTML = awardDescription;
    }

    // Store the accomplishments array in the JSON object
    jsonData.accomplishmentData = accomplishmentsArray;
}
function ShowCertifications() {
    // Create an array to store certifications
    const certificationsArray = [];

    for (let i = 0; i < counters.certification; i++) {
        // Get the certification link value
        const certificationLink = document.getElementById(`certification-link${i}`).value;

        // Get the certification date value
        const certificationDate = document.getElementById(`certification-date${i}`).value;

        // Get the certification by value
        const certificationBy = document.getElementById(`certification-by${i}`).value;

        // Get the certification name value
        const certificationName = document.getElementById(`certification-name${i}`).value;

        // Get the certification description value using the getQuillContent() function
        const certificationDescription = getQuillContent(`certification-description${i}`);

        // Create an object for each certification
        const certification = {
            certificationLink: certificationLink || '',
            certificationDate: certificationDate || '',
            certificationBy: certificationBy || '',
            certificationName: certificationName || '',
            certificationDescription: certificationDescription || ''
        };

        // Add the certification object to the array
        certificationsArray.push(certification);

        // Update the DOM elements
        var linkresult = document.getElementById(`certification-link-result${i}`);
        linkresult.innerHTML = certificationLink ? 'View Certificate' : '';
        linkresult.href = certificationLink;
        var certificatedateresult = document.getElementById(`certification-date-result${i}`);
        certificatedateresult.innerHTML = certificationDate ? '| ' + certificationDate : '';
        document.getElementById(`certification-by-result${i}`).innerHTML = certificationBy;
        document.getElementById(`certification-name-result${i}`).innerHTML = certificationName;
        var certificationDescriptionresult = document.getElementById(`certification-description-result${i}`);
        certificationDescriptionresult.innerHTML = certificationDescription;
    }

    // Store the certifications array in the JSON object
    jsonData.certificationData = certificationsArray;
}
function ShowProjects() {
    // Create an array to store project details
    const projectsArray = [];

    // Update the result elements for each project
    for (let i = 0; i < counters.project; i++) {
        // Get the project start date value and the checkbox value to determine the project end date
        const projectStart = document.getElementById(`project-start${i}`).value;
        const isCurrentProject = document.getElementById(`current-project${i}`).checked;
        const enddate = document.getElementById(`project-end${i}`).value;

        // Determine the project end date based on the checkbox value
        let projectEnd = '';
        if (isCurrentProject) {
            projectEnd = ' - Present';
        } else if (enddate) {
            projectEnd = ' - ' + enddate;
        }

        // Update the project date result element with the start and end dates
        document.getElementById(`project-date-result${i}`).innerHTML = projectStart + projectEnd;

        // Get the project name value and update the corresponding result element
        const projectName = document.getElementById(`project-name${i}`).value;
        document.getElementById(`project-name-result${i}`).innerHTML = projectName;

        // Get the project description value using the getQuillContent() function and update the corresponding result element
        const projectDescription = getQuillContent(`project-description${i}`);
        document.getElementById(`project-description-result${i}`).innerHTML = projectDescription;

        // Get the project link value and update the corresponding result element's href attribute
        const projectLink = document.getElementById(`project-link${i}`).value;
        var linkresult = document.getElementById(`project-link-result${i}`);
        linkresult.innerHTML = projectLink ? 'View Project' : '';
        linkresult.href = projectLink;

        // Create an object for each project
        const project = {
            projectStart: projectStart || '',
            isCurrentProject: isCurrentProject || false,
            projectEnd: isCurrentProject ? 'Present' : enddate || '',
            projectName: projectName || '',
            projectDescription: projectDescription || '',
            projectLink: projectLink || ''
        };

        // Add the project object to the array
        projectsArray.push(project);
    }

    // Store the projects array in the JSON object
    jsonData.projectData = projectsArray;
}
function ShowHobbies() {
    // Create an array to store hobby details
    const hobbiesArray = [];

    // Update the result elements for each hobby
    for (let i = 0; i < counters.hobbies; i++) {
        const hobbyName = document.getElementById(`hobby${i}`).value;
        const hobbiesResult = document.getElementById(`hobbies-result${i}`);
        hobbiesResult.innerHTML = '';

        // Update the corresponding result element with the hobby name
        if (hobbyName) {
            hobbiesResult.innerHTML = `<li>${hobbyName}</li>`;
        }

        // Add the hobby name to the hobbies array
        hobbiesArray.push(hobbyName);
    }

    // Store the hobbies array in the JSON object
    jsonData.hobbiesData = hobbiesArray;
}
function ShowSocialLinks() {
    // Create an array to store social link details
    const socialLinksArray = [];

    // Update the result elements for each social link
    for (let i = 0; i < counters.social; i++) {
        const linkFor = document.getElementById(`social-link-for${i}`).value;
        const textToShow = document.getElementById(`texttoshow${i}`).value;
        const socialLink = document.getElementById(`social-link${i}`).value;

        // Update the corresponding result elements with the social link details
        document.getElementById(`social-link-for-result${i}`).innerHTML = linkFor;
        document.getElementById(`texttoshow-result${i}`).innerHTML = textToShow;
        document.getElementById(`social-link-result${i}`).href = socialLink;

        // Create an object to represent the social link
        const socialLinkObject = {
            linkFor: linkFor,
            textToShow: textToShow,
            socialLink: socialLink
        };

        // Add the social link object to the social links array
        socialLinksArray.push(socialLinkObject);
    }

    // Store the social links array in the JSON object
    jsonData.socialData = socialLinksArray;
}
function ShowPublications() {
    // Create an array to store publication details
    const publicationsArray = [];

    // Update the result elements for each publication
    for (let i = 0; i < counters.publication; i++) {
        const publicationLink = document.getElementById(`publication-link${i}`).value;
        const publicationDate = document.getElementById(`publication-date${i}`).value;
        const publicationDetails = document.getElementById(`publication-details${i}`).value;
        const publicationName = document.getElementById(`publication-name${i}`).value;
        const publicationDescription = getQuillContent(`publication-description${i}`);

        // Update the corresponding result elements with the publication details
        var linkresult = document.getElementById(`publication-link-result${i}`);
        linkresult.innerHTML = '';
        if (publicationLink) {
            linkresult.innerHTML = "View Paper";
            linkresult.href = publicationLink;
        }

        var dateresult = document.getElementById(`publication-date-result${i}`);
        dateresult.innerHTML = '';
        if (publicationDate)
            dateresult.innerHTML = ' | ' + publicationDate;

        document.getElementById(`publication-by-result${i}`).innerHTML = publicationDetails;
        document.getElementById(`publication-name-result${i}`).innerHTML = publicationName;

        var descriptionresult = document.getElementById(`publication-description-result${i}`);
        descriptionresult.innerHTML = '';
        if (publicationDescription) {
            descriptionresult.innerHTML = publicationDescription;
        }

        // Create an object to represent the publication
        const publicationObject = {
            publicationLink: publicationLink,
            publicationDate: publicationDate,
            publicationDetails: publicationDetails,
            publicationName: publicationName,
            publicationDescription: publicationDescription
        };

        // Add the publication object to the publications array
        publicationsArray.push(publicationObject);
    }

    // Store the publications array in the JSON object
    jsonData.publicationData = publicationsArray;
}
function ShowResearch() {
    // Create an array to store research entries
    const researchArray = [];

    // Update the result elements for each research entry
    for (let i = 0; i < counters.research; i++) {
        const researchStartDate = document.getElementById(`research-start-date${i}`).value;
        const isCurrentResearch = document.getElementById(`current-research${i}`).checked;
        const researchEndDate = isCurrentResearch ? '<strong> - </strong>' + 'Present' : '<strong> - </strong>' + document.getElementById(`research-end-date${i}`).value;

        // Update the research date result element with the start and end dates
        document.getElementById(`research-date-result${i}`).innerHTML = researchStartDate + researchEndDate;

        const researchDetails = document.getElementById(`research-details${i}`).value;
        document.getElementById(`research-by-result${i}`).innerHTML = researchDetails;

        const researchName = document.getElementById(`research-name${i}`).value;
        document.getElementById(`research-name-result${i}`).innerHTML = researchName;

        const researchDescription = getQuillContent(`research-description${i}`);
        document.getElementById(`research-description-result${i}`).innerHTML = researchDescription;

        // Create an object to represent the research entry
        const researchObject = {
            researchStartDate: researchStartDate,
            isCurrentResearch: isCurrentResearch,
            researchEndDate: researchEndDate,
            researchDetails: researchDetails,
            researchName: researchName,
            researchDescription: researchDescription
        };

        // Add the research object to the research array
        researchArray.push(researchObject);
    }

    // Store the research array in the JSON object
    jsonData.research = researchArray;
}
function getDecarationText() {
    var username = document.getElementById('declaration-user-name')
    username.innerHTML = ''
    username.innerHTML = usersname;
    var description = document.getElementById('declaration-text')
    description.innerHTML = '';
    description.innerHTML = getQuillContent('declaration-description');
}
// Collapse the content from the document
function RemoveContent(switchnumber) {
    var div = document.getElementById(`div${switchnumber}`);
    var resultdiv = document.getElementById(`div-result-${switchnumber}`);
    if (document.getElementById(`switch${switchnumber}`).checked) {
        div.style.display = 'block';
        resultdiv.classList.remove('is-hidden');
    }
    else {
        var result = window.confirm("Do you really want to remove this it? After removing it won't appear in your resume.")
        if (result == true) {
            div.style.display = 'none';
            resultdiv.classList.add('is-hidden');
        }
    }
}
var flag = 1;
// Toggle Priview
function TogglePreview() {
    var userdetails = document.getElementById('userdetails');
    button = document.getElementById('preview-button');
    if (flag == 1) {
        userdetails.classList.remove('is-4');
        userdetails.classList.add('is-10')
        document.getElementById('preview').classList.add('is-hidden')
        flag = 0;
        button.innerHTML = "Show Priview";
    }
    else {
        userdetails.classList.remove('is-10');
        userdetails.classList.add('is-4')
        document.getElementById('preview').classList.remove('is-hidden')
        button.innerHTML = "Hide Priview";
        flag = 1;
    }

}
function AddEventListener() {
    var menubuttons = document.querySelectorAll('#menubuttons li');
    i = 0;
    menubuttons.forEach(button => {
        button.addEventListener('click', () => {
            var div = `div${button.id}`
            RedirectDiv(div);
            var redirectLink = document.getElementById(`redirect${button.id}`);
            window.location.href = redirectLink.href;
            redirectLink.click();
            i++;
        });
    })
    PersonalInfo.forEach(info => {
        document.getElementById(info).addEventListener('input', ShowPersonalInfo);
    });
    // Function to add event listeners to sections with similar patterns
    function addEventListenersForSections(section, infoArray, showFunction) {
        for (let i = 0; i < counters[section]; i++) {
            for (let j = 0; j < infoArray.length; j++) {
                const element = infoArray[j] + i;
                document.getElementById(element).addEventListener('input', showFunction);
            }
        }
    }

    // Event Listener for menubuttons
    var menubuttons = document.querySelectorAll('#menubuttons li');
    menubuttons.forEach(button => {
        button.addEventListener('click', () => {
            var div = `div${button.id}`;
            RedirectDiv(div);
            var redirectLink = document.getElementById(`redirect${button.id}`);
            window.location.href = redirectLink.href;
            redirectLink.click();
        });
    });

    // Event Listener for Result Name Section

    for (let i = 0; i < Object.keys(counters).length; i++) {
        document.getElementById(`title-${i + 1}`).addEventListener('input', () => {
            var result = document.getElementById(`title-${i + 1}`);
            document.getElementById(`title-result-${i + 1}`).innerHTML = result.innerHTML || Sections[i + 1];
        });
    }

    // Event Listeners for PersonalInfo
    PersonalInfo.forEach(info => {
        document.getElementById(info).addEventListener('input', ShowPersonalInfo);
    });

    // Event Listeners for various sections using the addEventListenersForSections function
    addEventListenersForSections('social', SocialInfo, ShowSocialLinks);
    addEventListenersForSections('proffesional', ProffesionalInfo, ShowProffesionalInfo);
    addEventListenersForSections('educational', EducationalInfo, ShowEducationalInfo);
    addEventListenersForSections('keyskill', ['key-skill'], ShowKeySkills);
    addEventListenersForSections('technicalskill', ['technical-skill'], TechnicalSkills);
    addEventListenersForSections('languages', ['known-language'], ShowLanguage);
    addEventListenersForSections('hobbies', ['hobby'], ShowHobbies);
    addEventListenersForSections('certification', CertificationInfo, ShowCertifications);
    addEventListenersForSections('project', ProjectInfo, ShowProjects);
    addEventListenersForSections('accomplishment', AccomplishmentInfo, ShowAccomplishment);
    addEventListenersForSections('publication', PublicationInfo, ShowPublications);
    addEventListenersForSections('research', ResearchInfo, ShowResearch);


    // Event Listeners for Declaration Section
    document.getElementById('declaration-description').addEventListener('input', getDecarationText);


    // Get references to the button and the notification placeholder
    const button = document.getElementById('templates');
    const notificationPlaceholder = document.getElementById('notification-placeholder');

    // Add a click event listener to the button
    button.addEventListener('click', () => {
        // Create the notification element
        const notification = document.createElement('div');
        notification.className = 'notification is-warning centered-notification'; // Added 'centered-notification' class
        notification.textContent = "Unlock a world of endless possibilities. The future is arriving sooner than you think!";

        // Append the notification to the placeholder
        notificationPlaceholder.appendChild(notification);

        // Remove the notification after 2 seconds
        setTimeout(() => {
            notification.remove();
        }, 4000);
    });
}
// Function to handle drag start event
function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.innerHTML);
    event.dataTransfer.setData("text/plain", event.target.dataset.sectionId);
    event.target.classList.add("dragged");
}
// Function to handle drag over event
function allowDrop(event) {
    event.preventDefault();

    const targetElement = event.target;
    const isContainer = targetElement.classList.contains('container');
    const isDraggable = targetElement.getAttribute('draggable') === 'false';

    if (isContainer && isDraggable) {
        return false;
    }
}
// Function to handle drop event
function drop(event, containerId) {
    event.preventDefault();
    const draggedSection = document.querySelector('.container[draggable="true"].dragged');
    const targetSection = event.target.closest('.container');
    // Check if the target or any parent element is the specified div with draggable="false"
    if (targetSection && targetSection.getAttribute('draggable') === 'false') {
        return; // Prevent dropping above the specified div
    }

    if (draggedSection && targetSection) {
        const draggedIndex = getIndex(containerId, draggedSection);
        const targetIndex = getIndex(containerId, targetSection);
        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
            const container = document.getElementById(containerId);
            const sections = Array.from(container.querySelectorAll('.container'));

            // Remove the dragged section from the container
            container.removeChild(draggedSection);

            // Insert the dragged section at the target position
            if (targetIndex === sections.length) {
                // If the target index is the last position, append the dragged section
                container.appendChild(draggedSection);
            } else {
                // Otherwise, insert the dragged section before the target section
                container.insertBefore(draggedSection, sections[targetIndex]);
            }

            // Update result container with animation
            const resultContainer = document.getElementById('userdetails-result');
            const resultSections = Array.from(resultContainer.querySelectorAll('.divsection'));

            const draggedSectionId = draggedSection.id;
            const resultSectionId = `div-result-${draggedSectionId.split('-')[2]}`;
            const resultDraggedSection = document.getElementById(resultSectionId);
            const resultTargetSection = resultSections[targetIndex];

            if (resultDraggedSection && resultTargetSection && resultDraggedSection.parentNode === resultContainer) {
                // Remove the result dragged section from the result container
                resultContainer.removeChild(resultDraggedSection);
                // Insert the result dragged section at the target position
                if (targetIndex === resultSections.length) {
                    // If the target index is the last position, append the result dragged section
                    resultContainer.appendChild(resultDraggedSection);
                } else {
                    // Otherwise, insert the result dragged section before the target section
                    const nextResultSection = resultSections[targetIndex + 1];
                    resultContainer.insertBefore(resultDraggedSection, nextResultSection);
                }
            }
        }
    }

    // Remove the "dragged" class from the dragged section
    draggedSection.classList.remove('dragged');
}
// Function to get the index of a section within a container
function getIndex(containerId, section) {
    const container = document.getElementById(containerId);
    const sections = container.querySelectorAll('.container');
    for (let i = 0; i < sections.length; i++) {
        if (sections[i] === section) {
            return i;
        }
    }
    return -1;
}
// function to get the QuillContent
function getQuillContent(id) {
    var quilleditor = document.getElementById(id);
    return quilleditor.querySelector('.ql-editor').innerHTML;
}
// Calculate Experience
function calculateExperience(startDateId, endDateId) {
    var startDate = document.getElementById(startDateId).value;
    var endDate = document.getElementById(endDateId).value;

    var startYear = parseInt(startDate.slice(0, 4));
    var startMonth = parseInt(startDate.slice(5));

    var endYear, endMonth;

    if (endDate) {
        endYear = parseInt(endDate.slice(0, 4));
        endMonth = parseInt(endDate.slice(5));
    } else {
        var currentDate = new Date();
        endYear = currentDate.getFullYear();
        endMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based month
    }

    var yearsDiff = endYear - startYear;
    var monthsDiff = endMonth - startMonth;
    var totalMonths = yearsDiff * 12 + monthsDiff;

    var years = Math.floor(totalMonths / 12);
    var months = totalMonths % 12;

    var result = "";

    if (years > 0) {
        result += years + (years > 1 ? " years" : " year");
    }

    if (months > 0) {
        if (years > 0) {
            result += " and ";
        }
        result += months + (months > 1 ? " months" : " month");
    }

    if (years === 0 && months === 0) {
        result = "Less than a month";
    }
    return result;
}
function CreateAdditionalSection() {
    var addtional_section_container = document.getElementById('additional-section-container');
    var addtional_section_resultcontainer = document.getElementById('additional-section-result-container');
    var colsebutton = document.getElementById('close-section');

    var title = document.getElementById('section-name').value.trim();
    if (title) {
        inputidcounter++;
        resultidcounter++;
        SectionTitle = title;
        var li = document.createElement('li');
        li.id = inputidcounter;
        li.innerHTML = `<a href="#div-input-${inputidcounter}" class="has-text-weight-semibold"> ${SectionTitle}</a>`
        document.getElementById('menubuttons').appendChild(li);
        title = title.toLowerCase().replaceAll(' ', '-');


        // Create and append the input div
        var inputdivdata = document.getElementById('div-input-12').innerHTML;
        inputdivdata = inputdivdata.replaceAll('12', inputidcounter).replaceAll('additional', title);
        var inputdiv = document.createElement('div');
        inputdiv.id = `div-input-${inputidcounter}`;
        inputdiv.classList.add('container');
        inputdiv.innerHTML = inputdivdata;
        addtional_section_container.appendChild(inputdiv);


        // Create and append the result div
        var resultdivdata = document.getElementById('div-result-12').innerHTML;
        resultdivdata = resultdivdata.replaceAll('12', resultidcounter).replaceAll('additional', title);
        var resultdiv = document.createElement('div');
        resultdiv.id = `div-result-${resultidcounter}`;
        resultdiv.innerHTML = resultdivdata;
        addtional_section_resultcontainer.appendChild(resultdiv);

        // Update the title and result text using textContent
        document.getElementById(`title-result-${resultidcounter}`).textContent = SectionTitle;
        document.getElementById(`title-${resultidcounter}`).textContent = SectionTitle;

        // Click the close button to collapse the section
        colsebutton.click();

        // Add event listeners for the new subsection
        var InputArray = [`${title}-description`, `${title}-section-content`, `${title}-section-title`];
        AddAdditionalEventListener(InputArray, title);

        // Initialize the counter for the new subsection
        counters[title] = 1;
    } else {
        alert("Please enter Section Name");
    }
}
// Function to add Additional Event Listeners
function AddAdditionalEventListener(arr, title) {
    arr.forEach(element => {
        document.getElementById(`${element}0`).addEventListener('input', () => {
            ShowAdditionalContent(title);
        });
    });
    QuillEditor(title, 0);
}
function ShowAdditionalContent(element) {
    // Create an array to store additional content entries
    const additionalContentArray = [];

    // Update the result elements for each additional content entry
    for (let i = 0; i < counters[element]; i++) {
        const sectionTitle = document.getElementById(`${element}-section-title${i}`).value;
        document.getElementById(`${element}-section-title-result${i}`).innerHTML = sectionTitle;

        const description = getQuillContent(`${element}-description${i}`);
        document.getElementById(`${element}-section-description-result${i}`).innerHTML = description;

        const sectionContent = document.getElementById(`${element}-section-content${i}`).value;
        document.getElementById(`${element}-section-content-result${i}`).innerHTML = sectionContent;

        // Create an object to represent the additional content entry
        const additionalContentObject = {
            sectionTitle: sectionTitle,
            description: description,
            sectionContent: sectionContent
        };

        // Add the additional content object to the additional content array
        additionalContentArray.push(additionalContentObject);
    }

    // Store the additional content array in the JSON object
    jsonData[element] = additionalContentArray;
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function PushJson() {
    // const dbRef = firebase.database().ref();
    // // Push the JSON data to the Realtime Database
    // dbRef.push(jsonData)
    //     .then(() => {
    //         console.log("Data successfully pushed to Realtime Database.");
    //     })
    //     .catch((error) => {
    //         console.error("Error pushing data to Realtime Database:", error);
    //     });
    // downloadJSONFile(jsonData, `${document.getElementById('name-result').innerHTML}.json`);
}

// Download 
function downloadJSONFile(data, filename) {
    const jsonString = JSON.stringify(data, null, 2); // Convert JSON object to a formatted string
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename || "data.json"; // Default filename if not provided
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Add accessibility improvements to form inputs
function addAccessibilityFeatures() {
    // Add ARIA labels and roles
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        const label = input.previousElementSibling;
        if (label && label.textContent) {
            input.setAttribute('aria-label', label.textContent.trim());
        }
        input.setAttribute('role', 'textbox');
    });
    
    // Add keyboard navigation
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                el.click();
            }
        });
    });
}

// Add resume strength analyzer
function analyzeResumeStrength() {
    const strengthIndicators = {
        hasPhoto: !!document.getElementById('userimage-result').src,
        hasJobTitle: !!document.getElementById('profile-job-title').value,
        hasContact: !!document.getElementById('phone').value,
        hasEmail: !!document.getElementById('email').value,
        hasDescription: !!getQuillContent('user-description'),
        hasSkills: counters.keyskill > 1,
        hasProfessionalExp: counters.proffesional > 1
    };
    
    const score = Object.values(strengthIndicators).filter(Boolean).length;
    const percentage = (score / Object.keys(strengthIndicators).length) * 100;
    
    // Create or update strength indicator
    let strengthDiv = document.getElementById('resume-strength');
    if (!strengthDiv) {
        strengthDiv = document.createElement('div');
        strengthDiv.id = 'resume-strength';
        strengthDiv.className = 'box mt-3';
        document.getElementById('userdetails').appendChild(strengthDiv);
    }
    
    strengthDiv.innerHTML = `
        <h3 class="title is-5">Resume Strength: ${percentage.toFixed(0)}%</h3>
        <progress class="progress ${getStrengthColor(percentage)}" value="${percentage}" max="100"></progress>
        <div class="content">
            <ul>
                ${!strengthIndicators.hasPhoto ? '<li>Add a professional photo to improve visibility</li>' : ''}
                ${!strengthIndicators.hasJobTitle ? '<li>Include your current job title</li>' : ''}
                ${!strengthIndicators.hasDescription ? '<li>Add a compelling professional summary</li>' : ''}
                ${!strengthIndicators.hasSkills ? '<li>List more relevant skills</li>' : ''}
                ${!strengthIndicators.hasProfessionalExp ? '<li>Add your work experience</li>' : ''}
            </ul>
        </div>
    `;
}

function getStrengthColor(percentage) {
    if (percentage >= 80) return 'is-success';
    if (percentage >= 60) return 'is-info';
    if (percentage >= 40) return 'is-warning';
    return 'is-danger';
}

// Format options for different document types
const formatOptions = {
  PDF: {
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '20mm',
      right: '20mm'
    }
  },
  DOCX: {
    orientation: 'portrait',
    margins: {
      top: 1440,
      bottom: 1440,
      left: 1800,
      right: 1800
    }
  }
};

// Download as PDF function using browser's print functionality
function downloadAsPDF(paperSize, includePhoto) {
  try {
    const element = document.getElementById('preview');
    if (!element) {
      throw new Error('Preview element not found');
    }

    // Hide photo if not included
    const photoElement = document.getElementById('imagecontainer');
    const wasHidden = photoElement?.classList.contains('is-hidden');
    if (!includePhoto && !wasHidden && photoElement) {
      photoElement.classList.add('is-hidden');
    }

    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.open();
    
    // Add necessary styles
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <link rel="stylesheet" href="./dist/css/bulma.min.css">
          <link rel="stylesheet" href="./dist/css/style.css">
          <style>
            body {
              padding: 20mm;
              width: ${paperSize === 'A4' ? '210mm' : '216mm'};
              margin: 0 auto;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page {
                size: ${paperSize} portrait;
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Restore photo visibility after printing
    if (!includePhoto && !wasHidden && photoElement) {
      photoElement.classList.remove('is-hidden');
    }

    showNotification('Print dialog opened. Save as PDF to download.', 'success');

  } catch (error) {
    console.error('Error in downloadAsPDF:', error);
    showNotification('Error preparing PDF download. Please try again.', 'danger');
  }
}

// Download as DOCX function using native download
function downloadAsDOCX(paperSize, includePhoto) {
  try {
    const element = document.getElementById('preview');
    if (!element) {
      throw new Error('Preview element not found');
    }

    // Hide photo if not included
    const photoElement = document.getElementById('imagecontainer');
    const wasHidden = photoElement?.classList.contains('is-hidden');
    if (!includePhoto && !wasHidden && photoElement) {
      photoElement.classList.add('is-hidden');
    }

    // Create a clean version of the HTML content
    const content = element.cloneNode(true);
    
    // Convert special characters
    const htmlContent = content.innerHTML
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/[–—]/g, "-");

    // Create the document content with basic Word styling
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: Calibri, sans-serif;
            font-size: 11pt;
            margin: ${paperSize === 'A4' ? '25.4mm' : '25mm'};
          }
          /* Add your other styles here */
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([docContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${document.getElementById('name-result').innerHTML || 'resume'}_resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Restore photo visibility
    if (!includePhoto && !wasHidden && photoElement) {
      photoElement.classList.remove('is-hidden');
    }

    showNotification('Document downloaded successfully!', 'success');

  } catch (error) {
    console.error('Error in downloadAsDOCX:', error);
    showNotification('Error preparing DOCX download. Please try again.', 'danger');
  }
}

// Add notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification is-${type} centered-notification`;
  notification.innerHTML = `
    <button class="delete"></button>
    ${message}
  `;
  
  document.getElementById('notification-placeholder').appendChild(notification);
  
  // Add close button functionality
  notification.querySelector('.delete').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Update enhancedDownload to use notifications
function enhancedDownload() {
  try {
    // Create download options modal
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Download Options</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Format</label>
            <div class="control">
              <div class="select">
                <select id="download-format">
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="JSON">JSON (Data Only)</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Paper Size</label>
            <div class="control">
              <div class="select">
                <select id="paper-size">
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="checkbox">
              <input type="checkbox" id="include-photo">
              Include Photo
            </label>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" id="download-confirm">Download</button>
          <button class="button" id="download-cancel">Cancel</button>
        </footer>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle modal close
    const closeModal = () => {
      modal.remove();
    };

    modal.querySelector('.delete').addEventListener('click', closeModal);
    modal.querySelector('#download-cancel').addEventListener('click', closeModal);

    // Handle download confirmation
    modal.querySelector('#download-confirm').addEventListener('click', () => {
      const format = modal.querySelector('#download-format').value;
      const paperSize = modal.querySelector('#paper-size').value;
      const includePhoto = modal.querySelector('#include-photo').checked;

      try {
        // Apply automated formatting before download
        autoFormat();
        
        showNotification(`Preparing ${format} download...`, 'info');
        
        switch (format) {
          case 'PDF':
            downloadAsPDF(paperSize, includePhoto);
            break;
          case 'DOCX':
            downloadAsDOCX(paperSize, includePhoto);
            break;
          case 'JSON':
            downloadJSONFile(jsonData, `${document.getElementById('name-result').innerHTML || 'resume'}_data.json`);
            break;
          default:
            throw new Error('Invalid format selected');
        }

        closeModal();
        showNotification('Download started!', 'success');
      } catch (error) {
        console.error('Error in download:', error);
        showNotification('Error preparing download. Please try again.', 'danger');
      }
    });

  } catch (error) {
    console.error('Error in enhancedDownload:', error);
    showNotification('Error opening download options. Please try again.', 'danger');
  }
}

// Automated formatting function
function autoFormat() {
  // Get the resume container
  const resumeContainer = document.getElementById('preview');

  // Apply consistent spacing
  const sections = resumeContainer.querySelectorAll('.divsection');
  sections.forEach(section => {
    section.style.marginBottom = '1.5rem';
    section.style.pageBreakInside = 'avoid';
  });

  // Format text content
  const textElements = resumeContainer.querySelectorAll('p, li');
  textElements.forEach(element => {
    // Capitalize first letter of sentences
    element.innerHTML = element.innerHTML.replace(/([.!?]\s+)([a-z])/g, 
      (match, p1, p2) => p1 + p2.toUpperCase()
    );
    
    // Fix common formatting issues
    element.innerHTML = element.innerHTML
      .replace(/\s+/g, ' ') // Remove extra spaces
      .replace(/\s+([.,!?])/g, '$1') // Remove spaces before punctuation
      .trim();
  });

  // Ensure consistent date formats
  const dateElements = resumeContainer.querySelectorAll('[id$="-date-result"]');
  dateElements.forEach(element => {
    if (element.textContent) {
      const date = new Date(element.textContent);
      if (!isNaN(date)) {
        element.textContent = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
      }
    }
  });

  // Ensure consistent list formatting
  const lists = resumeContainer.querySelectorAll('ul');
  lists.forEach(list => {
    list.style.listStylePosition = 'inside';
    list.style.paddingLeft = '1rem';
  });
}

// Add these theme definitions
const themes = {
  default: {
    primary: '#2f8d46',
    background: '#ffffff',
    text: '#4a4a4a',
    headerBg: '#2f8d46',
    headerText: '#ffffff',
    sectionTitle: '#2f8d46',
    borderColor: '#dbdbdb'
  },
  modern: {
    primary: '#3273dc',
    background: '#f5f5f5',
    text: '#363636',
    headerBg: '#3273dc',
    headerText: '#ffffff',
    sectionTitle: '#3273dc',
    borderColor: '#3273dc'
  },
  elegant: {
    primary: '#6b4c9a',
    background: '#ffffff',
    text: '#2c3e50',
    headerBg: '#6b4c9a',
    headerText: '#ffffff',
    sectionTitle: '#6b4c9a',
    borderColor: '#6b4c9a'
  },
  minimal: {
    primary: '#363636',
    background: '#ffffff',
    text: '#4a4a4a',
    headerBg: '#363636',
    headerText: '#ffffff',
    sectionTitle: '#363636',
    borderColor: '#dbdbdb'
  },
  creative: {
    primary: '#ff3860',
    background: '#ffffff',
    text: '#4a4a4a',
    headerBg: '#ff3860',
    headerText: '#ffffff',
    sectionTitle: '#ff3860',
    borderColor: '#ff3860'
  },
  corporate: {
    primary: '#1a237e',
    background: '#ffffff',
    text: '#333333',
    headerBg: '#1a237e',
    headerText: '#ffffff',
    sectionTitle: '#1a237e',
    borderColor: '#e0e0e0'
  },
  executive: {
    primary: '#2c3e50',
    background: '#ecf0f1',
    text: '#2c3e50',
    headerBg: '#34495e',
    headerText: '#ffffff',
    sectionTitle: '#2c3e50',
    borderColor: '#bdc3c7'
  },
  business: {
    primary: '#0277bd',
    background: '#ffffff',
    text: '#424242',
    headerBg: '#0277bd',
    headerText: '#ffffff',
    sectionTitle: '#0277bd',
    borderColor: '#b3e5fc'
  },
  tech: {
    primary: '#00bcd4',
    background: '#fafafa',
    text: '#212121',
    headerBg: '#00bcd4',
    headerText: '#ffffff',
    sectionTitle: '#00838f',
    borderColor: '#80deea'
  },
  startup: {
    primary: '#7c4dff',
    background: '#ffffff',
    text: '#333333',
    headerBg: '#7c4dff',
    headerText: '#ffffff',
    sectionTitle: '#651fff',
    borderColor: '#b388ff'
  },
  digital: {
    primary: '#00e676',
    background: '#fafafa',
    text: '#212121',
    headerBg: '#00c853',
    headerText: '#ffffff',
    sectionTitle: '#00c853',
    borderColor: '#69f0ae'
  },
  traditional: {
    primary: '#795548',
    background: '#efebe9',
    text: '#3e2723',
    headerBg: '#795548',
    headerText: '#efebe9',
    sectionTitle: '#4e342e',
    borderColor: '#bcaaa4'
  },
  formal: {
    primary: '#263238',
    background: '#ffffff',
    text: '#263238',
    headerBg: '#37474f',
    headerText: '#ffffff',
    sectionTitle: '#263238',
    borderColor: '#cfd8dc'
  },
  conservative: {
    primary: '#3e2723',
    background: '#d7ccc8',
    text: '#3e2723',
    headerBg: '#3e2723',
    headerText: '#d7ccc8',
    sectionTitle: '#3e2723',
    borderColor: '#a1887f'
  },
  artistic: {
    primary: '#e91e63',
    background: '#fce4ec',
    text: '#880e4f',
    headerBg: '#c2185b',
    headerText: '#ffffff',
    sectionTitle: '#d81b60',
    borderColor: '#f48fb1'
  },
  vibrant: {
    primary: '#ff4081',
    background: '#ffffff',
    text: '#212121',
    headerBg: '#ff4081',
    headerText: '#ffffff',
    sectionTitle: '#f50057',
    borderColor: '#ff80ab'
  },
  dynamic: {
    primary: '#651fff',
    background: '#ffffff',
    text: '#212121',
    headerBg: '#651fff',
    headerText: '#ffffff',
    sectionTitle: '#6200ea',
    borderColor: '#b388ff'
  },
  nordic: {
    primary: '#455a64',
    background: '#eceff1',
    text: '#263238',
    headerBg: '#455a64',
    headerText: '#ffffff',
    sectionTitle: '#37474f',
    borderColor: '#b0bec5'
  },
  minimal2: {
    primary: '#212121',
    background: '#fafafa',
    text: '#212121',
    headerBg: '#424242',
    headerText: '#ffffff',
    sectionTitle: '#212121',
    borderColor: '#e0e0e0'
  },
  clean: {
    primary: '#546e7a',
    background: '#ffffff',
    text: '#37474f',
    headerBg: '#546e7a',
    headerText: '#ffffff',
    sectionTitle: '#455a64',
    borderColor: '#90a4ae'
  },
  ocean: {
    primary: '#006064',
    background: '#e0f7fa',
    text: '#006064',
    headerBg: '#006064',
    headerText: '#e0f7fa',
    sectionTitle: '#00838f',
    borderColor: '#4dd0e1'
  },
  forest: {
    primary: '#2e7d32',
    background: '#f1f8e9',
    text: '#1b5e20',
    headerBg: '#2e7d32',
    headerText: '#f1f8e9',
    sectionTitle: '#388e3c',
    borderColor: '#81c784'
  },
  sunset: {
    primary: '#ff6f00',
    background: '#fff3e0',
    text: '#e65100',
    headerBg: '#ff6f00',
    headerText: '#fff3e0',
    sectionTitle: '#f57c00',
    borderColor: '#ffb74d'
  },
  lavender: {
    primary: '#5e35b1',
    background: '#f3e5f5',
    text: '#4a148c',
    headerBg: '#5e35b1',
    headerText: '#f3e5f5',
    sectionTitle: '#512da8',
    borderColor: '#9575cd'
  },
  ruby: {
    primary: '#c62828',
    background: '#ffebee',
    text: '#b71c1c',
    headerBg: '#c62828',
    headerText: '#ffebee',
    sectionTitle: '#d32f2f',
    borderColor: '#e57373'
  }
};

// Add font families (you'll need to provide the actual font files)
const fonts = {
  default: {
    name: 'Calibri',
    family: 'Calibri, sans-serif'
  },
  professional: {
    name: 'Roboto',
    family: '"Roboto", sans-serif'
  },
  modern: {
    name: 'Open Sans',
    family: '"Open Sans", sans-serif'
  },
  elegant: {
    name: 'Playfair Display',
    family: '"Playfair Display", serif'
  },
  creative: {
    name: 'Poppins',
    family: '"Poppins", sans-serif'
  },
  montserrat: {
    name: 'Montserrat',
    family: '"Montserrat", sans-serif'
  },
  raleway: {
    name: 'Raleway',
    family: '"Raleway", sans-serif'
  },
  sourceSansPro: {
    name: 'Source Sans Pro',
    family: '"Source Sans Pro", sans-serif'
  },
  lato: {
    name: 'Lato',
    family: '"Lato", sans-serif'
  },
  nunito: {
    name: 'Nunito',
    family: '"Nunito", sans-serif'
  },
  merriweather: {
    name: 'Merriweather',
    family: '"Merriweather", serif'
  },
  crimsonText: {
    name: 'Crimson Text',
    family: '"Crimson Text", serif'
  },
  spectral: {
    name: 'Spectral',
    family: '"Spectral", serif'
  },
  lora: {
    name: 'Lora',
    family: '"Lora", serif'
  },
  sourceSerifPro: {
    name: 'Source Serif Pro',
    family: '"Source Serif Pro", serif'
  },
  inter: {
    name: 'Inter',
    family: '"Inter", sans-serif'
  },
  manrope: {
    name: 'Manrope',
    family: '"Manrope", sans-serif'
  },
  rubik: {
    name: 'Rubik',
    family: '"Rubik", sans-serif'
  },
  workSans: {
    name: 'Work Sans',
    family: '"Work Sans", sans-serif'
  },
  dmSans: {
    name: 'DM Sans',
    family: '"DM Sans", sans-serif'
  },
  josefinSans: {
    name: 'Josefin Sans',
    family: '"Josefin Sans", sans-serif'
  },
  quicksand: {
    name: 'Quicksand',
    family: '"Quicksand", sans-serif'
  },
  comfortaa: {
    name: 'Comfortaa',
    family: '"Comfortaa", cursive'
  },
  overpass: {
    name: 'Overpass',
    family: '"Overpass", sans-serif'
  },
  urbanist: {
    name: 'Urbanist',
    family: '"Urbanist", sans-serif'
  },
  outfit: {
    name: 'Outfit',
    family: '"Outfit", sans-serif'
  },
  plusJakartaSans: {
    name: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", sans-serif'
  },
  sora: {
    name: 'Sora',
    family: '"Sora", sans-serif'
  },
  figtree: {
    name: 'Figtree',
    family: '"Figtree", sans-serif'
  },
  redHatDisplay: {
    name: 'Red Hat Display',
    family: '"Red Hat Display", sans-serif'
  }
};

// Add theme selection functionality
function createThemeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal is-active';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Select Theme</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline">
          ${Object.entries(themes).map(([key, theme]) => `
            <div class="column is-half">
              <div class="box theme-preview" data-theme="${key}" style="cursor: pointer; border: 2px solid ${theme.primary}">
                <h3 class="title is-5" style="color: ${theme.primary}">${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div style="background: ${theme.headerBg}; color: ${theme.headerText}; padding: 0.5rem; margin-bottom: 0.5rem">
                  Header
                </div>
                <div style="color: ${theme.text}">
                  Sample text
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listeners
  const closeModal = () => modal.remove();
  modal.querySelector('.delete').addEventListener('click', closeModal);
  modal.querySelector('.modal-background').addEventListener('click', closeModal);

  // Theme selection
  modal.querySelectorAll('.theme-preview').forEach(preview => {
    preview.addEventListener('click', () => {
      applyTheme(preview.dataset.theme);
      closeModal();
    });
  });
}

// Add font selection functionality
function createFontModal() {
  const modal = document.createElement('div');
  modal.className = 'modal is-active';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
                <p class="modal-card-title">Choose Font Style</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
                <div class="font-options">
                    <div class="font-category">
                        <h3 class="category-title">Professional Fonts</h3>
                        <div class="font-grid">
                            <div class="font-option" data-font="Arial">
                                <div class="font-preview" style="font-family: Arial">
                                    <span class="font-logo">A</span>
                                    <h4>Arial</h4>
                                    <p>Professional & Clean</p>
              </div>
            </div>
                            <div class="font-option" data-font="Georgia">
                                <div class="font-preview" style="font-family: Georgia">
                                    <span class="font-logo">G</span>
                                    <h4>Georgia</h4>
                                    <p>Classic & Elegant</p>
                                </div>
                            </div>
                            <div class="font-option" data-font="Helvetica">
                                <div class="font-preview" style="font-family: Helvetica">
                                    <span class="font-logo">H</span>
                                    <h4>Helvetica</h4>
                                    <p>Modern & Clear</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="font-category">
                        <h3 class="category-title">Creative Fonts</h3>
                        <div class="font-grid">
                            <div class="font-option" data-font="Roboto">
                                <div class="font-preview" style="font-family: Roboto">
                                    <span class="font-logo">R</span>
                                    <h4>Roboto</h4>
                                    <p>Contemporary & Bold</p>
                                </div>
                            </div>
                            <div class="font-option" data-font="Open Sans">
                                <div class="font-preview" style="font-family: 'Open Sans'">
                                    <span class="font-logo">O</span>
                                    <h4>Open Sans</h4>
                                    <p>Friendly & Approachable</p>
                                </div>
                            </div>
                            <div class="font-option" data-font="Lato">
                                <div class="font-preview" style="font-family: Lato">
                                    <span class="font-logo">L</span>
                                    <h4>Lato</h4>
                                    <p>Balanced & Warm</p>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
      </section>
    </div>
  `;

    // Add styles for the enhanced font modal
    const fontModalStyles = document.createElement('style');
    fontModalStyles.textContent = `
        .font-options {
            padding: 1rem;
        }

        .font-category {
            margin-bottom: 2rem;
        }

        .category-title {
            font-size: 1.2rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--primary-color);
        }

        .font-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .font-option {
            cursor: pointer;
            padding: 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .font-option:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .font-option.selected {
            border-color: var(--primary-color);
            background: rgba(var(--primary-color-rgb), 0.1);
        }

        .font-preview {
            text-align: center;
        }

        .font-logo {
            display: block;
            font-size: 3rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            transform: scale(1);
            transition: transform 0.3s ease;
        }

        .font-option:hover .font-logo {
            transform: scale(1.2);
        }

        .font-preview h4 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: #363636;
        }

        .font-preview p {
            font-size: 0.9rem;
            color: #666;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }

        .font-option:hover .font-preview p {
            opacity: 1;
            transform: translateY(0);
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .font-option.selected .font-logo {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(fontModalStyles);

  // Add event listeners
    modal.querySelectorAll('.font-option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove previous selection
            modal.querySelectorAll('.font-option').forEach(opt => opt.classList.remove('selected'));
            // Add selection to clicked option
            option.classList.add('selected');
            // Apply the font
            applyFont(option.dataset.font);
        });
    });

    modal.querySelector('.delete').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.modal-background').addEventListener('click', () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Apply selected theme
function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  document.documentElement.style.setProperty('--primary-color', theme.primary);
  document.documentElement.style.setProperty('--background-color', theme.background);
  document.documentElement.style.setProperty('--text-color', theme.text);
  document.documentElement.style.setProperty('--header-bg', theme.headerBg);
  document.documentElement.style.setProperty('--header-text', theme.headerText);
  document.documentElement.style.setProperty('--section-title', theme.sectionTitle);
  document.documentElement.style.setProperty('--border-color', theme.borderColor);

  // Save theme preference
  localStorage.setItem('selectedTheme', themeName);
  
  showNotification(`Theme "${themeName}" applied successfully!`, 'success');
}

// Apply selected font
function applyFont(fontKey) {
  const font = fonts[fontKey];
  if (!font) return;

  document.documentElement.style.setProperty('--primary-font', font.family);
  
  // Save font preference
  localStorage.setItem('selectedFont', fontKey);
  
  showNotification(`Font "${font.name}" applied successfully!`, 'success');
}

// Add this function to handle resume analysis
function showResumeAnalysis() {
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Advanced Resume Analysis</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="content">
                    <!-- Overall Score with Circular Progress -->
                    <div class="analysis-section">
                    <div class="level">
                        <div class="level-item has-text-centered">
                            <div>
                                    <p class="heading">Overall Resume Strength</p>
                                    <div class="circular-progress">
                                        <div class="inner">
                                            <span id="overall-score">0%</span>
                            </div>
                        </div>
                    </div>
                                </div>
                            </div>
                    </div>

                    <!-- Detailed Analysis Tabs -->
                    <div class="tabs is-boxed">
                        <ul>
                            <li class="is-active"><a data-tab="scores">Section Scores</a></li>
                            <li><a data-tab="keywords">Keyword Analysis</a></li>
                            <li><a data-tab="suggestions">Suggestions</a></li>
                        </ul>
                    </div>

                    <!-- Section Scores Tab -->
                    <div id="scores-tab" class="tab-content">
                        <div class="section-scores">
                            <div class="score-item">
                                <div class="score-header">
                                    <span class="score-label">Personal Info</span>
                                    <span class="score-value" id="personal-score-value">0%</span>
                                </div>
                                <progress class="progress" id="personal-score" value="0" max="100"></progress>
                            </div>
                            <div class="score-item">
                                <div class="score-header">
                                    <span class="score-label">Professional Experience</span>
                                    <span class="score-value" id="experience-score-value">0%</span>
                                </div>
                                <progress class="progress" id="experience-score" value="0" max="100"></progress>
                            </div>
                            <div class="score-item">
                                <div class="score-header">
                                    <span class="score-label">Education</span>
                                    <span class="score-value" id="education-score-value">0%</span>
                                </div>
                                <progress class="progress" id="education-score" value="0" max="100"></progress>
                            </div>
                            <div class="score-item">
                                <div class="score-header">
                                    <span class="score-label">Skills</span>
                                    <span class="score-value" id="skills-score-value">0%</span>
                                </div>
                                <progress class="progress" id="skills-score" value="0" max="100"></progress>
                            </div>
                            <div class="score-item">
                                <div class="score-header">
                                    <span class="score-label">Content Quality</span>
                                    <span class="score-value" id="content-score-value">0%</span>
                                </div>
                                <progress class="progress" id="content-score" value="0" max="100"></progress>
                            </div>
                        </div>
                    </div>

                    <!-- Keyword Analysis Tab -->
                    <div id="keywords-tab" class="tab-content is-hidden">
                        <div class="field">
                            <label class="label">Industry-Relevant Keywords Found</label>
                            <div id="keywords-container" class="tags"></div>
                        </div>
                        <div class="field">
                            <label class="label">Action Verbs Used</label>
                            <div id="action-verbs-container" class="tags"></div>
                        </div>
                        <div class="field">
                            <label class="label">Missing Important Keywords</label>
                            <div id="missing-keywords" class="notification is-warning is-light"></div>
                        </div>
                    </div>

                    <!-- Suggestions Tab -->
                    <div id="suggestions-tab" class="tab-content is-hidden">
                        <div class="suggestions-container">
                            <div id="critical-suggestions" class="notification is-danger is-light">
                                <h4 class="title is-6">Critical Improvements</h4>
                                <ul></ul>
                            </div>
                            <div id="important-suggestions" class="notification is-warning is-light">
                                <h4 class="title is-6">Important Suggestions</h4>
                                <ul></ul>
                            </div>
                            <div id="minor-suggestions" class="notification is-info is-light">
                                <h4 class="title is-6">Minor Enhancements</h4>
                                <ul></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);

    // Add tab switching functionality
    const tabs = modal.querySelectorAll('.tabs li');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            
            const tabContents = modal.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.add('is-hidden'));
            
            const targetTab = tab.querySelector('a').getAttribute('data-tab');
            modal.querySelector(`#${targetTab}-tab`).classList.remove('is-hidden');
        });
    });

    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.delete, .modal-background');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => modal.remove());
    });

    // Start the analysis
    analyzeResumeStrength();

    // Add new styles
    const newStyles = document.createElement('style');
    newStyles.textContent = `
        .circular-progress {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: conic-gradient(#48c774 var(--progress), #dbdbdb var(--progress));
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .circular-progress .inner {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
        }

        .score-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .tags .tag {
            margin: 0.2rem;
        }

        .suggestions-container > div {
            margin-bottom: 1rem;
        }

        .tab-content {
            padding: 1rem 0;
        }
    `;
    document.head.appendChild(newStyles);
}

function analyzeResumeStrength() {
    // Get all sections data
    const personalInfo = {
        name: document.getElementById('firstname')?.value || '',
        lastName: document.getElementById('lastname')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        description: document.querySelector('#user-description .ql-editor')?.textContent || ''
    };

    const experience = Array.from(document.querySelectorAll('[id^="proffesional-description"]')).map(exp => ({
        company: exp.closest('.field')?.querySelector('[id^="compony"]')?.value || '',
        title: exp.closest('.field')?.querySelector('[id^="job-title"]')?.value || '',
        description: exp.querySelector('.ql-editor')?.textContent || ''
    }));

    const education = Array.from(document.querySelectorAll('[id^="institute-description"]')).map(edu => ({
        institution: edu.closest('.field')?.querySelector('[id^="institute-name"]')?.value || '',
        degree: edu.closest('.field')?.querySelector('[id^="institute-degree"]')?.value || '',
        description: edu.querySelector('.ql-editor')?.textContent || ''
    }));

    const skills = Array.from(document.querySelectorAll('.skill-input')).map(skill => skill.value).filter(Boolean);

    // Calculate scores
    const scores = {
        personal: calculatePersonalScore(personalInfo),
        experience: calculateExperienceScore(experience),
        education: calculateEducationScore(education),
        skills: calculateSkillsScore(skills)
    };

    // Update UI with scores
    updateScoresUI(scores);

    // Generate and display suggestions
    generateSuggestions(scores, personalInfo, experience, education, skills);
}

function calculatePersonalScore(info) {
    let score = 0;
    if (info.name) score += 20;
    if (info.lastName) score += 20;
    if (info.email) score += 20;
    if (info.phone) score += 20;
    if (info.description.length > 50) score += 20;
    return score;
}

function calculateExperienceScore(experience) {
    if (!experience.length) return 0;
    let score = Math.min(experience.length * 30, 60);
    
    experience.forEach(exp => {
        if (exp.description.length > 100) score += 10;
    });

    return Math.min(score, 100);
}

function calculateEducationScore(education) {
    if (!education.length) return 0;
    let score = Math.min(education.length * 40, 80);
    
    education.forEach(edu => {
        if (edu.description.length > 50) score += 10;
    });

    return Math.min(score, 100);
}

function calculateSkillsScore(skills) {
    if (!skills.length) return 0;
    return Math.min(skills.length * 10, 100);
}

function updateScoresUI(scores) {
    // Update section progress bars
    document.getElementById('personal-score').value = scores.personal;
    document.getElementById('experience-score').value = scores.experience;
    document.getElementById('education-score').value = scores.education;
    document.getElementById('skills-score').value = scores.skills;

    // Calculate and update overall score
    const overallScore = Math.round((scores.personal + scores.experience + scores.education + scores.skills) / 4);
    document.getElementById('overall-score').textContent = `${overallScore}%`;
    
    // Update progress bars colors based on scores
    updateProgressColors();
}

function updateProgressColors() {
    document.querySelectorAll('.progress').forEach(progress => {
        const value = parseInt(progress.value);
        progress.classList.remove('is-success', 'is-warning', 'is-danger');
        if (value >= 80) progress.classList.add('is-success');
        else if (value >= 40) progress.classList.add('is-warning');
        else progress.classList.add('is-danger');
    });
}

function generateSuggestions(scores, personal, experience, education, skills) {
    const criticalSuggestions = [];
    const importantSuggestions = [];
    const minorSuggestions = [];

    // Personal Section Analysis
    if (scores.personal < 100) {
        if (!personal.name || !personal.lastName) {
            criticalSuggestions.push('Add your full name to your resume');
        }
        if (!personal.description) {
            criticalSuggestions.push('Add a professional summary to make your resume stand out');
        } else if (personal.description.length < 100) {
            importantSuggestions.push('Your professional summary is too short. Aim for 100-200 characters');
        }
        if (!personal.phone && !personal.email) {
            criticalSuggestions.push('Add contact information (phone and email)');
        } else if (!personal.phone || !personal.email) {
            importantSuggestions.push('Add both phone and email for better reachability');
        }
    }

    // Experience Analysis with more detail
    if (experience.length === 0) {
        criticalSuggestions.push('Add work experience to your resume');
    } else {
        experience.forEach((exp, index) => {
            if (!exp.company) {
                criticalSuggestions.push(`Add company name for position ${index + 1}`);
            }
            if (!exp.title) {
                criticalSuggestions.push(`Add job title for ${exp.company || `position ${index + 1}`}`);
            }
            if (!exp.description) {
                importantSuggestions.push(`Add description for your role at ${exp.company || `position ${index + 1}`}`);
            } else if (exp.description.length < 150) {
                minorSuggestions.push(`Consider adding more details about your achievements at ${exp.company || `position ${index + 1}`}`);
            }
        });

        if (experience.length < 2) {
            importantSuggestions.push('Consider adding more work experiences to show career progression');
        }
    }

    // Education Analysis with more detail
    if (education.length === 0) {
        criticalSuggestions.push('Add your educational background');
    } else {
        education.forEach((edu, index) => {
            if (!edu.institution) {
                criticalSuggestions.push(`Add institution name for education entry ${index + 1}`);
            }
            if (!edu.degree) {
                importantSuggestions.push(`Add degree/qualification for ${edu.institution || `education entry ${index + 1}`}`);
            }
            if (!edu.description) {
                minorSuggestions.push(`Add description for your education at ${edu.institution || `entry ${index + 1}`}`);
            }
        });
    }

    // Skills Analysis with categories
    if (skills.length === 0) {
        criticalSuggestions.push('Add skills to your resume');
    } else {
        if (skills.length < 5) {
            importantSuggestions.push('Add more skills - aim for at least 5 key skills');
        }
        if (skills.length < 8) {
            minorSuggestions.push('Consider adding more diverse skills (both technical and soft skills)');
        }
    }

    // Content Quality Suggestions
    const allContent = JSON.stringify({ personal, experience, education, skills }).toLowerCase();
    const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'led', 'achieved'];
    const actionVerbsFound = actionVerbs.filter(verb => allContent.includes(verb));
    
    if (actionVerbsFound.length < 3) {
        importantSuggestions.push('Use more action verbs (e.g., "managed," "developed," "achieved")');
    }

    if (allContent.includes('responsible for')) {
        minorSuggestions.push('Replace "responsible for" with stronger action verbs');
    }

    // Update UI with animations and sorting
    updateSuggestionsWithAnimation('critical-suggestions', sortSuggestions(criticalSuggestions));
    updateSuggestionsWithAnimation('important-suggestions', sortSuggestions(importantSuggestions));
    updateSuggestionsWithAnimation('minor-suggestions', sortSuggestions(minorSuggestions));

    // Update counts with animation
    updateSuggestionCounts(criticalSuggestions.length, importantSuggestions.length, minorSuggestions.length);
}

function sortSuggestions(suggestions) {
    return suggestions.sort((a, b) => b.length - a.length);
}

function updateSuggestionsWithAnimation(containerId, suggestions) {
    const container = document.getElementById(containerId);
    const list = container.querySelector('ul');
    
    if (suggestions.length) {
        list.innerHTML = suggestions.map((suggestion, index) => `
            <li class="suggestion-item">
                <i class="fas ${getSuggestionIcon(containerId)} mr-2"></i>
                <span class="suggestion-text">${suggestion}</span>
                <button class="button is-small is-rounded fix-button">
                    <span class="icon is-small">
                        <i class="fas fa-magic"></i>
                    </span>
                    <span>Fix</span>
                </button>
            </li>
        `).join('');
        container.classList.remove('is-hidden');
    } else {
        container.classList.add('is-hidden');
    }
}

// Add this new style block
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .suggestion-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .suggestion-item:hover {
        transform: translateX(5px);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .suggestion-text {
        flex: 1;
        margin: 0 1rem;
    }

    .fix-button {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .suggestion-item:hover .fix-button {
        opacity: 1;
    }

    #critical-suggestions .suggestion-item {
        border-left: 4px solid #f14668;
    }

    #important-suggestions .suggestion-item {
        border-left: 4px solid #ffdd57;
    }

    #minor-suggestions .suggestion-item {
        border-left: 4px solid #3298dc;
    }
`;
document.head.appendChild(additionalStyles);

// Add these compression-related functions with working libraries
async function showCompressionDialog() {
    // First load required libraries
    await loadCompressionLibraries();
    
    const modal = document.createElement('div');
    modal.className = 'modal is-active compression-dialog';
    modal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Compress File</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="file has-name is-fullwidth mb-4">
                    <label class="file-label">
                        <input class="file-input" type="file" id="file-to-compress" 
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">Choose file</span>
                            </span>
                        <span class="file-name">No file selected</span>
                    </label>
                </div>
                
                <div class="field">
                    <label class="label">Compression Level</label>
                    <div class="control">
                        <div class="select is-fullwidth">
                            <select id="compression-level">
                                <option value="high">High (Smaller Size)</option>
                                <option value="medium" selected>Medium (Balanced)</option>
                                <option value="low">Low (Better Quality)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="compression-progress" class="is-hidden">
                    <progress class="progress is-primary" value="0" max="100">0%</progress>
                    <p class="help">Compressing... <span id="compression-status">0%</span></p>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-primary" id="start-compression">Compress</button>
                <button class="button" id="cancel-compression">Cancel</button>
            </footer>
        </div>
    `;

    document.body.appendChild(modal);
    setupCompressionEventListeners(modal);
}

async function loadCompressionLibraries() {
    // Load required libraries dynamically
    const libraries = [
        'https://cdnjs.cloudflare.com/ajax/libs/compressorjs/1.1.1/compressor.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
        'https://unpkg.com/jimp/browser/lib/jimp.min.js'
    ];

    for (const lib of libraries) {
        await loadScript(lib);
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function setupCompressionEventListeners(modal) {
    const fileInput = modal.querySelector('.file-input');
    const fileName = modal.querySelector('.file-name');

    fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files[0]?.name || 'No file selected';
    });

    modal.querySelector('.delete').addEventListener('click', () => modal.remove());
    modal.querySelector('#cancel-compression').addEventListener('click', () => modal.remove());
    modal.querySelector('#start-compression').addEventListener('click', () => compressDocument(modal));
}

async function compressDocument(modal) {
    const file = modal.querySelector('#file-to-compress').files[0];
    if (!file) {
        showNotification('Please select a file to compress', 'warning');
        return;
    }

    const compressionLevel = modal.querySelector('#compression-level').value;
    const progressBar = modal.querySelector('.progress');
    const progressStatus = modal.querySelector('#compression-status');
    const progressDiv = modal.querySelector('#compression-progress');

    progressDiv.classList.remove('is-hidden');
    modal.querySelector('#start-compression').disabled = true;

    try {
        const compressedFile = await compressFile(file, compressionLevel, (progress) => {
            progressBar.value = progress;
            progressStatus.textContent = `${progress}%`;
        });

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedFile);
        downloadLink.download = `compressed_${file.name}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        showNotification('File compressed successfully!', 'success');
        modal.remove();
    } catch (error) {
        console.error('Compression error:', error);
        showNotification('Error compressing file. Please try again.', 'danger');
    }
}

async function compressFile(file, compressionLevel, progressCallback) {
    const settings = getCompressionSettings(compressionLevel);
    
    if (file.type.startsWith('image/')) {
        return await compressImage(file, settings, progressCallback);
    } else if (file.type === 'application/pdf') {
        return await compressPDF(file, settings, progressCallback);
    } else {
        throw new Error('Unsupported file type');
    }
}

function getCompressionSettings(level) {
    return {
        high: {
            quality: 0.6,
            maxWidth: 1920,
            maxHeight: 1080,
            pdfQuality: 0.7
        },
        medium: {
            quality: 0.8,
            maxWidth: 2560,
            maxHeight: 1440,
            pdfQuality: 0.85
        },
        low: {
            quality: 0.9,
            maxWidth: 3840,
            maxHeight: 2160,
            pdfQuality: 0.95
        }
    }[level];
}

async function compressImage(file, settings, progressCallback) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: settings.quality,
            maxWidth: settings.maxWidth,
            maxHeight: settings.maxHeight,
            success(result) {
                progressCallback(100);
                resolve(result);
            },
            error(err) {
                reject(err);
            },
            progress(percent) {
                progressCallback(Math.round(percent * 100));
            }
        });
    });
}

async function compressPDF(file, settings, progressCallback) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    
    // Compress each page
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const {width, height} = page.getSize();
        
        // Compress images on the page
        const images = await page.getImages();
        for (const image of images) {
            const imagePage = await pdfDoc.embedJpg(await image.getData());
            await imagePage.scaleToFit(width * settings.quality, height * settings.quality);
        }
        
        progressCallback(Math.round((i + 1) / pages.length * 100));
    }
    
    // Save with compression
    const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsStack: []
    });
    
    return new Blob([compressedPdfBytes], { type: 'application/pdf' });
}

// Add this to your existing JavaScript file

async function showInterviewPrep() {
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-card" style="width: 80vw; max-height: 85vh;">
            <header class="modal-card-head">
                <p class="modal-card-title">Interview Preparation Assistant</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="columns">
                    <div class="column is-4">
                        <div class="field">
                            <label class="label">Job Role</label>
                            <div class="control">
                                <input class="input" type="text" id="job-role" 
                                    placeholder="e.g., Frontend Developer" value="${document.getElementById('profile-job-title')?.value || ''}">
                            </div>
                        </div>
                        
                        <div class="field">
                            <label class="label">Experience Level</label>
                            <div class="control">
                                <div class="select is-fullwidth">
                                    <select id="experience-level">
                                        <option value="entry">Entry Level</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="senior">Senior Level</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="field">
                            <label class="label">Question Type</label>
                            <div class="control">
                                <div class="select is-fullwidth">
                                    <select id="question-type">
                                        <option value="technical">Technical Questions</option>
                                        <option value="behavioral">Behavioral Questions</option>
                                        <option value="system_design">System Design</option>
                                        <option value="problem_solving">Problem Solving</option>
                                        <option value="domain_specific">Domain Specific</option>
                                        <option value="architecture">Architecture</option>
                                        <option value="leadership">Leadership</option>
                                        <option value="common">Common Interview Questions</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button class="button is-primary is-fullwidth" id="generate-questions">
                            Generate Questions
                        </button>

                        <div class="mt-4">
                            <div class="notification is-info is-light">
                                <strong>Tips:</strong>
                                <ul class="mt-2">
                                    <li>• Be specific about the job role</li>
                                    <li>• Practice answering out loud</li>
                                    <li>• Use the STAR method for behavioral questions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="column is-8">
                        <div id="questions-container" class="content">
                            <div class="has-text-centered has-text-grey-light">
                                <i class="fas fa-comments fa-3x"></i>
                                <p class="mt-2">Generate questions to start practicing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    modal.querySelector('.delete').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-background').addEventListener('click', () => modal.remove());
    
    const generateBtn = modal.querySelector('#generate-questions');
    generateBtn.addEventListener('click', async () => {
        const jobRole = modal.querySelector('#job-role').value;
        const experienceLevel = modal.querySelector('#experience-level').value;
        const questionType = modal.querySelector('#question-type').value;
        
        if (!jobRole) {
            showNotification('Please enter a job role', 'warning');
            return;
        }

        generateBtn.classList.add('is-loading');
        try {
            const questions = await generateInterviewQuestions(jobRole, experienceLevel, questionType);
            displayQuestions(questions, modal.querySelector('#questions-container'));
        } catch (error) {
            console.error('Error generating questions:', error);
            showNotification('Error generating questions. Please try again.', 'danger');
        } finally {
            generateBtn.classList.remove('is-loading');
        }
    });
}

async function generateInterviewQuestions(jobRole, experienceLevel, questionType) {
    // Basic questions for all types
    const questions = [
        {
            question: `What makes you interested in this ${jobRole} position?`,
            answer: "Structure your answer around:\n• Your relevant skills and experience\n• Your passion for the field\n• What you know about the role\n• How you can contribute"
        },
        {
            question: `Describe a challenging project you worked on as a ${jobRole}.`,
            answer: "Use the STAR method:\n• Situation: Set the context\n• Task: What needed to be done\n• Action: What you did\n• Result: The positive outcome"
        },
        {
            question: `What are your strengths as a ${jobRole}?`,
            answer: "Focus on:\n• Technical skills relevant to the role\n• Soft skills that make you effective\n• Examples of using these strengths\n• How they benefit the team"
        },
        {
            question: "How do you handle tight deadlines?",
            answer: "Key points:\n• Prioritization methods\n• Time management skills\n• Communication with stakeholders\n• Maintaining quality under pressure"
        },
        {
            question: "Where do you see yourself in 5 years?",
            answer: "Structure around:\n• Career growth goals\n• Skill development plans\n• Leadership aspirations\n• Industry contribution goals"
        },
        {
            question: "How do you stay updated with industry trends?",
            answer: "Mention:\n• Professional courses\n• Industry blogs and websites\n• Networking events\n• Personal projects"
        },
        {
            question: "Describe your ideal work environment.",
            answer: "Consider:\n• Team structure\n• Communication style\n• Work-life balance\n• Growth opportunities"
        },
        {
            question: "How do you handle conflicts in the workplace?",
            answer: "Approach:\n• Listen actively\n• Understand all perspectives\n• Find common ground\n• Professional resolution"
        },
        {
            question: "What's your biggest professional achievement?",
            answer: "Include:\n• Context of the achievement\n• Challenges overcome\n• Skills demonstrated\n• Impact on organization"
        },
        {
            question: "How do you handle feedback?",
            answer: "Key aspects:\n• Open to constructive criticism\n• Learning from feedback\n• Implementing improvements\n• Following up on changes"
        },
        {
            question: "What motivates you in your work?",
            answer: "Consider:\n• Professional growth\n• Problem-solving\n• Team collaboration\n• Impact on users/clients"
        },
        {
            question: "How do you prioritize your tasks?",
            answer: "Methods:\n• Urgency vs importance matrix\n• Task scheduling\n• Team coordination\n• Regular reviews"
        },
        {
            question: "Describe your problem-solving approach.",
            answer: "Steps:\n• Problem identification\n• Gathering information\n• Analyzing options\n• Implementing solutions\n• Evaluating results"
        },
        {
            question: "What are your salary expectations?",
            answer: "Approach:\n• Research industry standards\n• Consider experience level\n• Account for location\n• Be ready to negotiate"
        },
        {
            question: "Do you have any questions for us?",
            answer: "Ask about:\n• Team structure\n• Project methodologies\n• Growth opportunities\n• Company culture"
        }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return questions;
}

function displayQuestions(questions, container) {
    container.innerHTML = questions.map((q, index) => `
        <div class="box mb-4">
            <h4 class="title is-5">
                <span class="tag is-primary is-light mr-2">${index + 1}</span>
                ${q.question}
            </h4>
            <div class="mt-4">
                <button class="button is-small is-info is-light mb-2 toggle-answer">
                    <span class="icon">
                        <i class="fas fa-lightbulb"></i>
                    </span>
                    <span>Show Answer</span>
                </button>
                <div class="answer-content is-hidden">
                    <div class="notification is-info is-light">
                        ${marked.parse(q.answer)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add toggle functionality for answers
    container.querySelectorAll('.toggle-answer').forEach(button => {
        button.addEventListener('click', () => {
            const answerContent = button.nextElementSibling;
            answerContent.classList.toggle('is-hidden');
            button.querySelector('span:last-child').textContent = 
                answerContent.classList.contains('is-hidden') ? 'Show Answer' : 'Hide Answer';
        });
    });
}

// Add this to your existing JavaScript file

async function showDownloadOptions() {
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Download Resume</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="buttons is-flex is-flex-direction-column">
                    <button class="button is-info is-fullwidth mb-2" onclick="downloadAsPDF()">
                        <span class="icon">
                            <i class="fas fa-file-pdf"></i>
                        </span>
                        <span>Download as PDF</span>
                    </button>
                    
                    <button class="button is-primary is-fullwidth mb-2" onclick="downloadAsWord()">
                        <span class="icon">
                            <i class="fas fa-file-word"></i>
                        </span>
                        <span>Download as Word</span>
                    </button>
                    
                    <button class="button is-success is-fullwidth" onclick="downloadAsPlainText()">
                        <span class="icon">
                            <i class="fas fa-file-alt"></i>
                        </span>
                        <span>Download as Plain Text</span>
                    </button>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    modal.querySelector('.delete').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-background').addEventListener('click', () => modal.remove());
}

async function downloadAsPDF() {
    const element = document.querySelector('.preview-container');
    
    // Load html2pdf library if not already loaded
    if (typeof html2pdf === 'undefined') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }

    const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        showNotification('Generating PDF...', 'info');
        await html2pdf().set(opt).from(element).save();
        showNotification('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Error generating PDF. Please try again.', 'danger');
    }
}

async function downloadAsWord() {
    // Load docx library if not already loaded
    if (typeof docx === 'undefined') {
        await loadScript('https://unpkg.com/docx@7.8.2/build/index.js');
    }

    try {
        const content = document.querySelector('.preview-container').innerText;
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [new docx.TextRun(content)]
                    })
                ]
            }]
        });

        const blob = await docx.Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showNotification('Word document downloaded successfully!', 'success');
    } catch (error) {
        console.error('Word generation error:', error);
        showNotification('Error generating Word document. Please try again.', 'danger');
    }
}

function downloadAsPlainText() {
    try {
        const content = document.querySelector('.preview-container').innerText;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showNotification('Text file downloaded successfully!', 'success');
    } catch (error) {
        console.error('Text file generation error:', error);
        showNotification('Error generating text file. Please try again.', 'danger');
    }
}

// Add to your existing loadScript function if not already present
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Add this to your existing JavaScript file

async function shareResume() {
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Share Resume</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Share Link</label>
                    <div class="control has-icons-right">
                        <input class="input" type="text" id="share-link" 
                            value="${window.location.href}" readonly>
                        <span class="icon is-right is-clickable" onclick="copyShareLink()">
                            <i class="fas fa-copy"></i>
                        </span>
                    </div>
                </div>

                <div class="field mt-5">
                    <label class="label">Share via</label>
                    <div class="buttons">
                        <button class="button is-info" onclick="shareVia('email')">
                            <span class="icon">
                                <i class="fas fa-envelope"></i>
                            </span>
                            <span>Email</span>
                        </button>
                        
                        <button class="button is-link" onclick="shareVia('linkedin')">
                            <span class="icon">
                                <i class="fab fa-linkedin"></i>
                            </span>
                            <span>LinkedIn</span>
                        </button>
                        
                        <button class="button is-info" onclick="shareVia('twitter')">
                            <span class="icon">
                                <i class="fab fa-twitter"></i>
                            </span>
                            <span>Twitter</span>
                        </button>
                        
                        <button class="button is-success" onclick="shareVia('whatsapp')">
                            <span class="icon">
                                <i class="fab fa-whatsapp"></i>
                            </span>
                            <span>WhatsApp</span>
                        </button>
                    </div>
                </div>

                <div class="field mt-5">
                    <label class="label">QR Code</label>
                    <div class="has-text-centered" id="qr-code"></div>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    modal.querySelector('.delete').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-background').addEventListener('click', () => modal.remove());

    // Generate QR Code
    generateQRCode(window.location.href);
}

async function generateQRCode(url) {
    // Load QR Code library
    if (typeof QRCode === 'undefined') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
    }

    const qrContainer = document.getElementById('qr-code');
    new QRCode(qrContainer, {
        text: url,
        width: 128,
        height: 128
    });
}

function copyShareLink() {
    const shareLink = document.getElementById('share-link');
    shareLink.select();
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

function shareVia(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Check out my resume!');
    const text = encodeURIComponent('I created this resume using Resume Builder. Take a look!');

    let shareUrl;
    switch (platform) {
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
    }

    // Open share URL in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

async function showTemplates() {
    const modal = document.createElement('div');
    modal.className = 'modal is-active';
    modal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Choose Template</p>
                <button class="delete" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="columns is-multiline templates-grid">
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('executive')">
                            <img src="./dist/images/templates/executive.png" alt="Executive Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Executive</h3>
                                <p class="is-size-7">Professional and sophisticated</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('modern-tech')">
                            <img src="./dist/images/templates/modern-tech.png" alt="Modern Tech Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Modern Tech</h3>
                                <p class="is-size-7">Perfect for IT professionals</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('minimalist')">
                            <img src="./dist/images/templates/minimalist.png" alt="Minimalist Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Minimalist</h3>
                                <p class="is-size-7">Clean and elegant design</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('creative-pro')">
                            <img src="./dist/images/templates/creative-pro.png" alt="Creative Pro Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Creative Pro</h3>
                                <p class="is-size-7">For creative professionals</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('corporate')">
                            <img src="./dist/images/templates/corporate.png" alt="Corporate Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Corporate</h3>
                                <p class="is-size-7">Traditional business style</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('startup')">
                            <img src="./dist/images/templates/startup.png" alt="Startup Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Startup</h3>
                                <p class="is-size-7">Modern and dynamic</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('academic')">
                            <img src="./dist/images/templates/academic.png" alt="Academic Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Academic</h3>
                                <p class="is-size-7">Research and education focused</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('professional')">
                            <img src="./dist/images/templates/professional.png" alt="Professional Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Professional</h3>
                                <p class="is-size-7">Classic professional look</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('modern-minimal')">
                            <img src="./dist/images/templates/modern-minimal.png" alt="Modern Minimal Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Modern Minimal</h3>
                                <p class="is-size-7">Contemporary and clean</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('elegant')">
                            <img src="./dist/images/templates/elegant.png" alt="Elegant Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Elegant</h3>
                                <p class="is-size-7">Sophisticated and refined</p>
                            </div>
                        </div>
                    </div>
                    <div class="column is-4">
                        <div class="template-card" onclick="applyTemplate('creative-food')">
                            <img src="./dist/images/templates/creative-food.png" alt="Creative Food Service Template">
                            <div class="template-info">
                                <h3 class="is-size-5">Creative Food Service</h3>
                                <p class="is-size-7">Perfect for culinary professionals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('.delete').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-background').addEventListener('click', () => modal.remove());
}

async function applyTemplate(templateName) {
    try {
        showNotification('Applying template...', 'info');
        
        // Load template CSS
        await loadTemplateCSS(templateName);
        
        // Apply template-specific classes and structure
        const previewContainer = document.querySelector('.preview-container');
        previewContainer.className = `preview-container template-${templateName}`;
        
        // Apply template-specific layout
        await applyTemplateLayout(templateName);
        
        showNotification('Template applied successfully!', 'success');
    } catch (error) {
        console.error('Error applying template:', error);
        showNotification('Error applying template. Please try again.', 'danger');
    }
}

async function loadTemplateCSS(templateName) {
    const cssUrl = `./dist/css/templates/${templateName}.css`;
    
    if (document.querySelector(`link[href="${cssUrl}"]`)) {
        return;
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

async function applyTemplateLayout(templateName) {
    const layouts = {
        modern: {
            structure: `
                <div class="resume-header">
                    <div class="profile-section">
                        {{profile_image}}
                        <h1>{{full_name}}</h1>
                        <h2>{{job_title}}</h2>
                    </div>
                    <div class="contact-section">
                        {{contact_info}}
                    </div>
                </div>
                <div class="resume-body">
                    <div class="main-content">
                        {{professional_summary}}
                        {{work_experience}}
                        {{education}}
                    </div>
                    <div class="sidebar">
                        {{skills}}
                        {{languages}}
                        {{certifications}}
                    </div>
                </div>
            `
        },
        creative: {
            structure: `
                <div class="creative-layout">
                    <div class="sidebar">
                        {{profile_image}}
                        <div class="personal-info">
                            <h1>{{full_name}}</h1>
                            <h2>{{job_title}}</h2>
                            {{contact_info}}
                        </div>
                        {{skills}}
                        {{languages}}
                    </div>
                    <div class="main-content">
                        {{professional_summary}}
                        {{work_experience}}
                        {{education}}
                        {{certifications}}
                    </div>
                </div>
            `
        },
        minimal: {
            structure: `
                <div class="minimal-layout">
                    <header>
                        <h1>{{full_name}}</h1>
                        <h2>{{job_title}}</h2>
                        <div class="contact-bar">
                            {{contact_info}}
                        </div>
                    </header>
                    <main>
                        {{professional_summary}}
                        {{work_experience}}
                        {{education}}
                        <div class="skills-section">
                            {{skills}}
                            {{languages}}
                            {{certifications}}
                        </div>
                    </main>
                </div>
            `
        },
        'creative-food': {
            structure: `
                <div class="resume-header">
                    <div class="profile-section">
                        {{profile_image}}
                        <h1>{{full_name}}</h1>
                        <h2>{{job_title}}</h2>
                    </div>
                    <div class="contact-section">
                        {{contact_info}}
                    </div>
                </div>
                <div class="resume-body">
                    <div class="section">
                        <h3 class="section-title">Professional Summary</h3>
                        {{professional_summary}}
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Work Experience</h3>
                        {{work_experience}}
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Skills & Expertise</h3>
                        <div class="skills-section">
                            {{skills}}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Education</h3>
                        {{education}}
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Certifications</h3>
                        {{certifications}}
                    </div>
                </div>
            `
        }
    };

    // Get the current resume data
    const resumeData = collectResumeData();
    
    // Get the template structure
    let structure = layouts[templateName].structure;
    
    // Replace placeholders with actual content
    structure = await replaceTemplatePlaceholders(structure, resumeData);
    
    // Update the preview container
    const previewContainer = document.querySelector('.preview-container');
    previewContainer.innerHTML = structure;
}

function collectResumeData() {
    // Collect all the input data from the form
    return {
        full_name: `${document.getElementById('firstname')?.value || ''} ${document.getElementById('lastname')?.value || ''}`,
        job_title: document.getElementById('profile-job-title')?.value || '',
        // Add more fields as needed
    };
}

async function replaceTemplatePlaceholders(structure, data) {
    // Replace basic placeholders
    Object.keys(data).forEach(key => {
        const placeholder = `{{${key}}}`;
        structure = structure.replace(placeholder, data[key]);
    });
    
    return structure;
}

// Add these helper functions for the analyzer
function getSuggestionIcon(containerId) {
    switch(containerId) {
        case 'critical-suggestions':
            return 'fa-exclamation-circle';
        case 'important-suggestions':
            return 'fa-exclamation-triangle';
        case 'minor-suggestions':
            return 'fa-info-circle';
        default:
            return 'fa-check-circle';
    }
}

function updateSuggestionCounts(critical, important, minor) {
    const total = critical + important + minor;
    const tabElement = document.querySelector('[data-tab="suggestions"]');
    
    if (total > 0) {
        tabElement.innerHTML = `
            Suggestions
            <span class="tag is-rounded ml-2 ${critical > 0 ? 'is-danger' : important > 0 ? 'is-warning' : 'is-info'}">
                ${total}
            </span>
        `;
    } else {
        tabElement.textContent = 'Suggestions';
    }
}

function handleSuggestionFix(containerId, index) {
    const suggestion = document.querySelector(`#${containerId} .suggestion-item:nth-child(${index + 1}) .suggestion-text`).textContent;
    
    // Map suggestions to form fields
    if (suggestion.includes('name')) {
        document.getElementById('firstname').focus();
    } else if (suggestion.includes('professional summary')) {
        document.querySelector('#user-description .ql-editor').focus();
    } else if (suggestion.includes('contact')) {
        document.getElementById('email').focus();
    } else if (suggestion.includes('work experience')) {
        document.getElementById('add-proffesional').click();
    } else if (suggestion.includes('education')) {
        document.getElementById('add-education').click();
    } else if (suggestion.includes('skills')) {
        document.getElementById('add-skill').click();
    }

    // Show success notification
    showNotification('Navigated to the relevant section', 'is-success');
}

function showNotification(message, type = 'is-info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} is-light`;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.5s ease-out';
    
    notification.innerHTML = `
        <button class="delete"></button>
        ${message}
    `;

    document.body.appendChild(notification);

    // Add delete button functionality
    notification.querySelector('.delete').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .circular-progress {
        --progress: 0%;
        animation: fillProgress 1s ease-out forwards;
    }

    @keyframes fillProgress {
        from {
            --progress: 0%;
        }
        to {
            --progress: var(--target-progress);
        }
    }

    .suggestion-item {
        opacity: 0;
        transform: translateX(-20px);
        animation: slideIn 0.3s ease-out forwards;
    }

    .fix-button {
        background: var(--primary-color);
        color: white;
        border: none;
    }

    .fix-button:hover {
        background: var(--primary-color-dark);
        transform: scale(1.05);
    }

    .tab-content {
        min-height: 300px;
    }

    .tags .tag {
        margin: 0.2rem;
        animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Replace the existing styles with simpler hover effects
const analyzerStyles = document.createElement('style');
analyzerStyles.textContent = `
    .suggestion-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border-radius: 4px;
        background: #fff;
        transition: all 0.2s ease;
        border-left: 4px solid transparent;
    }

    .suggestion-item:hover {
        background: #f5f5f5;
        padding-left: 1rem;
        border-bottom: 1px solid var(--primary-color);
    }

    .suggestion-text {
        flex: 1;
        margin: 0 1rem;
    }

    .fix-button {
        visibility: hidden;
        background: var(--primary-color);
        color: white;
    }

    .suggestion-item:hover .fix-button {
        visibility: visible;
    }

    #critical-suggestions .suggestion-item {
        border-left-color: #f14668;
    }

    #important-suggestions .suggestion-item {
        border-left-color: #ffdd57;
    }

    #minor-suggestions .suggestion-item {
        border-left-color: #3298dc;
    }

    .suggestion-item i {
        color: inherit;
        width: 20px;
        text-align: center;
    }

    #critical-suggestions .suggestion-item i {
        color: #f14668;
    }

    #important-suggestions .suggestion-item i {
        color: #ffdd57;
    }

    #minor-suggestions .suggestion-item i {
        color: #3298dc;
    }

    .tab-content {
        min-height: 300px;
        padding: 1rem;
    }
`;

// Remove the old styles and add the new ones
document.head.appendChild(analyzerStyles);