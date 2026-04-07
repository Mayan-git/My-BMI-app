/**
 * BMI Calculator Application
 * A professional, responsive web application for calculating Body Mass Index
 * with dark mode support, input validation, and beautiful animations.
 * 
 * Author: Professional Developer
 * Version: 1.0.0
 */

// ==================== DOM ELEMENTS ====================
const form = document.getElementById('bmiForm');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const resultSection = document.getElementById('resultSection');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const bmiMessage = document.getElementById('bmiMessage');
const progressFill = document.getElementById('progressFill');
const bmiRange = document.getElementById('bmiRange');
const errorMessage = document.getElementById('errorMessage');
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

// ==================== BMI CONSTANTS ====================
/**
 * BMI Categories with metadata
 * @type {Object}
 */
const BMI_CATEGORIES = {
    underweight: {
        min: 0,
        max: 18.5,
        name: 'Underweight'
    },
    normal: {
        min: 18.5,
        max: 25,
        name: 'Normal Weight'
    },
    overweight: {
        min: 25,
        max: 30,
        name: 'Overweight'
    },
    obese: {
        min: 30,
        max: 100,
        name: 'Obese'
    }
};

/**
 * Health messages for each BMI category
 * @type {Object}
 */
const BMI_MESSAGES = {
    underweight: 'You may need to gain weight. Consume a balanced diet with adequate calories and consult a healthcare provider.',
    normal: 'Great! You maintain a healthy weight. Keep up your healthy lifestyle.',
    overweight: 'Consider incorporating regular exercise and a balanced diet into your routine.',
    obese: 'It is recommended to consult with a healthcare provider for personalized guidance.'
};

// ==================== VALIDATION FUNCTIONS ====================
/**
 * Validate input values
 * @returns {Object} - { isValid: boolean, message: string }
 */
function validateInputs() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    // Check if fields are empty
    if (!heightInput.value.trim() || !weightInput.value.trim()) {
        return {
            isValid: false,
            message: 'Please fill in both height and weight fields.'
        };
    }

    // Check if values are valid numbers
    if (isNaN(height) || isNaN(weight)) {
        return {
            isValid: false,
            message: 'Height and weight must be valid numbers.'
        };
    }

    // Check if values are positive
    if (height <= 0 || weight <= 0) {
        return {
            isValid: false,
            message: 'Height and weight must be positive values.'
        };
    }

    // Check realistic values
    if (height < 50 || height > 300) {
        return {
            isValid: false,
            message: 'Height should be between 50 cm and 300 cm.'
        };
    }

    if (weight < 20 || weight > 500) {
        return {
            isValid: false,
            message: 'Weight should be between 20 kg and 500 kg.'
        };
    }

    return { isValid: true, message: '' };
}

// ==================== ERROR HANDLING ====================
/**
 * Display error message with animation
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    resultSection.classList.remove('show');
}

/**
 * Clear error message
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// ==================== BMI CALCULATION ====================
/**
 * Get BMI category based on BMI value
 * @param {number} bmi - The BMI value
 * @returns {string} - Category key (underweight, normal, overweight, obese)
 */
function getBMICategory(bmi) {
    if (bmi < BMI_CATEGORIES.normal.min) {
        return 'underweight';
    } else if (bmi < BMI_CATEGORIES.overweight.min) {
        return 'normal';
    } else if (bmi < BMI_CATEGORIES.obese.min) {
        return 'overweight';
    } else {
        return 'obese';
    }
}

/**
 * Calculate BMI progress percentage (0-100%)
 * Maps BMI values to a visual progress indicator
 * @param {number} bmi - The BMI value
 * @returns {number} - Progress percentage (0-100)
 */
