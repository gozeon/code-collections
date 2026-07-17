use strict;
use warnings;
use utf8;
use Encode qw(decode encode);

# Keep standard Perl terminal prints clean
binmode( STDIN,  ":utf8" );
binmode( STDOUT, ":utf8" );
binmode( STDERR, ":utf8" );

use File::Basename;
use File::Spec;

# ==================== CONFIGURATION (USE FULL PATHS) ====================
my $AUDIO_DIR  = 'D:\\yt\\yt-dlp_win\\pre6';
my $OUTPUT_DIR = $AUDIO_DIR . '_out' ;
my $IMAGE_DIR  = 'D:\\yt\\yt-dlp_win';

# Target resolution for 9:16 vertical mobile playback (1080x1920)
my $WIDTH  = 1080;
my $HEIGHT = 1920;
# ========================================================================

# Clean and convert paths to absolute layout
$AUDIO_DIR  = File::Spec->rel2abs($AUDIO_DIR);
$IMAGE_DIR  = File::Spec->rel2abs($IMAGE_DIR);
$OUTPUT_DIR = File::Spec->rel2abs($OUTPUT_DIR);

# Create output directory if missing
if ( !-d $OUTPUT_DIR ) {
    mkdir $OUTPUT_DIR
      or die "Error: Cannot create output directory $OUTPUT_DIR: $!\n";
}

# Find the first available .webp file
my $search_pattern = File::Spec->catfile( $IMAGE_DIR, '*.jpg' );
my ($cover_img) = glob($search_pattern);

if ( !$cover_img ) {
    print "Warning: No .webp cover image found in: $IMAGE_DIR\n";
    print "The script will generate a solid black 9:16 background instead.\n\n";
}
else {
    # Decode raw local GBK string back to Perl internal Unicode structure
    $cover_img = decode( "gbk", $cover_img ) if $^O eq 'MSWin32';
    print "Using absolute cover image path: $cover_img\n\n";
}

# Supported audio extensions
my @extensions  = ( 'mp3', 'flac', 'webm', 'opus' );
my $total_files = 0;

foreach my $ext (@extensions) {

    # Scan for lowercase and uppercase extensions
    my @patterns = (
        File::Spec->catfile( $AUDIO_DIR, "*.$ext" ),
        File::Spec->catfile( $AUDIO_DIR, "*." . uc($ext) )
    );

    my @files;
    foreach my $pattern (@patterns) {
        push( @files, glob($pattern) );
    }

    # Deduplicate entries
    my %seen;
    @files = grep { !$seen{$_}++ } @files;

    foreach my $sys_path (@files) {
        next unless -e $sys_path;
        $total_files++;

        # Windows glob returns raw GBK bytes; decode it immediately
        my $audio_path = $^O eq 'MSWin32' ? decode( "gbk", $sys_path ) : $sys_path;

        # Extract just the filename without extension
        my ( $filename, $dir, $suffix ) = fileparse( $audio_path, qr/\.[^.]+/ );

        # Build absolute destination path for the MP4 video
        my $output_path = File::Spec->catfile( $OUTPUT_DIR, "${filename}.mp4" );
		next if -e $output_path;

        print "Processing: $filename\n";
        print " -> Input:  $audio_path\n";
        print " -> Output: $output_path\n\n";

        # CRITICAL FIX: Convert strings to standard Windows GBK bytes for the system string runner
        my $gbk_cover   = $cover_img   ? encode("gbk", $cover_img)   : "";
        my $gbk_audio   = encode("gbk", $audio_path);
        my $gbk_output  = encode("gbk", $output_path);
		
		# 存在就跳过
		next if -e $gbk_output;

        my $ffmpeg_cmd;

        if ($cover_img) {
            # Scale and pad the WebP image to exactly 9:16 layout
            my $video_filter = "scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2:black";

            # Wrap directly inside double-quotes cleanly without quotemeta
            $ffmpeg_cmd = sprintf(
                'ffmpeg -y -loop 1 -i "%s" -i "%s" -vf "%s" '
                  . '-c:v libx264 -tune stillimage -pix_fmt yuv420p '
                  . '-c:a aac -b:a 192k -shortest "%s"',
                $gbk_cover, $gbk_audio, $video_filter, $gbk_output
            );
        }
        else {
            # Fallback pure black screen if image is missing
            $ffmpeg_cmd = sprintf(
                'ffmpeg -y -f lavfi -i color=c=black:s=%dx%d:r=25 -i "%s" '
                  . '-c:v libx264 -tune stillimage -pix_fmt yuv420p '
                  . '-c:a aac -b:a 192k -shortest "%s"',
                $WIDTH, $HEIGHT, $gbk_audio, $gbk_output
            );
        }

        # Safely pass command string directly to local system runner
        system($ffmpeg_cmd);
    }
}

print "Batch processing complete. All $total_files files saved to: $OUTPUT_DIR\n";
