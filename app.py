import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MySQL Connection
db_config = {
    "host": "",
    "user": "",
    "password": "",
    "database": "",
}

def fetch_partners_from_db(filters=None):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM partners"
        conditions = []
        if filters:
            if 'OrganizationType' in filters and filters['OrganizationType'] != 'All':
                conditions.append(f"OrganizationType LIKE '%{filters['OrganizationType']}%'")
            if 'Location' in filters:
                conditions.append(f"Location LIKE '%{filters['Location']}%'")
            if 'Resources' in filters:
                conditions.append(f"Resources LIKE '%{filters['Resources']}%'")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        cursor.execute(query)
        partners = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return partners
    except mysql.connector.Error as error:
        print(f"Error fetching partners: {error}")
        return []

# Route to fetch partners from MySQL and return as JSON
@app.route('/api/partners', methods=['GET'])
def get_partners():
    filters = {}
    if 'OrganizationType' in request.args:
        filters['OrganizationType'] = request.args.get('OrganizationType') 
    if 'Location' in request.args:
        filters['Location'] = request.args.get('Location')
    if 'Resources' in request.args:
        filters['Resources'] = request.args.get('Resources')
    
    partners = fetch_partners_from_db(filters)
    return jsonify(partners)

# Route for adding a partner
@app.route('/api/partners/add', methods=['POST'])
def add_partner():
    try: 
        name = request.json['name']
        organization_type = request.json['organization_type']
        expertise = request.json['expertise']
        resources = request.json['resources']
        email = request.json['email']
        phone_number = request.json['phone_number']
        location = request.json['location']
        bio = request.json['bio']

        connection = mysql.connector.connect(**db_config) # Establish connection
        cursor = connection.cursor()
        # Inserting partner data into database
        cursor.execute("""
            INSERT INTO partners (Name, OrganizationType, Expertise, Resources, Email, PhoneNumber, Location, Bio)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (name, organization_type, expertise, resources, email, phone_number, location, bio)) 
        
        connection.commit() 
        cursor.close()
        connection.close()

        return jsonify({'message': 'Partner added successfully'}), 201 
    except Exception as e: # Exception handling 
        return jsonify({'error': str(e)}), 500

# Route for removing a partner
@app.route('/api/partners/remove', methods=['DELETE']) 
def remove_partner():
    try:
        partner_name = request.json['partner_name']

        connection = mysql.connector.connect(**db_config) # Establish Connection
        cursor = connection.cursor()
        cursor.execute("DELETE FROM partners WHERE Name = %s", (partner_name,)) # Deleting partner using WHERE clause
        
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Partner removed successfully'}), 200
    except Exception as e: # Exception handling 
        return jsonify({'error': str(e)}), 500

# Route for user registration
@app.route('/register', methods=['POST'])
def register():
    try:
        name = request.json['name']
        email = request.json['email']
        password = request.json['password']

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert user into database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, hashed_password.decode('utf-8')))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.json['email']
        password = request.json['password']

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def save_contact_message(name, phone, email, message):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        insert_query = "INSERT INTO contact_messages (name, phone, email, message) VALUES (%s, %s, %s, %s)"
        cursor.execute(insert_query, (name, phone, email, message))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return True
    except mysql.connector.Error as error:
        print(f"Error saving contact message: {error}")
        return False

@app.route('/api/contact', methods=['POST'])
def contact_form_submit():
    try:
        name = request.json['name']
        phone = request.json['phone']
        email = request.json['email']
        message = request.json['message']

        # Save the message to the database
        saved = save_contact_message(name, phone, email, message)
        
        if saved:
            return jsonify({'message': 'Message saved successfully'}), 201
        else:
            return jsonify({'error': 'Failed to save message'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


# INSERT INTO partners (name, organization_type, resources, contact_person, contact_email, contact_phone, location) VALUES
# ('Innovative Enterprises', 'Company', 'Web Development, Marketing, Design', 'John Smith', 'john.smith@example.com', '1234567890', 'New York, NY'),
# ('Global Solutions', 'Consulting Firm', 'Consulting, Training, Web Development', 'Jane Doe', 'jane.doe@example.com', '9876543210', 'Los Angeles, CA'),
# ('Smart Technologies', 'Startup', 'Marketing, Design, Web Development', 'David Brown', 'david.brown@example.com', '4567890123', 'Chicago, IL'),
# ('Creative Industries', 'Freelancer', 'Design, Web Development, Marketing', 'Sarah Johnson', 'sarah.johnson@example.com', '7890123456', 'Houston, TX'),
# ('Advanced Consulting', 'Company', 'Training, Web Development, Consulting', 'Michael Wilson', 'michael.wilson@example.com', '2345678901', 'Miami, FL'),
# ('Tech Enterprises', 'Consulting Firm', 'Marketing, Web Development, Design', 'Emily Martinez', 'emily.martinez@example.com', '8901234567', 'San Francisco, CA'),
# ('Smart Solutions', 'Startup', 'Web Development, Design, Consulting', 'Daniel Thompson', 'daniel.thompson@example.com', '3456789012', 'Seattle, WA'),
# ('Innovative Tech', 'Freelancer', 'Consulting, Training, Design', 'Olivia Garcia', 'olivia.garcia@example.com', '9012345678', 'Boston, MA'),
# ('Advanced Industries', 'Company', 'Web Development, Marketing, Consulting', 'James Brown', 'james.brown@example.com', '5678901234', 'Dallas, TX'),
# ('Global Enterprises', 'Consulting Firm', 'Design, Web Development, Training', 'Sophia Davis', 'sophia.davis@example.com', '0123456789', 'Phoenix, AZ'),
# ('Smart Consulting', 'Startup', 'Marketing, Design, Web Development', 'William Miller', 'william.miller@example.com', '6543210987', 'Denver, CO'),
# ('Tech Solutions', 'Freelancer', 'Web Development, Consulting, Design', 'Isabella Martinez', 'isabella.martinez@example.com', '3210987654', 'Atlanta, GA'),
# ('Creative Tech', 'Company', 'Training, Design, Web Development', 'Ethan Taylor', 'ethan.taylor@example.com', '7890123456', 'Philadelphia, PA'),
# ('Innovative Industries', 'Consulting Firm', 'Marketing, Web Development, Training', 'Mia Wilson', 'mia.wilson@example.com', '2109876543', 'Detroit, MI'),
# ('Global Tech', 'Startup', 'Design, Consulting, Web Development', 'Alexander Johnson', 'alexander.johnson@example.com', '8765432109', 'Austin, TX'),
# ('Advanced Solutions', 'Freelancer', 'Web Development, Marketing, Consulting', 'Ava Brown', 'ava.brown@example.com', '5432109876', 'Charlotte, NC'),
# ('Tech Industries', 'Company', 'Training, Web Development, Design', 'Noah Garcia', 'noah.garcia@example.com', '1098765432', 'Portland, OR'),
# ('Smart Enterprises', 'Consulting Firm', 'Consulting, Design, Web Development', 'Emma Rodriguez', 'emma.rodriguez@example.com', '4321098765', 'San Diego, CA'),
# ('Creative Solutions', 'Startup', 'Marketing, Training, Web Development', 'Liam Martinez', 'liam.martinez@example.com', '0987654321', 'Minneapolis, MN'),
# ('Innovative Consulting', 'Freelancer', 'Design, Web Development, Consulting', 'Olivia Brown', 'olivia.brown@example.com', '8765432109', 'Las Vegas, NV'),
# ('Global Solutions', 'Company', 'Web Development, Marketing, Consulting', 'Lucas Taylor', 'lucas.taylor@example.com', '6543210987', 'Nashville, TN'),
# ('Advanced Tech', 'Consulting Firm', 'Design, Training, Web Development', 'Amelia White', 'amelia.white@example.com', '3210987654', 'Salt Lake City, UT'),
# ('Tech Consulting', 'Startup', 'Web Development, Consulting, Design', 'Benjamin Hall', 'benjamin.hall@example.com', '0987654321', 'Kansas City, MO'),
# ('Smart Industries', 'Freelancer', 'Marketing, Consulting, Web Development', 'Charlotte Young', 'charlotte.young@example.com', '7654321098', 'Washington, D.C.'),
# ('Creative Enterprises', 'Company', 'Design, Web Development, Training', 'Henry Lewis', 'henry.lewis@example.com', '2345678901', 'Raleigh, NC'),
# ('Innovative Solutions', 'Consulting Firm', 'Marketing, Web Development, Consulting', 'Ella Clark', 'ella.clark@example.com', '8901234567', 'Houston, TX'),
# ('Global Tech', 'Startup', 'Training, Design, Web Development', 'Jackson Hernandez', 'jackson.hernandez@example.com', '4567890123', 'San Francisco, CA'),
# ('Advanced Enterprises', 'Freelancer', 'Web Development, Marketing, Consulting', 'Scarlett Moore', 'scarlett.moore@example.com', '9876543210', 'Chicago, IL'),
# ('Tech Solutions', 'Company', 'Design, Consulting, Web Development', 'Jacob King', 'jacob.king@example.com', '6543210987', 'New York, NY'),
# ('Smart Tech', 'Consulting Firm', 'Training, Web Development, Design', 'Madison Perez', 'madison.perez@example.com', '3210987654', 'Los Angeles, CA'),
# ('Creative Consulting', 'Startup', 'Marketing, Design, Web Development', 'William Wood', 'william.wood@example.com', '0987654321', 'Chicago, IL');


# CREATE TABLE contact_messages (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     name VARCHAR(255) NOT NULL,
#     phone VARCHAR(20) NOT NULL,
#     email VARCHAR(255) NOT NULL,
#     message TEXT NOT NULL,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );

# CREATE TABLE users (
#     id SERIAL PRIMARY KEY,
#     name VARCHAR(255) NOT NULL,
#     email VARCHAR(255) NOT NULL UNIQUE,
#     password VARCHAR(255) NOT NULL,a
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );

# CREATE TABLE partners (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     name VARCHAR(255) NOT NULL,
#     expertise VARCHAR(255) NOT NULL,
#     organization_type VARCHAR(255) NOT NULL,
#     resources TEXT,
#     contact VARCHAR(255),
#     location VARCHAR(255)
# );
