# app/routes.py

import os
import json
import time
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
            with open(CAROUSEL_DATA_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Verificar y corregir rutas de imágenes
                for item in data:
                    # Si la URL comienza con /static/Imagenes/, usar url_for
                    if item['url'].startswith('/static/Imagenes/'):
                        # Extraer solo el nombre del archivo
                        filename = item['url'].replace('/static/Imagenes/', '')
                        # Verificar si el archivo existe
                        file_path = os.path.join(current_app.static_folder, 'Imagenes', filename)
                        if os.path.exists(file_path):
                            item['url'] = f"/static/Imagenes/{filename}"
                        else:
                            print(f"Imagen no encontrada: {file_path}")
                    # Si la URL comienza con /static/uploads/, verificar existencia
                    elif item['url'].startswith('/static/uploads/'):
                        filename = item['url'].replace('/static/uploads/', '')
                        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                        if not os.path.exists(file_path):
                            print(f"Imagen no encontrada: {file_path}")
                return data
    except Exception as e:
        print(f"Error loading carousel data: {e}")
    
    # Datos por defecto con rutas corregidas
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
        # Crear directorio si no existe
        os.makedirs(os.path.dirname(CAROUSEL_DATA_PATH), exist_ok=True)
        with open(CAROUSEL_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
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
    try:
        # Verificar si se envió un archivo
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        if file and allowed_file(file.filename):
            # Crear nombre de archivo único
            filename = secure_filename(file.filename)
            timestamp = str(int(time.time()))
            name, ext = os.path.splitext(filename)
            unique_filename = f"{name}_{timestamp}{ext}"
            
            # Asegurar que existe la carpeta uploads
            os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
            
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            # Guardar en el JSON
            carousel_data = load_carousel_data()
            
            # Generar un nuevo ID único
            max_id = max([item.get('id', 0) for item in carousel_data], default=0)
            new_id = max_id + 1
            
            new_item = {
                'id': new_id,
                'url': f"/static/uploads/{unique_filename}",
                'link': request.form.get('link', ''),
                'title': request.form.get('title', f'Imagen {new_id}'),
                'description': request.form.get('description', 'Agrega una descripción para esta imagen')
            }
            
            carousel_data.append(new_item)
            
            if save_carousel_data(carousel_data):
                return jsonify(new_item), 201
            else:
                return jsonify({'error': 'Error saving data'}), 500
                
        return jsonify({'error': 'File not allowed'}), 400
        
    except Exception as e:
        print(f"Error in add_carousel_item: {e}")
        return jsonify({'error': 'Internal server error'}), 500


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

@main.route('/debug/carousel')
def debug_carousel():
    carousel_data = load_carousel_data()
    
    # Verificar existencia de archivos
    for item in carousel_data:
        if item['url'].startswith('/static/uploads/'):
            filename = item['url'].replace('/static/uploads/', '')
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            item['file_exists'] = os.path.exists(file_path)
            item['file_path'] = file_path
        elif item['url'].startswith('/static/Imagenes/'):
            filename = item['url'].replace('/static/Imagenes/', '')
            file_path = os.path.join(current_app.static_folder, 'Imagenes', filename)
            item['file_exists'] = os.path.exists(file_path)
            item['file_path'] = file_path
    
    return jsonify({
        'carousel_data': carousel_data,
        'data_file_exists': os.path.exists(CAROUSEL_DATA_PATH),
        'upload_folder': current_app.config['UPLOAD_FOLDER'],
        'upload_folder_exists': os.path.exists(current_app.config['UPLOAD_FOLDER']),
        'static_folder': current_app.static_folder,
        'total_items': len(carousel_data)
    })

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