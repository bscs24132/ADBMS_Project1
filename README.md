## Project Overview
#Group Members:
#1. Name: Maha Faisal           Roll-Number: Bscs24048
#2. Name: Huda Imran            Roll-Number: Bscs24132


This project is a platform designed for authors and their readers. It is inspired by social media platforms, but it is not a typical social media app. Instead, it focuses on creating a space where authors can share their work and directly interact with their audience.
There are three types of users in the system: authors, admin and readers. The users can follow each other regardless of the fact whether they are a writer or a reader. An admin is not a usual user. An admin's only there to monitor the whole platform and has the authority to delete a post, delete a group, approve the books that the writer wants to upload on our platform for their fans to read, and can also reset password of an account by entering a new password for the requested account and emailing the requested the new password. Similarly, a reader is allowed to post posts, create groupchats and can link that groupchat to a writer. This will help the fans of the writer to find the groupchats that are linked to their favorite writers easily by filtering them. This helps people with same interests to connect on our platform. The readers can also buy coins and subscription for books and send messages in the groupchat. A writer can also follow other users, join groupchats but cannot create them, buy coins and subcriptions, upload their books that will be uploaded after the admin approves their upload, and can also post writings on their notebooks by creating a notebook if they want to. Every writer has their own personal dashboard where they can take a look on the graphs representing the sale of their books etc.
The posts posted can be either text-based or include a single image. Other users can like and comment on these posts that makes the platform interactive and engaging.
Overall, the goal of this project is to create a simple and interactive platform that encourages connection between authors and readers while also supporting content sharing and basic monetization features.

## Tech Stack

### Frontend
- **React 18.2.0** – UI component library
- **React Router DOM 6.14.0** – Client-side routing
- **Axios 1.4.0** – HTTP client with request/response interceptors
- **Material-UI (MUI) 5.14.0** – Component library and icons
- **Recharts 2.8.0** – Charting library for writer analytics dashboard

### Backend
- **Django 5.2.11** – Web application framework
- **Django REST Framework 3.14.0** – REST API development
- **SimpleJWT 5.3.0** – JWT authentication with token blacklisting
- **django-cors-headers 4.3.0** – CORS middleware
- **drf-yasg 1.21.7** – Swagger/OpenAPI documentation
- **bcrypt 4.0.1 / argon2-cffi 23.1.0** – Password hashing
- **python-dotenv 1.0.0** – Environment variable management

### Database
- **MySQL 8.0** – Relational database
- **mysqlclient 2.2.0** – Database driver
- **MEDIUMBLOB** – Binary image storage (BLOB)

### Authentication
- **JWT (JSON Web Tokens)** – Stateless authentication
- **Access Token** – 60 minutes expiry
- **Refresh Token** – 1 day expiry with blacklist support
- **Argon2/bcrypt** – Password hashing
- **RBAC** – 4 roles: Admin, Writer, User, Group Admin

### Development Tools
- **Git** – Version control
- **GitHub** – Repository hosting
- **npm** – Frontend package management
- **pip** – Backend package management
- **venv** – Python virtual environment

## System Architecture

The system is divided into three main parts: frontend, backend, and database.
The frontend is the part that the user interacts with. When a user clicks something or performs any action, that request is sent to the backend through the defined endpoints (like URLs).
The backend is where all the main logic is written. It receives the request, figures out what the user wants to do, and then runs the related code for that specific action.
After that, the backend interacts with the database. Depending on the request, it can either fetch data (like posts or user info) or update/store new data (like creating a post or changing the bio). These operations are handled through queries written in the backend.
All three parts work together so that the user’s actions are processed properly and the data is stored and retrieved when needed.

## UI Examples

1. **Feed of a user**: Shows posts of users that a user is following.
2. **Writer Dashboard**: Allows a writer to evaluate their book performance, view sales analytics, and manage content.
3. **Group Chat**: Members can send and receive messages.

*Note: All screenshots are present in the `media/` folder.*
## Setup & Installation
### Prerequisites

Before getting started, make sure you have the following software installed:

| Software  | Minimum Version| Purpose                 |
| Python    | 3.11 or higher | Backend runtime         |
| Node.js   | 18.x or higher | Frontend runtime        |
| MySQL     | 8.0 or higher  | Database engine         |
| Git       | Latest         | Version control         |

