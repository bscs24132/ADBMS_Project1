explain analyze select * from users where role='user';
explain analyze select username, count(follows.follower_id) from users
join follows where users.id=follows.following_id
group by follows.following_id;
explain analyze  select * from books where is_approved=true;
explain analyze select * from messages where group_id=1;
explain analyze select * from books 
where author_id = 5 and is_approved = true 
order by created_at desc;

-- before indexing almost all of the records where searched
-- after indexing the queries  used indexes for faster searches and the overall time decreased
-- 
-- indexing sorted the data in the tables so searching was faster after indexing as we can use binary search for searching in sorted data
-- 