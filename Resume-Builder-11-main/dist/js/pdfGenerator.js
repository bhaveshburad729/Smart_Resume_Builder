function downloadResume() {
    // Get the resume container
    const element = document.getElementById('resume-container');
    
    // Configure PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'my-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };

    // Generate PDF
    html2pdf().set(opt).from(element).save().catch(error => {
        console.error('Error generating PDF:', error);
        alert('There was an error generating your PDF. Please try again.');
    });
}

// Wait for images to load before generating PDF
function waitForImagesToLoad(element) {
    const images = element.getElementsByTagName('img');
    const promises = Array.from(images).map(img => {
        if (img.complete) {
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }
    });
    return Promise.all(promises);
} 