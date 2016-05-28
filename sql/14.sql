select users.name, text,date from messages
INNER JOIN users ON messages.user_id = users.id
where  text like '%hello%';
