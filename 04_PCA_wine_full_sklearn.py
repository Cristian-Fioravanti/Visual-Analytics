import numpy as np
from matplotlib import pyplot as plt
from sklearn.decomposition import PCA
from sklearn import preprocessing

def generateFile(label,Y,dataFile):
    att=['Y1','Y2']+label
    f=open('pca.csv','w')
    fin=open(dataFile)
    for i in range(len(att)-1):
        print(att[i],',',end='',file=f)
    print(att[-1],file=f)
    for i in range(len(Y)-1):
        s=fin.readline().strip()
        print(Y[i][0],',',Y[i][1],',',s,file=f)   
    f.close()
    

###read data from a CSV file, you can choose different delimiters
att=['Rating','Reviews','Size','Installs','Type','Price']

d=np.genfromtxt('googleplaystore_Pre_PCA.csv',usecols=[i for i in range(0,5)],delimiter=';') 

#normalize the data with StandardScaler
d_std = preprocessing.StandardScaler().fit_transform(d)
#compute PCA
pca=PCA(n_components=5)
d_pca=pca.fit_transform(d_std)
#d_pca is a numpy array with transformed data and pca is a
# PCA variable  with useful attributes (e.g., explained_variance_)

generateFile(att,d_pca,'googleplaystore_Pre_PCA.csv')

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

d_cov=np.cov(d.T)
for i in range(len(d_cov)):
    print('Variance original data axis X'+str(i+1),d_cov[i][i])
print('Covariance matrix')    

for i in range (len(d_cov)):
    for j in range(len(d_cov[0])):
        print('%.2f ' % (d_cov[i][j]), end='\t')
        #print(str(d_pca[i][j])[:6]+' ', end='')
    print()
print('-------------------------------------')

d_cov=np.cov(d_std.T)
for i in range(len(d_cov)):
    print('Variance original normalized data axis X'+str(i+1),d_cov[i][i])

print('Covariance matrix')  
for i in range (len(d_cov)):
    for j in range(len(d_cov[0])):
        print('%.2f ' % (d_cov[i][j]), end='\t')
        #print(str(d_pca[i][j])[:6]+' ', end='')
    print()    
print('-------------------------------------')

d_cov=np.cov(d_pca.T)
for i in range(len(d_cov)):
    print('Variance transformed data axis Y'+str(i+1),d_cov[i][i])

print('Covariance matrix')
for i in range (len(d_cov)):
    for j in range(len(d_cov[0])):
        print('%.2f ' % (d_cov[i][j]), end='\t')
        #print(str(d_pca[i][j])[:6]+' ', end='')
    print()
print('-------------------------------------')

#compute and sort eigenvalues
v=pca.explained_variance_ratio_
print('Cumulated variance of the first two PCA components:',
      (v[0]+v[1]))


##for i in range (len(d_pca)):
##    for j in range(len(d_pca[0])):
##        print('%.2f ' % (d_pca[i][j]), end='\t')
##        #print(str(d_pca[i][j])[:6]+' ', end='')
##    print()


