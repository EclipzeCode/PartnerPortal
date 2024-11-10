# Partner Portal

Welcome to Partner Portal, a web application designed to connect users with various types of business partners based on their needs.

## Features

Filter Partners: Easily filter partners by organization type, location, and available resources.

Pagination: Navigate through a list of partners with pagination controls.

Search: Search partners by name, type, expertise, resources, email, phone number, location, or description.
    
Dark Mode: Toggle between light and dark mode for different viewing preferences.
    
Add Partner: Add new partners to the portal. 

Remove Partner: Remove partners from the portal.

## Technologies Used

Frontend: HTML, CSS, JavaScript (ES6+), Fetch API

Backend: Python (Flask), MySQL Database

Additional Tools: bcrypt for password hashing, CORS for cross-origin resource sharing


## Setup Instructions

Clone the repository

Install dependencies:

Backend (Python/Flask):
```bash
pip install -r requirements.txt
```
Frontend (JavaScript/HTML/CSS): No additional setup required.

Database Setup:

Ensure MySQL server is installed and running.

Create a new database named partnerportaldb.

Import the database schema from database_schema.sql.

Run the Application:

Start the Flask backend server:

Enter "python app.py" in the terminal

Open index.html in a web browser to access the frontend.

## Usage

Navigate through partners using the filtering, searching, and pagination features.
Add new partners using the "Add Partner" button in the interface.
Remove partners using the "Remove Partner" button in the interface.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)