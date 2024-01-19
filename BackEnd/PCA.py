import json
from sklearn.decomposition import PCA
from sklearn import preprocessing


def generateWithFile(label, Y, data):
    # Inizializza una lista per contenere i dati nel formato desiderato
    output_data = []
    # Itera attraverso le righe del DataFrame
    for index, row in data.iterrows():
        # Crea un dizionario per ogni riga
        row_dict = {}

        # Aggiungi i valori degli attributi dalla lista label
        row_dict["Y1"] = Y[index][0]
        row_dict["Y2"] = Y[index][1]
        for attr in label:
            row_dict[attr] = row[attr]

        # Aggiungi il dizionario alla lista di output
        output_data.append(row_dict)
    # Scrivi la lista di dizionari in un file JSON
    with open("output.json", "w") as json_file:
        json.dump(output_data, json_file, indent=2)


def generateWithData(label, Y, data):
    # Inizializza una lista per contenere i dati nel formato desiderato
    output_data = []
    # Itera attraverso le righe del DataFrame
    for index, row in data.iterrows():
        # Crea un dizionario per ogni riga
        row_dict = {}

        # Aggiungi i valori degli attributi dalla lista label
        row_dict["Y1"] = Y[index][0]
        row_dict["Y2"] = Y[index][1]
        for attr in label:
            row_dict[attr] = row[attr]

        # Aggiungi il dizionario alla lista di output
        output_data.append(row_dict)

    output_data = positivize(output_data)

    return json.dumps(output_data, indent=2)


def positivize(data):
    min_Y1 = min(float(d["Y1"]) for d in data)
    min_Y2 = min(float(d["Y2"]) for d in data)

    # Aggiungi il minimo di Y1 a tutti gli elementi di Y1 in ogni dizionario
    for d in data:
        d["Y1"] += min_Y1 * -1 + 1
        d["Y2"] += min_Y2 * -1 + 1

    return data


def evaluatePCA(df, d):
    att = [
        "ID",
        "App",
        "Category",
        "Rating",
        "Reviews",
        "Size",
        "Installs",
        "Price",
        "Content_Rating",
        "Type",
        "Genres",
        "Last_Updated",
        "Current_Ver",
        "Android_Ver",
    ]
    d_std = preprocessing.StandardScaler().fit_transform(d)
    pca = PCA(n_components=5)
    d_pca = pca.fit_transform(d_std)
    to_ret = generateWithData(att, d_pca, df)
    return to_ret
