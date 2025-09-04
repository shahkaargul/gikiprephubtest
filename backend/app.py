from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)
DATABASE = 'students.db'
JWT_SECRET = 'gikiprephub_secret_key'  # Change to a secure value in production
JWT_ALGO = 'HS256'
def verify_token(token):
    if token and token.startswith('Bearer '):
        token = token[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return payload.get('user_id')
    except Exception:
        return None
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Missing fields'}), 400
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT id FROM students WHERE email=? AND password=?', (email, password))
    user = c.fetchone()
    conn.close()
    if user:
        user_id = user[0]
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, JWT_SECRET, algorithm=JWT_ALGO)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
@app.route('/protected-resource/<path:filename>', methods=['GET'])
def protected_resource(filename):
    token = request.headers.get('Authorization')
    if not token or not verify_token(token):
        return jsonify({'error': 'Unauthorized'}), 401
    # Serve files from resources folder (adjust path as needed)
    return send_from_directory('../resources', filename)

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        picture TEXT
    )''')
    conn.commit()
    conn.close()

@app.route('/signup', methods=['POST'])
def signup():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        picture = request.files.get('picture')
        app.logger.info(f"Signup received: name={name}, email={email}, password={'***' if password else None}, picture={picture.filename if picture else None}")
        if not name or not email or not password or not picture:
            app.logger.error('Missing fields')
            return jsonify({'error': 'Missing fields'}), 400
        # Save picture with original extension
        import os
        ext = os.path.splitext(picture.filename)[1].lower()
        pic_filename = f"{email}_profile{ext}"
        pic_dir = os.path.join(os.path.dirname(__file__), 'profile_pics')
        if not os.path.exists(pic_dir):
            os.makedirs(pic_dir)
        pic_path = os.path.join(pic_dir, pic_filename)
        try:
            picture.save(pic_path)
            app.logger.info(f"Picture saved as {pic_path}")
        except Exception as pic_err:
            app.logger.error(f"Error saving picture: {pic_err}")
            return jsonify({'error': 'Error saving picture'}), 500
        try:
            conn = sqlite3.connect(DATABASE)
            c = conn.cursor()
            app.logger.info(f"Attempting SQL: INSERT INTO students (name, email, password, picture) VALUES (?, ?, ?, ?) with values: {name}, {email}, {password}, {pic_filename}")
            c.execute('INSERT INTO students (name, email, password, picture) VALUES (?, ?, ?, ?)', (name, email, password, pic_filename))
            conn.commit()
            conn.close()
            app.logger.info(f"User {email} inserted into DB with picture {pic_filename}")
        except sqlite3.IntegrityError as ie:
            app.logger.error(f'Email already exists: {email} | IntegrityError: {ie}')
            return jsonify({'error': 'Email already exists'}), 409
        except Exception as db_err:
            app.logger.error(f"DB error: {db_err} | Values: name={name}, email={email}, password={'***' if password else None}, picture={pic_filename}")
            return jsonify({'error': f'Database error: {db_err}' }), 500
        return jsonify({'message': 'Account created successfully'}), 201
    except Exception as e:
        app.logger.error('Unexpected error: %s', str(e))
        return jsonify({'error': 'Server error'}), 500


# Profile route
@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT name, email, picture FROM students WHERE id=?', (user_id,))
    user = c.fetchone()
    conn.close()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    name, email, picture = user
    picture_url = f"http://localhost:5000/profile-pic/{picture}" if picture else ""
    return jsonify({
        'name': name,
        'email': email,
        'picture_url': picture_url
    })

# Serve profile pictures
@app.route('/profile-pic/<filename>', methods=['GET'])
def serve_profile_pic(filename):
    return send_from_directory('profile_pics', filename)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
