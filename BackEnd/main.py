import json
from flask import Flask, request
from flaskext.mysql import MySQL
from flask_cors import CORS
import PCA as pcaService
import pandas as pd
from flask import make_response
 
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'va'
}

flask = Flask(__name__)
CORS(flask)
mysql_connection = MySQL(flask, prefix="my_database", host="localhost", user="root", password="", db="va", autocommit=True)


@flask.route('/all-data-pca')
def allDataPca():
    query = 'SELECT * FROM googleplaystore'

    # Esecuzione della query e ottenimento dei dati in un DataFrame
    cur = mysql_connection.get_db().cursor()
    cur.execute(query)
    row_headers = [x[0] for x in cur.description]  # estrae le intestazioni di riga
    rv = cur.fetchall()

    # Chiamata a pcaService.evaluatePCA e ottenimento del risultato
    df = pd.DataFrame(rv, columns=row_headers)
    d = df.iloc[:, 3:8].values
    pca_result = pcaService.evaluatePCA(df, d)

    # Creazione di un oggetto di risposta Flask JSON
    response = json.loads(pca_result)

    # Creazione di una risposta Flask con gli headers appropriati
    resp = make_response(response)
    resp.headers['Content-Type'] = 'application/json'

    return response

@flask.route('/id-pca', methods=['POST'])
def selectInIDPca():
    req = request.get_json()
    ids = req['id']
    strIds = ','.join(str(num) for num in ids)
    print()
    query = 'SELECT * FROM googleplaystore WHERE ID IN ('+ strIds +')'

    # Esecuzione della query e ottenimento dei dati in un DataFrame
    cur = mysql_connection.get_db().cursor()
    cur.execute(query)
    row_headers = [x[0] for x in cur.description]  # estrae le intestazioni di riga
    rv = cur.fetchall()

    # Chiamata a pcaService.evaluatePCA e ottenimento del risultato
    df = pd.DataFrame(rv, columns=row_headers)
    d = df.iloc[:, 3:8].values
    pca_result = pcaService.evaluatePCA(df, d)

    # Creazione di un oggetto di risposta Flask JSON
    response = json.loads(pca_result)

    # Creazione di una risposta Flask con gli headers appropriati
    resp = make_response(response)
    resp.headers['Content-Type'] = 'application/json'

    return response

if __name__ == '__main__':
    flask.run(debug=True, port=8099)

    