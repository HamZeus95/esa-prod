"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoProcessor = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
const sharp_1 = __importDefault(require("sharp"));
const os_1 = __importDefault(require("os"));
// Configure FFmpeg paths
const configureFFmpeg = () => {
    if (os_1.default.platform() === 'win32') {
        // Windows paths for FFmpeg installed via Winget
        const wingetPath = path_1.default.join(os_1.default.homedir(), 'AppData\\Local\\Microsoft\\Winget\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0-essentials_build\\bin');
        if ((0, fs_1.existsSync)(wingetPath)) {
            try {
                fluent_ffmpeg_1.default.setFfmpegPath(path_1.default.join(wingetPath, 'ffmpeg.exe'));
                fluent_ffmpeg_1.default.setFfprobePath(path_1.default.join(wingetPath, 'ffprobe.exe'));
                console.log('✅ FFmpeg paths configured for Windows');
            }
            catch (error) {
                console.warn('⚠️ Could not set FFmpeg paths, using system PATH');
            }
        }
    }
};
// Initialize FFmpeg configuration
configureFFmpeg();
class VideoProcessor {
    static getQualitySettings(quality) {
        const settings = {
            low: {
                videoBitrate: '500k',
                audioBitrate: '64k',
                maxWidth: 720,
                crf: 28
            },
            medium: {
                videoBitrate: '1000k',
                audioBitrate: '128k',
                maxWidth: 1080,
                crf: 23
            },
            high: {
                videoBitrate: '2000k',
                audioBitrate: '192k',
                maxWidth: 1920,
                crf: 18
            }
        };
        return settings[quality];
    }
    static async processVideo(options) {
        const { inputPath, outputDir, filename, quality = 'medium', generateThumbnail = true, formats = ['mp4', 'webm'] } = options;
        const baseFilename = path_1.default.parse(filename).name;
        const result = {};
        try {
            // Ensure output directory exists
            await promises_1.default.mkdir(outputDir, { recursive: true });
            // Get video metadata
            const metadata = await this.getVideoMetadata(inputPath);
            result.duration = metadata.duration;
            const qualitySettings = this.getQualitySettings(quality);
            // Process MP4 format
            if (formats.includes('mp4')) {
                const mp4Output = path_1.default.join(outputDir, `${baseFilename}.mp4`);
                await this.processToFormat(inputPath, mp4Output, 'mp4', qualitySettings);
                result.mp4 = `/uploads/${path_1.default.basename(mp4Output)}`;
                // Get file size
                const mp4Stats = await promises_1.default.stat(mp4Output);
                result.size = { ...result.size, mp4: mp4Stats.size };
            }
            // Process WebM format
            if (formats.includes('webm')) {
                const webmOutput = path_1.default.join(outputDir, `${baseFilename}.webm`);
                await this.processToFormat(inputPath, webmOutput, 'webm', qualitySettings);
                result.webm = `/uploads/${path_1.default.basename(webmOutput)}`;
                // Get file size
                const webmStats = await promises_1.default.stat(webmOutput);
                result.size = { ...result.size, webm: webmStats.size };
            }
            // Generate thumbnail
            if (generateThumbnail) {
                const thumbnailPath = await this.generateThumbnail(inputPath, outputDir, baseFilename);
                result.thumbnail = `/uploads/${path_1.default.basename(thumbnailPath)}`;
            }
            // Clean up original file if processing was successful
            await promises_1.default.unlink(inputPath);
            return result;
        }
        catch (error) {
            console.error('Video processing error:', error);
            throw new Error(`Failed to process video: ${error}`);
        }
    }
    static getVideoMetadata(inputPath) {
        return new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.ffprobe(inputPath, (err, metadata) => {
                if (err) {
                    reject(err);
                    return;
                }
                const duration = metadata?.format?.duration || 0;
                resolve({ duration });
            });
        });
    }
    static processToFormat(inputPath, outputPath, format, settings) {
        return new Promise((resolve, reject) => {
            let command = (0, fluent_ffmpeg_1.default)(inputPath)
                .videoBitrate(settings.videoBitrate)
                .audioBitrate(settings.audioBitrate)
                .addOption('-vf', `scale=${settings.maxWidth}:-2`);
            if (format === 'mp4') {
                command = command
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .addOption('-crf', settings.crf.toString())
                    .addOption('-preset', 'medium')
                    .addOption('-movflags', 'faststart'); // Enable progressive download
            }
            else if (format === 'webm') {
                command = command
                    .videoCodec('libvpx-vp9')
                    .audioCodec('libvorbis')
                    .addOption('-crf', settings.crf.toString())
                    .addOption('-b:v', '0'); // Variable bitrate
            }
            command
                .output(outputPath)
                .on('end', () => {
                console.log(`${format.toUpperCase()} processing complete: ${outputPath}`);
                resolve();
            })
                .on('error', (err) => {
                console.error(`${format.toUpperCase()} processing error:`, err);
                reject(err);
            })
                .on('progress', (progress) => {
                console.log(`${format.toUpperCase()} processing: ${Math.round(progress.percent || 0)}%`);
            })
                .run();
        });
    }
    static async generateThumbnail(inputPath, outputDir, baseFilename) {
        return new Promise((resolve, reject) => {
            const thumbnailPath = path_1.default.join(outputDir, `${baseFilename}-thumb.jpg`);
            (0, fluent_ffmpeg_1.default)(inputPath)
                .screenshot({
                timestamps: [2], // Capture at 2 seconds
                filename: path_1.default.basename(thumbnailPath),
                folder: outputDir,
                size: '1920x1080'
            })
                .on('end', async () => {
                try {
                    // Optimize the thumbnail with Sharp
                    await (0, sharp_1.default)(thumbnailPath)
                        .jpeg({
                        quality: 85,
                        progressive: true,
                        mozjpeg: true
                    })
                        .resize(1920, 1080, {
                        fit: 'cover',
                        position: 'center'
                    })
                        .toFile(thumbnailPath.replace('.jpg', '-optimized.jpg'));
                    // Replace original with optimized version
                    await promises_1.default.unlink(thumbnailPath);
                    await promises_1.default.rename(thumbnailPath.replace('.jpg', '-optimized.jpg'), thumbnailPath);
                    console.log('Thumbnail generated:', thumbnailPath);
                    resolve(thumbnailPath);
                }
                catch (error) {
                    console.error('Thumbnail optimization error:', error);
                    resolve(thumbnailPath); // Return original if optimization fails
                }
            })
                .on('error', (err) => {
                console.error('Thumbnail generation error:', err);
                reject(err);
            });
        });
    }
    static async cleanupFiles(filePaths) {
        for (const filePath of filePaths) {
            try {
                await promises_1.default.unlink(filePath);
                console.log('Cleaned up file:', filePath);
            }
            catch (error) {
                console.error('Cleanup error for', filePath, error);
            }
        }
    }
}
exports.VideoProcessor = VideoProcessor;
exports.default = VideoProcessor;
//# sourceMappingURL=videoProcessor.js.map