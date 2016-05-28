SELECT 
users.name,
COUNT(*) count
FROM messages 
INNER JOIN users ON messages.user_id = users.id
WHERE messages.date = CURDATE()
GROUP BY messages.user_id
HAVING COUNT(*) > 3;