function calculateProgress(bmi) {
    // Normalize BMI to percentage:
    // 0-15: 0-20%, 15-18.5: 20-25%, 18.5-25: 25-50%,
    // 25-30: 50-75%, 30-40: 75-100%, 40+: 100%
    
    if (bmi < 15) {
        return (bmi / 15) * 20;
    } else if (bmi < 18.5) {
        return 20 + ((bmi - 15) / 3.5) * 5;
    } else if (bmi < 25) {
        return 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
        return 50 + ((bmi - 25) / 5) * 25;
    } else if (bmi < 40) {
        return 75 + ((bmi - 30) / 10) * 25;
    } else {
        return 100;
    }
}

/**
 * Display BMI result with animations and styling
 * @param {number} bmi - The calculated BMI value
 */
function displayResult(bmi) {
    // Get category information
    const categoryKey = getBMICategory(bmi);
    const category = BMI_CATEGORIES[categoryKey];

    // Update BMI value with 1 decimal place
    bmiValue.textContent = bmi.toFixed(1);

    // Update category name
    bmiCategory.textContent = category.name;

    // Update health message
    bmiMessage.textContent = BMI_MESSAGES[categoryKey];

    // Update progress bar with animation
    const progress = calculateProgress(bmi);
    progressFill.style.width = progress + '%';

    // Update result section styling based on category
    resultSection.className = `result-section show ${categoryKey}`;

    // Update BMI range display
    bmiRange.textContent = `${bmi.toFixed(1)}`;

    // Clear any error messages
    clearError();

    // Smooth scroll to result on mobile devices
    if (window.innerWidth <= 600) {
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// ==================== DARK MODE ====================
/**
 * Initialize dark mode based on user preference stored in localStorage
 */
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.textContent = '☀️';
    }
}

/**
 * Toggle dark/light mode and persist preference
 */
modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    modeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// ==================== FORM HANDLING ====================
/**
 * Handle form submission - Calculate and display BMI
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate input values
    const validation = validateInputs();
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }

    // Extract and parse input values
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    // Convert height from centimeters to meters
    const heightInMeters = height / 100;

    // Calculate BMI using standard formula: weight (kg) / height (m)²
    const bmi = weight / (heightInMeters * heightInMeters);

    // Display the calculated result
    displayResult(bmi);
});

/**
 * Handle reset button - Clear form and hide result
 */
form.addEventListener('reset', () => {
    resultSection.classList.remove('show');
    clearError();
    heightInput.focus();
});

/**
 * Clear error messages when user starts typing
 */
heightInput.addEventListener('input', clearError);
weightInput.addEventListener('input', clearError);

/**
 * Allow Enter key to submit form from input fields
 */
heightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

weightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

// ==================== INITIALIZATION ====================
/**
 * Initialize application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    heightInput.focus();
});

// ==================== UTILITY FUNCTIONS ====================
/**
 * Print BMI Report (bonus feature)
 */
function printBMIReport() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    
    if (!height || !weight) {
        showError('Please calculate BMI first to print the report.');
        return;
    }
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const categoryKey = getBMICategory(bmi);
    const category = BMI_CATEGORIES[categoryKey];
    
    const reportWindow = window.open('', '', 'height=500,width=500');
    reportWindow.document.write(`
        <html>
            <head>
                <title>BMI Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #2563eb; }
                    .info { margin: 15px 0; }
                </style>
            </head>
            <body>
                <h1>BMI Calculation Report</h1>
                <div class="info"><strong>Height:</strong> ${height} cm</div>
                <div class="info"><strong>Weight:</strong> ${weight} kg</div>
                <div class="info"><strong>BMI:</strong> ${bmi.toFixed(1)}</div>
                <div class="info"><strong>Category:</strong> ${category.name}</div>
                <div class="info"><strong>Message:</strong> ${BMI_MESSAGES[categoryKey]}</div>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">Generated by BMI Calculator</p>
            </body>
        </html>
    `);
}

// Export utility for potential future use
window.BMICalculator = {
    printReport: printBMIReport,
    validateInputs: validateInputs,
    calculateBMI: (height, weight) => weight / ((height / 100) ** 2)
};
