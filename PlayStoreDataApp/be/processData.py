import csv
# Definisci la funzione per la modifica dei dati
def modificaSize(riga,x,listaRigheBrutte):
    if riga != None:
        # Esempio di modifica: convertiamo la prima colonna in maiuscolo
        ##################
        if 'M' in riga[4]:
            # Se 'M' è presente, moltiplica il valore per 1000
            try:
                riga[4] = str(float(riga[4].replace('M', '')) * 1000)
            except ValueError:
                # Se il valore non è convertibile in un numero, lascialo invariato
                listaRigheBrutte.append(x)
                None
            return riga
        elif 'k' in riga[4]:
            riga[4] = str(float(riga[4].split('k')[0]))
            return riga
        else:
            listaRigheBrutte.append(x)
            return riga
    ##################
def modificaRating(riga,x,listaRigheBrutte):
    if riga != None:
        if 'nan' in str(riga[2]).lower():
            listaRigheBrutte.append(x)
            return None
        if '19' in str(riga[2]).lower():
            listaRigheBrutte.append(x)
            return None
        else:
            return riga
def modificaInstall(riga,x,listaRigheBrutte):
    if (riga != None):
        riga[5] = str(riga[5]).replace("+","").replace(",","")
        riga[7] = str(riga[7]).replace("$","")
        return riga
    else:
        listaRigheBrutte.append(x)
        return None
# Nome del file CSV di input e output
listaRigheBrutte = []
listaRigheMesse = []
inseriscoInLista = False
file_input = "googleplaystore_dist.csv"
file_output = "googleplaystore_MODIFICATO.csv"
file_output_for_pca = "googleplaystore_Pre_PCA.csv"
# Leggi il file CSV di input e crea il file CSV di output
with open(file_input, 'r', newline='',encoding="utf-8") as csv_file_in, open(file_output, 'w', newline='',encoding="iso-8859-1") as csv_file_out,open(file_output_for_pca, 'w', newline='',encoding="iso-8859-1") as csv_file_out_pca:
    lettore = csv.reader(csv_file_in, delimiter=',')
    scrittore = csv.writer(csv_file_out, delimiter=',', quotechar='"', quoting=csv.QUOTE_NONNUMERIC)
    scrittore_pca = csv.writer(csv_file_out_pca, delimiter=',')
    # Leggi e modifica ogni riga del file di input
    x= 0 
    numeroDuplicati= 0
    for riga in lettore:
        
        riga_modificata = modificaSize(riga,x,listaRigheBrutte)
        if (riga_modificata!=None):
            scrittore.writerow(riga_modificata)
            x += 1
        
# print(listaRigheBrutte)
# print(len(list(dict.fromkeys(listaRigheBrutte))))
print(listaRigheMesse)
print("duplicati " + str(numeroDuplicati))
print("Modifica completata. Il file modificato è stato salvato come 'output.csv'.")
