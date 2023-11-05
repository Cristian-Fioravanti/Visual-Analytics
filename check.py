import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

apps = pd.read_csv("googleplaystore_MODIFICATO.csv", delimiter=";")

print(apps.isna().sum()) #controlla che non ci siano null