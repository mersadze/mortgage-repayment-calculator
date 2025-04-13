document.querySelectorAll('.radio-group input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        const parent = event.target.closest('.radio-group');
        if (radio.checked) {
            parent.classList.add('checked');
        } else {
            parent.classList.remove('checked');
        }
    });
});

function clearAll() {
    document.getElementById('amount').value = '';
    document.getElementById('term').value = '';
    document.getElementById('rate').value = '';
    document.querySelector('input[name="type"]:checked').checked = false;

    document.querySelector('.completed').classList.remove('show');
    document.querySelector('.results').innerHTML = `
    <div class="empty">
        <img src="./assets/images/illustration-empty.svg" alt="illustration">
        <h2>Results shown here</h2>
        <p>Complete the form and click “calculate repayments” to see what your monthly repayments would be.</p>
    </div>
    `;
}

function calculate() {
    const mortgageAmount = document.getElementById('amount').value;
    const mortgageTerm = document.getElementById('term').value;
    const interestRate = document.getElementById('rate').value;
    const mortgageType = document.querySelector('input[name="type"]:checked').value;

    if (!mortgageAmount || !mortgageTerm || !interestRate || !mortgageType) {
        showError('Please fill in all fields before calculating.');
        return;
    }
    updateResults(mortgageAmount, mortgageTerm, interestRate, mortgageType);
}

function calculateRepayments(mortgageAmount, mortgageTerm, interestRate, mortgageType) {
    const monthlyInterest = (mortgageAmount * (interestRate / 100)) / 12;
    let monthlyCapital;

    if (mortgageType === 'fixed') {
        monthlyCapital = mortgageAmount / (mortgageTerm * 12);
    } else {
        monthlyCapital = 0;
    }
    return (monthlyInterest + monthlyCapital).toFixed(2);
}

function updateResults(mortgageAmount, mortgageTerm, interestRate, mortgageType) {
    if (!mortgageAmount || !mortgageTerm || !interestRate || !mortgageType) {
        showError('Please fill in all fields before calculating.');
        return;
    }
    if (isNaN(mortgageAmount) || isNaN(mortgageTerm) || isNaN(interestRate)) {
        showError('Please enter valid numbers for all fields.');
        return;
    }
    if (mortgageAmount <= 0 || mortgageTerm <= 0 || interestRate <= 0) {
        showError('Please enter positive numbers for all fields.');
        return;
    }
    if (mortgageType !== 'fixed' && mortgageType !== 'variable') {
        showError('Please select a valid mortgage type.');
        return;
    }
    if (interestRate < 0 || interestRate > 100) {
        showError('Interest rate must be between 0 and 100.');
        return;
    }
    if (mortgageAmount > 1000000) {
        showError('Mortgage amount must be less than £1,000,000.');
        return;
    }
    if (mortgageTerm > 30) {
        showError('Mortgage term must be less than 30 years.');
        return;
    }
    const resultContainer = document.querySelector('.completed');
    const emptyContainer = document.querySelector('.empty');
    const monthlyRepayment = calculateRepayments(mortgageAmount, mortgageTerm, interestRate, mortgageType);
    const totalRepayment = (monthlyRepayment * mortgageTerm).toFixed(2);
    
    if (emptyContainer) {
        emptyContainer.style.display = 'none';
    }
    if (resultContainer) {
        resultContainer.style.display = 'flex';
        resultContainer.innerHTML = `
        <h2>Your results</h2>
        <p>Your results are shown below based on the information you provided. If you change any of the values, click “calculate repayments” again to see the updated results.</p>
        <div class="results-container">    
            <div class="result">
                <p>Your monthly repayments</p>
                <span class="amount">£${monthlyRepayment}</span>
            </div>
            <div class="result">
                <p>Total you'll repay over the term</p>
                <span class="amount">£${totalRepayment}</span>
            </div>
        </div>
        `;
    }
    resultContainer.classList.add('show');
}

function showError(message) {
    const errorHandler = document.querySelector('.errorHandler');
    errorHandler.textContent = message;
    errorHandler.style.display = 'flex';
    errorHandler.style.transform = 'translateY(0)';
    errorHandler.style.opacity = '1';

    setTimeout(() => {
        errorHandler.style.transform = 'translateY(80px)';
        errorHandler.style.opacity = '0';
        setTimeout(() => errorHandler.style.display = 'none', 300);
    }, 5000);
}