### Step-by-Step Installation

1. Clone the Repository:
git clone <your-repository-url>
cd ADBMS_Project1

2. Backend Setup:
cd Phase2
python -m venv venv
# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

3. Configure Environment Variables:

Create a `.env` file inside the `Phase2` folder with the following content:
DB_NAME=adbms_proj1
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your-super-secret-key-here
JWT_SECRET=your-jwt-secret-here

**Environment Variables Explained:**
DB_NAME: Name of your MySQL database
DB_USER: MySQL username (default: root)
DB_PASSWORD: Your MySQL password
DB_HOST: Database host (localhost for local development)
DB_PORT: MySQL port (default: 3306)
SECRET_KEY: Django secret key for cryptographic signing
JWT_SECRET: Secret key for JWT token generation

4. Database Setup:
# Open MySQL and create the database
mysql -u root -p
CREATE DATABASE adbms_proj1;
EXIT;
# Run schema and seed files
mysql -u root -p adbms_proj1 < schema.sql
mysql -u root -p adbms_proj1 < seed.sql

5. Run Backend Server:
cd backend
python manage.py migrate
python manage.py runserver
Backend runs at: http://localhost:8000

6. Frontend Setup (Open a new terminal):
cd frontend
npm install
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000/api/v1" > .env
npm start
Frontend runs at: http://localhost:3000

### Quick Start Commands Summary

Terminal 1 - Backend:
cd Phase2
# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
cd backend
python manage.py runserver

Terminal 2 - Frontend:
cd frontend
npm start

### Access the Application

Frontend App: http://localhost:3000
Backend API: http://localhost:8000/api/v1
Swagger Documentation: http://localhost:8000/swagger/
ReDoc Documentation: http://localhost:8000/redoc/

## User Roles

The system defines three primary user roles: Admin, Writer, and Reader. Additionally, within each group chat, a Group Admin role exists for managing specific chat rooms.
**Admin**: The admin is responsible for monitoring the entire platform. An admin can approve or reject books that writers upload, view and process password reset requests, delete inappropriate posts or comments, deletgroupchats, and view all users and transactions. However, an admin cannot create posts, upload books, or join or create group chats. To test the admin role, use username `alex_wright` with password `Adm!n@2023`.
**Writer**: A writer can upload books which require admin approval before becoming visible on our platform, create notebooks to organize their writings, post writings inside their notebooks, create regular text or image posts (single image allowed), purchase books and view them in their personal library, and view their personal analytics dashboard showing graphs of book sales, revenue, and engagement's summarized analysis. Writers can also follow or unfollow other users, buy coins using simulated payment, purchase books to read, and join or leave (if joined) an existing group chats and send messages. Writers cannot create group chats or approve books. To test the writer role, use username `maya_stone` with password `Myst!c99xA`.
**Reader**: A reader can create regular posts, create group chats and link them to specific writers so fans can easily find communities around their favorite authors, join or leave group chats, send messages in group chats, buy coins, purchase books, follow or unfollow writers and other users, view purchased books in their personal library, and like or comment on posts. Readers cannot upload books, create notebooks, or view analytics dashboards. To test the reader role, use username `sara_hill` with password `Sara@H123`.
**Group Admin** – Within any group chat, the creator becomes the group admin.

## Feature Walkthrough

**User Registration & Login**  
Anyone can create an account using a username, email, and password. After registering, users can log in with either their username or email. Upon login, they get JWT access and refresh tokens. This uses the `/register` and `/login` pages and the `POST /auth/register` and `POST /auth/login` API endpoints.

**Posts Feed**  
Users and writers can see a personalized feed. The "Following" tab shows posts from people they follow, and the "For You" tab shows recommended posts from writers they don’t follow. This is on the dashboard page (`/dashboard`) and uses `GET /posts/feed/following` and `GET /posts`.

**Create Post**  
Any logged-in user can create a new post through a dialog on the dashboard. This uses the `POST /posts/` endpoint.

**Like and Comment**  
Users can like/unlike posts and add comments. They can also edit or delete their own comments. This works on all posts and uses `POST /posts/{id}/like`, `POST /posts/{id}/comments`, `PUT /comments/{id}`, and `DELETE /comments/{id}/delete`.

