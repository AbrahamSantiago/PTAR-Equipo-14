import os
from flask import Flask
from .routes import main

def create_app():
    app = Flask(__name__)
    
    # Configuraciones básicas
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'clave-secreta-para-desarrollo'
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')
    
    # Crear la carpeta de uploads si no existe
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Registrar blueprints
    from app.routes import main
    app.register_blueprint(main)
    
    return app