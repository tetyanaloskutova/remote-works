# -*- coding: utf-8 -*-

import pandas as pd
pd.set_option("display.max_colwidth", 10000)
pd.options.mode.chained_assignment = None  # to not make too many copies
import os
import numpy as np

import glob

rootdir_glob = 'C:\\conda\\remote_works\\remote_works\\remote_works\\**/*' # Note the added asterisks
# This will return absolute paths

file_list = [f for f in glob.iglob(rootdir_glob, recursive=True) if os.path.isfile(f) == False]

for f in file_list:
    if 'migrations' in str(f):
        os.chdir(f)
        for file in glob.glob("*.py"):
            if str(file) != '__init__.py':
                if 'skill' in str(file):
                    file_renamed = str(file).replace("skill","skill")
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
     
        while 'skill' in newText:
            newText=newText.replace('skill', 'skill')
     
        while 'TYPE' in newText:
            newText=newText.replace('TYPE', 'SKILL')
     
        while 'Skill' in newText:
            newText=newText.replace('Skill', 'Skill')
     
    with open(file, "w") as f:
        f.write(newText)    
