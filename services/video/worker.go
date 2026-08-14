package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// FFmpeg resolution profiles
var profiles = []struct {
	Resolution string
	Bitrate    string
	Height     int
}{
	{"1080p", "5000k", 1080},
	{"720p", "2800k", 720},
	{"480p", "1400k", 480},
	{"360p", "800k", 360},
}

func StartVideoProcessingWorker() {
	log.Println("Video processing worker started. Listening for tasks...")
	
	// Mock polling loop
	for {
		// In a real scenario, this would pull a message from Redis or RabbitMQ
		// and download the source video from MinIO.
		time.Sleep(30 * time.Second)
	}
}

// ProcessVideo transcodes the given source file into HLS format with multiple resolutions.
func ProcessVideo(sourcePath, outputDir, videoID string) error {
	log.Printf("Starting processing for video %s\n", videoID)

	// Ensure output directory exists
	err := os.MkdirAll(outputDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create output dir: %w", err)
	}

	// 1. Generate individual HLS streams for each resolution
	for _, profile := range profiles {
		err := generateHLSVariant(sourcePath, outputDir, videoID, profile.Resolution, profile.Bitrate, profile.Height)
		if err != nil {
			log.Printf("Error generating %s variant: %v\n", profile.Resolution, err)
			return err
		}
	}

	// 2. Generate Master Playlist
	err = generateMasterPlaylist(outputDir, videoID)
	if err != nil {
		return fmt.Errorf("failed to generate master playlist: %w", err)
	}

	log.Printf("Successfully processed video %s\n", videoID)
	// In a real scenario, upload the contents of outputDir to MinIO CDN bucket here
	return nil
}

func generateHLSVariant(sourcePath, outputDir, videoID, resolution, bitrate string, height int) error {
	variantPlaylist := filepath.Join(outputDir, fmt.Sprintf("%s_%s.m3u8", videoID, resolution))
	segmentPattern := filepath.Join(outputDir, fmt.Sprintf("%s_%s_%%03d.ts", videoID, resolution))

	scaleFilter := fmt.Sprintf("scale=-2:%d", height)

	cmd := exec.Command("ffmpeg",
		"-i", sourcePath,
		"-vf", scaleFilter,
		"-c:v", "libx264",
		"-b:v", bitrate,
		"-c:a", "aac",
		"-b:a", "128k",
		"-f", "hls",
		"-hls_time", "4",
		"-hls_playlist_type", "vod",
		"-hls_segment_filename", segmentPattern,
		variantPlaylist,
	)

	// In a production environment, you would want to capture stdout/stderr for logging
	log.Printf("Running FFmpeg for %s...\n", resolution)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("ffmpeg error for %s: %w", resolution, err)
	}
	return nil
}

func generateMasterPlaylist(outputDir, videoID string) error {
	masterPlaylistPath := filepath.Join(outputDir, fmt.Sprintf("%s_master.m3u8", videoID))
	file, err := os.Create(masterPlaylistPath)
	if err != nil {
		return err
	}
	defer file.Close()

	file.WriteString("#EXTM3U\n")
	file.WriteString("#EXT-X-VERSION:3\n")

	// Bandwidth mapping approximate based on video + audio bitrate
	bandwidths := map[string]int{
		"1080p": 5000000 + 128000,
		"720p":  2800000 + 128000,
		"480p":  1400000 + 128000,
		"360p":  800000 + 128000,
	}
	
	heights := map[string]int{
		"1080p": 1080,
		"720p":  720,
		"480p":  480,
		"360p":  360,
	}

	for _, profile := range profiles {
		res := profile.Resolution
		bw := bandwidths[res]
		h := heights[res]
		file.WriteString(fmt.Sprintf("#EXT-X-STREAM-INF:BANDWIDTH=%d,RESOLUTION=%dx%d\n", bw, (h*16)/9, h))
		file.WriteString(fmt.Sprintf("%s_%s.m3u8\n", videoID, res))
	}

	log.Printf("Generated master playlist at %s\n", masterPlaylistPath)
	return nil
}
