1\. Clone the Repository  
git clone https://github.com/bscs24132/ADBMS\_Project1.git  
cd ADBMS-Project1/phase2

2\. Create Virtual Environment  
\# Windows  
python \-m venv venv  
venv\\Scripts\\activate  
\# Mac/Linux  
python3 \-m venv venv  
source venv/bin/activate

3\. Install Dependencies  
pip install \-r requirements.txt

4\. Create MySQL Database

5\. Run Schema and Seed Files

6\. Configure Environment Variables  
Change .env.example to .env  
Update with your MySQL password:  
DB\_PASSWORD=your\_mysql\_password

7\. Run Migrations  
cd backend  
python manage.py migrate

8\. Start Server  
python manage.py runserver

9\. Access the API  
Base URL: http://127.0.0.1:8000/  
Swagger Docs: http://127.0.0.1:8000/swagger/

10\. Test Registration  
curl \-X POST http://localhost:8000/api/v1/auth/register \\  
  \-H "Content-Type: application/json" \\  
  \-d '{"username": "testuser123", "email": "testuser123@gmail.com", "password": "Test@123", "role": "user"}'

Expected Response:  
json  
{  
    "user": {  
        "id": 1,  
        "username": "testuser123",  
        "email": "testuser123@gmail.com",  
        "role": "user"  
    },  
    "access": "eyJhbGciOiJIUzI1NiIs...",  
    "refresh": "eyJhbGciOiJIUzI1NiIs..."  
}