**Follow System**  
Users can follow or unfollow anyone, whether they are writers or readers. This happens on a user’s profile page using `POST /users/{id}/follow`.

**Profile Page**  
Users can view other users’ profiles, showing username, bio, profile picture, role, join date, and follower/following counts. Clicking followers/following shows a list of those users. Writers have extra tabs for Books, Notebooks, and Group Chats. This uses `/profile/{id}` and `GET /users/{id}`.

**Edit Profile**  
Users can edit their own bio and profile picture via `/profile/edit` using `PUT /users/profile`.

**Books Search**  
Users can search for approved books by title keyword. Results show the cover, title, author, price, and a short description. This is on `/search` under the "Books" tab using `GET /books?search=`.

**User Search**  
Users can search for other users by username. Results show avatar, username, and role, and clicking a result goes to that user’s profile. This is on `/search` under the "Users" tab using `GET /users/search/`.

**Book Details and Purchase**  
Users can see detailed info about any approved book. If they already own it, they can read it; if not, they see their coin balance and a purchase button. Buying a book deducts coins and records the transaction. This uses `/books/{id}`, `GET /books/{id}`, and `POST /books/{id}/purchase`.

**My Library**  
Users can view all their purchased books. Each book tile shows the title, author, and an "In Library" badge. Clicking opens the book details. This is at `/my-books` using `GET /books/purchased/`.

**Wallet and Coins**  
Users can see their coin balance and transaction history for both book purchases and coin purchases. They can buy coins with a simulated payment by entering an amount and a fake account number. This is at `/wallet` using `GET /wallet`, `GET /wallet/transactions`, and `POST /wallet/buy-coins/`.

**Notebooks**  
When viewing a writer’s profile, users can see all their notebooks. Clicking a notebook shows all writings with content, images, and timestamps. This is at `/notebooks/{id}` using `GET /notebooks/{id}` and `GET /posts/notebooks/{id}/posts/`.

**Group Chats**  
Users can see all joined group chats on `/groups`. They can open any group to send and receive messages. New messages are fetched every 5 seconds. This uses `GET /groupchats/my/`, `GET /groupchats/{id}/messages/`, and `POST /groupchats/{id}/messages/`.

**Create Group**  
Readers can create a group on any writer’s profile. They provide a name, and the creator becomes the admin. This uses `POST /groupchats/create/`.

**Join and Leave Group**  
Users can join a group chat from a writer’s profile. Once joined, the "Join Group" button changes to "Open Chat". They can leave any group via a "Leave Group" button. This uses `POST /groupchats/{id}/join/` and `POST /groupchats/{id}/leave/`.

**Admin Dashboard**  
Admins can see pending books and approve or reject them. They can also view password reset requests and mark them as processed. This uses `GET /admin/books/pending`, `POST /admin/books/{id}/approve`, `GET /admin/password-reset-requests`, and `POST /admin/password-reset-requests/{id}/process`.

**Writer Dashboard**  
Writers can see their posts, books, notebooks, and analytics. Analytics shows charts for book sales, revenue, best-selling books, and engagement like total likes and comments. This uses `GET /books/stats` along with aggregated data from posts, likes, and transactions.

**Writer Book Upload**  
Writers can upload books with title, description, content, price, and optional cover image. Books are pending approval until admins approve them. This uses `POST /books/`.

**Writer Notebook Creation**  
Writers can create notebooks to organize writings. Each notebook has a title and optional description. Individual writings can then be posted inside notebooks. This uses `POST /notebooks/` and `POST /notebooks/{id}/posts`.

## Transaction Scenarios

**Transaction #1: Buying a Book**  
This happens when a user clicks the "Buy" button on a book page. The system makes sure everything happens safely by using a transaction block (`transaction.atomic()` in Django). Basically, it checks the book price, locks the book and the user’s wallet so no one else can change them at the same time, and then sees if the user has enough coins. If yes, the coins are deducted, a transaction record is saved, and the user gets access to the book. If anything goes wrong—like not enough coins, book missing, user already owns it, or some database error—the whole thing is canceled. This is done in the `PurchaseBookView` class in `books/views.py` at the endpoint `POST /api/v1/books/{id}/purchase/`.

