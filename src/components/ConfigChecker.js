// src/components/ConfigChecker.js
import React from 'react';

const ConfigChecker = () => {
    const binId = process.env.REACT_APP_JSONBIN_BIN_ID;
    const apiKey = process.env.REACT_APP_JSONBIN_API_KEY;

    const isConfigured = binId && apiKey;

    if (isConfigured) {
        return null;
    }

    return (
        <div className="config-warning">
            <h3>⚠️ Configuración Requerida</h3>
            <p>Para que la aplicación funcione, configura las siguientes variables de entorno:</p>
            <ul>
                <li><strong>REACT_APP_JSONBIN_BIN_ID:</strong> {binId ? '✅' : '❌'}</li>
                <li><strong>REACT_APP_JSONBIN_API_KEY:</strong> {apiKey ? '✅' : '❌'}</li>
            </ul>
            <div className="env-instructions">
                <h4>Para desarrollo local:</h4>
                <p>Crea un archivo <code>.env</code> en la raíz del proyecto con:</p>
                <pre>
                    {`REACT_APP_JSONBIN_BIN_ID=tu-bin-id-real
REACT_APP_JSONBIN_API_KEY=tu-master-key-real`}
                </pre>

                <h4>En Vercel:</h4>
                <p>Ve a tu proyecto → Settings → Environment Variables</p>
            </div>
        </div>
    );
};

export default ConfigChecker;