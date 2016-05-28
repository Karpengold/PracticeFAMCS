select users.name,
date, text from messages 
INNER JOIN users ON messages.user_id = users.id
where char_length(text)>139;