**Transaction #2: Creating a Group**  
This happens when a user clicks "Create Group" on a writer’s profile and enters a group name. The system first adds a new record for the group in the database, then gets the group ID, and finally makes the creator an admin in the members table. If the group name is empty, the writer doesn’t exist, or some database rule fails, the whole action is rolled back. This is handled in the `CreateGroupView` class in `groupchat/views.py` at the endpoint `POST /api/v1/groupchats/create/`.

**Transaction #3: Buying Coins (Simulated)**  
This occurs when a user clicks "Confirm Purchase" on the wallet page to buy coins. The system checks that the input is correct (amount of coins, account number, payment), adds a purchase record, and updates the user’s wallet. If something is wrong—like account number missing, coin amount zero or negative, or a database error—the transaction is canceled. This is done in the `BuyCoinsView` class in `accounts/views.py` at the endpoint `POST /api/v1/wallet/buy-coins/`.

## ACID Compliance

**Atomicity**  
We use Django’s `transaction.atomic()` for operations like buying a book, creating a group, or buying coins. This ensures everything in a transaction happens together—if something goes wrong, everything is rolled back. We also have a `before_transaction_insert` trigger that checks the wallet balance before a transaction proceeds, adding an extra layer of safety.
**Consistency**  
The database keeps everything correct using foreign key relationships between tables like `users`, `wallets`, `transactions`, and `books`. `CHECK` and `NOT NULL` constraints make sure data stays valid. Triggers like `after_transaction_insert` automatically update wallet balances after a successful transaction, so everything stays consistent.
**Isolation**  
During purchases, `SELECT ... FOR UPDATE` locks the relevant wallet and book rows. This prevents multiple users from overspending coins or buying the same book at the same time. MySQL’s default `REPEATABLE READ` isolation level also ensures each transaction sees a consistent snapshot of the database.
**Durability**  
We use MySQL’s InnoDB engine, which writes all committed transactions to the redo log and then to disk. Once a transaction is committed using `transaction.atomic()`, the changes persist even if the system crashes or loses power. The `after_user_insert` trigger also ensures every new user automatically gets a wallet with zero coins.

## 10. Indexing & Performance

### Indexes Created in the Database

| Index Name        | Table        | Column(s)         | Purpose                                               |
| `u_name`          | users        | username          | Speeds up login and profile lookup by username        |
| `u_date`          | users        | date_joined       | Speeds up sorting users by join date                  |
| `w_coins`         | wallets      | coin_balance      | Speeds up balance checks during coin purchases        |
| `nb_author`       | notebooks    | author_id         | Speeds up fetching all notebooks by a specific writer |
| `b_author`        | books        | author_id         | Speeds up fetching all books by a specific writer     |
| `b_price`         | books        | coin_price        | Speeds up filtering and sorting books by price        |
| `b_time`          | books        | created_at        | Speeds up sorting books by creation date              |
| `p_author`        | posts        | author_id         | Speeds up fetching all posts by a specific user       |
| `p_time`          | posts        | created_at        | Speeds up sorting posts by date for feeds             |
| `l_postid`        | likes        | post_id           | Speeds up counting likes per post                     |
| `l_userid`        | likes        | user_id           | Speeds up checking if a user liked a specific post    |
| `comment_postid`  | comments     | post_id           | Speeds up fetching comments for a post                |
| `comment_userid`  | comments     | user_id           | Speeds up fetching comments by a specific user        |
| `t_userid`        | transactions | user_id           | Speeds up fetching purchase history for a user        |
| `t_bookid`        | transactions | book_id           | Speeds up counting sales per book                     |
| `t_time`          | transactions | purchased_at      | Speeds up sorting transactions by date                |
| `followers_id`    | follows      | follower_id       | Speeds up finding who a user follows                  |
| `followings_id`   | follows      | following_id      | Speeds up finding who follows a user                  |
| `groupchats_name` | groupchats   | name              | Speeds up searching for groups by name                |
| `members_groupid` | members      | group_id          | Speeds up fetching all members of a group             |
| `membersid`       | members      | user_id           | Speeds up finding all groups a user belongs to        |
|`messages_groupid` | messages     | group_id          | Speeds up loading messages for a specific group       |
|`messages_senderid`| messages     | sender_id         | Speeds up finding messages by a specific sender       |
| `messages_time`   | messages     | group_id, sent_at | Speeds up sorting messages by time within a group     |

