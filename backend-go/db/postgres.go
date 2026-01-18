package db

import (
	"backend/graphql/generated"
	"context"
	"fmt"
	"os"
	"strconv"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Postgres struct {
	pool *pgxpool.Pool
}

func NewPostgres() Postgres {
	dbURL := os.Getenv("DATABASE_URL")
	pool, err := pgxpool.Connect(context.Background(), dbURL)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	return Postgres{pool}
}

func (db Postgres) GetPool() *pgxpool.Pool {
	return db.pool
}

func (db Postgres) GetUser(ctx context.Context, id string) (*generated.User, error) {
	var user generated.User
	var dbID int

	// Convert string ID to int to satisfy Postgres
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid user id: %s", id)
	}


	query := "SELECT id, name, email FROM users WHERE id=$1"
	err = db.pool.QueryRow(ctx, query, idInt).Scan(&dbID, &user.Name, &user.Email)

	if err != nil {
		return nil, fmt.Errorf(`no user found: %s`, err.Error())
	}

	user.ID = strconv.Itoa(dbID)
	return &user, nil
}

func (db Postgres) GetPost(ctx context.Context, id string) (*generated.Post, error) {
	var post generated.Post
	var author generated.User
	var pID, aID int

	idInt, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("invalid user id: %s", id)
	}


	query := "SELECT id, title, content, published, author_id FROM posts WHERE id=$1"
	err = db.pool.QueryRow(ctx, query, idInt).Scan(&pID, &post.Title, &post.Content, &post.Published, &aID)

	if err != nil {
		return nil, fmt.Errorf(`no post found: %s`, err.Error())
	}

	post.ID = strconv.Itoa(pID)
	author.ID = strconv.Itoa(aID)
	post.Author = &author

	return &post, nil
}

func (db Postgres) GetPosts(ctx context.Context, userID string) ([]*generated.Post, error) {
	// Convert ID SAFELY
	uIDInt, err := strconv.Atoi(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid userID: %s", userID)
	}

	query := "SELECT id, title, content, published, author_id FROM posts WHERE author_id=$1"
	rows, err := db.pool.Query(ctx, query, uIDInt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*generated.Post

	for rows.Next() {
		// Create a NEW post per iteration
		post := &generated.Post{}
		var aID, pID int

		err := rows.Scan(&pID, &post.Title, &post.Content, &post.Published, &aID)
		if err != nil {
			return nil, err
		}

		post.ID = strconv.Itoa(pID)
		post.Author = &generated.User{ID: strconv.Itoa(aID)}

		posts = append(posts, post)
	}

	return posts, nil
}


func (db Postgres) CreatePost(ctx context.Context, input generated.CreatePostInput) (*generated.Post, error) {
	// Convert user ID SAFELY
	uIDInt, err := strconv.Atoi(input.UserID)
	if err != nil {
		return nil, fmt.Errorf("invalid userID: %s", input.UserID)
	}

	post := &generated.Post{}
	var newID int

	query := `
		INSERT INTO posts (title, content, author_id)
		VALUES ($1, $2, $3)
		RETURNING id, title, content, published
	`

	err = db.pool.QueryRow(
		ctx,
		query,
		input.Title,
		input.Content,
		uIDInt,
	).Scan(&newID, &post.Title, &post.Content, &post.Published)

	if err != nil {
		return nil, err
	}

	post.ID = strconv.Itoa(newID)
	post.Author = &generated.User{ID: input.UserID}

	return post, nil
}


func (db Postgres) DeletePost(ctx context.Context, id string) (bool, error) {
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return false, fmt.Errorf("invalid user id: %s", id)
	}

	query := "DELETE FROM posts WHERE id = $1"
	_, err = db.pool.Exec(ctx, query, idInt)
	
	if err != nil {
		return false, err
	}
	return true, nil
}

func (db Postgres) AllPosts(ctx context.Context) ([]*generated.Post, error) {
	var posts []*generated.Post

	// JOIN uses internal columns (both integers), so no conversion needed here
	query := `SELECT p.id, p.title, p.content, p.published, p.author_id, u.name 
			  FROM posts p 
			  INNER JOIN users u ON p.author_id = u.id 
			  ORDER BY p.id DESC`

	rows, err := db.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		post := &generated.Post{}
		var authorName string
		var pID, aID int

		err = rows.Scan(&pID, &post.Title, &post.Content, &post.Published, &aID, &authorName)
		if err != nil {
			return nil, err
		}

		post.ID = strconv.Itoa(pID)
		post.Author = &generated.User{
			ID:   strconv.Itoa(aID),
			Name: authorName,
		}

		posts = append(posts, post)
	}

	return posts, nil
}