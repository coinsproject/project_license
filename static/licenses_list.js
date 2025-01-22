document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    const tableBody = document.querySelector('#licenses-table tbody');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение формы

        // Собираем параметры поиска
        const name = document.querySelector('#name').value.trim();
        const placement = document.querySelector('#placement').value.trim();
        const quantity = document.querySelector('#quantity').value;

        // Формируем параметры запроса
        const query = new URLSearchParams();
        if (name) query.append('name', name);
        if (placement) query.append('placement', placement);
        if (quantity) query.append('quantity', quantity);

        try {
            // Отправляем запрос на сервер
            const response = await fetch(`/licenses?${query.toString()}`);
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }

            const licenses = await response.json();
            console.log('Результаты поиска:', licenses);

            // Очищаем таблицу перед добавлением новых данных
            tableBody.innerHTML = '';

            // Обрабатываем результаты поиска
            if (licenses.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">Ничего не найдено</td></tr>';
            } else {
                licenses.forEach(license => {
                    const row = `
                        <tr>
                            <td>${license.id}</td>
                            <td>${license.name}</td>
                            <td>${license.placement}</td>
                            <td>${license.quantity}</td>
                            <td>${license.contract_number}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось выполнить поиск. Попробуйте позже.');
        }
    });
});
