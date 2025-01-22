document.addEventListener('DOMContentLoaded', () => {
    const addLicenseButton = document.getElementById('add-license-button');
    const addLicenseModal = document.getElementById('add-license-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const saveLicenseButton = document.getElementById('save-license-button');
    const form = document.getElementById('license-form');

    addLicenseButton.addEventListener('click', () => {
        addLicenseModal.classList.add('active');
    });

    closeModalButton.addEventListener('click', () => {
        addLicenseModal.classList.remove('active');
    });

    saveLicenseButton.addEventListener('click', async () => {
        const data = {
            ownership: document.getElementById('ownership').value,
            group: document.getElementById('group').value,
            manufacturer: document.getElementById('manufacturer').value,
            placement: document.getElementById('placement').value,
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            quantity: document.getElementById('quantity').value,
            contract_number: document.getElementById('contract_number').value,
            term: document.getElementById('term').value,
            issue_date: document.getElementById('issue_date').value,
            expiry_date: document.getElementById('expiry_date').value,
            notes: document.getElementById('notes').value,
        };

        const response = await fetch('/licenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Лицензия добавлена успешно!');
            addLicenseModal.classList.remove('active');
            form.reset();
        } else {
            alert('Ошибка при добавлении лицензии');
        }
    });
});
