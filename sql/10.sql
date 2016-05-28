SELECT * FROM (
    SELECT * FROM messages ORDER BY date DESC LIMIT 5
) sub
ORDER BY date ASC
