SELECT 
users.name,
COUNT(*) count
FROM messages 
INNER JOIN users ON messages.user_id = users.id
WHERE Extract(Month from date) = 5 and Extract(Day from date) = 9
GROUP BY messages.user_id;