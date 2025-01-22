from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Инициализация приложения и базы данных
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///licenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Модель лицензии
class License(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ownership = db.Column(db.String(100), nullable=True)  # Принадлежность
    group = db.Column(db.String(100), nullable=True)  # Группа
    manufacturer = db.Column(db.String(100), nullable=True)  # Производитель
    placement = db.Column(db.String(100), nullable=True)  # Размещение
    name = db.Column(db.String(100), nullable=False)  # Наименование лицензии
    type = db.Column(db.String(100), nullable=True)  # Тип
    quantity = db.Column(db.Integer, nullable=True)  # Количество
    contract_number = db.Column(db.String(100), nullable=True)  # Номер договора (№ ГК)
    term = db.Column(db.String(100), nullable=True)  # Срок
    issue_date = db.Column(db.Date, nullable=False)  # Дата выдачи
    expiry_date = db.Column(db.Date, nullable=False)  # Дата истечения
    notes = db.Column(db.Text, nullable=True)  # Примечания

    def to_dict(self):
        return {
            'id': self.id,
            'ownership': self.ownership,
            'group': self.group,
            'manufacturer': self.manufacturer,
            'placement': self.placement,
            'name': self.name,
            'type': self.type,
            'quantity': self.quantity,
            'contract_number': self.contract_number,
            'term': self.term,
            'issue_date': self.issue_date.strftime('%Y-%m-%d'),
            'expiry_date': self.expiry_date.strftime('%Y-%m-%d'),
            'notes': self.notes
        }

# Создание базы данных
with app.app_context():
    db.create_all()

# Роут для главной страницы
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/burnout-map')
def burnout_map():
    return render_template('burnout_map.html')

@app.route('/licenses-list')
def licenses_list():
    return render_template('licenses_list.html')

# Роут для получения всех лицензий
@app.route('/licenses', methods=['GET'])
def get_licenses():
    # Получаем параметры запроса
    name = request.args.get('name')
    placement = request.args.get('placement')
    quantity = request.args.get('quantity')

    # Строим запрос к базе данных
    query = License.query
    if name:
        query = query.filter(License.name.ilike(f'%{name}%'))  # Поиск по имени (частичное совпадение)
    if placement:
        query = query.filter(License.placement.ilike(f'%{placement}%'))  # Поиск по размещению
    if quantity:
        try:
            query = query.filter(License.quantity == int(quantity))  # Поиск по количеству
        except ValueError:
            return jsonify({'error': 'Некорректное значение для quantity'}), 400

    # Выполняем запрос
    licenses = query.all()
    return jsonify([license.to_dict() for license in licenses])


# Роут для добавления новой лицензии
@app.route('/licenses', methods=['POST'])
def add_license():
    data = request.get_json()

    try:
        new_license = License(
            ownership=data.get('ownership'),
            group=data.get('group'),
            manufacturer=data.get('manufacturer'),
            placement=data.get('placement'),
            name=data['name'],
            type=data.get('type'),
            quantity=data.get('quantity'),
            contract_number=data.get('contract_number'),
            term=data.get('term'),
            issue_date=datetime.strptime(data['issue_date'], '%Y-%m-%d'),
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d'),
            notes=data.get('notes')
        )
        db.session.add(new_license)
        db.session.commit()
        return jsonify(new_license.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Роут для удаления лицензии по ID
@app.route('/licenses/<int:id>', methods=['DELETE'])
def delete_license(id):
    license = License.query.get(id)

    if not license:
        return jsonify({'error': 'License not found'}), 404

    db.session.delete(license)
    db.session.commit()
    return jsonify({'message': 'License deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
