import os
from flask import Flask

def create_app():
    app = Flask(__name__)
    # ... (tu configuración existente)
    return app

# Crea la aplicación
app = create_app()

# ¡EJECUCIÓN DIRECTA SIEMPRE!
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
else:
    # Esto fuerza el modo debug incluso cuando se importa
    app.debug = True
    app.config['DEBUG'] = True