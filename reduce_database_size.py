import os
import duckdb
import shutil
from datetime import datetime

# Backup database
now = datetime.now()
dt_string = now.strftime("%Y%m%d_%H%M%S")
shutil.copy('db/reservoir-analysis.db', 'db/backup/reservoir-analysis_' + dt_string + '.db')

# Export database
con = duckdb.connect('db/reservoir-analysis.db') # has big file size
con.execute("export database 'db/db-dump';")
con.close()

# Remove database
os.remove('db/reservoir-analysis.db')

# Re-import database
con = duckdb.connect('db/reservoir-analysis.db')
con.execute("import database 'db/db-dump';")
con.close()

# Delete dump
shutil.rmtree(('db/db-dump')
