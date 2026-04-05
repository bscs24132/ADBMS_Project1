use adbms_proj1;

create table users (
    id int auto_increment primary key,
    username varchar(15) not null unique,
    password varchar(255) not null,
    bio text,
    email varchar(255) unique,
    profile_picture varchar(255),
    date_joined datetime default current_timestamp,
    role enum('user','writer','admin') not null
);

create table password_reset_requests (
    id int auto_increment primary key,
    user_id int not null,
    email varchar(255) not null,
    requested_at datetime default current_timestamp,
    status enum('pending', 'processed', 'cancelled') default 'pending',
    foreign key (user_id) references users(id) on delete cascade
);

create table wallets (
    user_id int primary key,
    coin_balance int default 0,
    updated_at datetime default current_timestamp 
        on update current_timestamp,
    foreign key (user_id) references users(id)
        on delete cascade
);

create table notebooks (
    id int auto_increment primary key,
    title varchar(255) not null,
    description text,
    author_id int not null,
    is_approved boolean default false,
    created_at datetime default current_timestamp,
    foreign key (author_id) references users(id)
        on delete cascade
);

create table books (
    id int auto_increment primary key,
    title varchar(255) not null,
    description text,
    content text,
    author_id int not null,
    coin_price int default 0,
    cover_image varchar(255),
    is_approved boolean default false,
    created_at datetime default current_timestamp,
    foreign key (author_id) references users(id)
        on delete cascade
);

create table posts (
    id int auto_increment primary key,
    notebook_id int null,
    author_id int not null,
    content text,
    image varchar(255),
    created_at datetime default current_timestamp,
    foreign key (author_id) references users(id)
        on delete cascade,
    foreign key (notebook_id) references notebooks(id)
        on delete set null
);

create table likes (
    user_id int,
    post_id int,
    created_at datetime default current_timestamp,
    primary key (user_id, post_id),
    foreign key (user_id) references users(id)
        on delete cascade,
    foreign key (post_id) references posts(id)
        on delete cascade
);

create table comments (
    id int primary key auto_increment,
    user_id int,
    post_id int,
    content text not null,
    created_at datetime default current_timestamp,
    foreign key (user_id) references users(id),
    foreign key (post_id) references posts(id)
);

create table transactions (
    user_id int,
    book_id int,
    coins_spent int not null,
    purchased_at datetime default current_timestamp,
    primary key (user_id, book_id),
    foreign key (user_id) references users(id)
        on delete cascade,
    foreign key (book_id) references books(id)
        on delete cascade
);

create table follows (
    follower_id int,
    following_id int,
    created_at datetime default current_timestamp,
    primary key (follower_id, following_id),
    foreign key (follower_id) references users(id)
        on delete cascade,
    foreign key (following_id) references users(id)
        on delete cascade
);

create table groupchats (
    id int auto_increment primary key,
    name varchar(255) not null,
    created_by int not null,
    writer_id int,
    created_at datetime default current_timestamp,
    foreign key (created_by) references users(id)
        on delete cascade,
    foreign key (writer_id) references users(id)
        on delete set null
);

create table members (
    user_id int,
    group_id int,
    role enum('admin','member') default 'member',
    joined_at datetime default current_timestamp,
    primary key (user_id, group_id),
    foreign key (user_id) references users(id)
        on delete cascade,
    foreign key (group_id) references groupchats(id)
        on delete cascade
);

create table messages (
    id int auto_increment primary key,
    group_id int not null,
    sender_id int not null,
    content text not null,
    sent_at datetime default current_timestamp,
    foreign key (group_id) references groupchats(id)
        on delete cascade,
    foreign key (sender_id) references users(id)
        on delete cascade
);


create index u_name on users(username);
create index u_date on users(date_joined);
create index w_coins on wallets(coin_balance);
create index nb_author on notebooks(author_id);
create index b_author on books(author_id);
create index b_price on books(coin_price);
create index b_time on books(created_at);
create index p_author on posts(author_id);
create index p_time on posts(created_at);
create index l_postid on likes(post_id);
create index l_userid on likes(user_id);
create index comment_postid on comments(post_id);
create index comment_userid on comments(user_id);
create index t_userid on transactions(user_id);
create index t_bookid on transactions(book_id);
create index t_time on transactions(purchased_at);
create index followers_id on follows(follower_id);
create index followings_id on follows(following_id);
create index groupchatsid on groupchats(id);
create index groupchats_name on groupchats(name);
create index members_groupid on members(group_id);
create index membersid on members(user_id);
create index messagesid on messages(id);
create index messages_groupid on messages(group_id);
create index messages_senderid on messages(sender_id);
create index messages_time on messages(group_id, sent_at);

create view user_profiles as
select u.id, u.username, u.bio, u.profile_picture, u.role, u.date_joined, w.coin_balance,
(select COUNT(*) from books where author_id = u.id) as no_of_books,
(select COUNT(*) from posts where author_id = u.id and notebook_id is null) as no_of_posts,
(select COUNT(*) from posts where author_id = u.id and notebook_id is not null) as no_of_writings,
(select COUNT(*) from follows where following_id = u.id) as no_of_followers,
(select COUNT(*) from follows where follower_id = u.id) as no_of_followings
from users u left join wallets w on u.id = w.user_id;

create view post_stats as
select p.id, p.content, p.image, p.created_at, u.username as author_name,
(select COUNT(*) from likes where post_id = p.id) as like_count,
(select COUNT(*) from comments where post_id = p.id) as comment_count
from posts p
join users u on p.author_id = u.id
where notebook_id is null;

create view book_stats as
select b.id, b.title, b.description, b.coin_price, b.cover_image, b.created_at, u.username as author_name, u.id as author_id,
(select count(*) from transactions where book_id = b.id) as no_of_sales,
(select sum(coins_spent) from transactions where book_id = b.id) as total_revenue
from books b join users u on b.author_id = u.id;



CREATE TABLE coin_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coins_purchased INT NOT NULL,
    account_no VARCHAR(20) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);