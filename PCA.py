import json
import numpy as np
from matplotlib import pyplot as plt
import pandas as pd
import mysql.connector
from sklearn.decomposition import PCA
from sklearn import preprocessing

def generateWithData(label, Y, data):
    # Inizializza una lista per contenere i dati nel formato desiderato
    output_data = []
    # Itera attraverso le righe del DataFrame
    for index, row in data.iterrows():
        # Crea un dizionario per ogni riga
        row_dict = {}

        # Aggiungi i valori degli attributi dalla lista label
        for y in Y:
            row_dict['Y1'] = y[0]
            row_dict['Y2'] = y[1]
        for attr in label:
            row_dict[attr] = row[attr]
        
        # Aggiungi il dizionario alla lista di output
        output_data.append(row_dict)

    return(json.dumps(output_data, indent=2))

def evaluatePCA(df, d):
    # df = pd.read_sql(query, connection)
    # d = df.iloc[:, 3:8]
    att=["ID","App","Category","Rating","Reviews","Size","Installs","Price","Content_Rating","Type","Genres","Last_Updated","Current_Ver","Android_Ver"]
    d_std = preprocessing.StandardScaler().fit_transform(d)
    pca=PCA(n_components=5)
    d_pca=pca.fit_transform(d_std)
    generateWithData(att,d_pca,df)


def test():
    ###read data from a CSV file, you can choose different delimiters
    # att=["ID","App","Category","Rating","Reviews","Size","Installs","Price","Content_Rating","Type","Genres","Last_Updated","Current_Ver","Android_Ver"]
    # Parametri di connessione al database
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'va'
    }
    # Query SQL per estrarre i dati dal database
    query = "SELECT * FROM googleplaystore;"

    # Connessione al database e recupero dei dati
    try:
        # Connessione al database
        connection = mysql.connector.connect(**db_config)

        # Esecuzione della query e ottenimento dei dati in un DataFrame
        df = pd.read_sql(query, connection)
        d = df.iloc[:, 3:8]
        att = df.columns.values

        #normalize the data with StandardScaler
        d_std = preprocessing.StandardScaler().fit_transform(d)
        #compute PCA
        pca=PCA(n_components=5)
        d_pca=pca.fit_transform(d_std)
        #d_pca is a numpy array with transformed data and pca is a
        # PCA variable  with useful attributes (e.g., explained_variance_)

        # generateFile(att,d_pca,'googleplaystore§.csv')
        print(generateWithData(att,d_pca,df))

    finally:
        # Chiudi la connessione al database
        if 'connection' in locals() and connection.is_connected():
            connection.close()

test()
# plt.plot(d_pca[:,0],d_pca[:,1], 'o', markersize=3, color='blue', alpha=0.5, label='PCA transformed data in the new 2D space')    
# plt.xlabel('Y1')
# plt.ylabel('Y2')
# plt.xlim([-4,4])
# plt.ylim([-4,4])
# plt.legend()
# plt.title('Transformed data from sklearn.decomposition import PCA')

# plt.show()

# s = 30
# plt.scatter(d_pca[0:59, 0], d_pca[0:59, 1],
#             color='red',s=s, lw=0, label='Cluster 1')
# plt.scatter(d_pca[59:130, 0], d_pca[59:130, 1],
#             color='green',s=s, lw=0, label='Cluster 2')
# plt.scatter(d_pca[130:178, 0], d_pca[130:178, 1],
#             color='blue',s=s, lw=0, label='Cluster 3')
# plt.xlabel('Y1')
# plt.ylabel('Y2')
# plt.legend()
# plt.title('Transformed data from sklearn.decomposition import PCA')

# plt.show()

# d_cov=np.cov(d.T)
# for i in range(len(d_cov)):
#     print('Variance original data axis X'+str(i+1),d_cov[i][i])
# print('Covariance matrix')    

# for i in range (len(d_cov)):
#     for j in range(len(d_cov[0])):
#         print('%.2f ' % (d_cov[i][j]), end='\t')
#         #print(str(d_pca[i][j])[:6]+' ', end='')
#     print()
# print('-------------------------------------')

# d_cov=np.cov(d_std.T)
# for i in range(len(d_cov)):
#     print('Variance original normalized data axis X'+str(i+1),d_cov[i][i])

# print('Covariance matrix')  
# for i in range (len(d_cov)):
#     for j in range(len(d_cov[0])):
#         print('%.2f ' % (d_cov[i][j]), end='\t')
#         #print(str(d_pca[i][j])[:6]+' ', end='')
#     print()    
# print('-------------------------------------')

# d_cov=np.cov(d_pca.T)
# for i in range(len(d_cov)):
#     print('Variance transformed data axis Y'+str(i+1),d_cov[i][i])

# print('Covariance matrix')
# for i in range (len(d_cov)):
#     for j in range(len(d_cov[0])):
#         print('%.2f ' % (d_cov[i][j]), end='\t')
#         #print(str(d_pca[i][j])[:6]+' ', end='')
#     print()
# print('-------------------------------------')

# #compute and sort eigenvalues
# v=pca.explained_variance_ratio_
# print('Cumulated variance of the first two PCA components:',
#       (v[0]+v[1]))


##for i in range (len(d_pca)):
##    for j in range(len(d_pca[0])):
##        print('%.2f ' % (d_pca[i][j]), end='\t')
##        #print(str(d_pca[i][j])[:6]+' ', end='')
##    print()