### Performance Summary (from performance.sql)

| Query Type                  | Before Index                      | After Index                         | 
| User login by username      | Full table scan over all users    | Index lookup using `u_name`         | 
| Fetch posts by author       | Full table scan over posts table  | Index scan using `p_author`         | 
| Count likes per post        | Full table scan over likes table  | Index scan using `l_postid`         | 
| User's transaction history  | Full table scan over transactions | Index scan using `t_userid`         | 
| Fetch group messages        | Full table scan over messages     | Index scan using `messages_groupid` | 
| Search books by price range | Full table scan over books        | Index scan using `b_price`          | 
| Sort posts by date          | Filesort on entire posts table    | Index scan using `p_time`           | 

## 11. API Reference

| Method | Route                                       |AuthRequired| Purpose                                       |
| POST   | /auth/register                              | No         | Register a new user                           |
| POST   | /auth/login                                 | No         | Login with username or email                  |
| POST   | /auth/logout                                | Yes        | Logout and blacklist refresh token            |
| GET    | /users/profile                              | Yes        | Get current user's profile                    |
| PUT    | /users/profile                              | Yes        | Update current user's bio or profile picture  |
| GET    | /users/{id}                                 | No         | Get public profile of any user                |
| POST   | /users/{id}/follow                          | Yes        | Follow or unfollow a user                     |
| GET    | /users/{id}/followers                       | No         | Get list of users following this user         |
| GET    | /users/{id}/following                       | No         | Get list of users this user follows           |
| GET    | /users/search/                              | No         | Search users by username                      |
| GET    | /posts                                      | No         | Get  posts feed (all posts or filtered)       |
| POST   | /posts                                      | Yes        | Create a new post (text or image)             |
| GET    | /posts/{id}                                 | No         | Get details of a single post                  |
| PUT    | /posts/{id}                                 | Yes        | Update own post                               |
| DELETE | /posts/{id}                                 | Yes        | Delete own post                               |
| POST   | /posts/{id}/like                            | Yes        | Like or unlike a post                         |
| GET    | /posts/{id}/likes                           | No         | Get list of users who liked a post            |
| POST   | /posts/{id}/comments                        | Yes        | Add a comment to a post                       |
| GET    | /posts/{id}/comments/list                   | No         | Get all comments for a post                   |
| PUT    | /comments/{id}                              | Yes        | Update own comment                            |
| DELETE | /comments/{id}/delete                       | Yes        | Delete own comment                            |
| GET    | /books                                      | No         | List all approved books                       |
| GET    | /books/{id}                                 | No         | Get details of a specific book                |
| POST   | /books/{id}/purchase                        | Yes        | Purchase a book using coins                   |
| GET    | /wallet                                     | Yes        | Get current user's coin balance               |
| GET    | /wallet/transactions                        | Yes        | Get user's transaction history                |
| POST   | /wallet/buy-coins/                          | Yes        | Purchase coins (simulated payment)            |
| GET    | /notebooks/{id}                             | No         | Get details of a notebook                     |
| GET    | /notebooks/{id}/posts/                      | No         | Get all writings inside a notebook            |
| GET    | /groupchats/my/                             | Yes        | Get all groups user is a member of            |
| POST   | /groupchats/create/                         | Yes        | Create a new group linked to a writer         |
| POST   | /groupchats/{id}/join/                      | Yes        | Join an existing group                        |
| POST   | /groupchats/{id}/leave/                     | Yes        | Leave a group                                 |
| GET    | /groupchats/{id}/messages/                  | Yes        | Get all messages in a group                   |
| POST   | /groupchats/{id}/messages/                  | Yes        | Send a message to a group                     |
| GET    | /admin/books/pending                        | Admin only | Get list of books awaiting approval           |
| POST   | /admin/books/{id}/approve                   | Admin only | Approve a pending book                        |
| GET    | /admin/password-reset-requests              | Admin only | Get list of password reset requests           |
| POST   | /admin/password-reset-requests/{id}/process | Admin only | Mark a reset request as processed             |

## Known Issues & Limitations: 
None