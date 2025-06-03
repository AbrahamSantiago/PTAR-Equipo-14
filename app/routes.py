# app/routes.py

import os
import json
from flask import (
    Blueprint, render_template, request, redirect, url_for, current_app, send_from_directory, flash, jsonify
)
from werkzeug.utils import secure_filename

# Creamos un blueprint
main = Blueprint('main', __name__)

# Extensiones permitidas para subir (por ejemplo, solo imágenes)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Ruta del archivo JSON que almacena los datos del carrusel
CAROUSEL_DATA_PATH = 'app/carousel_data.json'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_carousel_data():
    """Carga los datos del carrusel desde el archivo JSON"""
    try:
        if os.path.exists(CAROUSEL_DATA_PATH):
            with open(CAROUSEL_DATA_PATH, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading carousel data: {e}")
    return [
        {
            "id": 1,
            "url": "/static/Imagenes/LogoPTAR.png",
            "link": "https://es.wikipedia.org/wiki/Planta_de_tratamiento_de_aguas_residuales",
            "title": "Modelo PTAR",
            "description": "Modelo de la Planta de Tratamiento de Aguas Residuales de la FES Acatlán"
        },
        {
            "id": 2,
            "url": "/static/Imagenes/PTAR_FOTO1.jpg",
            "link": "https://es.wikipedia.org/wiki/Reactor_anaerobio",
            "title": "Reactor Anaerobio",
            "description": "Reactor anaerobio de la PTAR para el tratamiento de aguas residuales"
        }
    ]

def save_carousel_data(data):
    """Guarda los datos del carrusel en el archivo JSON"""
    try:
        with open(CAROUSEL_DATA_PATH, 'w') as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving carousel data: {e}")
        return False

@main.route('/')
def index():
    # Página de inicio
    carousel_data = load_carousel_data()
    return render_template('Inicio/index.html', carousel_data=carousel_data)

@main.route('/subir', methods=['GET', 'POST'])
def subir():
    if request.method == 'POST':
        # Comprueba si viene el campo 'archivo' en el form
        if 'archivo' not in request.files:
            flash('No se encontró el campo de archivo')
            return redirect(request.url)

        file = request.files['archivo']
        # Si el usuario no seleccionó ningún archivo
        if file.filename == '':
            flash('No se seleccionó ningún archivo')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename_seguro = secure_filename(file.filename)
            ruta_destino = os.path.join(current_app.config['UPLOAD_FOLDER'], filename_seguro)
            file.save(ruta_destino)
            return redirect(url_for('main.ver_archivo', filename=filename_seguro))

    # Si es GET o hubo error, muestro el form
    return render_template('index.html')

@main.route('/uploads/<filename>')
def ver_archivo(filename):
    # Envía el archivo estático (imagen) para que el navegador lo muestre
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@main.route('/admin/carousel')
def admin_carousel():
    carousel_data = load_carousel_data()
    return render_template('admin/carousel.html', carousel_data=carousel_data)

@main.route('/api/carousel', methods=['GET'])
def get_carousel():
    carousel_data = load_carousel_data()
    return jsonify(carousel_data)

@main.route('/api/carousel', methods=['POST'])
def add_carousel_item():
    # Verificar si se envió un archivo
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        
        # Guardar en el JSON
        carousel_data = load_carousel_data()
        new_item = {
            'id': len(carousel_data) + 1,
            'url': f"/static/uploads/{filename}",
            'link': request.form.get('link', ''),
            'title': request.form.get('title', 'Nueva Imagen'),
            'description': request.form.get('description', '')
        }
        carousel_data.append(new_item)
        save_carousel_data(carousel_data)
        return jsonify(new_item), 201
    return jsonify({'error': 'File not allowed'}), 400

@main.route('/api/carousel/<int:item_id>', methods=['PUT'])
def update_carousel_item(item_id):
    carousel_data = load_carousel_data()
    data = request.json
    
    # Buscar el ítem y actualizarlo
    for item in carousel_data:
        if item['id'] == item_id:
            item['title'] = data.get('title', item['title'])
            item['link'] = data.get('link', item['link'])
            item['description'] = data.get('description', item['description'])
            save_carousel_data(carousel_data)
            return jsonify(item), 200
    
    return jsonify({'error': 'Item not found'}), 404

@main.route('/api/carousel/<int:item_id>', methods=['DELETE'])
def delete_carousel_item(item_id):
    carousel_data = load_carousel_data()
    # Filtrar los ítems excluyendo el que se va a eliminar
    new_data = [item for item in carousel_data if item['id'] != item_id]
    
    if len(new_data) < len(carousel_data):
        save_carousel_data(new_data)
        return jsonify({'success': True}), 200
    return jsonify({'error': 'Item not found'}), 404

@main.route('/api/carousel/reorder', methods=['POST'])
def reorder_carousel():
    new_order = request.json.get('order')
    if not new_order:
        return jsonify({'error': 'No order provided'}), 400
    
    carousel_data = load_carousel_data()
    # Crear un nuevo arreglo en el orden especificado
    reordered_data = []
    for item_id in new_order:
        item = next((item for item in carousel_data if item['id'] == item_id), None)
        if item:
            reordered_data.append(item)
    
    if len(reordered_data) == len(carousel_data):
        save_carousel_data(reordered_data)
        return jsonify({'success': True}), 200
    return jsonify({'error': 'Invalid order'}), 400

# Rutas para las páginas del navbar
@main.route('/galeria')
def galeria():
    return render_template('galeria/galeria.html')

@main.route('/contacto')
def contacto():
    return render_template('contacto/contacto.html')

@main.route('/servicio-social')
def servicio_social():
    return render_template('servicio/servicio_social.html')

@main.route('/practicas')
def practicas():
    return render_template('practicas/practicas.html')

@main.route('/login')
def login():
    return render_template('login/login.html')

@main.route('/PortalAdmin')
def PortalAdmin():
    return render_template('Portal/PortalAdmin.html')

@main.route('/Panel_Post')
def Panel_Post():
    return render_template('Galeria/Panel_Post.html')