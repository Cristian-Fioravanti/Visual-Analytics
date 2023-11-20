from flask import Flask, jsonify, request
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
file_input = "googleplaystore_MODIFICATO_META_MANO.csv"
# Sample data
tasks = [
    {
        'id': 1,
        'title': 'Task 1',
        'done': False
    },
    {
        'id': 2,
        'title': 'Task 2',
        'done': False
    }
]

# Endpoint to get all tasks
@flask.route('/play-store-data', methods=['GET'])
def getPlayStoreData():
    listPlayStoreData = []
    with open(file_input, 'r', newline='',encoding="iso-8859-1") as csv_file_in:
        lettore = csv.reader(csv_file_in, delimiter=';')
        for riga in lettore:
             play_store_data = PlayStoreData(*riga)
             listPlayStoreData.append(play_store_data_to_json(play_store_data))
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

    