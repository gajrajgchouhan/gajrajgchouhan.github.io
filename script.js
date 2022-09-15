function pdfLink(PDF_DRIVE_ID) {
    return `https://drive.google.com/file/d/${PDF_DRIVE_ID}/preview`;
}

const SDE = pdfLink("1rp2AgZpijxoqIVqGVgD966VbUgYUAcuF");
const DS = pdfLink("1DuJBWk6YelsFyKxRFWUtxkJ4ActIHaUU");

/**
 * @type {HTMLButtonElement}
 */
const SDEButton = document.getElementById("SDE");
/**
 * @type {HTMLButtonElement}
 */
const DSButton = document.getElementById("DS");

/**
 * @type {HTMLIFrameElement}
 */
const resumeEL = document.getElementById("resume");

function setResumeLink(choice) {
    if (choice == "SDE") {
        resumeEL.src = SDE;
        SDEButton.classList.add("active");
        DSButton.classList.remove("active");
    } else {
        resumeEL.src = DS;
        SDEButton.classList.remove("active");
        DSButton.classList.add("active");
    }
}
