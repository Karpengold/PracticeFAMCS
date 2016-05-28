SELECT users.name FROM users WHERE Users.id IN (SELECT Messages.user_id FROM chat.Messages GROUP BY Messages.user_id HAVING COUNT(*) >3)
