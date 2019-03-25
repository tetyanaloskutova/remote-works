# -*- coding: utf-8 -*-

import pandas as pd
pd.set_option("display.max_colwidth", 10000)
pd.options.mode.chained_assignment = None  # to not make too many copies
import os
import numpy as np

import glob

rootdir_glob = 'C:\\conda\\saleor\\saleor\\saleor\\**/*' # Note the added asterisks
# This will return absolute paths

file_list = [f for f in glob.iglob(rootdir_glob, recursive=True) if os.path.isfile(f) == False]

for f in file_list:
    if 'migrations' in str(f):
        os.chdir(f)
        for file in glob.glob("*.py"):
            if str(file) != '__init__.py':
                if 'product' in str(file):
                    file_renamed = str(file).replace("product","skill")
                    os.rename(os.path.join(f,file),os.path.join(f,file_renamed))
                    file = file_renamed
                file1 = os.path.join(f,file)
                print(file1)
                #replace_project_in(file1)
    
file_list = [f for f in glob.iglob(rootdir_glob, recursive=True) if os.path.isfile(f) == False]

for f in file_list:
    if 'migrations' in str(f):
        os.chdir(f)
        for file in glob.glob("*.pyc"):
            os.remove(file)
            
def replace_project_in(file):
    with open(file, 'U') as f:
     
        newText=f.read()
     
        while 'product' in newText:
            newText=newText.replace('product', 'skill')
     
        while 'PRODUCT' in newText:
            newText=newText.replace('PRODUCT', 'SKILL')
     
        while 'Product' in newText:
            newText=newText.replace('Product', 'Skill')
     
    with open(file, "w") as f:
        f.write(newText)    