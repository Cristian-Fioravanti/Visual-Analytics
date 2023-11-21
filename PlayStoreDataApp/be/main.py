import json
from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from flask_cors import CORS
import csv

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
 
flask = Flask(__name__)
CORS(flask)
mysql_connection = MySQL(flask, prefix="my_database", host="localhost", user="root", password="", db="va", autocommit=True)

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

# Endpoint to get all tasks
@flask.route('/play-store-data', methods=['GET'])
def getPlayStoreData():
    listPlayStoreData = []
    with open(file_input, 'r', newline='',encoding="iso-8859-1") as csv_file_in:
        lettore = csv.reader(csv_file_in, delimiter=';')
        for riga in lettore:
             play_store_data = PlayStoreData(*riga)
             listPlayStoreData.flaskend(play_store_data_to_json(play_store_data))
        return jsonify(listPlayStoreData)
# # Endpoint to get a specific task by ID
# @flask.route('/tasks/<int:task_id>', methods=['GET'])
# def get_task(task_id):
#     task = next((task for task in tasks if task['id'] == task_id), None)
#     if task is None:
#         return jsonify({'error': 'Task not found'}), 404
#     return jsonify({'task': task})

# # Endpoint to create a new task
# @flask.route('/tasks', methods=['POST'])
# def create_task():
#     if not request.json or 'title' not in request.json:
#         return jsonify({'error': 'Title is required'}), 400

#     new_task = {
#         'id': tasks[-1]['id'] + 1,
#         'title': request.json['title'],
#         'done': False
#     }
#     tasks.flaskend(new_task)

#     return jsonify({'task': new_task}), 201


if __name__ == '__main__':
    flask.run(debug=True, port=8099)

    