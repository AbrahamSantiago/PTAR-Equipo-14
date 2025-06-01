# app/__init__.py

import os
from flask import Flask

def create_app():
    # Crea la instancia de Flask
    app = Flask(__name__, instance_relative_config=True)

    # Carga configuración por defecto (si tienes)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),  # clave usada para sesiones, CSRF, etc.
        UPLOAD_FOLDER=os.path.join(app.instance_path, 'uploads'),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024  # límite de 16 MB para archivos subidos
    )

    # Si existe un archivo de configuración en instance/config.py, lo carga
    app.config.from_pyfile('config.py', silent=True)

    # Asegura que la carpeta de instance/ y la de uploads/ existan
    try:
        os.makedirs(app.instance_path)
        os.makedirs(app.config['UPLOAD_FOLDER'])
    except OSError:
        pass

    # Importa y registra los blueprints (o simplemente las rutas)
    from . import routes
    app.register_blueprint(routes.bp)

    return app
