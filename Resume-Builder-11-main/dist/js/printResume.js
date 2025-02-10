function printResume() {
    // Store the original page content
    const originalContent = document.body.innerHTML;
    
    // Get only the resume content
    const resumeContent = document.getElementById('resultdata-container').innerHTML;
    
    // Replace page content with just the resume
    document.body.innerHTML = `
        <div id="print-container" style="
            background: white;
            padding: 20mm;
            margin: 0;
            width: 210mm;
            min-height: 297mm;
        ">
            ${resumeContent}
        </div>
    `;

    // Add print-specific styles
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            #print-container {
                padding: 20mm !important;
                width: 210mm !important;
                min-height: 297mm !important;
            }
            @page {
                size: A4;
                margin: 0;
            }
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            img {
                max-width: 100%;
                height: auto;
            }
        }
    `;
    document.head.appendChild(style);

    // Trigger print dialog
    window.print();

    // Restore original content after printing
    window.onafterprint = function() {
        document.body.innerHTML = originalContent;
        // Reinitialize any necessary event listeners or scripts
        if (typeof initializeScripts === 'function') {
            initializeScripts();
        }
    };
}

function downloadResume() {
    // Get the resume content from the correct container
    const resumeContent = document.getElementById('userdetails-result');
    if (!resumeContent) {
        const notification = document.createElement('div');
        notification.className = 'notification is-warning is-light centered-notification';
        notification.innerHTML = 'Resume content not found. Please ensure all data is entered.';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        return;
    }

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'notification is-info is-light centered-notification';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating PDF...';
    document.body.appendChild(loadingDiv);

    // Create a clean container for PDF generation
    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-container';
    
    // Add the header section
    const headerSection = document.querySelector('.header-section');
    if (headerSection) {
        pdfContainer.appendChild(headerSection.cloneNode(true));
    }
    
    // Add the main content
    pdfContainer.appendChild(resumeContent.cloneNode(true));
    
    // Apply necessary styles
    pdfContainer.style.cssText = `
        background: white;
        padding: 20mm;
        width: 210mm;
        margin: 0 auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    `;

    // Make sure all sections are visible
    pdfContainer.querySelectorAll('.divsection').forEach(section => {
        section.classList.remove('is-hidden');
        section.style.display = 'block';
    });

    document.body.appendChild(pdfContainer);

    // Configure PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'my-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollY: 0,
            width: pdfContainer.offsetWidth,
            height: pdfContainer.offsetHeight,
            windowWidth: pdfContainer.offsetWidth,
            windowHeight: pdfContainer.offsetHeight
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };

    // Wait for images to load
    const images = pdfContainer.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) {
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }
    });

    // Generate PDF after images are loaded
    Promise.all(imagePromises)
        .then(() => {
            html2pdf()
                .set(opt)
                .from(pdfContainer)
                .save()
                .then(() => {
                    loadingDiv.remove();
                    pdfContainer.remove();
                })
                .catch(error => {
                    console.error('Error generating PDF:', error);
                    loadingDiv.remove();
                    pdfContainer.remove();
                    
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'notification is-danger is-light centered-notification';
                    errorDiv.innerHTML = 'Error generating PDF. Please try again.';
                    document.body.appendChild(errorDiv);
                    setTimeout(() => errorDiv.remove(), 3000);
                });
        });
}

function showDownloadOptions() {
    // Create modal for download options
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
                <div class="buttons is-centered">
                    <button class="button is-link" onclick="downloadResume(); this.closest('.modal').remove();">
                        <span class="icon">
                            <i class="fas fa-file-pdf"></i>
                        </span>
                        <span>Download PDF</span>
                    </button>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);

    // Handle modal close
    const closeModal = () => modal.remove();
    modal.querySelector('.delete').addEventListener('click', closeModal);
    modal.querySelector('.modal-background').addEventListener('click', closeModal);
}

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
    .centered-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        padding: 1rem 2rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .pdf-container {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #000;
    }

    .pdf-container * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .pdf-container .divsection {
        margin-bottom: 1rem;
        page-break-inside: avoid;
    }

    .pdf-container img {
        max-width: 100%;
        height: auto;
    }

    @media print {
        .pdf-container {
            padding: 0;
            margin: 0;
        }
    }
`;
document.head.appendChild(style); 