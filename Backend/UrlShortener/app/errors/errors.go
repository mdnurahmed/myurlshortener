package errors

type CollisionError struct {
	Message string
}

func (m *CollisionError) Error() string {
	if m.Message != "" {
		return m.Message
	}
	return "Failed to find a unique short url due to collisions"
}

type DatabaseError struct {
	Message string
}

func (m *DatabaseError) Error() string {
	if m.Message != "" {
		return m.Message
	}
	return "Failed operation with the database"
}
