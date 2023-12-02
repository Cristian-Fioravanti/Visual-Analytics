import json
from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from flask_cors import CORS
import PCA as pcaService
import pandas as pd
from flask import make_response
class PlayStoreData:
    def __init__(self, rating: float, review: int, size: float, install: int, price: float):
        self.rating = rating
        self.review = review
        self.size = size
        self.install = install
        self.price = price

def play_store_data_to_json(play_store_data):
    return {
        'rating': play_store_data.rating,
        'review': play_store_data.review,
        'size': play_store_data.size,
        'install': play_store_data.install,
        'price': play_store_data.price
    }   
db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'va'
    }
flask = Flask(__name__)
CORS(flask)
mysql_connection = MySQL(flask, prefix="my_database", host="localhost", user="root", password="root", db="va", autocommit=True)

file_input = "googleplaystore_MODIFICATO_META_MANO.csv"

@flask.route('/star')
def star():
    cur = mysql_connection.get_db().cursor()
    cur.execute('''SELECT * FROM googleplaystore''')
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
        print(dict(zip(row_headers,result)))
    response = jsonify(json_data)

    response.headers.add('Access-Control-Allow-Origin', '*')  # Imposta gli header CORS
    response.headers.add('Content-Type', 'application/json')  # Imposta gli header CORS

    return response

@flask.route('/all-data-pca')
def allDataPca():
    query = 'SELECT * FROM googleplaystore'

    # Esecuzione della query e ottenimento dei dati in un DataFrame
    cur = mysql_connection.get_db().cursor()
    cur.execute(query)
    row_headers = [x[0] for x in cur.description]  # estrae le intestazioni di riga
    rv = cur.fetchall()

    # Creazione del JSON dai risultati del database
    json_data = []

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
   
@flask.route('/category')
def category():
    cur = mysql_connection.get_db().cursor()
    cur.execute('SELECT Category FROM `googleplaystore` GROUP by Category')
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    response = jsonify(json_data)

    response.headers.add('Access-Control-Allow-Origin', '*')  # Imposta gli header CORS
    response.headers.add('Content-Type', 'application/json')  # Imposta gli header CORS

    return response
@flask.route('/maxReview')
def maxReview():
    cur = mysql_connection.get_db().cursor()
    cur.execute('''SELECT MAX(Reviews) FROM googleplaystore''')
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    response = jsonify(json_data)
    response.headers.add('Access-Control-Allow-Origin', '*')  # Imposta gli header CORS
    response.headers.add('Content-Type', 'application/json')  # Imposta gli header CORS

    return response

@flask.route('/maxInstalls')
def maxInstalls():
    cur = mysql_connection.get_db().cursor()
    cur.execute('''SELECT MAX(Installs) FROM googleplaystore''')
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    response = jsonify(json_data)
    response.headers.add('Access-Control-Allow-Origin', '*')  # Imposta gli header CORS
    response.headers.add('Content-Type', 'application/json')  # Imposta gli header CORS

    return response


if __name__ == '__main__':
    flask.run(debug=True, port=8099)

    