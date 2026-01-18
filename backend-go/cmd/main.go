package main

import (
    "backend/db"
    "backend/graphql"
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
    "github.com/rs/cors"
)

func main() {
    // Load environment variables
    _ = godotenv.Load() // Loads .env from current directory by default

    // Use Port from environment or default to 4000
    port := os.Getenv("PORT")
    if port == "" {
        port = "4000"
    }

    router := mux.NewRouter()

    // Initialize Database
    postgres := db.NewPostgres()
    defer postgres.GetPool().Close()

    // Pass dependencies to GraphQL handler
    graphql.Run(router, postgres)

    // CORS configuration for React frontend
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:3000"},
        AllowCredentials: true,
        AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders:   []string{"Content-Type", "Authorization"},
    })

    handler := c.Handler(router)

    fmt.Printf("Server is running on port %s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, handler))
}