# app/routes.py

import os
from flask import (
    Blueprint, render_template, request, redirect, url_for, current_app, send_from_directory, flash
)
from werkzeug.utils import secure_filename

# Creamos un blueprint
bp = Blueprint('main', __name__)

# Extensiones permitidas para subir (por ejemplo, solo imágenes)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/')
def index():
    # Página de inicio
    return render_template('Inicio/index.html')


@bp.route('/subir', methods=['GET', 'POST'])
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

@bp.route('/uploads/<filename>')
def ver_archivo(filename):
    # Envía el archivo estático (imagen) para que el navegador lo muestre
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
