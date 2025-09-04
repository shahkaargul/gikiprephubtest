import sqlite3

conn = sqlite3.connect('students.db')
c = conn.cursor()
try:
    c.execute('ALTER TABLE students ADD COLUMN picture TEXT;')
    print('Column "picture" added successfully.')
except Exception as e:
    print('Error:', e)
conn.commit()
conn.close()
