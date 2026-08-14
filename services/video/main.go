package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Video struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	URL         string `json:"url"`
}

var db *sql.DB
var minioClient *minio.Client

func main() {
	var err error
	
	// Database connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "user"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_NAME", "nexora_db"),
	)
	
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v\n", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Printf("Warning: Could not connect to database at startup: %v\n", err)
	} else {
		log.Println("Connected to PostgreSQL database")
		initDB()
	}

	// MinIO connection
	endpoint := getEnv("MINIO_ENDPOINT", "localhost:9005")
	accessKeyID := getEnv("MINIO_ACCESS_KEY", "minioadmin")
	secretAccessKey := getEnv("MINIO_SECRET_KEY", "minioadmin")
	useSSL := false

	minioClient, err = minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Printf("Warning: Could not connect to MinIO: %v\n", err)
	} else {
		log.Println("Connected to MinIO")
	}

	r := mux.NewRouter()
	
	// API routes
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")
	r.HandleFunc("/api/videos", getVideosHandler).Methods("GET")
	r.HandleFunc("/api/videos/upload-url", getPresignedUploadUrlHandler).Methods("GET")
	r.HandleFunc("/api/videos", uploadVideoHandler).Methods("POST")
	
	port := getEnv("PORT", "8081")
	log.Printf("Video Service starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func initDB() {
	query := `
	CREATE TABLE IF NOT EXISTS videos (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		url VARCHAR(255) NOT NULL
	);
	`
	_, err := db.Exec(query)
	if err != nil {
		log.Fatalf("Error creating videos table: %v\n", err)
	}
	log.Println("Video database initialized")
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Video Service is healthy"))
}

func getVideosHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, title, description, url FROM videos")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var videos []Video
	for rows.Next() {
		var v Video
		if err := rows.Scan(&v.ID, &v.Title, &v.Description, &v.URL); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		videos = append(videos, v)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(videos)
}

func getPresignedUploadUrlHandler(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.Query().Get("filename")
	if filename == "" {
		http.Error(w, "filename query parameter is required", http.StatusBadRequest)
		return
	}

	bucketName := "nexora-videos-raw"
	
	// Create bucket if it doesn't exist
	exists, err := minioClient.BucketExists(r.Context(), bucketName)
	if err == nil && !exists {
		minioClient.MakeBucket(r.Context(), bucketName, minio.MakeBucketOptions{})
	}

	// Generate presigned URL valid for 1 hour
	expiry := time.Second * 3600
	presignedURL, err := minioClient.PresignedPutObject(r.Context(), bucketName, filename, expiry)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to generate presigned URL: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"uploadUrl": presignedURL.String(),
		"filename":  filename,
	})
}

func uploadVideoHandler(w http.ResponseWriter, r *http.Request) {
	// In a real implementation, this would handle multipart form parsing,
	// uploading to MinIO, and saving metadata to PostgreSQL.
	w.WriteHeader(http.StatusNotImplemented)
	w.Write([]byte("Upload functionality not fully implemented yet"))
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
