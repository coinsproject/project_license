document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#burnout-map-table tbody');

    try {
        console.log('Fetching licenses...');
        const response = await fetch('/licenses');
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const licenses = await response.json();
        console.log('Полученные лицензии:', licenses);

        tableBody.innerHTML = '';

        if (licenses.length === 0) {
            console.log('Нет данных для отображения.');
            tableBody.innerHTML = '<tr><td colspan="11">Нет данных</td></tr>';
        } else {
            licenses.forEach(license => {
                // Преобразуем строки дат в объекты Date
                const issueDate = new Date(license.issue_date);
                const expiryDate = new Date(license.expiry_date);

                // Создаём массив данных для колонок с годами
                const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
                const yearColumns = years.map(year => {
                    if (year === issueDate.getFullYear()) {
                        return issueDate.toISOString().split('T')[0]; // Дата начала для первого года
                    } else if (year === expiryDate.getFullYear()) {
                        return expiryDate.toISOString().split('T')[0]; // Дата окончания для последнего года
                    } else if (year > issueDate.getFullYear() && year < expiryDate.getFullYear()) {
                        return `01-01-${year}`; // Генерируем начало года, если это промежуточный год
                    } else {
                        return ''; // Пустая ячейка, если год не в диапазоне
                    }
                });

                // Формируем строку таблицы
                const row = `
                    <tr>
                        <td>${license.name}</td>
                        <td>${license.placement}</td>
                        <td>${license.quantity}</td>
                        <td>${license.contract_number}</td>
                        <td>${yearColumns[0]}</td>
                        <td>${yearColumns[1]}</td>
                        <td>${yearColumns[2]}</td>
                        <td>${yearColumns[3]}</td>
                        <td>${yearColumns[4]}</td>
                        <td>${yearColumns[5]}</td>
                        <td>${yearColumns[6]}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные. Попробуйте позже.');
    }
});
